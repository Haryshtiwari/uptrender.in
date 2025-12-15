import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Stack,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

import iconUser from '../../../assets/images/svgs/icons8-strategy-64.png';
import iconActive from '../../../assets/images/svgs/icons8-strategy-50.png';
import iconInactive from '../../../assets/images/svgs/icons8-strategy-30.png';
import iconMost from '../../../assets/images/svgs/icons8-used-product-48.png';
import iconLess from '../../../assets/images/svgs/icons8-less-than-40.png';
import iconGrowth from '../../../assets/images/svgs/icons8-growth-48.png';
import iconPlan from '../../../assets/images/svgs/icons8-admin-40.png';
import iconPublic  from '../../../assets/images/svgs/icons8-public-48.png';
import iconPrivate  from '../../../assets/images/svgs/icons8-private-40.png';
import DashboardCard from '../../../components/common/DashboardCard';

const StrategyCards = () => {
  const theme = useTheme();

  const groupedCards = [
    {
      title: 'Strategies',
      stats: [
        { icon: iconUser, label: 'Total', value: '100', color: 'info' },
        { icon: iconActive, label: 'Active', value: '100', color: 'success' },
        { icon: iconInactive, label: 'Inactive', value: '0', color: 'error' },
      ],
    },
    {
      title: 'Performance Wise ',
      stats: [
  { icon: iconMost, label: 'Most ', value: '20', color: 'info' },
  { icon: iconLess, label: 'Least ', value: '80', color: 'warning' },
  { icon: iconGrowth, label: 'Growth', value: '+38%', color: 'success' },
]
    },
    {
      title: 'Created By',
      stats: [
  { icon: iconPublic, label: 'Public', value: '70', color: 'success' },
  { icon: iconPrivate, label: 'Private', value: '40', color: 'secondary' },
  { icon: iconPlan, label: 'Admin Created', value: '30', color: 'primary' },
   
]

    },
  ];

  return (
    <Grid container spacing={2}>
      {groupedCards.map((group, idx) => (
        <Grid  size={{ xs: 12, sm: 4, lg: 4 }} key={idx}>
          <DashboardCard>
            <Typography variant="h5" fontWeight={700} mb={2}>
              {group.title}
            </Typography>
            <Grid container spacing={6}>
              {group.stats.map((stat, i) => (
                <Grid size={{xs:12,sm:6}} key={i}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                      sx={{
                        borderRadius: 2,
                        width: 28,
                        height: 32,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <img src={stat.icon} alt={stat.label} width="24" />
                    </Box>
                    <Box>
                      <Typography
                        variant="subtitle1"
                        fontWeight={800}
                        color={theme.palette[stat.color].main}
                      >
                        {stat.label}
                      </Typography>
                      <Typography
                        variant="h6"
                        fontWeight={700}
                        color={theme.palette[stat.color].main}
                      >
                        {stat.value}
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
              ))}
            </Grid>
          </DashboardCard>
        </Grid>
      ))}
    </Grid>
  );
};

export default StrategyCards;
