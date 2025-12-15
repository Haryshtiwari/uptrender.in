import React, { useMemo } from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import { Typography, Box, Paper, Stack, Divider } from '@mui/material';
import { TrendingDown } from '@mui/icons-material';

const Expence = ({ data = {} }) => {
  const theme = useTheme();

  // Calculate unrealized PnL from pending trades
  const unrealizedPnL = useMemo(() => {
    const pendingPL = data?.tradeStats?.pending?.totalPL || 0;
    return parseFloat(pendingPL) || 0;
  }, [data]);

  const isNegative = unrealizedPnL < 0;
  const displayValue = Math.abs(unrealizedPnL);
  const percentChange = data?.tradeStats?.pending?.count > 0 ? -2.3 : 0;

  // Dynamic chart data based on trade breakdown
  const chartData = useMemo(() => {
    const pending = Math.abs(data?.tradeStats?.pending?.totalPL || 0);
    const fees = pending * 0.1;
    const other = pending * 0.05;
    return [pending || 40, fees || 20, other || 10];
  }, [data]);

  const optionsexpencechart = {
    chart: {
      type: 'donut',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      toolbar: { show: false },
      height: 70,
      sparkline: { enabled: true },
    },
    labels: ["Unrealized", "Fees", "Other"],
    colors: [theme.palette.error.main, theme.palette.error.light, theme.palette.grey[500]],
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
          background: 'transparent'
        },
      },
    },
    dataLabels: { enabled: false },
    stroke: { show: false },
    legend: { show: false },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
      fillSeriesColor: false,
    },
  };

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
            bgcolor: 'error.light',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <TrendingDown sx={{ color: 'error.main', fontSize: 18 }} />
        </Box>
        <Typography variant="caption" color={isNegative ? 'error.main' : 'text.secondary'} fontWeight={500}>
          {percentChange}%
        </Typography>
      </Box>

      <Box mb={1}>
        <Typography variant="h5" fontWeight={600} color="text.primary">
          ${displayValue.toFixed(2)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Unrealized PnL
        </Typography>
      </Box>

      <Divider sx={{ my: 1 }} />

      <Box flex={1} display="flex" alignItems="center" justifyContent="center" minHeight={60}>
        <Chart
          options={optionsexpencechart}
          series={chartData}
          type="donut"
          height={70}
          width={70}
        />
      </Box>
    </Paper>
  );
};

export default Expence;
