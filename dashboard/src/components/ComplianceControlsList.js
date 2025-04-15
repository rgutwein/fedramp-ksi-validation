import React, { useState } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography
} from '@mui/material';
import {
  Search as SearchIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  FilterList as FilterListIcon,
  Clear as ClearIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const ComplianceControlsList = ({ controls }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedControl, setSelectedControl] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
    setPage(0);
  };

  const handleOpenDetails = (control) => {
    setSelectedControl(control);
    setDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailsOpen(false);
  };

  const handleFilterChange = (status) => {
    setFilterStatus(status);
    setPage(0);
  };

  const filteredControls = controls.filter(control => {
    const matchesSearch = 
      control.id.toLowerCase().includes(searchTerm) ||
      control.name.toLowerCase().includes(searchTerm) ||
      control.description.toLowerCase().includes(searchTerm);
    
    const matchesFilter = 
      filterStatus === 'all' || 
      control.status.toLowerCase() === filterStatus.toLowerCase();
    
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
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

  const getStatusIcon = (status) => {
    switch(status.toLowerCase()) {
      case 'compliant':
        return <CheckCircleIcon fontSize="small" color="success" />;
      case 'non-compliant':
        return <ErrorIcon fontSize="small" color="error" />;
      default:
        return <InfoIcon fontSize="small" color="info" />;
    }
  };

  return (
    <>
      <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
        <TextField
          size="small"
          variant="outlined"
          placeholder="Search controls..."
          value={searchTerm}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={() => setSearchTerm('')}
                  aria-label="clear search"
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            )
          }}
          sx={{ flexGrow: 1, minWidth: '200px' }}
        />
        
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <FilterListIcon fontSize="small" color="action" />
          <Chip
            label="All"
            clickable
            color={filterStatus === 'all' ? 'primary' : 'default'}
            onClick={() => handleFilterChange('all')}
            size="small"
          />
          <Chip
            label="Compliant"
            clickable
            color={filterStatus === 'compliant' ? 'success' : 'default'}
            onClick={() => handleFilterChange('compliant')}
            size="small"
          />
          <Chip
            label="Non-Compliant"
            clickable
            color={filterStatus === 'non-compliant' ? 'error' : 'default'}
            onClick={() => handleFilterChange('non-compliant')}
            size="small"
          />
          <Chip
            label="Partial"
            clickable
            color={filterStatus === 'partial' ? 'warning' : 'default'}
            onClick={() => handleFilterChange('partial')}
            size="small"
          />
        </Box>
      </Box>

      <Paper elevation={2}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Control ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Last Updated</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredControls
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((control) => (
                  <TableRow key={control.id} hover>
                    <TableCell component="th" scope="row">
                      {control.id}
                    </TableCell>
                    <TableCell>{control.name}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getStatusIcon(control.status)}
                        <Chip 
                          label={control.status} 
                          size="small" 
                          color={getStatusColor(control.status)} 
                        />
                      </Box>
                    </TableCell>
                    <TableCell>
                      {new Date(control.lastUpdated).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        <Tooltip title="View Details">
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => handleOpenDetails(control)}
                          >
                            Details
                          </Button>
                        </Tooltip>
                        <Tooltip title="Go to Control Page">
                          <Button
                            size="small"
                            variant="contained"
                            color="primary"
                            component={Link}
                            to={`/controls/${control.id}`}
                            endIcon={<ArrowForwardIcon />}
                          >
                            View
                          </Button>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              {filteredControls.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography variant="body1" sx={{ py: 2 }}>
                      No controls found matching your search criteria.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredControls.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Control Details Dialog */}
      <Dialog
        open={detailsOpen}
        onClose={handleCloseDetails}
        maxWidth="md"
        fullWidth
      >
        {selectedControl && (
          <>
            <DialogTitle>
              Control Details: {selectedControl.id}
              <Chip
                label={selectedControl.status}
                color={getStatusColor(selectedControl.status)}
                size="small"
                sx={{ ml: 2 }}
              />
            </DialogTitle>
            <DialogContent dividers>
              <Typography variant="h6" gutterBottom>
                {selectedControl.name}
              </Typography>
              
              <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                Description
              </Typography>
              <Typography variant="body2" paragraph>
                {selectedControl.description}
              </Typography>
              
              <Typography variant="subtitle1" gutterBottom>
                Implementation Status
              </Typography>
              <Typography variant="body2" paragraph>
                {selectedControl.implementationDetails || 
                  "No implementation details available."
                }
              </Typography>
              
              {selectedControl.relatedControls && (
                <>
                  <Typography variant="subtitle1" gutterBottom>
                    Related Controls
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {selectedControl.relatedControls.map(relatedControl => (
                      <Chip
                        key={relatedControl}
                        label={relatedControl}
                        size="small"
                        variant="outlined"
                        color="primary"
                      />
                    ))}
                  </Box>
                </>
              )}
              
              <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                Last Updated
              </Typography>
              <Typography variant="body2">
                {new Date(selectedControl.lastUpdated).toLocaleString()}
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDetails}>Close</Button>
              <Button 
                variant="contained" 
                color="primary"
                component={Link}
                to={`/controls/${selectedControl.id}`}
                onClick={handleCloseDetails}
              >
                View Full Details
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  );
};

export default ComplianceControlsList; 