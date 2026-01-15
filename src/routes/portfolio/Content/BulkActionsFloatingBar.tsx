import { cn } from '../../../lib/utils';
import { Button as ButtonShadcn } from '../../../components-ui/Button';
import Button from '../../../components/Button';
import ButtonAsync from '../../../components/ButtonAsync';
import React, { useEffect, useState } from 'react';
import { useSidebar } from '../../../context/SidebarProvider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '../../../components-ui/DropdownMenu';
import { ChevronDown } from 'lucide-react';
import { NexoyaDiscoveredContentStatus, NexoyaPortfolioParentContent } from '../../../types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../../components-ui/AlertDialog';
import { LabelLight } from '../../../components/InputLabel/styles';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '../../../components-ui/Select';
import { toNumber, uniq } from 'lodash';
import { useDialogState } from '../../../components/Dialog';
import usePortfolioMetaStore from '../../../store/portfolio-meta';
import { ASSIGN_IMPACT_GROUP_TO_PORTFOLIO_CONTENT_MUTATION } from '../../../graphql/impactGroups/mutationAssignImpactGroupToPortfolioContent';
import { useMutation } from '@apollo/client';
import { useTeam } from '../../../context/TeamProvider';
import ContentRemoveDialog from '../components/Content/ContentRemoveDialog';
import { ContentOptimizationDialog } from '../components/Content/ContentOptimizationDialog';
import { ASSIGN_LABEL_TO_PORTFOLIO_CONTENT_MUTATION } from '../../../graphql/labels/mutationAssignLabelToPortfolioContent';
import { ManualContentMetricAssignment } from '../components/Content/Wizard/ManualContentMetricAssignment';
import {
  updateApolloCache,
  updatePortfolioParentContentImpactGroupCache,
  updatePortfolioParentContentLabelCache,
} from '../../../utils/cache';
import { PORTFOLIO_PARENT_CONTENTS_QUERY } from '../../../graphql/content/queryPortfolioContents';
import { buildPortfolioContentFilterVariables } from '../utils/content';
import { useContentFilterStore } from '../../../store/content-filter';
import { toast } from 'sonner';

const UNASSIGN_VALUE_ID = 'unassign';

