import { gql } from '@apollo/client';

// TODO: New but not completely clean
const KPI_DATA_POINT_FRAGMENT = gql`
  fragment dataPoint on MeasurementData {
    value
    timestamp
  }
`;
const MEASUREMENT_DATA_FRAGMENT = gql`
  fragment measurementData on Measurement {
    lowerIsBetter
    detail {
      data {
        timestamp
        value
        valueSumUp
      }
    }
  }
`;
const MEASUREMENT_META_FRAGMENT = gql`
  fragment measurementMeta on Measurement {
    description
    measurement_id
    name
    provider_id
    isFavorite
  }
`;
const MEASUREMENT_DATATYPE_FRAGMENT = gql`
  fragment measurementDatatype on Measurement {
    datatype(team_id: $team_id) {
      label
      suffix
      symbol
    }
  }
`;
const MEASUREMENT_DETAIL_FRAGMENT = gql`
  fragment measurementDetail on Measurement {
    lowerIsBetter
    detail {
      value
      valueSum
      valueChangePercentage
      valueSumUptoEndDate
    }
  }
`;
const CUSTOM_KPI_FRAGMENT = gql`
  fragment customKpi on Measurement {
    customKpiConfig {
      custom_kpi_id
      name
      description
      kpis {
        measurement_id
        name
        provider_id
        collection {
          collection_id
          title
        }
        ...measurementDetail
      }
      calc_type
    }
  }
  ${MEASUREMENT_DETAIL_FRAGMENT}
`;
const MEASUREMENT_GOAL_FRAGMENT = gql`
  fragment measurementGoal on Measurement {
    goal
    lowerIsBetter
  }
`;
export {
  KPI_DATA_POINT_FRAGMENT,
  MEASUREMENT_DATA_FRAGMENT,
  MEASUREMENT_DATATYPE_FRAGMENT,
  MEASUREMENT_DETAIL_FRAGMENT,
  MEASUREMENT_GOAL_FRAGMENT,
  MEASUREMENT_META_FRAGMENT,
  CUSTOM_KPI_FRAGMENT,
};
