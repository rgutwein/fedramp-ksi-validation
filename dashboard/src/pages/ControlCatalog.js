import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Tabs, 
  Tab, 
  List, 
  ListItem, 
  ListItemText, 
  Paper, 
  Grid, 
  Divider,
  Chip,
  CircularProgress,
  Card,
  CardContent,
  IconButton,
  InputAdornment,
  TextField,
  useTheme,
  useMediaQuery,
  Stack
} from '@mui/material';
import { 
  Search as SearchIcon,
  FilterList as FilterListIcon,
  OpenInNew as OpenInNewIcon,
  Assignment as AssignmentIcon,
  Security as SecurityIcon
} from '@mui/icons-material';
import { getAllKsis, getAllNistControls, ksis, nistControls } from '../services/ksiService';
import { getControlFamilies } from '../services/mappingService';
import ValidationGuidePanel from '../components/ValidationGuidePanel';

function ControlCatalog() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [controlsData, setControlsData] = useState([]);
  const [ksisData, setKsisData] = useState([]);
  const [selectedControl, setSelectedControl] = useState(null);
  const [selectedKsi, setSelectedKsi] = useState(null);
  const [controlFamilies, setControlFamilies] = useState([]);
  const [selectedFamily, setSelectedFamily] = useState('All');
  const [providers, setProviders] = useState(['All', 'AWS', 'Azure', 'GCP']);
  const [selectedProvider, setSelectedProvider] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const controls = await getAllNistControls();
      const ksiData = await getAllKsis();
      
      // Extract unique control families
      const families = ['All'];
      controls.forEach(control => {
        if (!families.includes(control.family)) {
          families.push(control.family);
        }
      });
      
      setControlsData(controls);
      setKsisData(ksiData);
      setControlFamilies(families);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setSelectedControl(null);
    setSelectedKsi(null);
    setSelectedFamily('All');
    setSelectedProvider('All');
    setSearchTerm('');
  };

  const handleControlClick = (control) => {
    setSelectedControl(control);
    setSelectedKsi(null);
  };

  const handleKSIClick = (ksi) => {
    setSelectedKsi(ksi);
    setSelectedControl(null);
  };

  const handleFamilyChange = (family) => {
    setSelectedFamily(family);
    setSelectedControl(null);
  };

  const handleProviderChange = (provider) => {
    setSelectedProvider(provider);
    setSelectedKsi(null);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'compliant':
        return 'success';
      case 'non-compliant':
        return 'error';
      case 'partial':
        return 'warning';
      default:
        return 'default';
    }
  };

  // Filter controls based on family selection and search term
  const filteredControls = controlsData
    .filter(control => selectedFamily === 'All' || control.family === selectedFamily)
    .filter(control => 
      searchTerm === '' || 
      control.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      control.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      control.family.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Filter KSIs based on provider selection and search term
  const filteredKsis = ksisData
    .filter(ksi => selectedProvider === 'All' || ksi.provider === selectedProvider)
    .filter(ksi => 
      searchTerm === '' || 
      ksi.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ksi.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ksi.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '80vh',
          flexDirection: 'column',
          gap: 2
        }}
      >
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" color="text.secondary">
          Loading compliance data...
        </Typography>
      </Box>
    );
  }

  const renderNistControlDetails = () => {
    if (!selectedControl) {
      return (
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '100%',
          p: 3 
        }}>
          <AssignmentIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Select a control to view details
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center">
            Choose a NIST 800-53 control from the list to view its details and related KSIs
          </Typography>
        </Box>
      );
    }

    return (
      <Box sx={{ p: 2 }}>
        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h5" component="div" gutterBottom>
              {selectedControl.id}: {selectedControl.name}
            </Typography>
            
            <Chip 
              label={selectedControl.family} 
              size="small" 
              color="primary" 
              variant="outlined"
              sx={{ mb: 2 }}
            />
            
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              {selectedControl.description}
            </Typography>
          </CardContent>
        </Card>
        
        <Typography variant="h6" gutterBottom sx={{ mt: 3, display: 'flex', alignItems: 'center' }}>
          <SecurityIcon sx={{ mr: 1 }} />
          Related Key Security Indicators
        </Typography>
        
        {selectedControl.relatedKsis && selectedControl.relatedKsis.length > 0 ? (
          <Stack spacing={2}>
            {selectedControl.relatedKsis.map(ksiId => {
              const ksi = ksisData.find(k => k.id === ksiId);
              return ksi ? (
                <Card 
                  key={ksi.id} 
                  variant="outlined" 
                  sx={{ 
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': {
                      boxShadow: 3,
                      transform: 'translateY(-2px)'
                    }
                  }}
                  onClick={() => handleKSIClick(ksi)}
                >
                  <CardContent sx={{ pb: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                          {ksi.id}: {ksi.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          {ksi.description}
                        </Typography>
                      </Box>
                      <Chip 
                        label={ksi.status} 
                        size="small" 
                        color={getStatusColor(ksi.status)} 
                        sx={{ ml: 1 }}
                      />
                    </Box>
                  </CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', pr: 1, pb: 1 }}>
                    <Chip label={ksi.provider} size="small" variant="outlined" />
                  </Box>
                </Card>
              ) : null;
            })}
          </Stack>
        ) : (
          <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'background.default' }}>
            <Typography variant="body2" color="text.secondary">
              No related KSIs found for this control.
            </Typography>
          </Paper>
        )}
      </Box>
    );
  };

  const renderKsiDetails = () => {
    if (!selectedKsi) {
      return (
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '100%',
          p: 3 
        }}>
          <SecurityIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Select a KSI to view details
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center">
            Choose a Key Security Indicator from the list to view its details and related NIST controls
          </Typography>
        </Box>
      );
    }

    return (
      <Box sx={{ p: 2 }}>
        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', mb: 2 }}>
              <Typography variant="h5" component="div" gutterBottom sx={{ mr: 2 }}>
                {selectedKsi.id}: {selectedKsi.name}
              </Typography>
              <Chip 
                label={selectedKsi.status} 
                color={getStatusColor(selectedKsi.status)} 
                sx={{ mb: 1 }}
              />
            </Box>
            
            <Typography variant="body1" paragraph sx={{ mb: 3 }}>
              {selectedKsi.description}
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Provider:</strong> {selectedKsi.provider}
                </Typography>
              </Grid>
              
              {selectedKsi.frequency && (
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Frequency:</strong> {selectedKsi.frequency}
                  </Typography>
                </Grid>
              )}
              
              {selectedKsi.lastUpdated && (
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Last Updated:</strong> {new Date(selectedKsi.lastUpdated).toLocaleString()}
                  </Typography>
                </Grid>
              )}
              
              {selectedKsi.evidenceSource && (
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Evidence Source:</strong> {selectedKsi.evidenceSource}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>
        
        <ValidationGuidePanel ksiId={selectedKsi.id} />
        
        <Typography variant="h6" gutterBottom sx={{ mt: 3, display: 'flex', alignItems: 'center' }}>
          <AssignmentIcon sx={{ mr: 1 }} />
          Related NIST Controls
        </Typography>
        
        {selectedKsi.relatedControls && selectedKsi.relatedControls.length > 0 ? (
          <Stack spacing={2}>
            {selectedKsi.relatedControls.map(controlId => {
              const control = controlsData.find(c => c.id === controlId);
              return control ? (
                <Card 
                  key={control.id} 
                  variant="outlined" 
                  sx={{ 
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': {
                      boxShadow: 3,
                      transform: 'translateY(-2px)'
                    }
                  }}
                  onClick={() => handleControlClick(control)}
                >
                  <CardContent>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      {control.id}: {control.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Family: {control.family}
                    </Typography>
                  </CardContent>
                </Card>
              ) : null;
            })}
          </Stack>
        ) : (
          <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'background.default' }}>
            <Typography variant="body2" color="text.secondary">
              No related NIST controls found for this KSI.
            </Typography>
          </Paper>
        )}
      </Box>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Control Catalog
      </Typography>
      
      <Paper elevation={0} variant="outlined" sx={{ mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          aria-label="control tabs"
          variant={isMobile ? "fullWidth" : "standard"}
          centered={!isMobile}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab icon={<AssignmentIcon />} iconPosition="start" label="NIST 800-53 CONTROLS" />
          <Tab icon={<SecurityIcon />} iconPosition="start" label="KEY SECURITY INDICATORS (KSIs)" />
        </Tabs>
      </Paper>

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder={tabValue === 0 ? "Search NIST controls..." : "Search KSIs..."}
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton size="small">
                  <FilterListIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {tabValue === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={4} lg={3}>
            <Card variant="outlined" sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Control Families
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <List dense disablePadding>
                  {controlFamilies.map((family) => (
                    <ListItem 
                      button 
                      key={family}
                      selected={selectedFamily === family}
                      onClick={() => handleFamilyChange(family)}
                      disableGutters
                      sx={{ 
                        borderRadius: 1,
                        mb: 0.5,
                        pl: 1,
                        transition: 'all 0.2s',
                        '&.Mui-selected': {
                          bgcolor: 'primary.light',
                          color: 'primary.contrastText',
                          '&:hover': {
                            bgcolor: 'primary.main',
                          }
                        }
                      }}
                    >
                      <ListItemText primary={family} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
            
            <Card variant="outlined" sx={{ height: { md: 'calc(70vh - 160px)' }, overflow: 'auto' }}>
              <CardContent sx={{ p: 1 }}>
                <Typography variant="h6" sx={{ p: 1 }}>
                  Controls {selectedFamily !== 'All' ? `- ${selectedFamily}` : ''}
                </Typography>
                <Divider />
                <List dense disablePadding>
                  {filteredControls.length > 0 ? (
                    filteredControls.map((control) => (
                      <ListItem 
                        button 
                        key={control.id}
                        selected={selectedControl && selectedControl.id === control.id}
                        onClick={() => handleControlClick(control)}
                        sx={{ 
                          borderRadius: 1,
                          m: 0.5,
                          transition: 'all 0.2s',
                          '&.Mui-selected': {
                            bgcolor: 'primary.light',
                            color: 'primary.contrastText',
                            '&:hover': {
                              bgcolor: 'primary.main',
                            }
                          }
                        }}
                      >
                        <ListItemText 
                          primary={`${control.id}: ${control.name}`} 
                          secondary={control.family} 
                          primaryTypographyProps={{
                            variant: 'body2',
                            fontWeight: 'medium'
                          }}
                          secondaryTypographyProps={{
                            variant: 'caption'
                          }}
                        />
                      </ListItem>
                    ))
                  ) : (
                    <Box sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        No controls match your search
                      </Typography>
                    </Box>
                  )}
                </List>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={8} lg={9}>
            <Card 
              variant="outlined" 
              sx={{ 
                height: { md: 'calc(70vh + 24px)' }, 
                overflow: 'auto',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {renderNistControlDetails()}
            </Card>
          </Grid>
        </Grid>
      )}

      {tabValue === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={4} lg={3}>
            <Card variant="outlined" sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Cloud Providers
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <List dense disablePadding>
                  {providers.map((provider) => (
                    <ListItem 
                      button 
                      key={provider}
                      selected={selectedProvider === provider}
                      onClick={() => handleProviderChange(provider)}
                      disableGutters
                      sx={{ 
                        borderRadius: 1,
                        mb: 0.5,
                        pl: 1,
                        transition: 'all 0.2s',
                        '&.Mui-selected': {
                          bgcolor: 'primary.light',
                          color: 'primary.contrastText',
                          '&:hover': {
                            bgcolor: 'primary.main',
                          }
                        }
                      }}
                    >
                      <ListItemText primary={provider} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
            
            <Card variant="outlined" sx={{ height: { md: 'calc(70vh - 160px)' }, overflow: 'auto' }}>
              <CardContent sx={{ p: 1 }}>
                <Typography variant="h6" sx={{ p: 1 }}>
                  Key Security Indicators {selectedProvider !== 'All' ? `- ${selectedProvider}` : ''}
                </Typography>
                <Divider />
                <List dense disablePadding>
                  {filteredKsis.length > 0 ? (
                    filteredKsis.map((ksi) => (
                      <ListItem 
                        button 
                        key={ksi.id}
                        selected={selectedKsi && selectedKsi.id === ksi.id}
                        onClick={() => handleKSIClick(ksi)}
                        sx={{ 
                          borderRadius: 1,
                          m: 0.5,
                          transition: 'all 0.2s',
                          '&.Mui-selected': {
                            bgcolor: 'primary.light',
                            color: 'primary.contrastText',
                            '&:hover': {
                              bgcolor: 'primary.main',
                            }
                          }
                        }}
                      >
                        <ListItemText 
                          primary={`${ksi.id}: ${ksi.name}`} 
                          secondary={ksi.description.substring(0, 60) + (ksi.description.length > 60 ? '...' : '')} 
                          primaryTypographyProps={{
                            variant: 'body2',
                            fontWeight: 'medium'
                          }}
                          secondaryTypographyProps={{
                            variant: 'caption'
                          }}
                        />
                        <Chip 
                          label={ksi.status} 
                          size="small" 
                          color={getStatusColor(ksi.status)} 
                        />
                      </ListItem>
                    ))
                  ) : (
                    <Box sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="body2" color="text.secondary">
                        No KSIs match your search
                      </Typography>
                    </Box>
                  )}
                </List>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={8} lg={9}>
            <Card 
              variant="outlined" 
              sx={{ 
                height: { md: 'calc(70vh + 24px)' }, 
                overflow: 'auto',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {renderKsiDetails()}
            </Card>
          </Grid>
        </Grid>
      )}
    </Container>
  );
}

export default ControlCatalog; 