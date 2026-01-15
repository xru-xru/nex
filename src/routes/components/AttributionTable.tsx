import React, { useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { NetworkStatus } from '@apollo/client';
import { useTeam } from '../../context/TeamProvider';
import { useHistory } from 'react-router-dom';

import Button from '../../components/Button';
import GridHeader from '../../components/GridHeader/GridHeader';
import GridWrap from '../../components/GridWrap/GridWrap';
import Typography from '../../components/Typography';
import { PaginationControls } from '../../components/Table/PaginationControls';
import NoDataFound from '../portfolio/NoDataFound';
import SvgTarget from '../../components/icons/Target';
import { CreateAttributionModel } from './CreateAttributionModel';
import { Skeleton } from '../../components-ui/Skeleton';
import { HoverableTooltip, HoverCard, HoverCardContent, HoverCardTrigger } from '../../components-ui/HoverCard';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../components-ui/DropdownMenu';
import { ButtonStyled } from '../portfolio/components/PerformanceChartHeader/PerformanceChartHeader.styles';
import SvgSlidersHRegular from '../../components/icons/SlidersHRegular';
import Checkbox from '../../components/Checkbox';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../components-ui/AlertDialog';
import ButtonAsync from '../../components/ButtonAsync';
import AvatarProvider from '../../components/AvatarProvider';

import * as Styles from '../../components/PerformanceTable/styles';
import GridRow from '../../components/GridRow';
import {
  NexoyaAttributionModel,
  NexoyaAttributionModelStatus,
  NexoyaListAttributionModelsFilters,
  NexoyaPageInfo,
} from '../../types';
import { useListAttributionModelsQuery } from '../../graphql/attributionModel/queryListAttributionModels';
import { useDeleteAttributionModelMutation } from '../../graphql/attributionModel/deleteAttributionModel';
import { getStatusColor, getStatusLabel, StatusBadge } from './StatusBadge';
import { MoreOptionsButton } from './MoreOptions';

// Extended type to include file count for UI purposes
export type AttributionRunWithFiles = NexoyaAttributionModel & {
  fileCount: number;
};

const STATUS_OPTIONS = [
  { value: NexoyaAttributionModelStatus.Draft, label: 'Draft' },
  { value: NexoyaAttributionModelStatus.Running, label: 'Running' },
  { value: NexoyaAttributionModelStatus.Approved, label: 'Approved' },
  { value: NexoyaAttributionModelStatus.InReview, label: 'In Review' },
  { value: NexoyaAttributionModelStatus.Rejected, label: 'Rejected' },
  { value: NexoyaAttributionModelStatus.Cancelled, label: 'Cancelled' },
];

// Note: API does not provide files info yet; augment in UI with 0
const toRunWithFiles = (node: NexoyaAttributionModel): AttributionRunWithFiles => ({ ...node, fileCount: 0 });

export function AttributionTable() {
  const [selectedStatuses, setSelectedStatuses] = useState<NexoyaAttributionModelStatus[]>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pageInfo, setPageInfo] = useState<NexoyaPageInfo>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [paginatedModels, setPaginatedModels] = useState<Record<number, NexoyaAttributionModel[]>>({ 0: [] });
  const [modelToDelete, setModelToDelete] = useState<NexoyaAttributionModel | null>(null);

  const history = useHistory();
  const { teamId } = useTeam();

  // Build filters for API
  const filters = useMemo<NexoyaListAttributionModelsFilters>(() => {
    if (selectedStatuses.length === 0) return {} as any;
    return {
      status: selectedStatuses,
    } as unknown as NexoyaListAttributionModelsFilters;
  }, [selectedStatuses]);

  // Fetch list with proper pagination
  const { data, fetchMore, networkStatus, refetch } = useListAttributionModelsQuery({
    first: pageSize,
    filters,
    skip: !teamId || !filters,
    onCompleted: () => setLoading(false),
  });

  const [deleteAttributionModel, { loading: deleting }] = useDeleteAttributionModelMutation({
    onCompleted: () => {
      toast.success('Attribution model deleted successfully');
      setModelToDelete(null);
      refetch();
    },
  });

  const handleToggleStatus = (status: NexoyaAttributionModelStatus) => {
    setSelectedStatuses((prev) => {
      if (prev.includes(status)) {
        return prev.filter((s) => s !== status);
      }
      return [...prev, status];
    });
  };

  const handleRemoveStatus = (status: NexoyaAttributionModelStatus) => {
    setSelectedStatuses((prev) => prev.filter((s) => s !== status));
  };

  const handleClearAllFilters = () => {
    setSelectedStatuses([]);
  };

  // Update paginated data when query completes
  useEffect(() => {
    if (networkStatus === NetworkStatus.ready && data?.listAttributionModels) {
      const models = data.listAttributionModels.edges?.map((edge) => edge.node) || [];
      setPaginatedModels((prev) => ({ ...prev, [pageIndex]: models }));
      setPageInfo(data.listAttributionModels.pageInfo);
      setPageCount(data.listAttributionModels?.totalPages || 0);
    }
  }, [data, networkStatus, pageIndex, pageSize]);

  // Reset page index when filter changes
  useEffect(() => {
    setPageIndex(0);
    setPaginatedModels({ 0: [] });
    setLoading(true);
  }, [selectedStatuses]);

  // Reset page index if we're out of bounds after filter change
  useEffect(() => {
    if (pageIndex >= pageCount && pageCount > 0) {
      setPageIndex(0);
    }
  }, [pageCount, pageIndex]);

  const handleCreateAttributionModel = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleRunClick = (model: NexoyaAttributionModel) => {
    if (model.status === NexoyaAttributionModelStatus.Draft) {
      history.push(`/attributions/${model.attributionModelId}`);
    }
  };

  const handleView = (model: NexoyaAttributionModel) => {
    history.push(`/attributions/${model.attributionModelId}`);
  };

  const handleReview = (model: NexoyaAttributionModel) => {
    // TODO: Implement review functionality
    toast.success(`Review for ${model.name}`);
    history.push(`/attributions/${model.attributionModelId}`);
  };

  const handleArchive = (model: NexoyaAttributionModel) => {
    // TODO: Implement archive functionality
    toast.success(`${model.name} archived`);
  };

  const handleDeleteClick = (model: NexoyaAttributionModel) => {
    setModelToDelete(model);
  };

  const handleConfirmDelete = async () => {
    if (!modelToDelete) return;

    try {
      await deleteAttributionModel({
        variables: {
          attributionModelId: modelToDelete.attributionModelId,
          teamId,
        },
      });
    } catch (error) {
      toast.error('Failed to delete attribution model');
      console.error('Failed to delete attribution model', error);
    }
  };

  const handleCancelDelete = () => {
    setModelToDelete(null);
  };

  const handlePageChange = async (page: number) => {
    setLoading(true);
    setPageIndex(page);

    const response = await fetchMore({
      variables: {
        after: page > pageIndex ? pageInfo?.endCursor : null,
        before: page < pageIndex ? pageInfo?.startCursor : null,
        first: page > pageIndex ? pageSize : null,
        last: page < pageIndex ? pageSize : null,
      },
    });

    if (response.data) {
      const models = response.data.listAttributionModels?.edges?.map((edge) => edge.node) || [];
      setPaginatedModels((prev) => ({ ...prev, [page]: models }));
      setPageInfo(response.data.listAttributionModels?.pageInfo);
      setLoading(false);
    }
  };

  const handlePageSizeChange = (newSize: number) => {
    setLoading(true);
    setPageSize(newSize);
    setPageIndex(0);
    setPaginatedModels({ 0: [] });

    fetchMore({
      variables: { first: newSize },
    }).finally(() => setLoading(false));
  };

  const handlePreviousPage = () => {
    if (pageIndex > 0) {
      handlePageChange(pageIndex - 1);
    }
  };

  const handleNextPage = () => {
    if (pageInfo?.hasNextPage) {
      handlePageChange(pageIndex + 1);
    }
  };

  const paginatedRuns = useMemo<AttributionRunWithFiles[]>(() => {
    const models = paginatedModels[pageIndex] || [];
    return models.map((model) => toRunWithFiles(model));
  }, [paginatedModels, pageIndex]);

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Typography variant="h3" style={{ color: '#1f2937', marginBottom: 8 }}>
            Attributions
          </Typography>
          <Typography variant="paragraph" style={{ color: '#6b7280' }}>
            Create and manage Attribution Models to analyze your marketing performance.
          </Typography>
        </div>
        <Button onClick={handleCreateAttributionModel} color="primary" size="small" variant="contained">
          Create model
        </Button>
      </div>

      {/* Create Attribution Model Modal */}
      <CreateAttributionModel
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
        onReopen={() => setIsCreateModalOpen(true)}
        onCreated={refetch}
      />

      {/* Status Filter */}

      {/* Attribution Models Section */}
      <div className="mb-4">
        <div className="mb-4 flex w-full flex-col">
          <div className="flex justify-between">
            <div className="text-mdlg font-medium text-neutral-900">Attribution Models</div>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <ButtonStyled variant="contained" color="secondary">
                    <SvgSlidersHRegular />
                    <span className="ml-1.5">Filter by status</span>
                  </ButtonStyled>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-60 font-normal" align="start">
                  {STATUS_OPTIONS.map((option) => {
                    const isActive = selectedStatuses.includes(option.value);
                    return (
                      <DropdownMenuItem
                        key={option.value}
                        className="flex w-full justify-between"
                        onClick={(e) => {
                          e.preventDefault();
                          handleToggleStatus(option.value);
                        }}
                      >
                        <StatusBadge status={option.value} />
                        <Checkbox style={{ padding: 4 }} checked={isActive} color="dark" />
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          {/* Filter Chips */}
          {selectedStatuses.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center justify-end">
              {selectedStatuses.map((status) => {
                const statusOption = STATUS_OPTIONS.find((opt) => opt.value === status);
                return (
                  <div
                    key={status}
                    className="mr-2 inline-flex items-center rounded-md border border-neutral-100 px-2 py-1 text-sm text-neutral-800"
                  >
                    <div className={`h-2 w-2 rounded-full ${getStatusColor(status)}`} />
                    <span className="ml-2 font-medium">{getStatusLabel(statusOption?.value)}</span>
                    <button
                      onClick={() => handleRemoveStatus(status)}
                      className="ml-3 text-gray-500 hover:text-gray-700 focus:outline-none"
                      aria-label={`Remove ${statusOption?.label} filter`}
                    >
                      <span className="text-xs">✕</span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      {(loading || (paginatedRuns && paginatedRuns.length > 0)) && (
        <GridWrap
          gridTemplateColumns="3fr 1fr 1.5fr 2fr 1.5fr 2fr 1.5fr 40px"
          className="rounded-lg border border-b-0 border-gray-200 !pb-0"
        >
          {/* Table Header */}
          <GridHeader className="NEXYCSSGrid" style={{ padding: '12px 24px' }}>
            <Typography variant="caption" style={{ fontWeight: 600, textTransform: 'uppercase' }}>
              NAME
            </Typography>
            <Typography variant="caption" style={{ fontWeight: 600, textTransform: 'uppercase' }}>
              ID
            </Typography>
            <Typography variant="caption" style={{ fontWeight: 600, textTransform: 'uppercase' }}>
              CREATION DATE
            </Typography>
            <Typography variant="caption" style={{ fontWeight: 600, textTransform: 'uppercase' }}>
              TIMEFRAME
            </Typography>
            <Typography variant="caption" style={{ fontWeight: 600, textTransform: 'uppercase' }}>
              TARGET METRIC
            </Typography>
            <Typography variant="caption" style={{ fontWeight: 600, textTransform: 'uppercase' }}>
              SELECTED CHANNELS
            </Typography>
            <Typography variant="caption" style={{ fontWeight: 600, textTransform: 'uppercase' }}>
              STATUS
            </Typography>
          </GridHeader>

          {/* Table Rows */}
          {loading
            ? Array.from({ length: pageSize }).map((_, index) => (
                <GridRow
                  key={`skeleton-${index}`}
                  className="NEXYCSSGrid"
                  style={{ padding: '12px 24px', borderBottom: '1px solid #e5e7eb' }}
                >
                  <Styles.ContentRowStyled>
                    <Skeleton className="h-5 w-3/4" />
                  </Styles.ContentRowStyled>
                  <Styles.ContentRowStyled>
                    <Skeleton className="h-5 w-16" />
                  </Styles.ContentRowStyled>
                  <Styles.ContentRowStyled>
                    <Skeleton className="h-5 w-32" />
                  </Styles.ContentRowStyled>
                  <Styles.ContentRowStyled>
                    <Skeleton className="h-5 w-40" />
                  </Styles.ContentRowStyled>
                  <Styles.ContentRowStyled>
                    <Skeleton className="h-5 w-24" />
                  </Styles.ContentRowStyled>
                  <Styles.ContentRowStyled>
                    <Skeleton className="h-5 w-20" />
                  </Styles.ContentRowStyled>
                  <Styles.ContentRowStyled>
                    <Skeleton className="h-6 w-20" />
                  </Styles.ContentRowStyled>
                  <Styles.ContentRowStyled>
                    <Skeleton className="h-4 w-4" />
                  </Styles.ContentRowStyled>
                </GridRow>
              ))
            : paginatedRuns && paginatedRuns.length > 0
              ? paginatedRuns.map((run) => (
                  <GridRow
                    key={run.attributionModelId}
                    className="NEXYCSSGrid cursor-pointer transition-colors duration-150 hover:bg-gray-50"
                    style={{ padding: '12px 24px', borderBottom: '1px solid #e5e7eb' }}
                    onClick={() => handleRunClick(run)}
                  >
                    {/* NAME */}
                    <Styles.ContentRowStyled>
                      <Typography
                        variant="paragraph"
                        style={{ fontWeight: 500, color: '#1f2937' }}
                        withEllipsis
                        withTooltip={run.name.length > 20}
                      >
                        {run.name}
                      </Typography>
                    </Styles.ContentRowStyled>
                    {/* ID */}
                    <Styles.ContentRowStyled>
                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <HoverableTooltip
                            onClick={(e) => {
                              e.stopPropagation();
                              navigator.clipboard.writeText(String(run.attributionModelId));
                              toast.success('ID copied to clipboard');
                            }}
                          >
                            <Typography variant="paragraph" style={{ color: '#6b7280', fontSize: '13px' }}>
                              {String(run.attributionModelId).substring(0, 8)}
                            </Typography>
                          </HoverableTooltip>
                        </HoverCardTrigger>
                        <HoverCardContent side="top" className="w-auto p-3">
                          <div className="flex flex-col gap-1">
                            <Typography
                              variant="caption"
                              style={{ fontSize: '10px', color: '#9ca3af', textTransform: 'uppercase' }}
                            >
                              Full ID
                            </Typography>
                            <Typography
                              variant="paragraph"
                              style={{ fontSize: '12px', color: '#1f2937', fontFamily: 'monospace' }}
                            >
                              {run.attributionModelId}
                            </Typography>
                            <Typography
                              variant="caption"
                              style={{ fontSize: '10px', color: '#6b7280', marginTop: '4px' }}
                            >
                              Click to copy
                            </Typography>
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                    </Styles.ContentRowStyled>
                    {/* CREATION DATE */}
                    <Styles.ContentRowStyled>
                      <Typography variant="paragraph" style={{ color: '#6b7280' }}>
                        {dayjs(run.createdAt).format('MMM D, YYYY')}
                      </Typography>
                    </Styles.ContentRowStyled>
                    {/* TIMEFRAME */}
                    <Styles.ContentRowStyled>
                      <Typography variant="paragraph" style={{ color: '#6b7280' }}>
                        {dayjs(run.exportStart).format('MMM D YYYY')} -{' '}
                        {run.exportEnd ? dayjs(run.exportEnd).format('MMM D YYYY') : 'present'}
                      </Typography>
                    </Styles.ContentRowStyled>
                    {/* TARGET METRIC */}
                    <Styles.ContentRowStyled>
                      <Typography variant="paragraph" style={{ color: '#6b7280' }}>
                        {run?.targetMetric}
                      </Typography>
                    </Styles.ContentRowStyled>
                    {/* SELECTED CHANNELS */}
                    <Styles.ContentRowStyled>
                      <div className="flex items-center gap-1">
                        {run.channelFilters.length > 0 ? (
                          <>
                            {run.channelFilters.slice(0, 3).map((channel) => (
                              <AvatarProvider key={channel.providerId} providerId={channel.providerId} size={20} />
                            ))}
                            {run.channelFilters.length > 3 && (
                              <span className="text-sm font-medium text-neutral-600">
                                +{run.channelFilters.length - 3}
                              </span>
                            )}
                          </>
                        ) : (
                          <Typography variant="paragraph" style={{ color: '#6b7280' }}>
                            -
                          </Typography>
                        )}
                      </div>
                    </Styles.ContentRowStyled>
                    {/* STATUS */}
                    <Styles.ContentRowStyled>
                      <StatusBadge status={run?.status} />
                    </Styles.ContentRowStyled>
                    {/* Actions column (no header) */}
                    <Styles.ContentRowStyled>
                      <MoreOptionsButton
                        run={run}
                        onView={() => handleView(run)}
                        onReview={() => handleReview(run)}
                        onArchive={() => handleArchive(run)}
                      />
                    </Styles.ContentRowStyled>
                  </GridRow>
                ))
              : null}
        </GridWrap>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!modelToDelete} onOpenChange={(open) => !open && handleCancelDelete()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete attribution model</AlertDialogTitle>
            <AlertDialogDescription className="font-normal">
              Are you sure you want to delete the "{modelToDelete?.name}" attribution model? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button size="small" variant="contained" color="secondary" disabled={deleting}>
                Cancel
              </Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <ButtonAsync
                size="small"
                variant="contained"
                color="danger"
                loading={deleting}
                onClick={handleConfirmDelete}
              >
                Delete
              </ButtonAsync>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Pagination Controls */}
      <div className="mt-2 flex w-full justify-end">
        {!loading && paginatedRuns && paginatedRuns.length > 0 && (
          <PaginationControls
            gotoPage={handlePageChange}
            canPreviousPage={pageIndex > 0}
            canNextPage={pageInfo?.hasNextPage}
            pageCount={pageCount}
            pageIndex={pageIndex}
            pageOptions={Array.from({ length: pageCount }, (_, i) => i)}
            pageSize={pageSize}
            setPageSize={handlePageSizeChange}
            nextPage={handleNextPage}
            previousPage={handlePreviousPage}
            showFirstPageButton={false}
            showLastPageButton={false}
          />
        )}
      </div>
      {/* Empty States */}
      {!loading && (!paginatedRuns || paginatedRuns.length === 0) && (
        <NoDataFound
          style={{ height: 200 }}
          icon={<SvgTarget style={{ color: '#6b7280' }} />}
          title={filters?.status?.length ? 'No models match this filter' : 'No attribution models found'}
          subtitle={
            filters?.status?.length
              ? 'Try adjusting your filter criteria to see more results.'
              : 'Get started by creating your first attribution model.'
          }
        />
      )}
    </div>
  );
}
