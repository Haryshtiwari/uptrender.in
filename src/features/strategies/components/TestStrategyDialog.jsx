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
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import { Close as CloseIcon, Science } from '@mui/icons-material';

const TestStrategyDialog = ({ open, onClose, onTest, strategy }) => {
  const [testMode, setTestMode] = useState('paper');
  const [testCapital, setTestCapital] = useState('');
  const [duration, setDuration] = useState('1');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTest = async () => {
    if (!testCapital || Number(testCapital) <= 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onTest({
        mode: testMode,
        capital: Number(testCapital),
        duration: Number(duration),
        strategyId: strategy.id,
      });
      onClose();
    } catch (error) {
      console.error('Error testing strategy:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={1}>
            <Science color="primary" />
            <Typography variant="h6">Test Strategy</Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Alert severity="info" sx={{ mb: 3 }}>
          Test your strategy before deploying it live. Paper trading uses simulated market conditions.
        </Alert>

        <Typography variant="subtitle2" gutterBottom>
          Test Mode
        </Typography>
        <RadioGroup
          value={testMode}
          onChange={(e) => setTestMode(e.target.value)}
          sx={{ mb: 2 }}
        >
          <FormControlLabel
            value="paper"
            control={<Radio />}
            label="Paper Trading (Simulated)"
          />
          <FormControlLabel
            value="live"
            control={<Radio />}
            label="Live Trading (Real Money)"
            disabled={!strategy?.isVerified}
          />
        </RadioGroup>

        {testMode === 'live' && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            Live trading uses real money. Please ensure you understand the risks involved.
          </Alert>
        )}

        <TextField
          fullWidth
          label="Test Capital"
          type="number"
          value={testCapital}
          onChange={(e) => setTestCapital(e.target.value)}
          placeholder="Enter amount to allocate"
          sx={{ mb: 2 }}
          helperText={`Minimum: ${strategy?.capital || 10000}`}
          inputProps={{ min: strategy?.capital || 10000 }}
        />

        <FormControl fullWidth>
          <InputLabel>Test Duration</InputLabel>
          <Select
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            label="Test Duration"
          >
            <MenuItem value="1">1 Day</MenuItem>
            <MenuItem value="3">3 Days</MenuItem>
            <MenuItem value="7">1 Week</MenuItem>
            <MenuItem value="14">2 Weeks</MenuItem>
            <MenuItem value="30">1 Month</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="outlined" disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          onClick={handleTest}
          variant="contained"
          color="primary"
          disabled={!testCapital || Number(testCapital) <= 0 || isSubmitting}
          startIcon={<Science />}
        >
          {isSubmitting ? 'Starting Test...' : 'Start Test'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TestStrategyDialog;
