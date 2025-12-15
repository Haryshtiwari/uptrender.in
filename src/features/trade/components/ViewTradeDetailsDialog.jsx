import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  Box,
  Chip,
  Divider,
  IconButton,
  Avatar,
  Table,
  TableBody,
  TableRow,
  TableCell,
} from '@mui/material';
import {
  Close as CloseIcon,
  TrendingUp,
  TrendingDown,
  AttachMoney,
  CalendarToday,
  AccountBalance,
  Percent,
  ShowChart,
  LocalOffer,
  CheckCircle,
  Cancel,
  HourglassEmpty,
} from '@mui/icons-material';

const ViewTradeDetailsDialog = ({ open, trade, onClose }) => {
  if (!trade) return null;

  const isProfitable = trade.pnl >= 0;
  const statusColors = {
    Completed: 'success',
    Pending: 'warning',
    Cancelled: 'error',
    Open: 'info',
  };

  const statusIcons = {
    Completed: CheckCircle,
    Pending: HourglassEmpty,
    Cancelled: Cancel,
    Open: ShowChart,
  };

  const StatusIcon = statusIcons[trade.status] || ShowChart;

  const DetailRow = ({ icon, label, value, color }) => {
    const IconComponent = icon;
    return (
      <TableRow>
        <TableCell sx={{ borderBottom: 'none', py: 1.5 }}>
          <Box display="flex" alignItems="center" gap={1}>
            <IconComponent fontSize="small" sx={{ color: color || 'action.active' }} />
            <Typography variant="body2" color="text.secondary" fontWeight={600}>
              {label}
            </Typography>
          </Box>
        </TableCell>
        <TableCell sx={{ borderBottom: 'none', py: 1.5 }}>
          <Typography variant="body1" fontWeight={600} sx={{ color }}>
            {value || 'N/A'}
          </Typography>
        </TableCell>
      </TableRow>
    );
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar
              sx={{
                bgcolor: isProfitable ? 'success.main' : 'error.main',
                width: 48,
                height: 48,
              }}
            >
              {isProfitable ? <TrendingUp /> : <TrendingDown />}
            </Avatar>
            <Box>
              <Typography variant="h6">{trade.symbol}</Typography>
              <Typography variant="caption" color="text.secondary">
                Trade ID: {trade.id}
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {/* Status and Type Badges */}
        <Box display="flex" gap={1} mb={3} flexWrap="wrap">
          <Chip
            icon={<StatusIcon />}
            label={trade.status}
            color={statusColors[trade.status] || 'default'}
            size="small"
          />
          <Chip
            label={trade.type}
            color={trade.type && trade.type.toLowerCase() === 'buy' ? 'success' : 'error'}
            size="small"
            variant="outlined"
          />
          <Chip
            label={trade.market}
            color="primary"
            size="small"
            variant="outlined"
          />
          <Chip
            icon={<AccountBalance />}
            label={trade.broker}
            size="small"
            variant="outlined"
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Trade Details */}
        <Typography variant="subtitle2" fontWeight={700} mb={2}>
          Trade Information
        </Typography>
        <Table size="small">
          <TableBody>
            <DetailRow
              icon={LocalOffer}
              label="Symbol"
              value={trade.symbol}
              color="primary.main"
            />
            <DetailRow
              icon={TrendingUp}
              label="Type"
              value={trade.type}
              color={trade.type && trade.type.toLowerCase() === 'buy' ? 'success.main' : 'error.main'}
            />
            <DetailRow
              icon={ShowChart}
              label="Quantity"
              value={`${trade.amount?.toLocaleString() || 0} units`}
            />
            <DetailRow
              icon={AttachMoney}
              label="Entry Price"
              value={`₹${trade.price?.toFixed(2) || 0}`}
            />
            <DetailRow
              icon={AttachMoney}
              label="Current Price"
              value={`₹${trade.currentPrice?.toFixed(2) || 0}`}
            />
            <DetailRow
              icon={CalendarToday}
              label="Trade Date"
              value={new Date(trade.date).toLocaleString()}
            />
          </TableBody>
        </Table>

        <Divider sx={{ my: 2 }} />

        {/* P&L Details */}
        <Typography variant="subtitle2" fontWeight={700} mb={2}>
          Profit & Loss
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Box
              textAlign="center"
              p={2}
              sx={{
                bgcolor: isProfitable ? 'success.lighter' : 'error.lighter',
                borderRadius: 2,
                border: `2px solid ${isProfitable ? 'success.main' : 'error.main'}`,
              }}
            >
              <Typography variant="caption" color="text.secondary">
                Total P&L
              </Typography>
              <Typography
                variant="h5"
                fontWeight={700}
                color={isProfitable ? 'success.main' : 'error.main'}
              >
                ₹{trade.pnl?.toFixed(2) || 0}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box
              textAlign="center"
              p={2}
              sx={{
                bgcolor: isProfitable ? 'success.lighter' : 'error.lighter',
                borderRadius: 2,
                border: `2px solid ${isProfitable ? 'success.main' : 'error.main'}`,
              }}
            >
              <Typography variant="caption" color="text.secondary">
                P&L Percentage
              </Typography>
              <Typography
                variant="h5"
                fontWeight={700}
                color={isProfitable ? 'success.main' : 'error.main'}
                display="flex"
                alignItems="center"
                justifyContent="center"
                gap={0.5}
              >
                {isProfitable ? <TrendingUp /> : <TrendingDown />}
                {Math.abs(trade.pnlPercentage || 0).toFixed(2)}%
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Additional Info */}
        {(trade.notes || trade.strategy) && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" fontWeight={700} mb={2}>
              Additional Information
            </Typography>
            {trade.strategy && (
              <Box mb={1}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Strategy:</strong> {trade.strategy}
                </Typography>
              </Box>
            )}
            {trade.notes && (
              <Box>
                <Typography variant="body2" color="text.secondary">
                  <strong>Notes:</strong> {trade.notes}
                </Typography>
              </Box>
            )}
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewTradeDetailsDialog;
