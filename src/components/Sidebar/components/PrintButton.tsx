import { Route } from 'react-router-dom';

import styled from 'styled-components';

import { PATHS } from '../../../routes/paths';

import ButtonBase from '../../ButtonBase';
import { PrintIcon } from '../../icons';

const LineDividerStyled = styled.div`
  display: block;
  height: 16px;
  width: 1px;
  margin: 0 15px;
  background: #e8e5e5;
`;
const ButtonBaseStyled = styled(ButtonBase)`
  color: #797b7c;
  transition: color 0.175s;
  padding: 10px;
  font-size: 18px;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;
const showOnRoutes = [PATHS.APP.HOME, PATHS.APP.KPI, PATHS.APP.KPIS_COMPARE, PATHS.APP.PORTFOLIOS, PATHS.APP.PORTFOLIO];

const PrintButton = () => (
  <Route
    path={showOnRoutes}
    exact
    render={() => (
      <>
        <ButtonBaseStyled
          data-cy="printTopBarBtn"
          onClick={() => {
            window.print();
          }}
        >
          <PrintIcon />
        </ButtonBaseStyled>
        <LineDividerStyled />
      </>
    )}
  />
);

export default PrintButton;
