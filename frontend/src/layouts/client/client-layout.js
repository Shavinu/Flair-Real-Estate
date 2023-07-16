import { Box } from '@mui/material';
import { usePathname } from '../../hooks/routes';
import Header from './components/header';
import { Outlet } from 'react-router-dom';
import Footer from './components/footer';

const ClientLayout = () => {
  const pathname = usePathname();

  const isHome = pathname === '/';

  return <>
    <Box sx={{ display: 'flex', flexDirection: 'column', height: 1 }}>
      <Header />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ...(!isHome && {
            pt: { xs: 8, md: 10 },
          }),
        }}
      >
        <Outlet />
      </Box>

      <Footer />
    </Box>
  </>
}

export default ClientLayout
