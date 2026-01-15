import clsx from 'clsx';
import styled from 'styled-components';

import Avatar from '../Avatar';
import SvgChannel from '../icons/Channel';
import SvgKpi from '../icons/Kpi';
import SvgPortfolio from '../icons/Portfolio';

type Props = {
  type: 'KPI' | 'PORTFOLIO' | 'CHANNEL';
  className?: string;
  [x: string]: any;
};
export const classes = {
  root: 'NEXYAvatarReport',
};
const AvatarStyled = styled(Avatar)`
  svg {
    width: 100%;
    height: 100%;
  }
`;

function AvatarReport({ type, className, ...rest }: Props) {
  return (
    <AvatarStyled className={clsx(className, classes.root)} {...rest}>
      {type === 'KPI' && <SvgKpi />}
      {type === 'PORTFOLIO' && <SvgPortfolio />}
      {type === 'CHANNEL' && <SvgChannel />}
    </AvatarStyled>
  );
}

export default AvatarReport;
