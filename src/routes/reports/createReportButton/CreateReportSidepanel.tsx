import { get } from 'lodash';
import styled from 'styled-components';
import { NumberParam, useQueryParams } from 'use-query-params';

import { NexoyaSortField } from '../../../types/types';
import DOMPurify from 'dompurify';

import { useCollections } from '../../../context/CollectionsProvider';
import { useReportNew } from '../../../context/ReportNewProvider';
import { useReportsFilter } from '../../../context/ReportsFilterProvider';
import { useCreateReportMutation } from '../../../graphql/report/mutationCreateReport';

import { channelInputArr } from '../../../utils/channel';
import { kpiInputArr } from '../../../utils/kpi';

import Button from '../../../components/Button';
import ButtonAsync from '../../../components/ButtonAsync';
import DialogTitle from '../../../components/DialogTitle';
import ErrorMessage from '../../../components/ErrorMessage';
import SidePanel, { SidePanelActions, SidePanelContent } from '../../../components/SidePanel';
import Typography from '../../../components/Typography';
import VerticalStepper from '../../../components/VerticalStepper';
import { VerticalStep } from '../../../components/VerticalStepper/Step';

import ReportDetails from './ReportDetails';
import ReportReview from './ReportReview';
import SelectChannels from './SelectChannels';
import SelectKpis from './SelectKpis';

const getCreateReportSteps = (): VerticalStep[] => {
  return [
    {
      id: 'create-report-basic-details',
      name: 'Basic details',
      description: `Give your report a clear name and some description.`,
    },
    {
      id: 'create-report-select-campaigns',
      name: 'Select metrics',
      description: 'Choose the metrics which you want to include in this report.',
    },
    {
      id: 'create-report-review',
      name: 'Review',
      description: 'A quick preview so you can make sure if all is as you want it to be.',
    },
  ];
};

const StepperWrapper = styled.div`
  width: 30%;
  padding-right: 48px;
`;
const StepWrapper = styled.div`
  width: 70%;
  padding-left: 48px;
`;
const mappedReportTitle = {
  PORTFOLIO: 'portfolio',
  KPI: 'metric',
  CHANNEL: 'a channel',
};

function CreateReportSidepanel() {
  const {
    type,
    formMeta,
    portfoliosDateRange,
    kpisDateRange,
    sidepanelState,
    stepper,
    resetAll,
    allowNext,
    submitState,
    kpis,
    report: { setReportId },
    successDialogState,
  } = useReportNew();
  const { search, order } = useReportsFilter();
  const collections = useCollections();
  const [, setQueryParams] = useQueryParams({
    searchPg: NumberParam,
    offset: NumberParam,
  });
  const [createReport, createReportMutState] = useCreateReportMutation({
    name: DOMPurify.sanitize(formMeta.values.name, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }),
    description: DOMPurify.sanitize(formMeta.values.description, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }),
    dateRange: type.value === 'PORTFOLIO' ? portfoliosDateRange : kpisDateRange.dateRange,
    reportType: type.value,
    kpis: type.value === 'CHANNEL' ? channelInputArr(collections.selectedChannels || []) : kpiInputArr(kpis.selected),
    sortBy: {
      field: NexoyaSortField.Name,
      order: order.value,
    },
    where: {
      search: search.value,
    },
  });

  async function handleCreateReport() {
    try {
      if (typeof createReport !== 'function') {
        return;
      }
      const res = await createReport();
      const report = get(res, 'data.createReport');

      if (report) {
        // Set all the states and redirect
        setReportId(report.report_id);
        submitState.setSubmitting(false);
        successDialogState.toggleDialog();
        sidepanelState.toggleSidePanel();
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
    }
  }

  function onClose() {
    sidepanelState.toggleSidePanel();
    resetAll();
    setQueryParams({
      searchPg: null,
      offset: null,
    });
  }

  const { loading, error } = createReportMutState;
  return (
    <SidePanel
      isOpen={sidepanelState.isOpen}
      paperProps={{
        style: {
          width: '70%',
          paddingBottom: '78px',
        },
      }}
      onClose={onClose}
      data-cy="reportSidePanel"
    >
      <DialogTitle
        style={{
          paddingBottom: '48px',
        }}
      >
        <Typography component="h3" variant="h3">
          {type.value && `Create ${mappedReportTitle[type.value]} report`}
        </Typography>
      </DialogTitle>
      <SidePanelContent>
        <StepperWrapper>
          <VerticalStepper current={stepper.step} steps={getCreateReportSteps()} />
        </StepperWrapper>
        <StepWrapper>
          {stepper.step === 1 ? (
            <ReportDetails />
          ) : stepper.step === 2 && type.value === 'KPI' ? (
            <SelectKpis />
          ) : stepper.step === 2 && type.value === 'CHANNEL' ? (
            <SelectChannels
              style={{
                padding: '0 32px',
              }}
              edges={collections.edges}
              loading={collections.loading}
              error={collections.error}
              selectedChannels={collections.selectedChannels}
              channels={collections.channels}
              addChannel={collections.addChannel}
              removeChannel={collections.removeChannel}
            />
          ) : stepper.step === 3 ? (
            <ReportReview />
          ) : null}
        </StepWrapper>
      </SidePanelContent>
      <SidePanelActions>
        {stepper.step > 1 && (
          <Button variant="contained" onClick={stepper.previousStep} id="previousStep">
            Previous step
          </Button>
        )}
        {stepper.step !== 3 ? (
          <Button
            id="next"
            variant="contained"
            color="primary"
            style={{
              marginLeft: 'auto',
            }}
            disabled={!allowNext}
            onClick={stepper.nextStep}
          >
            Next step
          </Button>
        ) : (
          <ButtonAsync
            id="finish"
            variant="contained"
            color="primary"
            disabled={allowNext || loading}
            loading={loading}
            onClick={handleCreateReport}
            style={{
              marginLeft: 'auto',
            }}
          >
            Finish
          </ButtonAsync>
        )}
      </SidePanelActions>
      {error ? <ErrorMessage error={error} /> : null}
    </SidePanel>
  );
}

export default CreateReportSidepanel;
