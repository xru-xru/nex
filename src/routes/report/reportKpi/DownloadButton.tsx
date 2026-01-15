import { Suspense, lazy, useState } from 'react';

import styled from 'styled-components';

import { NexoyaReport } from '../../../types/types';

import Button from '../../../components/Button';
import ButtonAdornment from '../../../components/ButtonAdornment';
import ButtonAsync from '../../../components/ButtonAsync';
import ErrorMessage from '../../../components/ErrorMessage';
import Menu, { useMenu } from '../../../components/Menu';
import SvgCaretDown from '../../../components/icons/CaretDown';
import SvgDownload from '../../../components/icons/Download';
import SvgXlsx from '../../../components/icons/Xlsx';

const ReportXLSX = lazy(() => import('./downloadButton/ReportXlsx'));
type Props = {
  report: NexoyaReport;
  disabled: boolean;
};
const DropStyled = styled.div`
  padding: 10px 0;
  width: 125px;

  button {
    width: 100%;
    padding: 10px 15px;
    transition: background 0.175s;
    justify-content: flex-start;

    &:hover {
      background: #eee;
    }
  }
`;

function DownloadButton({ report, disabled }: Props) {
  const { anchorEl, open, openMenu, closeMenu } = useMenu();
  const [loadXlsx, setLoadXlsx] = useState(false);
  const [waitingXlsx, setWaitingXlsx] = useState(false);
  const [error, setError] = useState<null | Error>(null);

  function handleDownloadXlsx() {
    setLoadXlsx(true);
    setWaitingXlsx(true);
  }

  return (
    <>
      <div
        ref={anchorEl}
        style={{
          position: 'relative',
          zIndex: 9,
        }}
      >
        <Button
          onClick={() => {
            if (!open) {
              openMenu();
            } else if (!waitingXlsx) {
              closeMenu();
            }
          }}
          startAdornment={
            <ButtonAdornment position="start">
              <SvgDownload />
            </ButtonAdornment>
          }
          endAdornment={
            <ButtonAdornment position="end">
              <SvgCaretDown />
            </ButtonAdornment>
          }
          color="secondary"
          variant="contained"
          active={open}
          data-cy="downloadBtn"
        >
          Download
        </Button>
      </div>
      <Menu
        container={anchorEl.current}
        anchorEl={anchorEl.current}
        open={open}
        onClose={closeMenu}
        placement="bottom-end"
      >
        <DropStyled>
          <ButtonAsync // shape="outlined"
            onClick={handleDownloadXlsx}
            loading={waitingXlsx}
            color="secondary"
            id="XlsxBtn"
            disabled={disabled}
            startAdornment={
              <ButtonAdornment position="start">
                <SvgXlsx />
              </ButtonAdornment>
            }
          >
            {waitingXlsx ? 'Generating' : 'Excel'}
          </ButtonAsync>
          {loadXlsx ? (
            <Suspense fallback={null}>
              <ReportXLSX
                report={report}
                onDone={() => {
                  setWaitingXlsx(false);
                  setLoadXlsx(false);
                  closeMenu();
                }}
                onError={(error) => {
                  setWaitingXlsx(false);
                  setError(error);
                }}
              />
            </Suspense>
          ) : null}
        </DropStyled>
      </Menu>
      {error ? <ErrorMessage error={error} /> : null}
    </>
  );
}

export default DownloadButton;
