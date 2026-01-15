import React, { createContext } from 'react';
import { useHistory } from 'react-router-dom';

import { NumberParam, useQueryParam } from 'use-query-params';

import { SESSION_EXPIRES_AT, SESSION_TEAM_KEY } from '../constants/localStorage';

import auth from '../Auth/Auth';

type Props = {
  children: React.ReactElement;
};
type SetTeamCbFn = () => void;
type SetTeamFn = (teamId: number, cb?: SetTeamCbFn) => void;
type TeamCtx = {
  teamId: number;
  setTeam: SetTeamFn;
};

// TODO: This needs to be rewritten into a more modular and logical structure.
// IT's is confusing.
// It is actually comparing expiration timestamp one living in the TEAM_KEY and
// one living in the EXPIRES_AT which is coming from Auth class.
function getLocalStorageTeamId(): number {
  try {
    const teamRef = JSON.parse(localStorage.getItem(SESSION_TEAM_KEY) || '{}');
    const expiresRef = localStorage.getItem(SESSION_EXPIRES_AT);

    if (expiresRef && teamRef.expiresRef === expiresRef) {
      return teamRef.teamId;
    } else {
      localStorage.removeItem(SESSION_TEAM_KEY);
    }
  } catch {
    // eslint-disable-next-line no-console
    console.warn('Error parsing the local storage team');
  }

  return 0;
}

function setLocalStorageTeamId(id: number) {
  localStorage.setItem(
    SESSION_TEAM_KEY,
    JSON.stringify({
      teamId: id,
      expiresRef: auth.getExpiresAt(),
    }),
  );
}

export const localStorageTeamId = getLocalStorageTeamId();
const TeamContext = createContext<TeamCtx>({
  teamId: localStorageTeamId,

  setTeam() {},
});

function TeamProvider(props: Props) {
  const historyInner = useHistory();
  const [teamId, setTeamId] = React.useState(localStorageTeamId);
  const [urlTeamId, setUrlTeamId] = useQueryParam('team_id', NumberParam);
  
  // We need this callback to be able to redirect after the component
  // successfully updates the teamID when selecting the team.
  const callback = React.useRef(null);
  
  // Store the history listener cleanup function
  const historyListenerRef = React.useRef<(() => void) | null>(null);

  // Initialize team ID from URL parameter if available
  React.useEffect(() => {
    if (urlTeamId && urlTeamId !== teamId) {
      setTeamId(urlTeamId);
      setLocalStorageTeamId(urlTeamId);
    }
  }, [urlTeamId, teamId]);

  // Clean up history listener on unmount
  React.useEffect(() => {
    return () => {
      if (historyListenerRef.current) {
        historyListenerRef.current();
      }
    };
  }, []);

  const setTeam = React.useCallback(
    (id: number, cb?: SetTeamCbFn) => {
      setLocalStorageTeamId(id);
      setTeamId(id);
      
      // Clean up previous listener if it exists
      if (historyListenerRef.current) {
        historyListenerRef.current();
      }
      
      // Set up new history listener
      historyListenerRef.current = historyInner.listen(function () {
        setUrlTeamId(id);
      });

      if (cb) {
        cb();
      }
    },
    [setTeamId, historyInner, setUrlTeamId],
  );

  const values = React.useMemo(
    () => ({
      teamId,
      setTeam,
    }),
    [teamId, setTeam],
  );

  React.useEffect(() => {
    if (typeof callback.current === 'function') {
      callback.current();
      callback.current = null;
    }
  }, [callback]);

  return <TeamContext.Provider value={values} {...props} />;
}

function useTeam() {
  const context = React.useContext(TeamContext);
  if (context === undefined) {
    throw new Error(`useTeam must be used within TeamProvider`);
  }

  return context;
}

export default TeamProvider;
export { TeamContext, useTeam };
export type { SetTeamFn, SetTeamCbFn, TeamCtx };
