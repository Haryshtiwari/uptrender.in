import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import { Stack, Typography, Avatar, Box, Grid, Chip } from '@mui/material';

import { IconArrowUpRight } from '@tabler/icons-react';
import DashboardCard from '../../../components/common/DashboardCard';

const ProfitLossCard = ({ stats }) => {
   // chart color
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const primarylight = theme.palette.primary.light;
  const successlight = theme.palette.success.light;

  const computedStats = useMemo(() => {
    const total = stats?.total ?? 0;
    const active = stats?.active ?? 0;
    const running = stats?.running ?? 0;
    const publicCount = stats?.public ?? 0;
    const inactive = Math.max(total - active, 0);
    const activePercent = total ? Math.round((active / total) * 100) : 0;
    return {
      total,
      active,
      running,
      publicCount,
      inactive,
      activePercent,
    };
  }, [stats]);

  // chart
  const optionscolumnchart = {
    chart: {
      type: 'donut',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#adb0bb',
      toolbar: {
        show: false,
      },
      height: 150,
    },
    colors: [primary, primarylight, '#F9F9FD'],
    plotOptions: {
      pie: {
        startAngle: 0,
        endAngle: 360,
        donut: {
          size: '75%',
          background: 'transparent',
        },
      },
    },
    tooltip: {
      enabled: false,
    },
    stroke: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    responsive: [
      {
        breakpoint: 991,
        options: {
          chart: {
            width: 120,
          },
        },
      },
    ],
  };
  const seriescolumnchart = useMemo(() => {
    if (!stats) {
      return [38, 40, 25];
    }
    const { active, running, inactive } = computedStats;
    const fallback = active + running + inactive === 0 ? [1, 0.5, 0.5] : [active, running, inactive];
    return fallback;
  }, [stats, computedStats]);

  return (
    <DashboardCard title="Strategies Snapshot" sx={{ mt: 2, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
      <Grid container spacing={1}>
        {/* column */}
        <Grid size={6}>
          <Typography variant="h3" fontWeight="700">
            {computedStats.total.toLocaleString()}
          </Typography>
          <Stack direction="row" spacing={1} mt={1} alignItems="center">
            <Avatar sx={{ bgcolor: successlight, width: 27, height: 27 }}>
              <IconArrowUpRight width={20} color="#39B69A" />
            </Avatar>
            <Typography variant="subtitle2" fontWeight="600">
              {computedStats.activePercent}% active
            </Typography>
            <Typography variant="subtitle2" color="textSecondary">
              of total strategies
            </Typography>
          </Stack>
          <Stack spacing={1.5} mt={4}>
            <Chip label={`Active: ${computedStats.active}`} color="success" size="small" />
            <Chip label={`Running: ${computedStats.running}`} color="info" size="small" />
            <Chip label={`Public: ${computedStats.publicCount}`} size="small" />
          </Stack>
        </Grid>
        {/* column */}
        <Grid size={5}>
          <Box>
            <Chart
              options={optionscolumnchart}
              series={seriescolumnchart}
              type="donut"
              height="120px"
            />
          </Box>
        </Grid>
      </Grid>
    </DashboardCard>
  );
};

export default ProfitLossCard;

ProfitLossCard.propTypes = {
  stats: PropTypes.shape({
    total: PropTypes.number,
    active: PropTypes.number,
    running: PropTypes.number,
    public: PropTypes.number,
  }),
};

ProfitLossCard.defaultProps = {
  stats: null,
};
