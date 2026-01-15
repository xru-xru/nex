import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client';

import { useTeam } from 'context/TeamProvider';

import removeApolloCacheKeys from '../../utils/removeApolloCacheKeys';

const FLUSH_CACHE_MUTATION = gql`
  mutation FlushCache($teamId: Int!, $portfolioId: Int) {
    flushCache(teamId: $teamId, portfolioId: $portfolioId)
  }
`;
type Options = {
  portfolioId: number;
};

function useFlushCacheMutation({ portfolioId }: Options): any {
  const { teamId } = useTeam();
  const [mutation, state] = useMutation(FLUSH_CACHE_MUTATION, {
    variables: {
      teamId,
      portfolioId,
    },
    update: (cache) => removeApolloCacheKeys(cache, 'portfolio'),
  });
  return [mutation, state];
}

export { FLUSH_CACHE_MUTATION, useFlushCacheMutation };
