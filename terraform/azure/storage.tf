resource "azurerm_storage_account" "secure" {
  name                     = "securestorageacct"
  resource_group_name      = "my-resource-group"
  location                 = "East US"
  account_tier             = "Standard"
  account_replication_type = "LRS"

  enable_https_traffic_only = true
  min_tls_version            = "TLS1_3"
}
