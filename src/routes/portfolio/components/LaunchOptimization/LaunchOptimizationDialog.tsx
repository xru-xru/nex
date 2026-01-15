import React, { useEffect, useState } from 'react';

import dayjs from 'dayjs';
import { toast } from 'sonner';

import { NexoyaNewOptimizationSummary, NexoyaPortfolioType } from '../../../../types';

import { usePortfolio } from '../../../../context/PortfolioProvider';
import { useCreateOptimization } from '../../../../graphql/optimization/mutationCreateOptimization';
import { useActiveOptimization } from '../../../../graphql/optimization/queryActiveOptimization';
import { useNewOptimizationSummary } from '../../../../graphql/optimization/queryNewOptimizationSummary';

import { track } from '../../../../constants/datadog';
import { EVENT } from '../../../../constants/events';
import { PORTFOLIO_FEATURE_FLAGS } from '../../../../constants/featureFlags';
import { format, GLOBAL_DATE_FORMAT } from '../../../../utils/dates';

import Button from '../../../../components/Button';
import ButtonAsync from '../../../../components/ButtonAsync';
import ButtonIcon from '../../../../components/ButtonIcon';
import Checkbox from '../../../../components/Checkbox';
import { SingleDateSelector } from '../../../../components/DateSelector';
import { useDialogState } from '../../../../components/Dialog';
import FormattedCurrency from '../../../../components/FormattedCurrency';
import Tooltip from '../../../../components/Tooltip';
import { CancelIcon } from '../../../../components/icons';
import Calendar from '../../../../components/icons/Calendar';
import SvgWarning from '../../../../components/icons/Warning';

import { BrickLoader } from '../../../Portfolio';
import { LaunchOptimizationSuccessDialog } from './LaunchOptimizationSuccessDialog';
import {
  DatepickerLabelStyled,
  DateSelectorWrapper,
  DialogActionsStyled,
  DialogContentStyled,
  DialogHeaderStyled,
  DialogStyled,
  DialogSubtitleStyled,
  DialogTitle,
  ErrorStatusWrapper,
  StatusContainer,
  StatusesContainer,
  StatusWrapperStyled,
} from './styles';
import usePortfolioEventsStore from '../../../../store/portfolio-events';
import { getPortfolioEventsWithinTimeframe } from '../../utils/portfolio-events';
import { useCurrencyExchangeTimeframesQuery } from '../../../../graphql/currency/queryCurrencyExchangeTimeframes';
import { useCurrencyStore } from '../../../../store/currency-selection';
import PortfolioFeatureSwitch from '../../../../components/PortfolioFeatureSwitch';
import usePortfolioMetaStore from '../../../../store/portfolio-meta';
import SvgWarningTwo from '../../../../components/icons/WarningTwo';
import { Link } from 'react-router-dom';
import Switch from '../../../../components/Switch';
import { nexyColors } from '../../../../theme';
import SvgInfoCircle from '../../../../components/icons/InfoCircle';
import { TooltipV2 } from '../../../../components/Tooltip/TooltipV2';
import { toArray } from 'lodash';

enum Weekdays {
  Monday = 'MONDAY',
  Tuesday = 'TUESDAY',
  Wednesday = 'WEDNESDAY',
  Thursday = 'THURSDAY',
  Friday = 'FRIDAY',
  Saturday = 'SATURDAY',
  Sunday = 'SUNDAY',
}

