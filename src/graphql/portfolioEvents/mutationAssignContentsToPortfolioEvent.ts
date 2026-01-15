import { gql, useMutation } from '@apollo/client';

const ASSIGN_CONTENTS_TO_PORTFOLIO_EVENT_MUTATION = gql`
  mutation AssignContentsToPortfolioEvent(
    $assignedContentIds: [Float]!
    $contentRuleIds: [Float]!
    $includesAllContents: Boolean!
    $portfolioId: Float!
    $portfolioEventIds: [Float!]!
    $teamId: Float!
  ) {
    assignContentsAndRulesToPortfolioEvents(
      assignedContentIds: $assignedContentIds
      contentRuleIds: $contentRuleIds
      includesAllContents: $includesAllContents
      portfolioId: $portfolioId
      portfolioEventIds: $portfolioEventIds
      teamId: $teamId
    ) {
      portfolioEvents {
        portfolioEventId
        includesAllContents
        name
        created
        category
        start
        end
        impact
        assetUrl
        contentRules {
          name
          contentRuleId
          matchingDiscoveredContentsCount
        }
        assignedContents {
          contentId
          title
        }
      }
    }
  }
`;

function useAssignContentsToPortfolioEventMutation() {
  return useMutation(ASSIGN_CONTENTS_TO_PORTFOLIO_EVENT_MUTATION, {});
}

export { ASSIGN_CONTENTS_TO_PORTFOLIO_EVENT_MUTATION, useAssignContentsToPortfolioEventMutation };
