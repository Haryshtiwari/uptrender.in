import React from 'react';
import { Grid, Box, CircularProgress, Alert } from '@mui/material';

import PageContainer from '../../../components/common/PageContainer';
import ProductPerformances from '../components/ProductPerformances';
import DashboardTradeManagement from '../components/DashboardTradeManagement';
import TopStatsBar from '../../trade/components/TopStatsBar';
import Breadcrumb from '../../../components/layout/full/shared/breadcrumb/Breadcrumb';
import { useDashboard } from '../../../hooks/useDashboard';
import Loader from '../../../components/common/Loader';

const BCrumb = [
  { to: '/dashboard/user', title: 'User' },
  { title: 'Dashboard' },
];

const DashbaordUser = () => {
  const { data, loading, error, refresh } = useDashboard('user');

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <PageContainer title="User Dashboard" description="this is User Dashboard page">
        <Breadcrumb title="Dashboard" items={BCrumb} />
        <Box mt={3}>
          <Alert severity="error" onClose={refresh}>
            {error}
          </Alert>
        </Box>
      </PageContainer>
    );
  }
  return (
    <PageContainer title="User Dashboard" description="this is User Dashboard page">
       <Breadcrumb title="Dashboard "  items={BCrumb}  />
      {/* Trade Statistics Cards - Same as Trade Panel */}
      <TopStatsBar stats={{
        totalPnl: (data?.tradeStats?.completed?.totalPL || 0) + (data?.tradeStats?.pending?.totalPL || 0),
        pendingCount: data?.tradeStats?.pending?.count || 0,
        completedCount: data?.tradeStats?.completed?.count || 0,
      }} />

      <Grid container spacing={2}>
        
        {/* Main Content Row */}
        <Grid size={{ xs: 12 }}>
          <DashboardTradeManagement />
        </Grid>
        
        <Grid size={{ xs: 12 }}>
          <ProductPerformances />
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default DashbaordUser;
