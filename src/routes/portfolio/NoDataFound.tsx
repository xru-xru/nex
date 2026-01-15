import { CSSProperties } from 'react';

import styled from 'styled-components';

import Typography from '../../components/Typography';

import { mainColors } from '../../theme/theme';
import { colorByKey } from '../../theme/utils';

import { nexyColors } from '../../theme';

const WrapperStyled = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 16px;
  border-radius: 3px;

  .NEXYButton {
    padding: 12px 24px !important;
    margin-left: unset !important;
    border-bottom-right-radius: 4px !important;
    border-bottom-left-radius: 4px !important;
    height: unset !important;
  }
`;

const IconWrapper = styled.div`
  svg {
    width: 40px;
    height: 40px;
  }
`;

const NoDataTitle = styled(Typography)`
  color: #2a2a32;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 120%; /* 24px */
  letter-spacing: -0.1px;
`;

const NoDataWrapperStyled = styled.div`
  width: 100%;
  height: 275px;
  background-color: ${colorByKey('seasalt')};
  border: 1px solid ${mainColors.secondary};
  border-radius: 5px;
  display: flex;
  justify-content: center;
  position: relative;
`;

interface Props {
  title: string;
  subtitle: string;
  cta?: JSX.Element;
  icon?: JSX.Element;
  style?: CSSProperties;
}

function NoDataFound({ title, subtitle, cta, icon, style }: Props) {
  return (
    <NoDataWrapperStyled style={style}>
      <WrapperStyled>
        <IconWrapper>{icon}</IconWrapper>
        <NoDataTitle>{title}</NoDataTitle>
        <Typography style={{ color: nexyColors.secondaryText }}>{subtitle}</Typography>
        {cta ?? null}
      </WrapperStyled>
    </NoDataWrapperStyled>
  );
}

export default NoDataFound;
