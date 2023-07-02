import PropTypes from 'prop-types';

import { useCallback, useContext, useEffect } from "react";
import { useRouter } from "../../../hooks/routes";
import { paths } from "../../../paths";
import { AuthContext } from '../auth-context';

const GuestGuard = ({ children }) => {
  const router = useRouter();

  const { authenticated } = useContext(AuthContext);

  const check = useCallback(() => {
    if (authenticated) {
      router.replace(paths.dashboard.root);
    }
  }, [authenticated, router]);

  useEffect(() => {
    check();
  }, [check]);

  return <>{children}</>;
}

GuestGuard.propTypes = {
  children: PropTypes.node,
};

export default GuestGuard;
