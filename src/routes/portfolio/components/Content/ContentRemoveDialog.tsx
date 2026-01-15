import { get } from 'lodash';

import { NexoyaPortfolioParentContent } from '../../../../types';
import { useRemovePortfolioContentMutation } from 'graphql/portfolio/mutationRemovePortfolioContent';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTitle,
} from '../../../../components-ui/AlertDialog';

import { track } from '../../../../constants/datadog';
import { EVENT } from '../../../../constants/events';

import Button from '../../../../components/Button';
import ButtonAsync from '../../../../components/ButtonAsync';
import { useRouteMatch } from 'react-router';
import { toast } from 'sonner';

type Props = {
  isOpen: boolean;
  toggleDialog: () => void;
  parentContents: NexoyaPortfolioParentContent[];
  dateFrom?: Date;
  dateTo?: Date;
};

function ContentRemoveDialog({ parentContents, isOpen, toggleDialog }: Props) {
  const match = useRouteMatch();
  const portfolioId = parseInt(match.params.portfolioID, 10);
  //@ts-expect-error
  const [removeContent, { loading }] = useRemovePortfolioContentMutation({
    portfolioId,
    portfolioContentIds: parentContents.map((p) => p.portfolioContentId),
  });

  async function handleSubmit() {
    try {
      //@ts-expect-error
      const res = await removeContent();
      if (get(res, 'data.removePortfolioContent', null)) {
        toggleDialog();
        toast.success(`Content${parentContents.length > 1 ? 's' : ''} removed successfully`);
        track(
          EVENT.CONTENT_DELETE,
          parentContents?.map((pc) => ({
            contentId: pc.content?.contentId,
            portfolioContentId: pc.portfolioContentId,
            contentName: pc.content?.title,
            contentType: pc.content?.contentType,
            portfolioId,
          })),
        );
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <>
      <AlertDialog open={isOpen}>
        <AlertDialogContent>
          <AlertDialogTitle>
            <div className="text-lg font-medium tracking-normal">Remove content?</div>
            <div className="mt-2 text-sm font-normal text-neutral-400">
              This content will be removed from the portfolio, losing its optimization status and all rule assignments,
              including metrics. You’ll be able add back the content in{' '}
              <span className="font-medium">Content {'>'} Removed Contents.</span>
            </div>
          </AlertDialogTitle>
          <AlertDialogFooter className="items-end">
            <AlertDialogAction>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDialog();
                }}
                disabled={loading}
                variant="contained"
                color="secondary"
                size="small"
              >
                Cancel
              </Button>
            </AlertDialogAction>
            <AlertDialogAction>
              <ButtonAsync
                disabled={loading}
                loading={loading}
                onClick={handleSubmit}
                variant="contained"
                color="danger"
                size="small"
              >
                Yes, remove content
              </ButtonAsync>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default ContentRemoveDialog;
