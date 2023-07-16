import { AppBar, Box, Button, Container, Link, Stack, Toolbar, useTheme } from "@mui/material";
import { useOffSetTop } from "../../../hooks/use-off-set-top";
import { HEADER } from "../../config-layout";
import { bgBlur } from "../../../theme/css";
import { Logo, RouterLink } from "../../../components";
import { paths } from "../../../paths";
import HeaderShadow from "./header-shadow";
import { useResponsive } from "../../../hooks/use-responsive";
import NavMobile from "./nav/mobile/nav-mobile";
import NavDesktop from "./nav/desktop/nav-desktop";

const Header = () => {
  const theme = useTheme();

  const mdUp = useResponsive('up', 'md');

  const offsetTop = useOffSetTop(HEADER.H_DESKTOP);

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
            <Button variant="contained" target="_blank" rel="noopener" href={paths.minimalUI}>
              Purchase Now
            </Button>

            {/* {mdUp && <LoginButton />} */}

          </Stack>
        </Container>
      </Toolbar>

      {offsetTop && <HeaderShadow />}
    </AppBar>
  </>
}

export default Header
