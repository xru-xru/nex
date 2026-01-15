import React from 'react';
import { TeamContext, SetTeamFn, TeamCtx } from '../../src/context/TeamProvider';

const mockSetTeam: SetTeamFn = (teamId, cb) => {
  // eslint-disable-next-line no-console
  console.log(`Mock setTeam called with teamId: ${teamId}`);
  if (cb) {
    cb();
  }
};

type MockTeamProviderProps = {
  children: React.ReactNode;
  teamId?: number;
};

export const MockTeamProvider = ({ children, teamId = 1 }: MockTeamProviderProps) => {
  const value: TeamCtx = {
    teamId,
    setTeam: mockSetTeam,
  };

  return <TeamContext.Provider value={value}>{children}</TeamContext.Provider>;
};
