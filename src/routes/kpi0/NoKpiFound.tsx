import { RouterHistory } from 'react-router-dom';
import { withRouter } from 'react-router-dom';

import styled from 'styled-components';

import Button from '../../components/Button';
import Text from '../../components/Text';
import { NotFoundIcon } from '../../components/icons';

import { PATHS } from '../paths';

const WrapStyled = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  position: absolute;
  top: 37vh;
  left: 50%;
  transform: translate(-50%, -50%);

  svg {
    font-size: 65px;
    margin-bottom: 15px;
  }

  h3 {
    font-size: 18px;
    margin-bottom: 5px;
  }

  p {
    margin-bottom: 25px;
    max-width: 225px;
    text-align: center;
  }
`;
type Props = {
  history: RouterHistory;
};

const NoKpiFound = ({ history }: Props) => (
  <WrapStyled>
    <NotFoundIcon />
    <Text component="h3">Ooops.</Text>
    <Text component="p" withEllipsis={false}>
      We really tried, but we could not find such KPI in our system.
    </Text>
    <Button
      variant="contained"
      onClick={() => {
        history.push(PATHS.APP.KPIS);
      }}
    >
      Go back to KPIs
    </Button>
  </WrapStyled>
);

export default withRouter(NoKpiFound);
