import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

/**
 * Loader Component
 * Displays a loading spinner with optional message
 */
const Loader = ({ message = 'Loading...', size = 40, fullScreen = false }) => {
  if (fullScreen) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          width: '100%',
          gap: 2,
        }}
      >
        <CircularProgress size={size} />
        {message && (
          <Typography variant="body2" color="textSecondary">
            {message}
          </Typography>
        )}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 4,
        gap: 2,
      }}
    >
      <CircularProgress size={size} />
      {message && (
        <Typography variant="body2" color="textSecondary">
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default Loader;
