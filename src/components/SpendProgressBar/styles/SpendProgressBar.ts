import styled from 'styled-components';

import Text from 'components/Text';

import { colorByKey } from 'theme/utils';

export const Wrapper = styled.div`
  padding: 12px 0;
  position: relative;

  &:after {
    content: ' ';
    position: absolute;
    height: 100%;
    width: 1px;
    top: 0;
    left: 50%;
    bottom: 0;
    border-left: 1px dashed ${colorByKey('paleLilac')};
  }
`;
export const BarWrapper = styled.div`
  height: 3px;
  position: relative;
  background: ${colorByKey('paleLilac')};
  overflow: hidden;
`;
export const Bar = styled.span<{
  percentage: number;
}>`
  display: block;
  height: 100%;
  width: ${({ percentage }) => `${Math.abs(percentage)}%`};
  left: ${({ percentage }) => (percentage < 0 ? `calc(50% - ${Math.abs(percentage)}%)` : `50%`)};
  background-color: ${colorByKey('azure')};
  border-radius: 3px;
  position: relative;
  overflow: hidden;
`;
export const Signs = styled.div`
  position: absolute;
  bottom: 0;
  top: 0;
  width: 100%;
  height: 34px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  color: ${colorByKey('azure')};
`;
export const Title = styled(Text)`
  color: ${colorByKey('blueGrey')};
  font-size: 13px;
  font-weight: 400;
`;
