import { gql, useMutation } from '@apollo/client';

import { useTeam } from 'context/TeamProvider';

const ADD_PORTFOLIO_CONTENT_MUTATION = gql`
  mutation AddPortfolioContent($teamId: Int!, $portfolioId: Int!, $collectionIds: [Float!]!) {
    addPortfolioContent(teamId: $teamId, portfolioId: $portfolioId, collectionIds: $collectionIds)
  }
`;

type Props = {
  portfolioId: number;
  collectionIds: number[];
};
const useAddPortfolioContentMutation = ({ portfolioId, collectionIds }: Props) => {
  const { teamId } = useTeam();
  const [mutation, state] = useMutation(ADD_PORTFOLIO_CONTENT_MUTATION, {
    notifyOnNetworkStatusChange: true,
    variables: {
      teamId,
      portfolioId,
      collectionIds,
    },
  });

  return [mutation, state];
};

export { ADD_PORTFOLIO_CONTENT_MUTATION, useAddPortfolioContentMutation };
