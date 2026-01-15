import React from 'react';

import { useQuery } from '@apollo/client';
import { datadogRum } from '@datadog/browser-rum';
import { get } from 'lodash';
import { NumberParam, useQueryParam } from 'use-query-params';

import { NexoyaTeam, NexoyaTeamMember, NexoyaUser } from '../types';

import { InitContext, InitCtx } from '../context/InitProvider';
import { useTeam } from '../context/TeamProvider';
import { INITIAL_QUERY } from '../graphql/initialization/queryInitialData';

import { extractRoleString } from '../utils/string';
import useUserStore from '../store/user';

type InitialLoad = {
  error: Error | null | undefined;
  user: NexoyaUser;
};

export default function useInitialQuery(loggedIn: boolean): InitialLoad {
  const { teamId, setTeam } = useTeam();

  const { setUserSuccess } = React.useContext<InitCtx>(InitContext);
  const { setUser, setIsSupportUser } = useUserStore();

  const [urlTeamId, setUrlTeamId] = useQueryParam('team_id', NumberParam);
  const { data, error } = useQuery(INITIAL_QUERY, {
    variables: {
      teamId,
      lang: 'en_us',
    },
    skip: !loggedIn,
  });

  const user = get(data, 'user', {});
  const teams = get(data, 'user.teams', []);
  // Comment: disable amplitude logs if nexoya user
  React.useEffect(() => {
    const userRole = teams?.find((t) => t?.team_id === teamId)?.members?.find((m) => m.user_id === user.user_id)
      ?.role?.name;
    if (user?.email && userRole) {
      datadogRum.setUser({
        id: user?.user_id?.toString(),
        name: user?.firstname + ' ' + user?.lastname,
        email: user?.email,
        team: teamId,
        role: extractRoleString(userRole),
      });
    }
  }, [user, teamId, teams]);
  // Comment: Set user login state
  // Comment: Set team ID
  // Comment: Redirect if start page
  React.useEffect(() => {
    if (teams.length === 0) {
      return;
    }

    const requestedTeamId = urlTeamId || teamId;
    const userNotPartOfTeam = !teams.some((t) => t.team_id === requestedTeamId);
    setUserSuccess(user);

    setUser(user);
    const isSupportUser = teams
      ?.find((t: NexoyaTeam) => t?.team_id === teamId)
      ?.members?.find((m: NexoyaTeamMember) => m.user_id === user.user_id)
      ?.role?.name?.includes('support');

    setIsSupportUser(isSupportUser);
    const teamIdToSet = userNotPartOfTeam ? teams[0].team_id : requestedTeamId;
    setTeam(teamIdToSet);
    setUrlTeamId(teamIdToSet);
  }, [teams, user, setUserSuccess, urlTeamId, setTeam, teamId, setUrlTeamId]);
  return {
    error,
    user,
  };
}
