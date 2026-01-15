import { NexoyaPortfolioParentContent } from '../../../../types';
import { useUpdatePortfolioContentsIncludedInOptimizationMutation } from '../../../../graphql/portfolio/mutationUpdatePortfolioContentStatus';
import { track } from '../../../../constants/datadog';
import { EVENT } from '../../../../constants/events';
import ButtonAsync from '../../../../components/ButtonAsync';
import ErrorMessage from '../../../../components/ErrorMessage';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../../../components-ui/AlertDialog';
import { useRouteMatch } from 'react-router';
import { updateApolloCache, updatePortfolioParentContentOptimizationStatusCache } from '../../../../utils/cache';
import { PORTFOLIO_PARENT_CONTENTS_QUERY } from '../../../../graphql/content/queryPortfolioContents';
import { buildPortfolioContentFilterVariables } from '../../utils/content';
import { useTeam } from '../../../../context/TeamProvider';
import { useContentFilterStore } from '../../../../store/content-filter';
import { toast } from 'sonner';
import { useTenantName } from '../../../../hooks/useTenantName';

const getStatusText = (tenantName: string) => ({
  false: {
    CTA: "Yes, I'm sure",
    title: 'Are you sure you want to exclude this content from the optimization?',
    description: (
      <span>
        Excluded campaigns will not receive any optimization proposals and will remain untouched by {tenantName}. They
        will still be visible in the performance overview.
      </span>
    ),
  },
  true: {
    CTA: 'Add to optimization',
    title: 'Add this content back to the optimization?',
    description: (
      <span>
        <p className="mb-1.5">This content will be included in the next optimization.</p>
        💭 We recommend double-checking if the portfolio budget is up to date.
      </span>
    ),
  },
});

type Props = {
  isOpen: boolean;
  toggleDialog: () => void;
  parentContents: NexoyaPortfolioParentContent[];
  shouldIncludeInOptimization?: boolean;
};

export function ContentOptimizationDialog({
  parentContents,
  isOpen,
  toggleDialog,
  shouldIncludeInOptimization,
}: Props) {
  const { teamId } = useTeam();
  const match = useRouteMatch();
  const portfolioId = parseInt(match.params.portfolioID, 10);
  const tenantName = useTenantName();

  const filterStore = useContentFilterStore();

  const isEveryContentIncludedInOptimization = parentContents.every((pc) => pc.isIncludedInOptimization);
  const isIncludedInOptimization =
    shouldIncludeInOptimization !== undefined ? shouldIncludeInOptimization : !isEveryContentIncludedInOptimization;

  const statusKey = String(isIncludedInOptimization) as 'true' | 'false';
  const statusText = getStatusText(tenantName);

  const portfolioContentIds = parentContents?.map((pc) => pc.portfolioContentId);
  const [updateContentStatus, { loading, error }] = useUpdatePortfolioContentsIncludedInOptimizationMutation({
    portfolioId,
    isIncludedInOptimization,
    portfolioContentIds,
  });

  const handleSubmit = () => {
    updateContentStatus()
      .then(() => {
        toast.success('Content optimization status updated successfully');
        updateApolloCache({
          query: PORTFOLIO_PARENT_CONTENTS_QUERY,
          variables: buildPortfolioContentFilterVariables(teamId, portfolioId, filterStore),
          updateFn: updatePortfolioParentContentOptimizationStatusCache({
            portfolioContentIds,
            isIncludedInOptimization,
          }),
        });
        toggleDialog();
        if (isIncludedInOptimization) {
          track(EVENT.CONTENT_INCLUDE_IN_OPTIMIZATION, {
            portfolioId,
            portfolioContentIds,
          });
        } else {
          track(EVENT.CONTENT_EXCLUDE_FROM_OPTIMIZATION, {
            portfolioId,
            portfolioContentIds,
          });
        }
      })
      .catch((err) => console.error(err));
  };

  return (
    <>
      <AlertDialog open={isOpen}>
        <AlertDialogContent className="text-left">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">{statusText[statusKey].title}</AlertDialogTitle>
            <AlertDialogDescription>
              <p className="font-normal leading-[21px] tracking-[0.2px] text-blueGrey">
                {statusText[statusKey].description}
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="bg-paleWhite">
            <AlertDialogAction onClick={toggleDialog}>
              <ButtonAsync variant="contained" disabled={loading}>
                Cancel
              </ButtonAsync>
            </AlertDialogAction>

            <AlertDialogAction>
              <ButtonAsync
                disabled={loading}
                loading={loading}
                onClick={handleSubmit}
                variant="contained"
                color="primary"
                autoFocus
              >
                {statusText[statusKey].CTA}
              </ButtonAsync>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {error ? <ErrorMessage error={error} /> : null}
    </>
  );
}
