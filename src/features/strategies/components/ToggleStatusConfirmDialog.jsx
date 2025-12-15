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
import { PlayArrow, Pause, Info as InfoIcon } from '@mui/icons-material';

const ToggleStatusConfirmDialog = ({ open, strategy, onClose, onConfirm }) => {
  if (!strategy) return null;

  const isActivating = !strategy.isActive;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          {isActivating ? (
            <PlayArrow color="success" />
          ) : (
            <Pause color="warning" />
          )}
          <Typography variant="h6">
            {isActivating ? 'Activate Strategy' : 'Deactivate Strategy'}
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Typography variant="body1" gutterBottom>
          Are you sure you want to {isActivating ? 'activate' : 'deactivate'} the strategy:
        </Typography>
        <Typography variant="h6" color="primary" gutterBottom sx={{ mt: 1 }}>
          "{strategy.name}"
        </Typography>

        {isActivating ? (
          <Alert severity="info" icon={<InfoIcon />} sx={{ mt: 2 }}>
            <Typography variant="body2">
              Activating this strategy will:
            </Typography>
            <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
              <li>Enable automatic trading</li>
              <li>Start monitoring market conditions</li>
              <li>Execute trades based on strategy rules</li>
            </ul>
            <Typography variant="body2" sx={{ mt: 1 }}>
              <strong>Make sure</strong> your broker API is connected and you have sufficient capital.
            </Typography>
          </Alert>
        ) : (
          <Alert severity="warning" sx={{ mt: 2 }}>
            <Typography variant="body2">
              Deactivating this strategy will:
            </Typography>
            <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
              <li>Stop all automated trading</li>
              <li>Close any open positions (if configured)</li>
              <li>Pause strategy execution</li>
            </ul>
            <Typography variant="body2" sx={{ mt: 1 }}>
              You can reactivate this strategy at any time.
            </Typography>
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={() => {
            onConfirm(strategy.id, strategy.isActive);
            onClose();
          }}
          variant="contained"
          color={isActivating ? 'success' : 'warning'}
          startIcon={isActivating ? <PlayArrow /> : <Pause />}
        >
          {isActivating ? 'Activate' : 'Deactivate'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ToggleStatusConfirmDialog;
