import { gql } from '@apollo/client';

const PROVIDER_LABELS_FRAGMENT = gql`
  fragment labels on PortfolioLabel {
    labelId
    name
  }
`;
export { PROVIDER_LABELS_FRAGMENT };
