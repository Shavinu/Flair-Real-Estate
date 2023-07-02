import PropTypes from 'prop-types';
import { useRouter } from '../../../hooks/routes';
import { useCallback, useContext, useEffect, useState } from 'react';
import { paths } from '../../../paths';
import { AuthContext } from '../auth-context';

const AuthGuard = ({ children }) => {
  const router = useRouter();

  const { authenticated } = useContext(AuthContext);
  const [checked, setChecked] = useState(false);

  const check = useCallback(() => {
    if (!authenticated) {
      const searchParams = new URLSearchParams({ returnTo: window.location.pathname }).toString();

      const loginPath = paths.auth.login;

      const href = `${loginPath}?${searchParams}`;

      router.replace(href);
    } else {
      setChecked(true);
    }
  }, [authenticated, router]);

  useEffect(() => {
    check();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!checked) {
    return null;
  }

  return <>{children}</>;
}

export default AuthGuard;

AuthGuard.propTypes = {
  children: PropTypes.node,
};
