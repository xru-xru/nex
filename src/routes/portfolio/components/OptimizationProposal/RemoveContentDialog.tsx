import styled from 'styled-components';

import Button from 'components/Button';
import Dialog from 'components/Dialog';
import DialogActions from 'components/DialogActions';
import DialogContent from 'components/DialogContent';
import DialogTitle from 'components/DialogTitle';
import Typography from 'components/Typography';

import { colorByKey } from 'theme/utils';

type Props = {
  isOpen: boolean;
  toggleDialog: () => void;
  handleSubmit: () => void;
};
const DialogStyled = styled(Dialog)`
  .NEXYPaper {
    width: 400px;
    padding: 0;
  }
  .NEXYDialogTitle {
    padding: 24px;
    .NEXYTypography {
      font-size: 24px;
    }
  }
  .NEXYDialogContent {
    padding: 0 32px;
    color: ${colorByKey('blueGrey')};
  }
  .NEXYDialogActions {
    padding: 24px;
  }
  .NEXYButton {
    padding: 12px 18px;
  }
`;

export function RemoveContentDialog({ isOpen, toggleDialog, handleSubmit }: Props) {
  return (
    <DialogStyled isOpen={isOpen} data-cy="changePortfolioDate">
      <DialogTitle>
        <Typography variant="h1" withEllipsis={false}>
          Remove this content from the budget application?
        </Typography>
      </DialogTitle>
      <DialogContent data-cy="dialogContent">
        {/*TODO: Fill in with copy or not? */}
        {/*<Typography withEllipsis={false}>*/}
        {/*  The budget of removed campaigns will not be rebalanced, this may lead to over-/under-spending. But their*/}
        {/*  values will still contribute to the portfolio detail reports and may have negative impact on the validated*/}
        {/*  performance.*/}
        {/*</Typography>*/}
      </DialogContent>
      <DialogActions>
        <Button id="abort" variant="contained" onClick={toggleDialog}>
          Cancel
        </Button>
        <Button id="proceed" color="primary" variant="contained" onClick={handleSubmit}>
          Yes, I'm sure
        </Button>
      </DialogActions>
    </DialogStyled>
  );
}
