import React from 'react';
import { Button, Stack } from '@mui/material';
import { Link } from 'react-router';

import CustomTextField from '../../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../../components/forms/theme-elements/CustomFormLabel';

const AuthForgotPassword = () => (
  <>
    <Stack mt={4} spacing={2}>
      <CustomFormLabel htmlFor="reset-email">Email Adddress</CustomFormLabel>
      <CustomTextField id="reset-email" variant="outlined" fullWidth />

      <Button color="primary" variant="contained" size="large" fullWidth component={Link} to="/auth/reset-password">
        Forgot Password
      </Button>
      <Button color="primary" size="large" fullWidth component={Link} to="/auth/admin-login">
        Back to Login
      </Button>
    </Stack>
  </>
);

export default AuthForgotPassword;