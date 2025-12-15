
import React from 'react';
import PageContainer from '../../../components/common/PageContainer';
import AuthResetPassword from '../components/AuthResetPassword';
import Logo from '../../../components/layout/full/shared/logo/Logo';
import { Box } from '@mui/material';

const ResetPasswordPage = () => {
  return (
    <PageContainer title="Reset Password" description="Create your new password">
      <Box
        display="flex"
             background= 'radial-gradient(#d2f1df, #d3d7fa, #bad8f4)'
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        p={2}
        bgcolor="#f8f9fa"
      >
        <Box
          width={400}
          bgcolor="#fff"
          p={4}
          
          boxShadow={3}
          textAlign="center"
        >
                <Box px={3}>
            <Logo />
          </Box>
          <AuthResetPassword
    
            subtext="Enter a new password to secure your account."
          />
        </Box>
      </Box>
    </PageContainer>
  );
};

export default ResetPasswordPage;
