import PropTypes from 'prop-types';
import { useEffect } from 'react';
// @mui
import Fade from '@mui/material/Fade';
import Stack from '@mui/material/Stack';
import Portal from '@mui/material/Portal';
//
import { NavItem } from './nav-item';
import { StyledSubheader, StyledMenu } from './styles';
import { useActiveLink, usePathname } from '../../../../../hooks/routes';
import { useBoolean } from '../../../../../hooks/use-boolean';

// ----------------------------------------------------------------------

export default function NavList({ item, offsetTop }) {
  const pathname = usePathname();

  const nav = useBoolean();

  const { action, children } = item;

  const active = useActiveLink(action, false);

  const externalLink = action.includes('http');

  useEffect(() => {
    if (nav.value) {
      nav.onFalse();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const handleOpenMenu = () => {
    if (children) {
      nav.onTrue();
    }
  };

  return (
    <>
      <NavItem
        item={item}
        offsetTop={offsetTop}
        active={active}
        open={nav.value}
        externalLink={externalLink}
        onMouseEnter={handleOpenMenu}
        onMouseLeave={nav.onFalse}
      />

      {!!children && nav.value && (
        <Portal>
          <Fade in={nav.value}>
            <StyledMenu
              onMouseEnter={handleOpenMenu}
              onMouseLeave={nav.onFalse}
              sx={{ display: 'flex' }}
            >
              {children.map((list) => (
                <NavSubList
                  key={list.subheader}
                  subheader={list.subheader}
                  items={list.items}
                  onClose={nav.onFalse}
                />
              ))}
            </StyledMenu>
          </Fade>
        </Portal>
      )}
    </>
  );
}

NavList.propTypes = {
  item: PropTypes.object,
  offsetTop: PropTypes.bool,
};

// ----------------------------------------------------------------------

function NavSubList({ items, isDashboard, subheader, onClose }) {
  const pathname = usePathname();

  return (
    <Stack
      spacing={2}
      alignItems="flex-start"
      sx={{
        flexGrow: 1,
      }}
    >
      <StyledSubheader disableSticky>{subheader}</StyledSubheader>

      {items.map((item) =>
        <NavItem
          subItem
          key={item.name}
          item={item}
          active={pathname === `${item.action}/`}
          onClick={onClose}
        />
      )}
    </Stack>
  );
}

NavSubList.propTypes = {
  isDashboard: PropTypes.bool,
  items: PropTypes.array,
  onClose: PropTypes.func,
  subheader: PropTypes.string,
};
