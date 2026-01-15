import { get } from 'lodash';
import styled from 'styled-components';

import { useGlobalDate } from '../context/DateProvider';
import { useDashboardKpisQuery } from '../graphql/kpi/queryDashboardKpis';
import { useTeamQuery } from '../graphql/team/queryTeam';

import { buildKpiKey } from '../utils/buildReactKeys';

import ErrorBoundary from '../components/ErrorBoundary';
import ErrorMessage from '../components/ErrorMessage';
import LoadingPlaceholder from '../components/LoadingPlaceholder';
import Logo from 'components/icons/NewLogo';

import theme from '../theme/theme';

import KpiCard from './cockpit/KpiCard';

const HeaderStyled = styled.header`
  position: fixed;
  min-width: 0;
  z-index: ${theme.layers.close};
  width: 100%;
  height: 62px;
  padding: 5px 25px;
  display: flex;
  align-items: center;
  box-shadow: 0 1px 11px 0 rgba(0, 0, 0, 0.03);
  background: white;
  /* justify-content: space-between; */

  .nexy-logo {
    margin-left: auto;
    img {
      width: 150px;
    }
  }

  .team-logo img {
    width: 40px;
    height: auto;
    display: block;
  }
`;
const MainStyled = styled.main`
  padding: 87px 25px 25px;
`;
const LoadingStyled = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  & > div {
    height: 120px;
    width: 100%;
    margin-bottom: 3%;

    &:nth-child(3),
    &:nth-child(4) {
      opacity: 0.65;
    }
    &:nth-child(5),
    &:nth-child(6) {
      opacity: 0.3;
    }
  }
`;
const KpisWrapStyled = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  & > div {
    width: 100%;
    margin-bottom: 3%;
    /* flex-basis: 48%;
    max-width: 48%;
    margin-bottom: 3%; */
  }
`;

function Cockpit() {
  const teamQuery = useTeamQuery();
  const { dateFrom, dateTo } = useGlobalDate();
  const kpisQuery = useDashboardKpisQuery({
    dateFrom: dateFrom(),
    dateTo: dateTo(),
  });
  const loading = teamQuery.loading || kpisQuery.loading;
  const error = teamQuery.error || kpisQuery.error;
  const kpis = get(kpisQuery, 'data.team.kpis', []);
  return (
    <ErrorBoundary>
      <div
        style={{
          background: '#F0F6F7',
          minHeight: '100vh',
          position: 'relative',
        }}
      >
        <HeaderStyled>
          {loading || error ? null : (
            <div className="team-logo">
              <Logo />
            </div>
          )}
          <div className="nexy-logo">
            <Logo />
          </div>
        </HeaderStyled>
        <MainStyled>
          {loading ? (
            <LoadingStyled>
              <LoadingPlaceholder />
              <LoadingPlaceholder />
              <LoadingPlaceholder />
              <LoadingPlaceholder />
              <LoadingPlaceholder />
              <LoadingPlaceholder />
            </LoadingStyled>
          ) : error ? (
            <ErrorMessage error={error} />
          ) : (
            <KpisWrapStyled>
              {kpis.map((k) => (
                <KpiCard kpi={k} key={buildKpiKey(k)} />
              ))}
            </KpisWrapStyled>
          )}
        </MainStyled>
      </div>
    </ErrorBoundary>
  );
}

export default Cockpit;
