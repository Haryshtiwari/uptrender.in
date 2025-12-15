import React from 'react';
import { Grid, Box, CircularProgress, Alert } from '@mui/material';

import PageContainer from '../../../components/common/PageContainer';
import Expence from '../components/Expence';
import Growth from '../components/Growth';
import SalesTwo from '../components/SalesTwo';
import Sales from '../components/Sales';
import ProductPerformances from '../components/ProductPerformances';
import DashboardTradeManagement from '../components/DashboardTradeManagement';
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
      <Grid container spacing={2}>
        {/* Stats Cards Row - Consistent sizing */}
        <Grid size={{ xs: 6, md: 3 }}>
          <Expence data={data} />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <Sales data={data} />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <SalesTwo data={data} />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <Growth data={data} />
        </Grid>
        
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
