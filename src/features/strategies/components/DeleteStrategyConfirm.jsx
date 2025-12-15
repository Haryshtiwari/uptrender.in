import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Alert,
} from '@mui/material';
import { adminStrategyService } from '../../../services/adminStrategyService';

export default function DeleteStrategyConfirm({ open, strategy, onClose, onSuccess }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');

  const handleConfirm = async () => {
    if (!strategy?.id) return;

    setIsDeleting(true);
    setError('');

    try {
      const result = await adminStrategyService.deleteStrategy(strategy.id);
      
      if (result.success) {
        onSuccess?.();
        onClose();
      } else {
        setError(result.message || 'Failed to delete strategy');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while deleting strategy');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    if (!isDeleting) {
      setError('');
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle>
        Delete Strategy
      </DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to delete <strong>{strategy?.name}</strong>?
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          This action cannot be undone. All strategy data will be permanently deleted.
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </DialogContent>
      <DialogActions sx={{ pb: 2, pr: 3 }}>
        <Button onClick={handleClose} disabled={isDeleting}>
          Cancel
        </Button>
        <Button
          color="error"
          variant="contained"
          onClick={handleConfirm}
          disabled={isDeleting}
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
