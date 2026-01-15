import { gql, MutationTuple, useMutation } from '@apollo/client';
import { useTeam } from '../../context/TeamProvider';
import { FIND_ATTRIBUTION_MODEL_BY_ID_QUERY } from './queryFindAttributionModelById';

const DELETE_ATTRIBUTION_MODEL_FILE_MUTATION = gql`
  mutation deleteAttributionModelFile($teamId: Int!, $attributionModelId: String!, $attributionModelFileId: Int!) {
    deleteAttributionModelFile(
      teamId: $teamId
      attributionModelId: $attributionModelId
      attributionModelFileId: $attributionModelFileId
    )
  }
`;

type Variables = {
  attributionModelFileId: number;
};

type Response = {
  deleteAttributionModelFile: boolean;
};

type Options = {
  attributionModelId: string;
  onCompleted: (data: Response) => void;
  onError: (error: Error) => void;
};

const useDeleteAttributionModelFile = ({
  attributionModelId,
  onCompleted,
  onError,
}: Options): MutationTuple<Response, Variables> => {
  const { teamId } = useTeam();

  // Hook to perform mutation
  const mutation = useMutation<Response, Variables>(DELETE_ATTRIBUTION_MODEL_FILE_MUTATION, {
    notifyOnNetworkStatusChange: true,
    awaitRefetchQueries: true,
    onError,
    onCompleted,
    refetchQueries: [
      {
        query: FIND_ATTRIBUTION_MODEL_BY_ID_QUERY,
        variables: {
          teamId,
          attributionModelId,
        },
      },
    ],
    variables: {
      // @ts-ignore
      teamId,
      attributionModelId,
    },
  });

  return mutation;
};

export { DELETE_ATTRIBUTION_MODEL_FILE_MUTATION, useDeleteAttributionModelFile };
