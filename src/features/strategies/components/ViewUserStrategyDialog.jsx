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
  Category,
  AttachMoney,
  TrendingUp,
  Public,
  Lock,
  PlayArrow,
  Pause,
  CalendarToday,
  Description,
} from '@mui/icons-material';

const ViewUserStrategyDialog = ({ open, strategy, onClose, onEdit, onClone, onToggleStatus }) => {
  if (!strategy) return null;

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

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              {strategy.name?.[0] || 'S'}
            </Avatar>
            <Box>
              <Typography variant="h6">{strategy.name}</Typography>
              <Typography variant="caption" color="text.secondary">
                Strategy Details
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {/* Status Badges */}
        <Box display="flex" gap={1} mb={3} flexWrap="wrap">
          <Chip
            label={strategy.isActive ? 'Active' : 'Inactive'}
            color={strategy.isActive ? 'success' : 'default'}
            size="small"
          />
          <Chip
            icon={strategy.isPublic ? <Public /> : <Lock />}
            label={strategy.isPublic ? 'Public' : 'Private'}
            color={strategy.isPublic ? 'info' : 'default'}
            size="small"
          />
          <Chip
            icon={strategy.isRunning ? <PlayArrow /> : <Pause />}
            label={strategy.isRunning ? 'Running' : 'Stopped'}
            color={strategy.isRunning ? 'success' : 'warning'}
            size="small"
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Basic Info */}
        <Typography variant="subtitle2" fontWeight={700} mb={2}>
          Basic Information
        </Typography>
        <InfoRow icon={Category} label="Segment" value={strategy.segment} />
        <InfoRow icon={Category} label="Type" value={strategy.strategyType || 'Intraday'} />
        <InfoRow icon={AttachMoney} label="Capital" value={`₹${strategy.capital?.toLocaleString() || 0}`} />
        <InfoRow icon={TrendingUp} label="Symbol" value={strategy.symbol} />
        <InfoRow icon={TrendingUp} label="Symbol Value" value={strategy.symbolValue} />
        <InfoRow icon={CalendarToday} label="Created At" value={new Date(strategy.createdAt).toLocaleString()} />
        {strategy.updatedAt && (
          <InfoRow icon={CalendarToday} label="Last Updated" value={new Date(strategy.updatedAt).toLocaleString()} />
        )}

        <Divider sx={{ my: 2 }} />

        {/* Description */}
        {strategy.description && (
          <>
            <Typography variant="subtitle2" fontWeight={700} mb={2}>
              <Description fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
              Description
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {strategy.description}
            </Typography>
          </>
        )}

        {/* Performance Stats (if available) */}
        {strategy.totalTrades !== undefined && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" fontWeight={700} mb={2}>
              Performance Statistics
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                <Box textAlign="center" p={1} sx={{ bgcolor: 'background.default', borderRadius: 1 }}>
                  <Typography variant="h6" color="primary">{strategy.totalTrades || 0}</Typography>
                  <Typography variant="caption">Total Trades</Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box textAlign="center" p={1} sx={{ bgcolor: 'background.default', borderRadius: 1 }}>
                  <Typography variant="h6" color="success.main">{strategy.winRate || 0}%</Typography>
                  <Typography variant="caption">Win Rate</Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box textAlign="center" p={1} sx={{ bgcolor: 'background.default', borderRadius: 1 }}>
                  <Typography 
                    variant="h6" 
                    color={strategy.totalPnL >= 0 ? 'success.main' : 'error.main'}
                  >
                    ₹{strategy.totalPnL?.toLocaleString() || 0}
                  </Typography>
                  <Typography variant="caption">Total P&L</Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Box textAlign="center" p={1} sx={{ bgcolor: 'background.default', borderRadius: 1 }}>
                  <Typography variant="h6" color="info.main">{strategy.subscribers || 0}</Typography>
                  <Typography variant="caption">Subscribers</Typography>
                </Box>
              </Grid>
            </Grid>
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
        <Box display="flex" gap={1}>
          {onClone && (
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => {
                onClone(strategy);
                onClose();
              }}
            >
              Clone Strategy
            </Button>
          )}
          {onToggleStatus && (
            <Button
              variant="outlined"
              color={strategy.isActive ? 'warning' : 'success'}
              onClick={() => {
                onToggleStatus(strategy.id, strategy.isActive);
                onClose();
              }}
            >
              {strategy.isActive ? 'Stop Strategy' : 'Start Strategy'}
            </Button>
          )}
        </Box>
        <Box display="flex" gap={1}>
          {onEdit && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                onEdit(strategy);
                onClose();
              }}
            >
              Edit Strategy
            </Button>
          )}
          <Button onClick={onClose} variant="outlined">
            Close
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default ViewUserStrategyDialog;
