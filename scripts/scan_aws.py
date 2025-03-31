import boto3

def check_fips_compliance():
    kms = boto3.client('kms')
    keys = kms.list_keys()
    for key in keys['Keys']:
        key_metadata = kms.describe_key(KeyId=key['KeyId'])
        if key_metadata['KeyMetadata']['KeyUsage'] != 'ENCRYPT_DECRYPT':
            print(f"Key {key['KeyId']} is not compliant!")
        else:
            print(f"Key {key['KeyId']} is FIPS compliant.")

if __name__ == "__main__":
    check_fips_compliance()
