import React from 'react';
import { CircleCheck, CircleDashed, CircleX } from 'lucide-react';

import { get, truncate } from 'lodash';
import styled, { css, keyframes } from 'styled-components';
import { NumberParam, useQueryParams } from 'use-query-params';

import { NexoyaIntegration, NexoyaIntegrationStatus, NexoyaUser } from '../../../types/types';

import { useDeleteIntegrationMutation } from '../../../graphql/integration/mutationDeleteIntegration';
import { getRelativeTimeString } from 'utils/dates';

import { useIntegrationPopup } from '../../../hooks/useIntegrationPopup';
import { useRefetchProvidersOnChange } from '../../../hooks/useRefetchProvidersOnChange';
import { tryCatchMutation } from '../../../utils/graphql';
import translate from '../../../utils/translate';
import Button from '../../../components/Button';
import Dialog, { useDialogState } from '../../../components/Dialog';
import DialogActions from '../../../components/DialogActions';
import DialogContent from '../../../components/DialogContent';
import DialogTitle from '../../../components/DialogTitle';
import Divider from '../../../components/Divider';
import ErrorBoundary from '../../../components/ErrorBoundary';
import SwitchAsync from '../../../components/SwitchAsync';
import Text from '../../../components/Text';
import Typography from '../../../components/Typography';
import TypographyTranslation from '../../../components/TypographyTranslation';
import Card from '../../../components/layout/Card';

import { nexyColors } from '../../../theme';
import EditFilterButton from './integrationCard/EditFilterButton';
import { SyncIntegrationButton } from './integrationCard/SyncIntegrationButton';
import AvatarProvider from '../../../components/AvatarProvider';
import { TagStyled } from '../../portfolio/styles/OptimizationProposal';
import useTranslationStore from '../../../store/translations';
import useUserStore from '../../../store/user';
import useOrganizationStore from '../../../store/organization';

type Props = {
  integration: NexoyaIntegration;
  refetchAll: () => void;
  loading: boolean;
  userId: number;
  onSyncStarted?: (integration: NexoyaIntegration) => void;
};
type CardProps = {
  readonly connected: boolean;
  readonly highlight: boolean;
};

const pulse = keyframes`
  0% {
    border-color: ${nexyColors.greenTeal};
    box-shadow: 0 0 0 0 rgba(14, 199, 106, 0.71);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(14, 199, 106,  0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(14, 199, 106,  0);
  }
`;

