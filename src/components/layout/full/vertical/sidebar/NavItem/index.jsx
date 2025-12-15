import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import {
  ListItem,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Chip,
  Typography,
  styled,
  useTheme,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { CustomizerContext } from '../../../../../context/CustomizerContext';

const NavItem = ({ item, level, pathDirect, hideMenu, onClick }) => {
  const { isBorderRadius } = useContext(CustomizerContext);
  const { t } = useTranslation();
  const theme = useTheme();
 
  const isActive = pathDirect === item.href;

  const ListItemStyled = styled(ListItemButton)({
    marginBottom: 2,
    padding: '8px 10px',
    paddingLeft: hideMenu ? 10 : level > 2 ? level * 15 : 10,
    borderRadius: isBorderRadius,
    color: isActive ? theme.palette.primary.main : theme.palette.text.secondary,
    backgroundColor: isActive ? theme.palette.primary.main : 'inherit',
    '&:hover': {
      backgroundColor: isActive
        ? theme.palette.primary.main
        : theme.palette.primary.light,
      color: theme.palette.primary.main,
    },
    
  });

  const Icon = item.icon;
  const iconSize = level > 1 ? '1rem' : '1.3rem';

  return (
    <List component="li" disablePadding>
      <ListItemStyled
        component={item.external ? 'a' : NavLink}
        to={item.external ? undefined : item.href}
        href={item.external ? item.href : undefined}
        target={item.external ? '_blank' : undefined}
        selected={isActive}
        onClick={onClick}
        end
      >
        <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}>
          <Icon stroke={1.5} size={iconSize} />
        </ListItemIcon>

        {!hideMenu && (
          <ListItemText
            primary={
              <>
                {t(item.title)}
                {item.subtitle && (
                  <>
                    <br />
                    <Typography variant="caption">{item.subtitle}</Typography>
                  </>
                )}
              </>
            }
          />
        )}

        {!hideMenu && item.chip && (
          <Chip
            label={item.chip}
            size="small"
            color={item.chipColor || 'default'}
            variant={item.variant || 'filled'}
          />
        )}
      </ListItemStyled>
    </List>
  );
};

NavItem.propTypes = {
  item: PropTypes.object.isRequired,
  level: PropTypes.number,
  pathDirect: PropTypes.string.isRequired,
  hideMenu: PropTypes.bool,
  onClick: PropTypes.func,
};

export default NavItem;
