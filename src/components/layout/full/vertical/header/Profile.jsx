import React, { useState } from 'react';
import { Link } from 'react-router';
import { Box, Menu, Avatar, Typography, Divider, Button, IconButton, CircularProgress } from '@mui/material';
import * as dropdownData from './data';

import { IconMail, IconPower } from '@tabler/icons-react';
import { Stack } from '@mui/system';

import ProfileImg from '../../../../../assets/images/profile/user-1.jpg';
import unlimitedImg from '../../../../../assets/images/backgrounds/unlimited-bg.png';
import Scrollbar from '../../../../../components/custom-scroll/Scrollbar';
import { useAuth } from '../../../../../app/authContext';
import { useToast } from '../../../../../hooks/useToast';
import { getAvatarUrl } from '../../../../../utils/avatarUtils';

const Profile = () => {
  const [anchorEl2, setAnchorEl2] = useState(null);
  const { user, logout, isLoading } = useAuth();
  const { showSuccess, showInfo } = useToast();

  const handleClick2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };
  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  const handleLogout = async () => {
    try {
      showInfo('Logging out...');
      await logout();
      showSuccess('Logged out successfully');
      handleClose2();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Show loading state if user data is loading
  if (isLoading) {
    return (
      <IconButton size="large" color="inherit" disabled>
        <CircularProgress size={24} />
      </IconButton>
    );
  }

  return (
    <Box>
      <IconButton
        size="large"
        aria-label="show user menu"
        color="inherit"
        aria-controls="profile-menu"
        aria-haspopup="true"
        sx={{
          ...(typeof anchorEl2 === 'object' && {
            color: 'primary.main',
          }),
        }}
        onClick={handleClick2}
      >
        <Avatar
          src={user?.avatar || ProfileImg}
          alt={user?.name || 'User'}
          sx={{
            width: 35,
            height: 35,
          }}
        />
      </IconButton>
      {/* ------------------------------------------- */}
      {/* Profile Dropdown */}
      {/* ------------------------------------------- */}
      <Menu
        id="profile-menu"
        anchorEl={anchorEl2}
        keepMounted
        open={Boolean(anchorEl2)}
        onClose={handleClose2}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        sx={{
          '& .MuiMenu-paper': {
            width: '360px',
          },
        }}
      >
        <Scrollbar sx={{ height: '100%', maxHeight: '85vh' }}>
          <Box p={3}>
            <Typography variant="h5">User Profile</Typography>
            <Stack direction="row" py={3} spacing={2} alignItems="center">
              <Avatar
                src={getAvatarUrl(user?.avatar) || ProfileImg}
                alt={user?.name || 'User'}
                sx={{ width: 95, height: 95 }}
              />
              <Box>
                <Typography variant="subtitle2" color="textPrimary" fontWeight={600}>
                  {user?.name || 'User'}
                </Typography>
                <Typography variant="subtitle2" color="textSecondary">
                  {user?.role === 'admin' ? 'Administrator' : 'User'}
                </Typography>
                <Typography
                  variant="subtitle2"
                  color="textSecondary"
                  display="flex"
                  alignItems="center"
                  gap={1}
                >
                  <IconMail width={15} height={15} />
                  {user?.email || 'user@example.com'}
                </Typography>
              </Box>
            </Stack>
            <Divider />
            {dropdownData.profile.map((profile) => (
              <Box key={profile.title}>
                <Box sx={{ py: 2, px: 0 }} className="hover-text-primary">
                  <Link to={profile.href}>
                    <Stack direction="row" spacing={2}>
                      <Box
                        width="45px"
                        height="45px"
                        bgcolor="primary.light"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Avatar
                          src={profile.icon}
                          alt={profile.icon}
                          sx={{
                            width: 24,
                            height: 24,
                            borderRadius: 0,
                          }}
                        />
                      </Box>
                      <Box>
                        <Typography
                          variant="subtitle2"
                          fontWeight={600}
                          color="textPrimary"
                          className="text-hover"
                          noWrap
                          sx={{
                            width: '240px',
                          }}
                        >
                          {profile.title}
                        </Typography>
                        <Typography
                          color="textSecondary"
                          variant="subtitle2"
                          sx={{
                            width: '240px',
                          }}
                          noWrap
                        >
                          {profile.subtitle}
                        </Typography>
                      </Box>
                    </Stack>
                  </Link>
                </Box>
              </Box>
            ))}
            <Box mt={2}>
              <Box bgcolor="primary.light" p={3} mb={3} overflow="hidden" position="relative">
                <Box display="flex" justifyContent="space-between">
                  <Box>
                    <Typography variant="h5" mb={2}>
                      Unlimited <br />
                      Access
                    </Typography>
                    <Button variant="contained" color="primary">
                      Upgrade
                    </Button>
                  </Box>
                  <img src={unlimitedImg} alt="unlimited" className="signup-bg"></img>
                </Box>
              </Box>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleLogout}
                fullWidth
                disabled={isLoading}
                startIcon={isLoading ? <CircularProgress size={16} /> : <IconPower size={16} />}
              >
                {isLoading ? 'Logging out...' : 'Logout'}
              </Button>
            </Box>
          </Box>
        </Scrollbar>
      </Menu>
    </Box>
  );
};

export default Profile;
