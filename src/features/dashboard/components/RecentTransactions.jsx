import React from 'react';
import DashboardCard from '../../../components/common/DashboardCard';
import {
  Timeline,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
  TimelineDot,
  TimelineConnector,
  TimelineContent,
  timelineOppositeContentClasses,
} from '@mui/lab';
import { Typography, Box } from '@mui/material';

const RecentTransactions = ({ trades = [] }) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'success';
      case 'open':
        return 'primary';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'error';
      default:
        return 'secondary';
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <DashboardCard title="Recent Trades">
      <>
        {trades.length === 0 ? (
          <Box p={3} textAlign="center">
            <Typography variant="body2" color="textSecondary">
              No recent trades available
            </Typography>
          </Box>
        ) : (
          <Timeline
            className="theme-timeline"
            nonce={undefined}
            onResize={undefined}
            onResizeCapture={undefined}
            sx={{
              p: 0,
              mb: '-40px',
              [`& .${timelineOppositeContentClasses.root}`]: {
                flex: 0.5,
                paddingLeft: 0,
              },
            }}
          >
            {trades.map((trade, index) => {
              const isLast = index === trades.length - 1;
              const profitLoss = parseFloat(trade.profitLoss) || 0;
              const isProfit = profitLoss > 0;
              
              return (
                <TimelineItem key={trade.id}>
                  <TimelineOppositeContent>
                    {formatTime(trade.createdAt)}
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineDot color={getStatusColor(trade.status)} variant="outlined" />
                    {!isLast && <TimelineConnector />}
                  </TimelineSeparator>
                  <TimelineContent>
                    <Typography fontWeight="600">
                      {trade.symbol} - {trade.tradeType}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {trade.strategy?.name || 'Manual Trade'}
                    </Typography>
                    {trade.status === 'Completed' && (
                      <Typography 
                        variant="body2" 
                        color={isProfit ? 'success.main' : 'error.main'}
                        fontWeight="500"
                      >
                        {isProfit ? '+' : ''}${profitLoss.toFixed(2)}
                      </Typography>
                    )}
                  </TimelineContent>
                </TimelineItem>
              );
            })}
          </Timeline>
        )}
      </>
    </DashboardCard>
  );
};

export default RecentTransactions;
