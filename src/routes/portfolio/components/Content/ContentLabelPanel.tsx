import React from 'react';

import { useMutation } from '@apollo/client';
import { toast } from 'sonner';

import { NexoyaPortfolioLabel, NexoyaPortfolioParentContent } from 'types';

import { useTeam } from '../../../../context/TeamProvider';

import { track } from '../../../../constants/datadog';
import { EVENT } from '../../../../constants/events';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../../components-ui/DropdownMenu';

import Typography from '../../../../components/Typography';
import Button from 'components/Button';
import ButtonAdornment from 'components/ButtonAdornment';
import { useDropdownMenu } from 'components/DropdownMenu';
import { ASSIGN_LABEL_TO_PORTFOLIO_CONTENT_MUTATION } from '../../../../graphql/labels/mutationAssignLabelToPortfolioContent';
import { updateApolloCache, updatePortfolioParentContentLabelCache } from '../../../../utils/cache';
import { ChevronsUpDown } from 'lucide-react';
import { usePortfolio } from '../../../../context/PortfolioProvider';
import { PORTFOLIO_PARENT_CONTENTS_QUERY } from '../../../../graphql/content/queryPortfolioContents';
import { buildPortfolioContentFilterVariables } from '../../utils/content';
import { useContentFilterStore } from '../../../../store/content-filter';

interface Props {
  parentContent: NexoyaPortfolioParentContent;
  portfolioId: number;
}
export function ContentLabelPanel({ parentContent, portfolioId }: Props) {
  const { teamId } = useTeam();
  const anchorElPanel = React.useRef(null);
  const { closeMenu: closeLabelMenu, toggleMenu } = useDropdownMenu();

  const filterStore = useContentFilterStore();
  const {
    portfolioV2Info: {
      meta: { data: portfolioMeta },
    },
  } = usePortfolio();

  const labels = portfolioMeta?.labels;

  const [assignLabelToPortfolioContent, { loading }] = useMutation(ASSIGN_LABEL_TO_PORTFOLIO_CONTENT_MUTATION);

  const onClickListener = React.useCallback(
    (event: MouseEvent) => {
      event.stopPropagation();
      const containsInstance = anchorElPanel.current && anchorElPanel.current.contains(event.target);
      if (containsInstance) {
        return toggleMenu();
      }
      return closeLabelMenu();
    },
    [anchorElPanel, toggleMenu, closeLabelMenu],
  );

  React.useEffect(() => {
    document.addEventListener('mousedown', onClickListener);
    return function () {
      document.removeEventListener('mousedown', onClickListener);
    };
  }, []);

  function handleAddContentToLabel(label: NexoyaPortfolioLabel) {
    assignLabelToPortfolioContent({
      notifyOnNetworkStatusChange: false,
      variables: {
        contentIds: [parentContent?.content?.contentId],
        labelId: label.labelId,
        portfolioId,
        teamId,
      },
    })
      .then(({ data }) => {
        if (data?.bulkAssignLabels) {
          updateApolloCache({
            query: PORTFOLIO_PARENT_CONTENTS_QUERY,
            variables: buildPortfolioContentFilterVariables(teamId, portfolioId, filterStore),
            updateFn: updatePortfolioParentContentLabelCache({
              portfolioContentIds: [parentContent?.portfolioContentId],
              label,
            }),
          });

          closeLabelMenu();
          track(EVENT.CONTENT_CHANGE_LABEL, {
            contentId: parentContent?.content?.contentId,
            labelId: label.labelId,
          });
        }
      })
      .catch((err) => {
        toast(err.message);
        console.error(err);
      });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="text"
          color="secondary"
          flat
          type="button"
          className="NEXYButtonMetric !rounded-md !px-1.5 !py-0.5 hover:bg-seasalt"
          loading={loading}
          endAdornment={
            <ButtonAdornment position="end">
              <ChevronsUpDown
                className={`h-4 w-4 ${parentContent?.label?.name ? 'text-blue-grey' : 'text-neutral-200'}`}
              />
            </ButtonAdornment>
          }
        >
          {parentContent?.label?.name ? parentContent?.label?.name : <span className="text-neutral-200">None</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-[200px]">
        {labels?.length ? (
          labels?.map((label: NexoyaPortfolioLabel) => (
            <DropdownMenuItem
              key={`label-${label.labelId}`}
              disabled={loading}
              onSelect={() => handleAddContentToLabel(label)}
            >
              <Typography>{label.name}</Typography>
            </DropdownMenuItem>
          ))
        ) : (
          <DropdownMenuItem disabled>
            <span className="text-neutral-400">No labels available</span>
          </DropdownMenuItem>
        )}
        {parentContent?.label?.labelId ? (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              key={`label-unassign-${parentContent.label.labelId}`}
              disabled={loading}
              onSelect={() =>
                handleAddContentToLabel({
                  labelId: null,
                  name: '',
                })
              }
            >
              <span className="text-red-400">Unassign</span>
            </DropdownMenuItem>
          </>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
