import PropTypes from 'prop-types';
import { forwardRef } from 'react';
// @mui
import Link from '@mui/material/Link';
//
import { ListItem } from './styles';
import { RouterLink } from '../../../../../components';
import Iconify from '../../../../../components/icons/iconify';

// ----------------------------------------------------------------------

export const NavItem = forwardRef(
  ({ item, open, offsetTop, active, subItem, externalLink, ...other }, ref) => {
    const { name, action, children } = item;

    const renderContent = (
      <ListItem
        ref={ref}
        disableRipple
        offsetTop={offsetTop}
        subItem={subItem}
        active={active}
        open={open}
        {...other}
      >
        {name}

        {!!children && <Iconify width={16} icon="eva:arrow-ios-downward-fill" sx={{ ml: 1 }} />}
      </ListItem>
    );

    // External link
    if (externalLink) {
      return (
        <Link href={action} target="_blank" rel="noopener" underline="none">
          {renderContent}
        </Link>
      );
    }

    // Has child
    if (children) {
      return renderContent;
    }

    // Default
    return (
      <Link component={RouterLink} href={action} underline="none">
        {renderContent}
      </Link>
    );
  }
);

NavItem.propTypes = {
  active: PropTypes.bool,
  externalLink: PropTypes.bool,
  item: PropTypes.object,
  offsetTop: PropTypes.bool,
  open: PropTypes.bool,
  subItem: PropTypes.bool,
};
