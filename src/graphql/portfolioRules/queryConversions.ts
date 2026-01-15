import { gql, useQuery } from '@apollo/client';
import { useTeam } from 'context/TeamProvider';
import { NexoyaConversion } from '../../types';

export const LIST_CONVERSIONS_QUERY = gql`
  query ListConversions($adAccountContentIds: [Float!]!, $teamId: Float!) {
    listConversions(adAccountContentIds: $adAccountContentIds, teamId: $teamId) {
      accountConversionIds
      conversionName
    }
  }
`;

type ListConversionsQueryVariables = {
  adAccountContentId: number;
  teamId: number;
};

export function useListConversionsQuery({ adAccountContentId, skip }: { adAccountContentId: number; skip?: boolean }) {
  const { teamId } = useTeam();

  const query = useQuery<
    {
      listConversions: NexoyaConversion[];
    },
    ListConversionsQueryVariables
  >(LIST_CONVERSIONS_QUERY, {
    variables: {
      adAccountContentId,
      teamId,
    },
    skip,
  });

  return query;
}
