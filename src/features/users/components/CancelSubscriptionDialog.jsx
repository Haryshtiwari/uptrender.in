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
} from '@mui/material';
import {
  Close as CloseIcon,
  Warning,
  RemoveCircleOutline,
  CheckCircle,
} from '@mui/icons-material';

const CancelSubscriptionDialog = ({ open, onClose, currentPlan, onCancel }) => {
  const [reason, setReason] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cancellationReasons = [
    'Too expensive',
    'Not using the features',
    'Switching to another platform',
    'Technical issues',
    'Poor customer support',
    'Other',
  ];

  const handleSubmit = async () => {
    if (!reason) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onCancel({ reason, feedback });
      onClose();
    } catch (error) {
      console.error('Error canceling subscription:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const effectiveDate = new Date();
  effectiveDate.setMonth(effectiveDate.getMonth() + 1);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={1}>
            <Warning color="warning" />
            <Typography variant="h6">Cancel Subscription</Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Alert severity="warning" sx={{ mb: 3 }}>
          Are you sure you want to cancel your subscription? You will lose access to all premium
          features.
        </Alert>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Current Plan
          </Typography>
          <Typography variant="h6" color="primary" gutterBottom>
            {currentPlan?.name || 'Pro Plan'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Your subscription will remain active until{' '}
            <strong>{effectiveDate.toLocaleDateString()}</strong>
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle2" gutterBottom sx={{ mb: 1 }}>
          What you'll lose:
        </Typography>
        <List dense>
          <ListItem>
            <ListItemIcon>
              <RemoveCircleOutline color="error" fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Access to premium strategies" />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <RemoveCircleOutline color="error" fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Advanced trading features" />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <RemoveCircleOutline color="error" fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Priority customer support" />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <RemoveCircleOutline color="error" fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Real-time market data" />
          </ListItem>
        </List>

        <Divider sx={{ my: 2 }} />

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Reason for cancellation *</InputLabel>
          <Select value={reason} onChange={(e) => setReason(e.target.value)} label="Reason for cancellation *">
            {cancellationReasons.map((r) => (
              <MenuItem key={r} value={r}>
                {r}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label="Additional Feedback (Optional)"
          multiline
          rows={4}
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Help us improve by sharing your thoughts..."
          inputProps={{ maxLength: 500 }}
          helperText={`${feedback.length}/500 characters`}
        />
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="outlined" disabled={isSubmitting}>
          Keep Subscription
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="error"
          disabled={!reason || isSubmitting}
        >
          {isSubmitting ? 'Canceling...' : 'Cancel Subscription'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CancelSubscriptionDialog;
