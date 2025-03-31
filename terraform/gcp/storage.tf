resource "google_storage_bucket" "secure_bucket" {
  name     = "fedramp-secure-bucket"
  location = "US"

  force_destroy = true

  uniform_bucket_level_access = true

  encryption {
    default_kms_key_name = "projects/my-project/locations/global/keyRings/my-kr/cryptoKeys/my-key"
  }
}
