import styled from 'styled-components';

import { useCollections } from '../../../context/CollectionsProvider';

import ChannelChip from '../../../components/ChannelChip';

const WrapStyled = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-top: 24px;
`;

function ChannelList() {
  const { selectedChannels } = useCollections();
  return (
    <WrapStyled>
      {selectedChannels.map((channelId) => {
        return <ChannelChip key={channelId} channelId={channelId} />;
      })}
    </WrapStyled>
  );
}

export default ChannelList;