const getErrorMessages = (summary: NexoyaNewOptimizationSummary, isTargetPortfolio: boolean, skipErrors: any) => {
  const errorMessages = [];

  if (isTargetPortfolio && summary?.isOptiPeriodSpanningMultipleTargetItems) {
    errorMessages.push({
      id: 'isOptiPeriodSpanningMultipleTargetItems',
      message: 'The optimization overlaps multiple target items.',
      isSkippable: false,
      isSkipped: false,
    });
  }
  if (isTargetPortfolio && !summary?.targetItem?.targetItemId) {
    errorMessages.push({
      id: 'noTargetItem',
      message: 'Optimizing requires a planned target item. Please define at least one to proceed.',
      isSkippable: false,
      isSkipped: false,
    });
  }
  if (!isTargetPortfolio && !summary?.totalBudget) {
    errorMessages.push({
      id: 'noBudget',
      message: 'Optimizing requires a planned budget item. Please define at least one to proceed.',
      isSkippable: false,
      isSkipped: false,
    });
  }
  if (!summary?.isCustomImportDataFresh) {
    errorMessages.push({
      id: 'isCustomImportDataFresh',
      message: 'Your custom import data appears to be outdated. Please refresh it to proceed.',
      isSkippable: true,
      isSkipped: skipErrors.isCustomImportDataFresh,
    });
  }
  if (!summary?.allContentsHaveImpactGroupAssigned) {
    errorMessages.push({
      id: 'allContentsHaveImpactGroupAssigned',
      message: 'Please ensure each content item is assigned to an impact group.',
      isSkippable: true,
      isSkipped: skipErrors.allContentsHaveImpactGroupAssigned,
    });
  }

  // Attribution validation
  if (summary?.attribution?.hasErrors) {
    const contentWithNoAttributionRules = summary.attribution.contentWithNoAttributionRules;
    if (contentWithNoAttributionRules?.length > 0) {
      const contentList = contentWithNoAttributionRules.map((content) => `  • ${content.title}`).join('\n');
      errorMessages.push({
        id: 'contentWithNoAttributionRules',
        message: `The following content items are missing attribution rules:\n${contentList}`,
        isSkippable: false,
        isSkipped: skipErrors.contentWithNoAttributionRules,
      });
    }

    const attributionRuleWithNoFactors = summary.attribution.attributionRuleWithNoFactors;
    if (attributionRuleWithNoFactors?.length > 0) {
      const ruleNames = attributionRuleWithNoFactors.map((rule) => rule.name).join(', ');
      errorMessages.push({
        id: 'attributionRuleWithNoFactors',
        message: `The following attribution rules have no factors defined: ${ruleNames}`,
        isSkippable: false,
        isSkipped: skipErrors.attributionRuleWithNoFactors,
      });
    }
  }

  return errorMessages;
};

