import React, { useState, useEffect } from 'react';
import { Grid, Card, Box, Typography, Avatar, CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  IconWorld,
  IconCheck,
  IconAlertCircle,
  IconCurrencyDollar,
  IconCurrencyBitcoin,
  IconFlag
} from '@tabler/icons-react';
import { apiKeyService } from '../../../services/apiKeyService';

const ApiCards = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    forex: 0,
    crypto: 0,
    indian: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const result = await apiKeyService.getApiKeys();
        if (result.success) {
          const apiKeys = result.data || [];
          
          // Calculate stats from real data
          const newStats = {
            total: apiKeys.length,
            active: apiKeys.filter(key => key.status === 'Active').length,
            inactive: apiKeys.filter(key => key.status === 'Inactive' || key.status === 'Pending').length,
            forex: apiKeys.filter(key => key.segment === 'Forex').length,
            crypto: apiKeys.filter(key => key.segment === 'Crypto').length,
            indian: apiKeys.filter(key => key.segment === 'Indian').length,
          };
          
          setStats(newStats);
        }
      } catch (error) {
        console.error('Error fetching API stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const apiCards = [
    { title: 'Total', count: stats.total, bgcolor: 'success', icon: IconWorld },
    { title: 'Active', count: stats.active, bgcolor: 'success', icon: IconCheck },
    { title: 'Inactive', count: stats.inactive, bgcolor: 'error', icon: IconAlertCircle },
    { title: 'Forex', count: stats.forex, bgcolor: 'info', icon: IconCurrencyDollar },
    { title: 'Crypto', count: stats.crypto, bgcolor: 'warning', icon: IconCurrencyBitcoin },
    { title: 'Indian', count: stats.indian, bgcolor: 'secondary', icon: IconFlag },
  ];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {apiCards.map((card, index) => {
        const iconColor = theme.palette[card.bgcolor]?.main || theme.palette.primary.main;
        const gradientBg = `linear-gradient(135deg, ${iconColor}22, ${iconColor}08)`;

        return (
         <Grid size={{ xs: 12, sm: 4, lg: 2 }} key={index}>
            <Card
              elevation={3}
              sx={{
                display: 'flex',
                alignItems: 'center',
                p: 2,
                borderRadius: 4,
                height: '100%',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                background: gradientBg,
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: `0 8px 20px ${iconColor}44`,
                },
              }}
            >
              <Avatar
                sx={{
                  bgcolor: iconColor,
                  color: theme.palette.common.white,
                  width: 48,
                  height: 48,
                  mr: 2,
                  boxShadow: `0 2px 6px ${iconColor}88`,
                }}
              >
                <card.icon size={24} />
              </Avatar>

              <Box>
                <Typography variant="body2" color="text.secondary" fontWeight={600}>
                  {card.title}
                </Typography>
                <Typography variant="h5" color="text.primary" fontWeight={700}>
                  {card.count}
                </Typography>
              </Box>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default ApiCards;
