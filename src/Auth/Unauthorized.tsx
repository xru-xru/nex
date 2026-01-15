import styled from 'styled-components';

import Button from '../components/Button';
import { Subtitle } from '../components/Typography/styles';
import { Title } from '../routes/onboard/styles';

import auth from './Auth';
import useOrganizationStore from '../store/organization';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  margin: 0 auto;
  gap: 21px;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 24px;
`;

const Unauthorized = () => {
  const { organization, isNexoya } = useOrganizationStore();
  return (
    <Wrapper>
      <Title style={{ textAlign: 'center', maxWidth: 1000, marginBottom: 0 }}>
        You don't have an active invitation
      </Title>
      <Subtitle>It seems like you weren't invited to {organization?.tenant?.name} with this email</Subtitle>
      <ButtonsWrapper>
        <Button onClick={() => auth.logout()} color="secondary" variant="contained">
          Try a different mail
        </Button>
        {isNexoya() ? (
          <Button
            onClick={() => (window.location.href = 'https://www.nexoya.com/demo/')}
            color="primary"
            variant="contained"
          >
            Reach out to sales
          </Button>
        ) : null}
      </ButtonsWrapper>
    </Wrapper>
  );
};

export default Unauthorized;
