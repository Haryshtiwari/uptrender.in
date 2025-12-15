import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  IconButton,
  Typography,
  FormHelperText,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { adminStrategyService } from '../../../services/adminStrategyService';

const EditStrategyDialog = ({ open, onClose, strategy, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    segment: '',
    capital: '',
    symbol: '',
    symbolValue: '',
    legs: 1,
    description: '',
    type: 'Private',
    isActive: true,
    isPublic: false,
    isRunning: false,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (strategy) {
      setFormData({
        name: strategy.name || '',
        segment: strategy.segment || '',
        capital: strategy.capital || '',
        symbol: strategy.symbol || '',
        symbolValue: strategy.symbolValue || '',
        legs: strategy.legs || 1,
        description: strategy.description || '',
        type: strategy.type || 'Private',
        isActive: strategy.isActive !== undefined ? strategy.isActive : true,
        isPublic: strategy.isPublic !== undefined ? strategy.isPublic : false,
        isRunning: strategy.isRunning !== undefined ? strategy.isRunning : false,
      });
    }
  }, [strategy]);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Strategy name is required';
    }

    if (!formData.segment) {
      newErrors.segment = 'Segment is required';
    }

    if (!formData.capital || formData.capital <= 0) {
      newErrors.capital = 'Valid capital amount is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await adminStrategyService.updateStrategy(strategy.id, formData);
      
      if (result.success) {
        onSuccess?.();
        onClose();
      } else {
        setErrors({ submit: result.message || 'Failed to update strategy' });
      }
    } catch (error) {
      setErrors({ submit: error.message || 'An error occurred while updating strategy' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setErrors({});
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">Edit Strategy</Typography>
          <IconButton onClick={handleClose} disabled={isSubmitting} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Grid container spacing={3}>
            {/* Name */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Strategy Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
                required
                disabled={isSubmitting}
              />
            </Grid>

            {/* Segment */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.segment} disabled={isSubmitting}>
                <InputLabel>Segment</InputLabel>
                <Select
                  name="segment"
                  value={formData.segment}
                  onChange={handleChange}
                  label="Segment"
                >
                  <MenuItem value="Crypto">Crypto</MenuItem>
                  <MenuItem value="Forex">Forex</MenuItem>
                  <MenuItem value="Indian">Indian (Equity/F&O)</MenuItem>
                </Select>
                {errors.segment && <FormHelperText>{errors.segment}</FormHelperText>}
              </FormControl>
            </Grid>

            {/* Capital */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Capital"
                name="capital"
                type="number"
                value={formData.capital}
                onChange={handleChange}
                error={!!errors.capital}
                helperText={errors.capital}
                required
                disabled={isSubmitting}
              />
            </Grid>

            {/* Symbol */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Symbol"
                name="symbol"
                value={formData.symbol}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </Grid>

            {/* Symbol Value */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Symbol Value"
                name="symbolValue"
                value={formData.symbolValue}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </Grid>

            {/* Legs */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Legs"
                name="legs"
                type="number"
                value={formData.legs}
                onChange={handleChange}
                disabled={isSubmitting}
                inputProps={{ min: 1 }}
              />
            </Grid>

            {/* Type */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth disabled={isSubmitting}>
                <InputLabel>Type</InputLabel>
                <Select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  label="Type"
                >
                  <MenuItem value="Private">Private</MenuItem>
                  <MenuItem value="Public">Public</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Description */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={3}
                disabled={isSubmitting}
              />
            </Grid>

            {/* Status Switches */}
            <Grid item xs={12}>
              <Box display="flex" gap={3} flexWrap="wrap">
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isActive}
                      onChange={handleChange}
                      name="isActive"
                      color="success"
                      disabled={isSubmitting}
                    />
                  }
                  label="Active"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isPublic}
                      onChange={handleChange}
                      name="isPublic"
                      color="info"
                      disabled={isSubmitting}
                    />
                  }
                  label="Public"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isRunning}
                      onChange={handleChange}
                      name="isRunning"
                      color="primary"
                      disabled={isSubmitting}
                    />
                  }
                  label="Running"
                />
              </Box>
            </Grid>

            {/* Submit Error */}
            {errors.submit && (
              <Grid item xs={12}>
                <Typography color="error" variant="body2">
                  {errors.submit}
                </Typography>
              </Grid>
            )}
          </Grid>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Updating...' : 'Update Strategy'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditStrategyDialog;
