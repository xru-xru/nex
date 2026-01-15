import React from 'react';
import { Location } from 'react-router-dom';
import 'react-router-dom';

import { InitContext, InitCtx } from '../context/InitProvider';

import auth from '../Auth/Auth';
import { PATHS } from './paths';
import { StringParam, useQueryParam } from 'use-query-params';
import { getIstaQueryParams } from '../Auth/utils';

type Props = {
  location: Location;
};

const Authenticate = ({ location }: Props) => {
  const { initializing, setAuthSuccess } = React.useContext<InitCtx>(InitContext);
  const [t] = useQueryParam('t', StringParam);

  React.useEffect(() => {
    if (location.pathname === PATHS.AUTH.CALLBACK) {
      return;
    }

    if (!auth.isAuthenticated()) {
      auth.login({
        signup: location.pathname === PATHS.AUTH.SIGN_UP,
        // Have a special query param in case of ISTA we want to support enterprise auth flow so that we display
        // a different ista login button in the ui-auth
        customQueryParams: getIstaQueryParams(t),
      });
      return;
    }

    if (initializing) {
      setAuthSuccess();
    }
  }, [location, initializing, setAuthSuccess]);
  return null;
};

export default Authenticate;
