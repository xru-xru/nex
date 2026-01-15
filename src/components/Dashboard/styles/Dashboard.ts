import styled from 'styled-components';

import Text from 'components/Text';
import SvgGreenArrow from 'components/icons/GreenArrow';
import SvgOrangeArrow from 'components/icons/OrangeArrow';
import SvgRedArrow from 'components/icons/RedArrow';

import { colorByKey } from 'theme/utils';

export const Header = styled.div`
  display: flex;
  justify-content: space-between;

  .NEXYTypography {
    color: ${colorByKey('black')};
  }
`;
export const MidContent = styled.div`
  display: flex;
`;
export const Notifications = styled.div`
  margin-top: 12px;
  margin-left: 30px;
  width: calc(100% - 312px);
  max-height: 300px;
  overflow-y: scroll;
`;
export const NotificationsTitle = styled(Text)`
  font-size: 13px;
  margin-bottom: 10px;
  color: ${colorByKey('black')};
`;
export const Notification = styled.div`
  display: flex;
  padding-top: 12px;
`;
export const NotificationIcon = styled.div`
  width: 36px;
  height: 36px;
  margin-right: 10px;

  svg {
    width: 100%;
    height: 100%;
  }
`;
export const ChartWrap = styled.div`
  position: relative;
  height: 300px;
  width: 300px;
  margin-top: 12px;

  .NEXYTypography {
    font-size: 13px;
    color: ${colorByKey('black')};
  }
`;
export const ChartInnerText = styled.div`
  position: absolute;
  top: 140px;
  left: 61px;
  width: 180px;
  text-align: center;
  overflow: hidden;
`;
export const InnerTextCost = styled.div`
  font-size: 23px;
`;
export const InnerTextGoal = styled.div`
  font-size: 16px;
  color: ${colorByKey('blueGrey')};
`;
export const CostChart = styled.div`
  width: 100%;
  height: 100%;
`;
export const Portfolios = styled.div`
  margin-top: 20px;
`;
export const PortfoliosHeader = styled.div`
  margin-top: 32px;
  display: grid;
  grid-template-columns: 1fr 0.7fr repeat(3, 0.5fr) 0.7fr;
  border-bottom: 1px solid ${colorByKey('paleGrey')};
  padding-bottom: 16px;
`;
export const PortfolioRow = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: 1fr 0.7fr repeat(3, 0.5fr) 0.7fr;
  margin-top: 20px;
  border-bottom: 1px solid ${colorByKey('paleGrey')};
  padding-bottom: 16px;
`;
export const FlexCell = styled.div`
  display: flex;
  align-items: center;

  .NEXYText {
    margin-right: 8px;
    color: ${colorByKey('blueGrey')};
    font-weight: 400;
  }
`;
export const ColorMark = styled.div<{
  readonly color?: string;
}>`
  display: inline-block;
  width: 8px;
  min-width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 8px;
  opacity: 1;
  line-height: 1;
  background: ${({ color }) => color || 'transparent'};
`;
export const LoaderWrap = styled.div<{
  spaced?: boolean;
  table?: boolean;
}>`
  height: 100%;
  div {
    height: ${({ table }) => (table ? '300px' : 'calc(100% - 30px)')};
    margin-top: ${({ spaced }) => (spaced ? '10px' : '0')};
  }
`;
export const GreenTrendArrow = styled(SvgGreenArrow)<{
  rotation: number;
  color: string;
}>`
  transform: ${({ rotation }) => `rotate(${rotation}deg)`};
`;
export const RedTrendArrow = styled(SvgRedArrow)<{
  rotation: number;
}>`
  transform: ${({ rotation }) => `rotate(${rotation}deg)`};
`;
export const StationaryArrow = styled(SvgOrangeArrow)``;
