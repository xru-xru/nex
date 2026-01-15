import React, { useState } from 'react';

import { get } from 'lodash';

import { useInviteUserMutation } from '../../graphql/user/mutationInviteUser';

import Button from '../../components/Button';
import Dialog from '../../components/Dialog';
import DialogTitle from '../../components/DialogTitle';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import FormGroup from '../../components/Form/FormGroup';
import Snackbar from '../../components/Snackbar';
import Text from '../../components/Text';
import TextField from '../../components/TextField';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export type ShareInvitePayload = {
  to_email: string;
  to_name: string;
};

function InviteUserDialog({ isOpen, onClose }: Props) {
  const [toEmail, setToEmail] = useState<string>('');
  const [toName, setToName] = useState<string>('');
  const [isConfirmationOpen, setIsConfirmationOpen] = useState<boolean>(false);

  function handleClose() {
    setToEmail('');
    setToName('');
    onClose();
  }

  const [, { error }, extendInviteUser] = useInviteUserMutation();

  async function handleSubmitInvite(payload: ShareInvitePayload) {
    try {
      // @ts-ignore
      const res = await extendInviteUser({ ...payload });
      const inviteUser = get(res, 'data.inviteUser', false);

      if (inviteUser) {
        setIsConfirmationOpen(true);
        handleClose();
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
    }
  }

  return (
    <>
      <Dialog isOpen={isOpen} onClose={handleClose}>
        <DialogTitle>
          <Text component="h3">Invite user</Text>
        </DialogTitle>
        <div
          style={{
            width: '300px',
            padding: '0 32px 32px',
          }}
        >
          <FormGroup>
            <TextField
              fullWidth
              autoComplete="off"
              type="email"
              id="email"
              name="email"
              label="Email"
              value={toEmail}
              onChange={(ev) => setToEmail(ev?.target?.value)}
            />
          </FormGroup>
          <FormGroup>
            <TextField
              fullWidth
              autoComplete="off"
              id="name"
              name="name"
              label="Name"
              value={toName}
              onChange={(ev) => setToName(ev?.target?.value)}
            />
          </FormGroup>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              paddingTop: 25,
            }}
          >
            <Button variant="contained" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              disabled={!toEmail.length || !toName.length}
              onClick={() => handleSubmitInvite({ to_email: toEmail, to_name: toName })}
            >
              Submit
            </Button>
          </div>
        </div>
      </Dialog>
      <Snackbar
        open={isConfirmationOpen}
        message="Invitation has been sent"
        autoHideDuration={4000}
        onClose={() => setIsConfirmationOpen(false)}
      />
      {error ? <ErrorMessage error={error} /> : null}
    </>
  );
}

export default InviteUserDialog;
