import React, { useEffect, useState } from 'react';
import Typography from '../../../components/Typography';
import { nexyColors } from '../../../theme';
import Button from '../../../components/Button';
import NoDataFound from '../NoDataFound';
import { useSidePanelState } from '../../../components/SidePanel';
import usePortfolioEventsStore from '../../../store/portfolio-events';
import GridWrap from '../../../components/GridWrap';
import GridHeader from '../../../components/GridHeader';
import { TypographyStyled, TypographyStyledAligned } from '../components/TargetItem/TargetItemsTable';
import * as Styles from '../../../components/PerformanceTable/styles';
import dayjs from 'dayjs';
import { READABLE_FORMAT } from '../../../utils/dates';
import { getCategoryInfo } from '../../../utils/portfolioEvents';
import styled from 'styled-components';
import GridRow from '../../../components/GridRow';
import { HoverableTooltip } from '../../../components-ui/HoverCard';
import Tooltip from '../../../components/Tooltip';
import { PortfolioEventTDM } from './PortfolioEventTDM';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../../components-ui/DropdownMenu';
import SvgCaretDown from '../../../components/icons/CaretDown';
import { FilePen, Upload } from 'lucide-react';
import { ManuallyCreatePortfolioEvent } from '../components/PortfolioEvents/ManuallyCreatePortfolioEvent';
import { useSidebar } from '../../../context/SidebarProvider';
import Checkbox from '../../../components/Checkbox';
import { cn } from '../../../lib/utils';
import ButtonAsync from '../../../components/ButtonAsync';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
} from '../../../components-ui/AlertDialog';
import { useDialogState } from '../../../components/Dialog';
import { PortfolioEventAssignContents } from '../components/PortfolioEvents/PortfolioEventAssignContents';
import { UploadFileCreatePortfolioEvent } from '../components/PortfolioEvents/UploadFileCreatePortfolioEvent';
import { useAssignContentsToPortfolioEventMutation } from '../../../graphql/portfolioEvents/mutationAssignContentsToPortfolioEvent';
import { useDeletePortfolioEventMutation } from '../../../graphql/portfolioEvents/mutationDeletePortfolioEvent';
import { toast } from 'sonner';
import usePortfolioMetaStore from '../../../store/portfolio-meta';
import { ConfirmationDialog } from '../components/PortfolioEditFunnel/ConfirmationDialog';
import { NexoyaPortfolioEvent } from '../../../types';
import { useTeam } from '../../../context/TeamProvider';
import { useFilteredContentsStore } from '../../../store/filter-contents';
import ImpactedContentsHoverCard from '../../../components/HoverCard/ImpactedContentsHoverCard';
import Spinner from '../../../components/Spinner';
import { orderBy } from 'lodash';
import { useContentRulesStore } from '../../../store/content-rules';
import { calculateImpactedContentsForEvent } from '../utils/portfolio-events';
import { usePortfolioEventsQuery } from '../../../graphql/portfolioEvents/queryPortfolioEvents';
import { PaginationControls } from '../../../components/Table/PaginationControls';
import { NetworkStatus } from '@apollo/client';
import { track } from '../../../constants/datadog';
import { EVENT } from '../../../constants/events';

export const DEFAULT_PORTFOLIO_EVENTS_PAGE_SIZE = 25;

