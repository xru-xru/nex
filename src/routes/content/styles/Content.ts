import styled from 'styled-components';

import LoadingPlaceholder from 'components/LoadingPlaceholder';
import Typography from 'components/Typography';

export const LoadingWrapStyled = styled.div`
  padding: 24px;
  & > div:first-child {
    margin-bottom: 50px;
  }

  .section {
    &:nth-child(2) {
      margin-bottom: 50px;
    }

    &:nth-child(2) > div {
      height: 350px;
      opacity: 0.75;
    }

    &:nth-child(3) > div {
      height: 400px;
      opacity: 0.35;
    }
  }
`;
export const HeaderStyled = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;
export const LoadingStyled = styled.div`
  display: flex;
  align-items: center;
  width: 100%;

  & > div:last-child {
    flex: 1;
  }
`;
export const AvatarLoader = styled(LoadingPlaceholder)`
  width: 60px;
  height: 60px;
  border-radius: 60px;
  margin-right: 15px;
`;
export const TitleLoader = styled(LoadingPlaceholder)`
  height: 35px;
  max-width: 650px;
  margin-bottom: 6px;
`;
export const SubtitleLoader = styled(LoadingPlaceholder)`
  height: 20px;
  width: 150px;
`;
export const TableTitle = styled(Typography)`
  margin-bottom: 24px;
`;
export const MetricTableLoader = styled(LoadingPlaceholder)`
  width: 100%;
  height: 300px;
`;
export const TableLoader = styled(LoadingPlaceholder)`
  margin-left: 24px;
  height: 300px;
  width: calc(100% - 48px);
`;
