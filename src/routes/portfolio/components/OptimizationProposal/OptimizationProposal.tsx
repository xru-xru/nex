import React, { useEffect, useMemo, useState } from 'react';

import { useMutation } from '@apollo/client';
import dayjs from 'dayjs';
import { toast } from 'sonner';
import { StringParam, useQueryParams } from 'use-query-params';

import {
  NexoyaBudgetProposalDataApplicationType,
  NexoyaFunnelStepType,
  NexoyaOptimizationPerformance,
  NexoyaOptimizationStatus,
  NexoyaOptimizationType,
  NexoyaOptimizationV2,
  NexoyaTargetBiddingApplyMode,
} from 'types';

import { usePortfolio } from '../../../../context/PortfolioProvider';
import { CONCLUDE_OPTIMIZATION_BUDGET_PROPOSAL } from '../../../../graphql/optimization/mutationConcludeOptimizationBudgetProposal';
import { ACTIVE_OPTIMIZATION_QUERY } from '../../../../graphql/optimization/queryActiveOptimization';
import { OPTIMIZATION_LIST } from '../../../../graphql/optimization/queryOptimizationList';
import {
  OPTIMIZATION_PERFORMANCE_QUERY,
  useOptimizationPerformanceQuery,
} from '../../../../graphql/optimization/queryOptimizationPerformance';
import { useOptimizationBudget } from 'context/OptimizationBudget';
import { useChangeProposalDataApplicationTypeMutation } from 'graphql/budgetManager/mutationChangeProposalDataApplicationType';
import { useUpdateOptimization } from 'graphql/optimization/mutationUpdateOptimization';
import { useTeamQuery } from 'graphql/team/queryTeam';

import { track } from '../../../../constants/datadog';
import { EVENT } from '../../../../constants/events';
import { FEATURE_FLAGS } from '../../../../constants/featureFlags';
import { format } from 'utils/dates';

import { LogoIcon } from '../../../../components/Logo';
import MultipleSwitch from '../../../../components/MultipleSwitchFluid';
import { OptimizationWarningDialog } from '../../../../components/OptimizationWarningDialog';
import ButtonAsync from 'components/ButtonAsync';
import { useDialogState } from 'components/Dialog';
import ErrorBoundary from 'components/ErrorBoundary';
import Tooltip from 'components/Tooltip';
import Typography from 'components/Typography';
import SvgCheckCircle from 'components/icons/CheckCircle';
import {
  LoadingContent,
  LoadingWrapStyled,
  OptimizationDetailsTableContainer,
  StyledSidePanelActions,
} from 'routes/portfolio/styles/OptimizationProposal';

import NoData from '../../../kpi0/NoData';
import { OPTIMIZATION_STATUSES } from '../../Optimize';
import ProposalDialogSuccess from '../ProposalDIalogSuccess';
import ProposalDialog from '../ProposalDialog';
import { ExportAllocationXlsx } from './ExportAllocationXlsx';
import { OptimizationProposalTable } from './OptimizationProposalTable';
import { RemoveContentDialog } from './RemoveContentDialog';
import { MAKE_OPTIMIZATION_VISIBLE_TO_ALL_USERS } from '../../../../graphql/optimization/mutationMakeOptimizationVisibleToAllUsers';
import { extractFunnelSteps } from '../../../../utils/funnelSteps';
import useUserStore from '../../../../store/user';
import useFunnelStepsStore from '../../../../store/funnel-steps';

export const TABLE_VIEW_CONTENT_SECTIONS = [
  {
    id: 'impact-groups',
    text: 'Impact Groups',
  },
  {
    id: 'channels',
    text: 'Channels',
  },
  {
    id: 'labels',
    text: 'Labels',
  },
  {
    id: 'focus',
    text: 'Focus',
  },
  {
    id: 'all-content',
    text: 'All Content',
  },
];

export const TABLE_METRICS_SECTIONS = [
  {
    id: 'values',
    text: 'Values',
  },
  {
    id: 'cost-per',
    text: 'Cost-per',
  },
  {
    id: 'roas',
    text: 'Per-cost',
  },
];

