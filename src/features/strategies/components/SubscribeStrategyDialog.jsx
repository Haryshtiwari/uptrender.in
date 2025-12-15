import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Checkbox,
  FormControlLabel,
  TextField,
} from '@mui/material';
import {
  CheckCircle,
  AttachMoney,
  TrendingUp,
  Speed,
  Security,
  Support,
} from '@mui/icons-material';

const SubscribeStrategyDialog = ({ open, strategy, onClose, onSubscribe }) => {
  const [agreed, setAgreed] = useState(false);
  const [capital, setCapital] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!strategy) return null;

  const handleSubscribe = async () => {
    if (!agreed || !capital) return;

    setIsSubmitting(true);
    try {
      await onSubscribe(strategy.id, { capital: parseFloat(capital) });
      handleClose();
    } catch (error) {
      console.error('Error subscribing:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setAgreed(false);
    setCapital('');
    onClose();
  };

  const benefits = [
    { icon: <TrendingUp />, text: 'Automatic trade execution' },
    { icon: <Speed />, text: 'Real-time strategy updates' },
    { icon: <Security />, text: 'Secure API integration' },
    { icon: <Support />, text: 'Strategy creator support' },
  ];

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6">Subscribe to Strategy</Typography>
        <Typography variant="caption" color="text.secondary">
          {strategy.name}
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        <Alert severity="info" sx={{ mb: 2 }}>
          By subscribing, this strategy will automatically execute trades on your account based on the creator's signals.
        </Alert>

        {/* Strategy Details */}
        <Box mb={2}>
          <Typography variant="subtitle2" fontWeight={700} gutterBottom>
            Strategy Details
          </Typography>
          <Box display="flex" justifyContent="space-between" py={0.5}>
            <Typography variant="body2" color="text.secondary">Segment:</Typography>
            <Typography variant="body2" fontWeight={600}>{strategy.segment}</Typography>
          </Box>
          <Box display="flex" justifyContent="space-between" py={0.5}>
            <Typography variant="body2" color="text.secondary">Minimum Capital:</Typography>
            <Typography variant="body2" fontWeight={600}>₹{strategy.capital?.toLocaleString() || 'N/A'}</Typography>
          </Box>
          <Box display="flex" justifyContent="space-between" py={0.5}>
            <Typography variant="body2" color="text.secondary">Win Rate:</Typography>
            <Typography variant="body2" fontWeight={600} color="success.main">
              {strategy.winRate || 'N/A'}%
            </Typography>
          </Box>
          <Box display="flex" justifyContent="space-between" py={0.5}>
            <Typography variant="body2" color="text.secondary">Subscribers:</Typography>
            <Typography variant="body2" fontWeight={600}>{strategy.subscribers || 0}</Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Benefits */}
        <Box mb={2}>
          <Typography variant="subtitle2" fontWeight={700} gutterBottom>
            What You Get
          </Typography>
          <List dense>
            {benefits.map((benefit, index) => (
              <ListItem key={index} disableGutters>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  {benefit.icon}
                </ListItemIcon>
                <ListItemText primary={benefit.text} />
              </ListItem>
            ))}
          </List>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Capital Input */}
        <Box mb={2}>
          <TextField
            fullWidth
            label="Your Capital"
            type="number"
            value={capital}
            onChange={(e) => setCapital(e.target.value)}
            placeholder="Enter amount"
            InputProps={{
              startAdornment: <AttachMoney />,
            }}
            helperText={`Minimum: ₹${strategy.capital?.toLocaleString() || 0}`}
            required
          />
        </Box>

        {/* Terms Agreement */}
        <FormControlLabel
          control={
            <Checkbox
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              color="primary"
            />
          }
          label={
            <Typography variant="body2">
              I understand the risks and agree to subscribe to this strategy
            </Typography>
          }
        />

        <Alert severity="warning" sx={{ mt: 2 }}>
          <Typography variant="caption">
            <strong>Risk Warning:</strong> Trading involves substantial risk of loss. Past performance does not guarantee future results.
          </Typography>
        </Alert>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClose} variant="outlined" disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          onClick={handleSubscribe}
          variant="contained"
          color="primary"
          disabled={!agreed || !capital || parseFloat(capital) < (strategy.capital || 0) || isSubmitting}
          startIcon={<CheckCircle />}
        >
          {isSubmitting ? 'Subscribing...' : 'Subscribe Now'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SubscribeStrategyDialog;
