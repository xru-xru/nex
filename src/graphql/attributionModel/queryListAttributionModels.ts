import { gql, useQuery } from '@apollo/client';
import { useTeam } from '../../context/TeamProvider';
import { NexoyaAttributionModelConnection, NexoyaListAttributionModelsFilters } from '../../types';

const LIST_ATTRIBUTION_MODELS_QUERY = gql`
  query ListAttributionModels(
    $after: String
    $before: String
    $filters: ListAttributionModelsFilters!
    $first: Int
    $last: Int
    $teamId: Int!
  ) {
    listAttributionModels(
      after: $after
      before: $before
      filters: $filters
      first: $first
      last: $last
      teamId: $teamId
    ) {
      totalPages
      pageInfo {
        startCursor
        hasNextPage
        hasPreviousPage
        endCursor
      }
      edges {
        cursor
        node {
          attributionModelId
          name
          status
          teamId
          createdAt
          updatedAt
          exportStart
          exportEnd
          targetMetric
          channelFilters {
            providerId
            adAccountIds
            conversions {
              conversionId
              metricAlias
            }
          }
          files {
            createdAt
            downloadUrl
            extension
            fileId
            mimeType
            sizeInBytes
          }
        }
      }
    }
  }
`;

type ListAttributionModelsResponse = {
  listAttributionModels: NexoyaAttributionModelConnection;
};

type Options = {
  after?: string;
  before?: string;
  first?: number;
  last?: number;
  filters: NexoyaListAttributionModelsFilters;
  skip?: boolean;
  onCompleted?: (data: ListAttributionModelsResponse) => void;
};

function useListAttributionModelsQuery({ after, before, first, last, filters, skip, onCompleted }: Options) {
  const { teamId } = useTeam();

  return useQuery<ListAttributionModelsResponse>(LIST_ATTRIBUTION_MODELS_QUERY, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
    skip: !teamId || !filters || skip,
    onCompleted,
    variables: {
      teamId,
      after,
      before,
      first,
      last,
      filters,
    },
  });
}

export { LIST_ATTRIBUTION_MODELS_QUERY, useListAttributionModelsQuery };
