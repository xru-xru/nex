import { get } from 'lodash';
import styled from 'styled-components';

import { NexoyaTeamMember } from 'types';

import { useTeam } from 'context/TeamProvider';
import { useUpdateTeamMemberRoleMutation } from 'graphql/team/mutationUpdateTeamMemberRole';

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

type Props = {
  member: NexoyaTeamMember;
  newRole: string;
  isDialogOpen: boolean;
  closeDialog: (isOpen: boolean) => void;
};
export function ChangeRoleDialog({ member, newRole, isDialogOpen, closeDialog }: Props) {
  // hooks
  const { teamId } = useTeam();
  const [updateTeamMemberRoleMutation, { error, loading }] = useUpdateTeamMemberRoleMutation({
    team_id: teamId,
    user_id: member.user_id,
    new_role_def: newRole,
  });

  async function handleSubmit() {
    try {
      const res = await updateTeamMemberRoleMutation();
      if (get(res, 'data.updateTeamMemberRole', null)) {
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
        data-cy="changeRoleDialog"
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
            Do you really want change the role for {userName(member)} to
            <br />
            <StyledTitle>{newRole}</StyledTitle> ?
          </Typography>
        </DialogContent>
        <DialogActions variant="secondary">
          <Button id="cancel" variant="contained" onClick={() => closeDialog(false)}>
            Cancel
          </Button>
          <ButtonAsync
            id="delete"
            variant="contained"
            color="primary"
            disabled={loading}
            loading={loading}
            onClick={handleSubmit}
          >
            Confirm
          </ButtonAsync>
        </DialogActions>
      </Dialog>
      {error ? <ErrorMessage error={error} /> : null}
    </>
  );
}
