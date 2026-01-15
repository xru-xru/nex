import { useMutation } from '@apollo/client';
import { gql } from '@apollo/client';

import { useTeam } from '../../context/TeamProvider';

const UPDATE_OPTIMIZATION = gql`
  mutation updateOptimization(
    $teamId: Int!
    $portfolioId: Int!
    $optimizationId: Int!
    $title: String
    $description: String
    $dateCreated: DateTime
    $dateArchived: DateTime
    $dateApplied: DateTime
    $startDate: DateTime
    $endDate: DateTime
    $attachment: String
  ) {
    updateOptimization(
      teamId: $teamId
      portfolioId: $portfolioId
      optimizationId: $optimizationId
      title: $title
      description: $description
      dateCreated: $dateCreated
      dateArchived: $dateArchived
      dateApplied: $dateApplied
      startDate: $startDate
      endDate: $endDate
      attachment: $attachment
    )
  }
`;

export function useUpdateOptimization({
  portfolioId,
  optimizationId,
  dateApplied,
}: {
  portfolioId: number;
  optimizationId: number;
  dateApplied: string;
}) {
  const { teamId } = useTeam();
  return useMutation(UPDATE_OPTIMIZATION, {
    variables: {
      teamId,
      portfolioId,
      optimizationId,
      dateApplied,
    },
  });
}
