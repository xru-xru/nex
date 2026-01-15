import { RouterHistory, withRouter } from 'react-router-dom';

import { get } from 'lodash';

import { NexoyaMeasurement } from '../../types/types';
import DOMPurify from 'dompurify';

import useReportMetaController from '../../controllers/ReportMetaController';
import { useCreateReportMutation } from '../../graphql/report/mutationCreateReport';
import useReportRangeController from 'controllers/ReportRangeController';

import { kpiInputArr } from '../../utils/kpi';

import Button from '../../components/Button';
import ButtonAsync from '../../components/ButtonAsync';
import DialogTitle from '../../components/DialogTitle';
import ErrorMessage from '../../components/ErrorMessage';
import Fieldset from '../../components/Form/Fieldset';
import FormGroup from '../../components/Form/FormGroup';
import ReportDateRange from '../../components/ReportDateRange';
import SidePanel, { SidePanelActions, SidePanelContent } from '../../components/SidePanel';
import Text from '../../components/Text';
import TextField from '../../components/TextField';

import { buildReportPath } from '../paths';

type Props = {
  isOpen: boolean;
  toggleDialog: () => void;
  selectedKpis: NexoyaMeasurement[];
  history: RouterHistory;
};

// TODO: This is almost a direct copy of what we have in the "routes/reportNes/StepFirst"!!!
function ReportNewDialog({ isOpen, toggleDialog, selectedKpis, history }: Props) {
  const { form, handleFormChange } = useReportMetaController();
  const { dateRange, handleDateChange } = useReportRangeController();

  const [createReport, { loading, error }] = useCreateReportMutation({
    name: DOMPurify.sanitize(form.name, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }),
    description: DOMPurify.sanitize(form.description, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }),
    kpis: kpiInputArr(selectedKpis),
    // @ts-expect-error
    dateRange,
  });

  async function handleSubmit() {
    const res = await createReport();
    const report = get(res, 'data.createReport', null);

    if (report) {
      history.push(buildReportPath(report.report_id));
    }
  }

  return (
    <>
      <SidePanel
        isOpen={isOpen}
        onClose={toggleDialog}
        paperProps={{
          style: {
            minWidth: 695,
          },
        }}
      >
        <DialogTitle>
          <Text component="h2">Create a new report from selection</Text>
        </DialogTitle>
        <SidePanelContent>
          <form
            onSubmit={(ev) => ev.preventDefault()}
            style={{
              paddingTop: 2,
              width: '100%',
            }}
          >
            <Fieldset disabled={loading}>
              <FormGroup>
                <TextField
                  autoComplete="off"
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleFormChange}
                  placeholder="Add report name"
                  disabled={loading}
                  style={{
                    fontSize: '24px',
                    weight: 'bold',
                  }}
                />
              </FormGroup>
              <FormGroup>
                <TextField
                  id="description"
                  value={form.description}
                  label="Description"
                  name="description"
                  rows="3"
                  onChange={handleFormChange}
                  placeholder="Small reminder what the report is for..."
                  disabled={loading}
                  autoComplete="off"
                />
              </FormGroup>
              <FormGroup inline>
                <ReportDateRange handleDateChange={handleDateChange} dateRange={dateRange} />
              </FormGroup>
            </Fieldset>
          </form>
        </SidePanelContent>
        <SidePanelActions>
          <Button variant="contained" onClick={toggleDialog}>
            Cancel
          </Button>
          <ButtonAsync
            disabled={loading || !form.name}
            loading={loading}
            color="primary"
            variant="contained"
            type="submit"
            onClick={handleSubmit}
          >
            Create report
          </ButtonAsync>
        </SidePanelActions>
      </SidePanel>
      {error ? <ErrorMessage error={error} /> : null}
    </>
  );
}

export default withRouter(ReportNewDialog);
