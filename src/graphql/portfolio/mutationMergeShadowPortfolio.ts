import { gql, useMutation } from '@apollo/client';
import { toast } from 'sonner';

const MERGE_SHADOW_PORTFOLIO_MUTATION = gql`
  mutation MergeShadowPortfolio($portfolioId: Int!, $teamId: Int!) {
    mergeShadowPortfolio(portfolioId: $portfolioId, teamId: $teamId) {
      portfolioId
      title
      description
      start
      end
      type
    }
  }
`;

export function useMergeShadowPortfolioMutation({
  onCompleted,
}: {
  onCompleted?: (data: { mergeShadowPortfolio: any }) => void;
}) {
  return useMutation(MERGE_SHADOW_PORTFOLIO_MUTATION, {
    onError: (error) => {
      console.error(error);
      toast.error(error.message);
    },
    onCompleted: (data) => {
      if (data?.mergeShadowPortfolio) {
        const portfolio = data.mergeShadowPortfolio;
        toast.success(`Shadow portfolio rules merged successfully into "${portfolio.title}"`);
        onCompleted?.(data);
      }
    },
  });
}
