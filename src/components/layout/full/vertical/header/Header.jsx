import React, { useContext, useState } from 'react';
import {
  IconButton,
  Box,
  AppBar,
  useMediaQuery,
  Toolbar,
  styled,
  Stack,
  Tooltip,
} from '@mui/material';
import PropTypes from 'prop-types';
import {
  IconMenu2,
  IconMoon,
  IconSun,
  IconSettings,
} from '@tabler/icons-react';

import { CustomizerContext } from '../../../../context/CustomizerContext';
import { ProductProvider } from '../../../../context/EcommerceContext';
import config from '../../../../context/config';

// Components
import Notifications from './Notifications';
import Profile from './Profile';
import WalletBalanceNav from '../../horizontal/header/WalletBalanceNav';
import Customizer from '../../../full/shared/customizer/Customizer'; 

const Header = () => {
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
  const lgDown = useMediaQuery((theme) => theme.breakpoints.down('lg'));

  const TopbarHeight = config.topbarHeight;

  const {
    activeMode,
    setActiveMode,
    setIsCollapse,
    isCollapse,
    isMobileSidebar,
    setIsMobileSidebar,
  } = useContext(CustomizerContext);

  const [customizerOpen, setCustomizerOpen] = useState(false);

  const AppBarStyled = styled(AppBar)(({ theme }) => ({
    boxShadow: 'none',
    background: theme.palette.background.paper,
    justifyContent: 'center',
    backdropFilter: 'blur(4px)',
    [theme.breakpoints.up('lg')]: {
      minHeight: TopbarHeight,
    },
  }));

  const ToolbarStyled = styled(Toolbar)(({ theme }) => ({
    width: '100%',
    color: theme.palette.text.secondary,
  }));

  return (
    <ProductProvider>
      <AppBarStyled position="sticky" color="default">
        <ToolbarStyled>
          {/* Sidebar Toggle */}
         <IconButton
          color="inherit"
          aria-label="menu"
          onClick={() => {
            // Toggle sidebar on both mobile and desktop based on screen size
            if (lgUp) {
              // For large screens, toggle between full-sidebar and mini-sidebar
              isCollapse === "full-sidebar" ? setIsCollapse("mini-sidebar") : setIsCollapse("full-sidebar");
            } else {
              // For smaller screens, toggle mobile sidebar
              setIsMobileSidebar(!isMobileSidebar);
            }
          }}
        >
            <IconMenu2 size="20" />
          </IconButton>

          <Box flexGrow={1} />

          <Stack spacing={1} direction="row" alignItems="center">
            {/* Wallet balance for quick view */}
            <WalletBalanceNav />
            {activeMode === 'light' ? (
              <IconButton size="large" color="inherit" onClick={() => setActiveMode('dark')}>
                <IconMoon size="21" stroke="1.5" />
              </IconButton>
            ) : (
              <IconButton size="large" color="inherit" onClick={() => setActiveMode('light')}>
                <IconSun size="21" stroke="1.5" />
              </IconButton>
            )}

            {/* Settings */}
            <Tooltip title="Theme Settings">
              <IconButton
                size="large"
                color="inherit"
                onClick={() => setCustomizerOpen(!customizerOpen)}
              >
                <IconSettings size="21" stroke="1.5" />
              </IconButton>
            </Tooltip>

            <Notifications />
            {/* {lgDown && <MobileRightSidebar />} */}
            <Profile />
          </Stack>
        </ToolbarStyled>
      </AppBarStyled>

      {/* Customizer as a floating box */}
      <Customizer open={customizerOpen} onClose={() => setCustomizerOpen(false)} />
    </ProductProvider>
  );
};

Header.propTypes = {
  sx: PropTypes.object,
  toggleSidebar: PropTypes.func,
};

export default Header;
