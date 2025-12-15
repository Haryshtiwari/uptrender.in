import React, { useState, useEffect } from 'react';
import {
  Stack,
  Typography,
  Avatar,
  Box,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  useTheme,
  CircularProgress,
} from '@mui/material';
import { IconArrowUpRight } from '@tabler/icons-react';
import { PieChart } from '@mui/x-charts/PieChart';
import DashboardCard from '../../../components/common/DashboardCard';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import dashboardService from '../../../services/dashboardService';
import { useAuth } from '../../../app/authContext';

const UserGrowthChart = () => {
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;

  const { isAuthenticated, role, isLoading: authLoading } = useAuth();
  const [timeframe, setTimeframe] = useState('1M');
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    // Wait for auth to be ready
    if (authLoading) {
      return;
    }
    
    // Check both authentication AND role is loaded
    if (!isAuthenticated || !role) {
      setLoading(false);
      return;
    }
    
    // Verify admin role
    if (role !== 'admin') {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const fetchData = async () => {
      try {
        const result = await dashboardService.getAdminDashboard();
        if (!cancelled && result.success) {
          setDashboardData(result.data);
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Failed to fetch dashboard data:', err);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };
    fetchData();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, role, authLoading]);

  const totalUsers = dashboardData?.users?.total || 0;
  const activeUsers = dashboardData?.users?.active || 0;
  
  const userGrowthData = {
    '1W': [
      { label: 'New Users', value: Math.floor(totalUsers * 0.02) },
      { label: 'Returning Users', value: Math.floor(activeUsers * 0.03) },
    ],
    '1M': [
      { label: 'New Users', value: Math.floor(totalUsers * 0.1) },
      { label: 'Returning Users', value: Math.floor(activeUsers * 0.15) },
    ],
    '3M': [
      { label: 'New Users', value: Math.floor(totalUsers * 0.3) },
      { label: 'Returning Users', value: Math.floor(activeUsers * 0.4) },
    ],
    '6M': [
      { label: 'New Users', value: Math.floor(totalUsers * 0.6) },
      { label: 'Returning Users', value: Math.floor(activeUsers * 0.7) },
    ],
    '1Y': [
      { label: 'New Users', value: totalUsers },
      { label: 'Returning Users', value: activeUsers },
    ],
  };

  // Apply theme colors to each data point
  const chartData = userGrowthData[timeframe].map((item, index) => ({
    ...item,
    color: index === 0 ? primary : secondary,
  }));

  const totalForPeriod = chartData.reduce((sum, item) => sum + item.value, 0);

  if (loading) {
    return (
      <DashboardCard icon={<GroupAddIcon color="primary" />} title="User Growth">
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard
        icon={<GroupAddIcon color="primary" />} 
      title="User Growth"
      action={
        <FormControl size="small">
          <InputLabel id="timeframe-select-label">Period</InputLabel>
          <Select
            labelId="timeframe-select-label"
            id="timeframe-select"
            value={timeframe}
            label="Period"
            onChange={(e) => setTimeframe(e.target.value)}
          >
            <MenuItem value="1W">1 Week</MenuItem>
            <MenuItem value="1M">1 Month</MenuItem>
            <MenuItem value="3M">3 Months</MenuItem>
            <MenuItem value="6M">6 Months</MenuItem>
            <MenuItem value="1Y">1 Year</MenuItem>
          </Select>
        </FormControl>
      }
    >
      <Box display="flex" alignItems="center" gap={6}>
        <PieChart
          series={[
            {
              innerRadius: 60,
              outerRadius: 80,
              paddingAngle: 3,
              data: chartData,
            },
          ]}
          height={190}
          width={210}
          legend={{ hidden: true }}
        />

        <Stack spacing={1}>
          <Typography variant="h3" fontWeight={700}>
            {totalForPeriod.toLocaleString()}
          </Typography>
          <Typography variant="subtitle2" color="textSecondary">
            Total Users ({timeframe})
          </Typography>
          <Stack direction="column" spacing={1} alignItems="center">
            <Avatar
              sx={{ bgcolor: theme.palette.success.light, width: 27, height: 27 }}
            >
              <IconArrowUpRight width={20} color="#39B69A" />
            </Avatar>
            <Typography variant="subtitle2" fontWeight={600}>
              +14%
            </Typography>
            <Typography variant="subtitle2" color="textSecondary">
              compared to last
            </Typography>
          </Stack>
        </Stack>
      </Box>
    </DashboardCard>
  );
};

export default UserGrowthChart;
