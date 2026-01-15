import { Link } from 'react-router-dom';

import styled from 'styled-components';
import Typography from '../../../components/Typography';
import AvatarProvider from 'components/AvatarProvider';
import Flex from 'components/Flex';

import { colorByKey } from 'theme/utils';

import { nexyColors } from '../../../theme';

export const WrapStyled = styled.div`
  .NEXYGridRow {
    border-bottom-width: 0;
  }
  .contentType {
    color: ${colorByKey('secondaryText')};
    font-size: 12px;
  }
  .NEXYButtonGoal {
    border: 1px solid ${colorByKey('paleLilac50')};
    box-shadow: 0 1px 2px 0 ${colorByKey('battleshipGrey09')};
    padding: 7px 16px;
  }
  .NEXYButtonMetric {
    font-size: 13px;
    letter-spacing: 0.8px;
    color: ${colorByKey('blueGrey')};
  }
  .NEXYHelpCenter {
    margin-right: 0;
    margin-left: 16px;
  }
`;

export const ParentMetricWrap = styled(Flex)`
  min-width: 0;
`;

export const RowCell = styled(Flex)`
  justify-content: center;
  align-items: center;
  height: 100%;

  .NEXYButtonMetric {
    font-size: 13px;
    font-weight: 300;
    letter-spacing: 0.8px;
    color: ${colorByKey('raisinBlack')} !important;
  }
`;

export const ChevronWrap = styled.div<{
  readonly expanded?: boolean;
}>`
  display: flex;
  cursor: pointer;
  align-items: center;
  padding-right: 8px;
  color: #a6a7b5;
  & > svg {
    transform: ${({ expanded }) => (expanded ? 'rotate(180deg)' : 'rotate(0deg)')};
    transition: transform 250ms ease-in-out;
    transform-origin: center;
  }
`;

export const AvatarWrapStyled = styled(AvatarProvider)<{
  readonly condensed?: boolean;
  readonly providerId: number;
}>`
  display: flex;
  margin-right: 12px;
  margin-left: ${({ condensed }) => (condensed ? 0 : '12px')};
`;

export const ChildAvatarWrapper = styled(Link)`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding-right: 24px;
`;

export const ChildContentWrap = styled(Flex)`
  padding: 6px;
`;

export const PaddedLabel = styled.div`
  overflow: hidden;
`;

export const BudgetLabel = styled(Typography)`
  color: #a6a7b5 !important;
  font-size: 12px;
`;

export const StyledLink = styled(Link)`
  padding: 2px 6px;
  border-radius: 5px;
  transition: all 0.2s;

  display: flex;
  align-items: center;

  .copyContentButton {
    opacity: 0;
    margin-left: 6px;
  }

  &:hover {
    text-decoration: underline;
    background-color: ${nexyColors.seasalt};

    .copyContentButton {
      opacity: 1;
    }
  }
`;
