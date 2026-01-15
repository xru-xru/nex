import { gql, useQuery } from '@apollo/client';
import { useTeam } from 'context/TeamProvider';
import { NexoyaContentFilterInput, NexoyaContentV2 } from '../../types';

export const FILTERED_CONTENTS_QUERY = gql`
  query FilteredContents(
    $portfolioId: Float!
    $teamId: Float!
    $filters: [ContentFilterInput!]!
    $excludePortfolioContents: Boolean!
    $inPortfolioOnly: Boolean! = false
  ) {
    filterContents(
      portfolioId: $portfolioId
      teamId: $teamId
      filters: $filters
      excludePortfolioContents: $excludePortfolioContents
      inPortfolioOnly: $inPortfolioOnly
    ) {
      portfolioContentId(portfolioId: $portfolioId)
      contentId
      title
      latestMeasurementDataDate
      startDatetime
      endDatetime
      biddingStrategy {
        type
        value
      }
      budget {
        value
        type
        shared
      }
      status
      provider {
        provider_id
        name
      }
      contentType {
        collection_type_id
        name
      }
      parent {
        contentId
        title
      }
    }
  }
`;

type FilterContentsQueryVariables = {
  teamId?: number;
  portfolioId: number;
  excludePortfolioContents?: boolean;
  filters: NexoyaContentFilterInput[];
  inPortfolioOnly?: boolean;
  skip?: boolean;
  onCompleted?: (data: { filterContents: NexoyaContentV2[] }) => void;
  onError?: (error: Error) => void;
};

export function useFilteredContentsQuery({
  portfolioId,
  filters,
  skip,
  onCompleted,
  excludePortfolioContents,
  inPortfolioOnly,
}: FilterContentsQueryVariables) {
  const { teamId } = useTeam();

  const query = useQuery<
    {
      filterContents: NexoyaContentV2[];
    },
    FilterContentsQueryVariables
  >(FILTERED_CONTENTS_QUERY, {
    variables: {
      teamId,
      portfolioId,
      filters,
      excludePortfolioContents,
      inPortfolioOnly,
    },
    skip,
    onCompleted,
  });

  return query;
}
