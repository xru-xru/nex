import { gql, useQuery } from '@apollo/client';

import { NexoyaMeasurement, NexoyaQueryMeasurementdata_Range_By_Measurement_CollectionArgs } from '../../types/types';
import { KpiInput } from '../../types/types.custom';
import '../../types/types.custom';

import { useTeam } from '../../context/TeamProvider';

import { separateLoading } from '../../utils/graphql';

import {
  COLLECTION_LINKS_FRAGMENT,
  COLLECTION_META_FRAGMENT,
  COLLECTION_PARENT_FRAGMENT,
} from '../collection/fragments';
import {
  MEASUREMENT_DATA_FRAGMENT,
  MEASUREMENT_DATATYPE_FRAGMENT,
  MEASUREMENT_DETAIL_FRAGMENT,
  MEASUREMENT_META_FRAGMENT,
} from './fragments';

// TODO: extract customKpiConfig to parametrized fragment, when function becomes stable, and not experimental as it is now
const SELECTED_KPIS_QUERY = gql`
  query SelectedKpis(
    $team_id: Int!
    $dateFrom: DateTime!
    $dateTo: DateTime!
    $kpisInput: [MeasurementCollectionPairInput]
    $withCollectionParent: Boolean!
    $withCollectionLinks: Boolean!
    $withKpiDataPoints: Boolean!
    $offset: Float
    $first: Float
  ) {
    kpis: measurementdata_range_by_measurement_collection(
      dateFrom: $dateFrom
      dateTo: $dateTo
      measurement_collection: $kpisInput
      team_id: $team_id
    ) {
      collection {
        ...collectionLinks @include(if: $withCollectionLinks)
        ...collectionParent @include(if: $withCollectionParent)
        collection_id
        parent_collection_id
        title
        collectionType {
          name
        }
      }
      ...measurementData @include(if: $withKpiDataPoints)
      ...measurementDatatype
      ...measurementDetail
      ...measurementMeta
      measurement_id
      helpcenter_link
      customKpiConfig {
        custom_kpi_id
        name
        description
        defaultValue
        search {
          query
          provider_id
          measurement_id
          sumOnly
        }
        configType
        kpis(dateFrom: $dateFrom, dateTo: $dateTo, offset: $offset, first: $first) {
          measurement_id
          name
          provider_id
          collection {
            collection_id
            title
            collectionType {
              name
            }
          }
          ...measurementData @include(if: $withKpiDataPoints)
          ...measurementDetail
          ...measurementDatatype
        }
        calc_type
      }
      import_sum_type
      showAsTotal
      calculation_type
    }
  }
  ${COLLECTION_META_FRAGMENT}
  ${COLLECTION_LINKS_FRAGMENT}
  ${COLLECTION_PARENT_FRAGMENT}
  ${MEASUREMENT_DATA_FRAGMENT}
  ${MEASUREMENT_DATATYPE_FRAGMENT}
  ${MEASUREMENT_DETAIL_FRAGMENT}
  ${MEASUREMENT_META_FRAGMENT}
`;
type Options = {
  // TODO: Update from graphql types as soon as reporting is available
  kpis?: KpiInput[];
  skip?: boolean;
  dateFrom?: Date | string;
  dateTo?: Date | string;
  withCollectionLinks?: boolean;
  withCollectionParent?: boolean;
  withCollectionMeta?: boolean;
  withKpiDataPoints?: boolean;
  offset?: number;
  first?: number;
};

// We are using "skip" to not query in case no kpis are provided
function useSelectedKpisQuery({
  kpis = [],
  skip = false,
  dateFrom,
  dateTo,
  withCollectionLinks = false,
  withCollectionParent = false,
  withKpiDataPoints = true,
  offset,
  first = 10,
}: Options = {}): any {
  const { teamId } = useTeam();
  const query = useQuery<NexoyaMeasurement[], NexoyaQueryMeasurementdata_Range_By_Measurement_CollectionArgs>(
    SELECTED_KPIS_QUERY,
    {
      notifyOnNetworkStatusChange: true,
      skip,
      variables: {
        team_id: teamId,
        dateFrom,
        dateTo,
        //@ts-expect-error
        kpisInput: kpis,
        withCollectionLinks,
        withCollectionParent,
        withKpiDataPoints,
        offset,
        first,
      },
    },
  );
  return { ...separateLoading(query) };
}

export { SELECTED_KPIS_QUERY, useSelectedKpisQuery };
