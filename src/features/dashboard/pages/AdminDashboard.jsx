import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  IconButton,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Skeleton,
  Alert,
  Divider,
  Stack,
  Paper,
  useTheme,
} from '@mui/material';
import {
  People,
  TrendingUp,
  TrendingDown,
  ShowChart,
  AccountBalanceWallet,
  SupportAgent,
  Refresh,
  ArrowForward,
  CheckCircle,
  AccessTime,
  AttachMoney,
  PlayArrow,
  Public,
  Description,
} from '@mui/icons-material';
import { useNavigate } from 'react-router';
import { formatDistanceToNow } from 'date-fns';
import Chart from 'react-apexcharts';

import PageContainer from '../../../components/common/PageContainer';
import DashboardCard from '../../../components/common/DashboardCard';
import Breadcrumb from '../../../components/layout/full/shared/breadcrumb/Breadcrumb';
import dashboardService from '../../../services/dashboardService';
import { useAuth } from '../../../app/authContext';

const BCrumb = [
  { to: '/admin', title: 'Admin' },
  { title: 'Dashboard' },
];

// Stats Card Component
const StatsCard = ({ title, value, icon, color, trend, trendValue, loading }) => {
  const theme = useTheme();
  
  if (loading) {
    return (
      <Card sx={{ 
        bgcolor: 'background.paper', 
        border: '1px solid', 
        borderColor: 'divider',
        borderRadius: 2,
        height: '100%',
      }}>
        <CardContent>
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="40%" height={40} />
          <Skeleton variant="text" width="30%" />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card sx={{ 
      bgcolor: 'background.paper', 
      border: '1px solid', 
      borderColor: 'divider',
      borderRadius: 2,
      height: '100%',
      transition: 'all 0.3s ease',
      '&:hover': {
        borderColor: color,
        boxShadow: `0 4px 12px ${color}22`,
      },
    }}>
      <CardContent sx={{ p: 2.5 }}>
        <Box display="flex" alignItems="flex-start" justifyContent="space-between">
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" fontWeight={700} color="text.primary">
              {value}
            </Typography>
            {trend && (
              <Box display="flex" alignItems="center" mt={1}>
                {trend === 'up' ? (
                  <TrendingUp sx={{ fontSize: 16, color: 'success.main', mr: 0.5 }} />
                ) : (
                  <TrendingDown sx={{ fontSize: 16, color: 'error.main', mr: 0.5 }} />
                )}
                <Typography 
                  variant="caption" 
                  color={trend === 'up' ? 'success.main' : 'error.main'}
                >
                  {trendValue}
                </Typography>
              </Box>
            )}
          </Box>
          <Avatar
            sx={{
              bgcolor: `${color}22`,
              color: color,
              width: 48,
              height: 48,
            }}
          >
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );
};

// Quick Action Button
const QuickActionButton = ({ icon, label, onClick, color = 'primary' }) => (
  <Button
    variant="outlined"
    color={color}
    startIcon={icon}
    onClick={onClick}
    sx={{
      justifyContent: 'flex-start',
      py: 1.5,
      px: 2,
      borderRadius: 2,
      textTransform: 'none',
      '&:hover': {
        bgcolor: `${color}.light`,
      },
    }}
    fullWidth
  >
    {label}
  </Button>
);

const AdminDashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { isAuthenticated, role, isLoading: authLoading } = useAuth();
  
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    else setLoading(true);
    
    setError('');
    
    try {
      const result = await dashboardService.getAdminDashboard();
      
      if (result.success) {
        setStats(result.data);
      } else {
        setError(result.error || 'Failed to fetch dashboard data');
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (!authLoading && isAuthenticated && role === 'admin') {
      fetchDashboardData();
    }
  }, [authLoading, isAuthenticated, role]);

  const handleRefresh = () => {
    fetchDashboardData(true);
  };

  // Chart configurations
  const userGrowthOptions = {
    chart: {
      type: 'area',
      height: 200,
      sparkline: { enabled: true },
      toolbar: { show: false },
    },
    stroke: { curve: 'smooth', width: 2 },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.1,
        stops: [0, 90, 100],
      },
    },
    colors: [theme.palette.primary.main],
    tooltip: {
      theme: 'dark',
      fixed: { enabled: false },
      x: { show: false },
    },
  };

  const userGrowthSeries = [{
    name: 'Users',
    data: [15, 22, 28, 35, 42, 48, 55, 62, 70, 78, 85, stats?.users?.total || 90],
  }];

  const tradeStatusOptions = {
    chart: {
      type: 'donut',
      height: 280,
    },
    labels: ['Completed', 'Running', 'Pending', 'Failed'],
    colors: [
      theme.palette.success.main,
      theme.palette.info.main,
      theme.palette.warning.main,
      theme.palette.error.main,
    ],
    legend: {
      position: 'bottom',
      labels: { colors: theme.palette.text.secondary },
    },
    dataLabels: { enabled: false },
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total',
              color: theme.palette.text.primary,
              formatter: () => stats?.trades?.total || 0,
            },
          },
        },
      },
    },
  };

  const getTradeStatusData = () => {
    if (!stats?.trades?.byStatus) return [0, 0, 0, 0];
    const { completed, running, pending, failed } = stats.trades.byStatus;
    return [
      completed?.count || 0,
      running?.count || 0,
      pending?.count || 0,
      failed?.count || 0,
    ];
  };

  if (authLoading || loading) {
    return (
      <PageContainer title="Admin Dashboard" description="Admin Dashboard Overview">
        <Breadcrumb title="Dashboard" items={BCrumb} />
        <Grid container spacing={2} mt={1}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Grid size={{ xs: 6, sm: 4, md: 2 }} key={i}>
              <StatsCard loading />
            </Grid>
          ))}
        </Grid>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer title="Admin Dashboard" description="Admin Dashboard Overview">
        <Breadcrumb title="Dashboard" items={BCrumb} />
        <Box mt={3}>
          <Alert 
            severity="error" 
            action={
              <Button color="inherit" size="small" onClick={handleRefresh}>
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        </Box>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Admin Dashboard" description="Admin Dashboard Overview">
      {/* Header with Breadcrumb and Refresh */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Breadcrumb title="Dashboard" items={BCrumb} />
        <IconButton 
          onClick={handleRefresh} 
          disabled={refreshing}
          sx={{ 
            bgcolor: 'background.paper', 
            border: '1px solid', 
            borderColor: 'divider',
          }}
        >
          <Refresh sx={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
        </IconButton>
      </Box>

      {/* Overview Stats Row - Full Width */}
      <Grid container spacing={2}>
        <Grid size={{ xs: 6, sm: 4, md: 2 }}>
          <StatsCard
            title="Total Users"
            value={stats?.users?.total?.toLocaleString() || '0'}
            icon={<People />}
            color={theme.palette.primary.main}
            trend="up"
            trendValue={`Active: ${stats?.users?.active || 0}`}
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, md: 2 }}>
          <StatsCard
            title="Total Trades"
            value={stats?.trades?.total?.toLocaleString() || '0'}
            icon={<ShowChart />}
            color={theme.palette.info.main}
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, md: 2 }}>
          <StatsCard
            title="Active Strategies"
            value={stats?.strategies?.active?.toLocaleString() || '0'}
            icon={<PlayArrow />}
            color={theme.palette.success.main}
            trend="up"
            trendValue={`${stats?.strategies?.running || 0} running`}
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, md: 2 }}>
          <StatsCard
            title="Total Balance"
            value={`₹${parseFloat(stats?.wallets?.totalBalance || 0).toLocaleString()}`}
            icon={<AccountBalanceWallet />}
            color={theme.palette.warning.main}
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, md: 2 }}>
          <StatsCard
            title="Open Tickets"
            value={(stats?.support?.byStatus?.open || 0) + (stats?.support?.byStatus?.['in progress'] || 0)}
            icon={<SupportAgent />}
            color={theme.palette.error.main}
            trend={stats?.support?.byPriority?.high > 0 ? 'up' : undefined}
            trendValue={stats?.support?.byPriority?.high > 0 ? `${stats?.support?.byPriority?.high} high priority` : undefined}
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, md: 2 }}>
          <StatsCard
            title="Monthly Revenue"
            value={`₹${parseFloat(stats?.plans?.estimatedMonthlyRevenue || 0).toLocaleString()}`}
            icon={<AttachMoney />}
            color="#10b981"
          />
        </Grid>
      </Grid>

      {/* Charts and Quick Actions Row */}
      <Grid container spacing={2} mt={1}>
        {/* User Growth Chart */}
        <Grid size={{ xs: 12, md: 4 }}>
          <DashboardCard title="User Growth" sx={{ height: '100%' }}>
            <Box>
              <Typography variant="h3" fontWeight={700}>
                {stats?.users?.total || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>
                Total registered users
              </Typography>
              <Chart
                options={userGrowthOptions}
                series={userGrowthSeries}
                type="area"
                height={120}
              />
              <Divider sx={{ my: 2 }} />
              <Grid container spacing={2}>
                <Grid size={{ xs: 4 }}>
                  <Typography variant="caption" color="text.secondary">Verified</Typography>
                  <Typography variant="h6" fontWeight={600}>{stats?.users?.verified || 0}</Typography>
                </Grid>
                <Grid size={{ xs: 4 }}>
                  <Typography variant="caption" color="text.secondary">Active</Typography>
                  <Typography variant="h6" fontWeight={600} color="success.main">
                    {stats?.users?.active || 0}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 4 }}>
                  <Typography variant="caption" color="text.secondary">Inactive</Typography>
                  <Typography variant="h6" fontWeight={600} color="error.main">
                    {(stats?.users?.total || 0) - (stats?.users?.active || 0)}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </DashboardCard>
        </Grid>

        {/* Trade Status Distribution */}
        <Grid size={{ xs: 12, md: 4 }}>
          <DashboardCard title="Trade Status Distribution" sx={{ height: '100%' }}>
            <Chart
              options={tradeStatusOptions}
              series={getTradeStatusData()}
              type="donut"
              height={280}
            />
          </DashboardCard>
        </Grid>

        {/* Quick Actions */}
        <Grid size={{ xs: 12, md: 4 }}>
          <DashboardCard title="Quick Actions" sx={{ height: '100%' }}>
            <Stack spacing={1.5}>
              <QuickActionButton
                icon={<People />}
                label="Manage Users"
                onClick={() => navigate('/admin/dashboard/user-dashboard')}
              />
              <QuickActionButton
                icon={<ShowChart />}
                label="View Trades"
                onClick={() => navigate('/admin/dashboard/trade-dashboard')}
                color="info"
              />
              <QuickActionButton
                icon={<Description />}
                label="Strategy Management"
                onClick={() => navigate('/admin/dashboard/strategy-dashboard')}
                color="success"
              />
              <QuickActionButton
                icon={<SupportAgent />}
                label="Support Tickets"
                onClick={() => navigate('/admin/support')}
                color="warning"
              />
              <QuickActionButton
                icon={<AccountBalanceWallet />}
                label="Plans & Pricing"
                onClick={() => navigate('/admin/plans')}
                color="secondary"
              />
            </Stack>
          </DashboardCard>
        </Grid>
      </Grid>

      {/* Strategy and Support Stats Row */}
      <Grid container spacing={2} mt={1}>
        {/* Strategy Overview */}
        <Grid size={{ xs: 12, md: 6 }}>
          <DashboardCard title="Strategy Overview">
            <Grid container spacing={2}>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Paper 
                  sx={{ 
                    p: 2, 
                    textAlign: 'center', 
                    bgcolor: 'background.default',
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="h4" fontWeight={700} color="primary.main">
                    {stats?.strategies?.total || 0}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">Total</Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Paper 
                  sx={{ 
                    p: 2, 
                    textAlign: 'center', 
                    bgcolor: 'background.default',
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="h4" fontWeight={700} color="success.main">
                    {stats?.strategies?.active || 0}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">Active</Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Paper 
                  sx={{ 
                    p: 2, 
                    textAlign: 'center', 
                    bgcolor: 'background.default',
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="h4" fontWeight={700} color="info.main">
                    {stats?.strategies?.running || 0}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">Running</Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Paper 
                  sx={{ 
                    p: 2, 
                    textAlign: 'center', 
                    bgcolor: 'background.default',
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="h4" fontWeight={700} color="warning.main">
                    {stats?.strategies?.public || 0}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">Public</Typography>
                </Paper>
              </Grid>
            </Grid>
            <Box mt={2}>
              <Button 
                variant="outlined" 
                endIcon={<ArrowForward />}
                onClick={() => navigate('/admin/dashboard/strategy-dashboard')}
                fullWidth
              >
                View All Strategies
              </Button>
            </Box>
          </DashboardCard>
        </Grid>

        {/* Support Overview */}
        <Grid size={{ xs: 12, md: 6 }}>
          <DashboardCard title="Support Overview">
            <Grid container spacing={2}>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Paper 
                  sx={{ 
                    p: 2, 
                    textAlign: 'center', 
                    bgcolor: 'background.default',
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="h4" fontWeight={700} color="info.main">
                    {stats?.support?.byStatus?.open || 0}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">Open</Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Paper 
                  sx={{ 
                    p: 2, 
                    textAlign: 'center', 
                    bgcolor: 'background.default',
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="h4" fontWeight={700} color="warning.main">
                    {stats?.support?.byStatus?.['in progress'] || 0}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">In Progress</Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Paper 
                  sx={{ 
                    p: 2, 
                    textAlign: 'center', 
                    bgcolor: 'background.default',
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="h4" fontWeight={700} color="success.main">
                    {stats?.support?.byStatus?.resolved || 0}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">Resolved</Typography>
                </Paper>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Paper 
                  sx={{ 
                    p: 2, 
                    textAlign: 'center', 
                    bgcolor: 'background.default',
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="h4" fontWeight={700} color="error.main">
                    {stats?.support?.byPriority?.high || 0}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">High Priority</Typography>
                </Paper>
              </Grid>
            </Grid>
            <Box mt={2}>
              <Button 
                variant="outlined" 
                color="warning"
                endIcon={<ArrowForward />}
                onClick={() => navigate('/admin/support')}
                fullWidth
              >
                Manage Support Tickets
              </Button>
            </Box>
          </DashboardCard>
        </Grid>
      </Grid>

      {/* Recent Activity Row */}
      <Grid container spacing={2} mt={1}>
        {/* Recent Users */}
        <Grid size={{ xs: 12, md: 6 }}>
          <DashboardCard title="Recent Users">
            {stats?.recentActivity?.users?.length > 0 ? (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>User</TableCell>
                      <TableCell>Role</TableCell>
                      <TableCell>Joined</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stats.recentActivity.users.slice(0, 5).map((user) => (
                      <TableRow key={user.id} hover>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                              {user.name?.charAt(0)?.toUpperCase() || 'U'}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" fontWeight={500}>
                                {user.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {user.email}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={user.role} 
                            size="small" 
                            color={user.role === 'admin' ? 'error' : user.role === 'franchise' ? 'warning' : 'default'}
                            sx={{ textTransform: 'capitalize' }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption" color="text.secondary">
                            {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Box textAlign="center" py={3}>
                <Typography color="text.secondary">No recent users</Typography>
              </Box>
            )}
            <Box mt={2}>
              <Button 
                variant="text" 
                endIcon={<ArrowForward />}
                onClick={() => navigate('/admin/dashboard/user-dashboard')}
                fullWidth
              >
                View All Users
              </Button>
            </Box>
          </DashboardCard>
        </Grid>

        {/* Recent Trades */}
        <Grid size={{ xs: 12, md: 6 }}>
          <DashboardCard title="Recent Trades">
            {stats?.recentActivity?.trades?.length > 0 ? (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Symbol</TableCell>
                      <TableCell>User</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell align="right">P&L</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stats.recentActivity.trades.slice(0, 5).map((trade) => (
                      <TableRow key={trade.id} hover>
                        <TableCell>
                          <Typography variant="body2" fontWeight={500}>
                            {trade.symbol || trade.tradingSymbol || 'N/A'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption">
                            {trade.user?.name || trade.user?.username || 'Unknown'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={trade.type || trade.orderType || 'N/A'} 
                            size="small"
                            color={trade.type === 'BUY' ? 'success' : 'error'}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Typography 
                            variant="body2" 
                            fontWeight={500}
                            color={parseFloat(trade.pnl || 0) >= 0 ? 'success.main' : 'error.main'}
                          >
                            {parseFloat(trade.pnl || 0) >= 0 ? '+' : ''}
                            ₹{parseFloat(trade.pnl || 0).toFixed(2)}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Box textAlign="center" py={3}>
                <Typography color="text.secondary">No recent trades</Typography>
              </Box>
            )}
            <Box mt={2}>
              <Button 
                variant="text" 
                endIcon={<ArrowForward />}
                onClick={() => navigate('/admin/dashboard/trade-dashboard')}
                fullWidth
              >
                View All Trades
              </Button>
            </Box>
          </DashboardCard>
        </Grid>
      </Grid>

      {/* Platform Summary Row - Full Width Footer */}
      <Grid container spacing={2} mt={1}>
        <Grid size={{ xs: 12 }}>
          <DashboardCard title="Platform Summary">
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar sx={{ bgcolor: 'success.light', color: 'success.main' }}>
                    <CheckCircle />
                  </Avatar>
                  <Box flex={1}>
                    <Typography variant="body2" color="text.secondary">Verified Users</Typography>
                    <Typography variant="h6" fontWeight={600}>
                      {stats?.users?.verified || 0} / {stats?.users?.total || 0}
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={stats?.users?.total ? ((stats?.users?.verified || 0) / stats.users.total) * 100 : 0}
                      sx={{ mt: 1, height: 6, borderRadius: 3 }}
                      color="success"
                    />
                  </Box>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar sx={{ bgcolor: 'info.light', color: 'info.main' }}>
                    <Public />
                  </Avatar>
                  <Box flex={1}>
                    <Typography variant="body2" color="text.secondary">Public Strategies</Typography>
                    <Typography variant="h6" fontWeight={600}>
                      {stats?.strategies?.public || 0} / {stats?.strategies?.total || 0}
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={stats?.strategies?.total ? ((stats?.strategies?.public || 0) / stats.strategies.total) * 100 : 0}
                      sx={{ mt: 1, height: 6, borderRadius: 3 }}
                      color="info"
                    />
                  </Box>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar sx={{ bgcolor: 'warning.light', color: 'warning.main' }}>
                    <AccessTime />
                  </Avatar>
                  <Box flex={1}>
                    <Typography variant="body2" color="text.secondary">Pending Tickets</Typography>
                    <Typography variant="h6" fontWeight={600}>
                      {(stats?.support?.byStatus?.open || 0) + (stats?.support?.byStatus?.['in progress'] || 0)}
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={stats?.support?.total ? (((stats?.support?.byStatus?.open || 0) + (stats?.support?.byStatus?.['in progress'] || 0)) / stats.support.total) * 100 : 0}
                      sx={{ mt: 1, height: 6, borderRadius: 3 }}
                      color="warning"
                    />
                  </Box>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main' }}>
                    <AccountBalanceWallet />
                  </Avatar>
                  <Box flex={1}>
                    <Typography variant="body2" color="text.secondary">Active Wallets</Typography>
                    <Typography variant="h6" fontWeight={600}>
                      {stats?.wallets?.total || 0}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Total Balance: ₹{parseFloat(stats?.wallets?.totalBalance || 0).toLocaleString()}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </DashboardCard>
        </Grid>
      </Grid>

      {/* CSS for refresh animation */}
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </PageContainer>
  );
};

export default AdminDashboard;
