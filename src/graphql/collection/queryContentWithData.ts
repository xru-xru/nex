import { DocumentNode } from '@apollo/client';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client';

import { NexoyaCollectionConnection, NexoyaQueryContentWithDataPgArgs } from '../../types/types';

import { useTeam } from '../../context/TeamProvider';

import { PAGE_INFO_FRAGMENT } from '../fragments';

const CONTENT_WITH_DATA_QUERY: DocumentNode = gql`
  query ContentWithData($after: String, $first: Float, $offset: Float, $team_id: Int!, $where: Filter) {
    contentWithData: contentWithDataPg(
      after: $after
      first: $first
      offset: $offset
      team_id: $team_id
      where: $where
    ) {
      edges {
        node {
          collection_id
          title
          provider {
            provider_id
            name
          }
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
  search?: string | null;
  skip?: boolean;
  where?: any;
};

function useContentWithDataQuery({ after = null, first = 10, offset = null, skip = false, where = null }: Options) {
  const { teamId: team_id } = useTeam();
  const query = useQuery<NexoyaCollectionConnection, NexoyaQueryContentWithDataPgArgs>(CONTENT_WITH_DATA_QUERY, {
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

export { CONTENT_WITH_DATA_QUERY, useContentWithDataQuery };
