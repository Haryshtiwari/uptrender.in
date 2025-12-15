import React from 'react';
import { Grid, Card, Box, Typography, Avatar } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  IconWorld,
  IconCheck,
  IconAlertCircle,
  IconCurrencyDollar,
  IconCurrencyBitcoin,
  IconFlag
} from '@tabler/icons-react';

const apiCards = [
  { title: 'Total', count: 30, bgcolor: 'success', icon: IconWorld },
  { title: 'Active', count: 22, bgcolor: 'success', icon: IconCheck },
  { title: 'Inactive', count: 8, bgcolor: 'error', icon: IconAlertCircle },
  { title: 'Forex', count: 10, bgcolor: 'info', icon: IconCurrencyDollar },
  { title: 'Crypto', count: 8, bgcolor: 'warning', icon: IconCurrencyBitcoin },
  { title: 'Indian', count: 12, bgcolor: 'secondary', icon: IconFlag },
];

const ApiCards = () => {
  const theme = useTheme();

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
