// import React, { useContext } from 'react';
// import Menudata from '../Menudata';
// import { useLocation } from 'react-router';
// import { Box, List, useMediaQuery } from '@mui/material';
// import { CustomizerContext } from '../../../../../context/CustomizerContext';
// import NavItem from '../NavItem/NavItem';
// import NavCollapse from '../NavCollapse/NavCollapse';

// const NavListing = () => {
//   const { pathname } = useLocation();
//   const pathDirect = pathname;
//   const pathWithoutLastPart = pathname.slice(0, pathname.lastIndexOf('/'));
//   const { isCollapse, isSidebarHover } = useContext(CustomizerContext);

//   const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
//   const hideMenu = lgUp ? isCollapse === "mini-sidebar" && !isSidebarHover : '';

//   return (
//     <Box>
//       <List sx={{ p: 0, display: 'flex', gap: '3px', zIndex: '100' }}>
//         {Menudata.map((item, index) => {
//           const key = item.id || item.title || `nav-${index}`;
          
//           if (item.children) {
//             return (
//               <NavCollapse
//                 key={key}
//                 menu={item}
//                 pathDirect={pathDirect}
//                 hideMenu={hideMenu}
//                 pathWithoutLastPart={pathWithoutLastPart}
//                 level={1}
//               />
//             );
//           } else {
//             return (
//               <NavItem
//                 key={key}
//                 item={item}
//                 pathDirect={pathDirect}
//                 hideMenu={hideMenu}
//               />
//             );
//           }
//         })}
//       </List>
//     </Box>
//   );
// };

// export default NavListing;


// import React from 'react';
// import { useLocation } from 'react-router';
// import { Box, List, useMediaQuery } from '@mui/material';
// import Cookies from 'js-cookie';

// import AdminMenuItems from '../Menudata';
// import UserMenuItems from '../UserMenudata';

// import { CustomizerContext } from '../../../../../context/CustomizerContext';
// import NavItem from '../NavItem/NavItem';
// import NavCollapse from '../NavCollapse/NavCollapse';

// const NavListing = () => {
//   const { pathname } = useLocation();
//   const pathDirect = pathname;
//   const pathWithoutLastPart = pathname.slice(0, pathname.lastIndexOf('/'));

//   const { isCollapse, isSidebarHover } = React.useContext(CustomizerContext);
//   const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
//   const hideMenu = lgUp ? isCollapse === 'mini-sidebar' && !isSidebarHover : '';

//   // ✅ Get role from cookie
//   const role = Cookies.get('role'); // 'admin' or 'user'

//   // ✅ Load correct menu based on role
//   const Menudata = role === 'admin' ? AdminMenuItems : role === 'user' ? UserMenuItems : [];

//   return (
//     <Box>
//       <List sx={{ p: 0, display: 'flex', gap: '3px', zIndex: '100' }}>
//         {Menudata.map((item, index) => {
//           const key = item.id || item.title || `nav-${index}`;

//           if (item.children) {
//             return (
//               <NavCollapse
//                 key={key}
//                 menu={item}
//                 pathDirect={pathDirect}
//                 hideMenu={hideMenu}
//                 pathWithoutLastPart={pathWithoutLastPart}
//                 level={1}
//               />
//             );
//           } else {
//             return (
//               <NavItem
//                 key={key}
//                 item={item}
//                 pathDirect={pathDirect}
//                 hideMenu={hideMenu}
//               />
//             );
//           }
//         })}
//       </List>
//     </Box>
//   );
// };

// export default NavListing;
import React from 'react';
import { useLocation } from 'react-router';
import { Box, List, useMediaQuery } from '@mui/material';

import AdminMenuItems from '../Menudata';
import UserMenuItems from '../UserMenudata';

import { CustomizerContext } from '../../../../../context/CustomizerContext';
import NavItem from '../NavItem/NavItem';
import NavCollapse from '../NavCollapse/NavCollapse';

const NavListing = () => {
  const { pathname } = useLocation();
  const pathDirect = pathname;
  const pathWithoutLastPart = pathname.slice(0, pathname.lastIndexOf('/'));

  const { isCollapse, isSidebarHover } = React.useContext(CustomizerContext);
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
  const hideMenu = lgUp ? isCollapse === 'mini-sidebar' && !isSidebarHover : '';


  let Menudata = [];
  if (pathname.startsWith('/admin')) {
    Menudata = AdminMenuItems;
  } else if (pathname.startsWith('/user')) {
    Menudata = UserMenuItems;
  }

  return (
    <Box>
      <List sx={{ p: 0, display: 'flex', gap: '3px', zIndex: '100' }}>
        {Menudata.map((item, index) => {
          const key = item.id || item.title || `nav-${index}`;

          if (item.children) {
            return (
              <NavCollapse
                key={key}
                menu={item}
                pathDirect={pathDirect}
                hideMenu={hideMenu}
                pathWithoutLastPart={pathWithoutLastPart}
                level={1}
              />
            );
          } else {
            return (
              <NavItem
                key={key}
                item={item}
                pathDirect={pathDirect}
                hideMenu={hideMenu}
              />
            );
          }
        })}
      </List>
    </Box>
  );
};

export default NavListing;
