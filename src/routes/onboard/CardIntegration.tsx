import { capitalize, get } from 'lodash';
import styled, { css } from 'styled-components';

import { NexoyaIntegration } from '../../types/types';

import { useDeleteIntegrationMutation } from '../../graphql/integration/mutationDeleteIntegration';

import { useIntegrationPopup } from '../../hooks/useIntegrationPopup';
import { useRefetchProvidersOnChange } from '../../hooks/useRefetchProvidersOnChange';

import AvatarProvider from '../../components/AvatarProvider';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import SwitchAsync from '../../components/SwitchAsync';
import Card from '../../components/layout/Card';

type Props = {
  integration: NexoyaIntegration;
  refetchAll: () => void;
  loading: boolean;
};
type CardProps = {
  readonly connecting: boolean;
  readonly connected: boolean;
};

const IntegrationCardStyled = styled(Card)<CardProps>`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0;
  padding: 4px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #fafafa;
    transition: all 0.2s ease;
  }

  ${({ connecting }) =>
    connecting &&
    css`
      /* box-shadow: 0 7px 17px 0 rgba(0, 0, 0, 0.2); */
    `}

  &:last-child {
    margin-right: 0;
  }

  img {
    max-width: 130px;
    height: auto;
    max-height: 30px;
  }

  button {
    ${({ connected }) => {
      if (!connected) {
        return css`
          &:hover {
            background: #eee;
          }
        `;
      }

      return '';
    }}
  }
`;

const AvatarContainerStyled = styled.div`
  height: 50px;
  display: flex;
  align-items: center;

  .NEXYAvatarImg {
    object-fit: contain;
  }
`;

function CardIntegration({ integration, refetchAll, loading }: Props) {
  const [deleteIntegration, { error }] = useDeleteIntegrationMutation({
    providerId: integration.provider_id,
  });
  const { connecting, openConnectionWindow } = useIntegrationPopup({
    url: integration.connectionUrl || '',
    callbackFn: refetchAll,
  });
  // Comment: we need to refetch the providers to know which are active
  // and which ones we want to show in the KPI filters.
  useRefetchProvidersOnChange(integration.connected);

  async function toggleIntegration(ev: any) {
    if (loading) {
      return;
    }

    if (!integration.connected) {
      if (!integration.connectionUrl) return;
      openConnectionWindow(ev);
      return;
    }

    try {
      const res = await deleteIntegration();

      if (get(res, 'data.deleteIntegration', false)) {
        refetchAll();
        return;
      }

      throw new Error('Something went wrong');
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
    }
  }

  return (
    <>
      <IntegrationCardStyled
        connected={integration.connected}
        connecting={loading}
        tabIndex="0"
        onClick={toggleIntegration}
      >
        <AvatarContainerStyled>
          <AvatarProvider variant="square" providerId={integration.provider_id} />
          <div style={{ marginLeft: 16 }}>Connect {capitalize(integration?.name)}</div>
        </AvatarContainerStyled>
        <SwitchAsync isOn={integration.connected} loading={connecting} disabled={loading} onToggle={() => {}} />
      </IntegrationCardStyled>
      {error ? <ErrorMessage error={error} /> : null}
    </>
  );
}

export default CardIntegration;
