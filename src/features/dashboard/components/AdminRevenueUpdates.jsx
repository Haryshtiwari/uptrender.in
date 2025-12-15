import React from 'react';
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
} from '@mui/material';
import { IconGridDots } from '@tabler/icons-react';
import DashboardCard from '../../../components/common/DashboardCard';
import CustomSelect from './CustomSelect';
import HowToRegIcon from '@mui/icons-material/HowToReg';
const RevenueUpdates = () => {
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;

  const [plan, setPlan] = React.useState('Basic');
  const planData = {
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
    Enterprise: {
      registered: [18, 28, 26, 42, 20, 48, 25, 40, 43, 33, 30, 38],
      subscribed: [10, 20, 18, 30, 12, 35, 18, 33, 35, 25, 20, 30],
      earnings: 50489.75,
      thisMonth: 34820,
      pending: 15820,
    },
    Ultimate: {
      registered: [50, 70, 65, 90, 55, 95, 60, 88, 93, 76, 70, 85],
      subscribed: [40, 60, 55, 85, 48, 90, 53, 80, 86, 68, 60, 76],
      earnings: 143250.65,
      thisMonth: 98200,
      pending: 45230,
    },
  };

  const handleChange = (event) => {
    setPlan(event.target.value);
  };

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

  return (
  <DashboardCard
      icon={<HowToRegIcon color="primary" />} 
      title="User Register Overview"
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

export default RevenueUpdates;
