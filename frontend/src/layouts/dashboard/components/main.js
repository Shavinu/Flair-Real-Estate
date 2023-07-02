import PropTypes from 'prop-types'; // @mui
import { useResponsive } from '../../../hooks/use-responsive';
import { HEADER, NAV } from './config-layout';
import { Box } from '@mui/material';

const Main = ({ children, sx, ...other }) => {
  const lgUp = useResponsive('up', 'lg');
  const SPACING = 8;

  return <>
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        minHeight: 1,
        display: 'flex',
        flexDirection: 'column',
        py: `${HEADER.H_MOBILE + SPACING}px`,
        ...(lgUp && {
          px: 2,
          py: `${HEADER.H_DESKTOP + SPACING}px`,
          width: `calc(100% - ${NAV.W_VERTICAL}px)`,
        }),
        ...sx,
      }}
      {...other}
    >
      {children}
    </Box>
  </>
}

Main.propTypes = {
  children: PropTypes.node,
  sx: PropTypes.object,
};

export default Main;
