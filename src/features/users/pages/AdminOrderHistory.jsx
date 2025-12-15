import React from 'react';
import { Box } from '@mui/material';
import Breadcrumb from '../../../components/layout/full/shared/breadcrumb/Breadcrumb';
import AdminTradesTable from '../../trade/components/AdminTradesTable';

const AdminOrderHistory = () => {
  return (
    <Box>
      <Breadcrumb title="Trade Management" />
      <AdminTradesTable />
    </Box>
  );
};

export default AdminOrderHistory;
