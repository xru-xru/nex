import styled from 'styled-components';

import Typography from '../../components/Typography';
import SvgWarningTwo from '../../components/icons/WarningTwo';

import { colorByKey } from '../../theme/utils';

const WrapStyled = styled.div`
  display: flex;
  background-color: ${colorByKey('paleGrey40')};
  align-items: center;
  justify-content: center;
  min-height: 375px;
  flex-direction: column;
  margin-bottom: 20px;

  .NEXYH3 {
    margin-bottom: 8px;
  }

  svg {
    font-size: 48px;
    margin-bottom: 16px;
  }
`;

const NoData = () => (
  <WrapStyled>
    <SvgWarningTwo />
    <Typography component="h3" variant="h3">
      No data available
    </Typography>
    <Typography variant="paragraph">There is no data available for the selected time period.</Typography>
  </WrapStyled>
);

export default NoData;
