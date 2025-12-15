import React, { useState } from 'react';
import { Box, Typography, Button, Divider, Alert } from '@mui/material';
import { Link, useNavigate } from 'react-router';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import CustomTextField from '../../../components/forms/theme-elements/CustomTextField';
import CustomFormLabel from '../../../components/forms/theme-elements/CustomFormLabel';
import { Stack } from '@mui/system';
import { useAuth } from '../../../app/authContext';
import { useToast } from '../../../hooks/useToast';
import AuthSocialButtons from './AuthSocialButtons';

const AuthRegister = ({ title, subtitle, subtext }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await register(formData);
      if (result.success) {
        showSuccess('Registration successful! Welcome aboard!');
        
        // Decode token to get user role
        const token = localStorage.getItem('authToken');
        if (token) {
          try {
            // Extract role from token payload
            const payload = JSON.parse(atob(token.split('.')[1]));
            const userRole = payload.role;
            
            // Redirect based on role
            if (userRole === 'admin') {
              navigate('/admin/dashboard');
            } else {
              navigate('/user/dashboard');
            }
          } catch (decodeError) {
            console.error('Token decode error:', decodeError);
            // Fallback to user dashboard (new registrations are typically users)
            navigate('/user/dashboard');
          }
        } else {
          // Fallback to user dashboard
          navigate('/user/dashboard');
        }
      } else {
        const errorMsg = result.error || 'Registration failed';
        setError(errorMsg);
        showError(errorMsg);
      }
    } catch (err) {
      console.error('Registration error:', err);
      const errorMsg = 'An unexpected error occurred';
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {title && (
        <Typography fontWeight="700" variant="h3" mb={1}>
          {title}
        </Typography>
      )}

      {subtext}
      <AuthSocialButtons title="Sign up with" />

      <Box mt={1}>
        <Divider>
          <Typography
            component="span"
            color="textSecondary"
            variant="h6"
            fontWeight="400"
            position="relative"
            px={2}
          >
            or sign up with
          </Typography>
        </Divider>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <Stack mb={1}>
          <CustomFormLabel htmlFor="name">Name</CustomFormLabel>
          <CustomTextField
            id="name"
            name="name"
            variant="outlined"
            fullWidth
            value={formData.name}
            onChange={handleChange}
            required
          />
          <CustomFormLabel htmlFor="username">Username</CustomFormLabel>
          <CustomTextField
            id="username"
            name="username"
            variant="outlined"
            fullWidth
            value={formData.username}
            onChange={handleChange}
            required
            helperText="3-50 characters. Letters, numbers, dots, underscore and hyphen allowed"
          />
          <CustomFormLabel htmlFor="email">Email Address</CustomFormLabel>
          <CustomTextField
            id="email"
            name="email"
            type="email"
            variant="outlined"
            fullWidth
            value={formData.email}
            onChange={handleChange}
            required
          />
          <CustomFormLabel htmlFor="password">Password</CustomFormLabel>
          <CustomTextField
            id="password"
            name="password"
            type="password"
            variant="outlined"
            fullWidth
            value={formData.password}
            onChange={handleChange}
            required
            helperText="At least 6 characters with uppercase, lowercase, and number"
          />
        </Stack>
        <Button
          color="primary"
          variant="contained"
          size="large"
          fullWidth
          type="submit"
          disabled={loading}
          startIcon={<AppRegistrationIcon />}
        >
          {loading ? 'Signing Up...' : 'Sign Up'}
        </Button>
      </Box>
      {subtitle}
    </>
  );
};

export default AuthRegister;
