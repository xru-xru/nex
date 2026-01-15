import { DocumentNode, gql, useQuery } from '@apollo/client';

import { NexoyaCollectionConnection, NexoyaQueryCollectionsPgArgs } from '../../types/types';

import { useTeam } from '../../context/TeamProvider';

import { PAGE_INFO_FRAGMENT } from '../fragments';

const COLLECTIONS_QUERY: DocumentNode = gql`
  query Collections($after: String, $limit: Float, $offset: Float, $team_id: Int!, $where: Filter) {
    collections: collectionsPg(after: $after, first: $limit, offset: $offset, team_id: $team_id, where: $where) {
      edges {
        node {
          collection_id
          title
          provider {
            provider_id
            name
          }
          #parent_collection
          parent_collection_id
          collectionType {
            collection_type_id
            name
          }
        }
        cursor
      }
      pageInfo {
        ...pageInfo
      }
    }
  }
  ${PAGE_INFO_FRAGMENT}
`;
type Options = {
  after?: string | null;
  first?: number | null;
  offset?: number | null;
  skip?: boolean;
  where?: any; // TODO: Change when types are updated
};

function useCollectionsQuery({ after = null, first = 10, offset = null, skip = false, where = null }: Options = {}) {
  const { teamId: team_id } = useTeam();
  const query = useQuery<NexoyaCollectionConnection, NexoyaQueryCollectionsPgArgs>(COLLECTIONS_QUERY, {
    notifyOnNetworkStatusChange: true,
    skip,
    variables: {
      after,
      first,
      offset,
      team_id,
      where,
    },
  });
  return query;
}

export { COLLECTIONS_QUERY, useCollectionsQuery };
