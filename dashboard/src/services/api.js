import axios from 'axios';
import { ksiToControlsMap, getNistControlsForKsi, ksiDefinitions } from './mappingService';
import { getNistControlsForKsi as getNistControlsForKsiService, getKsisForNistControl, validateKsi } from './mappingService';
import { ksis, nistControls, getRelatedKsis, getRelatedControls, getAllKsis, getAllNistControls } from './ksiService';

// Base URL for the backend API
const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Generate mock compliance results that include NIST 800-53 mappings
const processComplianceResults = async (results) => {
  try {
    // Add NIST 800-53 control mappings for each KSI
    const enhancedResults = [];
    
    for (const result of results) {
      const nistControls = await getNistControlsForKsi(result.id);
      
      enhancedResults.push({
        ...result,
        nistControls
      });
    }
    
    return enhancedResults;
  } catch (error) {
    console.error('Error processing compliance results:', error);
    return results;
  }
};

// Get all compliance controls with their status
const getComplianceControls = async () => {
  try {
    // Fetch all KSIs
    const ksis = await getAllKsis();
    const processedResults = await processComplianceResults(ksis);
    
    return processedResults;
  } catch (error) {
    console.error('Error fetching compliance controls:', error);
    return [];
  }
};

// Get compliance status for a specific cloud provider
const getCloudProviderStatus = async (provider) => {
  try {
    // Fetch all KSIs
    const ksis = await getAllKsis();
    
    // Filter KSIs for the specific provider
    const providerKsis = ksis.filter(ksi => ksi.provider === provider);
    
    // Calculate compliance statistics
    const totalControls = providerKsis.length;
    const compliantControls = providerKsis.filter(ksi => ksi.status === 'compliant').length;
    const partialControls = providerKsis.filter(ksi => ksi.status === 'partial').length;
    const nonCompliantControls = providerKsis.filter(ksi => ksi.status === 'non-compliant').length;
    
    return {
      provider,
      totalControls,
      compliantControls,
      partialControls,
      nonCompliantControls,
      compliancePercentage: totalControls > 0 ? Math.round((compliantControls / totalControls) * 100) : 0,
      controls: providerKsis
    };
  } catch (error) {
    console.error(`Error fetching ${provider} compliance status:`, error);
    return {
      provider,
      totalControls: 0,
      compliantControls: 0,
      partialControls: 0,
      nonCompliantControls: 0,
      compliancePercentage: 0,
      controls: []
    };
  }
};

// Validate a KSI implementation
const validateKsiImplementation = async (ksiId, evidence) => {
  try {
    return validateKsi(ksiId, evidence);
  } catch (error) {
    console.error('Error validating KSI implementation:', error);
    return {
      valid: false,
      message: 'Error validating KSI',
      validationSteps: []
    };
  }
};

// Get NIST 800-53 controls with their status
const getNistControls = async () => {
  try {
    return await getAllNistControls();
  } catch (error) {
    console.error('Error fetching NIST controls:', error);
    return [];
  }
};

