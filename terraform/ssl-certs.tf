resource "aws_acm_certificate" "cert" {
  provider = "aws.us-east-1"
  domain_name       = "${var.host_name}"
  validation_method = "DNS"

  tags = {
    name = "${var.host_name} website"
    project = "${var.project_name}"
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_acm_certificate" "cert_www" {
  provider = "aws.us-east-1"
  domain_name       = "www.${var.host_name}"
  validation_method = "DNS"

  tags = {
    name = "www.${var.host_name} website"
    project = "${var.project_name}"
  }

  lifecycle {
    create_before_destroy = true
  }
}
