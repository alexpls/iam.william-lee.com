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
    }
  ]
}
EOF
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
