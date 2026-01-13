variable "aws_region" {
  default = "us-east-1"
}

variable "project_name" {
  default = "birthday-wheel"
}

variable "db_password" {
  description = "RDS password"
  sensitive = true
}

variable "github_token" {
  description = "Personal Access Token from GitHub used by Amplify"
  sensitive   = true
}

variable "github_repo" {
  description = "Repository URL (ex: https://github.com/usuario/repo)"
}

variable "domain_name" {
  description = "Backend domain name (ex: api.mywebsite.com). If it does not exist, leave it empty."
  default     = ""
}