import React from 'react';
import { Grid, Card, Box, Typography, Avatar } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  IconCheck,
  IconAlertCircle,
  IconStar,
  IconChartLine,
  IconEye,
  IconTrendingUp,
} from '@tabler/icons-react';

const strategyCards = [
  { title: 'Total ', count: 50, bgcolor: 'success', icon: IconChartLine },
  { title: 'Active ', count: 35, bgcolor: 'success', icon: IconCheck },
  { title: 'Inactive ', count: 15, bgcolor: 'error', icon: IconAlertCircle },
  { title: 'Most Used', count: 14, bgcolor: 'info', icon: IconTrendingUp },
  { title: 'Public', count: 45, bgcolor: 'warning', icon: IconStar },
  { title: 'Private', count: 33, bgcolor: 'success', icon: IconEye },

];

const WeeklyStats = () => {
  const theme = useTheme();

  return (
    <Grid container spacing={3}>
      {strategyCards.map((card, index) => (
          <Grid size={{ xs: 12, sm: 4, lg: 2  }} key={index}>
          <Card
            elevation={3}
            sx={{
              display: 'flex',
              alignItems: 'center',
              p: 2,
              borderRadius: 3,
              height: '100%',
            }}
          >
            <Avatar
              sx={{
                bgcolor: theme.palette[card.bgcolor].light,
                color: theme.palette[card.bgcolor].main,
                width: 56,
                height: 56,
                mr: 2,
              }}
            >
              <card.icon size={28} />
            </Avatar>
            <Box>
              <Typography
                variant="body2"
                color="textSecondary"
                sx={{ fontWeight: 500 }}
              >
                {card.title}
              </Typography>
              <Typography
                variant="h4"
                color={theme.palette[card.bgcolor].main}
                sx={{ fontWeight: 700 }}
              >
                {card.count}
              </Typography>
            </Box>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default WeeklyStats;
