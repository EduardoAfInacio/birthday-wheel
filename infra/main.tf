terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket         = "birthday-wheel-tfstate-eduardo"
    key            = "prod/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "birthday-wheel-tf-locks"
    encrypt        = true
  }
}

provider "aws" {
  region = var.aws_region
}

resource "aws_security_group" "backend_sg" {
  name        = "${var.project_name}-backend-sg"
  description = "Allows HTTP, HTTPS and SSH"

  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # In live, restrict to a machine`s IP!
  }

  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTPS"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  #can`t afford NAT, so egress open
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "db_sg" {
  name        = "${var.project_name}-db-sg"
  description = "Allows access only from our EC2"

  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.backend_sg.id] # Only EC2 can access
  }
}

resource "tls_private_key" "pk" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

resource "aws_key_pair" "kp" {
  key_name   = "${var.project_name}-key"
  public_key = tls_private_key.pk.public_key_openssh
}

resource "local_file" "ssh_key" {
  filename        = "${aws_key_pair.kp.key_name}.pem"
  content         = tls_private_key.pk.private_key_pem
  file_permission = "0400"
}

resource "aws_db_instance" "postgres" {
  identifier             = "${var.project_name}-db"
  db_name                = "birthday_wheel"
  engine                 = "postgres"
  engine_version         = "16.3"
  instance_class         = "db.t3.micro"
  allocated_storage      = 20
  storage_type           = "gp2"
  username               = "postgres"
  password               = var.db_password
  parameter_group_name   = "default.postgres16"
  skip_final_snapshot    = true
  publicly_accessible    = false
  vpc_security_group_ids = [aws_security_group.db_sg.id]
}

data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"]

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd-gp3/ubuntu-noble-24.04-amd64-server-*"]
  }
}

resource "aws_instance" "backend" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = "t3.micro"
  key_name      = aws_key_pair.kp.key_name

  vpc_security_group_ids = [aws_security_group.backend_sg.id]

  root_block_device {
    volume_size = 20
    volume_type = "gp3"
    delete_on_termination = true
  }

  user_data = templatefile("user_data.sh", {
    git_repo_url = var.github_repo
    db_password  = var.db_password
    db_endpoint  = aws_db_instance.postgres.endpoint
    domain_name  = var.domain_name
  })

  depends_on = [aws_db_instance.postgres]

  tags = {
    Name = "${var.project_name}-backend"
  }
}

resource "aws_iam_role" "amplify_role" {
  name = "${var.project_name}-amplify-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "amplify.amazonaws.com"
        }
        Action = "sts:AssumeRole"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "amplify_role_attach" {
  role       = aws_iam_role.amplify_role.name
  policy_arn = "arn:aws:iam::aws:policy/AdministratorAccess-Amplify"
}

resource "aws_amplify_app" "frontend" {
  name         = "${var.project_name}-frontend"
  repository   = var.github_repo
  access_token = var.github_token

  platform             = "WEB_COMPUTE" 
  iam_service_role_arn = aws_iam_role.amplify_role.arn

  build_spec = <<-EOT
      version: 1
      applications:
        - appRoot: frontend
          frontend:
            phases:
              preBuild:
                commands:
                  - npm ci
              build:
                commands:
                  - npm run build
            artifacts:
              baseDirectory: .next
              files:
                - '**/*'
            cache:
              paths:
                - node_modules/**/*
    EOT

  environment_variables = {
    AMPLIFY_MONOREPO_APP_ROOT = "frontend"
    NEXT_PUBLIC_API_URL = "https://${var.domain_name}"
  }
}

resource "aws_amplify_branch" "main" {
  app_id      = aws_amplify_app.frontend.id
  branch_name = "main"
  framework   = "Next.js - SSR"
  stage       = "PRODUCTION"
}