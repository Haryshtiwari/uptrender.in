import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Paper,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  TrendingDown,
  ShowChart,
  AccountBalance,
  Wifi,
  WifiOff,
} from '@mui/icons-material';
import Breadcrumb from '../../../components/layout/full/shared/breadcrumb/Breadcrumb';
import PageContainer from '../../../components/common/PageContainer';
import DateRangePicker from '../../../components/shared/DateRangePicker';
import ExportReportDialog from '../../../components/shared/ExportReportDialog';
import NotificationsPanel from '../../../components/shared/NotificationsPanel';
import QuickActions from '../../../components/shared/QuickActions';
import useWebSocket from '../../../hooks/useWebSocket';
import { useToast } from '../../../hooks/useToast';

const BCrumb = [
  { to: '/dashboard', title: 'Dashboard' },
  { title: 'Trades' },
];

const TradeDashboard = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [, setDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [notificationsPanelOpen, setNotificationsPanelOpen] = useState(false);

  // Mock trade statistics
  const [stats, setStats] = useState({
    totalTrades: 156,
    activeTrades: 8,
    profitableTrades: 102,
    totalProfit: 245680,
    totalLoss: 89320,
    winRate: 65.4,
  });

  // WebSocket for real-time trade updates
  const { isConnected, lastMessage } = useWebSocket('mock://localhost:8080', {
    onMessage: (data) => {
      console.log('Real-time trade update:', data);
      // Update stats based on real-time data
      if (data.type === 'update') {
        setStats((prev) => ({
          ...prev,
          totalTrades: prev.totalTrades + 1,
        }));
      }
    },
  });

  useEffect(() => {
    if (lastMessage) {
      console.log('Processing trade update:', lastMessage);
    }
  }, [lastMessage]);

  const handleDateRangeChange = (newRange) => {
    setDateRange(newRange);
    showToast('Date range updated', 'info');
  };

  const handleExport = async (exportData) => {
    try {
      console.log('Exporting trades:', exportData);
      showToast('Trades exported successfully', 'success');
    } catch {
      showToast('Failed to export trades', 'error');
    }
  };

  const handleQuickAction = (action) => {
    switch (action) {
      case 'newStrategy':
        navigate('/user/strategies/create');
        break;
      case 'newTrade':
        showToast('New trade feature coming soon', 'info');
        break;
      case 'refresh':
        window.location.reload();
        break;
      case 'export':
        setExportDialogOpen(true);
        break;
      case 'notifications':
        setNotificationsPanelOpen(true);
        break;
      default:
        break;
    }
  };

  const StatCard = ({ title, value, icon, color, subtitle }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="start">
          <Box>
            <Typography color="text.secondary" variant="body2" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" sx={{ color }}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              backgroundColor: `${color}15`,
              borderRadius: 2,
              p: 1,
              color,
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <PageContainer
        title="Trade Dashboard"
        description="Track your trading activity"
      />
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Breadcrumb title="Trade Dashboard" items={BCrumb} />
        <Chip
          icon={isConnected ? <Wifi /> : <WifiOff />}
          label={isConnected ? 'Live Updates' : 'Disconnected'}
          color={isConnected ? 'success' : 'default'}
          size="small"
        />
      </Box>

      {/* Date Range Filter */}
      <DateRangePicker onDateRangeChange={handleDateRangeChange} />

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Trades"
            value={stats.totalTrades}
            icon={<ShowChart />}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Trades"
            value={stats.activeTrades}
            icon={<TrendingUp />}
            color="#2e7d32"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Win Rate"
            value={`${stats.winRate}%`}
            icon={<TrendingUp />}
            color="#ed6c02"
            subtitle={`${stats.profitableTrades} profitable trades`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Net P&L"
            value={`₹${(stats.totalProfit - stats.totalLoss).toLocaleString()}`}
            icon={<AccountBalance />}
            color={stats.totalProfit > stats.totalLoss ? '#2e7d32' : '#d32f2f'}
          />
        </Grid>
      </Grid>

      {/* Main Content */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Recent Trades
        </Typography>
        <Typography color="text.secondary">
          Your recent trading activity will appear here with real-time updates.
        </Typography>
      </Paper>

      {/* Quick Actions Speed Dial */}
      <QuickActions onAction={handleQuickAction} />

      {/* Export Report Dialog */}
      <ExportReportDialog
        open={exportDialogOpen}
        onClose={() => setExportDialogOpen(false)}
        onExport={handleExport}
      />

      {/* Notifications Panel */}
      <NotificationsPanel
        open={notificationsPanelOpen}
        onClose={() => setNotificationsPanelOpen(false)}
      />
    </Box>
  );
};

export default TradeDashboard;