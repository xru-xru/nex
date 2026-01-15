import styled from 'styled-components';

import { track } from '../../../constants/datadog';
import { EVENT } from '../../../constants/events';

import { PATHS } from '../../../routes/paths';

import { colorByKey } from '../../../theme/utils';

import '../../../theme';
import ButtonBase from '../../ButtonBase';
import SvgCog from '../../icons/Cog';

const ButtonBaseStyled = styled(ButtonBase)`
  padding: 8px;
  font-size: 20px;
  color: ${colorByKey('blueGrey')};

  &:hover {
    color: ${colorByKey('charcoalGrey')};
  }
`;

function Settings() {
  return (
    <ButtonBaseStyled
      data-cy="settingsTopBarBtn"
      to={PATHS.APP.SETTINGS}
      onClick={() => {
        track(EVENT.ROUTE_SETTINGS);
      }}
    >
      <SvgCog />
    </ButtonBaseStyled>
  );
}

export default Settings;
