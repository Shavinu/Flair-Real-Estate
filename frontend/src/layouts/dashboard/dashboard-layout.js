import { Outlet } from "react-router-dom";
import { AuthGuard } from "../../providers/auth/guards";
import { useResponsive } from "../../hooks/use-responsive";
import { useState } from "react";
import { Main, Sidebar } from "./components";
import { Box } from "@mui/material";
import Header from "./components/header";

const DashboardLayout = () => {
  const lgUp = useResponsive('up', 'lg');
  const [isOpen, setIsOpen] = useState(false);

  return <>
    <AuthGuard>
      <Header onOpenNav={() => setIsOpen(true)}/>
      <Box
        sx={{
          minHeight: 1,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
        }}
      >
        <Sidebar openNav={isOpen} onCloseNav={() => setIsOpen(false)} />

        <Main>
          <Outlet />
        </Main>
      </Box>
    </AuthGuard>
  </>
}

export default DashboardLayout
