import { gql, useQuery } from '@apollo/client';
import { useTeam } from '../../context/TeamProvider';
import { PREDICTION_FRAGMENT } from './fragments';
import { NexoyaPrediction } from '../../types';

const PORTFOLIO_V2_PREDICTION_QUERY = gql`
  query PortfolioV2Prediction($teamId: Int!, $portfolioId: Int!, $start: Date!, $end: Date!) {
    portfolioV2(teamId: $teamId, portfolioId: $portfolioId) {
      prediction(start: $start, end: $end) {
        ...PredictionFragment
      }
    }
  }
  ${PREDICTION_FRAGMENT}
`;

type Options = {
  portfolioId: number;
  start: string | Date;
  end: string | Date;
  onCompleted?: (data: { portfolioV2: { prediction: NexoyaPrediction } }) => void;
};

export const usePredictionQuery = ({ portfolioId, start, end, onCompleted }: Options) => {
  const { teamId } = useTeam();

  return useQuery(PORTFOLIO_V2_PREDICTION_QUERY, {
    variables: { teamId, portfolioId, start, end },
    fetchPolicy: 'no-cache',
    onCompleted,
  });
};
