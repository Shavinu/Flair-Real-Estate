import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import { Link } from 'react-router-dom';
import { forwardRef } from 'react';
import { ASSETS_URL } from '../config-global';

const Logo = forwardRef(({ link = '/', sx, ...other }, ref) => {
  const logo = (
    <Box
      component="img"
      src={`${ASSETS_URL}/logo/logo.png`}
      sx={{ width: 60, cursor: 'pointer', mt: 1, ...sx }}
      {...other}
    />
  );

  return (
    <Link to={link}>
      {logo}
    </Link>
  );
});

Logo.propTypes = {
  disabledLink: PropTypes.bool,
  sx: PropTypes.object,
}

export default Logo;
