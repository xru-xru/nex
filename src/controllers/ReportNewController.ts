import React from 'react';

import { useCollections } from '../context/CollectionsProvider';

import useAllowSubmit from '../hooks/useAllowSubmit';
import { getEarlierDay, getLaterDay } from '../utils/dates';

import { useDialogState } from '../components/Dialog';
import { useSidePanelState } from '../components/SidePanel';
import useStepper from '../components/Stepper/useStepper';

import useKpiSelectionController from './KpiSelectionController';
import usePortfolioSelectionController from './PortfolioSelectionController';
import useReportMetaController from './ReportMetaController';
import useReportRangeController from './ReportRangeController';
import useReportTypeController from './ReportTypeController';

function useNewReportController() {
  const [type, setType] = useReportTypeController();
  const portfolioSelection = usePortfolioSelectionController();
  const sidepanelState = useSidePanelState();
  const dialogState = useDialogState();
  const successDialogState = useDialogState();
  const kpiSelection = useKpiSelectionController();
  const channelSelection = useCollections();
  const meta = useReportMetaController();
  const dateRange = useReportRangeController();
  const [submitting, setSubmitting] = React.useState<boolean>(false);
  const [reportId, setReportId] = React.useState<null | number>(null);
  const stepper = useStepper({
    initialValue: 0,
    end: 3,
  });
  const { allowSubmit } = useAllowSubmit({
    initialValues: meta.initialState,
    values: { ...meta.form, type },
    requiredFields: ['name', 'type'],
  });
  // Comment:
  // We need to calculate the dateRange, because we don't provide the ability
  // for the user to pick their own choice.
  // The calculation is looking for the earliest date for start_date of any
  // selected portfolios. And is looking for the latest date for end_date of any
  // selected portfolios.
  // This will be eventually changed to something else where the UI would dictate
  // the selection with date picker.
  const nextPortfoliosDateRange = React.useMemo(() => {
    let nextCustomRange = null;

    if (portfolioSelection.selected.length !== 0) {
      const firstFrom = portfolioSelection.selected[0].start_date;
      const firstTo = portfolioSelection.selected[0].end_date;
      nextCustomRange = portfolioSelection.selected.reduce(
        (acc, portfolio) => {
          return {
            dateFrom: getEarlierDay(portfolio.start_date, acc.dateFrom),
            dateTo: getLaterDay(portfolio.end_date, acc.dateTo),
          };
        },
        {
          dateFrom: firstFrom,
          dateTo: firstTo,
        }
      );
    }

    return {
      rangeType: 'custom',
      customRange: nextCustomRange,
    };
  }, [portfolioSelection.selected]);

  function previousStep() {
    if (stepper.step === 1) {
      return;
    } else if (stepper.step === 2) {
      // portfolioSelection.reset();
      // kpiSelection.reset();
    } else if (stepper.step === 3) {
      // meta.resetForm();
      // dateRange.reset();
    }

    stepper.previousStep();
  }

  function nextStep() {
    if (stepper.step === 3 && allowSubmit && !submitting) {
      setSubmitting(true);
    } else {
      stepper.nextStep();
    }
  }

  function allowNext() {
    if (stepper.step === 1 && !allowSubmit) {
      return false;
    } else if (stepper.step === 2) {
      if (type === 'PORTFOLIO' && portfolioSelection.selected.length === 0) {
        return false;
      } else if (type === 'KPI' && kpiSelection.selected.length === 0) {
        return false;
      } else if (type === 'CHANNEL' && channelSelection.selectedChannels.length === 0) {
        return false;
      }

      return true;
    } else if (stepper.step === 3) {
      return false;
    } else {
      return true;
    }
  }

  function resetAll() {
    setType(null);
    portfolioSelection.reset();
    kpiSelection.reset();
    meta.resetForm();
    dateRange.reset();
    stepper.resetStep();
    setSubmitting(false);
    setReportId(null);
  }

  return {
    portfolios: portfolioSelection,
    kpis: kpiSelection,
    sidepanelState,
    dialogState,
    successDialogState,
    stepper: { ...stepper, previousStep, nextStep },
    formMeta: {
      values: meta.form,
      handleChange: meta.handleFormChange,
    },
    type: {
      value: type,
      handleChange: setType,
    },
    portfoliosDateRange: nextPortfoliosDateRange,
    kpisDateRange: dateRange,
    allowNext: allowNext(),
    resetAll,
    submitState: {
      loading: submitting,
      setSubmitting,
    },
    report: {
      reportId,
      setReportId,
    },
  };
}

export default useNewReportController;
