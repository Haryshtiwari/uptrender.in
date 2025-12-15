import React, { useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  List,
  styled,
  useTheme,
} from '@mui/material';
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { CustomizerContext } from '../../../../../context/CustomizerContext';

import NavItem from '../NavItem';

const NavCollapse = ({
  menu,
  level,
  pathDirect,
  pathWithoutLast,
  hideMenu,
  onClick,
}) => {
  const { isBorderRadius } = useContext(CustomizerContext);
  const { t } = useTranslation();
  const theme = useTheme();

  /* auto‑open when any child matches current route */
  const [open, setOpen] = useState(
    menu.children?.some((c) => c.href === pathDirect)
  );

  useEffect(() => {
    setOpen(menu.children?.some((c) => c.href === pathDirect));
  }, [pathDirect, menu.children]);

  const ListItemStyled = styled(ListItemButton)({
    padding: '8px 10px',
    paddingLeft: hideMenu ? 10 : level > 2 ? level * 15 : 10,
    borderRadius: isBorderRadius,
    marginBottom: 2,
    backgroundColor:
      open && level < 2 ? theme.palette.primary.main : 'inherit',
    color:
      open && level < 2
        ? theme.palette.primary.contrastText
        : theme.palette.text.secondary,
    '&:hover': {
      backgroundColor: theme.palette.primary.light,
    },
  });

  const Icon = menu.icon;
  const iconSize = level > 1 ? '1rem' : '1.3rem';
  const parentActive = menu.children?.some((c) => c.href === pathDirect);

  return (
    <>
      <ListItemStyled
        onClick={() => setOpen(!open)}
        selected={parentActive}
      >
        <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}>
          <Icon stroke={1.5} size={iconSize} />
        </ListItemIcon>
        {!hideMenu && <ListItemText primary={t(menu.title)} />}
        {!hideMenu &&
          (open ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />)}
      </ListItemStyled>

      <Collapse in={open} timeout="auto" unmountOnExit>
        <List disablePadding>
          {menu.children.map((child) =>
            child.children ? (
              <NavCollapse
                key={child.id}
                menu={child}
                level={level + 1}
                pathDirect={pathDirect}
                pathWithoutLast={pathWithoutLast}
                hideMenu={hideMenu}
                onClick={onClick}
              />
            ) : (
              <NavItem
                key={child.id}
                item={child}
                level={level + 1}
                pathDirect={pathDirect}
                hideMenu={hideMenu}
                onClick={onClick}
              />
            )
          )}
        </List>
      </Collapse>
    </>
  );
};

NavCollapse.propTypes = {
  menu: PropTypes.object.isRequired,
  level: PropTypes.number.isRequired,
  pathDirect: PropTypes.string.isRequired,
  pathWithoutLast: PropTypes.string,
  hideMenu: PropTypes.bool,
  onClick: PropTypes.func,
};

export default NavCollapse;
