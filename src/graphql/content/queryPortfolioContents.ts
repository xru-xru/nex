import { gql, QueryResult, useQuery } from '@apollo/client';
import { useTeam } from 'context/TeamProvider';
import {
  NexoyaPortfolioParentContentConnection,
  NexoyaPortfolioParentContentsSortField,
  NexoyaSortOrder,
} from '../../types';

type PortfolioContentsQueryResult = {
  portfolioV2: {
    portfolioParentContents: NexoyaPortfolioParentContentConnection;
  };
};

type PortfolioContentsQueryVariables = {
  teamId: number;
  portfolioId: number;
  after?: string;
  before?: string;
  first?: number;
  last?: number;
  portfolioContentFilter?: {
    attributionRuleIds?: number[];
    contentRuleIds?: number[];
    impactGroupIds?: number[];
    impactGroupRuleIds?: number[];
    isIncludedInOptimization?: boolean;
    isRuleManaged?: boolean;
    labelIds?: number[];
    providerIds?: number[];
    titleContains?: string;
  };
  sortField?: string;
  sortOrder?: 'ASC' | 'DESC';
};

type Props = {
  portfolioId: number;
  after?: string;
  before?: string;
  first?: number;
  last?: number;
  portfolioContentFilter?: {
    attributionRuleIds?: number[];
    contentRuleIds?: number[];
    impactGroupIds?: number[];
    impactGroupRuleIds?: number[];
    isIncludedInOptimization?: boolean;
    isRuleManaged?: boolean;
    labelIds?: number[];
    providerIds?: number[];
    titleContains?: string;
  };
  sortField?: NexoyaPortfolioParentContentsSortField;
  sortOrder?: NexoyaSortOrder;
  skip?: boolean;
  onCompleted?: (data: PortfolioContentsQueryResult) => void;
};

const PORTFOLIO_PARENT_CONTENTS_QUERY = gql`
  query PortfolioContents(
    $teamId: Int!
    $portfolioId: Int!
    $after: String
    $before: String
    $first: Int
    $last: Int
    $portfolioContentFilter: PortfolioContentFilterInput
    $sortField: PortfolioParentContentsSortField
    $sortOrder: SortOrder
  ) {
    portfolioV2(teamId: $teamId, portfolioId: $portfolioId) {
      portfolioParentContents(
        after: $after
        before: $before
        first: $first
        last: $last
        portfolioContentFilter: $portfolioContentFilter
        sortField: $sortField
        sortOrder: $sortOrder
      ) {
        edges {
          cursor
          node {
            portfolioContentId
            content {
              contentId
              title
              biddingStrategy {
                type
                value
              }
              provider {
                provider_id
              }
              contentType {
                collection_type_id
                name
              }
            }
            budgetMin
            budgetMax
            isIncludedInOptimization

            discoveredContent {
              attributionRules {
                isApplied
                attributionRule {
                  name
                  attributionRuleId
                }
              }
              impactGroupRules {
                isApplied
                impactGroupRule {
                  name
                  impactGroupId
                  impactGroupRuleId
                }
              }
              contentRules {
                isApplied
                contentRule {
                  name
                  contentRuleId
                  funnelStepMappings {
                    funnelStepId
                    mapping {
                      type
                      conversions {
                        accountConversionIds
                        conversionName
                        metricId
                      }
                      analyticsPropertyId
                      metricId
                      utmParams {
                        values
                        type
                      }
                    }
                  }
                }
              }
              discoveredContentId
              status
            }
            impactGroup {
              impactGroupId
              name
            }
            label {
              labelId
              name
            }
            funnelSteps {
              funnelStep {
                funnelStepId
                title
                type
              }
              sourcePortfolioChildContent {
                content {
                  contentId
                }
                portfolioContentId
                funnelSteps {
                  metric {
                    metricTypeId
                    name
                  }
                  funnelStep {
                    funnelStepId
                    type
                  }
                }
              }
              metric {
                metricTypeId
                name
              }
            }
            childContents {
              portfolioContentId
              content {
                contentId
                title
                contentType {
                  collection_type_id
                  name
                }
                provider {
                  provider_id
                }
              }
              funnelSteps {
                funnelStep {
                  funnelStepId
                  title
                  type
                }
                metric {
                  metricTypeId
                  name
                }
              }
            }
          }
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
        totalPages
      }
    }
  }
`;

function usePortfolioParentContentsQuery({
  portfolioId,
  after,
  before,
  first,
  last,
  portfolioContentFilter,
  sortField,
  sortOrder,
  skip = false,
  onCompleted,
}: Props): QueryResult<PortfolioContentsQueryResult, PortfolioContentsQueryVariables> {
  const { teamId } = useTeam();

  return useQuery<PortfolioContentsQueryResult, PortfolioContentsQueryVariables>(PORTFOLIO_PARENT_CONTENTS_QUERY, {
    skip: !teamId || !portfolioId || skip,
    fetchPolicy: 'cache-and-network',
    onCompleted,

    variables: {
      teamId,
      portfolioId,
      after,
      before,
      first,
      last,
      portfolioContentFilter,
      sortField,
      sortOrder,
    },
  });
}

export { usePortfolioParentContentsQuery, PORTFOLIO_PARENT_CONTENTS_QUERY };
