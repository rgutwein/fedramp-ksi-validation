// KSI Service - Provides mock data for KSIs and NIST 800-53 controls

// Mock KSI data
const ksis = [
  {
    id: 'KSI-1',
    name: 'Identity and Access Management',
    description: 'Implement robust IAM controls to ensure proper access management across cloud environments',
    status: 'compliant',
    provider: 'AWS',
    details: 'All IAM controls implemented successfully',
    lastUpdated: '2023-09-10T14:30:00Z'
  },
  {
    id: 'KSI-2',
    name: 'Multi-Factor Authentication',
    description: 'Enforce MFA for all privileged accounts and critical systems',
    status: 'partial',
    provider: 'AWS',
    details: 'MFA implemented for admin accounts, but not yet for all service accounts',
    lastUpdated: '2023-09-11T10:15:00Z'
  },
  {
    id: 'KSI-3',
    name: 'Network Security Controls',
    description: 'Implement security groups, NACLs, and firewalls with least privilege access',
    status: 'compliant',
    provider: 'AWS',
    details: 'All network controls properly configured',
    lastUpdated: '2023-09-12T09:45:00Z'
  },
  {
    id: 'KSI-4',
    name: 'Data Encryption at Rest',
    description: 'Ensure all sensitive data is encrypted when stored',
    status: 'compliant',
    provider: 'AWS',
    details: 'All storage services configured with encryption',
    lastUpdated: '2023-09-13T16:20:00Z'
  },
  {
    id: 'KSI-5',
    name: 'Data Encryption in Transit',
    description: 'Ensure all data is encrypted during transmission using TLS 1.2+',
    status: 'non-compliant',
    provider: 'AWS',
    details: 'Several services found using outdated TLS versions',
    lastUpdated: '2023-09-14T11:30:00Z'
  },
  {
    id: 'KSI-6',
    name: 'Cloud Security Posture Management',
    description: 'Implement continuous monitoring of cloud security posture',
    status: 'compliant',
    provider: 'AWS',
    details: 'Security Hub and Config fully implemented',
    lastUpdated: '2023-09-15T15:00:00Z'
  },
  {
    id: 'KSI-7',
    name: 'Secure Configuration Management',
    description: 'Maintain secure configurations for all cloud resources',
    status: 'partial',
    provider: 'AWS',
    details: 'Some EC2 instances using non-hardened AMIs',
    lastUpdated: '2023-09-16T08:45:00Z'
  },
  {
    id: 'KSI-8',
    name: 'Vulnerability Management',
    description: 'Regular scanning and patching of vulnerabilities',
    status: 'compliant',
    provider: 'AWS',
    details: 'Automated scanning and patching implemented',
    lastUpdated: '2023-09-17T14:10:00Z'
  },
  {
    id: 'KSI-9',
    name: 'Identity and Access Management',
    description: 'Implement robust IAM controls to ensure proper access management across cloud environments',
    status: 'partial',
    provider: 'Azure',
    details: 'Some custom roles have excessive permissions',
    lastUpdated: '2023-09-10T14:30:00Z'
  },
  {
    id: 'KSI-10',
    name: 'Multi-Factor Authentication',
    description: 'Enforce MFA for all privileged accounts and critical systems',
    status: 'compliant',
    provider: 'Azure',
    details: 'MFA enabled for all accounts',
    lastUpdated: '2023-09-11T10:15:00Z'
  },
  {
    id: 'KSI-11',
    name: 'Network Security Controls',
    description: 'Implement NSGs and WAF policies with least privilege access',
    status: 'compliant',
    provider: 'Azure',
    details: 'All network controls properly configured',
    lastUpdated: '2023-09-12T09:45:00Z'
  },
  {
    id: 'KSI-12',
    name: 'Data Encryption at Rest',
    description: 'Ensure all sensitive data is encrypted when stored',
    status: 'non-compliant',
    provider: 'Azure',
    details: 'Multiple storage accounts without encryption enabled',
    lastUpdated: '2023-09-13T16:20:00Z'
  },
  {
    id: 'KSI-13',
    name: 'Data Encryption in Transit',
    description: 'Ensure all data is encrypted during transmission using TLS 1.2+',
    status: 'compliant',
    provider: 'Azure',
    details: 'All services configured to use modern TLS',
    lastUpdated: '2023-09-14T11:30:00Z'
  },
  {
    id: 'KSI-14',
    name: 'Cloud Security Posture Management',
    description: 'Implement continuous monitoring of cloud security posture',
    status: 'compliant',
    provider: 'Azure',
    details: 'Azure Security Center fully implemented',
    lastUpdated: '2023-09-15T15:00:00Z'
  },
  {
    id: 'KSI-15',
    name: 'Secure Configuration Management',
    description: 'Maintain secure configurations for all cloud resources',
    status: 'compliant',
    provider: 'Azure',
    details: 'Azure Policy enforcing compliant configurations',
    lastUpdated: '2023-09-16T08:45:00Z'
  },
  {
    id: 'KSI-16',
    name: 'Vulnerability Management',
    description: 'Regular scanning and patching of vulnerabilities',
    status: 'partial',
    provider: 'Azure',
    details: 'VM patching not yet fully automated',
    lastUpdated: '2023-09-17T14:10:00Z'
  },
  {
    id: 'KSI-17',
    name: 'Identity and Access Management',
    description: 'Implement robust IAM controls to ensure proper access management across cloud environments',
    status: 'non-compliant',
    provider: 'GCP',
    details: 'Several service accounts with overly permissive roles',
    lastUpdated: '2023-09-10T14:30:00Z'
  },
  {
    id: 'KSI-18',
    name: 'Multi-Factor Authentication',
    description: 'Enforce MFA for all privileged accounts and critical systems',
    status: 'non-compliant',
    provider: 'GCP',
    details: 'MFA not enforced for all users',
    lastUpdated: '2023-09-11T10:15:00Z'
  },
  {
    id: 'KSI-19',
    name: 'Network Security Controls',
    description: 'Implement firewall rules and security boundaries with least privilege access',
    status: 'partial',
    provider: 'GCP',
    details: 'Some overly permissive firewall rules detected',
    lastUpdated: '2023-09-12T09:45:00Z'
  },
  {
    id: 'KSI-20',
    name: 'Data Encryption at Rest',
    description: 'Ensure all sensitive data is encrypted when stored',
    status: 'partial',
    provider: 'GCP',
    details: 'Some Cloud Storage buckets without default encryption',
    lastUpdated: '2023-09-13T16:20:00Z'
  },
  {
    id: 'KSI-21',
    name: 'Data Encryption in Transit',
    description: 'Ensure all data is encrypted during transmission using TLS 1.2+',
    status: 'compliant',
    provider: 'GCP',
    details: 'All services configured to use modern TLS',
    lastUpdated: '2023-09-14T11:30:00Z'
  },
  {
    id: 'KSI-22',
    name: 'Cloud Security Posture Management',
    description: 'Implement continuous monitoring of cloud security posture',
    status: 'compliant',
    provider: 'GCP',
    details: 'Security Command Center fully implemented',
    lastUpdated: '2023-09-15T15:00:00Z'
  },
  {
    id: 'KSI-23',
    name: 'Secure Configuration Management',
    description: 'Maintain secure configurations for all cloud resources',
    status: 'non-compliant',
    provider: 'GCP',
    details: 'Multiple resources with insecure configurations',
    lastUpdated: '2023-09-16T08:45:00Z'
  },
  {
    id: 'KSI-24',
    name: 'Vulnerability Management',
    description: 'Regular scanning and patching of vulnerabilities',
    status: 'partial',
    provider: 'GCP',
    details: 'Vulnerability scanning implemented but patching is manual',
    lastUpdated: '2023-09-17T14:10:00Z'
  }
];

