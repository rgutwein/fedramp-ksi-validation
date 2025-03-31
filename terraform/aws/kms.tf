resource "aws_kms_key" "fips_compliant" {
  description              = "FedRAMP-compliant KMS Key"
  enable_key_rotation      = true
  customer_master_key_spec = "SYMMETRIC_DEFAULT"
  key_usage                = "ENCRYPT_DECRYPT"
  policy                   = file("./configs/kms-policy.json")
}
