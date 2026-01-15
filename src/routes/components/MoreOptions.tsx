import { NexoyaAttributionModelStatus } from '../../types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../components-ui/DropdownMenu';
import ButtonIcon from '../../components/ButtonIcon';
import SvgEllipsisV from '../../components/icons/EllipsisV';
import React from 'react';
import { AttributionRunWithFiles } from './AttributionTable';

export const MoreOptionsButton = ({
  run,
  onView,
  onReview,
  onArchive,
}: {
  run: AttributionRunWithFiles;
  onView: () => void;
  onReview?: () => void;
  onArchive?: () => void;
}) => {
  // Statuses that show only "View": Discarded (Cancelled), In Progress (Running), Accepted (Approved), Draft, Rejected
  const showOnlyView = [
    NexoyaAttributionModelStatus.Cancelled,
    NexoyaAttributionModelStatus.Approved,
    NexoyaAttributionModelStatus.Running,
    NexoyaAttributionModelStatus.Draft,
    NexoyaAttributionModelStatus.Rejected,
  ].includes(run.status);

  // Status that shows "Review" and "Archive": Ready For Review (InReview)
  const showReviewOptions = run.status === NexoyaAttributionModelStatus.InReview;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
        <div>
          <ButtonIcon>
            <SvgEllipsisV />
          </ButtonIcon>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
        {showOnlyView && (
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              onView();
            }}
          >
            View
          </DropdownMenuItem>
        )}
        {showReviewOptions && (
          <>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onReview?.();
              }}
            >
              Review
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onArchive?.();
              }}
            >
              Archive
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
