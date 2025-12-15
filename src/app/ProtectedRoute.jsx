import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './authContext';
import { Box, CircularProgress } from '@mui/material';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, isLoading, role } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Check role-based access if requiredRole is specified
  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/auth/login" replace />;
  }

  return children;
};

export default ProtectedRoute;