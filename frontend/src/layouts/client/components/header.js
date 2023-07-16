import { AppBar, Box, Button, Container, Stack, Toolbar, useTheme } from "@mui/material";
import { Logo } from "../../../components";
import { useOffSetTop } from "../../../hooks/use-off-set-top";
import { useResponsive } from "../../../hooks/use-responsive";
import { paths } from "../../../paths";
import { bgBlur } from "../../../theme/css";
import { HEADER } from "../../config-layout";
import HeaderShadow from "./header-shadow";
import NavDesktop from "./nav/desktop/nav-desktop";
import NavMobile from "./nav/mobile/nav-mobile";
import { useContext } from "react";
import { AuthContext } from "../../../providers/auth/auth-context";
import useDropdown from "../../../components/dropdown/use-dropdown";
import { ProfileDropdown } from "../../dashboard/components";

const Header = () => {
  const theme = useTheme();

  const mdUp = useResponsive('up', 'md');

  const offsetTop = useOffSetTop(HEADER.H_DESKTOP);

  const { user } = useContext(AuthContext);

  return <>
    <AppBar sx={{ backgroundColor: theme.palette.background.default }}>
      <Toolbar
        disableGutters
        sx={{
          height: {
            xs: HEADER.H_MOBILE,
            md: HEADER.H_DESKTOP,
          },
          transition: theme.transitions.create(['height'], {
            easing: theme.transitions.easing.easeInOut,
            duration: theme.transitions.duration.shorter,
          }),
          ...(offsetTop && {
            ...bgBlur({
              color: theme.palette.background.default,
            }),
            height: {
              md: HEADER.H_DESKTOP_OFFSET,
            },
          }),
        }}
      >
        <Container sx={{ height: 1, display: 'flex', alignItems: 'center' }}>
          {!mdUp && <NavMobile offsetTop={offsetTop} />}

          <Logo link="/" sx={{ width: 100 }} />

          <Box sx={{ flexGrow: 1 }} />

          {mdUp && <NavDesktop offsetTop={offsetTop} />}

          <Stack alignItems="center" direction={{ xs: 'row', md: 'row-reverse' }}>
            {!user
              ? <Button variant="outlined" href={paths.auth.login} >
                Login
              </Button>
              : <>
                <ProfileDropdown />
              </>}
          </Stack>
        </Container>
      </Toolbar>

      {offsetTop && <HeaderShadow />}
    </AppBar>
  </>
}

export default Header
