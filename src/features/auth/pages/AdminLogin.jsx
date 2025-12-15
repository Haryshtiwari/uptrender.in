import React from 'react';
import { Grid, Box, Card, Chip,  } from '@mui/material';

import PageContainer from '../../../components/common/PageContainer';
import Logo from '../../../components/layout/full/shared/logo/Logo';
import AuthLogin from '../components/AdminAuthLogin';

const AdminLogin = () => {

  return (
    (<PageContainer title="Login" description="this is Login page">
      <Box
        sx={{
          position: 'relative',
          '&:before': {
            content: '""',
            background: 'radial-gradient(#d2f1df, #d3d7fa, #bad8f4)',
            backgroundSize: '400% 400%',
            animation: 'gradient 15s ease infinite',
            position: 'absolute',
            height: '100%',
            width: '100%',
            opacity: '0.3',
          },
        }}
      >
        <Grid container spacing={0} justifyContent="center" sx={{ height: '100vh' }}>
          <Grid
            display="flex"
            justifyContent="center"
            alignItems="center"
            size={{
              xs: 12,
              sm: 12,
              lg: 5,
              xl: 4
            }}>
            <Card elevation={9} sx={{ p: 4, m: 3, zIndex: 1, width: '100%', maxWidth: '450px' }}>
              <Box display="flex" alignItems="center" justifyContent="center">
                <Logo />
              </Box>
                 <Box display="flex" justifyContent="center" mb={2}>
                <Chip
                  label="Admin Login"
                  color="primary"
                  variant="filled"
                  sx={{ fontWeight: 'bold', fontSize: '14px' }}
                />
              </Box>
              <AuthLogin
              />
            </Card>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>)
  );
};

export default AdminLogin;
