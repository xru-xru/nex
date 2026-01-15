import { gql, useQuery } from '@apollo/client';

const PREVIEW_EVENT_DUPLICATES_QUERY = gql`
  query PreviewEventDuplicates($portfolioEventNames: [String!]!, $portfolioId: Float!, $teamId: Float!) {
    previewEventDuplicates(portfolioId: $portfolioId, portfolioEventNames: $portfolioEventNames, teamId: $teamId) {
      duplicatePortfolioEvents {
        portfolioEventId
        name
        start
        end
      }
    }
  }
`;

function usePreviewEventDuplicates({ teamId, portfolioId }) {
  return useQuery(PREVIEW_EVENT_DUPLICATES_QUERY, {
    skip: !teamId || !portfolioId,
  });
}

export { PREVIEW_EVENT_DUPLICATES_QUERY, usePreviewEventDuplicates };