// Get mock compliance data for dashboard
const getMockComplianceData = () => {
  // AWS Mock Data
  const awsData = {
    provider: 'AWS',
    timestamp: new Date().toISOString(),
    complianceScore: 78,
    controlStatus: {
      compliant: 35,
      partial: 12,
      nonCompliant: 8
    },
    riskAreas: [
      { name: 'Access Control', compliant: 80 },
      { name: 'Data Protection', compliant: 75 },
      { name: 'Incident Response', compliant: 65 },
      { name: 'Network Security', compliant: 90 },
      { name: 'Configuration Management', compliant: 70 }
    ],
    recentFindings: [
      { id: 'F-1001', severity: 'High', description: 'S3 bucket without encryption', control: 'KSI-6', date: '2023-09-15' },
      { id: 'F-1002', severity: 'Medium', description: 'IAM users without MFA', control: 'KSI-2', date: '2023-09-14' },
      { id: 'F-1003', severity: 'Low', description: 'Unused security groups', control: 'KSI-13', date: '2023-09-12' }
    ]
  };

  // Azure Mock Data
  const azureData = {
    provider: 'Azure',
    timestamp: new Date().toISOString(),
    complianceScore: 82,
    controlStatus: {
      compliant: 38,
      partial: 10,
      nonCompliant: 5
    },
    riskAreas: [
      { name: 'Access Control', compliant: 85 },
      { name: 'Data Protection', compliant: 80 },
      { name: 'Incident Response', compliant: 75 },
      { name: 'Network Security', compliant: 85 },
      { name: 'Configuration Management', compliant: 80 }
    ],
    recentFindings: [
      { id: 'F-2001', severity: 'High', description: 'Storage account without encryption', control: 'KSI-6', date: '2023-09-16' },
      { id: 'F-2002', severity: 'Medium', description: 'Accounts without MFA', control: 'KSI-2', date: '2023-09-15' },
      { id: 'F-2003', severity: 'Low', description: 'Unused network security groups', control: 'KSI-13', date: '2023-09-13' }
    ]
  };

  // GCP Mock Data
  const gcpData = {
    provider: 'GCP',
    timestamp: new Date().toISOString(),
    complianceScore: 75,
    controlStatus: {
      compliant: 32,
      partial: 15,
      nonCompliant: 10
    },
    riskAreas: [
      { name: 'Access Control', compliant: 70 },
      { name: 'Data Protection', compliant: 80 },
      { name: 'Incident Response', compliant: 60 },
      { name: 'Network Security', compliant: 85 },
      { name: 'Configuration Management', compliant: 75 }
    ],
    recentFindings: [
      { id: 'F-3001', severity: 'High', description: 'Cloud Storage without encryption', control: 'KSI-6', date: '2023-09-14' },
      { id: 'F-3002', severity: 'Medium', description: 'Users without 2FA', control: 'KSI-2', date: '2023-09-13' },
      { id: 'F-3003', severity: 'Low', description: 'Default network with overly permissive firewall rules', control: 'KSI-13', date: '2023-09-10' }
    ]
  };

  return {
    aws: awsData,
    azure: azureData,
    gcp: gcpData,
    summary: {
      totalControls: 55,
      compliantControls: 35 + 38 + 32,
      partialControls: 12 + 10 + 15,
      nonCompliantControls: 8 + 5 + 10,
      averageComplianceScore: Math.round((78 + 82 + 75) / 3),
      providers: [
        { name: 'AWS', score: 78 },
        { name: 'Azure', score: 82 },
        { name: 'GCP', score: 75 }
      ]
    }
  };
};

// Fetch detailed compliance status for a specific control
export const getControlDetails = async (controlId) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Get the KSI data
  const ksi = ksis.find(k => k.id === controlId);
  if (!ksi) {
    return { success: false, error: 'Control not found' };
  }
  
  // Get related NIST controls
  const nistMappings = getNistControlsForKsiService(controlId);
  const relatedNistControls = nistMappings.map(nistId => {
    const control = nistControls.find(c => c.id === nistId) || { id: nistId, name: 'Unknown Control' };
    return control;
  });
  
  // Get cloud provider status for this control
  const awsStatus = getMockComplianceData('aws').controls.find(c => c.id === controlId)?.status || 'unknown';
  const azureStatus = getMockComplianceData('azure').controls.find(c => c.id === controlId)?.status || 'unknown';
  const gcpStatus = getMockComplianceData('gcp').controls.find(c => c.id === controlId)?.status || 'unknown';
  
  // Return detailed control data
  return {
    success: true,
    data: {
      ...ksi,
      nistControls: relatedNistControls,
      cloudStatus: {
        aws: awsStatus,
        azure: azureStatus,
        gcp: gcpStatus
      }
    }
  };
};

// Fetch NIST control details
export const getNistControlDetails = async (controlId) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Find the NIST control
  const control = nistControls.find(c => c.id === controlId);
  if (!control) {
    return { success: false, error: 'NIST control not found' };
  }
  
  // Get related KSIs
  const relatedKsiIds = getKsisForNistControl(controlId);
  const relatedKsiControls = relatedKsiIds.map(ksiId => {
    const ksi = ksis.find(k => k.id === ksiId) || { id: ksiId, name: 'Unknown KSI' };
    return ksi;
  });
  
  // Return detailed NIST control data
  return {
    success: true,
    data: {
      ...control,
      relatedKsis: relatedKsiControls
    }
  };
};