export const PortfolioEvents = () => {
  const { paginatedPortfolioEvents, setPaginatedPortfolioEvents } = usePortfolioEventsStore();
  const { selectedContentIds } = useFilteredContentsStore();
  const { selectedContentRules, resetSelectedContentRules } = useContentRulesStore();
  const { portfolioMeta } = usePortfolioMetaStore();
  const { teamId } = useTeam();
  const portfolioId = portfolioMeta?.portfolioId;

  const [includesAllContents, setIncludesAllContents] = useState(false);
  const [portfolioEventToDelete, setPortfolioEventToDelete] = useState<NexoyaPortfolioEvent>(null);
  const [portfolioEventToEdit, setPortfolioEventToEdit] = useState<NexoyaPortfolioEvent>(null);
  const [selectedEventIds, setSelectedEventIds] = useState<number[]>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(DEFAULT_PORTFOLIO_EVENTS_PAGE_SIZE);
  const [pageInfo, setPageInfo] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const {
    data: portfolioEventsData,
    fetchMore,
    refetch,
    networkStatus,
  } = usePortfolioEventsQuery({
    portfolioId,
    first: pageSize,
  });

  const currentPageEvents = paginatedPortfolioEvents.find((p) => p.page === pageIndex)?.data || [];

  const { isOpen: isOpenManuallyCreateEvent, toggleSidePanel: toggleManuallyCreateEvent } = useSidePanelState();
  const { isOpen: isOpenUploadCsvEvents, toggleSidePanel: toggleUploadCsvEvents } = useSidePanelState();
  const {
    isOpen: isAssignContentsOpen,
    openDialog: openAssignContents,
    closeDialog: closeAssignContents,
  } = useDialogState();

  const {
    isOpen: isDeleteEventDialogOpen,
    openDialog: openDeleteEventDialog,
    closeDialog: closeDeleteEventDialog,
  } = useDialogState();

  const { sidebarWidth } = useSidebar();

  const [assignContents, { loading: loadingAssignContents }] = useAssignContentsToPortfolioEventMutation();
  const [deletePortfolioEvent, { loading: loadingDeleteEvent }] = useDeletePortfolioEventMutation({ portfolioId });

  const handleSelectEvent = (eventId: number) => {
    setSelectedEventIds((prev) => (prev.includes(eventId) ? prev.filter((id) => id !== eventId) : [...prev, eventId]));
  };

  useEffect(() => {
    if (networkStatus === NetworkStatus.ready && portfolioEventsData?.portfolioV2?.portfolioEvents) {
      const events = portfolioEventsData.portfolioV2.portfolioEvents.edges?.map((edge) => edge.node) || [];
      const orderedEvents = orderBy(events, 'start', 'asc');

      setPaginatedPortfolioEvents(orderedEvents, pageIndex);
      setPageInfo(portfolioEventsData.portfolioV2.portfolioEvents.pageInfo);
      setPageCount(portfolioEventsData?.portfolioV2?.portfolioEvents?.totalPages);
    }
  }, [portfolioEventsData, networkStatus]);

  const handlePageChange = async (page: number) => {
    setLoading(true);

    setPageIndex(page);
    if (!paginatedPortfolioEvents.find((p) => p.page === page)) {
      const response = await fetchMore({
        variables: {
          after: pageInfo?.endCursor,
          first: pageSize,
        },
      });

      if (response.data) {
        const events = response.data.portfolioV2?.portfolioEvents?.edges?.map((edge) => edge.node) || [];
        const orderedEvents = orderBy(events, 'start', 'asc');
        setPaginatedPortfolioEvents(orderedEvents, page);
        setPageInfo(response.data.portfolioV2?.portfolioEvents?.pageInfo);
      }
    }
    setLoading(false);
  };

  const handlePageSizeChange = (newSize: number) => {
    setLoading(true);
    setPageSize(newSize);
    setPageIndex(0);
    setPaginatedPortfolioEvents([], 0);
    fetchMore({
      variables: {
        first: newSize,
      },
    }).finally(() => setLoading(false));
  };

  const handleAssignContents = () => {
    assignContents({
      variables: {
        teamId,
        portfolioId,
        portfolioEventIds: selectedEventIds,
        assignedContentIds: includesAllContents ? [] : selectedContentIds,
        includesAllContents,
        contentRuleIds: selectedContentRules?.map((rule) => rule.contentRuleId),
      },
    })
      .then(({ data }) => {
        if (data?.assignContentsAndRulesToPortfolioEvents?.portfolioEvents) {
          toast.success('Contents successfully assigned to events');
          setSelectedEventIds([]);
          closeAssignContents();
          resetSelectedContentRules();
          track(EVENT.PORTFOLIO_EVENT_ASSIGN_CONTENTS);
          refetch().finally(() => setLoading(false));
        }
      })
      .catch((err) => {
        toast.error('Failed to assign contents to event');
        console.error('Failed to assign contents to event', err);
      });
  };

  const handleDeleteEvent = (eventId: number) => {
    deletePortfolioEvent({
      variables: {
        teamId,
        portfolioId,
        portfolioEventId: eventId,
      },
    })
      .then(() => {
        toast.success('Event deleted successfully');
        // Update both stores after successful deletion
        setPaginatedPortfolioEvents(
          currentPageEvents.filter((event) => event.portfolioEventId !== eventId),
          pageIndex,
        );

        track(EVENT.PORTFOLIO_EVENT_DELETE);
        // Recalculate page count
        setPageCount((prev) => Math.max(1, prev - 1));
        refetch().finally(() => setLoading(false));
        closeDeleteEventDialog();
      })
      .catch((err) => {
        toast.error('Failed to delete event');
        console.error('Failed to delete event', err);
      });
  };

  return (
    <div>
      <div className="flex justify-between">
        <div>
          <Typography style={{ color: nexyColors.neutral900 }} variant="h3">
            Events
          </Typography>
          <Typography style={{ color: nexyColors.neutral400, marginTop: 8 }} variant="paragraph">
            Create and manage events to impact contents during a timeframe.
          </Typography>
        </div>
        <div className="flex h-full gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button
                color="primary"
                variant="contained"
                size="small"
                endAdornment={<SvgCaretDown style={{ width: 14, height: 14, marginLeft: 8 }} />}
              >
                Create event
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full font-normal" align="end">
              <DropdownMenuItem onClick={toggleManuallyCreateEvent}>
                <FilePen className="mr-2 h-4 w-4" />
                <span>Add details manually</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={toggleUploadCsvEvents}>
                <Upload className="mr-2 h-4 w-4" />
                <span>Upload CSV file</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="mt-8 flex flex-col gap-4">
        {loading ? (
          <Spinner />
        ) : !currentPageEvents?.length ? (
          <NoDataFound
            style={{ height: 200 }}
            title="You don't have any events created yet"
            subtitle="Create an event to get started by clicking the green button above"
          />
        ) : (
          <>
            <WrapStyled>
              <GridWrap>
                <GridHeader style={{ justifyItems: 'start' }}>
                  <div>
                    <Checkbox
                      checked={selectedEventIds.length === currentPageEvents.length}
                      indeterminate={selectedEventIds.length > 0 && selectedEventIds.length < currentPageEvents.length}
                      onChange={() => {
                        if (selectedEventIds.length === currentPageEvents.length) {
                          setSelectedEventIds([]);
                        } else {
                          setSelectedEventIds(currentPageEvents.map((event) => event.portfolioEventId));
                        }
                      }}
                    />
                  </div>
                  <TypographyStyled>
                    <span>Name</span>
                  </TypographyStyled>
                  <TypographyStyledAligned>
                    <span>Timeframe</span>
                  </TypographyStyledAligned>
                  <TypographyStyledAligned>
                    <span>Category</span>
                  </TypographyStyledAligned>
                  <TypographyStyledAligned>
                    <span>Impact</span>
                  </TypographyStyledAligned>
                  <TypographyStyledAligned>
                    <span>Impacted contents</span>
                  </TypographyStyledAligned>
                  <TypographyStyledAligned>
                    <span>Created</span>
                  </TypographyStyledAligned>
                </GridHeader>

                {currentPageEvents?.map((event) => {
                  const totalImpactedContents = calculateImpactedContentsForEvent({
                    assignedContents: event?.assignedContents,
                    contentRules: event?.contentRules,
                  });

                  return (
                    <GridRow className="!p-4" key={event.portfolioEventId}>
                      <Styles.ContentRowStyled>
                        <Checkbox
                          checked={selectedEventIds.includes(event.portfolioEventId)}
                          onChange={() => handleSelectEvent(event.portfolioEventId)}
                        />
                      </Styles.ContentRowStyled>
                      <Styles.ContentRowStyled>
                        <div>
                          <Typography withTooltip={event?.name?.length > 30} withEllipsis style={{ maxWidth: 250 }}>
                            {event.name}
                          </Typography>
                          {event?.description ? (
                            <Tooltip
                              style={{
                                maxWidth: 500,
                                wordBreak: 'break-word',
                              }}
                              placement="right"
                              size="small"
                              variant="dark"
                              content={event.description}
                            >
                              <HoverableTooltip className="w-fit !cursor-text text-[9px] text-neutral-500">
                                Description
                              </HoverableTooltip>
                            </Tooltip>
                          ) : null}
                        </div>
                      </Styles.ContentRowStyled>
                      <div className="text-neutral-500">
                        <Typography>
                          {dayjs(event.start).format(READABLE_FORMAT)} - {dayjs(event.end).format(READABLE_FORMAT)}
                        </Typography>
                      </div>
                      <div className="text-neutral-500">
                        <Typography>{getCategoryInfo(event.category)?.title}</Typography>
                      </div>
                      <Styles.ContentRowStyled className="text-neutral-500">
                        <Typography style={{ display: 'flex', gap: 4, textTransform: 'capitalize' }}>
                          {event.impact?.toLowerCase()}
                        </Typography>
                      </Styles.ContentRowStyled>
                      <Styles.ContentRowStyled className="text-neutral-500">
                        <Typography style={{ display: 'flex', gap: 4 }}>
                          {event?.includesAllContents ? (
                            'All contents'
                          ) : totalImpactedContents ? (
                            <ImpactedContentsHoverCard
                              contents={event.assignedContents}
                              contentRules={event?.contentRules}
                              tooltip={
                                <div>
                                  {totalImpactedContents} {totalImpactedContents === 1 ? 'content' : 'contents'}
                                </div>
                              }
                            />
                          ) : (
                            <div className="text-neutral-200">Assign contents</div>
                          )}
                        </Typography>
                      </Styles.ContentRowStyled>
                      <Styles.ContentRowStyled className="text-neutral-500">
                        <Typography>{dayjs(event.created).format(READABLE_FORMAT)}</Typography>
                      </Styles.ContentRowStyled>
                      <Styles.ContentRowStyled>
                        <PortfolioEventTDM
                          portfolioEventId={event.portfolioEventId}
                          loading={false}
                          handleAssignContents={() => {
                            setSelectedEventIds([event.portfolioEventId]);
                            openAssignContents();
                          }}
                          handleEdit={() => {
                            setPortfolioEventToEdit(event);
                            toggleManuallyCreateEvent();
                          }}
                          handleDelete={() => {
                            setPortfolioEventToDelete(event);
                            openDeleteEventDialog();
                          }}
                        />
                      </Styles.ContentRowStyled>
                    </GridRow>
                  );
                })}
              </GridWrap>
            </WrapStyled>
          </>
        )}
      </div>

      <div className={cn('flex justify-end', selectedEventIds.length && 'pb-20')}>
        <PaginationControls
          showFirstPageButton={false}
          showLastPageButton={false}
          gotoPage={handlePageChange}
          canPreviousPage={pageIndex > 0}
          canNextPage={pageIndex < pageCount - 1}
          pageCount={pageCount}
          pageIndex={pageIndex}
          pageOptions={Array.from({ length: pageCount }, (_, i) => i)}
          pageSize={pageSize}
          setPageSize={handlePageSizeChange}
          nextPage={() => handlePageChange(pageIndex + 1)}
          previousPage={() => handlePageChange(pageIndex - 1)}
        />
      </div>

      {isOpenManuallyCreateEvent ? (
        <ManuallyCreatePortfolioEvent
          isOpen={isOpenManuallyCreateEvent}
          onClose={() => {
            toggleManuallyCreateEvent();
            setPortfolioEventToEdit(null);
            setLoading(true);
            refetch().finally(() => setLoading(false));
          }}
          portfolioEventToEdit={portfolioEventToEdit}
        />
      ) : null}
      {isOpenUploadCsvEvents ? (
        <UploadFileCreatePortfolioEvent
          isOpen={isOpenUploadCsvEvents}
          onClose={() => {
            toggleUploadCsvEvents();
            setLoading(true);
            refetch().finally(() => setLoading(false));
          }}
        />
      ) : null}
      {isDeleteEventDialogOpen ? (
        <ConfirmationDialog
          titleText="Delete event?"
          ctaText="Delete event"
          description={`${portfolioEventToDelete?.name} event will be deleted. This action is irreversible.`}
          onConfirm={() => handleDeleteEvent(portfolioEventToDelete?.portfolioEventId)}
          type="discard"
          disabled={loadingDeleteEvent}
          loading={loadingDeleteEvent}
          isOpen={isDeleteEventDialogOpen}
          onCancel={closeDeleteEventDialog}
        />
      ) : null}

      <div
        style={{ width: `calc(100% - ${sidebarWidth})`, left: sidebarWidth }}
        className={cn(
          'fixed bottom-0 border-t border-t-neutral-100 bg-seasalt px-8 py-5 transition-all',
          selectedEventIds.length ? 'opacity-100' : 'pointer-events-none z-[-1] hidden opacity-0',
        )}
      >
        <div className="flex justify-between">
          <Button color="tertiary" variant="contained" onClick={() => setSelectedEventIds([])}>
            Cancel
          </Button>

          <Button onClick={openAssignContents} color="primary" variant="contained">
            Assign contents
          </Button>
        </div>
      </div>
      <AlertDialog
        open={isAssignContentsOpen}
        onOpenChange={() => {
          setSelectedEventIds([]);
          closeAssignContents();
        }}
      >
        <AlertDialogContent className="flex h-[90vh] max-w-5xl flex-col pl-6">
          <div className="flex-1 overflow-auto pb-20">
            <AlertDialogTitle>
              <div className="mb-2 text-[20px] font-medium tracking-normal">Assign contents</div>
            </AlertDialogTitle>
            <AlertDialogDescription>
              <div className="text-md font-normal text-neutral-500">
                Select the content type and contents that are impacted by your event.
              </div>
            </AlertDialogDescription>

            <div className="max-w-[974px]">
              <PortfolioEventAssignContents
                renderTitle={false}
                portfolioEventToEdit={
                  selectedEventIds.length === 1
                    ? currentPageEvents.find((event) => event.portfolioEventId === selectedEventIds[0])
                    : null
                }
                selectedEventIds={selectedEventIds}
                setSelectedEventIds={setSelectedEventIds}
                setIncludesAllContents={setIncludesAllContents}
              />
            </div>
          </div>

          <AlertDialogFooter className="sticky border-t bg-white py-4">
            <AlertDialogAction>
              <ButtonAsync
                disabled={loadingAssignContents}
                onClick={closeAssignContents}
                variant="contained"
                color="secondary"
                size="small"
              >
                Cancel
              </ButtonAsync>
            </AlertDialogAction>

            <AlertDialogAction>
              <ButtonAsync
                onClick={handleAssignContents}
                disabled={loadingAssignContents}
                loading={loadingAssignContents}
                variant="contained"
                color="primary"
                size="small"
              >
                Save
              </ButtonAsync>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export const WrapStyled = styled.div`
  width: 100%;

  .NEXYCSSGrid {
    min-width: 100%;
    padding: 0 16px;
    grid-template-columns: 40px 2fr 1.6fr 1.3fr 0.5fr 1fr 0.5fr 30px;
  }
`;
