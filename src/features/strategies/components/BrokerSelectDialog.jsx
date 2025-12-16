import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Checkbox,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Chip,
  CircularProgress,
  Alert,
  Divider,
  IconButton,
} from '@mui/material';
import {
  Close as CloseIcon,
  AccountBalance as BrokerIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import apiKeyService from '../../../services/apiKeyService';
import strategyBrokerService from '../../../services/strategyBrokerService';
import { useToast } from '../../../hooks/useToast';

const BrokerSelectDialog = ({ open, onClose, strategy, onSuccess }) => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [apiKeys, setApiKeys] = useState([]);
  const [selectedBrokers, setSelectedBrokers] = useState([]);
  const [initialBrokers, setInitialBrokers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open && strategy) {
      fetchData();
    }
  }, [open, strategy]);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      // Fetch user's API keys
      const apiKeysResponse = await apiKeyService.getApiKeys();
      const allApiKeys = apiKeysResponse.data || [];
      
      // Filter only active API keys
      const activeApiKeys = allApiKeys.filter(key => key.isActive || key.status === 'Active');
      setApiKeys(activeApiKeys);

      // Fetch currently selected brokers for this strategy
      try {
        const brokersResponse = await strategyBrokerService.getStrategyBrokers(strategy.id);
        const currentBrokers = brokersResponse.data || [];
        const currentApiKeyIds = currentBrokers.map(b => b.apiKeyId);
        setSelectedBrokers(currentApiKeyIds);
        setInitialBrokers(currentApiKeyIds);
      } catch (err) {
        // If no brokers are set yet, that's okay
        setSelectedBrokers([]);
        setInitialBrokers([]);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.error || 'Failed to load broker data');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBroker = (apiKeyId) => {
    setSelectedBrokers(prev => {
      if (prev.includes(apiKeyId)) {
        return prev.filter(id => id !== apiKeyId);
      } else {
        return [...prev, apiKeyId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedBrokers.length === apiKeys.length) {
      setSelectedBrokers([]);
    } else {
      setSelectedBrokers(apiKeys.map(key => key.id));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      // Use bulk update endpoint to replace all brokers
      await strategyBrokerService.addMultipleBrokersToStrategy(strategy.id, selectedBrokers);
      
      showToast('Brokers updated successfully', 'success');
      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (err) {
      console.error('Error saving brokers:', err);
      setError(err.error || 'Failed to update brokers');
      showToast(err.error || 'Failed to update brokers', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    if (!saving) {
      onClose();
    }
  };

  const hasChanges = JSON.stringify(selectedBrokers.sort()) !== JSON.stringify(initialBrokers.sort());

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="sm" 
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={1}>
            <BrokerIcon color="primary" />
            <Typography variant="h6">Select Brokers for Strategy</Typography>
          </Box>
          <IconButton onClick={handleClose} size="small" disabled={saving}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <Divider />

      <DialogContent>
        {strategy && (
          <Box mb={2}>
            <Typography variant="body2" color="text.secondary">
              Strategy: <strong>{strategy.name}</strong>
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Select which brokers/API keys should be used for this strategy
            </Typography>
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        ) : apiKeys.length === 0 ? (
          <Alert severity="info">
            No active API keys found. Please add an API key first to connect a broker to this strategy.
          </Alert>
        ) : (
          <>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="body2" color="text.secondary">
                {selectedBrokers.length} of {apiKeys.length} broker(s) selected
              </Typography>
              <Button 
                size="small" 
                onClick={handleSelectAll}
                disabled={saving}
              >
                {selectedBrokers.length === apiKeys.length ? 'Deselect All' : 'Select All'}
              </Button>
            </Box>

            <List sx={{ bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
              {apiKeys.map((apiKey, index) => {
                const isSelected = selectedBrokers.includes(apiKey.id);
                return (
                  <React.Fragment key={apiKey.id}>
                    {index > 0 && <Divider />}
                    <ListItem disablePadding>
                      <ListItemButton 
                        onClick={() => handleToggleBroker(apiKey.id)}
                        disabled={saving}
                        dense
                      >
                        <ListItemIcon>
                          <Checkbox
                            edge="start"
                            checked={isSelected}
                            tabIndex={-1}
                            disableRipple
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box display="flex" alignItems="center" gap={1}>
                              <Typography variant="body2" fontWeight={500}>
                                {apiKey.apiName || apiKey.broker}
                              </Typography>
                              {isSelected && (
                                <CheckCircleIcon fontSize="small" color="success" />
                              )}
                            </Box>
                          }
                          secondary={
                            <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                              <Chip 
                                label={apiKey.broker || apiKey.brokerName} 
                                size="small" 
                                variant="outlined"
                              />
                              <Chip 
                                label={apiKey.segment} 
                                size="small" 
                                color="primary"
                                variant="outlined"
                              />
                              {apiKey.brokerId && (
                                <Typography variant="caption" color="text.secondary">
                                  ID: {apiKey.brokerId}
                                </Typography>
                              )}
                            </Box>
                          }
                        />
                      </ListItemButton>
                    </ListItem>
                  </React.Fragment>
                );
              })}
            </List>
          </>
        )}
      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
        <Button 
          onClick={handleClose} 
          disabled={saving}
          color="inherit"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={saving || loading || !hasChanges}
          startIcon={saving ? <CircularProgress size={16} /> : null}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BrokerSelectDialog;
