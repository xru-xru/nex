import React, { useState } from 'react';
import { useMergeShadowPortfolioMutation } from '../../../graphql/portfolio/mutationMergeShadowPortfolio';
import { useTeam } from '../../../context/TeamProvider';
import { GitMerge, Trash } from 'lucide-react';
import { useHistory } from 'react-router-dom';
import { useDeactivatePortfolioMutation } from '../../../graphql/portfolio/mutationDeactivatePortfolio';
import { toast } from 'sonner';
import { get } from 'lodash';
import { cn } from '../../../lib/utils';
import { Button } from '../../../components-ui/Button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../../components-ui/AlertDialog';
import ButtonAsync from '../../../components/ButtonAsync';
import SvgEllipsisV from '../../../components/icons/EllipsisV';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../../components-ui/DropdownMenu';

type Props = {
  portfolio: {
    portfolioId: number;
    title: string;
    originPortfolioId?: number; // This will be populated from the merge mutation result
  };
  onMergeComplete: (originPortfolioId: number) => void;
};

const ShadowPortfolioBanner = ({ portfolio, onMergeComplete }: Props) => {
  const { teamId } = useTeam();
  const history = useHistory();

  const [isMergeDialogOpen, setMergeDialogOpen] = useState(false);
  const [isDiscardDialogOpen, setDiscardDialogOpen] = useState(false);

  const [mergeShadowPortfolio, { loading: loadingMerge }] = useMergeShadowPortfolioMutation({
    onCompleted: (data) => {
      const originPortfolioId =
        get(data, 'mergeShadowPortfolio.originPortfolioId') || get(data, 'mergeShadowPortfolio.portfolioId');
      if (originPortfolioId) {
        onMergeComplete(originPortfolioId);
      }
      setMergeDialogOpen(false);
    },
  });

  const [deactivatePortfolio, { loading: loadingDelete }] = useDeactivatePortfolioMutation({
    portfolioId: portfolio.portfolioId,
  });

  const handleConfirmMerge = async () => {
    try {
      await mergeShadowPortfolio({
        variables: {
          portfolioId: portfolio.portfolioId,
          teamId,
        },
      });
    } catch (error) {
      // The hook's onError handles the toast, but we catch to prevent unhandled promise rejections.
      console.error('Failed to merge shadow portfolio:', error);
      setMergeDialogOpen(false);
    }
  };

  const handleConfirmDiscard = async () => {
    try {
      await deactivatePortfolio();
      toast.success('Shadow portfolio discarded.');
      setDiscardDialogOpen(false);
      history.push('/portfolios');
    } catch (error) {
      toast.error(`Failed to discard shadow portfolio: ${error.message}`);
      setDiscardDialogOpen(false);
    }
  };

  return (
    <>
      <div
        className={cn(
          'flex items-center justify-center gap-1.5 rounded-md border border-orange-100 bg-orange-50 px-6 py-3 pr-0',
          'max-h-[34px]',
        )}
      >
        <div className="flex items-center gap-3">
          <span className="truncate text-xs font-medium text-neutral-700">
            You can merge this portfolio with the original
          </span>
        </div>
        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 rounded-l-none rounded-r hover:bg-orange-100"
                disabled={loadingMerge || loadingDelete}
              >
                <SvgEllipsisV style={{ fontSize: 18 }} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setMergeDialogOpen(true)} className="font-normal">
                <GitMerge className="mr-2 h-4 w-4" />
                <span>Merge to original portfolio</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setDiscardDialogOpen(true)}
                className="font-normal text-red-500 focus:text-red-500"
              >
                <Trash className="mr-2 h-4 w-4" />
                <span>Discard portfolio</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Merge Confirmation Dialog */}
      <AlertDialog open={isMergeDialogOpen} onOpenChange={setMergeDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Merge</AlertDialogTitle>
            <AlertDialogDescription className="font-normal">
              Are you sure you want to merge the rules from this shadow portfolio into the original portfolio? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <ButtonAsync size="small" color="secondary" variant="contained">
                Cancel
              </ButtonAsync>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <ButtonAsync
                onClick={handleConfirmMerge}
                loading={loadingMerge}
                size="small"
                color="primary"
                variant="contained"
              >
                {loadingMerge ? 'Merging...' : 'Merge portfolios'}
              </ButtonAsync>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Discard Confirmation Dialog */}
      <AlertDialog open={isDiscardDialogOpen} onOpenChange={setDiscardDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Discard</AlertDialogTitle>
            <AlertDialogDescription className="font-normal">
              Are you sure you want to discard this shadow portfolio? All experimental rules will be permanently
              deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <ButtonAsync color="secondary" variant="contained" size="small">
                Cancel
              </ButtonAsync>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <ButtonAsync
                onClick={handleConfirmDiscard}
                loading={loadingDelete}
                color="danger"
                variant="contained"
                size="small"
              >
                {loadingDelete ? 'Discarding...' : 'Discard'}
              </ButtonAsync>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ShadowPortfolioBanner;
