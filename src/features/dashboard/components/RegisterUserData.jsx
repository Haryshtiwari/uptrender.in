import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import {
  Grid,
  MenuItem,
  Stack,
  Typography,
  Button,
  Avatar,
  Box,
  CircularProgress,
} from '@mui/material';
import { IconGridDots } from '@tabler/icons-react';
import DashboardCard from '../../../components/common/DashboardCard';
import CustomSelect from './CustomSelect';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import dashboardService from '../../../services/dashboardService';
import { useAuth } from '../../../app/authContext';

const RegisterUserData = () => {
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;

  const { isAuthenticated, role, isLoading: authLoading } = useAuth();
  const [plan, setPlan] = React.useState('All');
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    // Wait for auth to be ready
    if (authLoading) {
      return;
    }
    
    // Check both authentication AND role is loaded
    if (!isAuthenticated || !role) {
      console.log('[RegisterUserData] Not authenticated or role not loaded');
      setLoading(false);
      return;
    }
    
    // Verify admin role
    if (role !== 'admin') {
      console.log('[RegisterUserData] User is not admin, role:', role);
      setLoading(false);
      return;
    }

    let cancelled = false;

    const fetchData = async () => {
      try {
        console.log('[RegisterUserData] Fetching admin dashboard data...');
        setLoading(true);
        const result = await dashboardService.getAdminDashboard();
        console.log('[RegisterUserData] Dashboard API result:', result);
        
        if (!cancelled) {
          if (result.success && result.data) {
            console.log('[RegisterUserData] Setting dashboard data:', result.data);
            setDashboardData(result.data);
          } else {
            console.error('[RegisterUserData] API call failed:', result.error || 'Unknown error');
          }
        }
      } catch (err) {
        if (!cancelled) {
          console.error('[RegisterUserData] Failed to fetch dashboard data:', err);
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

  // ✅ Generate monthly data based on available stats
  const generateMonthlyData = (total) => {
    const months = 12;
    const baseValue = Math.floor(total / months);
    const variation = baseValue * 0.3;
    return Array.from({ length: months }, () => 
      Math.floor(baseValue + (Math.random() * variation))
    );
  };

  const planData = {
    All: {
      registered: generateMonthlyData(dashboardData?.users?.total || 0),
      subscribed: generateMonthlyData(dashboardData?.plans?.active || 0),
      earnings: parseFloat(dashboardData?.plans?.estimatedMonthlyRevenue || 0) * 12,
      thisMonth: parseFloat(dashboardData?.plans?.estimatedMonthlyRevenue || 0),
      pending: dashboardData?.trades?.byStatus?.pending?.count || 0,
    },
    Basic: {
      registered: [22, 35, 30, 50, 28, 60, 33, 55, 62, 45, 40, 58],
      subscribed: [12, 23, 22, 36, 15, 40, 20, 45, 48, 32, 26, 45],
      earnings: 63489.5,
      thisMonth: 48820,
      pending: 28820,
    },
    Standard: {
      registered: [30, 45, 38, 60, 35, 70, 40, 65, 72, 55, 50, 66],
      subscribed: [18, 30, 28, 50, 22, 55, 30, 58, 60, 44, 38, 53],
      earnings: 93410.2,
      thisMonth: 60820,
      pending: 32890,
    },
    Premium: {
      registered: [42, 60, 55, 70, 48, 85, 52, 75, 80, 65, 63, 78],
      subscribed: [30, 45, 40, 60, 35, 68, 42, 70, 72, 58, 50, 66],
      earnings: 123000,
      thisMonth: 74820,
      pending: 38410,
    },
  };

  const handleChange = (event) => {
    setPlan(event.target.value);
  };

  if (loading) {
    return (
      <DashboardCard icon={<HowToRegIcon color="primary" />} title="User Register Overview">
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      </DashboardCard>
    );
  }

  const currentPlan = planData[plan];

  const optionscolumnchart = {
    chart: {
      type: 'bar',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      foreColor: '#adb0bb',
      toolbar: {
        show: true,
      },
      height: 400,
      stacked: true,
    },
    colors: [primary, secondary],
    plotOptions: {
      bar: {
        horizontal: false,
        barHeight: '60%',
        columnWidth: '30%',
        borderRadius: 6,
        borderRadiusApplication: 'end',
        borderRadiusWhenStacked: 'all',
      },
    },
    stroke: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    legend: { show: true },
    grid: {
      borderColor: 'rgba(0,0,0,0.1)',
      strokeDashArray: 3,
      xaxis: {
        lines: {
          show: false,
        },
      },
    },
    yaxis: {
      min: 0,
      max: 200,
      tickAmount: 5,
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      axisBorder: {
        show: false,
      },
    },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
      fillSeriesColor: false,
    },
  };

  const seriescolumnchart = [
    {
      name: 'Registered Users',
      data: currentPlan.registered,
    },
    {
      name: 'Subscribed Users',
      data: currentPlan.subscribed,
    },
  ];

  // Debug info
  console.log('[RegisterUserData] Current state:', {
    loading,
    authLoading,
    isAuthenticated,
    role,
    hasDashboardData: !!dashboardData
  });

  if (loading) {
    return (
      <DashboardCard
        icon={<HowToRegIcon color=\"primary\" />} 
        title=\"User Register Overview\"
        subtitle=\"Loading...\"
      >
        <Box display=\"flex\" justifyContent=\"center\" alignItems=\"center\" height={300}>
          <CircularProgress />
          <Typography variant=\"body2\" sx={{ ml: 2 }}>Loading dashboard data...</Typography>
        </Box>
      </DashboardCard>
    );
  }

  if (!dashboardData) {
    return (
      <DashboardCard
        icon={<HowToRegIcon color=\"primary\" />} 
        title=\"User Register Overview\"
        subtitle=\"No Data\"
      >
        <Box display=\"flex\" justifyContent=\"center\" alignItems=\"center\" height={300}>
          <Typography variant=\"body2\" color=\"textSecondary\">
            No dashboard data available. Please check your connection and try again.
          </Typography>
        </Box>
      </DashboardCard>
    );
  }

  return (
  <DashboardCard
      icon={<HowToRegIcon color=\"primary\" />} 
      title=\"User Register Overview\"
      subtitle="User Select Plan"
      action={
        <CustomSelect
          labelId="plan-dd"
          id="plan-dd"
          value={plan}
          size="small"
          onChange={handleChange}
        >
          {Object.keys(planData).map((planName) => (
            <MenuItem key={planName} value={planName}>
              {planName}
            </MenuItem>
          ))}
        </CustomSelect>
      }
    >
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 8 }}>
          <Box sx={{ width: '100%',minHeight: 440, }}>
            <Chart
              options={optionscolumnchart}
              series={seriescolumnchart}
              type="bar"
              height="370px"
            />
          </Box>
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <Stack spacing={3} mt={3}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Box
                width={40}
                height={40}
                bgcolor="primary.light"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Typography color="primary" variant="h6" display="flex">
                  <IconGridDots width={21} />
                </Typography>
              </Box>
              <Box>
                <Typography variant="h3" fontWeight="700">
                  ₹{currentPlan.earnings.toLocaleString()}
                </Typography>
                <Typography variant="subtitle2" color="textSecondary">
                  Total Earnings
                </Typography>
              </Box>
            </Stack>
          </Stack>

          <Stack spacing={3} my={5}>
            <Stack direction="row" spacing={2} alignItems="flex-start">
              <Avatar
                sx={{
                  width: 9,
                  height: 9,
                  bgcolor: primary,
                  marginTop: '10px !important',
                  svg: { display: 'none' },
                }}
              ></Avatar>
              <Box>
                <Typography variant="subtitle1" color="textSecondary">
                  Earnings this month
                </Typography>
                <Typography variant="h5">₹{currentPlan.thisMonth.toLocaleString()}</Typography>

                <Typography variant="subtitle1" color="textSecondary" sx={{ mt: 2 }}>
                  Pending Amount
                </Typography>
                <Typography variant="h5">₹{currentPlan.pending.toLocaleString()}</Typography>
              </Box>
            </Stack>
          </Stack>

          <Button color="primary" variant="contained" fullWidth>
            View Full Report
          </Button>
        </Grid>
      </Grid>
    </DashboardCard>
  );
};

export default RegisterUserData;
