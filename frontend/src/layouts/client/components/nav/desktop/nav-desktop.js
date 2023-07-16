import PropTypes from 'prop-types';
// @mui
import Stack from '@mui/material/Stack';
import { ClientViews } from '../../../../../paths';
import NavList from './nav-list';
//
// import NavList from './nav-list';

// ----------------------------------------------------------------------

export default function NavDesktop({ offsetTop }) {
  return (
    <Stack component="nav" direction="row" spacing={5} sx={{ mr: 2.5, height: 1 }}>
      {ClientViews.map((link, key) => (
        <NavList key={`${link.name}-${link.action}-${key}`} item={link} offsetTop={offsetTop} />
      ))}
    </Stack>
  );
}

NavDesktop.propTypes = {
  data: PropTypes.array,
  offsetTop: PropTypes.bool,
};
