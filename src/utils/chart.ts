import { nexyColors } from 'theme';

import useCustomTheme from 'hooks/useCustomTheme';

export function useGetSeriesColor() {
  const { hasTheme, customTheme } = useCustomTheme();
  const colors = {
    trend: hasTheme ? customTheme.colors[0] : nexyColors.azure,
    achieved: hasTheme ? customTheme.colors[0] : nexyColors.azure,
    predicted: hasTheme ? customTheme.colors[3] : nexyColors.lightPeriwinkle,
    potential: hasTheme ? customTheme.colors[1] : nexyColors.greenTeal,
    past: hasTheme ? customTheme.colors[2] : nexyColors.lilac,
  };
  colors.trend = colors.trend + '54';
  return (type: string) => colors[type];
}
