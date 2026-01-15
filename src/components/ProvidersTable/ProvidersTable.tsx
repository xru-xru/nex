import { ChannelCollectionEdge, Channels } from '../../types/types.custom';
import { CollectionEdges } from '../../types/types.custom';

import AvatarProvider from '../AvatarProvider';
import Checkbox from '../Checkbox';
import GridRow from '../GridRow';
import TypographyTranslation from '../TypographyTranslation';
import Card from '../layout/Card';

interface Props {
  channels: Channels[];
  selectedChannels: Channels[];
  onClick: (channelId: Channels, isSelected: boolean) => void;
  providerNames: Record<string, any> | {};
  edges: CollectionEdges<ChannelCollectionEdge>[];
}

function ProvidersTable({ edges, channels, providerNames, onClick, selectedChannels }: Props) {
  return (
    <Card
      minHeight="500px"
      style={{
        position: 'relative',
      }}
    >
      {channels.map((channel, index) => {
        const targetEdge = edges.find((edge) => edge.node.collection_id === channel);
        const providerId = targetEdge ? targetEdge.node.provider.provider_id : 0;
        const isSelected: boolean = selectedChannels.includes(channel);
        return (
          <GridRow
            key={`${channel}--${index}`}
            style={{
              cursor: 'pointer',
            }}
          >
            <Checkbox name="checkKpi" checked={isSelected} onClick={() => onClick(channel, isSelected)} />
            <AvatarProvider
              providerId={providerId}
              style={{
                margin: '0 auto',
              }}
              size={20}
            />
            <TypographyTranslation
              text={providerNames[providerId]}
              style={{
                fontSize: '0.825em',
                opacity: 0.5,
              }}
              withTooltip
            />
          </GridRow>
        );
      })}
    </Card>
  );
}

export default ProvidersTable;
