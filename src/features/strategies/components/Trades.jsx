import React, { useMemo } from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import { Stack, Typography, Avatar, Box, Grid } from '@mui/material';
import { IconArrowUpLeft } from '@tabler/icons-react';
import DashboardCard from '../../../components/common/DashboardCard';
import PropTypes from 'prop-types';

const TotalROI = ({ stats }) => {
  const theme = useTheme();

  const primary = theme.palette.primary.main;
  const primaryLight = theme.palette.primary.light;
  const greyLight = theme.palette.grey[200];
  const successLight = theme.palette.success.light;

  const computedStats = useMemo(() => {
    const total = stats?.total ?? 0;
    const active = stats?.active ?? 0;
    const running = stats?.running ?? 0;
    const publicCount = stats?.public ?? 0;
    const roi = total ? ((running / total) * 100).toFixed(1) : 0;
    return {
      total,
      active,
      running,
      publicCount,
      roi,
    };
  }, [stats]);

  const optionsDonutChart = {
    chart: {
      type: 'donut',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      foreColor: theme.palette.text.secondary,
      toolbar: { show: false },
      height: 160,
    },
    colors: [primary, primaryLight, greyLight],
    labels: ['Running', 'Active', 'Other'],
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: '14px',
              fontWeight: 400,
              offsetY: -10,
            },
            value: {
              show: true,
              fontSize: '18px',
              fontWeight: 600,
              formatter: () => `${computedStats.roi}%`,
              offsetY: 10,
            },
            total: {
              show: true,
              label: 'Running Share',
              fontSize: '14px',
              fontWeight: 500,
              formatter: () => `${computedStats.roi}%`,
            },
          },
        },
      },
    },
    stroke: { show: false },
    dataLabels: { enabled: false },
    legend: { show: false },
    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: {
            height: 140,
          },
        },
      },
    ],
  };

  const seriesDonutChart = useMemo(() => {
    if (!stats) return [38, 40, 22];
    const others = Math.max(computedStats.total - computedStats.running - computedStats.active, 0);
    return [computedStats.running, computedStats.active, others];
  }, [stats, computedStats]);

  return (
    <DashboardCard title="Total ROI" sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
      <Grid container spacing={3}>
        <Grid item xs={7}>
          <Typography variant="h3" fontWeight={700}>
            {computedStats.roi}%
          </Typography>
          <Stack direction="row" spacing={1} mt={4} alignItems="center">
            <Avatar sx={{ bgcolor: successLight, width: 27, height: 27 }}>
              <IconArrowUpLeft width={20} color="#39B69A" />
            </Avatar>
            <Typography variant="subtitle2" fontWeight={600}>
              {computedStats.running.toLocaleString()} running
            </Typography>
            <Typography variant="subtitle2" color="textSecondary">
              of {computedStats.total.toLocaleString()} strategies
            </Typography>
          </Stack>

          <Stack spacing={3} mt={5} direction="row">
            <Stack direction="row" spacing={1} alignItems="center">
              <Avatar sx={{ width: 9, height: 9, bgcolor: primary, svg: { display: 'none' } }} />
              <Typography variant="subtitle2" color="textSecondary">
                2025
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <Avatar sx={{ width: 9, height: 9, bgcolor: primaryLight, svg: { display: 'none' } }} />
              <Typography variant="subtitle2" color="textSecondary">
                2024
              </Typography>
            </Stack>
          </Stack>
        </Grid>

        <Grid item xs={5}>
          <Box>
            <Chart
              options={optionsDonutChart}
              series={seriesDonutChart}
              type="donut"
              height={130}
            />
          </Box>
        </Grid>
      </Grid>
    </DashboardCard>
  );
};

export default TotalROI;

TotalROI.propTypes = {
  stats: PropTypes.shape({
    total: PropTypes.number,
    active: PropTypes.number,
    running: PropTypes.number,
    public: PropTypes.number,
  }),
};
