import React, { useEffect, useState } from 'react';

import { useLazyQuery } from '@apollo/client';
import { capitalize } from 'lodash';
import { BooleanParam, NumberParam, StringParam, useQueryParams } from 'use-query-params';

import { NexoyaOptimizationStatus, NexoyaOptimizationTaskStatus, NexoyaOptimizationV2 } from '../../types';

import { useTeam } from '../../context/TeamProvider';
import { useActiveOptimization } from '../../graphql/optimization/queryActiveOptimization';
import { OPTIMIZATION_LIST } from '../../graphql/optimization/queryOptimizationList';

import { track } from '../../constants/datadog';
import { EVENT } from '../../constants/events';
import { format } from '../../utils/dates';

import Button from '../../components/Button';
import ButtonAdornment from '../../components/ButtonAdornment';

import MultipleSwitch from '../../components/MultipleSwitchFluid';
import { useSidePanelState } from '../../components/SidePanel';
import SvgBudgetAutomaticDefault from '../../components/icons/BudgetAutomaticDefault';
import SvgCaretDown from '../../components/icons/CaretDown';
import SvgGauge from '../../components/icons/Gauge';
import SvgNexoyaLogo from '../../components/icons/NexoyaLogo';
import { OptimizationView } from './components/OptimizationView';
import { OptimizationProposal } from './components/OptimizationProposal';
import ErrorMessage from 'components/ErrorMessage';
import LoadingPlaceholder from 'components/LoadingPlaceholder';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../../components-ui/Command';
import { Popover, PopoverContent, PopoverTrigger } from '../../components-ui/Popover';

import { SidePanelContainerStyled } from './styles/OptimizationProposal';

import NoDataFound from './NoDataFound';
import useUserStore from '../../store/user';

type Props = {
  portfolioId: number;
};

export const OPTIMIZATION_STATUSES = {
  RUNNING: 'RUNNING',
  APPLIED: 'APPLIED',
  DISCARDED: 'DISCARDED',
  CANCELLED: 'CANCELLED',
};

export const OPTIMIZATION_SECTIONS = [
  {
    id: OPTIMIZATION_STATUSES.RUNNING,
    text: 'In progress',
  },
  {
    id: OPTIMIZATION_STATUSES.APPLIED,
    text: 'Applied',
  },
  {
    id: OPTIMIZATION_STATUSES.DISCARDED,
    text: 'Discarded',
  },
];

const OPTIMIZATIONS_PAGE_SIZE = 50;