// Mock NIST 800-53 controls
const nistControls = [
  {
    id: 'AC-2',
    name: 'Account Management',
    family: 'Access Control',
    description: 'The organization manages information system accounts, including establishing, activating, modifying, reviewing, disabling, and removing accounts.',
    relatedKsis: ['KSI-1', 'KSI-9', 'KSI-17']
  },
  {
    id: 'AC-3',
    name: 'Access Enforcement',
    family: 'Access Control',
    description: 'The information system enforces approved authorizations for logical access to the system in accordance with applicable policy.',
    relatedKsis: ['KSI-1', 'KSI-9', 'KSI-17']
  },
  {
    id: 'AC-6',
    name: 'Least Privilege',
    family: 'Access Control',
    description: 'The organization employs the principle of least privilege, allowing only authorized accesses for users that are necessary to accomplish assigned tasks.',
    relatedKsis: ['KSI-1', 'KSI-9', 'KSI-17']
  },
  {
    id: 'AC-17',
    name: 'Remote Access',
    family: 'Access Control',
    description: 'The organization: a. Establishes and documents usage restrictions, configuration/connection requirements, and implementation guidance for each type of remote access allowed; and b. Authorizes remote access to the information system prior to allowing such connections.',
    relatedKsis: ['KSI-3', 'KSI-11', 'KSI-19']
  },
  {
    id: 'AU-2',
    name: 'Audit Events',
    family: 'Audit and Accountability',
    description: 'The organization: a. Determines that the information system is capable of auditing events; b. Coordinates the security audit function with other organizational entities requiring audit-related information; c. Provides a rationale for why the list of auditable events is deemed to be adequate; and d. Determines which events require auditing on a continuous basis and which events require auditing in response to specific situations.',
    relatedKsis: ['KSI-6', 'KSI-14', 'KSI-22']
  },
  {
    id: 'AU-6',
    name: 'Audit Review, Analysis, and Reporting',
    family: 'Audit and Accountability',
    description: 'The organization: a. Reviews and analyzes information system audit records for indications of inappropriate or unusual activity; and b. Reports findings to designated organizational officials.',
    relatedKsis: ['KSI-6', 'KSI-14', 'KSI-22']
  },
  {
    id: 'CM-2',
    name: 'Baseline Configuration',
    family: 'Configuration Management',
    description: 'The organization develops, documents, and maintains a current baseline configuration of the information system.',
    relatedKsis: ['KSI-7', 'KSI-15', 'KSI-23']
  },
  {
    id: 'CM-6',
    name: 'Configuration Settings',
    family: 'Configuration Management',
    description: 'The organization: a. Establishes and documents configuration settings for information technology products that reflect the most restrictive mode consistent with operational requirements; b. Implements the configuration settings; c. Identifies, documents, and approves any deviations from established configuration settings; and d. Monitors and controls changes to the configuration settings in accordance with organizational policies and procedures.',
    relatedKsis: ['KSI-7', 'KSI-15', 'KSI-23']
  },
  {
    id: 'CP-9',
    name: 'Information System Backup',
    family: 'Contingency Planning',
    description: 'The organization: a. Conducts backups of user-level information, system-level information, and system documentation; b. Protects the confidentiality, integrity, and availability of backup information at storage locations.',
    relatedKsis: ['KSI-4', 'KSI-12', 'KSI-20']
  },
  {
    id: 'CP-10',
    name: 'Information System Recovery and Reconstitution',
    family: 'Contingency Planning',
    description: 'The organization provides for the recovery and reconstitution of the information system to a known state after a disruption, compromise, or failure.',
    relatedKsis: ['KSI-4', 'KSI-12', 'KSI-20']
  },
  {
    id: 'IA-2',
    name: 'Identification and Authentication (Organizational Users)',
    family: 'Identification and Authentication',
    description: 'The information system uniquely identifies and authenticates organizational users.',
    relatedKsis: ['KSI-2', 'KSI-10', 'KSI-18']
  },
  {
    id: 'IA-5',
    name: 'Authenticator Management',
    family: 'Identification and Authentication',
    description: 'The organization manages information system authenticators by: a. Verifying, as part of the initial authenticator distribution, the identity of the individual, group, role, or device receiving the authenticator; b. Establishing initial authenticator content for authenticators defined by the organization; c. Ensuring that authenticators have sufficient strength of mechanism for their intended use; d. Establishing and implementing administrative procedures for initial authenticator distribution, for lost/compromised or damaged authenticators, and for revoking authenticators; e. Changing default content of authenticators prior to information system installation; f. Establishing minimum and maximum lifetime restrictions and reuse conditions for authenticators; g. Changing/refreshing authenticators; h. Protecting authenticator content from unauthorized disclosure and modification;',
    relatedKsis: ['KSI-2', 'KSI-10', 'KSI-18']
  },
  {
    id: 'RA-5',
    name: 'Vulnerability Scanning',
    family: 'Risk Assessment',
    description: 'The organization: a. Scans for vulnerabilities in the information system and hosted applications; b. Employs vulnerability scanning tools and techniques that facilitate interoperability among tools and automate parts of the vulnerability management process; c. Analyzes vulnerability scan reports and results from security control assessments; d. Remediates legitimate vulnerabilities in accordance with an organizational assessment of risk; and e. Shares information obtained from the vulnerability scanning process and security control assessments with designated personnel throughout the organization to help eliminate similar vulnerabilities in other information systems.',
    relatedKsis: ['KSI-8', 'KSI-16', 'KSI-24']
  },
  {
    id: 'SC-7',
    name: 'Boundary Protection',
    family: 'System and Communications Protection',
    description: 'The information system: a. Monitors and controls communications at the external boundary of the system and at key internal boundaries within the system; and b. Implements subnetworks for publicly accessible system components that are physically or logically separated from internal organizational networks.',
    relatedKsis: ['KSI-3', 'KSI-11', 'KSI-19']
  },
  {
    id: 'SC-8',
    name: 'Transmission Confidentiality and Integrity',
    family: 'System and Communications Protection',
    description: 'The information system protects the confidentiality and integrity of transmitted information.',
    relatedKsis: ['KSI-5', 'KSI-13', 'KSI-21']
  },
  {
    id: 'SI-2',
    name: 'Flaw Remediation',
    family: 'System and Information Integrity',
    description: 'The organization: a. Identifies, reports, and corrects information system flaws; b. Tests software and firmware updates related to flaw remediation for effectiveness and potential side effects before installation; c. Installs security-relevant software and firmware updates within the time period directed by the organization; and d. Incorporates flaw remediation into the organizational configuration management process.',
    relatedKsis: ['KSI-8', 'KSI-16', 'KSI-24']
  },
  {
    id: 'SI-4',
    name: 'Information System Monitoring',
    family: 'System and Information Integrity',
    description: 'The organization: a. Monitors the information system to detect attacks and indicators of potential attacks; and unauthorized local, network, and remote connections; b. Identifies unauthorized use of the information system through automated mechanisms; c. Deploys monitoring devices: strategically within the information system to collect organization-determined essential information; and at ad hoc locations within the system to track specific types of transactions of interest to the organization; d. Protects information obtained from intrusion-monitoring tools from unauthorized access, modification, and deletion; e. Heightens the level of information system monitoring activity whenever there is an indication of increased risk; f. Obtains legal opinion with regard to information system monitoring activities in accordance with applicable federal laws, Executive Orders, directives, policies, or regulations; and g. Provides information system monitoring information to specified personnel as needed.',
    relatedKsis: ['KSI-6', 'KSI-14', 'KSI-22']
  }
];

