import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import PersonIcon from '@mui/icons-material/Person';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import iconUser from '../../../assets/images/svgs/icon-user-male.svg';
import iconActive from '../../../assets/images/svgs/icon-connect.svg';
import iconInactive from '../../../assets/images/svgs/icon-mailbox.svg';
import iconVerified from '../../../assets/images/svgs/icon-favorites.svg';
import iconUnverified from '../../../assets/images/svgs/icon-speech-bubble.svg';
import iconPlan from '../../../assets/images/svgs/icon-briefcase.svg';
import iconPending from '../../../assets/images/svgs/icon-dd-lifebuoy.svg';
import DashboardCard from '../../../components/common/DashboardCard';
import dashboardService from '../../../services/dashboardService';
import { useAuth } from '../../../app/authContext';

const TopCards = () => {
  const theme = useTheme();
  const { isAuthenticated, role, isLoading: authLoading } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    console.log('[TopCards] useEffect triggered:', { authLoading, isAuthenticated, role, loading });
    
    // Wait for auth to be ready and verified
    if (authLoading) {
      console.log('[TopCards] Auth still loading, waiting...');
      return;
    }
    
    // Prevent concurrent requests
    if (loading) {
      console.log('[TopCards] Already loading, skipping...');
      return;
    }
    
    // Check both authentication AND role is loaded
    if (!isAuthenticated || !role) {
      console.log('[TopCards] Not authenticated or no role:', { isAuthenticated, role });
      setLoading(false);
      return;
    }
    
    // Verify admin role
    if (role !== 'admin') {
      console.log('[TopCards] Role is not admin:', role);
      setError('Not authenticated as admin');
      setLoading(false);
      return;
    }

    console.log('[TopCards] All checks passed, fetching data...');
    let cancelled = false;

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError('');
        const result = await dashboardService.getAdminDashboard();
        if (!cancelled) {
          if (result.success) {
            setStats(result.data);
            setError('');
          } else {
            const errorMsg = result.error || 'Failed to fetch dashboard data';
            setError(errorMsg);
            console.error('Dashboard fetch error:', errorMsg);
          }
        }
      } catch (err) {
        if (!cancelled) {
          const errorMsg = err.message || 'An error occurred while fetching data';
          setError(errorMsg);
          console.error('Dashboard fetch error:', err);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchDashboardData();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, role, authLoading, loading]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
        {error.includes('Access denied') && (
          <Typography variant="caption" display="block" sx={{ mt: 1 }}>
            Please ensure you are logged in with an admin account.
          </Typography>
        )}
      </Alert>
    );
  }

  const groupedCards = [
    {
      title: 'User',
      icon: <PersonIcon color="info" />,
      stats: [
        { icon: iconUser, label: 'Total', value: stats?.users?.total?.toLocaleString() || '0', color: 'info' },
        { icon: iconActive, label: 'Active Users', value: stats?.users?.active?.toLocaleString() || '0', color: 'success' },
        { icon: iconInactive, label: 'Inactive Users', value: ((stats?.users?.total || 0) - (stats?.users?.active || 0)).toLocaleString(), color: 'error' },
      ],
    },
    {
      title: 'Verification',
      icon: <VerifiedUserIcon color="primary" />,
      stats: [
        { icon: iconVerified, label: 'Verified Users' , value: stats?.users?.verified?.toLocaleString() || '0', color: 'info' },
        { icon: iconUnverified, label: 'Unverified', value: ((stats?.users?.total || 0) - (stats?.users?.verified || 0)).toLocaleString(), color: 'warning' },
        { icon: iconPending, label: 'New (7 days)', value: '0', color: 'secondary' },
      ],
    },
    {
      title: 'Plan',
      icon: <WorkspacePremiumIcon color="success" />,
      stats: [
        { icon: iconPlan, label: 'Subscribers', value: stats?.plans?.active?.toLocaleString() || '0', color: 'success' },
        { icon: iconPending, label: 'Revenue/Mo', value: `₹${parseFloat(stats?.plans?.estimatedMonthlyRevenue || 0).toFixed(0)}`, color: 'secondary' },
        { icon: iconPlan, label: 'Free Users', value: ((stats?.users?.total || 0) - (stats?.plans?.active || 0)).toLocaleString(), color: 'secondary' },
      ],
    },
  ];

  return (
    <Grid container spacing={3}>
  {groupedCards.map((group, idx) => (
    <Grid size={{xs:12,sm:4,lg:4}} key={idx}>
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <DashboardCard sx={{ flex: 1 }}>
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            {group.icon}
            <Typography variant="h6" fontWeight={800}>
              {group.title}
            </Typography>
          </Box>

          <Grid container spacing={2}>
            {group.stats.map((stat, i) => (
              <Grid
                key={i}
                sx={{ display: 'flex' }}
              >
              
                <Paper
                  elevation={1}
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    flex: 1, 
                  }}
                >
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      backgroundColor: `${theme.palette[stat.color].light}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <img src={stat.icon} alt={stat.label} width="20" />
                  </Box>
                  <Box>
                    <Typography
                      variant="body2"
                      color="text.primary"
                      fontWeight={600}
                    >
                      {stat.label}
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      fontWeight={700}
                      color={theme.palette[stat.color].main}
                    >
                      {stat.value}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </DashboardCard>
      </Box>
    </Grid>
  ))}
</Grid>

  );
};

export default TopCards;


