import { gql, useMutation } from '@apollo/client';

import { useTeam } from 'context/TeamProvider';

const REFRESH_PORTFOLIO_CONTENT_MEASUREMENTS_MUTATION = gql`
  mutation refreshPortfolioContentMeasurements($teamId: Int!, $portfolioId: Int!, $startDate: Date, $endDate: Date) {
    refreshPortfolioContentMeasurements(
      teamId: $teamId
      portfolioId: $portfolioId
      startDate: $startDate
      endDate: $endDate
    )
  }
`;

type Props = {
  portfolioId: number;
  startDate?: string | Date;
  endDate?: string | Date;
};
const useRefreshPortfolioContentMeasurementsMutation = (props: Props) => {
  const { teamId } = useTeam();
  const [mutation, state] = useMutation(REFRESH_PORTFOLIO_CONTENT_MEASUREMENTS_MUTATION, {
    notifyOnNetworkStatusChange: true,
    variables: {
      teamId,
      ...props,
    },
  });

  return { refreshPortfolioContentMeasurements: mutation, ...state };
};

export { useRefreshPortfolioContentMeasurementsMutation };