type Props = {
  optimizationId: number;
  portfolioId: number;
  onBudgetApplied: (e: Date) => void;
  optimizationStatus: NexoyaOptimizationStatus;
  resetState: () => void;
  usedBudgetProposalTargetBiddingApplyMode: NexoyaTargetBiddingApplyMode;
};

export function OptimizationProposal({
  optimizationId,
  portfolioId,
  onBudgetApplied,
  optimizationStatus,
  resetState,
  usedBudgetProposalTargetBiddingApplyMode,
}: Props) {
  const [filteredTableContentSections, setFilteredTableContentSections] = useState(TABLE_VIEW_CONTENT_SECTIONS);

  const teamData = useTeamQuery();
  const teamId = teamData.data?.team?.team_id || 0;

  const [queryParams, setQueryParams] = useQueryParams({
    tableViewSwitch: StringParam,
    tableMetricsSwitch: StringParam,
    optimizationSwitch: StringParam,
  });

  const {
    data: optimizationPerformanceData,
    loading,
    refetch: refetchOptimizationPerformance,
  } = useOptimizationPerformanceQuery({
    portfolioId,
    optimizationId,
  });

  const {
    portfolioV2Info: {
      meta: { data: portfolioMeta },
    },
  } = usePortfolio();

  const { funnelSteps: allFunnelSteps } = useFunnelStepsStore();
  const { otherFunnelSteps: funnelSteps } = extractFunnelSteps(allFunnelSteps);

  const optimization: NexoyaOptimizationV2 = optimizationPerformanceData?.portfolioV2?.optimization;
  const isAttributed = portfolioMeta?.isAttributed;

  const [loadingProposal, setIsLoadingProposal] = React.useState(false);
  const [contentIdToRemove, setContentIdToRemove] = React.useState<number>();

  const optimizationPerformance: NexoyaOptimizationPerformance =
    optimizationPerformanceData?.portfolioV2.optimization.performance;

  const hasConversionValueFunnelStep = funnelSteps?.some((f) => f.type === NexoyaFunnelStepType.ConversionValue);

  const tableMetricsSections = TABLE_METRICS_SECTIONS.filter((section) =>
    section.id === 'roas' ? hasConversionValueFunnelStep : true,
  );

  const [changeProposalDataApplicationTypeMutation, { loading: changeProposalDataApplicationTypeLoading }] =
    useChangeProposalDataApplicationTypeMutation({
      optimizationId,
    });

  const { values: budgetValues } = useOptimizationBudget();
  const isBudgetApplied = budgetValues.find((v) => v.optimizationId === optimizationId);

  const { isOpen: isDialogOpen, toggleDialog, closeDialog } = useDialogState();
  const { isOpen: isSuccessDialogOpen, toggleDialog: toggleSuccessDialog } = useDialogState();
  const { isOpen: isRemoveDialogOpen, toggleDialog: toggleRemoveDialog } = useDialogState();
  const { isOpen: isDiscardDialogOpen, toggleDialog: toggleDiscardDialog } = useDialogState();
  const { isOpen: isMakeVisibleDialogOpen, toggleDialog: toggleMakeVisibleDialog } = useDialogState();

  const isThereData = optimizationPerformance?.contents[0]?.content?.title;
  const isPageLoading = loading || changeProposalDataApplicationTypeLoading;

  useEffect(() => {
    if (isAttributed) {
      setFilteredTableContentSections(TABLE_VIEW_CONTENT_SECTIONS.filter((s) => s.id !== 'impact-groups'));
    }
  }, [isAttributed]);

  // This effect ensures that default values are applied if the query params are not present in the URL
  useEffect(() => {
    const defaults = {
      tableViewSwitch:
        queryParams.tableViewSwitch || isAttributed
          ? filteredTableContentSections[1].id
          : filteredTableContentSections[0].id,
      tableMetricsSwitch: queryParams.tableMetricsSwitch || tableMetricsSections[0].id,
    };

    // Only update the URL with default values if they are missing
    if (!queryParams.tableViewSwitch || !queryParams.tableMetricsSwitch) {
      setQueryParams(defaults);
    }
  }, [
    portfolioId,
    optimizationId,
    queryParams,
    setQueryParams,
    tableMetricsSections,
    isAttributed,
    filteredTableContentSections,
  ]);

  const [updateOptimization] = useUpdateOptimization({
    portfolioId,
    optimizationId,
    dateApplied: format(new Date(), 'utcWithTime'),
  });

  const [concludeOptimization, { loading: loadingConcludeOptimization }] = useMutation(
    CONCLUDE_OPTIMIZATION_BUDGET_PROPOSAL,
  );

  const [makeOptimizationVisibleToAllUsers, { loading: makeOptimizationVisibleToAllUsersLoading }] = useMutation(
    MAKE_OPTIMIZATION_VISIBLE_TO_ALL_USERS,
  );

  const onlyVisibleToSupportUsers = optimization?.onlyVisibleToSupportUsers;
  const { isSupportUser } = useUserStore();

  async function fireProposal() {
    try {
      if (
        !teamData.data?.team?.featureFlags.some(
          (featureFlag) => FEATURE_FLAGS.NEXOYA_DEMO === featureFlag.name && featureFlag.status,
        )
      ) {
        setIsLoadingProposal(true);
        onBudgetApplied(dayjs().toDate());
        await concludeOptimization({
          variables: {
            teamId,
            optimizationId,
            accept: true,
          },
          refetchQueries: [
            {
              notifyOnNetworkStatusChange: true,
              query: OPTIMIZATION_LIST,
              variables: {
                status: NexoyaOptimizationStatus.Running,
                teamId,
                portfolioId,
              },
              fetchPolicy: 'network-only',
            },
            {
              notifyOnNetworkStatusChange: true,
              query: ACTIVE_OPTIMIZATION_QUERY,
              variables: {
                teamId,
                portfolioId,
              },
              fetchPolicy: 'network-only',
            },
          ],
        });
        await updateOptimization();
        track(EVENT.APPLY_PROPOSAL);
        setIsLoadingProposal(false);
      } else {
        console.log('ignoring budget application for demo team');
      }
      toggleDialog();
      toggleSuccessDialog();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
    }
  }

  /**
   * After the exclude dialog has been confirmed for an item,
   * change the budget proposal data entry's application type
   * (or create a new budget proposal if one doesn't already exist)
   */
  async function addToSkipped() {
    changeProposalDataApplicationTypeMutation({
      variables: {
        portfolioContentId: contentIdToRemove,
        newApplicationType: NexoyaBudgetProposalDataApplicationType.SkipFromProposal,
        optimizationId,
        // @ts-ignore
        portfolioId,
      },
      onCompleted: () => {
        refetchOptimizationPerformance();
        track(EVENT.SKIP_CONTENT_FROM_PROPOSAL, {
          contentId: contentIdToRemove,
        });
      },
    });
    toggleRemoveDialog();
  }

  const editRowProps = useMemo(() => {
    /**
     * Display the remove content from proposal dialog
     */
    function handleExclude(contentId: number) {
      setContentIdToRemove(contentId);
      toggleRemoveDialog();
    }

    /**
     * Include an excluded content back into the optimization by firing
     * the change proposal data entry application type. Will also update the UI
     * automatically via the graphql hooks.
     */
    function handleInclude(contentId: number) {
      changeProposalDataApplicationTypeMutation({
        variables: {
          portfolioContentId: contentId,
          newApplicationType: NexoyaBudgetProposalDataApplicationType.Auto,
          optimizationId,
          // @ts-ignore
          portfolioId,
        },
        onCompleted: () => {
          refetchOptimizationPerformance();
          track(EVENT.INCLUDE_CONTENT_TO_PROPOSAL, {
            contentId: contentIdToRemove,
          });
        },
      });
    }

    return { isPageLoading, handleInclude, handleExclude };
  }, [isPageLoading, changeProposalDataApplicationTypeMutation, toggleRemoveDialog]);

  return (
    <ErrorBoundary>
      {loading ? (
        <LoadingWrapStyled>
          <LogoIcon infinite={true} duration={1500} />
          <LoadingContent>
            <Typography variant="h1">Getting everything ready...</Typography>
            <Typography variant="h5">It might take up to a minute to load your detailed optimization.</Typography>
          </LoadingContent>
        </LoadingWrapStyled>
      ) : !isThereData ? (
        <NoData />
      ) : (
        <OptimizationDetailsTableContainer>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
            <MultipleSwitch
              sections={filteredTableContentSections}
              initial={queryParams.tableViewSwitch || TABLE_VIEW_CONTENT_SECTIONS[0].id}
              current={queryParams.tableViewSwitch}
              onToggle={(selectedOption) => {
                setQueryParams({
                  tableViewSwitch: selectedOption,
                });
              }}
            />
            <MultipleSwitch
              sections={tableMetricsSections}
              initial={queryParams.tableMetricsSwitch || tableMetricsSections[0].id}
              current={queryParams.tableMetricsSwitch}
              onToggle={(selectedOption) => {
                setQueryParams({
                  tableMetricsSwitch: selectedOption,
                });
              }}
            />
          </div>
          <OptimizationProposalTable
            optimizationPerformance={optimizationPerformance}
            optimization={optimization}
            editRowProps={editRowProps}
            usedBudgetProposalTargetBiddingApplyMode={usedBudgetProposalTargetBiddingApplyMode}
          />
        </OptimizationDetailsTableContainer>
      )}
      {!loading ? (
        <StyledSidePanelActions
          isNotInProgressView={
            queryParams.optimizationSwitch
              ? queryParams.optimizationSwitch !== OPTIMIZATION_STATUSES.RUNNING
              : !!queryParams.optimizationSwitch
          }
        >
          <ExportAllocationXlsx
            optimization={optimization}
            portfolio={portfolioMeta}
            disabled={!isThereData}
            loading={loading}
          />
          {portfolioMeta?.optimizationType === NexoyaOptimizationType.Manual ? (
            <ButtonAsync
              loading={loading}
              variant="contained"
              color="tertiary"
              disabled={true}
              style={{ marginLeft: 16 }}
            >
              Portfolio optimize mode is manual
            </ButtonAsync>
          ) : onlyVisibleToSupportUsers && isSupportUser ? (
            <>
              <ButtonAsync
                variant="contained"
                color="primary"
                disabled={isPageLoading}
                loading={loadingProposal || loading}
                style={{ marginLeft: 16 }}
                onClick={() => {
                  toggleMakeVisibleDialog();
                  track(EVENT.APPLY_PROPOSAL_DIALOG);
                }}
              >
                Make proposal visible to all users
              </ButtonAsync>
            </>
          ) : !isBudgetApplied &&
            optimizationStatus === NexoyaOptimizationStatus.Running &&
            !onlyVisibleToSupportUsers ? (
            <>
              <ButtonAsync
                variant="contained"
                color="tertiary"
                disabled={portfolioMeta?.optimizationType !== NexoyaOptimizationType.Auto || isPageLoading}
                loading={loadingProposal || loading}
                style={{ marginLeft: 16 }}
                onClick={() => {
                  toggleDiscardDialog();
                  track(EVENT.DISCARD_PROPOSAL_DIALOG);
                }}
              >
                Discard proposal
              </ButtonAsync>
              <ButtonAsync
                variant="contained"
                color="primary"
                disabled={portfolioMeta?.optimizationType !== NexoyaOptimizationType.Auto || isPageLoading}
                loading={loadingProposal || loading}
                style={{ marginLeft: 16 }}
                onClick={() => {
                  toggleDialog();
                  track(EVENT.APPLY_PROPOSAL_DIALOG);
                }}
              >
                Apply proposal
              </ButtonAsync>
            </>
          ) : !!isBudgetApplied && portfolioMeta?.optimizationType === NexoyaOptimizationType.Auto ? (
            <>
              <Tooltip
                placement="top"
                variant="dark"
                content={`Budget applied on ${format(isBudgetApplied.dateApplied, 'DD MMM YYYY')}`}
                popperProps={{
                  style: {
                    zIndex: 3305,
                  },
                }}
              >
                <span>
                  <ButtonAsync
                    loading={loading}
                    variant="contained"
                    color="primary"
                    disabled={true}
                    style={{ marginLeft: 16 }}
                  >
                    <SvgCheckCircle style={{ color: 'white' }} /> Budget re-allocated
                  </ButtonAsync>
                </span>
              </Tooltip>
            </>
          ) : null}
        </StyledSidePanelActions>
      ) : null}

      <ProposalDialog isOpen={isDialogOpen} loading={loadingProposal} onClose={closeDialog} onSubmit={fireProposal} />
      <ProposalDialogSuccess isOpen={isSuccessDialogOpen} toggleDialog={toggleSuccessDialog} onClose={() => {}} />
      <RemoveContentDialog isOpen={isRemoveDialogOpen} toggleDialog={toggleRemoveDialog} handleSubmit={addToSkipped} />
      <OptimizationWarningDialog
        title="Are you sure you want to discard the proposal?"
        subtitle="This action is irreversible, but you will still be able to see it."
        ctaText="Discard proposal"
        isDialogOpen={isDiscardDialogOpen}
        handleCloseDialog={toggleDiscardDialog}
        loading={loadingConcludeOptimization}
        onSubmit={() =>
          concludeOptimization({
            variables: {
              teamId,
              optimizationId,
              accept: false,
            },
            refetchQueries: [
              {
                notifyOnNetworkStatusChange: true,
                query: OPTIMIZATION_LIST,
                variables: {
                  teamId,
                  portfolioId,
                  status: NexoyaOptimizationStatus.Running,
                },
                fetchPolicy: 'network-only',
              },
              {
                notifyOnNetworkStatusChange: true,
                query: ACTIVE_OPTIMIZATION_QUERY,
                variables: {
                  teamId,
                  portfolioId,
                },
                fetchPolicy: 'network-only',
              },
            ],
          })
            .then(() => {
              toast.success('The optimization was discarded');
              track(EVENT.DISCARD_PROPOSAL);
              resetState();
            })
            .catch((reason) => toast.error(reason.message))
            .finally(() => toggleDiscardDialog())
        }
      />
      <OptimizationWarningDialog
        title="Are you sure you want to make the proposal visible to all users?"
        subtitle="This will allow users of the team to be able to view this proposal"
        ctaText="Make visible"
        isDialogOpen={isMakeVisibleDialogOpen}
        handleCloseDialog={toggleMakeVisibleDialog}
        loading={makeOptimizationVisibleToAllUsersLoading}
        ctaColor="primary"
        onSubmit={() =>
          makeOptimizationVisibleToAllUsers({
            variables: {
              teamId,
              optimizationId,
              portfolioId,
            },
            refetchQueries: [
              {
                notifyOnNetworkStatusChange: true,
                query: OPTIMIZATION_LIST,
                variables: {
                  teamId,
                  portfolioId,
                  status: NexoyaOptimizationStatus.Running,
                },
                fetchPolicy: 'network-only',
              },
              {
                notifyOnNetworkStatusChange: true,
                query: ACTIVE_OPTIMIZATION_QUERY,
                variables: {
                  teamId,
                  portfolioId,
                },
                fetchPolicy: 'network-only',
              },
              {
                notifyOnNetworkStatusChange: true,
                query: OPTIMIZATION_PERFORMANCE_QUERY,
                variables: {
                  teamId,
                  portfolioId,
                  optimizationId,
                },
                fetchPolicy: 'network-only',
              },
            ],
          })
            .then(() => {
              toast.success('The optimization was made visible to all users');
              track(EVENT.MAKE_VISIBLE);
              resetState();
            })
            .catch((reason) => toast.error(reason.message))
            .finally(() => toggleMakeVisibleDialog())
        }
      />
    </ErrorBoundary>
  );
}
