import React from 'react';
import { Box, Avatar, Typography, IconButton, Tooltip, useMediaQuery, CircularProgress } from '@mui/material';
import { CustomizerContext } from '../../../../../context/CustomizerContext';
import { useContext } from 'react';
import img1 from '../../../../../../assets/images/profile/user-1.jpg';
import { IconPower } from '@tabler/icons-react';
import { Link } from "react-router";
import { useAuth } from '../../../../../../app/authContext';
import { useToast } from '../../../../../../hooks/useToast';
import { getAvatarUrl } from '../../../../../../utils/avatarUtils';

export const Profile = () => {
  const { isSidebarHover, isCollapse } = useContext(CustomizerContext);
  const { user, logout, isLoading } = useAuth();
  const { showSuccess, showInfo } = useToast();

  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
  const hideMenu = lgUp ? isCollapse == 'mini-sidebar' && !isSidebarHover : '';

  const handleLogout = async () => {
    try {
      showInfo('Logging out...');
      await logout();
      showSuccess('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <Box
      display={'flex'}
      alignItems="center"
      gap={2}
      sx={{ m: 3, p: 2, bgcolor: `${'primary.light'}` }}
    >
      {!hideMenu ? (
        <>
          <Avatar alt={user?.name || 'User'} src={getAvatarUrl(user?.avatar) || img1} />

          <Box>
            <Typography variant="h6" color="textPrimary">
              {user?.name || 'User'}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {user?.role === 'admin' ? 'Admin' : 'User'}
            </Typography>
          </Box>
          <Box sx={{ ml: 'auto' }}>
            <Tooltip title="Logout" placement="top">
              <IconButton
                color="primary"
                onClick={handleLogout}
                disabled={isLoading}
                aria-label="logout"
                size="small"
              >
                {isLoading ? <CircularProgress size={16} /> : <IconPower size="20" />}
              </IconButton>
            </Tooltip>
          </Box>
        </>
      ) : (
        ''
      )}
    </Box>
  );
};
