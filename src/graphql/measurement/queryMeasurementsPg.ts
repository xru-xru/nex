import { gql, useQuery } from '@apollo/client';

import { NexoyaMeasurementConnection, NexoyaQueryMeasurementsPgArgs } from '../../types/types';

import { separateLoading } from '../../utils/graphql';

import { PAGE_INFO_FRAGMENT } from '../fragments';
import { MEASUREMENT_META_FRAGMENT } from './fragments';

const MEASUREMENTS_PG_QUERY = gql`
  query measurementsPg($offset: Float, $first: Float, $after: String, $where: Filter) {
    measurements: measurementsPg(offset: $offset, first: $first, after: $after, where: $where) {
      edges {
        node {
          ...measurementMetaFragment
          helpcenter_link
        }
        cursor
      }
      pageInfo {
        ...pageInfo
      }
    }
  }
  ${PAGE_INFO_FRAGMENT}
  ${MEASUREMENT_META_FRAGMENT}
`;
type Options = {
  after?: string;
  first?: number;
  offset?: number;
  activeProviderIds?: number[];
  search?: string;
};

function useMeasurementsPgQuery({
  after = null,
  first = 20,
  offset = 0,
  activeProviderIds = null,
  search = null,
}: Options = {}): any {
  const query = useQuery<NexoyaMeasurementConnection, NexoyaQueryMeasurementsPgArgs>(MEASUREMENTS_PG_QUERY, {
    notifyOnNetworkStatusChange: true,
    variables: {
      after,
      first,
      offset,
      where: {
        name: search,
        providerIds: activeProviderIds,
      },
    },
  });
  return { ...separateLoading(query) };
}

export { MEASUREMENTS_PG_QUERY, useMeasurementsPgQuery };
