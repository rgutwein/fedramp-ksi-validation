import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Typography, 
  Box, 
  Paper, 
  CircularProgress,
  Grid
} from '@mui/material';
import { getCloudProviderStatus } from '../services/api';

const ProviderPage = () => {
  const { provider } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, [provider]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const providerData = await getCloudProviderStatus(provider || 'aws');
      setData(providerData);
    } catch (error) {
      console.error('Error fetching provider data:', error);
      setError('Failed to load provider data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  const getProviderName = () => {
    if (!provider) return 'AWS';
    return provider.toUpperCase();
  };

  return (
    <Box sx={{ py: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {getProviderName()} Compliance Status
      </Typography>
      
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Box>
              <Typography variant="h6" gutterBottom>
                Compliance Rate
              </Typography>
              <Typography variant="h3" color={data.compliancePercentage >= 70 ? 'success.main' : 'error.main'}>
                {data.compliancePercentage}%
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={8}>
            <Box>
              <Typography variant="h6" gutterBottom>
                Control Status
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Paper sx={{ p: 2, bgcolor: 'success.light', color: 'white', textAlign: 'center' }}>
                    <Typography variant="h4">{data.compliantControls}</Typography>
                    <Typography variant="body2">Compliant</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={4}>
                  <Paper sx={{ p: 2, bgcolor: 'warning.light', color: 'white', textAlign: 'center' }}>
                    <Typography variant="h4">{data.partialControls}</Typography>
                    <Typography variant="body2">Partial</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={4}>
                  <Paper sx={{ p: 2, bgcolor: 'error.light', color: 'white', textAlign: 'center' }}>
                    <Typography variant="h4">{data.nonCompliantControls}</Typography>
                    <Typography variant="body2">Non-Compliant</Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Paper>
      
      <Typography variant="h5" gutterBottom>
        Controls List
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Total of {data.totalControls} controls assessed
      </Typography>
      
      <Paper elevation={2} sx={{ p: 2 }}>
        <Typography variant="body1" align="center" sx={{ py: 10 }}>
          Controls list would appear here
        </Typography>
      </Paper>
    </Box>
  );
};

export default ProviderPage; 