/**
 * Validation utilities for KSIs
 * Contains commands, configurations, and checks to validate KSI implementations
 * Organized by KSI ID with platform-specific validation guidance
 */

// Validation commands and configs for each KSI
const ksiValidationGuides = {
  'KSI-001': {
    title: 'FIPS-validated encryption enabled',
    description: 'Commands and configurations to verify FIPS-validated encryption',
    aws: [
      {
        type: 'command',
        description: 'Check if FIPS endpoint is configured for S3',
        value: 'aws configure get s3.use_fips_endpoint'
      },
      {
        type: 'command',
        description: 'Check if FIPS mode is enabled in AWS CLI configuration',
        value: 'grep -r "fips_mode = true" ~/.aws/'
      },
      {
        type: 'config',
        description: 'AWS CLI configuration for FIPS endpoints',
        value: `# Add to ~/.aws/config
[default]
s3 = 
    use_fips_endpoint = true
    use_dualstack_endpoint = true`
      },
      {
        type: 'command',
        description: 'Verify KMS is using FIPS validated modules',
        value: 'aws kms list-keys --region us-east-1 --endpoint-url https://kms-fips.us-east-1.amazonaws.com'
      }
    ],
    azure: [
      {
        type: 'command',
        description: 'Check if storage account requires secure transfer (enforces TLS)',
        value: 'az storage account show --name <storage-account-name> --resource-group <resource-group> --query enableHttpsTrafficOnly'
      },
      {
        type: 'command',
        description: 'Check if Azure FIPS compliant TLS is enabled',
        value: 'az vm show --resource-group <resource-group> --name <vm-name> --query "storageProfile.osDisk.osType"'
      },
      {
        type: 'config',
        description: 'Azure Policy for FIPS compliance',
        value: `{
  "properties": {
    "displayName": "Audit VMs that do not use FIPS-enabled encryption",
    "policyType": "BuiltIn",
    "mode": "All",
    "description": "This policy audits VMs that do not use FIPS-enabled encryption",
    "parameters": {},
    "policyRule": {
      "if": {
        "allOf": [
          {
            "field": "type",
            "equals": "Microsoft.Compute/virtualMachines"
          },
          {
            "field": "Microsoft.Compute/virtualMachines/securityProfile.securityType",
            "notEquals": "TrustedLaunch"
          }
        ]
      },
      "then": {
        "effect": "audit"
      }
    }
  }
}`
      }
    ],
    gcp: [
      {
        type: 'command',
        description: 'Check if Cloud KMS keys are using FIPS 140-2 validated modules',
        value: 'gcloud kms keys list --keyring=<keyring-name> --location=<location> --filter="PRIMARY_STATE=ENABLED" --format="table(name,purpose,algorithm)"'
      },
      {
        type: 'command',
        description: 'Verify CMEK (Customer Managed Encryption Keys) usage for Cloud Storage',
        value: 'gcloud storage buckets describe gs://<bucket-name> --format="json(encryption)"'
      }
    ]
  },
  'KSI-002': {
    title: 'MFA enabled for all users',
    description: 'Commands and configurations to verify MFA is properly configured',
    aws: [
      {
        type: 'command',
        description: 'List IAM users without MFA enabled',
        value: 'aws iam list-users --query "Users[?UserName != null].[UserName, MFADevices.length]" --output text | grep "\\t0$"'
      },
      {
        type: 'command',
        description: 'Check if MFA delete is enabled on S3 buckets',
        value: 'aws s3api get-bucket-versioning --bucket <bucket-name> | grep MfaDelete'
      },
      {
        type: 'config',
        description: 'IAM policy to enforce MFA',
        value: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "BlockMostAccessUnlessSignedInWithMFA",
      "Effect": "Deny",
      "NotAction": [
        "iam:CreateVirtualMFADevice",
        "iam:EnableMFADevice",
        "iam:ListMFADevices",
        "iam:ListVirtualMFADevices",
        "iam:ResyncMFADevice",
        "sts:GetSessionToken"
      ],
      "Resource": "*",
      "Condition": {
        "BoolIfExists": {
          "aws:MultiFactorAuthPresent": "false"
        }
      }
    }
  ]
}`
      }
    ],
    azure: [
      {
        type: 'command',
        description: 'Check which users have MFA enabled',
        value: 'az ad user list --query "[].{UPN:userPrincipalName, MFA:strongAuthenticationDetail.methods[0].methodType}" -o table'
      },
      {
        type: 'command',
        description: 'Get Conditional Access Policies requiring MFA',
        value: 'az ad conditional-access policy list --query "[?grantControls.builtInControls[?contains(@, \'mfa\')]]"'
      },
      {
        type: 'config',
        description: 'Azure Conditional Access Policy for MFA',
        value: `{
  "displayName": "Require MFA for all users",
  "state": "enabledForReportingButNotEnforced",
  "conditions": {
    "userRiskLevels": [],
    "signInRiskLevels": [],
    "clientAppTypes": [
      "all"
    ],
    "platforms": null,
    "locations": null,
    "applications": {
      "includeApplications": [
        "All"
      ],
      "excludeApplications": [],
      "includeUserActions": []
    },
    "users": {
      "includeUsers": [
        "All"
      ],
      "excludeUsers": [],
      "includeGroups": [],
      "excludeGroups": []
    }
  },
  "grantControls": {
    "operator": "OR",
    "builtInControls": [
      "mfa"
    ],
    "customAuthenticationFactors": [],
    "termsOfUse": []
  }
}`
      }
    ],
    gcp: [
      {
        type: 'command',
        description: 'Check which users have 2-step verification enabled',
        value: 'gcloud beta identity-platform tenants list-users --tenant=<tenant-id> --format="table(localId,displayName,email,phoneNumber,mfaInfo)"'
      },
      {
        type: 'command',
        description: 'Verify 2-step verification enforcement at organization level',
        value: 'gcloud organizations get-iam-policy <organization-id>'
      }
    ]
  },
  'KSI-003': {
    title: 'TLS 1.2+ for all communications',
    description: 'Commands and configurations to verify TLS 1.2+ is enforced',
    aws: [
      {
        type: 'command',
        description: 'Check ELB listener SSL policies (confirm TLS 1.2+)',
        value: 'aws elb describe-load-balancers | grep -A 3 ListenerDescriptions'
      },
      {
        type: 'command',
        description: 'Check CloudFront distribution TLS version',
        value: 'aws cloudfront get-distribution-config --id <distribution-id> | grep -A 10 ViewerCertificate'
      },
      {
        type: 'command',
        description: 'Test TLS version with OpenSSL',
        value: 'openssl s_client -connect <domain>:443 -tls1_2'
      }
    ],
    azure: [
      {
        type: 'command',
        description: 'Check App Service TLS settings',
        value: 'az webapp config show --name <app-name> --resource-group <resource-group> --query "[minTlsVersion, httpsOnly]"'
      },
      {
        type: 'command',
        description: 'Check Front Door TLS policy',
        value: 'az network front-door show --name <frontdoor-name> --resource-group <resource-group> --query "frontendEndpoints[].webApplicationFirewallPolicyLink"'
      },
      {
        type: 'config',
        description: 'Azure Front Door Configuration for minimum TLS 1.2',
        value: `az network front-door update \\
  --name <frontdoor-name> \\
  --resource-group <resource-group> \\
  --set frontendEndpoints[0].properties.minimumTlsVersion=1.2`
      }
    ],
    gcp: [
      {
        type: 'command',
        description: 'Check Cloud Load Balancer SSL policy',
        value: 'gcloud compute ssl-policies describe <policy-name>'
      },
      {
        type: 'command',
        description: 'Create SSL policy with minimum TLS 1.2',
        value: 'gcloud compute ssl-policies create <policy-name> --profile MODERN --min-tls-version 1.2'
      }
    ]
  },
  'KSI-004': {
    title: 'Customer data encryption',
    description: 'Commands and configurations to verify data encryption',
    aws: [
      {
        type: 'command',
        description: 'Check if S3 buckets have default encryption enabled',
        value: 'aws s3api get-bucket-encryption --bucket <bucket-name>'
      },
      {
        type: 'command',
        description: 'Check if EBS volumes are encrypted',
        value: 'aws ec2 describe-volumes --query "Volumes[?not_null(Encrypted)].{ID:VolumeId,Encrypted:Encrypted,Type:VolumeType}" --output table'
      },
      {
        type: 'command',
        description: 'Check RDS instance encryption',
        value: 'aws rds describe-db-instances --query "DBInstances[*].[DBInstanceIdentifier,StorageEncrypted]" --output table'
      }
    ],
    azure: [
      {
        type: 'command',
        description: 'Check storage account encryption',
        value: 'az storage account show --name <storage-account-name> --resource-group <resource-group> --query "encryption"'
      },
      {
        type: 'command',
        description: 'Check SQL database transparent data encryption',
        value: 'az sql db tde show --resource-group <resource-group> --server <server-name> --database <database-name>'
      },
      {
        type: 'command',
        description: 'Check VM disk encryption',
        value: 'az vm encryption show --name <vm-name> --resource-group <resource-group>'
      }
    ],
    gcp: [
      {
        type: 'command',
        description: 'Check if Cloud Storage buckets have default encryption',
        value: 'gcloud storage buckets describe gs://<bucket-name> --format="json(encryption)"'
      },
      {
        type: 'command',
        description: 'Check if Persistent Disks are encrypted with CMEK',
        value: 'gcloud compute disks list --filter="kmsKeyServiceAccount:*" --format="table(name,type,size_gb,kmsKey.keyName)"'
      }
    ]
  },
  'KSI-007': {
    title: 'Patch management',
    description: 'Commands and configurations to verify patch management',
    aws: [
      {
        type: 'command',
        description: 'Check AWS Systems Manager Patch Manager compliance',
        value: 'aws ssm list-compliance-summaries'
      },
      {
        type: 'command',
        description: 'Check patch baselines',
        value: 'aws ssm describe-patch-baselines'
      },
      {
        type: 'command',
        description: 'Check patch groups',
        value: 'aws ssm describe-patch-groups'
      }
    ],
    azure: [
      {
        type: 'command',
        description: 'Check VM patching status with Update Management',
        value: 'az vm show -g <resource-group> -n <vm-name> --query "provisioningState"'
      },
      {
        type: 'command',
        description: 'View Automation Account for patching',
        value: 'az automation account list -g <resource-group>'
      }
    ],
    gcp: [
      {
        type: 'command',
        description: 'Check OS patch management using OS Config',
        value: 'gcloud compute os-config patch-jobs list'
      },
      {
        type: 'command',
        description: 'View OS patch deployment',
        value: 'gcloud beta compute os-config patch-deployments list'
      }
    ],
    linux: [
      {
        type: 'command',
        description: 'Check installed security updates on Linux',
        value: 'yum updateinfo summary | grep security'
      },
      {
        type: 'command',
        description: 'Check available security updates on Ubuntu',
        value: 'apt list --upgradable | grep security'
      }
    ]
  },
  'KSI-008': {
    title: 'Audit logging enabled',
    description: 'Commands and configurations to verify audit logging',
    aws: [
      {
        type: 'command',
        description: 'Check if CloudTrail is enabled',
        value: 'aws cloudtrail describe-trails'
      },
      {
        type: 'command',
        description: 'Verify CloudTrail is logging to CloudWatch Logs',
        value: 'aws cloudtrail describe-trails --query "trailList[*].CloudWatchLogsLogGroupArn"'
      },
      {
        type: 'command',
        description: 'Check S3 bucket access logging',
        value: 'aws s3api get-bucket-logging --bucket <bucket-name>'
      },
      {
        type: 'command',
        description: 'Verify VPC Flow Logs',
        value: 'aws ec2 describe-flow-logs'
      }
    ],
    azure: [
      {
        type: 'command',
        description: 'Check Azure Activity Log settings',
        value: 'az monitor diagnostic-settings list --resource <resource-id>'
      },
      {
        type: 'command',
        description: 'Check Log Analytics workspace',
        value: 'az monitor log-analytics workspace list --resource-group <resource-group>'
      },
      {
        type: 'command',
        description: 'Check Storage Account logging',
        value: 'az storage logging show --account-name <storage-account-name>'
      }
    ],
    gcp: [
      {
        type: 'command',
        description: 'Check Cloud Audit Logs configuration',
        value: 'gcloud logging sinks list'
      },
      {
        type: 'command',
        description: 'Verify Data Access logs are enabled',
        value: 'gcloud logging read "logName:data_access" --limit 10'
      },
      {
        type: 'command',
        description: 'Check Cloud Storage bucket logging',
        value: 'gsutil logging get gs://<bucket-name>'
      }
    ],
    linux: [
      {
        type: 'command',
        description: 'Check auditd status',
        value: 'systemctl status auditd'
      },
      {
        type: 'command',
        description: 'Check audit rules',
        value: 'auditctl -l'
      },
      {
        type: 'config',
        description: 'Recommended auditd rules for baseline auditing',
        value: `# File integrity monitoring
-w /etc/passwd -p wa -k identity
-w /etc/group -p wa -k identity
-w /etc/shadow -p wa -k identity
-w /etc/sudoers -p wa -k identity

# Monitor for unauthorized access attempts
-a always,exit -F arch=b64 -S open -F dir=/etc -F success=0 -k access
-a always,exit -F arch=b64 -S open -F dir=/usr/bin -F success=0 -k access

# Track privileged command execution
-a always,exit -F path=/usr/bin/sudo -F perm=x -F auid>=1000 -F auid!=4294967295 -k privileged
-a always,exit -F path=/usr/bin/su -F perm=x -F auid>=1000 -F auid!=4294967295 -k privileged`
      }
    ]
  },
  'KSI-015': {
    title: 'System hardening',
    description: 'Commands and configurations to verify system hardening',
    linux: [
      {
        type: 'command',
        description: 'Check if AIDE (Advanced Intrusion Detection Environment) is installed',
        value: 'rpm -q aide || dpkg -l | grep aide'
      },
      {
        type: 'command',
        description: 'Check AIDE database status',
        value: 'aide --check'
      },
      {
        type: 'command',
        description: 'Run system security check with Lynis',
        value: 'lynis audit system'
      },
      {
        type: 'command',
        description: 'Check CIS benchmarks compliance with OpenSCAP',
        value: 'oscap xccdf eval --profile xccdf_org.ssgproject.content_profile_cis /usr/share/xml/scap/ssg/content/ssg-rhel8-ds.xml'
      },
      {
        type: 'config',
        description: 'Basic AIDE configuration for integrity checking',
        value: `# /etc/aide.conf
# Basic configuration for AIDE
database=file:/var/lib/aide/aide.db
database_out=file:/var/lib/aide/aide.db.new
gzip_dbout=yes

# Monitoring rules
Binlib = p+i+n+u+g+s+b+m+c+sha256
Logs = p+i+n+u+g+S
Etc = p+i+n+u+g+sha256

# Directories to monitor
/bin Binlib
/sbin Binlib
/usr/bin Binlib
/usr/sbin Binlib
/etc Etc
/boot Binlib
/lib Binlib
/lib64 Binlib`
      }
    ],
    aws: [
      {
        type: 'command',
        description: 'Check EC2 instances for compliance issues with Config',
        value: 'aws configservice describe-compliance-by-config-rule --config-rule-names instance-security-group-attached'
      },
      {
        type: 'command',
        description: 'Check Security Hub security standards compliance',
        value: 'aws securityhub get-findings --filters \'{"RecordState":[{"Comparison":"EQUALS","Value":"ACTIVE"}],"WorkflowStatus":[{"Comparison":"EQUALS","Value":"NEW"}]}\''
      },
      {
        type: 'command',
        description: 'Check Inspector assessment results',
        value: 'aws inspector list-findings --assessment-run-arns <assessment-run-arn>'
      }
    ],
    azure: [
      {
        type: 'command',
        description: 'Check Security Center recommendations',
        value: 'az security assessment list --resource-group <resource-group>'
      },
      {
        type: 'command',
        description: 'Check VM vulnerability assessment',
        value: 'az vm show -n <vm-name> -g <resource-group> --query "securityProfile"'
      }
    ],
    gcp: [
      {
        type: 'command',
        description: 'Check Security Command Center findings',
        value: 'gcloud scc findings list --organization=<organization-id> --filter="state=ACTIVE"'
      },
      {
        type: 'command',
        description: 'View Security Health Analytics results',
        value: 'gcloud scc findings list --source=<source-id> --organization=<organization-id>'
      }
    ]
  },
  'KSI-026': {
    title: 'Container security controls',
    description: 'Commands and configurations to verify container security',
    aws: [
      {
        type: 'command',
        description: 'Check container image scan results in ECR',
        value: 'aws ecr describe-image-scan-findings --repository-name <repository-name> --image-id imageTag=<tag>'
      },
      {
        type: 'command',
        description: 'Check EKS security groups',
        value: 'aws eks describe-cluster --name <cluster-name> --query "cluster.resourcesVpcConfig.securityGroupIds"'
      },
      {
        type: 'command',
        description: 'Check EKS logging is enabled',
        value: 'aws eks describe-cluster --name <cluster-name> --query "cluster.logging"'
      }
    ],
    azure: [
      {
        type: 'command',
        description: 'Check AKS security controls',
        value: 'az aks show --name <aks-name> --resource-group <resource-group> --query "networkProfile"'
      },
      {
        type: 'command',
        description: 'Check Container Registry scanning status',
        value: 'az acr check-health -n <registry-name>'
      },
      {
        type: 'command',
        description: 'Check AKS Master authorized IP ranges',
        value: 'az aks show --name <aks-name> --resource-group <resource-group> --query "apiServerAccessProfile"'
      }
    ],
    gcp: [
      {
        type: 'command',
        description: 'Check GKE security controls',
        value: 'gcloud container clusters describe <cluster-name> --format="json(privateClusterConfig, masterAuthorizedNetworksConfig, binaryAuthorization)"'
      },
      {
        type: 'command',
        description: 'Check Container Registry vulnerability scanning',
        value: 'gcloud artifacts docker images list <repository-location>/<project-id>/<repository> --include-tags'
      },
      {
        type: 'command',
        description: 'Check Binary Authorization policy',
        value: 'gcloud container binauthz policy export'
      }
    ],
    docker: [
      {
        type: 'command',
        description: 'Check Docker security configuration',
        value: 'docker info --format \'{{json .SecurityOptions}}\''
      },
      {
        type: 'command',
        description: 'Scan container image for vulnerabilities with Trivy',
        value: 'trivy image <image-name>:<tag>'
      },
      {
        type: 'command',
        description: 'Run Docker Bench for Security',
        value: 'docker run --rm -v /var:/var -v /usr/bin/docker:/usr/bin/docker -v /etc:/etc -v /var/run/docker.sock:/var/run/docker.sock docker/docker-bench-security'
      }
    ],
    kubernetes: [
      {
        type: 'command',
        description: 'Check Pod Security Policies',
        value: 'kubectl get psp'
      },
      {
        type: 'command',
        description: 'Check RBAC permissions',
        value: 'kubectl get clusterroles,clusterrolebindings'
      },
      {
        type: 'command',
        description: 'Audit Kubernetes with kube-bench',
        value: 'kubectl run kube-bench --image=aquasec/kube-bench:latest --restart=Never'
      },
      {
        type: 'config',
        description: 'Pod Security Policy to enforce container security',
        value: `apiVersion: policy/v1beta1
kind: PodSecurityPolicy
metadata:
  name: restricted
spec:
  privileged: false
  allowPrivilegeEscalation: false
  requiredDropCapabilities:
    - ALL
  volumes:
    - 'configMap'
    - 'emptyDir'
    - 'projected'
    - 'secret'
    - 'downwardAPI'
    - 'persistentVolumeClaim'
  hostNetwork: false
  hostIPC: false
  hostPID: false
  runAsUser:
    rule: 'MustRunAsNonRoot'
  seLinux:
    rule: 'RunAsAny'
  supplementalGroups:
    rule: 'MustRunAs'
    ranges:
      - min: 1
        max: 65535
  fsGroup:
    rule: 'MustRunAs'
    ranges:
      - min: 1
        max: 65535
  readOnlyRootFilesystem: true`
      }
    ]
  }
};

/**
 * Get validation guides for a specific KSI
 * @param {string} ksiId - The KSI ID to get validation guides for
 * @returns {Object} Validation guides for the specified KSI
 */
const getValidationGuide = (ksiId) => {
  return ksiValidationGuides[ksiId] || null;
};

/**
 * Get validation guides for a specific KSI and platform
 * @param {string} ksiId - The KSI ID to get validation guides for
 * @param {string} platform - The platform to get guides for (aws, azure, gcp, linux, kubernetes, docker)
 * @returns {Array} Validation guides for the specified KSI and platform
 */
const getPlatformValidationGuide = (ksiId, platform) => {
  const guide = ksiValidationGuides[ksiId];
  if (!guide) return null;
  
  return guide[platform.toLowerCase()] || null;
};

/**
 * Get all validation guides
 * @returns {Object} All validation guides
 */
const getAllValidationGuides = () => {
  return ksiValidationGuides;
};

export {
  getValidationGuide,
  getPlatformValidationGuide,
  getAllValidationGuides
}; 