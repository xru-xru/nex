import styled from 'styled-components';

import { colorByKey } from '../../theme/utils';

type Props = {
  margin?: string;
  style?: React.CSSProperties;
  className?: string;
};

interface HRStyledDividerProps {
  margin: string;
}
const HRStyled = styled.hr<HRStyledDividerProps>`
  height: 1px;
  margin: ${({ margin }) => margin};
  border: none;
  flex-shrink: 0;
  background: ${colorByKey('paleGrey')};
`;

const Divider = ({ margin = '32px 0', style, className }: Props) => (
  <HRStyled style={style} margin={margin} className={className} />
);

export default Divider;
