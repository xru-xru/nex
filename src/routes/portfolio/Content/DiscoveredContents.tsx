import React, { useCallback, useEffect, useState } from 'react';
import { TableStyled } from '../styles/OptimizationProposal';
import { ExtendedTable } from '../../../components/Table/ExtendedTable';
import { TableManager } from '../../../components/Table/TableManager';
import { ACTIONS_HEADER_ID } from '../components/OptimizationProposal/columns';
import { getData } from './data-table';
import { getDevice } from '../../../utils/media';
import { getColumns } from './columns';
import { Skeleton } from '../../../components-ui/Skeleton';
import { toast } from 'sonner';
import Typography from '../../../components/Typography';
import { nexyColors } from '../../../theme';
import Spinner from '../../../components/Spinner';
import NoDataFound from '../NoDataFound';
import MultipleSwitch from '../../../components/MultipleSwitchFluid';
import Button from '../../../components/Button';
import { useSidebar } from '../../../context/SidebarProvider';
import { cn } from '../../../lib/utils';
import { ConfirmationDialog } from '../components/PortfolioEditFunnel/ConfirmationDialog';
import { useDialogState } from '../../../components/Dialog';
import { ApplyContentRules } from './ApplyContentRules';
import { useDiscoverContentsStore } from '../../../store/discovered-contents';
import { useAcceptDiscoveredContentsMutation } from '../../../graphql/portfolioRules/mutationAcceptDiscoveredContents';
import { useRejectDiscoveredContentsMutation } from '../../../graphql/portfolioRules/mutationRejectDiscoveredContents';
import ButtonAsync from '../../../components/ButtonAsync';
import { useApplyRulesToDiscoveredContentsMutation } from '../../../graphql/portfolioRules/mutationApplyRulesToDiscoveredContents';
import { toNumber } from 'lodash';
import { useDiscoveredContentsQuery } from '../../../graphql/portfolioRules/queryDiscoveredContents';
import { useRouteMatch } from 'react-router';
import { useTeam } from '../../../context/TeamProvider';
import { NexoyaDiscoveredContentStatus } from '../../../types';
import useTabNewUpdates from '../../../hooks/useTabNewUpdates';
import { useTenantName } from '../../../hooks/useTenantName';

export const DISCOVERED_CONTENTS_SECTIONS = [
  {
    id: 'to-review',
    text: 'To review',
  },
  {
    id: 'rejected',
    text: 'Rejected',
  },
];

