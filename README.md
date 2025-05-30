# FedRAMP KSI Validation Dashboard

A comprehensive dashboard for validating Key Security Indicators (KSIs) against NIST 800-53 controls for FedRAMP compliance across multiple cloud service providers.

## Overview

This dashboard helps organizations validate their FedRAMP compliance by tracking Key Security Indicators (KSIs) across AWS, Azure, and GCP cloud environments. It maps KSIs to NIST 800-53 controls and provides a clear visualization of compliance status.

## Features

- **Multi-Cloud Support**: Monitor compliance across AWS, Azure, and GCP
- **KSI Validation**: Validate specific security indicators mapped to FedRAMP controls
- **NIST 800-53 Control Mapping**: View how KSIs map to NIST controls
- **Compliance Dashboard**: Visualize overall compliance status with interactive charts
- **Control Catalog**: Browse and search through NIST controls and KSIs
- **Evidence Management**: Track implementation evidence for each KSI

## Screenshots

### Dashboard
![Dashboard](https://github.com/rgutwein/fedramp-ksi-validation/raw/main/screenshots/dashboard.png)
*FedRAMP Controls Validation Dashboard showing compliance status across cloud providers*

### KSI Validation
![KSI Validation](https://github.com/rgutwein/fedramp-ksi-validation/raw/main/screenshots/ksi-validation.png)
*KSI Validation page showing KSIs mapped to NIST 800-53 controls with implementation status*

### Control Catalog
![Control Catalog](https://github.com/rgutwein/fedramp-ksi-validation/raw/main/screenshots/control-catalog.png)
*Control Catalog page for browsing NIST 800-53 controls and KSIs*

## Installation

```bash
# Clone the repository
git clone https://github.com/rgutwein/fedramp-ksi-validation.git
cd fedramp-ksi-validation

# Install dependencies
cd dashboard
npm install

# Start the application
npm start
```

## Usage

1. **Dashboard**: View overall compliance status across cloud providers
2. **Cloud Providers**: Drill down into specific providers (AWS, Azure, GCP)
3. **Control Catalog**: Browse all NIST 800-53 controls and KSIs
4. **KSI Validation**: Validate KSIs against NIST controls and review evidence

## Project Structure

```
fedramp-ksi-validation/
├── dashboard/               # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API and data services
│   │   └── App.js           # Main application component
├── scripts/                 # Backend scripts for cloud scanning
└── terraform/               # IaC templates for deploying validation resources
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---
💡 **Join the FedRAMP 20x movement**: Help us shape the future of security automation!
