import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  CircularProgress,
  Button,
  Divider,
  Tooltip,
  IconButton
} from '@mui/material';
import { 
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  ArrowForward as ArrowForwardIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const ComplianceStatusCard = ({ title, counts, lastUpdated, onRefresh }) => {
  const navigate = useNavigate();
  
  const totalControls = counts.compliant + counts.nonCompliant + counts.partiallyCompliant;
  const complianceRate = totalControls > 0 
    ? Math.round((counts.compliant / totalControls) * 100) 
    : 0;
  
  const getComplianceColor = (rate) => {
    if (rate >= 90) return 'success.main';
    if (rate >= 70) return 'warning.main';
    return 'error.main';
  };
  
  const getComplianceText = (rate) => {
    if (rate >= 90) return 'High';
    if (rate >= 70) return 'Medium';
    return 'Low';
  };
  
  const getStatusIcon = (status) => {
    switch(status) {
      case 'compliant':
        return <CheckCircleIcon sx={{ color: 'success.main' }} />;
      case 'non-compliant':
        return <ErrorIcon sx={{ color: 'error.main' }} />;
      case 'partially-compliant':
        return <WarningIcon sx={{ color: 'warning.main' }} />;
      default:
        return <InfoIcon color="info" />;
    }
  };

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        boxShadow: 2,
        position: 'relative'
      }}
    >
      {onRefresh && (
        <Tooltip title="Refresh data" placement="top">
          <IconButton 
            size="small" 
            sx={{ position: 'absolute', top: 8, right: 8 }}
            onClick={onRefresh}
          >
            <RefreshIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
      
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Typography variant="h6" component="div" gutterBottom>
          {title} Compliance
        </Typography>
        
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          position: 'relative',
          my: 3,
          height: 150
        }}>
          <CircularProgress
            variant="determinate"
            value={100}
            size={120}
            thickness={4}
            sx={{ color: 'grey.200', position: 'absolute' }}
          />
          <CircularProgress
            variant="determinate"
            value={complianceRate}
            size={120}
            thickness={4}
            sx={{ color: getComplianceColor(complianceRate), position: 'absolute' }}
          />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="h4" component="div" color={getComplianceColor(complianceRate)}>
              {complianceRate}%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {getComplianceText(complianceRate)} Compliance
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 1 }} />
        
        <Box sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            {getStatusIcon('compliant')}
            <Typography variant="body2" sx={{ ml: 1 }}>
              Compliant: <strong>{counts.compliant}</strong>
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            {getStatusIcon('non-compliant')}
            <Typography variant="body2" sx={{ ml: 1 }}>
              Non-Compliant: <strong>{counts.nonCompliant}</strong>
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {getStatusIcon('partially-compliant')}
            <Typography variant="body2" sx={{ ml: 1 }}>
              Partially Compliant: <strong>{counts.partiallyCompliant}</strong>
            </Typography>
          </Box>
        </Box>
      </CardContent>
      
      <Box sx={{ p: 2, pt: 0 }}>
        <Typography variant="caption" color="text.secondary" display="block">
          Last updated: {new Date(lastUpdated).toLocaleString()}
        </Typography>
        
        <Button 
          size="small" 
          endIcon={<ArrowForwardIcon />} 
          sx={{ mt: 1 }}
          onClick={() => navigate(`/provider/${title.toLowerCase()}`)}
          fullWidth
        >
          View Details
        </Button>
      </Box>
    </Card>
  );
};

export default ComplianceStatusCard; 