import config from '../../../../context/config';
import { CustomizerContext } from '../../../../context/CustomizerContext';
import { Link } from 'react-router-dom';

import logoDark from '../../../../../assets/images/logos/dark-logo.svg';
import logoDarkRTL from '../../../../../assets/images/logos/dark-rtl-logo.svg';
import logoLight from '../../../../../assets/images/logos/light-logo.svg';
import logoLightRTL from '../../../../../assets/images/logos/light-logo-rtl.svg';
import logoIcon from '../../../../../assets/images/logos/logoIcon.svg';

import { styled } from '@mui/material';
import { useContext } from 'react';

const Logo = () => {
  const {
    isCollapse,
    isSidebarHover,
    activeDir,
    activeMode,
  } = useContext(CustomizerContext);
  const TopbarHeight = config.topbarHeight;

  const LinkStyled = styled(Link)(() => ({
    height: TopbarHeight,
    width: isCollapse === 'mini-sidebar' && !isSidebarHover ? '40px' : '180px',
    overflow: 'hidden',
    display: 'block',
  }));

  const logoSrc = () => {
    // 👇 When collapsed and not hovered, show icon
    if (isCollapse === 'mini-sidebar' && !isSidebarHover) {
      return logoIcon;
    }

    if (activeMode === 'dark') {
      return activeDir === 'ltr' ? logoLight : logoDarkRTL;
    } else {
      return activeDir === 'ltr' ? logoDark : logoLightRTL;
    }
  };

  return (
    <LinkStyled to="/" style={{ display: 'flex', alignItems: 'center' }}>
      <img
        src={logoSrc()}
        alt="Logo"
        style={{ width: '100%', height: 'auto', display: 'block' }}
      />
    </LinkStyled>
  );
};

export default Logo;
