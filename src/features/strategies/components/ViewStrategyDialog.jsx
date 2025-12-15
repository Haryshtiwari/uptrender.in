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
  Category,
  AttachMoney,
  TrendingUp,
  Public,
  Lock,
  PlayArrow,
  Pause,
} from '@mui/icons-material';

const ViewStrategyDialog = ({ open, strategy, onClose }) => {
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
                ID: {strategy.id}
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
        <InfoRow icon={Person} label="Owner" value={strategy.User ? `${strategy.User.firstName} ${strategy.User.lastName}` : 'N/A'} />
        <InfoRow icon={Category} label="Segment" value={strategy.segment} />
        <InfoRow icon={AttachMoney} label="Capital" value={`₹${Number(strategy.capital || 0).toLocaleString()}`} />
        <InfoRow icon={TrendingUp} label="Performance" value={`${strategy.performance || 0}%`} />

        <Divider sx={{ my: 2 }} />

        {/* Trading Details */}
        <Typography variant="subtitle2" fontWeight={700} mb={2}>
          Trading Details
        </Typography>
        <InfoRow icon={Category} label="Symbol" value={strategy.symbol} />
        <InfoRow icon={Category} label="Symbol Value" value={strategy.symbolValue} />
        <InfoRow icon={Category} label="Legs" value={strategy.legs} />
        <InfoRow icon={Category} label="Type" value={strategy.type} />

        {strategy.description && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" fontWeight={700} mb={1}>
              Description
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {strategy.description}
            </Typography>
          </>
        )}

        <Divider sx={{ my: 2 }} />

        {/* Timestamps */}
        <Typography variant="subtitle2" fontWeight={700} mb={2}>
          Timestamps
        </Typography>
        <InfoRow
          icon={Category}
          label="Created At"
          value={new Date(strategy.createdAt).toLocaleString()}
        />
        <InfoRow
          icon={Category}
          label="Updated At"
          value={new Date(strategy.updatedAt).toLocaleString()}
        />
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewStrategyDialog;
