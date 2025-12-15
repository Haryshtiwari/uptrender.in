import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  styled,
  useTheme,
} from '@mui/material';

import { CustomizerContext } from '../../../../../context/CustomizerContext';

const NavItem = ({ item, level, pathDirect, onClick, hideMenu = false }) => {
  const { isBorderRadius } = useContext(CustomizerContext);
  const theme = useTheme();
  const Icon = item.icon ?? (() => null);

  const isActive = pathDirect === item.href;

  const ListItemStyled = styled(ListItem)(() => ({
    padding: '8px 12px',
    borderRadius: `${isBorderRadius}px`,
    marginBottom: '4px',
    paddingLeft: hideMenu ? '12px' : `${Math.min(level * 16, 32)}px`,
    color: isActive
      ? theme.palette.primary.contrastText
      : theme.palette.text.secondary,
    backgroundColor: isActive ? theme.palette.primary.main : 'transparent',
    '&:hover': {
      backgroundColor: isActive
        ? theme.palette.primary.main
        : theme.palette.primary.light,
      color: theme.palette.primary.main,
    },
  }));

  return (
    <List component="li" disablePadding>
      <ListItemStyled
        button
        component={item.external ? 'a' : NavLink}
        to={item.external ? undefined : item.href}
        href={item.external ? item.href : undefined}
        target={item.external ? '_blank' : undefined}
        rel={item.external ? 'noopener noreferrer' : undefined}
        disabled={item.disabled}
        onClick={onClick}
        selected={isActive}
      >
        <ListItemIcon
          sx={{
            minWidth: '32px',
            color: isActive ? theme.palette.primary.contrastText : 'inherit',
          }}
        >
          <Icon stroke={1.5} size={level > 1 ? '1rem' : '1.2rem'} />
        </ListItemIcon>
        {!hideMenu && (
          <ListItemText primary={item.title} />
        )}
      </ListItemStyled>
    </List>
  );
};

NavItem.propTypes = {
  item: PropTypes.object.isRequired,
  level: PropTypes.number.isRequired,
  pathDirect: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  hideMenu: PropTypes.bool,
};

export default NavItem;
