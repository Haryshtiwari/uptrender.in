import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography, Box, Alert
} from '@mui/material';
import { WarningAmber as WarningIcon } from '@mui/icons-material';
import adminApiKeyService from '../../../services/adminApiKeyService';

const DeleteApiKeyConfirm = ({ open, onClose, apiKey, onSuccess }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    setIsDeleting(true);
    setError('');
    try {
      const result = await adminApiKeyService.deleteApiKey(apiKey.id);
      if (result.success) {
        onSuccess?.();
        onClose();
      } else {
        setError(result.message || 'Failed to delete API key');
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <WarningIcon color="error" />
          <Typography variant="h6">Delete API Key</Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" gutterBottom>
          Are you sure you want to delete this API key?
        </Typography>
        {apiKey && (
          <Box sx={{ mt: 2, p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary">
              <strong>Broker:</strong> {apiKey.brokerName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>User:</strong> {apiKey.user?.username}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>Segment:</strong> {apiKey.segment}
            </Typography>
          </Box>
        )}
        <Typography variant="body2" color="error" sx={{ mt: 2 }}>
          This action cannot be undone.
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} disabled={isDeleting}>
          Cancel
        </Button>
        <Button onClick={handleDelete} color="error" variant="contained" disabled={isDeleting}>
          {isDeleting ? 'Deleting...' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteApiKeyConfirm;
