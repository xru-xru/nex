import { gql, useMutation } from '@apollo/client';
import {
  NexoyaAttributionModel,
  NexoyaAttributionModelChannelFilterInput,
  NexoyaAttributionModelGa4FiltersInput,
} from '../../types';

const CREATE_ATTRIBUTION_MODEL_MUTATION = gql`
  mutation CreateAttributionModel(
    $channelFilters: [AttributionModelChannelFilterInput!]!
    $exportStart: Date!
    $ga4Filters: AttributionModelGa4FiltersInput!
    $name: String!
    $targetMetric: String!
    $teamId: Int!
  ) {
    createAttributionModel(
      channelFilters: $channelFilters
      exportStart: $exportStart
      ga4Filters: $ga4Filters
      name: $name
      targetMetric: $targetMetric
      teamId: $teamId
    ) {
      attributionModelId
      name
      status
      teamId
      createdAt
      updatedAt
    }
  }
`;

type CreateAttributionModelProps = {
  channelFilters: NexoyaAttributionModelChannelFilterInput[];
  exportStart: string;
  ga4Filters: NexoyaAttributionModelGa4FiltersInput;
  name: string;
  targetMetric: string;
  teamId: number;
};

export function useCreateAttributionModelMutation() {
  return useMutation<
    {
      createAttributionModel: NexoyaAttributionModel;
    },
    CreateAttributionModelProps
  >(CREATE_ATTRIBUTION_MODEL_MUTATION);
}
