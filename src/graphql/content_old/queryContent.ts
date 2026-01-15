import { gql, useQuery } from '@apollo/client';

import { useTeam } from 'context/TeamProvider';

type Props = {
  content_id: number;
  dateFrom: string;
  dateTo: string;
  skip?: boolean;
};
function useContentQuery({ content_id, dateFrom, dateTo, skip = false }: Props) {
  const CONTENT_QUERY = gql`
  query Content($team_id: Int!, $content_id: Float!) {
  content(team_id: $team_id, content_id: $content_id) {
    title
    content_id
    admin_url
    content_type {
      content_type_id
      name
    }
    provider {
      provider_id
    }
    metadata {
      metadata_key
      metadata_type
      value
      value_lookup
    }
    metrics(dateFrom: "${dateFrom}", dateTo: "${dateTo}") {
      metric_id
      name
      calculation_type
      customKpiConfig {
        configType
      }
      datatype {
        label
        suffix
        symbol
      }
      detail {
        data {
          timestamp
          value
        }
        value
        valueChangePercentage
      }
      __typename
    }
  }
}`;
  const { teamId: team_id } = useTeam();
  return useQuery(CONTENT_QUERY, {
    skip,
    variables: {
      team_id,
      content_id,
    },
  });
}

export { useContentQuery };
