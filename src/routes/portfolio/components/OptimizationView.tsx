import React, { Fragment } from 'react';

import { capitalize } from 'lodash';

import {
  NexoyaOptimizationTaskStatus,
  NexoyaOptimizationV2,
  NexoyaPortfolioEventSnapshot,
  NexoyaPortfolioType,
  NexoyaPortfolioV2,
  NexoyaTargetBiddingApplyMode,
} from 'types';

import { useOptimizationBudget } from '../../../context/OptimizationBudget';
import { usePortfolio } from '../../../context/PortfolioProvider';
import { useRetryOptimizationDataFetches } from '../../../graphql/optimization/mutationRetryOptimizationDataFetches';
import { useSkipOptimizationDataFetches } from '../../../graphql/optimization/mutationSkipOptimizationDataFetches';

import { format } from '../../../utils/dates';

import Button from '../../../components/Button';
import { CalendarDateCard } from '../../../components/CalendarDateCard';
import FormattedCurrency from '../../../components/FormattedCurrency';
import Tooltip from '../../../components/Tooltip';
import SvgCheckInCircle from '../../../components/icons/CheckInCircle';
import SvgCheckInDashedCircle from '../../../components/icons/CheckInDashedCircle';
import SvgCircle from '../../../components/icons/Circle';
import SvgMinusCircle from '../../../components/icons/MinusCircle';
import SvgXCircleFill from '../../../components/icons/XCircleFill';

import * as Styles from '../styles/OptimizationInProgress';
import { getStatusStyles } from '../styles/OptimizationInProgress';

import { OptimizationProposal } from './OptimizationProposal';
import { OptimizationTDM } from './OptimizationTDM';
import { PortfolioTargetTypeSwitch } from '../../../components/PortfolioTypeSwitch';
import NumberValue from '../../../components/NumberValue';
import { HoverableTooltip, HoverCard, HoverCardContent, HoverCardTrigger } from '../../../components-ui/HoverCard';
import dayjs from 'dayjs';
import { cn } from 'lib/utils';
import { useOptimizationPortfolioEvents } from '../../../graphql/optimization/queryOptimizationPortfolioEvents';
import { useTenantName } from '../../../hooks/useTenantName';

type Props = {
  optimization: NexoyaOptimizationV2;
  portfolioId: number;
  resetState: () => void;
};

type CTA = {
  label: string;
  onClick: () => void;
  icon: any | null;
};

type OptimizationStage = {
  title: string;
  description: string;
  status: NexoyaOptimizationTaskStatus;
  successfulTitle?: string;
  cta?: CTA[] | null;
};

const OPTIMIZATION_HEADER_TAGS = [
  {
    label: 'Optimizing for',
    getValue: (_, portfolioMeta: NexoyaPortfolioV2) => portfolioMeta?.defaultOptimizationTarget?.title || '',
  },
  {
    label: 'Optimization budget',
    getValue: (optimization: NexoyaOptimizationV2) =>
      optimization?.totalBudget ? <FormattedCurrency amount={optimization?.totalBudget} /> : 'Computing...',
    renderFor: [NexoyaPortfolioType.Budget],
  },

  {
    label: 'Optimization target',
    getValue: (optimization: NexoyaOptimizationV2) =>
      optimization.target ? (
        <PortfolioTargetTypeSwitch
          renderForCPAType={() => <FormattedCurrency amount={optimization?.target} />}
          renderForROASType={() => <NumberValue value={optimization?.target} symbol="%" />}
        />
      ) : (
        'Computing...'
      ),
    renderFor: [NexoyaPortfolioType.CostPer, NexoyaPortfolioType.Roas, NexoyaPortfolioType.Amount],
  },
  {
    label: 'Max. period budget limit',
    getValue: (optimization: NexoyaOptimizationV2, portfolioMeta: Partial<NexoyaPortfolioV2>) => (
      <FormattedCurrency amount={optimization?.totalBudget ?? portfolioMeta?.activeTargetItem?.maxBudget} />
    ),
    renderFor: [NexoyaPortfolioType.CostPer, NexoyaPortfolioType.Roas, NexoyaPortfolioType.Amount],
  },
  {
    shouldRender: (optimization: NexoyaOptimizationV2) => !!optimization.usedBudgetProposalTargetBiddingApplyMode,
    label: 'Application Mode',
    getValue: (optimization: NexoyaOptimizationV2) => {
      if (!optimization.usedBudgetProposalTargetBiddingApplyMode) {
        return '';
      }
      switch (optimization.usedBudgetProposalTargetBiddingApplyMode) {
        case NexoyaTargetBiddingApplyMode.BudgetOnly:
          return (
            <Tooltip
              variant="dark"
              size="small"
              style={{
                maxWidth: 500,
                wordBreak: 'break-word',
              }}
              content="This mode automatically applies changes to the budget – nothing else is altered."
            >
              <span>Budget Only</span>
            </Tooltip>
          );
        case NexoyaTargetBiddingApplyMode.BiddingStrategyOnly:
          return (
            <Tooltip
              variant="dark"
              size="small"
              style={{
                maxWidth: 500,
                wordBreak: 'break-word',
              }}
              content="This mode automatically adjusts the bidding strategy for contents that have one. Otherwise, it automatically applies changes to the budget."
            >
              <span>Bidding Strategy Only</span>
            </Tooltip>
          );
        case NexoyaTargetBiddingApplyMode.BudgetAndBiddingStrategy:
          return (
            <Tooltip
              variant="dark"
              size="small"
              style={{
                maxWidth: 500,
                wordBreak: 'break-word',
              }}
              content="This mode automatically adjusts both changes to the budget and bidding strategy (where available)."
            >
              <span>Budget & Bidding Strategy</span>
            </Tooltip>
          );
        default:
          return null;
      }
    },
  },
];