const IntegrationCardStyled = styled(Card)<CardProps>`
  flex-basis: 31%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: flex-start;
  position: relative;
  border-radius: 4px;
  //border: 1px solid #eaeaea;
  box-shadow: rgb(223, 225, 237) 0px 0px 0px 1px;
  margin-bottom: 0px;
  padding: 24px;

  ${({ highlight }) =>
    highlight &&
    css`
      animation: ${pulse} 2s infinite;
    `}

  & > div {
    display: flex;
    align-items: center;
    padding-top: 20px;
    margin-bottom: 15px;
  }

  h3 {
    margin-top: 8px;
    margin-bottom: 15px;
  }

  .NEXYParagraph,
  p {
    opacity: 1;
    color: inherit;
    font-weight: 400;
    text-align: center;
    margin-bottom: 20px;
  }

  img {
    min-width: 40px;
    max-width: 160px;
    height: auto;
    max-height: 40px;
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

function getUserInfo(user?: NexoyaUser | void): {
  name: string;
  id: number;
} {
  let name;
  let id = 0;

  if (user) {
    name = `${user.firstname?.slice(0, 1)?.toUpperCase() || ''}. ${user.lastname || ''}`;
    name = name.trim() ? name : user.email;
    id = user.user_id || 0;
  }

  name = name ? name : 'Unknown';
  return {
    name,
    id,
  };
}

// TODO: this is a copy of an already existing component in the components folder
// this needs to be cleaned up after we set on a unified API
function CardIntegration({ integration, loading, refetchAll, userId, onSyncStarted }: Props) {
  const { translations } = useTranslationStore();

  const { customization } = useOrganizationStore();

  const [queryParams] = useQueryParams({
    providerId: NumberParam,
  });
  const { isSupportUser } = useUserStore();

  const { isOpen, toggleDialog } = useDialogState({
    initialState: false,
  });
  const { connecting, openConnectionWindow } = useIntegrationPopup({
    url: integration.connectionUrl || '',
    callbackFn: refetchAll,
  });
  const [deleteIntegration] = useDeleteIntegrationMutation({
    providerId: integration.provider_id,
  });
  // Comment: we need to refetch the providers to know which are active
  // and which ones we want to show in the KPI filters.
  useRefetchProvidersOnChange(integration.connected);

  async function toggleIntegration(ev: any) {
    if (loading) {
      return;
    }

    if (integration.type === 'manual') {
      toggleDialog();
      return;
    }

    if (!integration.connected) {
      if (!integration.connectionUrl) {
        return;
      }

      openConnectionWindow(ev);
      return;
    }

    try {
      const res = await tryCatchMutation(deleteIntegration);

      if (get(res, 'data.deleteIntegration', false)) {
        refetchAll();
      } else {
        throw new Error('Something went wrong');
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
    }
  }

  const hasFilters = Boolean(integration.hasFilter);
  const connected = integration.connected;

  const intUser = getUserInfo(integration.user);
  const connectedByCurrUser = [intUser.id].includes(userId);
  const hasUserId = Boolean(intUser.id);
  const isFilterEditDisabled = connected && hasUserId && !connectedByCurrUser && !isSupportUser;
  const provider = get(integration, 'provider');
  const providerDescription = translate(translations, provider?.description);
  const providerName = translate(translations, provider?.name);

  return (
    <ErrorBoundary>
      <IntegrationCardStyled
        connected={integration.connected}
        data-cy={provider?.name}
        highlight={queryParams.providerId === integration?.provider_id}
      >
        <AvatarProvider providerId={provider?.provider_id} />
        <TypographyTranslation text={provider?.name} variant="h3" component="h3" />
        <Typography style={{ height: 70, textAlign: 'left', color: nexyColors.neutral400 }} withEllipsis={false}>
          {truncate(providerDescription, { length: 100 })}
        </Typography>

        <div className="flex w-full justify-between !pt-0">
          <div className="flex w-full flex-row items-center justify-between">
            {integration.connected && (
              <TagStyled style={{ fontSize: 10, height: 20, fontWeight: 300, alignItems: 'center' }} bgColor="#eaeaea">
                <Typography withTooltip={intUser?.name.length > 6} style={{ maxWidth: 110, marginBottom: 0 }}>
                  Connected by {intUser.name}
                </Typography>
              </TagStyled>
            )}
            {integration.connected && <IntegrationStatusLabel integration={integration} />}
          </div>
        </div>

        <Divider style={{ margin: 0 }} />
        <div className="!mb-0 flex w-full items-center justify-between">
          <SwitchAsync
            isOn={integration.connected}
            loading={connecting}
            disabled={loading}
            onToggle={toggleIntegration}
            data-cy="switch"
          />

          <div className="inline-flex items-center justify-between gap-x-1">
            {connected && isSupportUser && integration.status !== NexoyaIntegrationStatus.Syncing && (
              <SyncIntegrationButton
                channelName={providerName}
                providerId={integration.provider_id}
                onSyncStarted={() => {
                  onSyncStarted?.(integration);
                }}
              />
            )}
            {hasFilters && isSupportUser && (
              <EditFilterButton
                disabled={!connected || isFilterEditDisabled}
                integrationId={integration.integration_id}
                providerId={integration.provider_id}
              />
            )}
          </div>
        </div>
      </IntegrationCardStyled>
      {integration.type === 'manual' ? (
        <Dialog
          isOpen={isOpen}
          onClose={toggleDialog}
          aria-labelledby="alter-dialog-title"
          aria-describedby="alert-dialog-description"
          data-cy="manualIntegrationDialog"
        >
          <DialogTitle id="alert-dialog-title">
            <Text component="h3">This is currently a manual integration.</Text>
          </DialogTitle>
          <DialogContent id="alert-dialog-description">
            <Text>
              Please reach out to:
              <br />
              <strong>{customization?.onboardingMail}</strong>
            </Text>
          </DialogContent>
          <DialogActions>
            <Button id="close" variant="contained" onClick={toggleDialog}>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      ) : null}
    </ErrorBoundary>
  );
}

export default CardIntegration;

const IntegrationStatusLabel = ({ integration }: { integration: NexoyaIntegration }) => {
  if (!integration.status) {
    return null;
  }

  return integration.status === NexoyaIntegrationStatus.Synced ? (
    <div>
      <CircleCheck
        className="h-5 w-5"
        style={{
          fill: nexyColors.greenTeal,
          stroke: nexyColors.white,
        }}
      />
      <span className="ml-1 text-[11px] text-neutral-500">
        synced {getRelativeTimeString(new Date(integration.lastSyncAt))}
      </span>
    </div>
  ) : integration.status === NexoyaIntegrationStatus.Error ? (
    <div>
      <CircleX
        className="h-5 w-5"
        style={{
          fill: nexyColors.red400,
          stroke: nexyColors.white,
        }}
      />
      <span className="ml-1 text-[11px] text-neutral-500">sync failed</span>
    </div>
  ) : (
    <div>
      <CircleDashed
        className="h-4 w-4"
        style={{
          fill: nexyColors.white,
          stroke: nexyColors.pumpkinOrange,
        }}
      />
      <span className="ml-1 text-[11px] text-neutral-500">sync in progress</span>
    </div>
  );
};
