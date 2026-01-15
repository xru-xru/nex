import { RouterHistory } from 'react-router-dom';
import { withRouter } from 'react-router-dom';

import { get } from 'lodash';
import styled from 'styled-components';

import { NexoyaMeasurement } from '../../types/types';

import { useDeleteCustomKpi } from '../../graphql/kpi/mutationDeleteCustomKpi';

import Button from '../../components/Button';
import ButtonAsync from '../../components/ButtonAsync';
import Dialog from '../../components/Dialog';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import { PATHS } from '../../routes/paths';

import { colorByKey } from '../../theme/utils';

import DialogActions from '../DialogActions';
import DialogContent from '../DialogContent';
import DialogTitle from '../DialogTitle';
import Typography from '../Typography';

type Props = {
  kpi: NexoyaMeasurement;
  history: RouterHistory;
  isDeleteDialogOpen: boolean;
  closeDeleteDialog: (arg0: boolean) => void;
};
const StyledEmoji = styled.span`
  display: block;
  font-size: 48px;
  line-height: 48px;
  margin-top: 32px;
  margin-bottom: 20px;
`;
const StyledTitle = styled.span`
  font-weight: 500;
  color: ${colorByKey('greenTeal')};
`;

function DeleteCustomKpi({ kpi, history, isDeleteDialogOpen, closeDeleteDialog }: Props) {
  // @ts-ignore
  const [deleteCustomKpi, { loading, error }] = useDeleteCustomKpi({
    custom_kpi_id: get(kpi, 'customKpiConfig.custom_kpi_id', null),
  });

  async function handleSubmit() {
    try {
      // @ts-ignore
      const res = await deleteCustomKpi();

      if (get(res, 'data.deleteCustomKpi', null)) {
        history.push(PATHS.APP.KPIS);
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
    }
  }

  return (
    <>
      <Dialog
        isOpen={isDeleteDialogOpen}
        onClose={() => closeDeleteDialog(false)}
        paperProps={{
          style: {
            width: 455,
            textAlign: 'center',
          },
        }}
        data-cy="deleteDialog"
      >
        <DialogTitle>
          <StyledEmoji role="img" aria-label="thinking-face emoji">
            🤔
          </StyledEmoji>
          <Typography variant="h1" withEllipsis={false}>
            Are you sure?
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="subtitle" id="alert-dialog-description">
            Do you really want to delete
            <br />
            <StyledTitle>{kpi.name}</StyledTitle> ?
          </Typography>
        </DialogContent>
        <DialogActions variant="secondary">
          <Button id="cancel" variant="contained" onClick={() => closeDeleteDialog(false)}>
            Cancel
          </Button>
          <ButtonAsync
            id="delete"
            variant="contained"
            color="danger"
            disabled={loading}
            loading={loading}
            onClick={handleSubmit}
          >
            Delete
          </ButtonAsync>
        </DialogActions>
      </Dialog>
      {error ? <ErrorMessage error={error} /> : null}
    </>
  );
}

export default withRouter(DeleteCustomKpi);
