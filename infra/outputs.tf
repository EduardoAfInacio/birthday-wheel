output "ec2_public_ip" {
  value = aws_instance.backend.public_ip
}

output "rds_endpoint" {
  value = aws_db_instance.postgres.endpoint
}

output "amplify_app_url" {
  value = aws_amplify_branch.main.branch_name
}

output "ssh_command" {
  value = "ssh -i birthday-wheel-key.pem ubuntu@${aws_instance.backend.public_ip}"
}