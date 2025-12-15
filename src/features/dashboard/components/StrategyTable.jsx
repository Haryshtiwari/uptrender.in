import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Chip,
  Box,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Snackbar,
} from "@mui/material";
import {
  MoreHoriz,
  PlayArrow,
  Pause,
  Settings,
  Visibility,
  ContentCopy,
  Delete,
  Close,
  Public,
  PublicOff,
} from "@mui/icons-material";
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import Scrollbar from "../../../components/custom-scroll/Scrollbar";
import { adminStrategyService } from "../../../services/adminStrategyService";

export default function StrategyTable({ searchTerm, filterStatus, onRefresh }) {
  const navigate = useNavigate();
  const [strategies, setStrategies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuStrategyId, setMenuStrategyId] = useState(null);
  const [selectedStrategy, setSelectedStrategy] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const fetchStrategies = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {
        limit: 50,
        search: searchTerm || undefined,
      };
      
      if (filterStatus && filterStatus !== 'all') {
        if (filterStatus === 'active') params.isActive = 'true';
        else if (filterStatus === 'paused') params.isRunning = 'false';
        else if (filterStatus === 'stopped') params.isActive = 'false';
      }
      
      const result = await adminStrategyService.getAllStrategies(params);
      
      if (result.success) {
        setStrategies(result.data?.strategies || []);
      } else {
        setError(result.message || 'Failed to fetch strategies');
      }
    } catch (err) {
      console.error('Error fetching strategies:', err);
      setError('An error occurred while fetching strategies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStrategies();
  }, [searchTerm, filterStatus]);

  const handleMenuOpen = (event, strategy) => {
    setAnchorEl(event.currentTarget);
    setMenuStrategyId(strategy.id);
    setSelectedStrategy(strategy);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuStrategyId(null);
  };

  const handleToggleStatus = async (field) => {
    if (!selectedStrategy) return;
    
    setActionLoading(true);
    try {
      const result = await adminStrategyService.toggleStrategyStatus(selectedStrategy.id, field);
      if (result.success) {
        setSnackbar({ open: true, message: result.message || 'Status updated successfully', severity: 'success' });
        fetchStrategies();
        if (onRefresh) onRefresh();
      } else {
        setSnackbar({ open: true, message: result.message || 'Failed to update status', severity: 'error' });
      }
    } catch (err) {
      setSnackbar({ open: true, message: 'Error updating status', severity: 'error' });
    } finally {
      setActionLoading(false);
      handleMenuClose();
    }
  };

  const handleDeleteStrategy = async () => {
    if (!selectedStrategy) return;
    
    setActionLoading(true);
    try {
      const result = await adminStrategyService.deleteStrategy(selectedStrategy.id);
      if (result.success) {
        setSnackbar({ open: true, message: 'Strategy deleted successfully', severity: 'success' });
        setDeleteDialogOpen(false);
        fetchStrategies();
        if (onRefresh) onRefresh();
      } else {
        setSnackbar({ open: true, message: result.message || 'Failed to delete strategy', severity: 'error' });
      }
    } catch (err) {
      setSnackbar({ open: true, message: 'Error deleting strategy', severity: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusChip = (strategy) => {
    if (!strategy.isActive) {
      return <Chip label="Inactive" color="error" size="small" />;
    }
    if (strategy.isRunning) {
      return <Chip label="Running" color="success" size="small" />;
    }
    return <Chip label="Active" color="info" size="small" />;
  };

  const getSegmentChip = (segment) => {
    const colors = {
      OPTIONS: 'primary',
      EQUITY: 'success',
      FUTURES: 'warning',
      COMMODITY: 'secondary',
    };
    return (
      <Chip
        label={segment || 'N/A'}
        color={colors[segment?.toUpperCase()] || 'default'}
        variant="outlined"
        size="small"
      />
    );
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" py={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ my: 2 }}>
        {error}
        <Button size="small" onClick={fetchStrategies} sx={{ ml: 2 }}>Retry</Button>
      </Alert>
    );
  }

  if (strategies.length === 0) {
    return (
      <Box textAlign="center" py={4}>
        <Typography color="textSecondary">
          {searchTerm ? 'No strategies found matching your search.' : 'No strategies available.'}
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Paper>
        <Scrollbar sx={{ maxHeight: 605, overflowX: "auto" }}>
          <TableContainer>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Strategy</TableCell>
                  <TableCell>Owner</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Segment</TableCell>
                  <TableCell>Capital</TableCell>
                  <TableCell>Visibility</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {strategies.map((strategy) => (
                  <TableRow key={strategy.id} hover>
                    <TableCell>
                      <Typography fontWeight="bold">{strategy.name}</Typography>
                      <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 200 }}>
                        {strategy.description || 'No description'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{strategy.user?.name || 'Unknown'}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {strategy.user?.email || ''}
                      </Typography>
                    </TableCell>
                    <TableCell>{getStatusChip(strategy)}</TableCell>
                    <TableCell>{getSegmentChip(strategy.segment)}</TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={500}>
                        ₹{Number(strategy.capital || 0).toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={strategy.isPublic ? <Public fontSize="small" /> : <PublicOff fontSize="small" />}
                        label={strategy.isPublic ? 'Public' : 'Private'}
                        color={strategy.isPublic ? 'success' : 'default'}
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {strategy.createdAt 
                          ? formatDistanceToNow(new Date(strategy.createdAt), { addSuffix: true })
                          : 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={(e) => handleMenuOpen(e, strategy)}>
                        <MoreHoriz fontSize="small" />
                      </IconButton>
                      <Menu
                        anchorEl={anchorEl}
                        open={menuStrategyId === strategy.id}
                        onClose={handleMenuClose}
                        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                        transformOrigin={{ vertical: "top", horizontal: "right" }}
                      >
                        <MenuItem onClick={() => { handleMenuClose(); navigate(`/admin/strategies/${strategy.id}`); }}>
                          <Visibility fontSize="small" sx={{ mr: 1 }} /> View Details
                        </MenuItem>
                        <MenuItem onClick={() => handleToggleStatus('isRunning')} disabled={actionLoading}>
                          {strategy.isRunning ? (
                            <>
                              <Pause fontSize="small" sx={{ mr: 1 }} /> Stop Strategy
                            </>
                          ) : (
                            <>
                              <PlayArrow fontSize="small" sx={{ mr: 1 }} /> Start Strategy
                            </>
                          )}
                        </MenuItem>
                        <MenuItem onClick={() => handleToggleStatus('isActive')} disabled={actionLoading}>
                          {strategy.isActive ? (
                            <>
                              <Pause fontSize="small" sx={{ mr: 1 }} /> Deactivate
                            </>
                          ) : (
                            <>
                              <PlayArrow fontSize="small" sx={{ mr: 1 }} /> Activate
                            </>
                          )}
                        </MenuItem>
                        <MenuItem onClick={() => handleToggleStatus('isPublic')} disabled={actionLoading}>
                          {strategy.isPublic ? (
                            <>
                              <PublicOff fontSize="small" sx={{ mr: 1 }} /> Make Private
                            </>
                          ) : (
                            <>
                              <Public fontSize="small" sx={{ mr: 1 }} /> Make Public
                            </>
                          )}
                        </MenuItem>
                        <MenuItem 
                          onClick={() => { handleMenuClose(); setDeleteDialogOpen(true); }} 
                          sx={{ color: "error.main" }}
                        >
                          <Delete fontSize="small" sx={{ mr: 1 }} /> Delete
                        </MenuItem>
                      </Menu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete strategy <strong>{selectedStrategy?.name}</strong>? 
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            color="error" 
            onClick={handleDeleteStrategy}
            disabled={actionLoading}
            startIcon={actionLoading ? <CircularProgress size={16} /> : <Delete />}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
