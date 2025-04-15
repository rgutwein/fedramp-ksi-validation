import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Tabs,
  Tab,
  Divider,
  Paper,
  List,
  ListItem,
  ListItemText,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Button,
  Tooltip
} from '@mui/material';
import {
  ContentCopy as CopyIcon,
  Code as CodeIcon,
  Settings as SettingsIcon,
  Check as CheckIcon,
  Terminal as TerminalIcon
} from '@mui/icons-material';
import { getValidationGuide } from '../services/validationUtils';

const ValidationGuidePanel = ({ ksiId }) => {
  const [activePlatform, setActivePlatform] = useState('aws');
  const [copied, setCopied] = useState(null);

  const validationGuide = getValidationGuide(ksiId);

  if (!validationGuide) {
    return (
      <Paper variant="outlined" sx={{ p: 3, mt: 3, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          No validation guides available for this KSI.
        </Typography>
      </Paper>
    );
  }

  const platforms = Object.keys(validationGuide).filter(key => 
    !['title', 'description'].includes(key)
  );

  const handlePlatformChange = (event, newValue) => {
    setActivePlatform(newValue);
  };

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopied(index);
    setTimeout(() => setCopied(null), 2000);
  };

  const renderPlatformValidation = () => {
    const platformGuides = validationGuide[activePlatform];
    
    if (!platformGuides || platformGuides.length === 0) {
      return (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            No validation guides available for {activePlatform.toUpperCase()}.
          </Typography>
        </Box>
      );
    }

    return (
      <List sx={{ width: '100%' }} disablePadding>
        {platformGuides.map((guide, index) => (
          <ListItem 
            key={index} 
            alignItems="flex-start"
            disablePadding
            sx={{ 
              flexDirection: 'column', 
              alignItems: 'stretch',
              mb: 2,
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
              overflow: 'hidden'
            }}
          >
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                bgcolor: 'background.default',
                px: 2,
                py: 1
              }}
            >
              {guide.type === 'command' ? (
                <TerminalIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
              ) : (
                <SettingsIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
              )}
              <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
                {guide.description}
              </Typography>
              <Chip 
                size="small" 
                label={guide.type.toUpperCase()} 
                color={guide.type === 'command' ? 'primary' : 'secondary'} 
                variant="outlined"
              />
            </Box>
            <Divider />
            <Box sx={{ position: 'relative' }}>
              <Paper
                component="pre"
                elevation={0}
                sx={{
                  p: 2,
                  m: 0,
                  borderRadius: 0,
                  bgcolor: guide.type === 'command' ? 'grey.900' : 'grey.100',
                  color: guide.type === 'command' ? 'grey.100' : 'grey.900',
                  fontSize: '0.875rem',
                  fontFamily: 'monospace',
                  overflowX: 'auto',
                  width: '100%'
                }}
              >
                {guide.value}
              </Paper>
              <Tooltip title={copied === index ? "Copied!" : "Copy to clipboard"}>
                <IconButton 
                  size="small" 
                  sx={{ 
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    color: guide.type === 'command' ? 'grey.100' : 'grey.700',
                    bgcolor: guide.type === 'command' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                    '&:hover': {
                      bgcolor: guide.type === 'command' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
                    }
                  }}
                  onClick={() => handleCopy(guide.value, index)}
                >
                  {copied === index ? <CheckIcon fontSize="small" /> : <CopyIcon fontSize="small" />}
                </IconButton>
              </Tooltip>
            </Box>
          </ListItem>
        ))}
      </List>
    );
  };

  return (
    <Card variant="outlined" sx={{ mt: 3 }}>
      <CardContent sx={{ p: 0 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2, pt: 2 }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <CodeIcon sx={{ mr: 1 }} />
            Validation Guide
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            {validationGuide.description}
          </Typography>
          <Tabs
            value={activePlatform}
            onChange={handlePlatformChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ mb: -1 }}
          >
            {platforms.map(platform => (
              <Tab 
                key={platform}
                label={platform.toUpperCase()}
                value={platform}
                sx={{ textTransform: 'uppercase' }}
              />
            ))}
          </Tabs>
        </Box>
        
        <Box sx={{ p: 2 }}>
          {renderPlatformValidation()}
        </Box>
      </CardContent>
    </Card>
  );
};

export default ValidationGuidePanel; 