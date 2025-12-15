import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Avatar,
  Stack,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  ArrowBack,
  Public,
  PublicOff,
  PlayArrow,
  Pause,
  Edit,
  Delete,
  TrendingUp,
  TrendingDown,
  AttachMoney,
  ShowChart,
  CalendarToday,
  Person,
  Settings,
} from '@mui/icons-material';
import Breadcrumb from '../../../components/layout/full/shared/breadcrumb/Breadcrumb';
import { adminStrategyService } from '../../../services/adminStrategyService';
import { format, formatDistanceToNow } from 'date-fns';

const BCrumb = [
  { to: '/admin', title: 'Admin' },
  { to: '/admin/strategy-dashboard', title: 'Strategy Dashboard' },
  { title: 'Strategy Details' },
];

const AdminStrategyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [strategy, setStrategy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchStrategy = async () => {
      setLoading(true);
      setError('');
      try {
        const result = await adminStrategyService.getStrategyById(id);
        if (result.success) {
          setStrategy(result.data);
        } else {
          setError(result.message || 'Failed to fetch strategy details');
        }
      } catch (err) {
        console.error('Error fetching strategy:', err);
        setError('An error occurred while fetching strategy details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchStrategy();
    }
  }, [id]);

  const handleToggleStatus = async (field) => {
    setActionLoading(true);
    try {
      const result = await adminStrategyService.toggleStrategyStatus(id, field);
      if (result.success) {
        setStrategy(prev => ({
          ...prev,
          [field]: !prev[field]
        }));
      }
    } catch (err) {
      console.error('Error toggling status:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this strategy?')) return;
    
    setActionLoading(true);
    try {
      const result = await adminStrategyService.deleteStrategy(id);
      if (result.success) {
        navigate('/admin/strategy-dashboard');
      }
    } catch (err) {
      console.error('Error deleting strategy:', err);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height={400}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box>
        <Breadcrumb title="Strategy Details" items={BCrumb} />
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
          <Button size="small" onClick={() => navigate(-1)} sx={{ ml: 2 }}>
            Go Back
          </Button>
        </Alert>
      </Box>
    );
  }

  if (!strategy) {
    return (
      <Box>
        <Breadcrumb title="Strategy Details" items={BCrumb} />
        <Alert severity="warning" sx={{ mt: 2 }}>
          Strategy not found
          <Button size="small" onClick={() => navigate(-1)} sx={{ ml: 2 }}>
            Go Back
          </Button>
        </Alert>
      </Box>
    );
  }

  const getStatusColor = () => {
    if (!strategy.isActive) return 'error';
    if (strategy.isRunning) return 'success';
    return 'info';
  };

  const getStatusLabel = () => {
    if (!strategy.isActive) return 'Inactive';
    if (strategy.isRunning) return 'Running';
    return 'Active';
  };

  return (
    <Box>
      <Breadcrumb title="Strategy Details" items={BCrumb} />

      {/* Header */}
      <Paper sx={{ p: 3, mb: 3, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={2}>
          <Box display="flex" alignItems="center" gap={2}>
            <IconButton onClick={() => navigate(-1)}>
              <ArrowBack />
            </IconButton>
            <Avatar sx={{ width: 56, height: 56, bgcolor: 'primary.main', fontSize: 24 }}>
              {strategy.name?.charAt(0)?.toUpperCase() || 'S'}
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight="bold">{strategy.name}</Typography>
              <Stack direction="row" spacing={1} mt={0.5}>
                <Chip label={getStatusLabel()} color={getStatusColor()} size="small" />
                <Chip 
                  icon={strategy.isPublic ? <Public fontSize="small" /> : <PublicOff fontSize="small" />}
                  label={strategy.isPublic ? 'Public' : 'Private'} 
                  variant="outlined" 
                  size="small" 
                />
                {strategy.segment && (
                  <Chip label={strategy.segment} variant="outlined" size="small" />
                )}
              </Stack>
            </Box>
          </Box>
          
          <Stack direction="row" spacing={1}>
            <Tooltip title={strategy.isRunning ? 'Stop Strategy' : 'Start Strategy'}>
              <Button
                variant="outlined"
                color={strategy.isRunning ? 'warning' : 'success'}
                startIcon={strategy.isRunning ? <Pause /> : <PlayArrow />}
                onClick={() => handleToggleStatus('isRunning')}
                disabled={actionLoading}
              >
                {strategy.isRunning ? 'Stop' : 'Start'}
              </Button>
            </Tooltip>
            <Tooltip title={strategy.isActive ? 'Deactivate' : 'Activate'}>
              <Button
                variant="outlined"
                onClick={() => handleToggleStatus('isActive')}
                disabled={actionLoading}
              >
                {strategy.isActive ? 'Deactivate' : 'Activate'}
              </Button>
            </Tooltip>
            <Tooltip title={strategy.isPublic ? 'Make Private' : 'Make Public'}>
              <Button
                variant="outlined"
                startIcon={strategy.isPublic ? <PublicOff /> : <Public />}
                onClick={() => handleToggleStatus('isPublic')}
                disabled={actionLoading}
              >
                {strategy.isPublic ? 'Make Private' : 'Make Public'}
              </Button>
            </Tooltip>
            <Button
              variant="outlined"
              color="error"
              startIcon={<Delete />}
              onClick={handleDelete}
              disabled={actionLoading}
            >
              Delete
            </Button>
          </Stack>
        </Box>
      </Paper>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Card sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <AttachMoney />
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    ₹{Number(strategy.capital || 0).toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">Capital</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Card sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: strategy.totalPnL >= 0 ? 'success.main' : 'error.main' }}>
                  {strategy.totalPnL >= 0 ? <TrendingUp /> : <TrendingDown />}
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight="bold" color={strategy.totalPnL >= 0 ? 'success.main' : 'error.main'}>
                    {strategy.totalPnL >= 0 ? '+' : ''}₹{Number(strategy.totalPnL || 0).toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">Total P&L</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Card sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: 'info.main' }}>
                  <ShowChart />
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    {strategy.totalTrades || 0}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">Total Trades</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Card sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: 'warning.main' }}>
                  <Settings />
                </Avatar>
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    {strategy.legs || 1}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">Legs</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Details Section */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 3, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>Strategy Information</Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Grid container spacing={2}>
              <Grid size={{ xs: 6 }}>
                <Typography variant="caption" color="textSecondary">Description</Typography>
                <Typography variant="body2">{strategy.description || 'No description provided'}</Typography>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Typography variant="caption" color="textSecondary">Symbol</Typography>
                <Typography variant="body2">{strategy.symbol || 'N/A'}</Typography>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Typography variant="caption" color="textSecondary">Symbol Value</Typography>
                <Typography variant="body2">{strategy.symbolValue || 'N/A'}</Typography>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Typography variant="caption" color="textSecondary">Type</Typography>
                <Typography variant="body2">{strategy.type || 'N/A'}</Typography>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Typography variant="caption" color="textSecondary">Made By</Typography>
                <Typography variant="body2">{strategy.madeBy || 'N/A'}</Typography>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Typography variant="caption" color="textSecondary">Created By</Typography>
                <Typography variant="body2">{strategy.createdBy || strategy.user?.name || 'N/A'}</Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>Owner Information</Typography>
            <Divider sx={{ mb: 2 }} />
            
            {strategy.user ? (
              <Box>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    {strategy.user.name?.charAt(0)?.toUpperCase() || 'U'}
                  </Avatar>
                  <Box>
                    <Typography variant="body1" fontWeight={500}>{strategy.user.name}</Typography>
                    <Typography variant="caption" color="textSecondary">{strategy.user.email}</Typography>
                  </Box>
                </Box>
                <Typography variant="caption" color="textSecondary">User ID: {strategy.user.id}</Typography>
              </Box>
            ) : (
              <Typography color="textSecondary">Owner information not available</Typography>
            )}
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="caption" color="textSecondary" display="block">Created</Typography>
            <Typography variant="body2" mb={1}>
              {strategy.createdAt ? format(new Date(strategy.createdAt), 'PPP') : 'N/A'}
            </Typography>
            
            <Typography variant="caption" color="textSecondary" display="block">Last Updated</Typography>
            <Typography variant="body2">
              {strategy.updatedAt ? formatDistanceToNow(new Date(strategy.updatedAt), { addSuffix: true }) : 'N/A'}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminStrategyDetail;
