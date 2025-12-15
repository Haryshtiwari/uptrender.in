import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import {
  Close as CloseIcon,
  ArrowDownward,
  RemoveCircleOutline,
  CheckCircle,
} from '@mui/icons-material';

const DowngradePlanDialog = ({ open, onClose, currentPlan, targetPlan, onDowngrade }) => {
  const [reason, setReason] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const downgradeReasons = [
    'Too expensive',
    'Not using all features',
    'Reducing trading activity',
    'Budget constraints',
    'Testing lower tier first',
    'Other',
  ];

  const handleSubmit = async () => {
    if (!reason) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onDowngrade(targetPlan, { reason, feedback });
      onClose();
    } catch (error) {
      console.error('Error downgrading plan:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const effectiveDate = new Date();
  effectiveDate.setMonth(effectiveDate.getMonth() + 1);

  // Features that will be lost
  const losingFeatures = [
    'Advanced analytics dashboard',
    'Unlimited strategy subscriptions',
    'Priority customer support',
    'Real-time market data',
    'API access',
  ];

  // Features that will be retained
  const retainingFeatures = [
    'Basic trading features',
    'Up to 3 active strategies',
    'Standard support',
    'Market data (15min delay)',
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={1}>
            <ArrowDownward color="warning" />
            <Typography variant="h6">Downgrade Plan</Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Alert severity="warning" sx={{ mb: 3 }}>
          You are about to downgrade your subscription. Please review the changes below.
        </Alert>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={5}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Current Plan
                </Typography>
                <Typography variant="h5" color="primary" gutterBottom>
                  {currentPlan?.name || 'Pro Plan'}
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  ${currentPlan?.price || '49.99'}/month
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={2} display="flex" alignItems="center" justifyContent="center">
            <ArrowDownward fontSize="large" color="action" />
          </Grid>

          <Grid item xs={5}>
            <Card variant="outlined" sx={{ borderColor: 'warning.main' }}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  New Plan
                </Typography>
                <Typography variant="h5" color="warning.main" gutterBottom>
                  {targetPlan?.name || 'Basic Plan'}
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  ${targetPlan?.price || '19.99'}/month
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Changes will take effect on{' '}
          <strong>{effectiveDate.toLocaleDateString()}</strong>. You will continue to have
          access to all current features until then.
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Typography variant="subtitle2" gutterBottom color="error">
              Features You'll Lose:
            </Typography>
            <List dense>
              {losingFeatures.map((feature, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <RemoveCircleOutline color="error" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={feature} />
                </ListItem>
              ))}
            </List>
          </Grid>

          <Grid item xs={6}>
            <Typography variant="subtitle2" gutterBottom color="success.main">
              Features You'll Keep:
            </Typography>
            <List dense>
              {retainingFeatures.map((feature, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <CheckCircle color="success" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={feature} />
                </ListItem>
              ))}
            </List>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Reason for downgrade *</InputLabel>
          <Select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            label="Reason for downgrade *"
          >
            {downgradeReasons.map((r) => (
              <MenuItem key={r} value={r}>
                {r}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label="How can we improve? (Optional)"
          multiline
          rows={3}
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Your feedback helps us serve you better..."
          inputProps={{ maxLength: 500 }}
          helperText={`${feedback.length}/500 characters`}
        />
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="outlined" disabled={isSubmitting}>
          Keep Current Plan
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="warning"
          disabled={!reason || isSubmitting}
        >
          {isSubmitting ? 'Processing...' : 'Confirm Downgrade'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DowngradePlanDialog;
