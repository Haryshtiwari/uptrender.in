import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Alert,
} from '@mui/material';
import { Close as CloseIcon, CreditCard } from '@mui/icons-material';

const PaymentMethodDialog = ({ open, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    billingZip: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.cardNumber || formData.cardNumber.length < 16) {
      newErrors.cardNumber = 'Valid card number required';
    }
    if (!formData.cardName) {
      newErrors.cardName = 'Cardholder name required';
    }
    if (!formData.expiryMonth) {
      newErrors.expiryMonth = 'Required';
    }
    if (!formData.expiryYear) {
      newErrors.expiryYear = 'Required';
    }
    if (!formData.cvv || formData.cvv.length < 3) {
      newErrors.cvv = 'Valid CVV required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving payment method:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 15 }, (_, i) => currentYear + i);
  const months = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={1}>
            <CreditCard />
            <Typography variant="h6">Payment Method</Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Alert severity="info" sx={{ mb: 2 }}>
          Your payment information is encrypted and securely stored.
        </Alert>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Card Number"
              value={formData.cardNumber}
              onChange={handleChange('cardNumber')}
              error={!!errors.cardNumber}
              helperText={errors.cardNumber}
              inputProps={{ maxLength: 16 }}
              placeholder="1234 5678 9012 3456"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Cardholder Name"
              value={formData.cardName}
              onChange={handleChange('cardName')}
              error={!!errors.cardName}
              helperText={errors.cardName}
              placeholder="John Doe"
            />
          </Grid>

          <Grid item xs={4}>
            <FormControl fullWidth error={!!errors.expiryMonth}>
              <InputLabel>Month</InputLabel>
              <Select
                value={formData.expiryMonth}
                onChange={handleChange('expiryMonth')}
                label="Month"
              >
                {months.map((month) => (
                  <MenuItem key={month} value={month}>
                    {month}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={4}>
            <FormControl fullWidth error={!!errors.expiryYear}>
              <InputLabel>Year</InputLabel>
              <Select
                value={formData.expiryYear}
                onChange={handleChange('expiryYear')}
                label="Year"
              >
                {years.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={4}>
            <TextField
              fullWidth
              label="CVV"
              value={formData.cvv}
              onChange={handleChange('cvv')}
              error={!!errors.cvv}
              helperText={errors.cvv}
              inputProps={{ maxLength: 4 }}
              placeholder="123"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Billing ZIP Code"
              value={formData.billingZip}
              onChange={handleChange('billingZip')}
              placeholder="12345"
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="outlined" disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save Payment Method'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentMethodDialog;
