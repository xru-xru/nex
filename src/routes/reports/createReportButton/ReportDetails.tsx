import styled from 'styled-components';

import { useReportNew } from '../../../context/ReportNewProvider';

import DialogContent from '../../../components/DialogContent';
import Fieldset from '../../../components/Form/Fieldset';
import FormGroup from '../../../components/Form/FormGroup';
import ReportDateRange from '../../../components/ReportDateRange';
import TextField from '../../../components/TextField';

const WrapStyled = styled.div`
  .NEXYFormControl {
    margin-bottom: 64px;
  }
`;

function ReportDetails() {
  const { formMeta, type, kpisDateRange } = useReportNew();
  return (
    <WrapStyled>
      <DialogContent>
        <Fieldset>
          <FormGroup>
            <TextField
              autoComplete="off"
              id="name"
              name="name"
              label="Report name"
              value={formMeta.values.name}
              onChange={formMeta.handleChange}
              placeholder="Report Name"
            />
          </FormGroup>
          <FormGroup
            style={{
              marginBottom: '64',
            }}
          >
            <TextField
              id="description"
              value={formMeta.values.description}
              onChange={formMeta.handleChange}
              label="Description"
              name="description"
              rows="3"
              placeholder="Small reminder what the report is for..."
              autoComplete="off"
            />
          </FormGroup>
          {type.value === 'KPI' || type.value === 'CHANNEL' ? (
            <FormGroup inline>
              <ReportDateRange handleDateChange={kpisDateRange.handleDateChange} dateRange={kpisDateRange.dateRange} />
            </FormGroup>
          ) : null}
        </Fieldset>
      </DialogContent>
    </WrapStyled>
  );
}

export default ReportDetails;
