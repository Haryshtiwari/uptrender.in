import * as React from 'react';
import {
  IconButton,
  Box,
  AppBar,
  useMediaQuery,
  Toolbar,
  styled,
  Stack,
  Tooltip,
  Container,
} from '@mui/material';
import PropTypes from 'prop-types';
import {
  IconMenu2,
  IconMoon,
  IconSun,
  IconSettings,
} from '@tabler/icons-react';

import Notifications from '../../vertical/header/Notifications';
import Profile from '../../vertical/header/Profile';
import WalletBalanceNav from './WalletBalanceNav';
import Logo from '../../../full/shared/logo/Logo';
import config from '../../../../context/config';
import { CustomizerContext } from '../../../../context/CustomizerContext';
import { ProductProvider } from '../../../../context/EcommerceContext';
import Customizer from '../../../full/shared/customizer/Customizer'; 

const Header = () => {
  const lgDown = useMediaQuery((theme) => theme.breakpoints.down('lg'));
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));

  const {
    isLayout,
    setIsMobileSidebar,
    isMobileSidebar,
    activeMode,
    setActiveMode,
  } = React.useContext(CustomizerContext);

  const TopbarHeight = config.topbarHeight;

  const [customizerOpen, setCustomizerOpen] = React.useState(false);

  const AppBarStyled = styled(AppBar)(({ theme }) => ({
    background: theme.palette.background.paper,
    justifyContent: 'center',
    backdropFilter: 'blur(4px)',
    [theme.breakpoints.up('lg')]: {
      minHeight: TopbarHeight,
    },
  }));

  const ToolbarStyled = styled(Toolbar)(({ theme }) => ({
    width: '100%',
    color: `${theme.palette.text.secondary} !important`,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  }));

  return (
    <ProductProvider>
      <AppBarStyled position="sticky" color="default" elevation={8}>
        <Container maxWidth={isLayout === 'boxed' ? 'lg' : false}>
            <ToolbarStyled
          sx={{
            maxWidth: isLayout === 'boxed' ? 'lg' : '100%!important',
          }}
        >
            {/* Logo */}
          <Box sx={{ width: lgDown ? '45px' : 'auto', overflow: 'hidden' }}>
            <Logo />
          </Box>

            {/* Sidebar toggle for mobile */}
            {lgDown && (
              <IconButton
                color="inherit"
                aria-label="menu"
                onClick={() => setIsMobileSidebar(!isMobileSidebar)}
              >
                <IconMenu2 />
              </IconButton>
            )}

            <Box flexGrow={1} />

            {/* Right Icons */}
            <Stack direction="row" spacing={1} alignItems="center">
              {/* Wallet Balance */}
              <WalletBalanceNav />

              {/* Theme toggle */}
              <Tooltip title="Toggle Light/Dark Mode">
                <IconButton size="large" color="inherit">
                  {activeMode === 'light' ? (
                    <IconMoon size="21" stroke="1.5" onClick={() => setActiveMode('dark')} />
                  ) : (
                    <IconSun size="21" stroke="1.5" onClick={() => setActiveMode('light')} />
                  )}
                </IconButton>
              </Tooltip>

              {/* Theme Settings */}
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
              <Profile />
            </Stack>
          </ToolbarStyled>
        </Container>
      </AppBarStyled>

      {/* Customizer floating panel */}
      <Customizer open={customizerOpen} onClose={() => setCustomizerOpen(false)} />
    </ProductProvider>
  );
};

Header.propTypes = {
  sx: PropTypes.object,
  toggleSidebar: PropTypes.func,
};

export default Header;
