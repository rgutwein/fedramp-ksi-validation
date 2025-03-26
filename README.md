# FedRAMP KSI Validation Toolkit

## Overview
This repository provides an **open-source compliance automation framework** for validating **Key Security Indicators (KSIs)** as per **FedRAMP 20x**. The goal is to automate security assessments, enforce technical controls, and provide machine-readable evidence for continuous compliance.

## 🚀 Features
- **Automated Security Checks** using **Terraform, OPA, and Python scripts**
- **Policy-as-Code** enforcement with **Open Policy Agent (OPA)**
- **Continuous Compliance Scanning** in **CI/CD Pipelines**
- **OSCAL JSON & YAML Reporting** for machine-readable security evidence
- **Multi-Cloud Support** (AWS, Azure, GCP - More coming soon)

## 📂 Repository Structure
```
fedramp-ksi-validation/
│── .github/                 # CI/CD workflows for automation
│── configs/                 # Configuration files for KSIs and policies
│   ├── ksis.yaml            # Definition of FedRAMP 20x Key Security Indicators
│   ├── policies.rego        # OPA policies for enforcing security controls
│── terraform/               # Terraform modules for compliance validation
│   ├── aws/                 # AWS-specific compliance checks
│   ├── azure/               # Azure-specific compliance checks
│   ├── gcp/                 # GCP-specific compliance checks
│── oscal/                   # OSCAL machine-readable format for compliance evidence
│   ├── FedRAMP-KSI.json     # JSON representation of compliance checks
│── scripts/                 # Automation scripts for scanning environments
│── docs/                    # Documentation and guides
│── LICENSE                  # Open-source licensing information
│── README.md                # Project overview and setup guide
```

## 🔧 Getting Started

### Prerequisites
- [Terraform](https://developer.hashicorp.com/terraform/downloads)
- [AWS CLI](https://aws.amazon.com/cli/)
- [Python](https://www.python.org/downloads/)
- [OPA (Open Policy Agent)](https://www.openpolicyagent.org/)

### Installation
Clone this repository:
```sh
git clone https://github.com/your-org/fedramp-ksi-validation.git
cd fedramp-ksi-validation
```

### Running Terraform Compliance Checks
```sh
cd terraform/aws
terraform init
terraform validate
terraform plan
```

### Running Python Scanner
```sh
python scripts/scan_aws.py
```

### Running OPA Policy Checks
```sh
opa eval --data configs/policies.rego --input configs/ksis.yaml "data.compliance.allow"
```

## 📊 OSCAL Compliance Reporting
Generate machine-readable security evidence:
```sh
cat oscal/FedRAMP-KSI.json
```

## 📌 Contributing
We welcome contributions! Feel free to submit issues or pull requests.

## 📜 License
This project is licensed under the **MIT License**.

---
💡 **Join the FedRAMP 20x movement**: Help us shape the future of security automation!
# fedramp-ksi-validation
