resource "aws_s3_bucket" "website" {
  bucket = "${var.host_name}"
  acl = "public-read"

  tags = {
    project = "${var.project_name}"
  }

  website {
    index_document = "index.html"
    error_document = "404.html"
  }

  policy = <<EOF
{
  "Version": "2008-10-17",
  "Statement": [
    {
      "Sid": "PublicReadForGetBucketObjects",
      "Effect": "Allow",
      "Principal": {
        "AWS": "*"
      },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::${var.host_name}/*"
    }
  ]
}
EOF
}

resource "aws_s3_bucket" "website_redirect" {
  bucket = "www.${var.host_name}"

  tags = {
    project = "${var.project_name}"
  }

  acl = "public-read"
  policy = <<EOF
{
  "Version": "2008-10-17",
  "Statement": [
    {
      "Sid": "PublicReadForGetBucketObjects",
      "Effect": "Allow",
      "Principal": {
        "AWS": "*"
      },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::www.${var.host_name}/*"
    }
  ]
}
EOF

  website {
    redirect_all_requests_to = "https://${var.host_name}"
  }
}

resource "aws_iam_user" "deploy_user" {
  name = "${var.project_name}-website-deployer"

  tags = {
    project = "${var.project_name}"
  }
}

resource "aws_iam_access_key" "deploy_user" {
  user = "${aws_iam_user.deploy_user.name}"
}

resource "aws_iam_user_policy" "policy" {
  name = "deploy-website"
  user = "${aws_iam_user.deploy_user.name}"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "s3:ListAllMyBuckets"
      ],
      "Effect": "Allow",
      "Resource": "arn:aws:s3:::*"
    },
    {
      "Action": [
        "s3:ListBucket",
        "s3:PutObject",
        "s3:PutObjectAcl"
      ],
      "Effect": "Allow",
      "Resource": "arn:aws:s3:::${var.host_name}/*"
    },
    {
      "Action": [
        "cloudfront:CreateInvalidation"
      ],
      "Effect": "Allow",
      "Resource": "*"
    }
  ]
}
EOF
}

resource "aws_cloudfront_distribution" "website_cdn" {
  enabled = true
  price_class = "PriceClass_All"

  tags = {
    project = "${var.project_name}"
  }

  origin {
    origin_id = "origin-bucket-${aws_s3_bucket.website.id}"
    domain_name = "${aws_s3_bucket.website.website_endpoint}"

    custom_origin_config {
      origin_protocol_policy = "http-only"
      http_port              = "80"
      https_port             = "443"
      origin_ssl_protocols   = ["TLSv1"]
    }
  }

  default_root_object = "index.html"

  default_cache_behavior {
    allowed_methods = ["GET", "HEAD"]
    cached_methods  = ["GET", "HEAD"]

    forwarded_values {
      query_string = true

      cookies {
        forward = "none"
      }
    }

    min_ttl          = "0"
    default_ttl      = "300"
    max_ttl          = "1200"
    target_origin_id = "origin-bucket-${aws_s3_bucket.website.id}"
    viewer_protocol_policy = "redirect-to-https"
    compress               = true
  }

  viewer_certificate {
    acm_certificate_arn      = "${aws_acm_certificate.cert.arn}"
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  aliases = ["${var.host_name}"]

  wait_for_deployment = false
}

resource "aws_cloudfront_distribution" "website_redirect_cdn" {
  enabled = true
  price_class = "PriceClass_All"

  tags = {
    project = "${var.project_name}"
  }

  origin {
    origin_id = "origin-bucket-${aws_s3_bucket.website_redirect.id}"
    domain_name = "${aws_s3_bucket.website_redirect.website_endpoint}"

    custom_origin_config {
      origin_protocol_policy = "http-only"
      http_port              = "80"
      https_port             = "443"
      origin_ssl_protocols   = ["TLSv1"]
    }
  }

  default_root_object = "index.html"

  default_cache_behavior {
    allowed_methods = ["GET", "HEAD"]
    cached_methods  = ["GET", "HEAD"]

    forwarded_values {
      query_string = true

      cookies {
        forward = "none"
      }
    }

    min_ttl          = "0"
    default_ttl      = "300"
    max_ttl          = "1200"
    target_origin_id = "origin-bucket-${aws_s3_bucket.website_redirect.id}"
    viewer_protocol_policy = "redirect-to-https"
    compress               = true
  }

  viewer_certificate {
    acm_certificate_arn      = "${aws_acm_certificate.cert_www.arn}"
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  aliases = ["www.${var.host_name}"]

  wait_for_deployment = false
}

output "website_bucket_name" {
  value = "${aws_s3_bucket.website.bucket}"
}

output "deployer_access_key" {
  value = "${aws_iam_access_key.deploy_user.id}"
}

output "deployer_secret_key" {
  value = "${aws_iam_access_key.deploy_user.secret}"
}
