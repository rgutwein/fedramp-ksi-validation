import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Stepper, 
  Step, 
  StepLabel, 
  Button, 
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Alert, 
  CircularProgress,
  Card,
  CardContent,
  Divider,
  IconButton,
  Tooltip,
  Chip
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  Save as SaveIcon,
  Refresh as RefreshIcon,
  VerifiedUser as VerifiedUserIcon
} from '@mui/icons-material';
import { validateKsi, getKsiDefinition } from '../services/mappingService';

const steps = ['Select KSI', 'Input Implementation', 'Validate Results'];

const KsiValidation = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedKsi, setSelectedKsi] = useState('');
  const [implementation, setImplementation] = useState('');
  const [validationResult, setValidationResult] = useState(null);
  const [ksiOptions, setKsiOptions] = useState([]);
  const [ksiDefinition, setKsiDefinition] = useState(null);

  useEffect(() => {
    // In a real app, fetch this from an API
    setKsiOptions([
      { id: 'KSI-1', name: 'Access Control Policy' },
      { id: 'KSI-2', name: 'Account Management' },
      { id: 'KSI-3', name: 'Audit Logging' },
      { id: 'KSI-4', name: 'Security Assessment' },
      { id: 'KSI-5', name: 'Backup and Recovery' },
      { id: 'KSI-6', name: 'Vulnerability Management' },
      { id: 'KSI-7', name: 'Configuration Management' },
      { id: 'KSI-8', name: 'Incident Response' }
    ]);
  }, []);

  useEffect(() => {
    if (selectedKsi) {
      const definition = getKsiDefinition(selectedKsi);
      setKsiDefinition(definition);
    } else {
      setKsiDefinition(null);
    }
  }, [selectedKsi]);

  const handleNext = () => {
    if (activeStep === 1) {
      validateImplementation();
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setSelectedKsi('');
    setImplementation('');
    setValidationResult(null);
  };

  const validateImplementation = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      const result = await validateKsi(selectedKsi, implementation);
      setValidationResult(result);
      setActiveStep(2);
    } catch (error) {
      console.error('Error validating KSI:', error);
      setValidationResult({
        valid: false,
        message: 'An error occurred during validation',
        details: [{ issue: 'Server error', resolution: 'Please try again later' }]
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ p: 2 }}>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel id="ksi-select-label">Select KSI</InputLabel>
              <Select
                labelId="ksi-select-label"
                id="ksi-select"
                value={selectedKsi}
                label="Select KSI"
                onChange={(e) => setSelectedKsi(e.target.value)}
              >
                {ksiOptions.map((ksi) => (
                  <MenuItem key={ksi.id} value={ksi.id}>
                    {ksi.id} - {ksi.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            {ksiDefinition && (
              <Card variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h6" color="primary" gutterBottom>
                    {ksiDefinition.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {ksiDefinition.description}
                  </Typography>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Typography variant="subtitle2" gutterBottom>
                    Related NIST Controls:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                    {ksiDefinition.relatedControls?.map((control) => (
                      <Chip 
                        key={control} 
                        label={control} 
                        size="small" 
                        color="primary" 
                        variant="outlined" 
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            )}
          </Box>
        );
      case 1:
        return (
          <Box sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Implementation Details for {selectedKsi}
            </Typography>
            <Alert severity="info" sx={{ mb: 2 }}>
              Please provide details about how your system implements this security control.
              Include technical specifications, configurations, and any relevant evidence.
            </Alert>
            <TextField
              label="Implementation Details"
              multiline
              rows={10}
              value={implementation}
              onChange={(e) => setImplementation(e.target.value)}
              fullWidth
              variant="outlined"
              placeholder="Describe your implementation..."
              sx={{ mb: 2 }}
            />
          </Box>
        );
      case 2:
        return (
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Validation Results
            </Typography>
            
            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                <CircularProgress />
              </Box>
            ) : validationResult ? (
              <>
                <Alert 
                  severity={validationResult.valid ? "success" : "error"}
                  icon={validationResult.valid ? <CheckCircleIcon /> : <ErrorIcon />}
                  sx={{ mb: 3 }}
                >
                  {validationResult.message}
                </Alert>
                
                {validationResult.details && (
                  <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Validation Details:
                    </Typography>
                    {validationResult.details.map((detail, index) => (
                      <Box key={index} sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          <strong>{detail.issue}</strong>
                        </Typography>
                        <Typography variant="body2">
                          Resolution: {detail.resolution}
                        </Typography>
                      </Box>
                    ))}
                  </Paper>
                )}
                
                {validationResult.valid && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                    <Button
                      variant="contained"
                      color="success"
                      startIcon={<SaveIcon />}
                    >
                      Save Validation Results
                    </Button>
                  </Box>
                )}
              </>
            ) : (
              <Alert severity="warning">
                No validation results available. Please complete the previous steps.
              </Alert>
            )}
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Box sx={{ py: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <VerifiedUserIcon color="primary" sx={{ mr: 1 }} />
        <Typography variant="h4" component="h1">
          KSI Validation
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Tooltip title="Reset">
          <IconButton color="primary" onClick={handleReset}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>
      
      <Paper elevation={2} sx={{ mb: 4 }}>
        <Box sx={{ p: 3 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
        
        <Divider />
        
        <Box>
          {getStepContent(activeStep)}
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              startIcon={<ArrowBackIcon />}
            >
              Back
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleNext}
              endIcon={activeStep === steps.length - 1 ? null : <ArrowForwardIcon />}
              disabled={
                (activeStep === 0 && !selectedKsi) ||
                (activeStep === 1 && !implementation) ||
                activeStep === steps.length - 1
              }
            >
              {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default KsiValidation; 