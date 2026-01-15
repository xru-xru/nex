import styled from 'styled-components';

import Button from '../Button';
import ButtonAsync from '../ButtonAsync';
import Dialog from '../Dialog';
import Typography from '../Typography';

const DialogContentStyled = styled.div`
  max-width: 400px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 32px;
`;
const ButtonWrapperStyled = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;
const DialogTextContainer = styled.div`
  display: flex;
  gap: 16px;
  flex-direction: column;
`;

const ButtonAsyncStyled = styled(ButtonAsync)`
  .NEXYButtonLoader {
    i {
      background: white;
    }
  }
`;
type Props = {
  title: string | JSX.Element;
  subtitle: string | JSX.Element;
  ctaText: string | JSX.Element;
  isDialogOpen: boolean;
  onSubmit: () => void;
  handleCloseDialog: () => void;
  loading: boolean;
  ctaColor?: 'primary' | 'secondary' | 'tertiary' | 'danger';
};

export function OptimizationWarningDialog({
  isDialogOpen,
  handleCloseDialog,
  onSubmit,
  title,
  ctaText,
  subtitle,
  loading,
  ctaColor = 'danger',
}: Props) {
  return (
    <Dialog isOpen={isDialogOpen} onClose={handleCloseDialog}>
      <DialogContentStyled data-cy="optimizationDialog">
        <DialogTextContainer>
          <Typography withEllipsis={false} variant="h2">
            {title}
          </Typography>
          <Typography style={{ fontSize: 14 }} withEllipsis={false} variant="subtitle">
            {subtitle}
          </Typography>
        </DialogTextContainer>

        <ButtonWrapperStyled>
          <Button
            disabled={loading}
            id="cancelDeleteDlgBtn"
            color="tertiary"
            variant="contained"
            onClick={handleCloseDialog}
          >
            Cancel
          </Button>
          <ButtonAsyncStyled
            id="optimizationDialog"
            color={ctaColor}
            variant="contained"
            loading={loading}
            disabled={loading}
            onClick={() => {
              onSubmit();
            }}
          >
            {ctaText}
          </ButtonAsyncStyled>
        </ButtonWrapperStyled>
      </DialogContentStyled>
    </Dialog>
  );
}
