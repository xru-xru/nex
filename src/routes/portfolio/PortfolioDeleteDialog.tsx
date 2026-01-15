import { Match, RouterHistory, withRouter } from 'react-router-dom';

import { get } from 'lodash';
import styled from 'styled-components';

import { NexoyaPortfolio } from 'types';

import { useDeactivatePortfolioMutation } from '../../graphql/portfolio/mutationDeactivatePortfolio';

import Button from '../../components/Button';
import ButtonAsync from '../../components/ButtonAsync';
import Dialog from '../../components/Dialog';
import ErrorMessage from '../../components/ErrorMessage';
import Typography from '../../components/Typography';

import { nexyColors } from '../../theme';
import { PATHS } from '../paths';

type Props = {
  isOpen: boolean;
  toggleDialog: () => void;
  match: Match;
  history: RouterHistory;
  portfolio: NexoyaPortfolio;
};
const DeleteDialogContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 18px 32px 32px;
  width: 455px;
`;
const DeleteDialogActions = styled.div`
  display: flex;
  justify-content: space-around;
  padding-bottom: 32px;
`;

function PortfolioDeleteDialog({ isOpen, toggleDialog, match, history, portfolio }: Props) {
  const portfolioIdRoute = parseInt(match.params.portfolioID, 10);
  const [deactivatePortfolio, { loading, error }] = useDeactivatePortfolioMutation({
    portfolioId: portfolio?.portfolioId || portfolioIdRoute,
  });

  async function handleDeletePortfolio() {
    try {
      const res = await deactivatePortfolio();

      if (get(res, 'data.deactivatePortfolio', false)) {
        // toggleDialog();
        history.push(PATHS.APP.PORTFOLIOS);
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
    }
  }

  return (
    <Dialog
      isOpen={isOpen}
      onClose={toggleDialog}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      data-cy="deleteDialog"
    >
      <DeleteDialogContent data-cy="deleteDialogContent">
        <span
          role="img"
          aria-label="thinking-face emoji"
          style={{
            fontSize: 48,
          }}
        >
          🤔
        </span>
        <Typography
          variant="h1"
          component="h2"
          style={{
            marginBottom: 8,
          }}
        >
          Are you sure?
        </Typography>
        <Typography
          variant="subtitle"
          style={{
            textAlign: 'center',
          }}
          withEllipsis={false}
        >
          Do you really want to delete portfolio <br />
          <strong
            style={{
              color: nexyColors.greenTeal,
            }}
          >
            {portfolio.title}
          </strong>
          ?
        </Typography>
      </DeleteDialogContent>
      <DeleteDialogActions>
        <Button
          id="cancel"
          onClick={toggleDialog} // disabled={loading}
          variant="contained"
        >
          Cancel
        </Button>
        <ButtonAsync
          id="delete"
          disabled={loading}
          loading={loading}
          onClick={handleDeletePortfolio}
          color="danger"
          variant="contained"
          autoFocus
        >
          Delete
        </ButtonAsync>
      </DeleteDialogActions>
      {error ? <ErrorMessage error={error} /> : null}
    </Dialog>
  );
}

export default withRouter(PortfolioDeleteDialog);