// Submit a validation result for a KSI
export const submitKsiValidation = async (ksiId, validationData) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // In a real app, this would send the validation data to a backend API
  // For this demo, we'll just simulate a successful submission
  console.log(`Submitting validation for KSI ${ksiId}:`, validationData);
  
  return { 
    success: true, 
    data: { 
      message: `Validation for KSI ${ksiId} submitted successfully`,
      timestamp: new Date().toISOString()
    } 
  };
};

// Get a list of all systems
export const getSystems = async () => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Mock data for systems
  const systems = [
    { id: 'sys-001', name: 'Financial Processing System', type: 'High Impact', status: 'Production' },
    { id: 'sys-002', name: 'Customer Data Platform', type: 'Moderate Impact', status: 'Production' },
    { id: 'sys-003', name: 'Internal HR Portal', type: 'Low Impact', status: 'Production' },
    { id: 'sys-004', name: 'Development Environment', type: 'Low Impact', status: 'Development' },
    { id: 'sys-005', name: 'Security Operations Center', type: 'High Impact', status: 'Production' },
  ];
  
  return { success: true, data: systems };
};

// Get detailed system information
export const getSystemDetails = async (systemId) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  // Mock system details
  const systemDetails = {
    id: systemId,
    name: systemId === 'sys-001' ? 'Financial Processing System' : 
          systemId === 'sys-002' ? 'Customer Data Platform' : 
          systemId === 'sys-003' ? 'Internal HR Portal' : 
          systemId === 'sys-004' ? 'Development Environment' : 
          systemId === 'sys-005' ? 'Security Operations Center' : 'Unknown System',
    description: 'This is a detailed description of the system and its purpose.',
    owner: 'IT Department',
    securityContact: 'security@example.com',
    deploymentDate: '2023-01-15',
    lastAssessment: '2023-06-10',
    impact: systemId === 'sys-001' || systemId === 'sys-005' ? 'High' : 
            systemId === 'sys-002' ? 'Moderate' : 'Low',
    status: systemId === 'sys-004' ? 'Development' : 'Production',
    components: [
      { name: 'Frontend Application', type: 'Web', technology: 'React', hostingProvider: 'AWS' },
      { name: 'API Gateway', type: 'Service', technology: 'AWS API Gateway', hostingProvider: 'AWS' },
      { name: 'Backend Services', type: 'Service', technology: 'Node.js', hostingProvider: 'AWS' },
      { name: 'Database', type: 'Database', technology: 'PostgreSQL', hostingProvider: 'AWS RDS' }
    ],
    ksis: systemId === 'sys-001' ? ['KSI-1', 'KSI-2', 'KSI-3', 'KSI-4', 'KSI-5', 'KSI-6', 'KSI-7', 'KSI-8', 'KSI-9', 'KSI-10'] :
          systemId === 'sys-002' ? ['KSI-1', 'KSI-2', 'KSI-4', 'KSI-6', 'KSI-8', 'KSI-10'] :
          systemId === 'sys-003' ? ['KSI-1', 'KSI-2', 'KSI-7'] :
          systemId === 'sys-004' ? ['KSI-1', 'KSI-9'] :
          systemId === 'sys-005' ? ['KSI-1', 'KSI-2', 'KSI-3', 'KSI-4', 'KSI-5', 'KSI-8'] : [],
    complianceStatus: {
      fedramp: systemId === 'sys-001' ? 'Authorized' : 
              systemId === 'sys-002' ? 'In Process' : 
              systemId === 'sys-003' ? 'Compliant' : 
              systemId === 'sys-004' ? 'Not Applicable' : 
              systemId === 'sys-005' ? 'Authorized' : 'Unknown',
      fisma: systemId === 'sys-001' || systemId === 'sys-005' ? 'High' :
             systemId === 'sys-002' ? 'Moderate' :
             systemId === 'sys-003' || systemId === 'sys-004' ? 'Low' : 'Unknown',
      hipaa: systemId === 'sys-001' || systemId === 'sys-002' ? 'Compliant' : 'Not Applicable',
      pci: systemId === 'sys-001' ? 'Compliant' : 'Not Applicable'
    }
  };
  
  return { success: true, data: systemDetails };
};

export {
  getComplianceControls,
  getCloudProviderStatus,
  validateKsiImplementation,
  getNistControls,
  getMockComplianceData
}; 