function Optimize({ portfolioId }: Props) {
  const [queryParams, setQueryParams] = useQueryParams({
    optimization_id: NumberParam,
    optimizationSwitch: StringParam,
    expandedOptimizationView: BooleanParam,
  });
  const { teamId } = useTeam();
  const [open, setOpen] = useState(false);
  const {
    isOpen: isExpandedViewOpen,
    toggleSidePanel: toggleExpandedView,
    openSidePanel: openExpandedView,
    closeSidePanel: closeExpandedView,
  } = useSidePanelState({
    initialState: queryParams.expandedOptimizationView,
  });

  const [isViewLoading, setIsViewLoading] = useState(true);
  const [lastNodeCursor, setLastNodeCursor] = useState<string>();
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [optimizationsToShow, setOptimizationsToShow] = useState<NexoyaOptimizationV2[]>([]);
  const [selectedOptimization, setSelectedOptimization] = useState<NexoyaOptimizationV2>();

  const [loadOptimizationList, { loading, error, data: optimizationListData }] = useLazyQuery(OPTIMIZATION_LIST);
  const { data: activeOptimizationData, loading: activeOptimizationLoading } = useActiveOptimization({
    portfolioId,
  });

  const queryParamOptimizationId = queryParams.optimization_id;
  const activeOptimization: NexoyaOptimizationV2 = activeOptimizationData?.portfolioV2.activeOptimization;
  const visibleToAllUsers = !activeOptimization?.onlyVisibleToSupportUsers;
  const { isSupportUser } = useUserStore();

  const pageInfo = optimizationListData?.portfolioV2?.optimizations?.pageInfo;
  const activeOptimizationSwitch = queryParams.optimizationSwitch || NexoyaOptimizationStatus.Running;

  useEffect(() => {
    if (queryParams.expandedOptimizationView) {
      openExpandedView();
    } else {
      closeExpandedView();
    }
  }, [queryParams.expandedOptimizationView]);

  useEffect(() => {
    if (!portfolioId || !teamId) return;
    setIsViewLoading(true);
    switch (activeOptimizationSwitch) {
      case OPTIMIZATION_STATUSES.RUNNING:
        if (activeOptimization?.tasks.PROPOSAL_WAITING === NexoyaOptimizationTaskStatus.Running) {
          setOptimizationsToShow([activeOptimization]);
        } else {
          setOptimizationsToShow([]);
        }
        setIsViewLoading(false);
        break;
      case OPTIMIZATION_STATUSES.APPLIED:
        loadOptimizationList({
          variables: {
            teamId,
            portfolioId,
            status: OPTIMIZATION_STATUSES.APPLIED,
            first: OPTIMIZATIONS_PAGE_SIZE,
          },
        }).then(({ data }) => {
          const optiNodes = data?.portfolioV2?.optimizations?.edges?.map((edge) => edge.node);
          setOptimizationsToShow(optiNodes);
          setLastNodeCursor(data?.portfolioV2?.optimizations?.pageInfo?.endCursor);
          setIsViewLoading(false);
        });

        break;
      case OPTIMIZATION_STATUSES.DISCARDED:
        loadOptimizationList({
          variables: {
            teamId,
            portfolioId,
            status: OPTIMIZATION_STATUSES.DISCARDED,
            first: OPTIMIZATIONS_PAGE_SIZE,
          },
        }).then(({ data }) => {
          const optiNodes = data?.portfolioV2?.optimizations?.edges?.map((edge) => edge.node);
          setOptimizationsToShow(optiNodes);
          setLastNodeCursor(data?.portfolioV2?.optimizations?.pageInfo?.endCursor);
          setIsViewLoading(false);
        });
        break;
    }
  }, [activeOptimizationSwitch, activeOptimization]);

  useEffect(() => {
    if (isViewLoading) return;

    const selectedOpti = optimizationsToShow?.find(
      (optimization) => optimization.optimizationId === queryParamOptimizationId,
    );
    setSelectedOptimization(selectedOpti);

    // if the opti list is empty, remove the query param
    if (!optimizationsToShow?.length && !!queryParamOptimizationId) {
      setQueryParams({
        optimization_id: undefined,
      });
    }

    // if the opti cannot be found, preselect the first one
    if (!selectedOpti && optimizationsToShow?.length) {
      setQueryParams({
        optimization_id: optimizationsToShow[0]?.optimizationId,
      });
    }
  }, [optimizationsToShow, queryParamOptimizationId, isViewLoading]);

  // When popover opens, fetch all remaining pages to make search work properly
  useEffect(() => {
    if (!open || !teamId || !portfolioId) return;
    if (!pageInfo?.hasNextPage || isLoadingMore) return;

    const fetchAllPages = async () => {
      let currentCursor = lastNodeCursor;
      let hasMore = pageInfo.hasNextPage;

      while (hasMore && !isLoadingMore) {
        setIsLoadingMore(true);
        try {
          const { data } = await loadOptimizationList({
            variables: {
              teamId,
              portfolioId,
              status: activeOptimizationSwitch,
              first: OPTIMIZATIONS_PAGE_SIZE,
              after: currentCursor,
            },
          });

          const optimizations = data?.portfolioV2?.optimizations?.edges?.map((edge) => edge.node);
          if (optimizations?.length) {
            setOptimizationsToShow((prev) => [...prev, ...optimizations]);
          }

          currentCursor = data?.portfolioV2?.optimizations?.pageInfo?.endCursor;
          hasMore = data?.portfolioV2?.optimizations?.pageInfo?.hasNextPage;
        } catch (error) {
          console.error('Error fetching optimizations:', error);
          break;
        } finally {
          setIsLoadingMore(false);
        }
      }
    };

    fetchAllPages();
  }, [open, pageInfo?.hasNextPage, lastNodeCursor, activeOptimizationSwitch, teamId, portfolioId]);

  const resetState = () => {
    setOptimizationsToShow([]);
  };

  const onSelectOptimization = (optimizationId: number | undefined) => {
    setQueryParams({
      optimization_id: optimizationId,
    });
  };

  // If visibleToAllUsers is false, we should render the NoData for all users except for support users
  const shouldRenderNoData =
    !activeOptimizationLoading &&
    activeOptimizationSwitch === OPTIMIZATION_STATUSES.RUNNING &&
    ((!visibleToAllUsers && !isSupportUser) || !activeOptimization);

  // If visibleToAllUsers is true, we should render the optimization proposal, otherwise we only render it for support users
  const shouldRenderInProgressOptiProposal =
    activeOptimizationSwitch === OPTIMIZATION_STATUSES.RUNNING &&
    activeOptimization &&
    (visibleToAllUsers || isSupportUser);

  return (
    <>
      <div className="mb-6 flex min-h-[40px] items-center justify-between [&_.NEXYHelpCenter]:ml-auto">
        <MultipleSwitch
          sections={OPTIMIZATION_SECTIONS}
          initial={activeOptimizationSwitch}
          current={activeOptimizationSwitch}
          onToggle={(selectedOption) => {
            setQueryParams({
              optimizationSwitch: selectedOption,
            });
            track(EVENT.OPTIMIZE_SWITCH_STATUS(OPTIMIZATION_SECTIONS.find((os) => os.id === selectedOption)?.text));
          }}
        />
        {activeOptimizationSwitch !== OPTIMIZATION_STATUSES.RUNNING && optimizationsToShow?.length ? (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                active={open}
                variant="contained"
                color="secondary"
                flat
                type="button"
                style={{ color: '#2A2A32', boxShadow: '#eaeaea 0px 0px 0px 1px' }}
                startAdornment={
                  <ButtonAdornment position="start">
                    <SvgNexoyaLogo />
                  </ButtonAdornment>
                }
                endAdornment={
                  <ButtonAdornment position="end">
                    <SvgCaretDown
                      style={{
                        transform: `rotate(${open ? '180' : '0'}deg)`,
                        fill: '#A6A7B5',
                      }}
                    />
                  </ButtonAdornment>
                }
              >
                {format(selectedOptimization?.start, 'MMM DD', true)} -{' '}
                {format(selectedOptimization?.end, 'MMM DD YYYY', true)}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <Command>
                <CommandInput placeholder="Search optimizations..." />
                <CommandList className="max-h-[300px] overflow-y-auto">
                  {optimizationsToShow?.length === 0 ? (
                    <CommandEmpty>No optimizations found.</CommandEmpty>
                  ) : (
                    <CommandGroup>
                      {optimizationsToShow?.map((optimization) => (
                        <CommandItem
                          className="flex w-full justify-between"
                          key={optimization.optimizationId}
                          value={`${format(optimization.start, 'MMM DD', true)} - ${format(optimization.end, 'MMM DD YYYY', true)}`}
                          keywords={[
                            format(optimization.start, 'MMM DD YYYY', true),
                            format(optimization.end, 'MMM DD YYYY', true),
                          ]}
                          onSelect={() => {
                            onSelectOptimization(optimization.optimizationId);
                            setOpen(false);
                          }}
                        >
                          <div>
                            {format(optimization.start, 'MMM DD', true)} -{' '}
                            {format(optimization.end, 'MMM DD YYYY', true)}
                          </div>

                          <div className="text-neutral-500">({capitalize(selectedOptimization?.status)})</div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}
                  {isLoadingMore && (
                    <div className="py-2 text-center text-sm text-neutral-500">Loading all optimizations...</div>
                  )}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        ) : (
          <div />
        )}
      </div>

      {shouldRenderNoData ? (
        <NoDataFound
          icon={<SvgGauge />}
          title="No optimization in progress"
          subtitle="Once you will launch an optimization, you will be able to track the progress here."
        />
      ) : null}

      {!loading && activeOptimizationSwitch === OPTIMIZATION_STATUSES.APPLIED && optimizationsToShow?.length === 0 ? (
        <NoDataFound
          icon={<SvgBudgetAutomaticDefault />}
          title="No optimization applied"
          subtitle="Once you will apply the optimization proposal, you will see the history of the performance here."
          cta={
            <Button
              color="secondary"
              variant="contained"
              onClick={() =>
                setQueryParams({
                  optimizationSwitch: OPTIMIZATION_STATUSES.RUNNING,
                })
              }
            >
              See pending optimizations
            </Button>
          }
        />
      ) : null}

      {!loading && activeOptimizationSwitch === OPTIMIZATION_STATUSES.DISCARDED && optimizationsToShow?.length === 0 ? (
        <NoDataFound
          icon={<SvgGauge />}
          title="No optimization discarded"
          subtitle="Once you will discard an optimization proposal, you will see the history of the performance here."
          cta={
            <Button
              color="secondary"
              variant="contained"
              onClick={() =>
                setQueryParams({
                  optimizationSwitch: OPTIMIZATION_STATUSES.RUNNING,
                })
              }
            >
              See pending optimizations
            </Button>
          }
        />
      ) : null}

      {shouldRenderInProgressOptiProposal ? (
        <OptimizationView optimization={activeOptimization} portfolioId={portfolioId} resetState={resetState} />
      ) : null}

      {activeOptimizationSwitch !== OPTIMIZATION_STATUSES.RUNNING && selectedOptimization ? (
        <OptimizationView optimization={selectedOptimization} portfolioId={portfolioId} resetState={resetState} />
      ) : null}

      <SidePanelContainerStyled
        isOpen={isExpandedViewOpen}
        onClose={() => {
          setQueryParams({ expandedOptimizationView: false });
          toggleExpandedView();
        }}
        paperProps={{
          style: {
            width: '95%',
            height: '95%',
            bottom: 0,
            right: 'unset',
            borderRadius: '12px 12px 0 0',
          },
        }}
      >
        {selectedOptimization && queryParams.expandedOptimizationView ? (
          <OptimizationProposal
            optimizationStatus={selectedOptimization.status}
            optimizationId={selectedOptimization.optimizationId}
            portfolioId={portfolioId}
            resetState={resetState}
            usedBudgetProposalTargetBiddingApplyMode={selectedOptimization.usedBudgetProposalTargetBiddingApplyMode}
            onBudgetApplied={() => {}}
          />
        ) : null}
      </SidePanelContainerStyled>

      {loading || activeOptimizationLoading ? (
        <div className="h-screen pt-5 [&>div:nth-child(1)]:opacity-100 [&>div:nth-child(2)]:opacity-75 [&>div:nth-child(3)]:opacity-50 [&>div:nth-child(4)]:opacity-25 [&>div]:mb-4 [&>div]:h-10 [&>div]:bg-[#f4f6f7]">
          <LoadingPlaceholder />
          <LoadingPlaceholder />
          <LoadingPlaceholder />
          <LoadingPlaceholder />
        </div>
      ) : null}

      {error ? <ErrorMessage error={error} /> : null}
    </>
  );
}

export default Optimize;
