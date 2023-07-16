import PropTypes from 'prop-types';
import { useEffect } from 'react';
// @mui
import List from '@mui/material/List';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
//
import { usePathname } from '../../../../../hooks/routes';
import { useBoolean } from '../../../../../hooks/use-boolean';
import { SvgColor } from '../../../../../components/icons';
import Scrollbar from '../../../../../components/scrollbar/scrollbar';
import { Logo } from '../../../../../components';
import { ClientViews } from '../../../../../paths';
import SidebarList from '../../sidebar/sidebar-list';
import SidebarConfig from '../../sidebar/sidebar-config';

// ----------------------------------------------------------------------

export default function NavMobile({ offsetTop, data }) {
  const pathname = usePathname();

  const nav = useBoolean();

  useEffect(() => {
    if (nav.value) {
      nav.onFalse();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <>
      <IconButton
        onClick={nav.onTrue}
        sx={{
          mr: 2,
          ...(offsetTop && {
            color: 'text.primary',
          }),
        }}
      >
        <SvgColor src="/assets/icons/navbar/ic_menu_item.svg" />
      </IconButton>

      <Drawer
        open={nav.value}
        onClose={nav.onFalse}
        PaperProps={{
          sx: {
            pb: 5,
            width: 260,
          },
        }}
      >
        <Scrollbar>
          <Logo sx={{ mx: 2.5, my: 3 }} link="/" />

          <List disablePadding sx={{ px: 2 }}>
            {ClientViews.map((item, index) => <SidebarList
              key={`${item.name}-${item.action}-${index}`}
              item={item}
              depth={1}
              config={SidebarConfig(item.config)} />)}
          </List>
        </Scrollbar>
      </Drawer>
    </>
  );
}

NavMobile.propTypes = {
  data: PropTypes.array,
  offsetTop: PropTypes.bool,
};
