import { get } from 'lodash';

import { useTeamQuery } from '../graphql/team/queryTeam';

// TODO: Remove in favor of src/components/FeatureSwitch/FeatureSwitch.js
// Note: used temporarily for portfolio v1 / portfolio v2 hack
function useFeatureFlag() {
  const teamQuery = useTeamQuery();
  const featureFlags = get(teamQuery, 'data.team.featureFlags', []) || [];
  return {
    featureFlags: featureFlags.map((ff) => ff.name),
  };
}

export default useFeatureFlag;