export const LaunchOptimizationDialog = ({ portfolioId }) => {
  const [skipErrors, setSkipErrors] = useState({
    isCustomImportDataFresh: false,
    allContentsHaveImpactGroupAssigned: false,
    contentWithNoAttributionRules: false,
    attributionRuleWithNoFactors: false,
  });
  const localStorageKey = `rememberIgnoreWeekdaysSelection-${portfolioId}`;
  const [rememberIgnoreWeekdaysSelection, setRememberIgnoreWeekdaysSelection] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(localStorageKey);
      return stored ? JSON.parse(stored) : false;
    } catch {
      return false;
    }
  });
  const [ignoreWeekdaysEnabled, setIgnoreWeekdaysEnabled] = useState<boolean>(false);
  const [selectedWeekdays, setSelectedWeekdays] = useState<Set<Weekdays>>(new Set());
  const [optimizationEndDate, setOptimizationEndDate] = useState<Date | null>(dayjs().add(6, 'd').toDate());
  const {
    data: summaryData,
    loading: summaryLoading,
    error: summaryError,
  } = useNewOptimizationSummary({
    portfolioId,
    end: dayjs(optimizationEndDate).format(GLOBAL_DATE_FORMAT),
  });

  useCurrencyExchangeTimeframesQuery();
  const { missingCurrencyCoverage } = useCurrencyStore();

  const { data: activeOptimizationData, loading } = useActiveOptimization({ portfolioId });
  const [createOptimization, { loading: loadingOptimization }] = useCreateOptimization({
    portfolioId,
    end: dayjs(optimizationEndDate).format(GLOBAL_DATE_FORMAT),
    skipCustomImportCheck: skipErrors.isCustomImportDataFresh,
  });
  const {
    portfolioV2Info: {
      meta: { data: portfolioMeta },
    },
  } = usePortfolio();
  const { portfolioEvents } = usePortfolioEventsStore();
  const { portfolioMeta: portfolioMetaFromStore } = usePortfolioMetaStore();

  const { isOpen, toggleDialog } = useDialogState({
    initialState: false,
  });

  const {
    isOpen: isOpenSuccessDialog,
    toggleDialog: toggleSuccessDialog,
    closeDialog,
  } = useDialogState({
    initialState: false,
  });

  const isTargetPortfolio = portfolioMeta?.type !== NexoyaPortfolioType.Budget;
  const targetFunnelStep = portfolioMeta?.defaultOptimizationTarget;

  const hasPendingOptimizations = !!activeOptimizationData?.portfolioV2?.activeOptimization;
  const targetItem = summaryData?.newOptimizationSummary?.targetItem;
  const totalBudget = summaryData?.newOptimizationSummary?.totalBudget;

  const errorMessages = getErrorMessages(summaryData?.newOptimizationSummary, isTargetPortfolio, skipErrors);

  const isIgnoreWeekdaysFeatureEnabled = portfolioMetaFromStore?.featureFlags?.some(
    (ff) => ff.name === PORTFOLIO_FEATURE_FLAGS.IGNORE_WEEKDAYS && ff.status,
  );

  useEffect(() => {
    if (
      isIgnoreWeekdaysFeatureEnabled &&
      rememberIgnoreWeekdaysSelection &&
      summaryData?.newOptimizationSummary?.ignoreWeekdays
    ) {
      const ignoreWeekdays = summaryData.newOptimizationSummary.ignoreWeekdays;
      if (ignoreWeekdays && ignoreWeekdays.length > 0) {
        setIgnoreWeekdaysEnabled(true);
        setSelectedWeekdays(
          new Set(ignoreWeekdays.filter((day): day is Weekdays => Object.values(Weekdays).includes(day as Weekdays))),
        );
      }
    }
  }, [
    isIgnoreWeekdaysFeatureEnabled,
    rememberIgnoreWeekdaysSelection,
    summaryData?.newOptimizationSummary?.ignoreWeekdays,
  ]);

  useEffect(() => {
    try {
      localStorage.setItem(localStorageKey, JSON.stringify(rememberIgnoreWeekdaysSelection));
    } catch {
      // Silently fail if localStorage is not available
    }
  }, [rememberIgnoreWeekdaysSelection, localStorageKey]);

  const toggleWeekday = (weekday: Weekdays) => {
    setSelectedWeekdays((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(weekday)) {
        newSet.delete(weekday);
      } else {
        newSet.add(weekday);
      }
      return newSet;
    });
  };

  const handleSuccess = () => {
    const ignoreWeekdays = ignoreWeekdaysEnabled && selectedWeekdays.size > 0 ? Array.from(selectedWeekdays) : null;
    createOptimization({
      variables: {
        ...(ignoreWeekdays && { ignoreWeekdays }),
      },
    })
      .then(() => {
        toggleDialog();
        toggleSuccessDialog();
        track(EVENT.LAUNCH_OPTIMIZATION, {
          portfolioId,
          start: dayjs().startOf('day').format(GLOBAL_DATE_FORMAT),
          end: dayjs(optimizationEndDate).format(GLOBAL_DATE_FORMAT),
          totalBudget,
          ignoreWeekdays: toArray(selectedWeekdays),
        });
      })
      .catch((reason) => toast.error(reason.message));
  };
  const diffDays = dayjs(optimizationEndDate).endOf('day').diff(dayjs().startOf('day'), 'd') + 1;

  const portfolioEventsWithinTimeframe = getPortfolioEventsWithinTimeframe({
    portfolioEvents,
    start: dayjs(),
    end: optimizationEndDate,
  });

  return (
    <>
      <LaunchOptimizationSuccessDialog
        plannedBudget={totalBudget}
        timeframe={{ start: dayjs().startOf('d')?.toDate(), end: optimizationEndDate }}
        isOpen={isOpenSuccessDialog}
        onClose={closeDialog}
        isTargetPortfolio={isTargetPortfolio}
      />
      <ButtonAsync
        loading={loading}
        disabled={loading || hasPendingOptimizations}
        color="primary"
        variant="contained"
        className="!h-auto"
        onClick={() => {
          toggleDialog();
          track(EVENT.LAUNCH_OPTIMIZATION_DIALOG);
        }}
      >
        Launch optimization
      </ButtonAsync>
      <DialogStyled
        isOpen={isOpen}
        position="center"
        onClose={toggleDialog}
        paperProps={{
          style: {
            maxWidth: '662px',
            borderRadius: '12px',
          },
        }}
        backdropProps={{
          variant: 'dark',
        }}
        hideCloseButton={true}
      >
        <DialogHeaderStyled>
          <DialogTitle>
            <Calendar style={{ filter: 'grayscale(1)' }} />
            Launch an optimization
          </DialogTitle>
          <ButtonIcon onClick={toggleDialog}>
            <CancelIcon />
          </ButtonIcon>
        </DialogHeaderStyled>
        <DialogContentStyled>
          <DialogSubtitleStyled>
            The optimization will be launched today and we’ll notify you once it’s ready. It might take up to ~4hours to
            receive the results.
          </DialogSubtitleStyled>
          <DateSelectorWrapper>
            <DatepickerLabelStyled>Optimization end date</DatepickerLabelStyled>
            <SingleDateSelector
              disableAfterDate={dayjs(portfolioMeta?.end).toDate()}
              disableBeforeDate={dayjs().endOf('d').toDate()}
              onDateChange={({ selectedDate }) => setOptimizationEndDate(selectedDate)}
              selectedDate={optimizationEndDate}
              renderInputValue={(date) => {
                return (
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <span>{dayjs(date).format('DD MMMM YYYY')}</span>
                    <span style={{ color: '#2A2A3273' }}>
                      Duration: {diffDays} day{diffDays > 1 ? 's' : ''}
                    </span>
                  </div>
                );
              }}
            />
          </DateSelectorWrapper>
          <PortfolioFeatureSwitch
            features={[PORTFOLIO_FEATURE_FLAGS.IGNORE_WEEKDAYS]}
            renderOld={() => null}
            renderNew={() => (
              <>
                <div className="flex flex-col gap-2">
                  Advanced settings
                  <div className="flex gap-2">
                    <Switch
                      onToggle={() => setIgnoreWeekdaysEnabled((prevState) => !prevState)}
                      isOn={ignoreWeekdaysEnabled}
                    />
                    Exclude specific weekdays from past data
                    <TooltipV2
                      contentClassName="max-w-[343px] break-words"
                      content="Excluded weekdays apply only to past data when computing your recent average spend. Future predictions remain unchanged."
                      variant="dark"
                    >
                      <div>
                        <SvgInfoCircle style={{ color: nexyColors.neutral400, height: 16, width: 16 }} />
                      </div>
                    </TooltipV2>
                  </div>
                  {ignoreWeekdaysEnabled ? (
                    <div className="mt-4 duration-300 animate-in fade-in slide-in-from-top-2">
                      <div className="font-normal text-neutral-600">Select the days to exclude:</div>
                      <div className="mt-3 flex gap-2">
                        {Object.values(Weekdays).map((weekday) => {
                          const isSelected = selectedWeekdays.has(weekday);
                          return (
                            <button
                              key={weekday}
                              type="button"
                              onClick={() => toggleWeekday(weekday)}
                              className={`min-w-[58px] rounded-[32px] border px-3 py-2 font-medium transition-all duration-200 ${
                                isSelected
                                  ? 'border-neutral-200 bg-neutral-100 text-neutral-600 shadow-sm'
                                  : 'border-neutral-100 bg-neutral-50 text-neutral-500 hover:border-neutral-200 hover:bg-neutral-100'
                              } active:scale-95`}
                            >
                              {weekday.substring(0, 3)}
                            </button>
                          );
                        })}
                      </div>
                      <div className="mt-2 flex items-center text-xs font-medium text-neutral-400">
                        <Checkbox
                          className="!pl-0 !pr-1.5"
                          label="Use this weekday setup for future baseline calculations in this portfolio."
                          onClick={() => setRememberIgnoreWeekdaysSelection((prevState) => !prevState)}
                          checked={rememberIgnoreWeekdaysSelection}
                        />
                      </div>
                    </div>
                  ) : null}
                </div>
                <div className="h-px w-full bg-neutral-100" />
              </>
            )}
          />
          <StatusContainer>
            {summaryLoading ? (
              <BrickLoader style={{ height: 72, width: '100%', borderRadius: 5 }} />
            ) : errorMessages?.length ? (
              (errorMessages || []).map((error) => (
                <ErrorStatusWrapper skipped={skipErrors[error.id]} key={error.message}>
                  <SvgWarning style={{ color: '#AE1717' }} />
                  {error.message}
                  {error.isSkippable ? (
                    <Tooltip
                      placement="right"
                      variant="dark"
                      content="Skip the validation for this error"
                      popperProps={{
                        style: { zIndex: 3100 },
                      }}
                    >
                      <Checkbox
                        checked={skipErrors[error.id]}
                        onClick={() => setSkipErrors({ ...skipErrors, [error.id]: !skipErrors[error.id] })}
                      />
                    </Tooltip>
                  ) : null}
                </ErrorStatusWrapper>
              ))
            ) : (
              <StatusWrapperStyled>
                <StatusesContainer>
                  We'll draft an optimization proposal for this period{' '}
                  <span style={{ color: '#0EC76A' }}>
                    {format(dayjs().startOf('d'), 'D MMM')} -{' '}
                    {format(dayjs(optimizationEndDate).endOf('d'), 'DD MMM YYYY')}
                  </span>
                </StatusesContainer>
                {isTargetPortfolio ? (
                  <>
                    <StatusesContainer>
                      Maximum budget allowed:{' '}
                      <span style={{ color: '#0EC76A' }}>
                        <FormattedCurrency amount={targetItem?.maxBudget} />
                      </span>
                    </StatusesContainer>
                    <StatusesContainer>
                      Target per {targetFunnelStep?.title}:{' '}
                      <span style={{ color: '#0EC76A' }}>
                        <FormattedCurrency amount={targetItem?.value} />
                      </span>
                    </StatusesContainer>
                  </>
                ) : (
                  <StatusesContainer>
                    Approx. budget for the selected period:{' '}
                    <span style={{ color: '#0EC76A' }}>
                      <FormattedCurrency amount={totalBudget} />
                    </span>
                  </StatusesContainer>
                )}
                {portfolioEventsWithinTimeframe?.length ? (
                  <>
                    <div className="text-sm text-neutral-500">
                      You have events that will be considered during this period:{' '}
                    </div>
                    <div className="flex flex-col gap-1">
                      {portfolioEventsWithinTimeframe?.map(({ name, portfolioEventId }) => (
                        <div className="text-xs text-neutral-500" key={portfolioEventId}>
                          {name}
                        </div>
                      ))}
                    </div>
                  </>
                ) : null}
              </StatusWrapperStyled>
            )}
          </StatusContainer>
          {missingCurrencyCoverage && (
            <div className="flex items-center gap-1.5 rounded-[5px] border border-[#eaeaea] bg-[#fdf5fa] p-2 font-normal">
              <div>
                <div className="mb-1 flex items-center gap-2">
                  <SvgWarningTwo
                    warningCircleColor="#FCDFE6"
                    warningColor="#E22252"
                    style={{ height: 16, width: 16 }}
                  />
                  <div className="text-md font-medium text-neutral-800">
                    Update currency rates in Teams Settings first
                  </div>
                </div>
                <p className="mb-4 text-neutral-600">
                  Some currencies from integrated ad accounts are missing exchange rates for this optimisation
                  timeframe.
                </p>
                <p className="text-neutral-600">
                  Please update these in{' '}
                  <Link
                    to="/settings?tab=currencies"
                    className="cursor-pointer text-[14px] font-medium leading-[150%] tracking-[0.36px] text-purple-400 underline"
                  >
                    Team Settings page
                  </Link>{' '}
                  before launching the optimisation.
                </p>
              </div>
            </div>
          )}
        </DialogContentStyled>
        <DialogActionsStyled>
          <Button style={{ width: '100%' }} color="tertiary" variant="contained" onClick={toggleDialog}>
            Cancel
          </Button>
          <ButtonAsync
            style={{ width: '100%' }}
            color="primary"
            variant="contained"
            disabled={
              loadingOptimization ||
              summaryLoading ||
              !!summaryError ||
              missingCurrencyCoverage ||
              !!errorMessages?.filter((e) => !e.isSkipped).length
            }
            loading={loadingOptimization || summaryLoading}
            onClick={handleSuccess}
          >
            Launch optimization
          </ButtonAsync>
        </DialogActionsStyled>
      </DialogStyled>
    </>
  );
};
