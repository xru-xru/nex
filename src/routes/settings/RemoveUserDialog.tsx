import { get } from 'lodash';
import styled from 'styled-components';

import { NexoyaTeamMember } from 'types/types';
import { useRemoveUserMutation } from 'types/types';

import { useTeam } from 'context/TeamProvider';
import { TEAM_QUERY } from 'graphql/team/queryTeam';

import { userName } from 'utils/user';

import Button from 'components/Button';
import ButtonAsync from 'components/ButtonAsync';
import Dialog from 'components/Dialog';
import DialogActions from 'components/DialogActions';
import DialogContent from 'components/DialogContent';
import DialogTitle from 'components/DialogTitle';
import ErrorMessage from 'components/ErrorMessage/ErrorMessage';
import Typography from 'components/Typography';

import { colorByKey } from 'theme/utils';

type Props = {
  user: NexoyaTeamMember;
  isDialogOpen: boolean;
  closeDialog: (isOpen: boolean) => void;
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

function RemoveUserDialog({ user, isDialogOpen, closeDialog }: Props) {
  const { teamId } = useTeam();
  const [removeUserMutation, { loading, error }] = useRemoveUserMutation({
    refetchQueries: [
      {
        query: TEAM_QUERY,
        variables: {
          team_id: teamId,
          withMembers: true,
          withOrg: true,
        },
      },
    ],
    variables: {
      team_id: teamId,
      user_to_remove_id: user?.user_id,
    },
  });
  async function handleSubmit() {
    try {
      const res = await removeUserMutation();
      if (get(res, 'data.removeUser', null)) {
        closeDialog(false);
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
    }
  }

  return (
    <>
      <Dialog
        isOpen={isDialogOpen}
        onClose={() => closeDialog(false)}
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
            Do you really want to remove user
            <br />
            <StyledTitle>{userName(user)}</StyledTitle> ?
          </Typography>
        </DialogContent>
        <DialogActions variant="secondary">
          <Button id="cancel" variant="contained" onClick={() => closeDialog(false)}>
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

export default RemoveUserDialog;
