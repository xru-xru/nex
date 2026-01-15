import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client';

import { useTeam } from '../../context/TeamProvider';

import { COLLECTION_META_FRAGMENT } from '../collection/fragments';
import { MEASUREMENT_DATATYPE_FRAGMENT, MEASUREMENT_DETAIL_FRAGMENT, MEASUREMENT_META_FRAGMENT } from './fragments';

const DASHBOARD_KPIS_QUERY = gql`
  query DashboardKpis($team_id: Int!, $dateFrom: DateTime, $dateTo: DateTime) {
    team(team_id: $team_id) {
      kpis: measurement_selected(dateFrom: $dateFrom, dateTo: $dateTo) {
        collection {
          ...collectionMeta
        }
        ...measurementDatatype
        ...measurementDetail
        ...measurementMeta
      }
    }
  }
  ${COLLECTION_META_FRAGMENT}
  ${MEASUREMENT_DATATYPE_FRAGMENT}
  ${MEASUREMENT_DETAIL_FRAGMENT}
  ${MEASUREMENT_META_FRAGMENT}
`;
type Options = {
  dateFrom?: string | Date;
  dateTo?: string | Date;
};

function useDashboardKpisQuery({ dateFrom, dateTo }: Options) {
  const { teamId } = useTeam();
  const query = useQuery(DASHBOARD_KPIS_QUERY, {
    variables: {
      team_id: teamId,
      dateFrom,
      dateTo,
    },
  });
  return query;
}

export { DASHBOARD_KPIS_QUERY, useDashboardKpisQuery };
