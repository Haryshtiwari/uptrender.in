import React from 'react';
import { Box, Card, Typography, Grid, Avatar } from '@mui/material';
import { Assignment, Warning, Schedule, CheckCircle } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

const TicketStatsCards = ({ stats }) => {
  const theme = useTheme();

  const cards = [
    {
      title: 'Total Tickets',
      count: stats.total,
      icon: Assignment,
      color: 'primary',
    },
    {
      title: 'Open Tickets',
      count: stats.open,
      icon: Warning,
      color: 'error',
    },
    {
      title: 'In Progress',
      count: stats.inProgress,
      icon: Schedule,
      color: 'warning',
    },
    {
      title: 'Resolved',
      count: stats.resolved,
      icon: CheckCircle,
      color: 'success',
    },
  ];

  return (
    <Grid container spacing={2} sx={{ mb: 4 }}>
      {cards.map((card, index) => {
        const iconColor = theme.palette[card.color]?.main || theme.palette.primary.main;
        const gradientBg = `linear-gradient(135deg, ${iconColor}33, ${iconColor}22)`;

        return (
          <Grid item xs={12} sm={6} md={3} lg={3} key={index}>
            <Card
              elevation={3}
              sx={{
                display: 'flex',
                alignItems: 'center',
                p: 2,
                borderRadius: 4,
                background: gradientBg,
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
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
                <card.icon fontSize="small" />
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

export default TicketStatsCards;