const StatusIcon = ({ status }: { status: string }) => {
  switch (status) {
    case NexoyaOptimizationTaskStatus.Running:
      return <SvgCheckInDashedCircle style={{ width: 32, height: 32, color: getStatusStyles(status)?.color }} />;
    case NexoyaOptimizationTaskStatus.Successful:
      return <SvgCheckInCircle style={{ width: 32, height: 32, color: getStatusStyles(status)?.color }} />;
    case NexoyaOptimizationTaskStatus.Failed:
      return <SvgXCircleFill style={{ width: 32, height: 32, color: getStatusStyles(status)?.color }} />;
    case NexoyaOptimizationTaskStatus.Pending:
      return <SvgCircle style={{ width: 32, height: 32, color: getStatusStyles(status)?.color }} />;
    case NexoyaOptimizationTaskStatus.Skipped:
      return <SvgMinusCircle style={{ width: 32, height: 32, color: getStatusStyles(status)?.color }} />;
    default:
      return <SvgCircle style={{ width: 32, height: 32, color: getStatusStyles(status)?.color }} />;
  }
};

export const OptimizationView = ({ optimization, portfolioId, resetState }: Props) => {
  const [retryDataFetches] = useRetryOptimizationDataFetches({
    portfolioId,
    optimizationId: optimization.optimizationId,
  });
  const [skipDataFetches] = useSkipOptimizationDataFetches({
    portfolioId,
    optimizationId: optimization.optimizationId,
  });
  const tenantName = useTenantName();
  const {
    portfolioV2Info: {
      meta: { data: portfolioMeta },
    },
  } = usePortfolio();

  const { data: optimizationPortfolioEventsData } = useOptimizationPortfolioEvents({
    portfolioId,
    optimizationId: optimization?.optimizationId,
  });

  const optimizationPortfolioEvents: NexoyaPortfolioEventSnapshot[] =
    optimizationPortfolioEventsData?.portfolioV2?.optimization?.portfolioEvents;

  const isTargetPortfolio = portfolioMeta?.type !== NexoyaPortfolioType.Budget;

  const getOptimizationStage = (stageKey: string, stageStatus: NexoyaOptimizationTaskStatus): OptimizationStage => {
    switch (stageKey) {
      case 'FETCHING_DATA':
        return {
          title: 'Fetching Data',
          successfulTitle: 'Data fetched',
          description:
            'Gathering all the relevant data from all your connected channels to initiate the optimization process.',
          status: stageStatus,
          cta:
            stageStatus === NexoyaOptimizationTaskStatus.Failed
              ? [
                  {
                    icon: null,
                    label: 'Retry data fetch',
                    onClick: () => retryDataFetches(),
                  },
                  {
                    icon: null,
                    label: 'Skip data fetch',
                    onClick: () => skipDataFetches(),
                  },
                ]
              : null,
        };
      case 'COMPUTING_BUDGET':
        return {
          title: 'Computing optimization budget',
          successfulTitle: 'Budget calculated',
          description:
            'Analyzing financial parameters and resource allocations to calculate the most effective optimization budget for your portfolio.',
          status: stageStatus,
          cta: null,
        };
      case 'RUNNING_OPTIMIZATION':
        return {
          title: 'Running Optimization',
          successfulTitle: 'Optimization run',
          description:
            'The system is now crunching numbers and analyzing data patterns to identify the best optimization strategies.',
          status: stageStatus,
          cta: [
            {
              label: 'Learn more about the process',
              onClick: () =>
                window.open(
                  `https://www.${tenantName.toLowerCase()}.com/help/how-campaign-optimization-works/`,
                  '_blank',
                ),
              icon: null,
            },
          ],
        };
      case 'GENERATING_BUDGET_PROPOSAL':
        return {
          title: 'Generating Budget Proposal',
          successfulTitle: 'Proposal generated',
          description:
            'Based on the data analyzed, a budget proposal is being formulated to achieve maximum efficiency and results.',
          status: stageStatus,
          cta: null,
        };
      case 'PROPOSAL_WAITING':
        return {
          title: 'Proposal Waiting',
          successfulTitle: 'Optimization proposal',
          description:
            'The generated budget proposal is now pending review. It requires action, either approval or rejection, to proceed.',
          status: stageStatus,
          cta: null,
        };
      case 'APPLYING_BUDGET_PROPOSAL':
        return {
          title: 'Applying Budget Proposal',
          successfulTitle: 'Proposal application',
          description:
            'The approved budget proposal is now being applied, ensuring funds are allocated efficiently to achieve the desired outcomes.',
          status: stageStatus,
          cta: null,
        };
      default:
        throw new Error(`Unknown stage: ${stageKey}`);
    }
  };

  const activeOptimizationStages = Object.entries(optimization?.tasks || [])?.filter(([key]) => {
    if (key !== '__typename') {
      // if it's a target portfolio, we skip the COMPUTING_BUDGET stage
      return !(isTargetPortfolio && key === 'COMPUTING_BUDGET');
    }
  });
  const { addItem } = useOptimizationBudget();

  return (
    <>
      <Styles.Wrapper>
        <Styles.Header>
          <Styles.LeftHeader>
            <Styles.CalendarDateWrapper
              className={cn(`relative`, optimizationPortfolioEvents?.length ? '!pb-[26px]' : '')}
            >
              <CalendarDateCard date={optimization.start} />
              <Styles.CalendarDateDivider />
              <CalendarDateCard date={optimization.end} />
              {optimizationPortfolioEvents?.length ? (
                <HoverCard>
                  <HoverCardTrigger className="absolute bottom-[8px]">
                    <HoverableTooltip className="w-fit text-[9px]">This timeframe contains events</HoverableTooltip>
                  </HoverCardTrigger>
                  <HoverCardContent
                    side="bottom"
                    align="start"
                    className="flex w-full flex-col items-start justify-start !bg-darkGrey-100 text-white"
                  >
                    <div className="text-md mb-1">Events in this timeframe</div>
                    <div className="flex flex-col justify-start gap-1">
                      {optimizationPortfolioEvents.map((event, idx) => (
                        <div key={idx} className="flex w-full justify-between gap-4 text-xs">
                          <div className="text-xs font-medium">{event.name}</div>
                          <div>
                            {dayjs(event.start).format('MMM D YYYY')} - {dayjs(event.end).format('MMM D YYYY')}
                          </div>
                        </div>
                      ))}
                    </div>
                  </HoverCardContent>
                </HoverCard>
              ) : null}
            </Styles.CalendarDateWrapper>

            {OPTIMIZATION_HEADER_TAGS.map((tag, idx) => {
              if (
                (!tag.renderFor || tag.renderFor.includes(portfolioMeta?.type)) &&
                (!tag.shouldRender || tag.shouldRender(optimization))
              ) {
                return (
                  <Styles.HeaderTag key={idx}>
                    <Styles.HeaderTagLabel>{tag.label}</Styles.HeaderTagLabel>
                    <Styles.HeaderTagValue>{tag.getValue(optimization, portfolioMeta)}</Styles.HeaderTagValue>
                  </Styles.HeaderTag>
                );
              }
              return null;
            })}
          </Styles.LeftHeader>
          <Styles.RightHeader>
            <Styles.VerticalStepsContainer>
              {activeOptimizationStages.map(([stageKey, stageStatus], idx) => {
                // @ts-ignore
                const optimizationStage = getOptimizationStage(stageKey, stageStatus);
                return (
                  <Fragment key={idx}>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                      }}
                    >
                      <Tooltip variant="dark" placement="top" content={capitalize(optimizationStage.status)}>
                        <Styles.StatusNumber status={optimizationStage.status}>{idx + 1}</Styles.StatusNumber>
                      </Tooltip>
                      <span
                        style={{
                          fontSize: 9,
                          fontWeight: 500,
                          width: 58,
                          textAlign: 'center',
                          marginTop: 8,
                          wordBreak: 'keep-all',
                        }}
                      >
                        {optimizationStage.successfulTitle}
                      </span>
                    </div>
                    {idx < activeOptimizationStages.length - 1 && ( // Don't render if it's the last item
                      <Styles.VerticalStepLine status={optimizationStage.status} />
                    )}
                  </Fragment>
                );
              })}
            </Styles.VerticalStepsContainer>
            {optimization?.tasks ? (
              <OptimizationTDM
                portfolioId={portfolioId}
                optimizationId={optimization.optimizationId}
                optimizationStages={optimization.tasks}
              />
            ) : null}
          </Styles.RightHeader>
        </Styles.Header>
        <div>
          <Styles.StepsWrapper>
            {optimization.tasks ? (
              optimization.tasks.PROPOSAL_WAITING === NexoyaOptimizationTaskStatus.Running ? (
                <Styles.OptimizationProposalContainer>
                  <Styles.StepTextWrapper>
                    <Styles.StepTitle>Optimization proposal</Styles.StepTitle>
                    <Styles.StepDescription style={{ maxWidth: '100%', marginBottom: 32 }}>
                      Please review the generated proposal below. You can discard or apply the proposal
                    </Styles.StepDescription>
                  </Styles.StepTextWrapper>
                  <OptimizationProposal
                    optimizationStatus={optimization.status}
                    optimizationId={optimization.optimizationId}
                    portfolioId={portfolioId}
                    resetState={resetState}
                    usedBudgetProposalTargetBiddingApplyMode={optimization.usedBudgetProposalTargetBiddingApplyMode}
                    onBudgetApplied={(date) => {
                      addItem({
                        optimizationId: optimization.optimizationId,
                        dateApplied: format(date, 'DD MMM YYYY'),
                      });
                    }}
                  />
                </Styles.OptimizationProposalContainer>
              ) : (
                activeOptimizationStages.map(([stageKey, stageStatus], idx) => {
                  // @ts-ignore
                  const step = getOptimizationStage(stageKey, stageStatus);
                  return (
                    <Fragment key={idx}>
                      <Styles.Step status={step.status}>
                        <Styles.StepInfoWrapper>
                          <Styles.StepStatus>
                            <StatusIcon status={step.status} />
                            <Styles.StepIconLine status={step.status} />
                          </Styles.StepStatus>
                          <Styles.StepTextWrapper>
                            <Styles.StepTitle>{step.title}</Styles.StepTitle>
                            <Styles.StepDescription>{step.description}</Styles.StepDescription>
                          </Styles.StepTextWrapper>
                        </Styles.StepInfoWrapper>
                        <Styles.StepActionWrapper>
                          {step?.cta?.length
                            ? step.cta.map((cta, idx) => (
                                <Button
                                  key={cta.label + idx}
                                  variant="contained"
                                  size="small"
                                  color="secondary"
                                  onClick={cta.onClick}
                                >
                                  {cta.icon}
                                  {cta.label}
                                </Button>
                              ))
                            : null}
                        </Styles.StepActionWrapper>
                      </Styles.Step>
                      {idx !== activeOptimizationStages.length - 1 ? <Styles.StepDivider /> : null}
                    </Fragment>
                  );
                })
              )
            ) : (
              <Styles.OptimizationProposalContainer className="!pt-6">
                <OptimizationProposal
                  optimizationStatus={optimization.status}
                  optimizationId={optimization.optimizationId}
                  portfolioId={portfolioId}
                  resetState={resetState}
                  usedBudgetProposalTargetBiddingApplyMode={optimization.usedBudgetProposalTargetBiddingApplyMode}
                  onBudgetApplied={(date) => {
                    addItem({
                      optimizationId: optimization.optimizationId,
                      dateApplied: format(date, 'DD MMM YYYY'),
                    });
                  }}
                />
              </Styles.OptimizationProposalContainer>
            )}
          </Styles.StepsWrapper>
        </div>
      </Styles.Wrapper>
    </>
  );
};
