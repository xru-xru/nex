import { get } from 'lodash';

import { useTeamQuery } from '../graphql/team/queryTeam';

import { isEmptyObj } from '../utils/object';

function useCustomTheme() {
  const { data } = useTeamQuery();
  const theme = JSON.parse(get(data, 'team.customization', '{}'));
  const hasTheme = theme && !isEmptyObj(theme) && theme?.custom_theme;
  return {
    hasTheme,
    customTheme: hasTheme
      ? theme.custom_theme
      : {
          theme: '',
          colors: [],
        },
  };
}

export default useCustomTheme;
