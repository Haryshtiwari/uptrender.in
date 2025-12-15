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
  Paper,
  LinearProgress,
} from '@mui/material';
import {
  Close as CloseIcon,
  TrendingUp,
  TrendingDown,
  Public,
  Lock,
  Star,
  People,
  AttachMoney,
  ShowChart,
  CalendarToday,
  Person,
} from '@mui/icons-material';

const StrategyDetailsDialog = ({ open, strategy, onClose, onSubscribe, onClone, onFavorite }) => {
  if (!strategy) return null;

  const InfoCard = ({ icon, label, value, color }) => {
    const IconComponent = icon;
    return (
      <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default', textAlign: 'center' }}>
        <IconComponent sx={{ fontSize: 32, color: color || 'primary.main', mb: 1 }} />
        <Typography variant="h5" fontWeight={700} gutterBottom>
          {value}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
      </Paper>
    );
  };

  const MetricBar = ({ label, value, max, color }) => (
    <Box mb={2}>
      <Box display="flex" justifyContent="space-between" mb={0.5}>
        <Typography variant="body2" color="text.secondary">{label}</Typography>
        <Typography variant="body2" fontWeight={600}>{value}%</Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={(value / max) * 100}
        sx={{
          height: 8,
          borderRadius: 4,
          bgcolor: 'action.hover',
          '& .MuiLinearProgress-bar': {
            bgcolor: color,
          },
        }}
      />
    </Box>
  );

  const isFavorite = strategy.isFavorite || false;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
              {strategy.name?.[0] || 'S'}
            </Avatar>
            <Box>
              <Typography variant="h6">{strategy.name}</Typography>
              <Box display="flex" gap={1} mt={0.5}>
                <Chip
                  icon={strategy.isPublic ? <Public /> : <Lock />}
                  label={strategy.isPublic ? 'Public' : 'Private'}
                  size="small"
                  color={strategy.isPublic ? 'info' : 'default'}
                />
                <Chip
                  label={strategy.segment}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              </Box>
            </Box>
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {/* Performance Metrics */}
        <Grid container spacing={2} mb={3}>
          <Grid item xs={6} sm={3}>
            <InfoCard
              icon={TrendingUp}
              label="Win Rate"
              value={`${strategy.winRate || 0}%`}
              color="success.main"
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <InfoCard
              icon={AttachMoney}
              label="Total P&L"
              value={`₹${strategy.totalPnL?.toLocaleString() || 0}`}
              color={strategy.totalPnL >= 0 ? 'success.main' : 'error.main'}
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <InfoCard
              icon={ShowChart}
              label="Total Trades"
              value={strategy.totalTrades || 0}
              color="info.main"
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <InfoCard
              icon={People}
              label="Subscribers"
              value={strategy.subscribers || 0}
              color="secondary.main"
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        {/* Description */}
        {strategy.description && (
          <>
            <Typography variant="subtitle2" fontWeight={700} mb={1}>
              Description
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {strategy.description}
            </Typography>
            <Divider sx={{ my: 2 }} />
          </>
        )}

        {/* Strategy Details */}
        <Typography variant="subtitle2" fontWeight={700} mb={2}>
          Strategy Information
        </Typography>
        <Grid container spacing={2} mb={2}>
          <Grid item xs={6}>
            <Box display="flex" gap={1} alignItems="center" mb={1}>
              <Person fontSize="small" color="action" />
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Creator
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {strategy.User ? `${strategy.User.firstName} ${strategy.User.lastName}` : 'Anonymous'}
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box display="flex" gap={1} alignItems="center" mb={1}>
              <AttachMoney fontSize="small" color="action" />
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Minimum Capital
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  ₹{strategy.capital?.toLocaleString() || 0}
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box display="flex" gap={1} alignItems="center" mb={1}>
              <ShowChart fontSize="small" color="action" />
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Number of Legs
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {strategy.legs || 1}
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box display="flex" gap={1} alignItems="center" mb={1}>
              <CalendarToday fontSize="small" color="action" />
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Created
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {new Date(strategy.createdAt).toLocaleDateString()}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        {/* Performance Bars */}
        <Typography variant="subtitle2" fontWeight={700} mb={2}>
          Performance Metrics
        </Typography>
        <MetricBar
          label="Win Rate"
          value={strategy.winRate || 0}
          max={100}
          color="success.main"
        />
        <MetricBar
          label="Risk Score"
          value={strategy.riskScore || 0}
          max={100}
          color="warning.main"
        />
        <MetricBar
          label="Activity Level"
          value={strategy.activityLevel || 0}
          max={100}
          color="info.main"
        />
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button
          onClick={() => {
            onFavorite(strategy.id);
          }}
          variant="outlined"
          startIcon={isFavorite ? <Star /> : <Star />}
          color={isFavorite ? 'warning' : 'default'}
        >
          {isFavorite ? 'Favorited' : 'Favorite'}
        </Button>
        <Box flex={1} />
        <Button
          onClick={() => {
            onClone(strategy);
            onClose();
          }}
          variant="outlined"
          color="secondary"
        >
          Clone
        </Button>
        <Button
          onClick={() => {
            onSubscribe(strategy);
            onClose();
          }}
          variant="contained"
          color="primary"
        >
          Subscribe
        </Button>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StrategyDetailsDialog;
