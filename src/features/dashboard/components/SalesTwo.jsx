import React, { useMemo } from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import { Box, Typography, Paper, Chip, Divider } from '@mui/material';
import { ShowChart } from '@mui/icons-material';

const SalesTwo = ({ data = {} }) => {
  const theme = useTheme();

  const strategiesCount = data?.counts?.strategies || 0;
  const activeCount = data?.counts?.activeStrategies || 0;
  const subscribedCount = data?.counts?.subscribedStrategies || activeCount;

  // Dynamic chart data based on strategy activity
  const chartData = useMemo(() => {
    if (strategiesCount === 0) return [2, 3, 1, 4, 2, 3];
    const base = Math.max(strategiesCount, 1);
    return [
      Math.ceil(base * 0.6),
      Math.ceil(base * 0.8),
      Math.ceil(base * 0.4),
      Math.ceil(base * 1.0),
      Math.ceil(base * 0.5),
      Math.ceil(base * 0.7)
    ];
  }, [strategiesCount]);

  const optionscolumnchart = {
    chart: {
      type: 'bar',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#adb0bb',
      toolbar: { show: false },
      sparkline: { enabled: true },
    },
    colors: [
      theme.palette.primary.main,
      theme.palette.primary.light,
      theme.palette.primary.main,
      theme.palette.primary.light,
      theme.palette.primary.main,
      theme.palette.primary.light,
    ],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '60%',
        borderRadius: 3,
        distributed: true,
      }
    },
    dataLabels: { enabled: false },
    stroke: { show: false },
    grid: { show: false },
    xaxis: {
      labels: { show: false },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: { labels: { show: false } },
    legend: { show: false },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
      x: { show: false },
    },
  };
  
  const seriescolumnchart = [{ name: 'Activity', data: chartData }];

  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: 2,
        height: 200,
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
        <Box 
          sx={{
            width: 36,
            height: 36,
            borderRadius: 1,
            bgcolor: 'primary.light',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <ShowChart sx={{ color: 'primary.main', fontSize: 18 }} />
        </Box>
        <Typography variant="caption" color="success.main" fontWeight={500}>
          +{activeCount > 0 ? Math.round((activeCount / Math.max(strategiesCount, 1)) * 100) : 0}%
        </Typography>
      </Box>

      <Box mb={1}>
        <Typography variant="h5" fontWeight={600} color="text.primary">
          {subscribedCount}/{strategiesCount}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Subscribed Strategies
        </Typography>
      </Box>

      <Box display="flex" justifyContent="flex-end" mb={0.5}>
        <Chip 
          label="Active" 
          size="small" 
          color="success"
          variant="outlined"
          sx={{ fontSize: '0.65rem', height: 20 }}
        />
      </Box>

      <Divider sx={{ my: 1 }} />

      <Box flex={1} display="flex" alignItems="flex-end" minHeight={40}>
        <Chart options={optionscolumnchart} series={seriescolumnchart} type="bar" height={40} width="100%" />
      </Box>
    </Paper>
  );
};

export default SalesTwo;
