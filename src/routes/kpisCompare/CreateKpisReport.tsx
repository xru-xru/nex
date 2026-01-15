import { RouterHistory } from 'react-router-dom';
import 'react-router-dom';
import DOMPurify from 'dompurify';

import { get } from 'lodash';

import { NexoyaMeasurementCollectionPairInput } from '../../types/types';
import '../../types/types';

import useDateController from '../../controllers/DateController';
import useReportMetaController from '../../controllers/ReportMetaController';
import { useCreateReportMutation } from '../../graphql/report/mutationCreateReport';
import useReportRangeController from 'controllers/ReportRangeController';

import Button from '../../components/Button';
import ButtonAsync from '../../components/ButtonAsync';
import DialogActions from '../../components/DialogActions';
import DialogContent from '../../components/DialogContent';
import DialogTitle from '../../components/DialogTitle';
import ErrorMessage from '../../components/ErrorMessage';
import Fieldset from '../../components/Form/Fieldset';
import FormGroup from '../../components/Form/FormGroup';
import ReportDateRange from '../../components/ReportDateRange';
import Text from '../../components/Text';
import TextField from '../../components/TextField';

import { buildReportPath } from '../paths';

type Props = {
  history: RouterHistory;
  onClose: () => void;
  selectedKpis?: NexoyaMeasurementCollectionPairInput[];
  dateFrom?: Date;
  dateTo?: Date;
};

function CreateKpisReport({ history, onClose, selectedKpis, dateFrom: dateFromProp, dateTo: dateToProp }: Props) {
  const { form, handleFormChange } = useReportMetaController();
  const { to, from } = useDateController();
  const initialRange = {
    rangeType: 'custom',
    customRange: {
      dateFrom: dateFromProp || from,
      dateTo: dateToProp || to,
    },
  };
  const { dateRange, handleDateChange } = useReportRangeController({
    initialRange,
  });
  const [createReport, { loading, error }] = useCreateReportMutation({
    name: DOMPurify.sanitize(form.name, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }),
    description: DOMPurify.sanitize(form.description, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }),
    // @ts-expect-error
    dateRange,
    kpis: selectedKpis || null,
  });

  async function handleSubmit(ev: any) {
    ev.preventDefault();

    try {
      const res = await createReport();
      const report = get(res, 'data.createReport', null);

      if (report) {
        history.push(buildReportPath(report.report_id));
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
    }
  }

  return (
    <>
      <DialogTitle>
        <Text component="h3">New report</Text>
      </DialogTitle>
      <DialogContent>
        <Fieldset disabled={loading}>
          <FormGroup>
            <TextField
              autoComplete="off"
              id="name"
              name="name"
              value={form.name}
              onChange={handleFormChange}
              placeholder="Report Name"
              disabled={loading}
              style={{
                fontSize: '30px',
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
      </DialogContent>
      <DialogActions>
        <Button id="cancelBtn" variant="contained" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <ButtonAsync
          id="createReportBtn"
          onClick={handleSubmit}
          disabled={loading || !form.name}
          loading={loading}
          color="primary"
          variant="contained"
          type="submit"
          style={{
            marginLeft: 'auto',
          }}
        >
          Create report
        </ButtonAsync>
      </DialogActions>
      {error ? <ErrorMessage error={error} /> : null}
    </>
  );
}

export default CreateKpisReport;
