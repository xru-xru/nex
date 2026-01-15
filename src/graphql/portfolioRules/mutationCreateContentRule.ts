import { gql, useMutation } from '@apollo/client';
import { toast } from 'sonner';
import { NexoyaContentRuleFiltersInput, NexoyaCreateContentRuleMutationResponse } from '../../types';
import { CONTENT_RULES_QUERY } from './queryContentRules';
import { useTeam } from '../../context/TeamProvider';
import { PORTFOLIO_PARENT_CONTENTS_QUERY } from '../content/queryPortfolioContents';
import { buildPortfolioContentFilterVariables } from '../../routes/portfolio/utils/content';
import { useContentFilterStore } from '../../store/content-filter';
import useTabNewUpdates from '../../hooks/useTabNewUpdates';

const CREATE_CONTENT_GROUP_MUTATION = gql`
  mutation CreateContentRule(
    $filters: ContentRuleFiltersInput!
    $name: String!
    $portfolioId: Float!
    $teamId: Float!
    $contentIdsToAccept: [Float!]!
  ) {
    createContentRule(
      filters: $filters
      name: $name
      portfolioId: $portfolioId
      teamId: $teamId
      contentIdsToAccept: $contentIdsToAccept
    ) {
      contentRule {
        contentRuleId
        name
        filters {
          adAccountIds
          providerId
        }
        funnelStepMappings {
          funnelStepId
          mapping {
            conversions {
              accountConversionIds
              conversionName
              metricId
            }
            type
            metricId
            analyticsPropertyId
            utmParams {
              type
              values
            }
          }
        }
      }
      discoveredContents {
        discoveredContentId
        content {
          title
          contentId
        }
        contentRules {
          isApplied
          contentRule {
            contentRuleId
            name
          }
        }
      }
    }
  }
`;

type CreateContentRuleProps = {
  name: string;
  teamId: number;
  portfolioId: number;
  providerId: number;
  adAccountId?: number;
  onCompleted?: (data: NexoyaCreateContentRuleMutationResponse) => void;
  filters: NexoyaContentRuleFiltersInput;
};

export function useCreateContentRuleMutation({ portfolioId, onCompleted }) {
  const { teamId } = useTeam();
  const filterStore = useContentFilterStore();
  const { refreshCountDiscoveredContents } = useTabNewUpdates(portfolioId);

  return useMutation<{ createContentRule: NexoyaCreateContentRuleMutationResponse }, CreateContentRuleProps>(
    CREATE_CONTENT_GROUP_MUTATION,
    {
      onError: (error) => {
        console.error(error);
        toast.error(error.message);
      },
      onCompleted: (data) => {
        toast.success(`Content rule ${data?.createContentRule?.contentRule?.name} created successfully`, {
          description: `The content rule has ${data?.createContentRule?.discoveredContents?.length} matching contents`,
        });
        refreshCountDiscoveredContents();
        onCompleted(data);
      },
      refetchQueries: [
        {
          notifyOnNetworkStatusChange: true,
          query: CONTENT_RULES_QUERY,
          variables: {
            teamId,
            portfolioId,
          },
          fetchPolicy: 'network-only',
        },
        {
          query: PORTFOLIO_PARENT_CONTENTS_QUERY,
          variables: buildPortfolioContentFilterVariables(teamId, portfolioId, filterStore),
        },
      ],
    },
  );
}
