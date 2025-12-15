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
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Checkbox,
  FormGroup,
  Alert,
} from '@mui/material';
import { Close as CloseIcon, FileDownload } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const ExportReportDialog = ({ open, onClose, onExport }) => {
  const [format, setFormat] = useState('csv');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [email, setEmail] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('download');
  const [selectedData, setSelectedData] = useState({
    trades: true,
    strategies: true,
    performance: true,
    wallet: false,
  });
  const [isExporting, setIsExporting] = useState(false);

  const handleDataToggle = (field) => {
    setSelectedData((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleExport = async () => {
    if (!startDate || !endDate) {
      return;
    }

    setIsExporting(true);
    try {
      await onExport({
        format,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        deliveryMethod,
        email: deliveryMethod === 'email' ? email : undefined,
        data: selectedData,
      });
      onClose();
    } catch (error) {
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const hasSelectedData = Object.values(selectedData).some((v) => v);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={1}>
            <FileDownload color="primary" />
            <Typography variant="h6">Export Report</Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Alert severity="info" sx={{ mb: 3 }}>
          Export your trading data and performance reports in various formats.
        </Alert>

        {/* Format Selection */}
        <FormControl component="fieldset" sx={{ mb: 3 }}>
          <FormLabel component="legend">Export Format</FormLabel>
          <RadioGroup value={format} onChange={(e) => setFormat(e.target.value)} row>
            <FormControlLabel value="csv" control={<Radio />} label="CSV" />
            <FormControlLabel value="pdf" control={<Radio />} label="PDF" />
            <FormControlLabel value="excel" control={<Radio />} label="Excel" />
          </RadioGroup>
        </FormControl>

        {/* Date Range */}
        <Typography variant="subtitle2" gutterBottom>
          Date Range
        </Typography>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Box display="flex" gap={2} mb={3}>
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={setStartDate}
              slotProps={{ textField: { fullWidth: true, size: 'small' } }}
              maxDate={new Date()}
            />
            <DatePicker
              label="End Date"
              value={endDate}
              onChange={setEndDate}
              slotProps={{ textField: { fullWidth: true, size: 'small' } }}
              maxDate={new Date()}
              minDate={startDate}
            />
          </Box>
        </LocalizationProvider>

        {/* Data Selection */}
        <FormControl component="fieldset" sx={{ mb: 3 }}>
          <FormLabel component="legend">Select Data to Export</FormLabel>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedData.trades}
                  onChange={() => handleDataToggle('trades')}
                />
              }
              label="Trade History"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedData.strategies}
                  onChange={() => handleDataToggle('strategies')}
                />
              }
              label="Strategy Performance"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedData.performance}
                  onChange={() => handleDataToggle('performance')}
                />
              }
              label="Performance Metrics"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedData.wallet}
                  onChange={() => handleDataToggle('wallet')}
                />
              }
              label="Wallet Transactions"
            />
          </FormGroup>
        </FormControl>

        {/* Delivery Method */}
        <FormControl component="fieldset" sx={{ mb: 2 }}>
          <FormLabel component="legend">Delivery Method</FormLabel>
          <RadioGroup
            value={deliveryMethod}
            onChange={(e) => setDeliveryMethod(e.target.value)}
          >
            <FormControlLabel value="download" control={<Radio />} label="Download Now" />
            <FormControlLabel value="email" control={<Radio />} label="Send via Email" />
          </RadioGroup>
        </FormControl>

        {deliveryMethod === 'email' && (
          <TextField
            fullWidth
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            size="small"
          />
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="outlined" disabled={isExporting}>
          Cancel
        </Button>
        <Button
          onClick={handleExport}
          variant="contained"
          color="primary"
          disabled={
            !startDate ||
            !endDate ||
            !hasSelectedData ||
            (deliveryMethod === 'email' && !email) ||
            isExporting
          }
          startIcon={<FileDownload />}
        >
          {isExporting ? 'Exporting...' : 'Export Report'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExportReportDialog;