export const DiscoveredContents = () => {
  const { isLaptop, isTablet, isDesktop, isDesktopL } = getDevice();
  const { sidebarWidth } = useSidebar();
  const tenantName = useTenantName();

  const match = useRouteMatch();
  const portfolioId = parseInt(match.params.portfolioID, 10);
  const { teamId } = useTeam();

  const [allSelected, setAllSelected] = useState(false);

  const { isOpen: isApproveOpen, openDialog: openApproveDialog, closeDialog: closeApproveDialog } = useDialogState();
  const { isOpen: isRejectOpen, openDialog: openRejectDialog, closeDialog: closeRejectDialog } = useDialogState();
  const { isOpen: isApplySelectedRulesOpen, closeDialog: closeApplySelectedRules } = useDialogState();

  const { refreshCountDiscoveredContents } = useTabNewUpdates(portfolioId);
  const {
    filteredContents,
    selectedContentIds,
    discoveredContentsActiveSwitch,
    acceptedDiscoveredContents,
    selectedDiscoveredContentRules: selectedRules,
    setFilteredContents,
    setAcceptedDiscoveredContents,
    addSelectedContentId,
    removeSelectedContentId,
    resetSelectedContentIds,
    setDiscoveredContentsActiveSwitch,
  } = useDiscoverContentsStore();

  useEffect(() => {
    setDiscoveredContentsActiveSwitch(DISCOVERED_CONTENTS_SECTIONS[0].id);
  }, []);

  const [acceptDiscoveredContents, { loading: loadingAccept }] = useAcceptDiscoveredContentsMutation({ portfolioId });
  const [rejectDiscoveredContents, { loading: loadingReject }] = useRejectDiscoveredContentsMutation({ portfolioId });
  const [applyRulesToDiscoveredContents, { loading: loadingApply }] = useApplyRulesToDiscoveredContentsMutation({
    portfolioId,
    status:
      discoveredContentsActiveSwitch === 'to-review'
        ? NexoyaDiscoveredContentStatus.New
        : NexoyaDiscoveredContentStatus.Rejected,
  });

  const { data, loading, refetch } = useDiscoveredContentsQuery({
    portfolioId,
    status:
      discoveredContentsActiveSwitch === 'to-review'
        ? NexoyaDiscoveredContentStatus.New
        : NexoyaDiscoveredContentStatus.Rejected,
    onError: (error) => {
      console.error('Error fetching filtered contents:', error);
      toast.error('Error fetching filtered contents');
      setFilteredContents([]);
    },
  });

  useEffect(() => {
    setFilteredContents(data?.portfolioV2?.discoveredContents ?? []);
  }, [data, loading]);

  useEffect(() => {
    if (filteredContents?.length > 0 && selectedContentIds.length === filteredContents.length) {
      setAllSelected(true);
    } else {
      setAllSelected(false);
    }
  }, [selectedContentIds, filteredContents]);

  const toggleAllSelected = useCallback(() => {
    if (allSelected) {
      // If all are selected, unselect all
      resetSelectedContentIds();
      setAllSelected(false);
    } else {
      // If not all selected, select all
      const allDiscoveredContentIds = filteredContents?.map((dsc) => dsc.discoveredContentId) || [];
      resetSelectedContentIds(); // Clear existing selections first
      allDiscoveredContentIds.forEach((id) => addSelectedContentId(id));
      setAllSelected(true);
    }
  }, [allSelected, filteredContents, resetSelectedContentIds, addSelectedContentId]);

  const handleAccept = async () => {
    acceptDiscoveredContents({
      variables: {
        discoveredContentIds: selectedContentIds,
        portfolioId,
        teamId,
      },
    }).then((response) => {
      if (!response.data) {
        return;
      }
      setAcceptedDiscoveredContents(response.data?.acceptDiscoveredContents ?? []);
      resetSelectedContentIds();
      closeApproveDialog();
      refetch();
      refreshCountDiscoveredContents();
    });
  };

  const handleReject = async () => {
    rejectDiscoveredContents({
      variables: {
        discoveredContentIds: selectedContentIds,
        portfolioId,
        teamId,
      },
    }).then(() => {
      resetSelectedContentIds();
      closeRejectDialog();
      refetch();
      refreshCountDiscoveredContents();
    });
  };

  const handleApplyRules = async () => {
    const discoveredContentsWithRulesToApply = Object.entries(selectedRules).map(([contentId, rules]) => ({
      discoveredContentId: parseInt(contentId, 10),
      contentRuleId: toNumber(rules.contentRuleId),
      impactGroupRuleId: toNumber(rules.impactGroupRuleId),
    }));

    await applyRulesToDiscoveredContents({
      variables: {
        discoveredContentsWithRulesToApply,
        portfolioId,
        teamId,
      },
    }).then(() => {
      closeApproveDialog();
      refreshCountDiscoveredContents();
    });
  };

  const getDiscoveredContentId = (contentId: number) =>
    filteredContents.find((dsc) => dsc.content.contentId === contentId)?.discoveredContentId;

  const tableData = loading
    ? createLoadingData(10)
    : getData({
        content: filteredContents?.map((dsc) => dsc.content),
        portfolio: null,
        isContentIncluded: (contentId: number) => selectedContentIds?.includes(getDiscoveredContentId(contentId)),
        includeContentId: (contentId: number) => addSelectedContentId(getDiscoveredContentId(contentId)),
        excludeContentId: (contentId: number) => removeSelectedContentId(getDiscoveredContentId(contentId)),
      });

  const contentWidth = isDesktopL ? 940 : isDesktop ? 300 : isLaptop ? 350 : isTablet ? 100 : 300;
  const columns = getProcessedColumns(loading, contentWidth, allSelected, toggleAllSelected);
  return (
    <div>
      <div className="flex flex-col gap-6">
        <div>
          <Typography style={{ color: nexyColors.neutral900 }} variant="h3">
            Discovered contents
          </Typography>
          <Typography style={{ color: nexyColors.neutral400, marginTop: 8 }} variant="paragraph">
            Review new discovered contents in your channels that match with your {tenantName} content rules.
          </Typography>
        </div>
        <div>
          <MultipleSwitch
            sections={DISCOVERED_CONTENTS_SECTIONS}
            initial={discoveredContentsActiveSwitch}
            current={discoveredContentsActiveSwitch}
            onToggle={(selectedOption: string) => setDiscoveredContentsActiveSwitch(selectedOption)}
          />
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-4">
        {loading ? (
          <Spinner />
        ) : !filteredContents?.length ? (
          <NoDataFound
            style={{ height: 200 }}
            title="You don't have any discovered contents yet"
            subtitle="You will see them appear here once we detect a new content based on your content rules"
          />
        ) : (
          <TableStyled className="w-full max-w-[1998px]" maxHeight="90vh">
            <ExtendedTable
              tableId="content_table"
              disablePagination={false}
              disableManager={false}
              disableExpanded={false}
              data={tableData}
              columns={columns}
              defaultPageSize={10}
              renderTableManager={({
                columns,
                getToggleHideAllColumnsProps,
                toggleHideAllColumns,
                setStickyColumns,
                stickyColumns,
              }) => (
                <TableManager
                  idsNotAllowedToHide={[ACTIONS_HEADER_ID, 'expander', 'content']}
                  columns={columns}
                  getToggleHideAllColumnsProps={getToggleHideAllColumnsProps}
                  toggleHideAllColumns={toggleHideAllColumns}
                  setStickyColumns={setStickyColumns}
                  stickyColumns={stickyColumns}
                  depth={1}
                />
              )}
            />
          </TableStyled>
        )}
      </div>
      <div
        style={{ width: `calc(100% - ${sidebarWidth})`, left: sidebarWidth }}
        className={cn(
          'fixed bottom-0 border-t border-t-neutral-100 bg-seasalt px-8 py-5 transition-all',
          selectedContentIds.length ? 'opacity-100' : 'pointer-events-none z-[-1] opacity-0',
        )}
      >
        <div className="flex justify-between">
          <Button onClick={() => resetSelectedContentIds()} color="secondary" variant="contained">
            Cancel
          </Button>
          <div className="flex gap-5">
            {discoveredContentsActiveSwitch !== 'rejected' ? (
              <ButtonAsync
                onClick={openRejectDialog}
                disabled={loadingReject || loadingAccept}
                loading={loadingReject}
                color="secondary"
                variant="contained"
              >
                Reject contents
              </ButtonAsync>
            ) : null}
            <ButtonAsync
              onClick={openApproveDialog}
              disabled={loadingReject || loadingAccept}
              loading={loadingAccept}
              color="primary"
              variant="contained"
            >
              Add contents to portfolio
            </ButtonAsync>
          </div>
        </div>
      </div>
      <ApplyContentRules
        loading={loadingApply}
        acceptedDiscoveredContents={acceptedDiscoveredContents}
        onConfirm={handleApplyRules}
        isOpen={isApplySelectedRulesOpen}
        onCancel={closeApplySelectedRules}
      />
      <ConfirmationDialog
        titleText="Reject contents"
        ctaText="Reject"
        description={`${selectedContentIds.length} contents will be rejected. You can always add these back later.`}
        onConfirm={handleReject}
        type="discard"
        isOpen={isRejectOpen}
        onCancel={closeRejectDialog}
      />
      <ConfirmationDialog
        titleText="Accept contents"
        ctaText="Accept"
        description={`${selectedContentIds.length} contents will be added back to the portfolio. You can always remove them later.`}
        onConfirm={handleAccept}
        type="apply"
        isOpen={isApproveOpen}
        onCancel={closeApproveDialog}
      />
    </div>
  );
};

const getProcessedColumns = (
  loading: boolean,
  contentWidth: number,
  allSelected: boolean,
  toggleAllSelected: () => void,
) => {
  const baseColumns = getColumns({
    contentWidth,
    allSelected,
    toggleAllSelected,
  });
  if (loading) {
    return baseColumns.map((column) => ({
      ...column,
      columns: column.columns?.map((subColumn) => ({
        ...subColumn,
        Cell: () => <Skeleton className="h-5 w-full" />,
      })),
    }));
  }
  return baseColumns;
};

const createLoadingData = (count: number) => Array(count).fill({});
