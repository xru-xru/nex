import { DocumentNode } from '@apollo/client';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client';

import { NexoyaCollectionConnection, NexoyaQueryCollectionsPgArgs } from '../../types/types';

const COLLECTION_TYPES_QUERY: DocumentNode = gql`
  query CollectionTypes {
    collectionTypes {
      collection_type_id
      name
    }
  }
`;

type Options = {
  skip?: boolean;
};

function useCollectionTypesQuery({ skip = false }: Options = {}) {
  const query = useQuery<NexoyaCollectionConnection, NexoyaQueryCollectionsPgArgs>(COLLECTION_TYPES_QUERY, {
    notifyOnNetworkStatusChange: true,
    skip,
  });
  return query;
}

export { COLLECTION_TYPES_QUERY, useCollectionTypesQuery };
