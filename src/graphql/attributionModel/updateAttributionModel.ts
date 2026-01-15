import { gql, useMutation } from '@apollo/client';
import { useTeam } from '../../context/TeamProvider';
import { NexoyaAttributionModel, NexoyaUpdateAttributionModelInput } from '../../types';

const UPDATE_ATTRIBUTION_MODEL_MUTATION = gql`
  mutation UpdateAttributionModel($attributionModelId: String!, $teamId: Int!, $updates: UpdateAttributionModelInput!) {
    updateAttributionModel(attributionModelId: $attributionModelId, teamId: $teamId, updates: $updates) {
      attributionModelId
      name
      status
      teamId
      createdAt
      updatedAt
    }
  }
`;

type UpdateAttributionModelResponse = {
  updateAttributionModel: NexoyaAttributionModel;
};

type Options = {
  onCompleted?: (data: UpdateAttributionModelResponse) => void;
  attributionModelId?: number;
  updates?: NexoyaUpdateAttributionModelInput;
};

function useUpdateAttributionModelMutation({ onCompleted, attributionModelId, updates }: Options = {}) {
  const { teamId } = useTeam();

  return useMutation<
    UpdateAttributionModelResponse,
    { attributionModelId: number; teamId: number; updates: NexoyaUpdateAttributionModelInput }
  >(UPDATE_ATTRIBUTION_MODEL_MUTATION, {
    notifyOnNetworkStatusChange: true,
    onCompleted,
    variables: {
      attributionModelId,
      updates,
      teamId,
    },
  });
}

export { UPDATE_ATTRIBUTION_MODEL_MUTATION, useUpdateAttributionModelMutation };
