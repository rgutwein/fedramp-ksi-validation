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
  CircularProgress
} from '@mui/material';
import { getAllKsis, getAllNistControls, ksis, nistControls } from '../services/ksiService';

function ControlCatalog() {
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [controlsData, setControlsData] = useState([]);
  const [ksisData, setKsisData] = useState([]);
  const [selectedControl, setSelectedControl] = useState(null);
  const [selectedKsi, setSelectedKsi] = useState(null);
  const [controlFamilies, setControlFamilies] = useState([]);
  const [selectedFamily, setSelectedFamily] = useState('All');

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

  const filteredControls = selectedFamily === 'All' 
    ? controlsData 
    : controlsData.filter(control => control.family === selectedFamily);

  if (loading) {
    return (
      <Container sx={{ mt: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Control Catalog
      </Typography>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="control tabs">
          <Tab label="NIST 800-53 Controls" />
          <Tab label="Key Security Indicators (KSIs)" />
        </Tabs>
      </Box>

      {tabValue === 0 && (
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                Control Families
              </Typography>
              <List dense>
                {controlFamilies.map((family) => (
                  <ListItem 
                    button 
                    key={family}
                    selected={selectedFamily === family}
                    onClick={() => handleFamilyChange(family)}
                  >
                    <ListItemText primary={family} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 2, height: '70vh', overflow: 'auto' }}>
              <Typography variant="h6" gutterBottom>
                Controls {selectedFamily !== 'All' ? `- ${selectedFamily}` : ''}
              </Typography>
              <List dense>
                {filteredControls.map((control) => (
                  <ListItem 
                    button 
                    key={control.id}
                    selected={selectedControl && selectedControl.id === control.id}
                    onClick={() => handleControlClick(control)}
                  >
                    <ListItemText 
                      primary={`${control.id}: ${control.name}`} 
                      secondary={control.family} 
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={5}>
            <Paper elevation={2} sx={{ p: 2, height: '70vh', overflow: 'auto' }}>
              {selectedControl ? (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    {selectedControl.id}: {selectedControl.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Family: {selectedControl.family}
                  </Typography>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Typography variant="subtitle1" gutterBottom>
                    Related KSIs:
                  </Typography>
                  
                  {selectedControl.relatedKsis && selectedControl.relatedKsis.length > 0 ? (
                    <List dense>
                      {selectedControl.relatedKsis.map(ksiId => {
                        const ksi = ksisData.find(k => k.id === ksiId);
                        return ksi ? (
                          <ListItem button key={ksi.id} onClick={() => handleKSIClick(ksi)}>
                            <ListItemText 
                              primary={`${ksi.id}: ${ksi.name}`} 
                              secondary={ksi.description} 
                            />
                            <Chip 
                              label={ksi.status} 
                              size="small" 
                              color={getStatusColor(ksi.status)} 
                            />
                          </ListItem>
                        ) : null;
                      })}
                    </List>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No related KSIs found.
                    </Typography>
                  )}
                </Box>
              ) : (
                <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', mt: 10 }}>
                  Select a control to view details
                </Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      )}

      {tabValue === 1 && (
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 2, height: '70vh', overflow: 'auto' }}>
              <Typography variant="h6" gutterBottom>
                Key Security Indicators (KSIs)
              </Typography>
              <List dense>
                {ksisData.map((ksi) => (
                  <ListItem 
                    button 
                    key={ksi.id}
                    selected={selectedKsi && selectedKsi.id === ksi.id}
                    onClick={() => handleKSIClick(ksi)}
                  >
                    <ListItemText 
                      primary={`${ksi.id}: ${ksi.name}`} 
                      secondary={ksi.description.substring(0, 60) + (ksi.description.length > 60 ? '...' : '')} 
                    />
                    <Chip 
                      label={ksi.status} 
                      size="small" 
                      color={getStatusColor(ksi.status)} 
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 2, height: '70vh', overflow: 'auto' }}>
              {selectedKsi ? (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    {selectedKsi.id}: {selectedKsi.name}
                  </Typography>
                  <Chip 
                    label={selectedKsi.status} 
                    color={getStatusColor(selectedKsi.status)} 
                    sx={{ mb: 2 }}
                  />
                  <Typography variant="body1" paragraph>
                    {selectedKsi.description}
                  </Typography>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Typography variant="subtitle1" gutterBottom>
                    Related NIST Controls:
                  </Typography>
                  
                  {selectedKsi.relatedControls && selectedKsi.relatedControls.length > 0 ? (
                    <List dense>
                      {selectedKsi.relatedControls.map(controlId => {
                        const control = controlsData.find(c => c.id === controlId);
                        return control ? (
                          <ListItem button key={control.id} onClick={() => handleControlClick(control)}>
                            <ListItemText 
                              primary={`${control.id}: ${control.name}`} 
                              secondary={control.family} 
                            />
                          </ListItem>
                        ) : null;
                      })}
                    </List>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No related controls found.
                    </Typography>
                  )}
                </Box>
              ) : (
                <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', mt: 10 }}>
                  Select a KSI to view details
                </Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      )}
    </Container>
  );
}

export default ControlCatalog; 