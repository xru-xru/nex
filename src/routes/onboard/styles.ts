import styled from 'styled-components';

import GridRow from '../../components/GridRow';
import LoadingPlaceholder from '../../components/LoadingPlaceholder/LoadingPlaceholder';
import Text from '../../components/Text';

import { nexyColors } from '../../theme';

export const FormWrapperStyled = styled.div`
  max-width: 250px;
`;

export const OnboardingFormWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex: 0.5;
  flex-direction: column;
`;

export const OnboardingContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  flex-wrap: wrap;
`;

export const OnboardingContentWrapperContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  padding-right: 70px;
`;

export const OnboardingForm = styled.div`
  display: flex;
  align-items: flex-start;
  flex-flow: column nowrap;

  @media (min-width: 48em) {
    padding: 0 144px;
  }

  @media (min-width: 64em) {
    padding: 0 72px;
    height: 100%;
  }
`;

export const LogoWrapper = styled.div`
  display: block;
  vertical-align: middle;
  padding: 40px 8px 32px;
  width: 144px;
  margin-left: -4px;
`;

export const Title = styled.h2`
  margin-bottom: 26px;
  font-weight: 500;
  font-size: 48px;
  letter-spacing: -1.8px;
  max-width: 500px;
`;

export const Tip = styled.p`
  max-width: 450px;
  font-weight: normal;
  font-size: 12px;
  opacity: 0.5;
  margin: 16px auto;
  padding: 4px;
`;

export const InputWrapper = styled.div`
  display: flex;
  width: max-content;
  flex-direction: row;
  gap: 16px;
  align-items: center;
  max-width: 450px;
`;

export const FormGroupStyled = styled.div`
  margin: 8px 0;
`;

export const FormStyled = styled.form`
  max-width: 250px;
`;

export const IntWrapStyled = styled.div`
  display: flex;
  flex-wrap: wrap;
  max-width: 450px;
`;

export const LoadingPlaceholderStyled = styled(LoadingPlaceholder)`
  width: 100%;
  height: 53px;
  margin-bottom: 25px;

  &:nth-child(2) {
    opacity: 0.65;
  }

  &:nth-child(3) {
    opacity: 0.45;
  }
`;

export const LoadingWrapStyled = styled.div`
  & > div:nth-child(2) {
    height: 24px;
    opacity: 0.2;
  }
`;

export const AvatarsLoadingStyled = styled.div`
  display: flex;
  margin-bottom: 18px;

  & > * {
    border-radius: 50%;
    width: 44px;
    height: 44px;
    margin-left: -18px;
    border: 2px solid white;

    &:nth-child(1) {
      margin-left: -2px;
    }

    &:nth-child(2) {
      background: #eff2f3;
    }

    &:nth-child(3) {
      background: #f8f9fa;
    }

    &:nth-child(4) {
      background: #fafafa;
    }
  }
`;

export const TeamCardWrapper = styled.div`
  border-radius: 4px;
  box-shadow: 0 0 0 1px rgba(223, 225, 237, 0.6);
  flex-grow: 1;
  min-height: 200px;
  max-width: 450px;
`;

export const OnboardingGuideWrapper = styled.div`
  margin-top: 32px;
`;

export const GreetingsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

export const TextStyled = styled(Text)`
  font-size: 18px;
  font-weight: 500;
  letter-spacing: 0.8px;
  margin-bottom: 18px;
`;

export const MembersWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 18px;
`;

export const TableWrapper = styled.div`
  margin-top: 48px;
`;

export const GridContainer = styled.div<{
  extraColumn?: boolean;
}>`
  width: 100%;
  margin-top: 32px;

  .NEXYCSSGrid {
    min-width: 100%;
    padding: 0 24px;
    grid-template-columns: 2fr 1fr 1fr 1fr 2fr;
  }
`;
export const TeamCard = styled.div`
  width: 100%;

  border-radius: 4px;
  border: 1px solid #eaeaea;
`;

export const TeamCardContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
`;

type StatusProps = {
  status: 'PENDING' | 'IN_PROGRESS' | 'DONE';
};
export const StatusTag = styled.div<StatusProps>`
  text-transform: capitalize;
  background-color: ${({ status }) => {
    switch (status) {
      case 'IN_PROGRESS':
        return '#FAB570';
      case 'DONE':
        return '#88E7B7';
      default:
        return '#eaeaea';
    }
  }};
  color: ${nexyColors.neutral900};
  font-weight: 400;
  padding: 2px 8px;
  border-radius: 25px;
  font-size: 12px;
  min-width: 72px;
  display: flex;
  justify-content: center;
`;

export const StyledGridRow = styled(GridRow)<{ hasDescription: boolean }>`
  justify-items: start;
  border-radius: 4px;
  background-color: ${(props) => (props.hasDescription ? nexyColors.paleWhite : 'inherit')};
  cursor: ${(props) => (props.hasDescription ? 'pointer' : 'auto')};
`;
