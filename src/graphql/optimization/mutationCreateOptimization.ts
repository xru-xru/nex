import { gql, useMutation } from '@apollo/client';

import { useTeam } from '../../context/TeamProvider';

import { ACTIVE_OPTIMIZATION_FRAGMENT } from './fragments';
import { ACTIVE_OPTIMIZATION_QUERY } from './queryActiveOptimization';
import usePortfolioMetaStore from '../../store/portfolio-meta';
import { PORTFOLIO_FEATURE_FLAGS } from '../../constants/featureFlags';

const CREATE_OPTIMIZATION_REQUEST = gql`
  mutation createOptimization(
    $teamId: Int!
    $portfolioId: Int!
    $end: Date!
    $skipCustomImportCheck: Boolean
    $ignoreWeekdays: [Weekday!]
  ) {
    createOptimization(
      teamId: $teamId
      portfolioId: $portfolioId
      end: $end
      skipCustomImportCheck: $skipCustomImportCheck
      ignoreWeekdays: $ignoreWeekdays
    ) {
      ...ActiveOptimization
    }
  }
  ${ACTIVE_OPTIMIZATION_FRAGMENT}
`;

function useCreateOptimization({
  portfolioId,
  end,
  skipCustomImportCheck,
  ignoreWeekdays,
}: {
  portfolioId: number;
  end: string;
  skipCustomImportCheck?: boolean;
  ignoreWeekdays?: string[];
}) {
  const { teamId } = useTeam();
  const { portfolioMeta } = usePortfolioMetaStore();
  
  const isIgnoreWeekdaysFeatureEnabled = portfolioMeta?.featureFlags?.some(
    (ff) => ff.name === PORTFOLIO_FEATURE_FLAGS.IGNORE_WEEKDAYS && ff.status,
  );
  
  return useMutation(CREATE_OPTIMIZATION_REQUEST, {
    variables: {
      teamId,
      portfolioId,
      end,
      skipCustomImportCheck,
      ...(isIgnoreWeekdaysFeatureEnabled && ignoreWeekdays && { ignoreWeekdays }),
    },
    refetchQueries: [
      {
        query: ACTIVE_OPTIMIZATION_QUERY,
        variables: {
          teamId,
          portfolioId,
        },
        fetchPolicy: 'network-only',
      },
    ],
  });
}

export { CREATE_OPTIMIZATION_REQUEST, useCreateOptimization };
