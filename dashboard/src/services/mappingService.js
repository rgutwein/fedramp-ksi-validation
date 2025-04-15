// This service provides mapping functionality between KSIs and NIST 800-53 controls
// It also contains the definitions for each KSI

// Mapping of KSIs to NIST 800-53 controls
const ksiToNistMappings = {
  'KSI-1': ['RA-5', 'SI-2', 'SI-3', 'SI-7'],
  'KSI-2': ['IA-2', 'IA-5', 'AC-7'],
  'KSI-3': ['SI-2', 'CM-8', 'CM-3'],
  'KSI-4': ['AC-2', 'AC-6', 'AU-6'],
  'KSI-5': ['SI-4', 'SI-3', 'AU-6'],
  'KSI-6': ['SC-8', 'SC-13', 'SC-28'],
  'KSI-7': ['AT-2', 'AT-3', 'AT-4'],
  'KSI-8': ['CP-9', 'CP-10', 'CP-6'],
  'KSI-9': ['AU-2', 'AU-3', 'AU-6', 'AU-12'],
  'KSI-10': ['CM-2', 'CM-3', 'CM-6', 'CM-8'],
  'KSI-11': ['IR-4', 'IR-5', 'IR-8'],
  'KSI-12': ['SA-11', 'SA-15', 'RA-5'],
  'KSI-13': ['SC-7', 'AC-4', 'SI-4'],
  'KSI-14': ['SA-9', 'SA-12', 'CA-3'],
  'KSI-15': ['CA-7', 'RA-5', 'SI-4']
};

// Map NIST 800-53 controls to KSIs (reverse mapping)
const nistToKsiMapping = {};
Object.entries(ksiToNistMappings).forEach(([ksi, nistControls]) => {
  nistControls.forEach(control => {
    if (!nistToKsiMapping[control]) {
      nistToKsiMapping[control] = [];
    }
    nistToKsiMapping[control].push(ksi);
  });
});

// Definitions for each KSI
const ksiDefinitions = {
  'KSI-1': {
    name: 'Vulnerability Management',
    description: 'Establish and maintain a vulnerability management process that regularly scans, identifies, reports on, and remedies security vulnerabilities.'
  },
  'KSI-2': {
    name: 'Strong Authentication',
    description: 'Implement multi-factor authentication for all user accounts accessing critical systems and sensitive data.'
  },
  'KSI-3': {
    name: 'Patch Management',
    description: 'Maintain systems at the current security patch level with a process that ensures timely installation of security patches.'
  },
  'KSI-4': {
    name: 'Access Reviews',
    description: 'Regularly review and validate access permissions to ensure principle of least privilege.'
  },
  'KSI-5': {
    name: 'Threat Detection',
    description: 'Implement automated systems to detect malicious activity and security events.'
  },
  'KSI-6': {
    name: 'Data Protection',
    description: 'Encrypt sensitive data at rest and in transit using industry-standard encryption mechanisms.'
  },
  'KSI-7': {
    name: 'Security Training',
    description: 'Provide regular security awareness training to all staff with access to systems and data.'
  },
  'KSI-8': {
    name: 'Backup and Recovery',
    description: 'Maintain regular backups of critical systems and data with tested recovery procedures.'
  },
  'KSI-9': {
    name: 'Logging and Monitoring',
    description: 'Implement comprehensive logging and monitoring of security-relevant events.'
  },
  'KSI-10': {
    name: 'Configuration Management',
    description: 'Maintain a secure configuration baseline for all system components with change control processes.'
  },
  'KSI-11': {
    name: 'Incident Response',
    description: 'Establish and maintain an incident response capability with defined procedures.'
  },
  'KSI-12': {
    name: 'Secure Development',
    description: 'Implement secure software development practices including code review and security testing.'
  },
  'KSI-13': {
    name: 'Network Security',
    description: 'Implement network security controls to protect system boundaries and monitor network traffic.'
  },
  'KSI-14': {
    name: 'Supply Chain Security',
    description: 'Assess and manage security risks associated with suppliers and third-party partners.'
  },
  'KSI-15': {
    name: 'Continuous Monitoring',
    description: 'Implement continuous monitoring strategies and programs to maintain awareness of security status.'
  }
};

// Control families
const controlFamilies = {
  'AC': 'Access Control',
  'AU': 'Audit and Accountability',
  'AT': 'Awareness and Training',
  'CM': 'Configuration Management',
  'CP': 'Contingency Planning',
  'IA': 'Identification and Authentication',
  'IR': 'Incident Response',
  'MA': 'Maintenance',
  'MP': 'Media Protection',
  'PS': 'Personnel Security',
  'PE': 'Physical and Environmental Protection',
  'PL': 'Planning',
  'PM': 'Program Management',
  'RA': 'Risk Assessment',
  'CA': 'Security Assessment and Authorization',
  'SC': 'System and Communications Protection',
  'SI': 'System and Information Integrity',
  'SA': 'System and Services Acquisition'
};

// Get NIST controls for a specific KSI
const getNistControlsForKsi = (ksiId) => {
  return ksiToNistMappings[ksiId] || [];
};

// Get KSIs that map to a specific NIST control
const getKsisForNistControl = (controlId) => {
  const result = [];
  for (const [ksi, controls] of Object.entries(ksiToNistMappings)) {
    if (controls.includes(controlId)) {
      result.push(ksi);
    }
  }
  return result;
};

// Get KSI definition
const getKsiDefinition = (ksiId) => {
  return ksiDefinitions[ksiId] || null;
};

// Get all KSI definitions
const getAllKsiDefinitions = () => {
  return ksiDefinitions;
};

// Validate if a KSI meets compliance requirements
const validateKsi = (ksiId, evidence) => {
  // This would normally contain complex validation logic
  // For demo purposes, we're using a simple random approach
  const validationResults = {
    status: Math.random() > 0.3 ? 'compliant' : 'non-compliant',
    findings: [],
    recommendations: []
  };

  if (validationResults.status === 'non-compliant') {
    validationResults.findings.push('Evidence provided does not meet all requirements');
    validationResults.recommendations.push('Review implementation against FedRAMP requirements');
  }

  return validationResults;
};

// Get all control families
const getControlFamilies = () => {
  return [
    'Access Control',
    'Awareness and Training',
    'Audit and Accountability',
    'Assessment, Authorization, and Monitoring',
    'Configuration Management',
    'Contingency Planning',
    'Identification and Authentication',
    'Incident Response',
    'Risk Assessment',
    'System and Services Acquisition',
    'System and Communications Protection',
    'System and Information Integrity'
  ];
};

// Mapping of NIST control families to their abbreviations
const controlFamilyAbbreviations = {
  'Access Control': 'AC',
  'Awareness and Training': 'AT',
  'Audit and Accountability': 'AU',
  'Assessment, Authorization, and Monitoring': 'CA',
  'Configuration Management': 'CM',
  'Contingency Planning': 'CP',
  'Identification and Authentication': 'IA',
  'Incident Response': 'IR',
  'Risk Assessment': 'RA',
  'System and Services Acquisition': 'SA',
  'System and Communications Protection': 'SC',
  'System and Information Integrity': 'SI'
};

export {
  getNistControlsForKsi,
  getKsisForNistControl,
  getKsiDefinition,
  getAllKsiDefinitions,
  validateKsi,
  getControlFamilies,
  controlFamilyAbbreviations
}; 