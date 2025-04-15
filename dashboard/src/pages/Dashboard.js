import React, { useState, useEffect } from 'react';
import { 
  Grid, 
  Paper, 
  Typography, 
  Box,
  Card,
  CardContent,
  Button,
  Avatar,
  Divider,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  Refresh as RefreshIcon,
  CloudDone as CloudDoneIcon,
  CloudOff as CloudOffIcon,
  ArrowForward as ArrowForwardIcon,
  ErrorOutline as ErrorOutlineIcon, 
  CheckCircleOutline as CheckCircleOutlineIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getCloudProviderStatus } from '../services/api';
import ComplianceStatusCard from '../components/ComplianceStatusCard';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer 
} from 'recharts';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Mock data since we don't have getMockComplianceData yet
      const mockData = {
        aws: {
          complianceScore: 78,
          controlStatus: {
            compliant: 35,
            partial: 12,
            nonCompliant: 8
          }
        },
        azure: {
          complianceScore: 82,
          controlStatus: {
            compliant: 38,
            partial: 10,
            nonCompliant: 5
          }
        },
        gcp: {
          complianceScore: 75,
          controlStatus: {
            compliant: 32,
            partial: 15,
            nonCompliant: 10
          }
        }
      };
      setData(mockData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const processControlData = (controls) => {
    return controls.map(control => ({
      ...control,
      date: new Date(control.date).toLocaleDateString()
    }));
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleRefresh = async () => {
    await fetchData();
  };

  const handleProviderClick = (provider) => {
    navigate(`/provider/${provider.toLowerCase()}`);
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

  const getStatusChip = (status) => {
    const color = status === 'compliant' ? 'green' : 
                  status === 'partial' ? 'orange' : 'red';
    
    return (
      <Box 
        component="span" 
        sx={{ 
          backgroundColor: color, 
          color: 'white', 
          px: 1, 
          py: 0.5, 
          borderRadius: 1,
          fontSize: '0.75rem'
        }}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Box>
    );
  };

  const chartData = [
    { 
      name: 'AWS', 
      Compliant: data.aws.controlStatus.compliant, 
      'Non-Compliant': data.aws.controlStatus.nonCompliant,
      'Partial': data.aws.controlStatus.partial
    },
    { 
      name: 'Azure', 
      Compliant: data.azure.controlStatus.compliant, 
      'Non-Compliant': data.azure.controlStatus.nonCompliant,
      'Partial': data.azure.controlStatus.partial
    },
    { 
      name: 'GCP', 
      Compliant: data.gcp.controlStatus.compliant, 
      'Non-Compliant': data.gcp.controlStatus.nonCompliant,
      'Partial': data.gcp.controlStatus.partial
    }
  ];

  return (
    <Box sx={{ py: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        FedRAMP Controls Validation Dashboard
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
        Visualizing compliance status across cloud service providers
      </Typography>

      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          CSP Compliance Comparison
        </Typography>
        <Box sx={{ height: 300, mt: 3 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <RechartsTooltip />
              <Bar dataKey="Compliant" stackId="a" fill="#4caf50" />
              <Bar dataKey="Non-Compliant" stackId="a" fill="#f44336" />
              <Bar dataKey="Partial" stackId="a" fill="#ff9800" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">
          Cloud Service Providers
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => navigate('/ksi-validation')}
        >
          Validate KSIs
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* AWS Card */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              AWS
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="body2">Compliance Rate: </Typography>
              <Typography variant="body1" fontWeight="bold" sx={{ ml: 1 }}>
                {data.aws.complianceScore}%
              </Typography>
              <Box 
                sx={{ 
                  ml: 1, 
                  flex: 1, 
                  height: 8, 
                  borderRadius: 5, 
                  bgcolor: '#e0e0e0',
                  overflow: 'hidden'
                }}
              >
                <Box 
                  sx={{ 
                    width: `${data.aws.complianceScore}%`, 
                    height: '100%', 
                    bgcolor: data.aws.complianceScore > 80 ? '#4caf50' : 
                              data.aws.complianceScore > 60 ? '#ff9800' : '#f44336'
                  }}
                />
              </Box>
            </Box>
            <Typography variant="body2" sx={{ mb: 2 }}>
              {data.aws.controlStatus.compliant} of {data.aws.controlStatus.compliant + data.aws.controlStatus.nonCompliant + data.aws.controlStatus.partial} controls implemented
            </Typography>
            <Button size="small" variant="outlined" onClick={() => handleProviderClick('aws')}>
              View Details
            </Button>
          </Paper>
        </Grid>
        
        {/* Azure Card */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              AZURE
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="body2">Compliance Rate: </Typography>
              <Typography variant="body1" fontWeight="bold" sx={{ ml: 1 }}>
                {data.azure.complianceScore}%
              </Typography>
              <Box 
                sx={{ 
                  ml: 1, 
                  flex: 1, 
                  height: 8, 
                  borderRadius: 5, 
                  bgcolor: '#e0e0e0',
                  overflow: 'hidden'
                }}
              >
                <Box 
                  sx={{ 
                    width: `${data.azure.complianceScore}%`, 
                    height: '100%', 
                    bgcolor: data.azure.complianceScore > 80 ? '#4caf50' : 
                              data.azure.complianceScore > 60 ? '#ff9800' : '#f44336'
                  }}
                />
              </Box>
            </Box>
            <Typography variant="body2" sx={{ mb: 2 }}>
              {data.azure.controlStatus.compliant} of {data.azure.controlStatus.compliant + data.azure.controlStatus.nonCompliant + data.azure.controlStatus.partial} controls implemented
            </Typography>
            <Button size="small" variant="outlined" onClick={() => handleProviderClick('azure')}>
              View Details
            </Button>
          </Paper>
        </Grid>
        
        {/* GCP Card */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              GCP
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="body2">Compliance Rate: </Typography>
              <Typography variant="body1" fontWeight="bold" sx={{ ml: 1 }}>
                {data.gcp.complianceScore}%
              </Typography>
              <Box 
                sx={{ 
                  ml: 1, 
                  flex: 1, 
                  height: 8, 
                  borderRadius: 5, 
                  bgcolor: '#e0e0e0',
                  overflow: 'hidden'
                }}
              >
                <Box 
                  sx={{ 
                    width: `${data.gcp.complianceScore}%`, 
                    height: '100%', 
                    bgcolor: data.gcp.complianceScore > 80 ? '#4caf50' : 
                              data.gcp.complianceScore > 60 ? '#ff9800' : '#f44336'
                  }}
                />
              </Box>
            </Box>
            <Typography variant="body2" sx={{ mb: 2 }}>
              {data.gcp.controlStatus.compliant} of {data.gcp.controlStatus.compliant + data.gcp.controlStatus.nonCompliant + data.gcp.controlStatus.partial} controls implemented
            </Typography>
            <Button size="small" variant="outlined" onClick={() => handleProviderClick('gcp')}>
              View Details
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 