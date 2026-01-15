import { gql, useMutation } from '@apollo/client';
import { toast } from 'sonner';
import {
  NexoyaAttributionRuleFiltersInput,
  NexoyaCreateAttributionRuleAndDiscoverContentsMutationResponse,
} from '../../types';
import { useTeam } from '../../context/TeamProvider';
import { useContentFilterStore } from '../../store/content-filter';
import { PORTFOLIO_PARENT_CONTENTS_QUERY } from '../content/queryPortfolioContents';
import { buildPortfolioContentFilterVariables } from '../../routes/portfolio/utils/content';
import { ATTRIBUTION_RULES_QUERY } from './queryAttributionRules';

const CREATE_ATTRIBUTION_RULE_MUTATION = gql`
  mutation CreateAttributionRule(
    $filters: AttributionRuleFiltersInput!
    $name: String!
    $portfolioId: Float!
    $teamId: Float!
  ) {
    createAttributionRule(filters: $filters, name: $name, portfolioId: $portfolioId, teamId: $teamId) {
      mappedContentsCount
      clashingDiscoveredContents {
        discoveredContentId
        attributionRules {
          isApplied
          attributionRule {
            attributionRuleId
            name
          }
        }
        content {
          portfolioContentId(portfolioId: $portfolioId)
          contentId
          title
          provider {
            provider_id
            name
          }
          contentType {
            name
          }
          parent {
            title
          }
        }
      }
      attributionRule {
        attributionRuleId
        name
        filters {
          contentFilters {
            value {
              date
              number
              numberArr
              string
              stringArr
            }
            operator
            fieldName
          }
        }
        factors {
          value
          start
          source {
            type
            accountConversionIds
            conversionName
            conversionMetricId
            metricId
          }
        }
      }
    }
  }
`;

type CreateAttributionRuleProps = {
  name: string;
  teamId: number;
  portfolioId: number;
  filters: NexoyaAttributionRuleFiltersInput;
  onCompleted?: (data: NexoyaCreateAttributionRuleAndDiscoverContentsMutationResponse) => void;
};

export function useCreateAttributionRuleMutation({ portfolioId, onCompleted }) {
  const { teamId } = useTeam();
  const filterStore = useContentFilterStore();

  return useMutation<
    {
      createAttributionRule: NexoyaCreateAttributionRuleAndDiscoverContentsMutationResponse;
    },
    CreateAttributionRuleProps
  >(CREATE_ATTRIBUTION_RULE_MUTATION, {
    onError: (error) => {
      console.error(error);
      toast.error(error.message);
    },
    onCompleted: (data) => {
      toast.success(`Attribution rule ${data?.createAttributionRule?.attributionRule?.name} created successfully`, {
        description: `The attribution rule has ${data?.createAttributionRule?.mappedContentsCount} matching contents`,
      });
      onCompleted?.(data);
    },
    refetchQueries: [
      {
        notifyOnNetworkStatusChange: true,
        query: ATTRIBUTION_RULES_QUERY,
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
  });
}
