import React from 'react';
import { Box } from '@mui/material';
import Breadcrumb from '../../../components/layout/full/shared/breadcrumb/Breadcrumb';
import AdminApiKeysTable from '../components/AdminApiKeysTable';

const AdminApi = () => {
  return (
    <Box>
      <Breadcrumb title="API Keys Management" />
      <AdminApiKeysTable />
    </Box>
  );
};

export default AdminApi;