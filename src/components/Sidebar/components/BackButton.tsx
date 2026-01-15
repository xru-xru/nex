import { CSSProperties } from 'react';
import { Route } from 'react-router-dom';

import styled from 'styled-components';

import { PATHS } from '../../../routes/paths';

export const BackButtonStyled = styled.button`
  background: none;
  border: none;
  font-size: inherit;
  font-family: inherit;
  cursor: pointer;
  opacity: 0.5;
  transition: opacity 0.175s;
  padding: 5px 10px;
  margin-right: 15px;

  span {
    margin-right: 10px;
    transition: margin-right 0.2s ease;
  }

  &:hover {
    opacity: 1;

    span {
      margin-right: 13px;
    }
  }
`;
const showOnRoutes = [
  PATHS.APP.HOME_KPI_PICKER,
  PATHS.APP.KPI,
  PATHS.APP.CONTENT,
  PATHS.APP.KPIS_COMPARE,
  PATHS.APP.KPIS_COMPARE_DATES,
  PATHS.APP.PORTFOLIO,
  PATHS.APP.REPORT,
  PATHS.APP.REPORT_NEW,
  PATHS.APP.FUNNEL,
  PATHS.APP.ATTRIBUTION,
];

function BackButton({ style }: { style?: CSSProperties }) {
  return (
    <Route
      exact
      path={showOnRoutes}
      render={({ history }) => (
        <BackButtonStyled
          style={{ ...style, marginBottom: 32 }}
          data-cy="backTopBarBtn"
          onClick={() => {
            history.goBack();
          }}
        >
          <span>←</span>
          Back
        </BackButtonStyled>
      )}
    />
  );
}

export default BackButton;
