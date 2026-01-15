import styled from 'styled-components';

import AvatarProvider from '../AvatarProvider';

type Props = {
  providerId: number;
};
const WrapStyled = styled.div`
  margin-bottom: 45px;

  h2 {
    margin-bottom: 10px;
  }
`;

function ProviderInfo({ providerId }: Props) {
  return (
    <WrapStyled data-cy="providerInfo">
      <AvatarProvider
        size={80}
        style={{
          margin: '0 auto 10px auto',
        }}
        providerId={providerId}
      />
      <h2>Sub-accounts/views</h2>
      <p>We have found multiple sub-accounts/views which we can connect.</p>
      <p>Pick what you would like to connect.</p>
    </WrapStyled>
  );
}

export default ProviderInfo;
