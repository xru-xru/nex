import { ChannelInput, Channels } from '../types/types.custom';

export function channelInputArr(channels: Channels[] | []): ChannelInput[] {
  return channels.map((channel) => {
    return {
      collection_id: channel,
    };
  });
}
