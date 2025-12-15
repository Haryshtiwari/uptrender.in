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

const EditUserStrategyDialog = ({ open, onClose, strategy, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    segment: '',
    capital: '',
    symbol: '',
    symbolValue: '',
    legs: 1,
    description: '',
    strategyType: 'Intraday',
    isActive: true,
    isPublic: false,
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
        strategyType: strategy.strategyType || 'Intraday',
        isActive: strategy.isActive !== undefined ? strategy.isActive : true,
        isPublic: strategy.isPublic !== undefined ? strategy.isPublic : false,
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

    if (!formData.symbol || !formData.symbol.trim()) {
      newErrors.symbol = 'Symbol is required';
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
      await onSave(strategy.id, formData);
      onClose();
    } catch (error) {
      console.error('Error updating strategy:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Edit Strategy</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Grid container spacing={2}>
            {/* Strategy Name */}
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
              />
            </Grid>

            {/* Segment */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!errors.segment}>
                <InputLabel>Segment</InputLabel>
                <Select
                  name="segment"
                  value={formData.segment}
                  onChange={handleChange}
                  label="Segment"
                  required
                >
                  <MenuItem value="Crypto">Crypto</MenuItem>
                  <MenuItem value="Forex">Forex</MenuItem>
                  <MenuItem value="Indian">Indian (Equity/F&O)</MenuItem>
                </Select>
                {errors.segment && <FormHelperText>{errors.segment}</FormHelperText>}
              </FormControl>
            </Grid>

            {/* Strategy Type */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Strategy Type</InputLabel>
                <Select
                  name="strategyType"
                  value={formData.strategyType}
                  onChange={handleChange}
                  label="Strategy Type"
                >
                  <MenuItem value="Intraday">Intraday</MenuItem>
                  <MenuItem value="Positional">Positional</MenuItem>
                  <MenuItem value="BTST">BTST</MenuItem>
                  <MenuItem value="Swing">Swing</MenuItem>
                </Select>
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
                InputProps={{
                  startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>,
                }}
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
                error={!!errors.symbol}
                helperText={errors.symbol}
                placeholder="e.g., NIFTY, BANKNIFTY"
                required
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
                placeholder="e.g., 50, 100"
              />
            </Grid>

            {/* Legs */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Number of Legs"
                name="legs"
                type="number"
                value={formData.legs}
                onChange={handleChange}
                inputProps={{ min: 1, max: 10 }}
              />
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
                placeholder="Describe your strategy..."
              />
            </Grid>

            {/* Switches */}
            <Grid item xs={12} sm={4}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isActive}
                    onChange={handleChange}
                    name="isActive"
                    color="success"
                  />
                }
                label="Active"
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isPublic}
                    onChange={handleChange}
                    name="isPublic"
                    color="info"
                  />
                }
                label="Public"
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} variant="outlined" disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditUserStrategyDialog;
