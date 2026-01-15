import styled from 'styled-components';

import { useCollections } from '../../context/CollectionsProvider';
import { useProviders } from '../../context/ProvidersProvider';

import { colorByKey } from '../../theme/utils';

import AvatarProvider from '../AvatarProvider';
import NameTranslation from '../NameTranslation';

const WrapStyled = styled.div`
  display: flex;
  width: calc(50% - 12px);
  margin-bottom: 24px;
  padding: 24px;
  border-width: 1px;
  border-style: solid;
  border-color: ${colorByKey('paleLilac66')};
  border-radius: 5px;
  align-items: center;
`;
const NameStyled = styled.div`
  font-size: 18px;
`;
const AvatarStyled = styled.div`
  margin-right: 16px;
`;
interface Props {
  channelId: number;
}

function ChannelChip({ channelId }: Props) {
  const { providerById } = useProviders();
  const collections = useCollections();
  const edge = collections.edges.find((edge) => edge.node.collection_id === channelId);
  const providerId = edge ? edge.node.provider.provider_id : 0;
  return (
    <WrapStyled>
      <AvatarStyled>
        <AvatarProvider providerId={providerId} size={24} />
      </AvatarStyled>
      <NameStyled>
        <NameTranslation text={providerById(providerId).name || ''} />
      </NameStyled>
    </WrapStyled>
  );
}

export default ChannelChip;
