import { NexoyaProvider } from '../../types/types';

import { useProviders } from '../../context/ProvidersProvider';

import Avatar from '../Avatar/index';
import { isEmpty } from 'lodash';

type Props = {
  providerId: number | string;
  className?: string;
  variant?: 'square' | 'circle';
  color?: 'light' | 'dark';
  [x: string]: any;
};
export const classes = {
  root: 'NEXYAvatarProvider',
};

// some logos don't look nice on white background, therefore we have two variants
// one with suffix '-white' for dark backgrounds, and "regular" ones for light backgrounds
// if avatar version is dark, we serve the dark version of logo
function getLogoUrl(color: string, provider: NexoyaProvider): string {
  if (color === 'dark') return provider.logo || '';
  return provider && provider.logo ? provider.logo.replace('-white', '') : '';
}

const AvatarProvider = ({ providerId, variant = 'square', color = 'light', ...rest }: Props) => {
  const { providerById, activeProviders } = useProviders();
  const provider = !isEmpty(providerById(Number(providerId)))
    ? providerById(Number(providerId))
    : activeProviders?.find((p) => p.provider_id === Number(providerId));
  const avatarSrc = provider ? getLogoUrl(color, provider) : '';

  return <Avatar src={avatarSrc} alt={provider ? provider.name : ''} variant={variant} {...rest} />;
};

export default AvatarProvider;
