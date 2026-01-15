import { LINE_COLORS } from '../constants/lines';

import useCustomTheme from './useCustomTheme';

function useTeamColor() {
  const { hasTheme, customTheme } = useCustomTheme();

  return (index: number) => (hasTheme && customTheme.colors[index] ? customTheme.colors[index] : LINE_COLORS[index]);
}

export default useTeamColor;
