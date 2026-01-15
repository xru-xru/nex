import React, { useState } from 'react';

type Props = {
  children: React.ReactNode;
};

type InitCtx = {
  initializing: boolean;
  loggedIn: boolean;
  hasUser: boolean;
  user?: any;
  setAuthSuccess: () => void;
  setUserSuccess: (user?: any) => void;
};

const InitContext = React.createContext<InitCtx>({
  initializing: true,
  loggedIn: false,
  hasUser: false,
  setAuthSuccess() {},
  setUserSuccess() {},
});

const InitProvider: React.FC<Props> = ({ children }) => {
  const [state, setState] = useState<InitCtx>({
    initializing: true,
    loggedIn: false,
    hasUser: false,
    setAuthSuccess: () => {
      setState((prev) => ({ ...prev, loggedIn: true, initializing: !prev.hasUser }));
    },
    setUserSuccess: (user: any) => {
      setState((prev) => ({ ...prev, hasUser: true, user, initializing: !prev.loggedIn }));
    },
  });

  return <InitContext.Provider value={state}>{children}</InitContext.Provider>;
};

export default InitProvider;
export { InitContext };
export type { InitCtx };
