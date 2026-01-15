import { gql, useMutation } from '@apollo/client';
import { useTeam } from '../../context/TeamProvider';

const DELETE_ATTRIBUTION_MODEL_MUTATION = gql`
  mutation DeleteAttributionModel($attributionModelId: String!, $teamId: Int!) {
    deleteAttributionModel(attributionModelId: $attributionModelId, teamId: $teamId)
  }
`;

type DeleteAttributionModelResponse = {
  deleteAttributionModel: boolean;
};

type Options = {
  onCompleted?: (data: DeleteAttributionModelResponse) => void;
};

function useDeleteAttributionModelMutation({ onCompleted }: Options = {}) {
  const { teamId } = useTeam();

  return useMutation<DeleteAttributionModelResponse>(DELETE_ATTRIBUTION_MODEL_MUTATION, {
    notifyOnNetworkStatusChange: true,
    onCompleted,
    variables: {
      teamId,
    },
  });
}

export { DELETE_ATTRIBUTION_MODEL_MUTATION, useDeleteAttributionModelMutation };
