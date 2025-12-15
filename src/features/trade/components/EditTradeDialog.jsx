import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Grid, FormControl, InputLabel, Select, MenuItem,
  Box, IconButton, Typography, Alert
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { adminTradeService } from '../../../services/adminTradeService';

const EditTradeDialog = ({ open, onClose, trade, onSuccess }) => {
  const [formData, setFormData] = useState({
    orderId: '', market: '', symbol: '', type: 'Buy', amount: '', price: '',
    currentPrice: '', pnl: '', pnlPercentage: '', status: 'Pending',
    broker: '', brokerType: '', date: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (trade) {
      setFormData({
        orderId: trade.orderId || '',
        market: trade.market || '',
        symbol: trade.symbol || '',
        type: trade.type || 'Buy',
        amount: trade.amount || '',
        price: trade.price || '',
        currentPrice: trade.currentPrice || '',
        pnl: trade.pnl || '',
        pnlPercentage: trade.pnlPercentage || '',
        status: trade.status || 'Pending',
        broker: trade.broker || '',
        brokerType: trade.brokerType || '',
        date: trade.date ? new Date(trade.date).toISOString().split('T')[0] : ''
      });
    }
  }, [trade]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const result = await adminTradeService.updateTrade(trade.id, formData);
      if (result.success) {
        onSuccess?.();
        onClose();
      } else {
        setErrors({ submit: result.message || 'Failed to update trade' });
      }
    } catch (error) {
      setErrors({ submit: error.message || 'An error occurred' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">Edit Trade</Typography>
          <IconButton onClick={onClose} disabled={isSubmitting} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Order ID" name="orderId" value={formData.orderId} onChange={handleChange} disabled={isSubmitting} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Symbol" name="symbol" value={formData.symbol} onChange={handleChange} disabled={isSubmitting} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth disabled={isSubmitting}>
                <InputLabel>Market</InputLabel>
                <Select name="market" value={formData.market} onChange={handleChange} label="Market">
                  <MenuItem value="Forex">Forex</MenuItem>
                  <MenuItem value="Crypto">Crypto</MenuItem>
                  <MenuItem value="Indian">Indian</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth disabled={isSubmitting}>
                <InputLabel>Type</InputLabel>
                <Select name="type" value={formData.type} onChange={handleChange} label="Type">
                  <MenuItem value="Buy">Buy</MenuItem>
                  <MenuItem value="Sell">Sell</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Amount" name="amount" type="number" value={formData.amount} onChange={handleChange} disabled={isSubmitting} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Price" name="price" type="number" value={formData.price} onChange={handleChange} disabled={isSubmitting} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Current Price" name="currentPrice" type="number" value={formData.currentPrice} onChange={handleChange} disabled={isSubmitting} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth disabled={isSubmitting}>
                <InputLabel>Status</InputLabel>
                <Select name="status" value={formData.status} onChange={handleChange} label="Status">
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                  <MenuItem value="Failed">Failed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Broker" name="broker" value={formData.broker} onChange={handleChange} disabled={isSubmitting} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Trade Date" name="date" type="date" value={formData.date} onChange={handleChange} disabled={isSubmitting} InputLabelProps={{ shrink: true }} />
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
            {isSubmitting ? 'Updating...' : 'Update Trade'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EditTradeDialog;
