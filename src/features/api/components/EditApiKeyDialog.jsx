import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Grid, Box, IconButton, Typography, Alert,
  FormControl, InputLabel, Select, MenuItem, Switch, FormControlLabel
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import adminApiKeyService from '../../../services/adminApiKeyService';

const EditApiKeyDialog = ({ open, onClose, apiKey, onSuccess }) => {
  const [formData, setFormData] = useState({
    brokerName: '', segment: '', status: 'Active', isVerified: false, isDefault: false
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (apiKey) {
      setFormData({
        brokerName: apiKey.brokerName || '',
        segment: apiKey.segment || '',
        status: apiKey.status || 'Active',
        isVerified: apiKey.isVerified || false,
        isDefault: apiKey.isDefault || false
      });
    }
  }, [apiKey]);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const result = await adminApiKeyService.updateApiKey(apiKey.id, formData);
      if (result.success) {
        onSuccess?.();
        onClose();
      } else {
        setErrors({ submit: result.message || 'Failed to update API key' });
      }
    } catch (error) {
      setErrors({ submit: error.message || 'An error occurred' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">Edit API Key</Typography>
          <IconButton onClick={onClose} disabled={isSubmitting} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField fullWidth label="Broker Name" name="brokerName" value={formData.brokerName} onChange={handleChange} disabled={isSubmitting} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth disabled={isSubmitting}>
                <InputLabel>Segment</InputLabel>
                <Select name="segment" value={formData.segment} onChange={handleChange} label="Segment">
                  <MenuItem value="Indian">Indian</MenuItem>
                  <MenuItem value="Forex">Forex</MenuItem>
                  <MenuItem value="Crypto">Crypto</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth disabled={isSubmitting}>
                <InputLabel>Status</InputLabel>
                <Select name="status" value={formData.status} onChange={handleChange} label="Status">
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Switch checked={formData.isVerified} onChange={handleChange} name="isVerified" disabled={isSubmitting} />}
                label="Verified"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Switch checked={formData.isDefault} onChange={handleChange} name="isDefault" disabled={isSubmitting} />}
                label="Set as Default"
              />
            </Grid>
            {errors.submit && (
              <Grid item xs={12}>
                <Alert severity="error">{errors.submit}</Alert>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onClose} disabled={isSubmitting}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? 'Updating...' : 'Update API Key'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditApiKeyDialog;
