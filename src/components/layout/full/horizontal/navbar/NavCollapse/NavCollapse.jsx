import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import { useLocation } from 'react-router';

import {
  ListItemIcon,
  ListItem,
  styled,
  ListItemText,
  Box,
} from '@mui/material';

import { IconChevronDown } from '@tabler/icons-react';

import NavItem from '../NavItem/NavItem';
import { CustomizerContext } from '../../../../../context/CustomizerContext';

const NavCollapse = ({ menu, level, pathWithoutLastPart, pathDirect, hideMenu }) => {
  const Icon = menu.icon;
  const theme = useTheme();
  const { pathname } = useLocation();
  const { isBorderRadius } = useContext(CustomizerContext);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    const isActive = menu.children.some((item) => item.href === pathname);
    setOpen(isActive);
  }, [pathname, menu.children]);

  const menuIcon = level > 1
    ? <Icon stroke={1.5} size="1rem" />
    : <Icon stroke={1.5} size="1.1rem" />;

  const ListItemStyled = styled(ListItem)(() => ({
    width: 'auto',
    cursor: 'pointer',
    padding: '6px 12px',
    borderRadius: `${isBorderRadius}px`,
    whiteSpace: 'nowrap',
    position: 'relative',
    gap: '10px',
    color: open || pathname.includes(menu.href)
      ? theme.palette.primary.contrastText
      : theme.palette.text.secondary,
    backgroundColor: open || pathname.includes(menu.href)
      ? theme.palette.primary.main
      : 'transparent',
    '&:hover': {
      backgroundColor: open
        ? theme.palette.primary.main
        : theme.palette.primary.light,
    },
    '&:hover > .SubNav': {
      display: 'block',
    },
  }));

  const ListSubMenu = styled(Box)(() => ({
    display: 'none',
    position: 'absolute',
    top: level > 1 ? 0 : 40,
    left: level > 1 ? `${level + 228}px` : 0,
    padding: '10px',
    width: '250px',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[8],
    zIndex: 99,
  }));

  return (
    <>
      <ListItemStyled
        component="li"
        selected={pathWithoutLastPart === menu.href}
      >
        <ListItemIcon
          sx={{
            minWidth: 'auto',
            color: 'inherit',
          }}
        >
          {menuIcon}
        </ListItemIcon>
        <ListItemText sx={{ mr: 'auto' }}>{menu.title}</ListItemText>
        <IconChevronDown size="1rem" />
        <ListSubMenu component="ul" className="SubNav">
          {menu.children?.map((item) =>
            item.children ? (
              <NavCollapse
                key={item.id}
                menu={item}
                level={level + 1}
                pathWithoutLastPart={pathWithoutLastPart}
                pathDirect={pathDirect}
                hideMenu={hideMenu}
              />
            ) : (
              <NavItem
                key={item.id}
                item={item}
                level={level + 1}
                pathDirect={pathDirect}
                hideMenu={hideMenu}
              />
            )
          )}
        </ListSubMenu>
      </ListItemStyled>
    </>
  );
};

NavCollapse.propTypes = {
  menu: PropTypes.object.isRequired,
  level: PropTypes.number.isRequired,
  pathDirect: PropTypes.string.isRequired,
  pathWithoutLastPart: PropTypes.string.isRequired,
  hideMenu: PropTypes.any,
};

export default NavCollapse;
