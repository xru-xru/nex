import styled from 'styled-components';

import { ChannelCollectionEdge, Channels, CollectionEdges } from '../../../types/types.custom';

import Checkbox from '../../../components/Checkbox';
import ErrorMessage from '../../../components/ErrorMessage';
import GridHeader from '../../../components/GridHeader';
import GridWrap from '../../../components/GridWrap';
import KpiPill from '../../../components/KpiPill/KpiPill';
import LoadingPlaceholder from '../../../components/LoadingPlaceholder';
import NoResults from '../../../components/NoSearchResults';
import { PageHeader } from '../../../components/PageHeader';
import ProvidersTable from '../../../components/ProvidersTable';
import Typography from '../../../components/Typography';

import { colorByKey } from '../../../theme/utils';

import ProviderSearchField from './ProviderSearchField';

interface Props {
  style?: Record<string, any>;
  edges: CollectionEdges<ChannelCollectionEdge>[];
  loading: boolean;
  error: Error | null;
  selectedChannels: Channels[];
  channels: Channels[];
  addChannel: (arg0: Channels) => void;
  removeChannel: (arg0: Channels) => void;
}
const WrappedStyled = styled.div`
  position: relative;
  width: 100%;
  height: 100%;

  .NEXYPageHeader .NEXYTypography {
    color: inherit;
  }
`;
const PillsWrappedStyled = styled.div`
  padding: 24px 48px 10px 24px;
  background-color: ${colorByKey('paleGrey50')};

  .NEXYKpiPill {
    margin-bottom: 12px;
  }
`;
const TableWrappedStyled = styled.div`
  margin-top: 24px;
  overflow-y: auto;

  .NEXYTypographyTranslation {
    font-size: 14px !important;
  }
`;
const LoadingWrapStyled = styled.div`
  padding-top: 20px;

  & > div {
    margin-bottom: 15px;
    background: #f4f6f7;
    height: 40px;

    &:nth-child(1) {
      opacity: 1;
    }
    &:nth-child(2) {
      opacity: 0.75;
    }
  }
`;

function SelectChannels({
  style,
  edges,
  loading,
  error,
  selectedChannels,
  channels,
  addChannel,
  removeChannel,
}: Props) {
  const noEdges: boolean = edges.length === 0;
  const providerNames = edges.reduce(
    (acc, current) => {
      acc[current.node.provider.provider_id] = current.node.provider.name || '';
      return acc;
    },
    {
      Channels: '',
    }
  );

  function onProviderClick(channelId: Channels, selected: boolean) {
    selected ? removeChannel(channelId) : addChannel(channelId);
  }

  function toggleAllKpis() {
    const allSelected = selectedChannels.length && selectedChannels.length === channels.length;
    channels.map((channelId: Channels) => {
      allSelected ? removeChannel(channelId) : addChannel(channelId);
      return channelId;
    });
  }

  function getProvider(channelId: Channels) {
    const target = edges.find((edge) => edge.node.collection_id === channelId);
    return target.node.provider;
  }

  return (
    <WrappedStyled style={style}>
      <PageHeader>
        <Typography variant="titleGroup">Edit channels list</Typography>
      </PageHeader>
      {selectedChannels.length ? (
        <PillsWrappedStyled>
          {selectedChannels.map((channelId) => {
            return (
              <KpiPill
                key={channelId}
                kpi={getProvider(channelId)}
                skipMeta={true}
                handleRemove={() => {
                  removeChannel(channelId);
                }}
              />
            );
          })}
        </PillsWrappedStyled>
      ) : null}
      <NoResults isVisible={!loading && !error && noEdges} noResultsCustomMessage="No channels available" />
      <ProviderSearchField />
      {!loading && !noEdges && (
        <TableWrappedStyled>
          <GridWrap gridTemplateColumns="49px 80px minmax(180px, 1.5fr) minmax(100px, 1fr)">
            <GridHeader>
              <Checkbox
                checked={selectedChannels.length && selectedChannels.length === channels.length}
                onClick={toggleAllKpis}
              />
              <span>Channel</span>
            </GridHeader>
            <ProvidersTable
              edges={edges}
              channels={channels}
              selectedChannels={selectedChannels}
              providerNames={providerNames}
              onClick={onProviderClick}
            />
          </GridWrap>
        </TableWrappedStyled>
      )}
      {loading && (
        <LoadingWrapStyled>
          <LoadingPlaceholder />
          <LoadingPlaceholder />
        </LoadingWrapStyled>
      )}
      {error ? <ErrorMessage error={error} /> : null}
    </WrappedStyled>
  );
}

export default SelectChannels;
