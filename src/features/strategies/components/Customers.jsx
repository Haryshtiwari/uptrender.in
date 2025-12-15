import React, { useMemo } from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import { Stack, Typography, Avatar } from '@mui/material';
import { IconArrowUpRight } from '@tabler/icons-react';

import DashboardCard from '../../../components/common/DashboardCard';
import PropTypes from 'prop-types';

const Customers = ({ stats }) => {
  const theme = useTheme();

  const primary = theme.palette.primary.main;

  const successMain = theme.palette.success.main;
  const successLight = theme.palette.success.light;

  const computedStats = useMemo(() => {
    const total = stats?.total ?? 0;
    const running = stats?.running ?? 0;
    const active = stats?.active ?? 0;
    const change = total ? ((running / total) * 100).toFixed(1) : 0;
    return {
      total,
      running,
      active,
      change,
    };
  }, [stats]);

  const optionscolumnchart = {
    chart: {
      type: 'area',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      foreColor: theme.palette.text.secondary,
      toolbar: {
        show: false,
      },
      height: 80,
      sparkline: {
        enabled: true,
      },
      group: 'sparklines',
    },
    stroke: {
      curve: 'smooth',
      width: 2,
      colors: [primary], // stroke line color
    },
    fill: {
      type: 'solid',
      opacity: 0.2,
      colors: [primary], // area fill color
    },
    markers: {
      size: 0,
    },
    tooltip: {
      theme: theme.palette.mode,
      x: {
        show: false,
      },
    },
    xaxis: {
      type: 'category',
      labels: { show: false },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      show: false,
    },
    grid: {
      show: false,
    },
  };

  const seriescolumnchart = [
    {
      name: 'Strategies',
      data: stats
        ? [
            computedStats.total,
            Math.max(computedStats.total - computedStats.active, 0),
            computedStats.active,
            computedStats.running,
            Math.max(computedStats.running - computedStats.active, 0),
            computedStats.total,
          ]
        : [30, 25, 35, 20, 30, 40],
    },
  ];

  return (
    <DashboardCard
      sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 2 }}
      footer={
        <Chart
          options={optionscolumnchart}
          series={seriescolumnchart}
          type="area"
          height={105}
          width="100%"
        />
      }
    >
      <Typography variant="subtitle2" color="textSecondary">
        Total Strategies
      </Typography>
      <Typography variant="h4">{computedStats.total.toLocaleString()}</Typography>
      <Stack direction="row" spacing={1} mt={1} alignItems="center">
        <Avatar sx={{ bgcolor: successLight, width: 24, height: 24 }}>
          <IconArrowUpRight width={18} color={successMain} />
        </Avatar>
        <Typography variant="subtitle2" fontWeight={600}>
          +{computedStats.change}%
        </Typography>
        <Typography variant="subtitle2" color="textSecondary">
          running strategies
        </Typography>
      </Stack>
    </DashboardCard>
  );
};

export default Customers;

Customers.propTypes = {
  stats: PropTypes.shape({
    total: PropTypes.number,
    running: PropTypes.number,
    active: PropTypes.number,
  }),
};
