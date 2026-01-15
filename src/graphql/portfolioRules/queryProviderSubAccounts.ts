import { gql, useQuery } from '@apollo/client';
import { useTeam } from 'context/TeamProvider';
import { NexoyaContentFilterInput, NexoyaContentV2 } from '../../types';

export const PROVIDER_SUB_ACCOUNTS_QUERY = gql`
  query ProviderSubAccounts(
    $portfolioId: Float!
    $teamId: Float!
    $filters: [ContentFilterInput!]!
    $excludePortfolioContents: Boolean!
  ) {
    filterContents(
      portfolioId: $portfolioId
      teamId: $teamId
      filters: $filters
      excludePortfolioContents: $excludePortfolioContents
    ) {
      contentId
      title
      contentType {
        collection_type_id
        name
      }
      provider {
        provider_id
        name
      }
    }
  }
`;

type ContentRuleQueryVariables = {
  teamId?: number;
  portfolioId: number;
  providerId?: number;
  excludePortfolioContents?: boolean;
  filters: NexoyaContentFilterInput[];
  skip?: boolean;
  onCompleted?: (data: { filterContents: NexoyaContentV2[] }) => void;
};

export function useProviderSubAccountsQuery({
  portfolioId,
  filters,
  providerId,
  skip,
  onCompleted,
  excludePortfolioContents,
}: ContentRuleQueryVariables) {
  const { teamId } = useTeam();

  const query = useQuery<
    {
      filterContents: NexoyaContentV2[];
    },
    ContentRuleQueryVariables
  >(PROVIDER_SUB_ACCOUNTS_QUERY, {
    variables: {
      teamId,
      portfolioId,
      providerId,
      filters,
      excludePortfolioContents,
    },
    skip,
    onCompleted,
  });

  return query;
}
