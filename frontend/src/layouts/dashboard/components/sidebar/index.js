import { Box, List, Stack } from '@mui/material';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { Logo, Scrollbar } from '../../../../components';
import { usePathname } from '../../../../hooks/routes';
import { useResponsive } from '../../../../hooks/use-responsive';
import { NAV } from '../config-layout';
import SidebarList from './sidebar-list';
import { views } from '../../../../paths';
import SidebarConfig from './sidebar-config';

const Sidebar = ({ open, onCloseNav }) => {
  const pathname = usePathname();
  const lgUp = useResponsive('up', 'lg');

  useEffect(() => {
    if (open) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  return <>
    <Box
      component="nav"
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV.W_VERTICAL },
      }}
    >
      {lgUp ? (
        <Stack
          sx={{
            height: 1,
            position: 'fixed',
            width: NAV.W_VERTICAL,
            borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
          }}
        >
          <Scrollbar
            sx={{
              height: 1,
              '& .simplebar-content': {
                height: 1,
                display: 'flex',
                flexDirection: 'column',
              },
            }}
          >
            <Logo sx={{ mt: 3, ml: 4, mb: 1 }} />

            <List disablePadding sx={{ px: 2 }}>
              {views.map((item, index) => <SidebarList
                key={item.name + item.path + index}
                item={item}
                depth={1}
                config={SidebarConfig(item.config)} />)}
            </List>
          </Scrollbar>
        </Stack>)
        : <>Home</>
      }
    </Box>
  </>
}

Sidebar.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
}

export default Sidebar;
