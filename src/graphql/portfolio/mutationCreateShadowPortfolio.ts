import { gql, useMutation } from '@apollo/client';
import { toast } from 'sonner';
import { useTeam } from '../../context/TeamProvider';
import { buildPortfolioPath } from '../../routes/paths';

const CREATE_SHADOW_PORTFOLIO_MUTATION = gql`
  mutation CreateShadowPortfolio($portfolioId: Int!, $teamId: Int!) {
    createShadowPortfolio(portfolioId: $portfolioId, teamId: $teamId) {
      portfolioId
      title
      description
      start
      end
      type
    }
  }
`;

type CreateShadowPortfolioProps = {
  portfolioId: number;
  onCompleted?: (data: { createShadowPortfolio: any }) => void;
};

export function useCreateShadowPortfolioMutation({
  onCompleted,
}: {
  onCompleted?: (data: { createShadowPortfolio: any }) => void;
}) {
  const { teamId } = useTeam();

  return useMutation(CREATE_SHADOW_PORTFOLIO_MUTATION, {
    onError: (error) => {
      console.error(error);
      toast.error(error.message);
    },
    onCompleted: (data) => {
      if (data?.createShadowPortfolio) {
        const shadowPortfolio = data.createShadowPortfolio;
        toast.success(`Shadow portfolio "${shadowPortfolio.title}" created successfully`);
        onCompleted?.(data);
      }
    },
  });
} 