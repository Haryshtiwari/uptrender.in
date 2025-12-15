import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
} from '@mui/material';
import { Warning as WarningIcon } from '@mui/icons-material';

const DeleteUserStrategyConfirm = ({ open, strategy, onClose, onConfirm }) => {
  if (!strategy) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <WarningIcon color="error" />
          <Typography variant="h6">Delete Strategy</Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Typography variant="body1" gutterBottom>
          Are you sure you want to delete the strategy:
        </Typography>
        <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 1 }}>
          "{strategy.name}"
        </Typography>

        <Alert severity="warning" sx={{ mt: 2 }}>
          <Typography variant="body2">
            This action cannot be undone. All associated data including:
          </Typography>
          <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
            <li>Strategy configuration</li>
            <li>Performance history</li>
            <li>Trade records</li>
          </ul>
          <Typography variant="body2" sx={{ mt: 1 }}>
            will be permanently deleted.
          </Typography>
        </Alert>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={() => {
            onConfirm(strategy.id);
            onClose();
          }}
          variant="contained"
          color="error"
        >
          Delete Strategy
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteUserStrategyConfirm;
