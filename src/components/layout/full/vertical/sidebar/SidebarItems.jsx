import React, { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { Box, List, useMediaQuery } from '@mui/material';

import AdminMenuItems from './MenuItems';
import UserMenuItems  from './UserMenuItems';

import { CustomizerContext } from '../../../../context/CustomizerContext';
import NavItem     from './NavItem';
import NavCollapse from './NavCollapse';
import NavGroup    from './NavGroup/NavGroup';

const SidebarItems = () => {
  const { pathname, hash } = useLocation();
  const pathDirect = pathname + hash;                 // e.g. "/admin/settings#api"
  const pathWithoutLast = pathname.slice(0, pathname.lastIndexOf('/'));

  const { isSidebarHover, isCollapse, isMobileSidebar, setIsMobileSidebar } =
    useContext(CustomizerContext);

  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
  const hideMenu = lgUp ? isCollapse === 'mini-sidebar' && !isSidebarHover : false;

  // choose menu by prefix
  const Menuitems = pathname.startsWith('/admin')
    ? AdminMenuItems
    : pathname.startsWith('/user')
    ? UserMenuItems
    : [];

  return (
    <Box sx={{ px: 3 }}>
      <List sx={{ pt: 0 }} className="sidebarNav">
        {Menuitems.map((item) => {
          if (item.subheader) {
            return <NavGroup key={item.subheader} item={item} hideMenu={hideMenu} />;
          }

          if (item.children) {
            return (
              <NavCollapse
                key={item.id}
                menu={item}
                level={1}
                pathDirect={pathDirect}
                pathWithoutLast={pathWithoutLast}
                hideMenu={hideMenu}
                onClick={() => setIsMobileSidebar(!isMobileSidebar)}
              />
            );
          }

          return (
            <NavItem
              key={item.id}
              item={item}
              level={1}
              pathDirect={pathDirect}
              hideMenu={hideMenu}
              onClick={() => setIsMobileSidebar(!isMobileSidebar)}
            />
          );
        })}
      </List>
    </Box>
  );
};

export default SidebarItems;
