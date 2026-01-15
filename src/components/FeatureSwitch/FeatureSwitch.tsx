import { get } from 'lodash';

import { useTeamQuery } from '../../graphql/team/queryTeam';

import ErrorMessage from '../ErrorMessage';
import PageLoading from '../PageLoading';

type Props = {
  features: string[];
  renderOld: () => any;
  renderNew: () => any;
  renderLoadingIndicator?: boolean;
};

function FeatureSwitch({ features, renderOld, renderNew, renderLoadingIndicator = true }: Props) {
  const teamQuery = useTeamQuery();
  const loading = teamQuery.loading;
  const error = teamQuery.error;
  const featureFlags = get(teamQuery, 'data.team.featureFlags', []);
  const isFeatureThere =
    featureFlags && featureFlags.some((featureFlag) => features.includes(featureFlag.name) && featureFlag.status);
  if (loading && renderLoadingIndicator) return <PageLoading />;
  else if (error) return <ErrorMessage error={error} />;
  else return isFeatureThere ? renderNew() : renderOld();
}

export default FeatureSwitch;
