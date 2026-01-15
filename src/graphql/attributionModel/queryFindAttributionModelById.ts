import { gql, useQuery } from '@apollo/client';
import { useTeam } from '../../context/TeamProvider';
import { NexoyaAttributionModel } from '../../types';

const FIND_ATTRIBUTION_MODEL_BY_ID_QUERY = gql`
  query FindAttributionModelById($attributionModelId: String!, $teamId: Int!) {
    findAttributionModelById(attributionModelId: $attributionModelId, teamId: $teamId) {
      attributionModelId
      name
      status
      teamId
      createdAt
      updatedAt
      files {
        name
        createdAt
        downloadUrl
        extension
        fileId
        mimeType
        sizeInBytes
      }
    }
  }
`;

type FindAttributionModelByIdResponse = {
  findAttributionModelById: NexoyaAttributionModel;
};

type Options = {
  attributionModelId: number;
  skip?: boolean;
  onCompleted?: (data: FindAttributionModelByIdResponse) => void;
};

function useFindAttributionModelByIdQuery({ attributionModelId, skip, onCompleted }: Options) {
  const { teamId } = useTeam();

  return useQuery<FindAttributionModelByIdResponse>(FIND_ATTRIBUTION_MODEL_BY_ID_QUERY, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
    skip: !teamId || !attributionModelId || skip,
    onCompleted,
    variables: {
      teamId,
      attributionModelId,
    },
  });
}

export { FIND_ATTRIBUTION_MODEL_BY_ID_QUERY, useFindAttributionModelByIdQuery };
