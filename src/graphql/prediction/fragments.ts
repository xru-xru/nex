import { gql } from '@apollo/client';

export const PREDICTION_FRAGMENT = gql`
  fragment PredictionFragment on Prediction {
    funnelSteps {
      funnelStepId
      title
      score
      type
      accuracyBuckets {
        threshold
        contentCount
      }
      dailyPredictions {
        day
        score
        achieved
        predicted
      }
    }
    total {
      score
      accuracyBuckets {
        threshold
        contentCount
      }
      dailyPredictionTotal {
        day
        score
      }
    }
  }
`;
