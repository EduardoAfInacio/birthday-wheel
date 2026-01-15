variable "aws_region" {
  default = "us-east-1"
}

variable "project_name" {
  default = "birthday-wheel"
}

variable "db_password" {
  description = "RDS password"
  sensitive   = true
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

variable "mail_host" {
  description = "SMTP Host (ex: email-smtp.us-east-1.amazonaws.com)"
  type        = string
  default     = "email-smtp.us-east-1.amazonaws.com"
}

variable "mail_user" {
  description = "SMTP Username do SES"
  type        = string
  sensitive   = true
}

variable "mail_pass" {
  description = "SMTP Password do SES"
  type        = string
  sensitive   = true
}

variable "mail_from" {
  description = "Verified sender"
  type        = string
  default     = "noreply@eduafinacio.online"
}