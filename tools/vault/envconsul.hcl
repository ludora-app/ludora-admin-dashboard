vault {
  address = "http://51.91.78.100:8200"
  ssl {
    enabled = true
    verify  = true
  }
}

secret {
  path      = "secret/ludora/admin-dashboard/localhost"
  no_prefix = true
}
