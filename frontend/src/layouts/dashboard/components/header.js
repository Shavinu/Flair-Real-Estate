import { AppBar, IconButton, Stack, Toolbar } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { useResponsive } from '../../../hooks/use-responsive';
import { bgBlur } from '../../../theme/css';
import { HEADER, NAV } from '../../config-layout';
import { SvgColor } from '../../../components/icons';
import { ASSETS_URL } from '../../../config-global';
import ProfileDropdown from './profile-dropdown';

const Header = ({ onOpenNav }) => {
  const theme = useTheme();

  const lgUp = useResponsive('up', 'lg');
  return <>
    <AppBar
      sx={{
        height: HEADER.H_MOBILE,
        zIndex: theme.zIndex.appBar + 1,
        ...bgBlur({
          color: theme.palette.background.default,
        }),
        transition: theme.transitions.create(['height'], {
          duration: theme.transitions.duration.shorter,
        }),
        ...(lgUp && {
          width: `calc(100% - ${NAV.W_VERTICAL + 1}px)`,
          height: HEADER.H_DESKTOP_OFFSET,
          // ...(offset && {
          //   height: HEADER.H_DESKTOP_OFFSET,
          // }),
        }),
        boxShadow: 'none',
      }}
    >
      <Toolbar
        sx={{
          height: 1,
          px: { lg: 5 },
        }}
      >
        {!lgUp && (
          <IconButton onClick={onOpenNav}>
            <SvgColor src={`${ASSETS_URL}/assets/icons/navbar/ic_menu_item.svg`} />
          </IconButton>
        )}

        {/* <Searchbar /> */}

        <Stack
          flexGrow={1}
          direction="row"
          alignItems="center"
          justifyContent="flex-end"
          spacing={{ xs: 0.5, sm: 1 }}
        >
          <ProfileDropdown />
        </Stack>
      </Toolbar>
    </AppBar>
  </>
}

Header.propTypes = {
  onOpenNav: PropTypes.func,
}

export default Header;
