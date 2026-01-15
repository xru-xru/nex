import { gql, QueryResult, useQuery } from '@apollo/client';
import { useTeam } from 'context/TeamProvider';
import { NexoyaProviderMetricOptions } from '../../types';

type ProviderMetricOptionsQueryResult = {
  portfolioV2: {
    providerMetricOptions: NexoyaProviderMetricOptions[];
  };
};

type Props = {
  portfolioId: number;
  skip?: boolean;
};

const PROVIDER_METRIC_OPTIONS_QUERY = gql`
  query ProviderMetricOptions($teamId: Int!, $portfolioId: Int!) {
    portfolioV2(teamId: $teamId, portfolioId: $portfolioId) {
      providerMetricOptions {
        providerId
        metricOptions {
          name
          metricTypeId
          defaultForFunnelStepType
          providerId
          optimizationTargetTypes
        }
      }
    }
  }
`;

function useProviderMetricOptionsQuery({
  portfolioId,
  skip = false,
}: Props): QueryResult<ProviderMetricOptionsQueryResult, { teamId: number; portfolioId: number }> {
  const { teamId } = useTeam();

  return useQuery<ProviderMetricOptionsQueryResult, { teamId: number; portfolioId: number }>(
    PROVIDER_METRIC_OPTIONS_QUERY,
    {
      skip: !teamId || !portfolioId || skip,
      variables: {
        teamId,
        portfolioId,
      },
    },
  );
}

export { useProviderMetricOptionsQuery, PROVIDER_METRIC_OPTIONS_QUERY };
