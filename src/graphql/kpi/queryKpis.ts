import { gql, useQuery } from '@apollo/client';

import { useTeam } from '../../context/TeamProvider';

import { separateLoading } from '../../utils/graphql';

import { COLLECTION_META_FRAGMENT, COLLECTION_PARENT_FRAGMENT } from '../collection/fragments';
import { PAGE_INFO_FRAGMENT } from '../fragments';
import { MEASUREMENT_DATATYPE_FRAGMENT, MEASUREMENT_DETAIL_FRAGMENT, MEASUREMENT_META_FRAGMENT } from './fragments';

const KPIS_QUERY = gql`
  query Kpis(
    $after: String
    $collections: [Float]
    $dateFrom: DateTime
    $dateTo: DateTime
    $limit: Float
    $measurements: [Int]
    $offset: Float
    $parentOnly: Boolean
    $providers: [Int]
    $team_id: Int!
    $where: Filter
  ) {
    kpis: measurementRangeSearchPg(
      after: $after
      collections: $collections
      dateFrom: $dateFrom
      dateTo: $dateTo
      first: $limit
      measurements: $measurements
      offset: $offset
      parentOnly: $parentOnly
      providers: $providers
      team_id: $team_id
      where: $where
    ) {
      edges {
        node {
          customKpiConfig {
            configType
          }
          collection {
            ...collectionMeta
            ...collectionParent
          }
          ...measurementMeta
          ...measurementDetail
          ...measurementDatatype
        }
        cursor
      }
      pageInfo {
        ...pageInfo
      }
    }
  }
  ${MEASUREMENT_META_FRAGMENT}
  ${MEASUREMENT_DETAIL_FRAGMENT}
  ${MEASUREMENT_DATATYPE_FRAGMENT}
  ${COLLECTION_PARENT_FRAGMENT}
  ${COLLECTION_META_FRAGMENT}
  ${PAGE_INFO_FRAGMENT}
`;
type Options = {
  after?: string;
  collections?: number[];
  dateFrom?: Date | string;
  dateTo?: Date | string;
  limit?: number;
  measurements?: number[];
  offset?: number;
  providers?: number[];
  search?: string;
  sum?: boolean;
  isActive?: boolean;
};

function useKpisQuery({
  after = null,
  collections = [],
  dateFrom = null,
  dateTo = null,
  limit = 10,
  measurements = [],
  offset = null,
  providers = [],
  search = null,
  sum = null,
  isActive = null,
}: Options) {
  const { teamId } = useTeam();
  const query = useQuery(KPIS_QUERY, {
    notifyOnNetworkStatusChange: true,
    variables: {
      after,
      collections: collections.length > 0 ? collections : null,
      dateFrom,
      dateTo,
      limit,
      measurements: measurements.length > 0 ? measurements : null,
      offset,
      parentOnly: sum,
      providers: providers.length > 0 ? providers : null,
      team_id: teamId,
      where: {
        includeChildren: null,
        lang: null,
        name: search,
        title: search,
        isActive,
      },
    },
  });
  return { ...separateLoading(query) };
}

export { KPIS_QUERY, useKpisQuery };
