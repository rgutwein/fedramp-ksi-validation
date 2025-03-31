import os

def check_tls():
    tls_version = os.getenv('AZURE_STORAGE_TLS_VERSION', 'TLS1_0')
    if tls_version != 'TLS1_3':
        print("Storage Account is not using TLS 1.3")
    else:
        print("Storage Account is using TLS 1.3")

if __name__ == "__main__":
    check_tls()
