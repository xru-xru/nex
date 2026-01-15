import { Location } from 'react-router-dom';
import 'react-router-dom';

import queryString from 'query-string';
import styled from 'styled-components';

import { queryToString } from '../../utils/query';

import AvatarProvider from '../../components/AvatarProvider';
import ErrorBoundary from '../../components/ErrorBoundary';

type Props = {
  location: Location;
};
const WrapStyled = styled.div`
  display: flex;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  max-width: 550px;
  margin: 0 auto;
  padding: 25px;
`;

function OauthError({ location }: Props) {
  const query = queryString.parse(location.search);
  const errorType = queryToString(query.error_type);
  const errorMessage = queryToString(query.error_message);
  const providerId = queryToString(query.provider_id);
  const errorDescription = queryToString(query.error_description);
  return (
    <ErrorBoundary>
      <WrapStyled>
        <AvatarProvider providerId={Number(providerId)} />
        <h2
          style={{
            margin: '25px 0',
            textAlign: 'center',
            lineHeight: 1.2,
          }}
        >
          {errorMessage}
        </h2>
        <p>{errorType}</p>
        <p>{errorDescription}</p>
      </WrapStyled>
    </ErrorBoundary>
  );
}

export default OauthError;
