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
} from '@mui/material';
import {
  Close as CloseIcon,
  Person,
  TrendingUp,
  TrendingDown,
  AttachMoney,
  ShowChart,
} from '@mui/icons-material';

const ViewTradeDialog = ({ open, trade, onClose }) => {
  if (!trade) return null;

  const InfoRow = ({ icon, label, value }) => {
    const IconComponent = icon;
    return (
      <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Grid item xs={12} sm={4}>
          <Box display="flex" alignItems="center" gap={1}>
            <IconComponent fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary" fontWeight={600}>
              {label}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={8}>
          <Typography variant="body1">{value || 'N/A'}</Typography>
        </Grid>
      </Grid>
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'success';
      case 'Pending':
        return 'warning';
      case 'Failed':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              {trade.symbol?.[0] || 'T'}
            </Avatar>
            <Box>
              <Typography variant="h6">{trade.symbol}</Typography>
              <Typography variant="caption" color="text.secondary">
                Order ID: {trade.orderId || trade.id}
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {/* Status & Type */}
        <Box display="flex" gap={1} mb={3} flexWrap="wrap">
          <Chip
            label={trade.status}
            color={getStatusColor(trade.status)}
            size="small"
          />
          <Chip
            label={trade.type}
            color={trade.type && trade.type.toLowerCase() === 'buy' ? 'success' : 'error'}
            size="small"
          />
          <Chip label={trade.market} size="small" variant="outlined" />
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Trade Details */}
        <Typography variant="subtitle2" fontWeight={700} mb={2}>
          Trade Information
        </Typography>
        <InfoRow icon={ShowChart} label="Symbol" value={trade.symbol} />
        <InfoRow icon={AttachMoney} label="Amount" value={trade.amount} />
        <InfoRow icon={AttachMoney} label="Entry Price" value={`₹${Number(trade.price || 0).toLocaleString()}`} />
        <InfoRow icon={AttachMoney} label="Current Price" value={trade.currentPrice ? `₹${Number(trade.currentPrice).toLocaleString()}` : 'N/A'} />

        <Divider sx={{ my: 2 }} />

        {/* P&L */}
        <Typography variant="subtitle2" fontWeight={700} mb={2}>
          Profit & Loss
        </Typography>
        <InfoRow
          icon={trade.pnl >= 0 ? TrendingUp : TrendingDown}
          label="P&L Amount"
          value={
            <Typography
              variant="body1"
              color={trade.pnl >= 0 ? 'success.main' : 'error.main'}
              fontWeight={600}
            >
              ₹{Number(trade.pnl || 0).toLocaleString()}
            </Typography>
          }
        />
        <InfoRow
          icon={trade.pnlPercentage >= 0 ? TrendingUp : TrendingDown}
          label="P&L Percentage"
          value={
            <Typography
              variant="body1"
              color={trade.pnlPercentage >= 0 ? 'success.main' : 'error.main'}
              fontWeight={600}
            >
              {trade.pnlPercentage || 0}%
            </Typography>
          }
        />

        <Divider sx={{ my: 2 }} />

        {/* User & Broker Info */}
        <Typography variant="subtitle2" fontWeight={700} mb={2}>
          Additional Information
        </Typography>
        <InfoRow
          icon={Person}
          label="User"
          value={trade.User ? `${trade.User.firstName} ${trade.User.lastName}` : 'N/A'}
        />
        <InfoRow icon={ShowChart} label="Broker" value={trade.broker} />
        <InfoRow icon={ShowChart} label="Broker Type" value={trade.brokerType} />

        <Divider sx={{ my: 2 }} />

        {/* Timestamps */}
        <Typography variant="subtitle2" fontWeight={700} mb={2}>
          Timestamps
        </Typography>
        <InfoRow
          icon={ShowChart}
          label="Trade Date"
          value={new Date(trade.date || trade.createdAt).toLocaleString()}
        />
        <InfoRow
          icon={ShowChart}
          label="Created At"
          value={new Date(trade.createdAt).toLocaleString()}
        />
        {trade.updatedAt && (
          <InfoRow
            icon={ShowChart}
            label="Updated At"
            value={new Date(trade.updatedAt).toLocaleString()}
          />
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewTradeDialog;
