import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Stack,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Link } from 'react-router';
import CustomTextField from '../../../components/forms/theme-elements/CustomTextField';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import LockIcon from '@mui/icons-material/Lock';

const AuthResetPassword = ({ title, subtitle, subtext }) => {
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    console.log('Resetting password to:', formData.newPassword);
  };

  return (
    <>
      {title && (
        <Typography fontWeight="700" variant="h3" mb={1}>
          {title}
        </Typography>
      )}

      {subtext && (
        <Typography variant="body2" color="textSecondary" mb={3}>
          {subtext}
        </Typography>
      )}

      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <CustomTextField
            id="newPassword"
            name="newPassword"
            placeholder="New Password"
            type={showPassword ? 'text' : 'password'}
            variant="outlined"
            fullWidth
            value={formData.newPassword}
            onChange={handleChange}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <CustomTextField
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Confirm Password"
            type={showPassword ? 'text' : 'password'}
            variant="outlined"
            fullWidth
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            startIcon={<LockIcon/>}
          >
            Reset Password
          </Button>

          <Button
            component={Link}
            to="/auth/admin-login"
            variant="outlined"
            fullWidth
            sx={{ fontWeight: 500 }}
          >
            Back to Login
          </Button>
        </Stack>
      </form>

      {subtitle}
    </>
  );
};

export default AuthResetPassword;
