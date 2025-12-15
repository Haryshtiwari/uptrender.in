import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Tabs,
  Tab,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Skeleton,
  useTheme,
} from "@mui/material";
import { TrendingUp } from "@mui/icons-material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { adminStrategyService } from "../../../services/adminStrategyService";

const tabList = ["overview", "returns", "risk"];

// Generate mock performance data based on time range
const generatePerformanceData = (days) => {
  const data = [];
  const now = new Date();
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      pnl: Math.floor(Math.random() * 50000) - 10000,
      trades: Math.floor(Math.random() * 50) + 10,
      winRate: Math.floor(Math.random() * 30) + 60,
    });
  }
  return data;
};

const PerformanceChart = ({ timeRange, setTimeRange }) => {
  const theme = useTheme();
  const [tab, setTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [performanceData, setPerformanceData] = useState([]);
  const [stats, setStats] = useState({
    totalReturn: 0,
    monthlyAvg: 0,
    bestStrategy: 0,
    maxDrawdown: 0,
    volatility: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Get days from timeRange
        const daysMap = { '7d': 7, '30d': 30, '90d': 90, '1y': 365 };
        const days = daysMap[timeRange] || 30;
        
        // Generate performance data (in real app, this would come from API)
        const data = generatePerformanceData(days > 30 ? 30 : days);
        setPerformanceData(data);
        
        // Calculate stats
        const totalPnL = data.reduce((sum, d) => sum + d.pnl, 0);
        const avgWinRate = data.reduce((sum, d) => sum + d.winRate, 0) / data.length;
        
        setStats({
          totalReturn: ((totalPnL / 100000) * 100).toFixed(1),
          monthlyAvg: ((totalPnL / data.length / 100000) * 100 * 30).toFixed(1),
          bestStrategy: (Math.random() * 30 + 20).toFixed(1),
          maxDrawdown: -(Math.random() * 10 + 3).toFixed(1),
          volatility: (Math.random() * 10 + 8).toFixed(1),
        });
        
      } catch (error) {
        console.error("Error fetching performance data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [timeRange]);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
  const isDarkMode = theme.palette.mode === 'dark';

  return (
    <Card sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
      <CardHeader
        title={
          <Box
            display="flex"
            flexDirection={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ sm: "center" }}
            gap={2}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <TrendingUp />
              <Typography variant="h6">Performance Analytics</Typography>
            </Box>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel id="time-range-label">Range</InputLabel>
              <Select
                labelId="time-range-label"
                value={timeRange}
                label="Range"
                onChange={(e) => setTimeRange(e.target.value)}
              >
                <MenuItem value="7d">7 Days</MenuItem>
                <MenuItem value="30d">30 Days</MenuItem>
                <MenuItem value="90d">90 Days</MenuItem>
                <MenuItem value="1y">1 Year</MenuItem>
              </Select>
            </FormControl>
          </Box>
        }
      />
      <CardContent>
        <Tabs value={tab} onChange={(e, newVal) => setTab(newVal)} centered>
          <Tab label="Overview" value="overview" />
          <Tab label="Returns" value="returns" />
          <Tab label="Risk Analysis" value="risk" />
        </Tabs>

        {/* Fixed height container */}
        <Box mt={3} minHeight={280}>
          {loading ? (
            <Box height={250}>
              <Skeleton variant="rectangular" height="100%" sx={{ borderRadius: 2 }} />
            </Box>
          ) : (
            <>
              {tab === "overview" && (
                <Box height={250}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#333' : '#eee'} />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 12, fill: isDarkMode ? '#999' : '#666' }}
                        tickLine={{ stroke: isDarkMode ? '#555' : '#ccc' }}
                      />
                      <YAxis 
                        tick={{ fontSize: 12, fill: isDarkMode ? '#999' : '#666' }}
                        tickLine={{ stroke: isDarkMode ? '#555' : '#ccc' }}
                        tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: isDarkMode ? '#1e1e1e' : '#fff',
                          border: `1px solid ${isDarkMode ? '#333' : '#ddd'}`,
                          borderRadius: 8,
                        }}
                        formatter={(value) => [`₹${value.toLocaleString()}`, 'P&L']}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="pnl" 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 6, fill: '#3b82f6' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              )}

              {tab === "returns" && (
                <Box
                  height="100%"
                  display="grid"
                  gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr 1fr" }}
                  gap={2}
                >
                  <Box p={2} bgcolor={isDarkMode ? 'rgba(16, 185, 129, 0.1)' : '#ecfdf5'} borderRadius={2}>
                    <Typography fontSize={14} color="success.main">
                      Total Return
                    </Typography>
                    <Typography variant="h5" color="success.main">
                      {stats.totalReturn > 0 ? '+' : ''}{stats.totalReturn}%
                    </Typography>
                  </Box>
                  <Box p={2} bgcolor={isDarkMode ? 'rgba(59, 130, 246, 0.1)' : '#eff6ff'} borderRadius={2}>
                    <Typography fontSize={14} color="primary.main">
                      Monthly Avg
                    </Typography>
                    <Typography variant="h5" color="primary.main">
                      {stats.monthlyAvg > 0 ? '+' : ''}{stats.monthlyAvg}%
                    </Typography>
                  </Box>
                  <Box p={2} bgcolor={isDarkMode ? 'rgba(139, 92, 246, 0.1)' : '#f5f3ff'} borderRadius={2}>
                    <Typography fontSize={14} color="secondary.main">
                      Best Strategy
                    </Typography>
                    <Typography variant="h5" color="secondary.main">
                      +{stats.bestStrategy}%
                    </Typography>
                  </Box>
                </Box>
              )}

              {tab === "risk" && (
                <Box
                  height="100%"
                  display="grid"
                  gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr" }}
                  gap={2}
                >
                  <Box p={2} bgcolor={isDarkMode ? 'rgba(245, 158, 11, 0.1)' : '#fff7ed'} borderRadius={2}>
                    <Typography fontSize={14} color="warning.main">
                      Max Drawdown
                    </Typography>
                    <Typography variant="h5" color="warning.main">
                      {stats.maxDrawdown}%
                    </Typography>
                  </Box>
                  <Box p={2} bgcolor={isDarkMode ? 'rgba(239, 68, 68, 0.1)' : '#fee2e2'} borderRadius={2}>
                    <Typography fontSize={14} color="error.main">
                      Volatility
                    </Typography>
                    <Typography variant="h5" color="error.main">
                      {stats.volatility}%
                    </Typography>
                  </Box>
                </Box>
              )}
            </>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default PerformanceChart;
