import React from 'react';
import { RouterHistory } from 'react-router-dom';
import queryString from 'query-string';
import { InitContext, InitCtx } from '../context/InitProvider';
import auth from '../Auth/Auth';
import { StringParam, useQueryParam } from 'use-query-params';
import { getIstaQueryParams } from '../Auth/utils';

type Props = {
  history: RouterHistory;
};

const Callback = ({ history }: Props) => {
  const { setAuthSuccess } = React.useContext<InitCtx>(InitContext);
  const [t] = useQueryParam('t', StringParam);

  React.useEffect(() => {
    const qs = queryString.parse(history.location.search);
    const redirectToSavedState = () => {
      const redirectState = auth.getAndClearRedirectState();
      if (redirectState) {
        history.replace(redirectState.pathname + redirectState.search);
      } else {
        history.replace('/');
      }
    };

    if (!auth.isAuthenticated()) {
      if (qs.error) {
        // This state is possible when a partner connects with its IdP and the user is not yet identified for us
        // Have a special query param in case of ISTA we want to support enterprise auth flow so that we display
        // a different ista login button in the ui-auth
        auth.login({
          signup: false,
          customQueryParams: getIstaQueryParams(t),
        });
      } else {
        auth.handleAuthentication(() => {
          setAuthSuccess();
          redirectToSavedState();
        });
      }
    } else {
      redirectToSavedState();
    }
  }, [history, setAuthSuccess]);

  return null;
};

export default Callback;
