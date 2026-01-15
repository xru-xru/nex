import React from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

import { get } from 'lodash';
import styled from 'styled-components';

import { NexoyaReportDateRange } from '../../../types/types';
import DOMPurify from 'dompurify';

import useReportMetaController from '../../../controllers/ReportMetaController';
import useReportRangeController from '../../../controllers/ReportRangeController';
import { useUpdateReportMutation } from '../../../graphql/report/mutationUpdateReport';

import useAllowSubmit from '../../../hooks/useAllowSubmit';
import usePresenterMode from '../../../hooks/usePresenterMode';

import Button from '../../../components/Button';
import ButtonAsync from '../../../components/ButtonAsync';
import ErrorMessage from '../../../components/ErrorMessage';
import Fieldset from '../../../components/Form/Fieldset';
import FormGroup from '../../../components/Form/FormGroup';
import ReportDateRange from '../../../components/ReportDateRange';
import SidePanel from '../../../components/SidePanel';
import TextField from '../../../components/TextField';

import { colorByKey } from '../../../theme/utils';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  name: string;
  description: string;
  reportId: number;
  refetch: () => void;
  dateRange: NexoyaReportDateRange;
  hideDateRange?: boolean;
};
const WrapStyled = styled.div``;
const SidePanelContentStyled = styled.div`
  width: 1000px;
  padding: 24px;
`;
const ButtonWrapperStyled = styled.div`
  background: ${colorByKey('ghostWhite')};
  padding: 20px 32px 20px 32px;
  margin-top: auto;
  display: flex;
  justify-content: space-between;
`;

function EditReportDetails({
  isOpen,
  onClose,
  refetch,
  dateRange: dateRangeProp,
  name,
  description,
  reportId,
  hideDateRange = false,
}: Props) {
  const {
    form,
    handleFormChange,
    initialState,
    resetForm: resetMeta,
  } = useReportMetaController({
    name,
    description,
  });
  const {
    dateRange,
    handleDateChange,
    reset: resetDateRange,
  } = useReportRangeController({
    initialRange: dateRangeProp,
  });
  const { allowSubmit } = useAllowSubmit({
    initialValues: { ...initialState, ...dateRangeProp },
    values: { ...form, ...dateRange },
    requiredFields: ['name'],
  });
  useHotkeys(`esc`, onClose);
  const [updateReport, { loading, error }] = useUpdateReportMutation({
    reportId,
    name: DOMPurify.sanitize(form.name, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }),
    description: DOMPurify.sanitize(form.description, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }),
    // @ts-expect-error
    dateRange,
  });
  React.useEffect(() => {
    if (!isOpen) return;
    resetMeta();
    resetDateRange(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  async function handleSubmit() {
    try {
      if (typeof updateReport !== 'function') {
        return;
      }
      const res = await updateReport();

      if (get(res, 'data.updateReport', null)) {
        refetch();
        onClose();
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
    }
  }

  const { isPresenterMode: presenterMode } = usePresenterMode();
  return (
    <SidePanel isOpen={isOpen} onClose={onClose}>
      <SidePanelContentStyled>
        <h2 data-cy="panelTitle">Edit: {name}</h2>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        ></div>
        <WrapStyled>
          {!presenterMode && (
            <Fieldset disabled={loading}>
              <FormGroup>
                <TextField
                  id="name"
                  label="Name"
                  name="name"
                  value={form.name}
                  onChange={handleFormChange}
                  placeholder="Report Name"
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
                  placeholder="Description..."
                />
              </FormGroup>
            </Fieldset>
          )}
          {hideDateRange ? null : (
            <FormGroup inline>
              <ReportDateRange handleDateChange={handleDateChange} dateRange={dateRange} />
            </FormGroup>
          )}
          {error ? <ErrorMessage error={error} /> : null}
        </WrapStyled>
      </SidePanelContentStyled>
      <ButtonWrapperStyled>
        <Button id="cancel" variant="contained" onClick={onClose}>
          Cancel
        </Button>
        <ButtonAsync
          id="update"
          variant="contained"
          color="primary"
          loading={loading}
          disabled={!allowSubmit}
          onClick={handleSubmit}
          style={{
            marginRight: '15',
          }}
        >
          Update
        </ButtonAsync>
      </ButtonWrapperStyled>
    </SidePanel>
  );
}

export default EditReportDetails;
