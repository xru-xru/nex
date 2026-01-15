import styled from 'styled-components';

import Button from '../../components/Button';
import ButtonAsync from '../../components/ButtonAsync';
import Dialog from '../../components/Dialog';
import DialogActions from '../../components/DialogActions';
import DialogContent from '../../components/DialogContent';
import DialogTitle from '../../components/DialogTitle';
import Typography from '../../components/Typography';
import SvgWarning from '../../components/icons/Warning';

import { colorByKey } from '../../theme/utils';

type Props = {
  isOpen: boolean;
  toggleDialog: () => void;
  handleSubmit: () => Promise<void>;
  loading: boolean;
};
const DialogStyled = styled(Dialog)`
  .NEXYPaper {
    text-align: center;
    width: 450px;
    min-width: 450px;
    max-width: 450px;
    padding: 0;
  }
  .NEXYDialogContent {
    padding: 0 48px;
  }
  .NEXYDialogActions {
    padding: 32px 48px 48px 48px;
  }
  .NEXYButton {
    padding: 12px 18px;
  }
`;
const StyledEmoji = styled.span`
  display: block;
  font-size: 48px;
  line-height: 48px;
  margin-top: 32px;
  margin-bottom: 20px;
`;
const WarningStyled = styled.div`
  display: flex;
  text-align: left;
  border-radius: 5px;
  padding: 12px;
  font-size: 12px;
  margin-top: 42px;
  border: 1px solid ${colorByKey('pumpkinOrangeLight')};
  background-color: ${colorByKey('pumpkinOrangeVeryLight')};
  .warningIcon {
    margin-right: 12px;
    font-size: 32px;
    color: ${colorByKey('pumpkinOrange')};
  }
`;

// dialog which is opened to inform the user about the
// consequences of changing the date range of portfolio
function PortfolioDatesConfirmationDialog({ isOpen, toggleDialog, handleSubmit, loading }: Props) {
  return (
    <DialogStyled isOpen={isOpen} data-cy="changePortfolioDate">
      <DialogTitle>
        <StyledEmoji role="img" aria-label="thinking-face emoji">
          🤔
        </StyledEmoji>
        <Typography variant="h1" withEllipsis={false}>
          Are you sure?
        </Typography>
      </DialogTitle>
      <DialogContent data-cy="dialogContent">
        <Typography withEllipsis={false}>
          You are about to change the setup of your portfolio, which might affect some things.
        </Typography>
        <WarningStyled>
          <SvgWarning className="warningIcon" />
          <Typography withEllipsis={false}>
            Changing dates will affect the budget, so you will have to set it up manually, again.
          </Typography>
        </WarningStyled>
      </DialogContent>
      <DialogActions>
        <Button id="abort" variant="contained" onClick={toggleDialog}>
          No, abort mission
        </Button>
        <ButtonAsync id="proceed" color="primary" variant="contained" onClick={handleSubmit} loading={loading}>
          Yes, I'm sure
        </ButtonAsync>
      </DialogActions>
    </DialogStyled>
  );
}

export default PortfolioDatesConfirmationDialog;