export const BulkActionsFloatingBar = ({
  contents,
  resetContentSelection,
}: {
  contents: NexoyaPortfolioParentContent[];
  resetContentSelection: () => void;
}) => {
  const {
    portfolioMeta: { impactGroups, portfolioId, labels },
  } = usePortfolioMetaStore();
  const filterStore = useContentFilterStore();

  const { teamId } = useTeam();
  const { sidebarWidth } = useSidebar();
  const [selectedImpactGroupId, setSelectedImpactGroupId] = useState<number | string | null>(null);
  const [selectedLabelId, setSelectedLabelId] = useState<number | string | null>(null);
  const [shouldIncludeInOptimization, setShouldIncludeInOptimization] = useState<boolean>();

  const { isOpen: isDeleteDialogOpen, toggleDialog: toggleDeleteDialog } = useDialogState();
  const { isOpen: isOptimizationStatusDialogOpen, toggleDialog: toggleOptimizationStatusDialogOpen } = useDialogState();

  const {
    isOpen: isAssignMetricsDialogOpen,
    toggleDialog: toggleAssignMetricsDialog,
    closeDialog: closeAssignMetricsDialog,
  } = useDialogState();

  const {
    isOpen: isAssignImpactGroupOpen,
    toggleDialog: toggleAssignImpactGroupDialog,
    closeDialog: closeAssignImpactGroupDialog,
  } = useDialogState();

  const {
    isOpen: isAssignLabelOpen,
    toggleDialog: toggleAssignLabelDialog,
    closeDialog: closeAssignLabelDialog,
  } = useDialogState();

  const [assignImpactGroupToPortfolioContent, { loading: loadingAssignImpactGroup }] = useMutation(
    ASSIGN_IMPACT_GROUP_TO_PORTFOLIO_CONTENT_MUTATION,
  );

  // Assuming there's a mutation for assigning labels
  const [assignLabelToPortfolioContent, { loading: loadingAssignLabel }] = useMutation(
    ASSIGN_LABEL_TO_PORTFOLIO_CONTENT_MUTATION,
  );

  const areAllManualContents = contents?.every(
    (c) => c.discoveredContent?.status === NexoyaDiscoveredContentStatus.Manual,
  );

  useEffect(() => {
    setSelectedImpactGroupId(null);
  }, [isAssignImpactGroupOpen]);

  useEffect(() => {
    setSelectedLabelId(null);
  }, [isAssignLabelOpen]);

  return (
    <div
      style={{ width: `calc(100% - ${sidebarWidth})`, left: sidebarWidth }}
      className={cn(
        'fixed bottom-0 border-t border-t-neutral-100 bg-seasalt px-8 py-5 transition-all',
        contents?.length ? 'opacity-100' : 'pointer-events-none z-[-1] opacity-0',
      )}
    >
      <div className="flex justify-between">
        <Button size="small" onClick={resetContentSelection} color="secondary" variant="contained">
          Cancel
        </Button>
        <div className="flex gap-5">
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="w-full">
              <div>
                <ButtonShadcn variant="secondary">
                  Edit
                  <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                </ButtonShadcn>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" side="bottom" onCloseAutoFocus={(e) => e.preventDefault()}>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="w-52">
                  <span>Optimization status</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem
                      onClick={() => {
                        setShouldIncludeInOptimization(true);
                        toggleOptimizationStatusDialogOpen();
                      }}
                    >
                      Enabled
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setShouldIncludeInOptimization(false);
                        toggleOptimizationStatusDialogOpen();
                      }}
                    >
                      Disabled
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              <DropdownMenuSeparator />
              {areAllManualContents && impactGroups?.length ? (
                <DropdownMenuItem onClick={toggleAssignImpactGroupDialog}>Impact groups</DropdownMenuItem>
              ) : null}
              {labels?.length ? <DropdownMenuItem onClick={toggleAssignLabelDialog}>Labels</DropdownMenuItem> : null}
              {areAllManualContents ? (
                <DropdownMenuItem onClick={toggleAssignMetricsDialog}>Metrics</DropdownMenuItem>
              ) : null}
            </DropdownMenuContent>
          </DropdownMenu>

          <ButtonShadcn onClick={toggleDeleteDialog} className="w-full break-words" variant="danger">
            Remove contents from portfolio
          </ButtonShadcn>
        </div>
      </div>
      {isDeleteDialogOpen && (
        <ContentRemoveDialog isOpen={isDeleteDialogOpen} toggleDialog={toggleDeleteDialog} parentContents={contents} />
      )}

      {isAssignMetricsDialogOpen && (
        <ManualContentMetricAssignment
          providerIds={uniq(contents?.map((c) => c?.content?.provider?.provider_id))}
          contents={contents}
          closeSidePanel={closeAssignMetricsDialog}
          isOpen={isAssignMetricsDialogOpen}
        />
      )}
      {isOptimizationStatusDialogOpen && (
        <ContentOptimizationDialog
          isOpen={isOptimizationStatusDialogOpen}
          toggleDialog={toggleOptimizationStatusDialogOpen}
          parentContents={contents}
          shouldIncludeInOptimization={shouldIncludeInOptimization}
        />
      )}

      {/* Assign impact group dialog */}
      <AlertDialog open={isAssignImpactGroupOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Assign impact group</AlertDialogTitle>
            <AlertDialogDescription>
              <span className="mt-1 text-sm font-normal leading-5 text-neutral-400">
                Select an impact group to assign to your selected manual contents.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="mt-4">
            <LabelLight>Select Impact Group</LabelLight>
            <Select
              disabled={!impactGroups?.length}
              value={selectedImpactGroupId?.toString()}
              onValueChange={(impactGroupId) => setSelectedImpactGroupId(impactGroupId)}
            >
              <SelectTrigger className="w-full border-neutral-100 bg-white p-2 shadow-sm">
                <SelectValue placeholder="Select impact group" />
              </SelectTrigger>
              <SelectContent>
                {impactGroups?.map((impactGroup) => (
                  <SelectItem key={impactGroup.impactGroupId} value={impactGroup.impactGroupId?.toString()}>
                    <span>{impactGroup.name}</span>
                  </SelectItem>
                ))}
                {impactGroups?.length ? (
                  <>
                    <SelectSeparator />
                    <SelectItem value={UNASSIGN_VALUE_ID}>
                      <span className="text-red-400">Unassign</span>
                    </SelectItem>
                  </>
                ) : null}
              </SelectContent>
            </Select>
          </div>

          <AlertDialogFooter>
            <AlertDialogAction onClick={closeAssignImpactGroupDialog}>
              <ButtonAsync variant="contained" color="secondary" size="small">
                Cancel
              </ButtonAsync>
            </AlertDialogAction>

            <AlertDialogAction>
              <ButtonAsync
                size="small"
                color="primary"
                variant="contained"
                loading={loadingAssignImpactGroup}
                disabled={!selectedImpactGroupId || loadingAssignImpactGroup}
                onClick={() => {
                  assignImpactGroupToPortfolioContent({
                    variables: {
                      teamId,
                      portfolioId,
                      impactGroupId:
                        selectedImpactGroupId === UNASSIGN_VALUE_ID ? null : toNumber(selectedImpactGroupId),
                      contentIds: contents?.map((content) => content?.content?.contentId),
                    },
                  })
                    .then(({ data, errors }) => {
                      if (data?.assignImpactGroupToPortfolioContents) {
                        // Update impact group cache
                        const impactGroup = impactGroups?.find((ig) => ig.impactGroupId === selectedImpactGroupId);
                        updateApolloCache({
                          query: PORTFOLIO_PARENT_CONTENTS_QUERY,
                          variables: buildPortfolioContentFilterVariables(teamId, portfolioId, filterStore),
                          updateFn: updatePortfolioParentContentImpactGroupCache({
                            portfolioContentIds: contents?.map((c) => c?.portfolioContentId),
                            impactGroup: impactGroup,
                          }),
                        });
                        toast.success(`Impact group ${impactGroup ? 'assigned' : 'unassigned'} successfully`);

                        resetContentSelection();
                        closeAssignImpactGroupDialog();
                      } else {
                        console.error('Error assigning impact group:', errors);
                      }
                    })
                    .catch((error) => {
                      console.error('Error assigning impact group:', error);
                    });
                }}
              >
                Apply impact group
              </ButtonAsync>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Assign label dialog */}
      <AlertDialog open={isAssignLabelOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Assign label</AlertDialogTitle>
            <AlertDialogDescription>
              <span className="mt-1 text-sm font-normal leading-5 text-neutral-400">
                Select a label to assign to your selected manual contents.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="mt-4">
            <LabelLight>Select Label</LabelLight>
            <Select
              disabled={!labels?.length}
              value={selectedLabelId?.toString()}
              onValueChange={(labelId) => setSelectedLabelId(labelId)}
            >
              <SelectTrigger className="w-full border-neutral-100 bg-white p-2 shadow-sm">
                <SelectValue placeholder="Select label" />
              </SelectTrigger>
              <SelectContent>
                {labels?.map((label) => (
                  <SelectItem key={label.labelId} value={label.labelId?.toString()}>
                    <span>{label.name}</span>
                  </SelectItem>
                ))}
                {labels?.length ? (
                  <>
                    <SelectSeparator />
                    <SelectItem value={UNASSIGN_VALUE_ID}>
                      <span className="text-red-400">Unassign</span>
                    </SelectItem>
                  </>
                ) : null}
              </SelectContent>
            </Select>
          </div>

          <AlertDialogFooter>
            <AlertDialogAction onClick={closeAssignLabelDialog}>
              <ButtonAsync variant="contained" color="secondary" size="small">
                Cancel
              </ButtonAsync>
            </AlertDialogAction>

            <AlertDialogAction>
              <ButtonAsync
                size="small"
                color="primary"
                variant="contained"
                loading={loadingAssignLabel}
                disabled={!selectedLabelId || loadingAssignLabel}
                onClick={() => {
                  assignLabelToPortfolioContent({
                    variables: {
                      teamId,
                      portfolioId,
                      labelId: selectedLabelId === UNASSIGN_VALUE_ID ? null : toNumber(selectedLabelId),
                      contentIds: contents?.map((content) => content?.content?.contentId),
                    },
                  })
                    .then(({ data, errors }) => {
                      if (data?.bulkAssignLabels) {
                        const label = labels.find((label) => label.labelId === selectedLabelId);
                        updateApolloCache({
                          query: PORTFOLIO_PARENT_CONTENTS_QUERY,
                          variables: buildPortfolioContentFilterVariables(teamId, portfolioId, filterStore),
                          updateFn: updatePortfolioParentContentLabelCache({
                            portfolioContentIds: contents?.map((c) => c?.portfolioContentId),
                            label,
                          }),
                        });
                        resetContentSelection();
                        closeAssignLabelDialog();
                        toast.success(`Label ${label ? 'assigned' : 'unassigned'} successfully`);
                      } else {
                        console.error('Error assigning label:', errors);
                      }
                    })
                    .catch((error) => {
                      console.error('Error assigning label:', error);
                    });
                }}
              >
                Apply label
              </ButtonAsync>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
