import { Box, Stack } from "@mui/material";
import { alpha, useTheme } from '@mui/material/styles';
import { Outlet } from "react-router-dom";
import Logo from "../../components/logo";
import { ASSETS_URL } from "../../config-global";
import { useResponsive } from "../../hooks/use-responsive";
import { GuestGuard } from "../../providers/auth/guards";
import { bgGradient } from "../../theme/css";

const AuthLayout = () => {
  const theme = useTheme();
  const upMd = useResponsive('up', 'md');

  return <>
    <GuestGuard>
      <Stack
        component="main"
        direction="row"
        sx={{
          minHeight: '100vh',
        }}
      >
        <Logo
          sx={{
            zIndex: 9,
            position: 'absolute',
            m: { xs: 2, md: 5 },
            width: 80
          }}
        />

        {upMd && <Stack
          flexGrow={1}
          alignItems="center"
          justifyContent="center"
          spacing={10}
          sx={{
            ...bgGradient({
              color: alpha(
                theme.palette.background.default,
                theme.palette.mode === 'light' ? 0.88 : 0.94
              ),
              imgUrl: `${ASSETS_URL}/assets/background/overlay_2.jpg`,
            }),
          }}
        >
          <Box
            component="img"
            alt="auth"
            src={`${ASSETS_URL}/assets/logo/logo.png`}
            sx={{ maxWidth: 720 }}
          />
        </Stack>}

        <Stack
          sx={{
            width: 1,
            mx: 'auto',
            maxWidth: 480,
            px: { xs: 2, md: 8 },
          }}
        >
          <Outlet />
        </Stack>
      </Stack>
    </GuestGuard>
  </>
}

export default AuthLayout