// Get related KSIs for a specific NIST control
const getRelatedKsis = (controlId) => {
  const control = nistControls.find(c => c.id === controlId);
  return control ? control.relatedKsis : [];
};

// Get related NIST controls for a specific KSI
const getRelatedControls = (ksiId) => {
  return nistControls.filter(control => 
    control.relatedKsis.includes(ksiId)
  );
};

// Get all KSIs
const getAllKsis = () => {
  return Promise.resolve(ksis);
};

// Get all NIST 800-53 controls
const getAllNistControls = () => {
  return Promise.resolve(nistControls);
};

// Get KSIs for a specific provider
const getKsisByProvider = (provider) => {
  return Promise.resolve(ksis.filter(ksi => ksi.provider === provider));
};

// Get a specific KSI by ID
const getKsiById = (id) => {
  const ksi = ksis.find(k => k.id === id);
  return Promise.resolve(ksi || null);
};

// Get a specific NIST control by ID
const getNistControlById = (id) => {
  const control = nistControls.find(c => c.id === id);
  return Promise.resolve(control || null);
};

export {
  ksis,
  nistControls,
  getRelatedKsis,
  getRelatedControls,
  getAllKsis,
  getAllNistControls,
  getKsisByProvider,
  getKsiById,
  getNistControlById
}; 