import { gql, useQuery } from '@apollo/client';

import { useTeam } from 'context/TeamProvider';

type Props = {
  collection_id: number;
  dateFrom: Date | string;
  dateTo: Date | string;
  after?: string;
  first?: number;
  skip?: boolean;
  search?: string;
};

function useChildCollectionQuery({ collection_id, dateFrom, dateTo, after, first, skip = false, search }: Props) {
  const COLLECTION_QUERY = gql`
    query childCollectionsPg(
      $team_id: Int!, 
      $parent_collection_id: Float!, 
      $offset: Float, 
      $first: Float, 
      $after: String
      $where: SearchFilter
    )  {
      childCollectionsPg(team_id: $team_id, parent_collection_id: $parent_collection_id, offset: $offset, first: $first, after: $after, where: $where) {
        edges {
          cursor
          node {
            collection_id
            title
            collectionType {
              collection_type_id
            }
            provider {
              provider_id
            }
            measurements(dateFrom: "${dateFrom}", dateTo: "${dateTo}") {
              measurement_id
              name
              datatype {
                symbol
                format
                suffix
              }
              detail {
                value
                valueChangePercentage
              }
            }
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }`;
  const { teamId: team_id } = useTeam();
  return useQuery(COLLECTION_QUERY, {
    skip,
    variables: {
      team_id,
      after,
      first,
      parent_collection_id: collection_id,
      where: {
        search,
      },
    },
  });
}

export { useChildCollectionQuery };
