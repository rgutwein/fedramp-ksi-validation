package compliance

default allow = false

allow {
    input.fips_encryption_enabled == true
    input.mfa_enabled == true
    input.tls_version >= 1.3
    input.backup_encryption_enabled == true
    input.cmek_enabled == true
    input.unified_access_policy == true
}
