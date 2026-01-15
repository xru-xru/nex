import { useState } from 'react';

import { get } from 'lodash';
import styled from 'styled-components';

import { useIntegrationsQuery } from '../../graphql/integration/queryIntegrations';

import LoadingPlaceholder from '../../components/LoadingPlaceholder';
import SvgChannel from '../../components/icons/Channel';
import { IntegrationsFilter } from './components/IntegrationsFilter';

import NoDataFound from '../portfolio/NoDataFound';
import IntegrationCard from './integrations/IntegrationCard';
import { NexoyaIntegrationStatus } from 'types';
import useUserStore from '../../store/user';

const IntegrationsGridStyled = styled.div`
  flex-wrap: wrap;
  justify-content: space-between;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(310px, 1fr));
  grid-gap: 24px;
`;
const LoadingWrapStyled = styled.div`
  display: flex;
  flex-wrap: wrap;
`;
const LoadingPlaceholderStyled = styled(LoadingPlaceholder)`
  flex-basis: 30%;
  height: 220px;
  margin-right: 3%;
  margin-bottom: 20px;

  &:nth-child(4),
  &:nth-child(5),
  &:nth-child(6) {
    opacity: 0.5;
  }
`;

const Integrations = () => {
  const { user } = useUserStore();
  const { data, refetch, refetching, initLoading } = useIntegrationsQuery({
    withUser: true,
    withConnection: true,
  });
  const userId = user?.user_id || 0;
  const initialIntegrations = get(data, 'integrations', []);

  const [integrations, setIntegrations] = useState(initialIntegrations);

  return (
    <>
      {initLoading ? (
        <LoadingWrapStyled>
          <LoadingPlaceholderStyled />
          <LoadingPlaceholderStyled />
          <LoadingPlaceholderStyled />
          <LoadingPlaceholderStyled />
          <LoadingPlaceholderStyled />
          <LoadingPlaceholderStyled />
        </LoadingWrapStyled>
      ) : (
        <>
          <IntegrationsFilter
            integrations={initialIntegrations}
            setIntegrations={setIntegrations}
            refetching={refetching}
          />
          {integrations.length ? (
            <IntegrationsGridStyled>
              {integrations?.map((integration) => (
                <IntegrationCard
                  key={integration.integration_id}
                  integration={integration}
                  userId={userId}
                  refetchAll={refetch}
                  loading={refetching}
                  onSyncStarted={(integration) =>
                    setIntegrations((allIntegrations) =>
                      allIntegrations.map((int) =>
                        int.integration_id === integration.integration_id
                          ? { ...int, status: NexoyaIntegrationStatus.Syncing }
                          : int,
                      ),
                    )
                  }
                />
              ))}
            </IntegrationsGridStyled>
          ) : (
            <NoDataFound
              icon={<SvgChannel />}
              title="No integrations match your filters"
              subtitle="Try adjusting your filters or contact your CSM for assistance."
            />
          )}
        </>
      )}
    </>
  );
};

export default Integrations;
