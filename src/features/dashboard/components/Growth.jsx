import React, { useState, useEffect, useMemo } from 'react';
import Chart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import { Box, Typography, Paper, LinearProgress, Divider } from '@mui/material';
import { EventAvailable } from '@mui/icons-material';
import planService from '../../../services/planService';

const Growth = ({ data = {} }) => {
  const theme = useTheme();
  const [planData, setPlanData] = useState(null);
  const [daysRemaining, setDaysRemaining] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlanData = async () => {
      try {
        const response = await planService.getCurrentPlan();
        if (response.success && response.data) {
          setPlanData(response.data);
          if (response.data.expiryDate) {
            const expiryDate = new Date(response.data.expiryDate);
            const currentDate = new Date();
            const timeDiff = expiryDate.getTime() - currentDate.getTime();
            const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
            setDaysRemaining(Math.max(0, daysDiff));
          } else {
            setDaysRemaining(0);
          }
        }
      } catch (error) {
        console.error('Error fetching plan data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlanData();
  }, []);

  const maxDays = planData?.totalDays || 30;
  const progressPercentage = maxDays > 0 ? Math.min(100, (daysRemaining / maxDays) * 100) : 0;
  const statusColor = daysRemaining > 7 ? 'success' : daysRemaining > 3 ? 'warning' : 'error';

  const optionscolumnchart = useMemo(() => ({
    chart: {
      type: 'radialBar',
      height: 60,
      fontFamily: 'inherit',
      foreColor: '#a1aab2',
      toolbar: { show: false },
      sparkline: { enabled: true },
    },
    colors: [theme.palette[statusColor].main],
    plotOptions: {
      radialBar: {
        hollow: { size: '55%' },
        dataLabels: { show: false },
        track: {
          background: theme.palette.grey[800],
          strokeWidth: '100%',
        },
      },
    },
    fill: { opacity: 1 },
    stroke: { lineCap: 'round' },
    tooltip: { enabled: false },
  }), [theme, statusColor]);

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
            bgcolor: `${statusColor}.light`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <EventAvailable sx={{ color: `${statusColor}.main`, fontSize: 18 }} />
        </Box>
        <Typography variant="caption" color={planData?.planName === 'Free' ? 'text.secondary' : 'primary.main'} fontWeight={500}>
          {planData?.planName || 'Free'}
        </Typography>
      </Box>

      <Box mb={1}>
        <Typography variant="h5" fontWeight={600} color="text.primary">
          {loading ? '...' : daysRemaining}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {daysRemaining === 0 && planData?.planName === 'Free' ? 'Free Plan' : 'Days Remaining'}
        </Typography>
      </Box>

      <LinearProgress 
        variant="determinate" 
        value={progressPercentage} 
        sx={{ 
          height: 4, 
          borderRadius: 2,
          bgcolor: 'grey.800',
          mb: 1,
          '& .MuiLinearProgress-bar': {
            borderRadius: 2,
            bgcolor: `${statusColor}.main`
          }
        }} 
      />

      <Divider sx={{ my: 1 }} />

      <Box flex={1} display="flex" alignItems="center" justifyContent="center" minHeight={50}>
        {!loading && (
          <Chart options={optionscolumnchart} series={[progressPercentage]} type="radialBar" height={60} width={60} />
        )}
      </Box>
    </Paper>
  );
};

export default Growth;
