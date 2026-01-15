import { gql } from '@apollo/client';

import { COLLECTION_META_FRAGMENT, COLLECTION_PARENT_FRAGMENT } from '../collection/fragments';
import {
  MEASUREMENT_DATATYPE_FRAGMENT,
  MEASUREMENT_DATA_FRAGMENT,
  MEASUREMENT_DETAIL_FRAGMENT,
  MEASUREMENT_META_FRAGMENT,
} from '../kpi/fragments';
import { PROVIDER_META_FRAGMENT } from '../provider/fragments';
import { USER_META_FRAGMENT } from '../user/fragments';

const REPORT_META_FRAGMENT = gql`
  fragment reportMeta on Report {
    report_id
    name
    description
    report_type
  }
`;

const REPORT_TIMESTAMPS_FRAGMENT = gql`
  fragment reportTimestamps on Report {
    updated_at
  }
`;

const REPORT_DATERANGE_FRAGMENT = gql`
  fragment reportDateRange on Report {
    dateRange {
      rangeType
      customRange {
        dateFrom
        dateTo
      }
    }
  }
`;

const REPORT_USER_FRAGMENT = gql`
  fragment reportUser on Report {
    updatedBy {
      ...userMeta
    }
  }
  ${USER_META_FRAGMENT}
`;

// TODO: This is kind of weird. Needs to be refactored to work bette.r
const REPORT_PROVIDER_FRAGMENT = gql`
  fragment provider on Measurement {
    provider {
      ...providerMeta
    }
  }
  ${PROVIDER_META_FRAGMENT}
`;
const REPORT_KPIS_FRAGMENT = gql`
  fragment reportKpis on Report {
    kpis {
      collection {
        ...collectionMeta
        ...collectionParent
      }
      ...measurementData
      ...measurementDatatype
      ...measurementDetail
      ...measurementMeta
      ...provider
    }
  }
  ${COLLECTION_META_FRAGMENT}
  ${MEASUREMENT_DATA_FRAGMENT}
  ${MEASUREMENT_DATATYPE_FRAGMENT}
  ${MEASUREMENT_DETAIL_FRAGMENT}
  ${MEASUREMENT_META_FRAGMENT}
  ${COLLECTION_PARENT_FRAGMENT}
  ${REPORT_PROVIDER_FRAGMENT}
`;

export {
  REPORT_DATERANGE_FRAGMENT,
  REPORT_META_FRAGMENT,
  REPORT_TIMESTAMPS_FRAGMENT,
  REPORT_USER_FRAGMENT,
  REPORT_KPIS_FRAGMENT,
};
