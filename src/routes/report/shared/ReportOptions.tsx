import { RouterHistory } from 'react-router-dom';
import { withRouter } from 'react-router-dom';

import { get } from 'lodash';
import styled from 'styled-components';

import { useCopyReportMutation } from '../../../graphql/report/mutationCopyReport';
import { useDeleteReportMutation } from '../../../graphql/report/mutationDeleteReport';

import usePresenterMode from '../../../hooks/usePresenterMode';

import Button from '../../../components/Button';
import ButtonAdornment from '../../../components/ButtonAdornment';
import ButtonIcon from '../../../components/ButtonIcon';
import Dialog, { useDialogState } from '../../../components/Dialog';
import DialogActions from '../../../components/DialogActions';
import DialogContent from '../../../components/DialogContent';
import DialogTitle from '../../../components/DialogTitle';
import Menu, { useDropdownMenu } from '../../../components/DropdownMenu';
import ErrorMessage from '../../../components/ErrorMessage';
import MenuItem from '../../../components/MenuItem';
import Typography from '../../../components/Typography';
import SvgClone from '../../../components/icons/CloneRegular';
import SvgEllipsisV from '../../../components/icons/EllipsisV';
import SvgPencil from '../../../components/icons/Pencil';
import SvgTrash from '../../../components/icons/Trash';

import { colorByKey } from '../../../theme/utils';

import { PATHS, buildReportPath } from '../../paths';

type Props = {
  reportName: string;
  reportId: number;
  history: RouterHistory;
  onEdit: () => void;
  shallowFunctions?: boolean;
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

function ReportOptions({ reportName, reportId, history, shallowFunctions, onEdit }: Props) {
  const { isOpen, openDialog, closeDialog } = useDialogState({
    initialState: false,
  });
  const { anchorEl, open, closeMenu, toggleMenu } = useDropdownMenu();
  const [deleteReport, { loading, error }] = useDeleteReportMutation({
    reportId,
  });
  const [copyReport, { loading: loadingCopyReport, error: errorCopyReport }] = useCopyReportMutation({
    reportId,
  });

  async function handleDelete() {
    try {
      if (typeof deleteReport !== 'function') {
        return;
      }

      const res = await deleteReport();

      if (get(res, 'data.deleteReport', null)) {
        history.push(PATHS.APP.REPORTS);
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
    }
  }

  async function handleCopy() {
    try {
      if (typeof copyReport !== 'function') {
        return;
      }
      const res = await copyReport();
      const reportId = get(res, 'data.copyReport.report_id', null);

      if (reportId) {
        history.push(buildReportPath(reportId));
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
    }
  }

  const { isPresenterMode: presenterMode } = usePresenterMode();
  return (
    <>
      <div
        ref={anchorEl}
        style={{
          position: 'relative',
          zIndex: 10,
        }}
      >
        <ButtonIcon
          onClick={toggleMenu}
          style={{
            marginLeft: 8,
          }}
          active={open}
          data-cy="moreOptionsBtn"
        >
          <SvgEllipsisV
            style={{
              fontSize: '18',
            }}
          />
        </ButtonIcon>
        <Menu
          container={anchorEl.current}
          anchorEl={anchorEl.current}
          open={open}
          onClose={closeMenu}
          placement="bottom-end"
          color="dark"
        >
          <MenuItem
            onClick={() => {
              closeMenu();
              onEdit();
            }}
            buttonProps={{
              startAdornment: (
                <ButtonAdornment position="start">
                  <SvgPencil />
                </ButtonAdornment>
              ),
            }}
            data-cy="editReportBtn"
          >
            Edit
          </MenuItem>
          {
            !shallowFunctions ? (
              <MenuItem
                onClick={() => {
                  closeMenu();
                  handleCopy();
                }}
                async={true}
                loading={loadingCopyReport}
                buttonProps={{
                  startAdornment: (
                    <ButtonAdornment position="start">
                      <SvgClone />
                    </ButtonAdornment>
                  ),
                }}
                data-cy="copyReportBtn"
              >
                Duplicate
              </MenuItem>
            ) : (
              <></>
            )
            /* use of null here breaks compilation */
          }
          {!presenterMode ? (
            <MenuItem
              onClick={() => {
                closeMenu();
                openDialog();
              }}
              buttonProps={{
                startAdornment: (
                  <ButtonAdornment position="start">
                    <SvgTrash />
                  </ButtonAdornment>
                ),
              }}
              data-cy="deleteReportBtn"
            >
              Delete
            </MenuItem>
          ) : (
            <span />
          )}
        </Menu>
      </div>
      <Dialog
        isOpen={isOpen}
        onClose={closeDialog}
        paperProps={{
          style: {
            width: 455,
            textAlign: 'center',
          },
        }}
        data-cy="deleteDialog"
      >
        <DialogTitle data-cy="dialogTitle">
          <StyledEmoji role="img" aria-label="thinking-face emoji">
            🤔
          </StyledEmoji>
          <Typography variant="h1" withEllipsis={false}>
            Are you sure?
          </Typography>
        </DialogTitle>
        <DialogContent data-cy="dialogContent">
          <Typography variant="subtitle" id="alert-dialog-description">
            Do you really want to delete
            <br />
            <StyledTitle>{reportName}</StyledTitle> ?
          </Typography>
        </DialogContent>
        <DialogActions variant="secondary">
          <Button id="cancel" disabled={loading} variant="contained" onClick={closeDialog}>
            Close
          </Button>
          <Button disabled={loading} variant="contained" color="danger" onClick={handleDelete} id="delete">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      {!error ? null : <ErrorMessage error={error} />}
      {!errorCopyReport ? null : <ErrorMessage error={errorCopyReport} />}
    </>
  );
}

export default withRouter(ReportOptions);
