import { RouterHistory } from 'react-router-dom';
import 'react-router-dom';

import styled from 'styled-components';

import { PATHS } from '../../routes/paths';

import { colorByKey } from '../../theme/utils';

import Button from '../Button';
import Typography from '../Typography';

type Props = {
  isEmailShare: boolean;
  history: RouterHistory;
  email: string;
  handleClose: () => void;
};
const WrapStyled = styled.div`
  // min-width: 450px;
  // width: 450px;
  // max-width: 450px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .NEXYButton {
    margin-top: 44px;
  }
`;
const NoteStyled = styled.div`
  padding: 20px 70px 44px 70px;
  color: ${colorByKey('cloudyBlue')};
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.5px;
  line-height: 16px;
  .NEXYButton {
    margin-top: 0;
  }
`;

function ShareSuccessMessage({ isEmailShare, history, email, handleClose }: Props) {
  return (
    <WrapStyled>
      <span
        role="img"
        aria-label="hands emoji"
        style={{
          fontSize: 48,
        }}
      >
        🙌
      </span>
      <Typography
        variant="h1"
        component="h2"
        style={{
          marginBottom: '8',
        }}
      >
        Invite sent
      </Typography>
      <Typography
        variant="subtitle"
        style={{
          textAlign: 'center',
        }}
        withEllipsis={false}
      >
        We have sent an invite link to
      </Typography>
      <Typography
        variant="subtitle"
        style={{
          textAlign: 'center',
        }}
        withEllipsis={false}
      >
        {email}
      </Typography>
      <Button onClick={handleClose} color="primary" variant="contained" autoFocus>
        Awesome, close this window now.
      </Button>
      {isEmailShare ? (
        <NoteStyled>
          <strong>Note:</strong> This user is now invited and will get read-only access to your reports. You can invite
          the user as a user with regular permissions in the{' '}
          <Button color="primary" variant="text" onClick={() => history.push(PATHS.APP.SETTINGS)}>
            Team Settings.
          </Button>
        </NoteStyled>
      ) : null}
    </WrapStyled>
  );
}

export default ShareSuccessMessage;
