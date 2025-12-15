import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  CardHeader,
  InputAdornment,
  TextField,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  Chip,
  Grid,
  Skeleton,
  CircularProgress,
} from "@mui/material";
import {
  Search,
  Filter,
  Play,
  Pause,
  Settings,
  BarChart3,
  Target,
  TrendingUp,
} from "lucide-react";
import { Wifi, WifiOff } from "@mui/icons-material";
import { useNavigate } from 'react-router-dom';
import Scrollbar from "../../../components/custom-scroll/Scrollbar";
import StatsOverview from "../components/StatsOverview";
import PerformanceChart from "../components/PerformanceChart";
import StrategyTable from "../components/StrategyTable";
import TopSubscribedStrategies from "../components/TopSubscribedStrategies";
import Breadcrumb from "../../../components/layout/full/shared/breadcrumb/Breadcrumb";
import ExportReportDialog from '../../../components/shared/ExportReportDialog';
import NotificationsPanel from '../../../components/shared/NotificationsPanel';
import QuickActions from '../../../components/shared/QuickActions';
import useWebSocket from '../../../hooks/useWebSocket';
import { useToast } from '../../../hooks/useToast';
import { adminStrategyService } from '../../../services/adminStrategyService';

const StrategyDashboard = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [notificationsPanelOpen, setNotificationsPanelOpen] = useState(false);
  const [topPerformers, setTopPerformers] = useState([]);
  const [loadingTopPerformers, setLoadingTopPerformers] = useState(true);
  const [bulkActionLoading, setBulkActionLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [filterStatus, setFilterStatus] = useState("all");
  const [timeRange, setTimeRange] = useState("30d");

  // Fetch top performers
  const fetchTopPerformers = async () => {
    setLoadingTopPerformers(true);
    try {
      const result = await adminStrategyService.getAllStrategies({
        limit: 7,
        isActive: 'true',
      });
      
      if (result.success && result.data?.strategies) {
        setTopPerformers(result.data.strategies.map(s => ({
          id: s.id,
          name: s.name,
          return: s.totalPnL >= 0 ? `+₹${Number(s.totalPnL || 0).toLocaleString()}` : `-₹${Math.abs(Number(s.totalPnL || 0)).toLocaleString()}`,
          risk: s.riskLevel || 'Medium',
          winRate: `${(s.winRate || 0).toFixed(0)}%`,
        })));
      }
    } catch (error) {
      console.error('Error fetching top performers:', error);
    } finally {
      setLoadingTopPerformers(false);
    }
  };

  useEffect(() => {
    fetchTopPerformers();
  }, []);

  // WebSocket for real-time strategy updates
  const { isConnected, lastMessage } = useWebSocket('mock://localhost:8080', {
    onMessage: (data) => {
      console.log('Real-time strategy update:', data);
    },
  });

  useEffect(() => {
    if (lastMessage) {
      console.log('Processing strategy update:', lastMessage);
    }
  }, [lastMessage]);

  const handleExport = async (exportData) => {
    try {
      console.log('Exporting strategies:', exportData);
      showToast('Strategies exported successfully', 'success');
    } catch {
      showToast('Failed to export strategies', 'error');
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

  // Handle bulk actions
  const handleBulkAction = async (action) => {
    setBulkActionLoading(true);
    try {
      // Get all strategies to toggle
      const result = await adminStrategyService.getAllStrategies({ limit: 100 });
      if (result.success && result.data?.strategies) {
        const strategies = result.data.strategies;
        const field = action === 'start' ? 'isRunning' : 'isRunning';
        
        for (const strategy of strategies) {
          if ((action === 'start' && !strategy.isRunning) || (action === 'pause' && strategy.isRunning)) {
            await adminStrategyService.toggleStrategyStatus(strategy.id, field);
          }
        }
        
        showToast(`${action === 'start' ? 'Started' : 'Paused'} all strategies`, 'success');
        setRefreshKey(prev => prev + 1);
        fetchTopPerformers();
      }
    } catch (error) {
      showToast(`Failed to ${action} strategies`, 'error');
    } finally {
      setBulkActionLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", pb: 4 }}>
      {/* Header */}
     <Breadcrumb title="Strategy Dashboard"/>

      <Box px={4} mt={4}>
        {/* Stats Overview */}
        <StatsOverview />

        {/* Main Grid */}
        <Grid container spacing={3} mt={1}>
          {/* Left Column */}
          <Grid size={{xs:12,md:12,sm:12,lg:7}}>
            <Box display="flex" flexDirection="column" gap={3}>
              <PerformanceChart timeRange={timeRange} setTimeRange={setTimeRange} />

              {/* Strategy Table */}
              <Card>
                <CardHeader
                  title={
                    <Box display="flex" alignItems="center" gap={1}>
                      <Target size={20} />
                      <Typography variant="h6">Active Strategies</Typography>
                    </Box>
                  }
                  action={
                    <Box display="flex" gap={2}>
                      <TextField
                        size="small"
                        placeholder="Search strategies..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Search size={16} />
                            </InputAdornment>
                          ),
                        }}
                      />
                      <FormControl size="small" sx={{ minWidth: 120 }}>
                        <InputLabel>Status</InputLabel>
                        <Select
                          value={filterStatus}
                          onChange={(e) => setFilterStatus(e.target.value)}
                          label="Status"
                          startAdornment={<Filter size={16} style={{ marginRight: 4 }} />}
                        >
                          <MenuItem value="all">All</MenuItem>
                          <MenuItem value="active">Active</MenuItem>
                          <MenuItem value="paused">Paused</MenuItem>
                          <MenuItem value="stopped">Stopped</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                  }
                />
                <CardContent>
                  <StrategyTable 
                    key={refreshKey}
                    searchTerm={searchTerm} 
                    filterStatus={filterStatus} 
                    onRefresh={() => {
                      setRefreshKey(prev => prev + 1);
                      fetchTopPerformers();
                    }}
                  />
                </CardContent>
              </Card>
            </Box>
          </Grid>

          {/* Right Column */}
          <Grid size={{xs:12,md:12,sm:12,lg:5}}>
            <Box display="flex" flexDirection="column" gap={3}>
              {/* Quick Actions */}
              <Card>
                <CardHeader title="Quick Actions" />
                <CardContent sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Button 
                    fullWidth 
                    variant="outlined" 
                    startIcon={bulkActionLoading ? <CircularProgress size={16} /> : <Play />}
                    onClick={() => handleBulkAction('start')}
                    disabled={bulkActionLoading}
                  >
                    Start All Strategies
                  </Button>
                  <Button 
                    fullWidth 
                    variant="outlined" 
                    startIcon={bulkActionLoading ? <CircularProgress size={16} /> : <Pause />}
                    onClick={() => handleBulkAction('pause')}
                    disabled={bulkActionLoading}
                  >
                    Pause All Strategies
                  </Button>
                  <Button 
                    fullWidth 
                    variant="outlined" 
                    startIcon={<Settings />}
                    onClick={() => navigate('/admin/settings')}
                  >
                    Global Settings
                  </Button>
                  <Button 
                    fullWidth 
                    variant="outlined" 
                    startIcon={<BarChart3 />}
                    onClick={() => setExportDialogOpen(true)}
                  >
                    Analytics Report
                  </Button>
                </CardContent>
              </Card>

              {/* Top Performers */}
              <Card>
                <CardHeader
                  title={
                    <Box display="flex" alignItems="center" gap={1}>
                      <TrendingUp size={20} color="green" />
                      <Typography variant="h6">Top Performers</Typography>
                    </Box>
                  }
                />
                <Scrollbar sx={{ maxHeight: 300, overflowY: "auto" }}>
                  {loadingTopPerformers ? (
                    <Box p={2}>
                      {[1, 2, 3, 4, 5].map(i => (
                        <Box key={i} display="flex" justifyContent="space-between" alignItems="center" p={1} mb={1}>
                          <Box>
                            <Skeleton width={120} height={24} />
                            <Skeleton width={80} height={18} />
                          </Box>
                          <Skeleton width={80} height={24} />
                        </Box>
                      ))}
                    </Box>
                  ) : topPerformers.length === 0 ? (
                    <Box p={2} textAlign="center">
                      <Typography color="text.secondary">No strategies found</Typography>
                    </Box>
                  ) : (
                    topPerformers.map((strategy, idx) => (
                      <Box
                        key={strategy.id || idx}
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        p={1}
                        borderRadius={2}
                        bgcolor="action.hover"
                        mb={1}
                        sx={{ 
                          cursor: 'pointer',
                          '&:hover': { bgcolor: 'action.selected' }
                        }}
                        onClick={() => navigate(`/admin/strategies/${strategy.id}`)}
                      >
                        <Box>
                          <Typography fontSize="0.9rem" fontWeight="500">
                            {strategy.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {strategy.risk} Risk • Win: {strategy.winRate}
                          </Typography>
                        </Box>
                        <Chip
                          label={strategy.return}
                          size="small"
                          sx={{ 
                            bgcolor: strategy.return.startsWith('+') ? "#dcfce7" : "#fee2e2", 
                            color: strategy.return.startsWith('+') ? "#16a34a" : "#dc2626", 
                            fontWeight: 500 
                          }}
                        />
                      </Box>
                    ))
                  )}
                </Scrollbar>
              </Card>

              {/* Top Subscribed Strategies */}
              <TopSubscribedStrategies />
            </Box>
          </Grid>
        </Grid>

        {/* Live Connection Status */}
        <Box display="flex" justifyContent="flex-end" sx={{ mt: 2 }}>
          <Chip
            icon={isConnected ? <Wifi /> : <WifiOff />}
            label={isConnected ? 'Live Updates' : 'Disconnected'}
            color={isConnected ? 'success' : 'default'}
            size="small"
          />
        </Box>
      </Box>

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

export default StrategyDashboard;
