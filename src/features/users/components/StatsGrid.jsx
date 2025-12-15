import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  Typography,
  LinearProgress,
  Chip,
  Avatar,
  useTheme,
  CircularProgress,
} from '@mui/material';
import { Users, Zap, TrendingUp } from 'lucide-react';
import adminUserService from '../../../services/adminUserService';
import { adminStrategyService } from '../../../services/adminStrategyService';
import adminApiKeyService from '../../../services/adminApiKeyService';

const initialUsageData = [
  {
    title: 'User Accounts',
    icon: Users,
    current: 0,
    limit: 1000,
    percentage: 0,
    trend: '+0%',
    status: 'good',
    gradientFrom: '#3B82F6',
    gradientTo: '#8B5CF6',
  },
  {
    title: 'API Integrations',
    icon: Zap,
    current: 0,
    limit: 200,
    percentage: 0,
    trend: '+0%',
    status: 'good',
    gradientFrom: '#10B981',
    gradientTo: '#14B8A6',
  },
  {
    title: 'Trading Strategies',
    icon: TrendingUp,
    current: 0,
    limit: 300,
    percentage: 0,
    trend: '+0%',
    status: 'good',
    gradientFrom: '#F97316',
    gradientTo: '#EF4444',
  },
];



const getChipColor = (status) => {
  switch (status) {
    case 'good':
      return 'success';
    case 'warning':
      return 'warning';
    case 'danger':
      return 'error';
    default:
      return 'default';
  }
};

const UsageCard = ({
  title,
  icon: IconComponent,
  current,
  limit,
  percentage,
  trend,
  status,
  gradientFrom,
  gradientTo,
}) => {
  const theme = useTheme();

  return (
    <Card
      elevation={3}
      sx={{
        p: 3,
        borderRadius: 3,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
      }}
    >
      <Box display="flex" alignItems="center" gap={2}>
        <Avatar
          sx={{
            background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
            width: 48,
            height: 48,
          }}
        >
          <IconComponent color="white" size={20} />
        </Avatar>
        <Box>
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
          <Typography variant="h5" fontWeight={700}>
            {current}{' '}
            <Typography component="span" variant="body2" color="text.secondary">
              of {limit} limit
            </Typography>
          </Typography>
        </Box>
      </Box>

      <Box mt={3}>
        <LinearProgress
          variant="determinate"
          value={percentage}
          sx={{
            height: 8,
            borderRadius: 4,
            bgcolor: 'seconadary.main',
            '& .MuiLinearProgress-bar': {
              background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
            },
          }}
        />
        <Box mt={1} display="flex" justifyContent="space-between" alignItems="center">
          <Chip
            label={`${percentage}% used`}
            size="small"
            sx={{ bgcolor: `${gradientFrom}33`, color: theme.palette.text.primary }}
          />
          <Typography variant="caption" color={getChipColor(status) + '.main'}>
            {trend}
          </Typography>
        </Box>
      </Box>
    </Card>
  );
};

export default function StatsGrid() {
  const [loading, setLoading] = useState(true);
  const [usageData, setUsageData] = useState(initialUsageData);

  useEffect(() => {
    const fetchUsageData = async () => {
      try {
        const [userResult, strategyResult, apiKeyResult] = await Promise.all([
          adminUserService.getUserStats(),
          adminStrategyService.getStrategyStats(),
          adminApiKeyService.getApiKeyStats(),
        ]);

        const newUsageData = [...initialUsageData];

        if (userResult.success) {
          const totalUsers = userResult.data.total || userResult.data.totalUsers || 0;
          const userLimit = 1000;
          const userPercentage = (totalUsers / userLimit) * 100;
          newUsageData[0] = {
            ...newUsageData[0],
            current: totalUsers,
            limit: userLimit,
            percentage: Math.min(userPercentage, 100),
            status: userPercentage > 85 ? 'warning' : userPercentage > 95 ? 'danger' : 'good',
          };
        }

        if (apiKeyResult.success) {
          const overview = apiKeyResult.data?.data?.overview || apiKeyResult.data?.overview || {};
          const totalApiKeys = Number(overview.total) || 0;
          const apiLimit = 200;
          const apiPercentage = (totalApiKeys / apiLimit) * 100;
          newUsageData[1] = {
            ...newUsageData[1],
            current: totalApiKeys,
            limit: apiLimit,
            percentage: Math.min(apiPercentage, 100),
            status: apiPercentage > 85 ? 'warning' : apiPercentage > 95 ? 'danger' : 'good',
          };
        }

        if (strategyResult.success) {
          const totalStrategies = strategyResult.data.total || strategyResult.data?.data?.total || 0;
          const strategyLimit = 300;
          const strategyPercentage = (totalStrategies / strategyLimit) * 100;
          newUsageData[2] = {
            ...newUsageData[2],
            current: totalStrategies,
            limit: strategyLimit,
            percentage: Math.min(strategyPercentage, 100),
            status: strategyPercentage > 85 ? 'warning' : strategyPercentage > 95 ? 'danger' : 'good',
          };
        }

        setUsageData(newUsageData);
      } catch (error) {
        console.error('Error fetching usage data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsageData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box mt={2}>
      <Grid container spacing={3}>
        {usageData.map((data, index) => (
          <Grid size={{
            xs:12,md:4,lg:4
          }} key={index}>
            <UsageCard {...data} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
