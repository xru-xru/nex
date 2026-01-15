import 'react-router-dom';

import { get } from 'lodash';

import { withDateProvider } from '../context/DateProvider';
import { KpisFilterProvider2 } from '../context/KpisFilterProvider';
import { useAddDashboardKpi } from '../graphql/kpi/mutationAddDashboardKpi';
import { useRemoveDashboardKpi } from '../graphql/kpi/mutationRemoveDashboardKpi';
import { useDashboardKpisQuery } from '../graphql/kpi/queryDashboardKpis';

import { mergeQueryState } from '../utils/graphql';

import Divider from '../components/Divider';
import ErrorBoundary from '../components/ErrorBoundary/ErrorBoundary';
import ErrorMessage from '../components/ErrorMessage';
import KpisFilters from '../components/KPIsFilterTable/KpisFilters';
import KpisHeader from '../components/KPIsFilterTable/KpisHeader';
import KpisTable from '../components/KPIsFilterTable/KpisTable';
import TableResultsMutation from '../components/KPIsFilterTable/TableResultsMutation';
import KPIsSelectedSlider from '../components/KPIsSelectedSlider';
import MainContent from '../components/MainContent';
import ScrollToTop from 'components/ScrollToTop';

const DashboardSelection = () => {
  const { data, loading, ...dashboardKpisRest } = useDashboardKpisQuery({});
  const [, removeState, removeDashboardKpiRemote] = useRemoveDashboardKpi();
  const [, addState, addDashboardKpiRemote] = useAddDashboardKpi();
  const dashboardKpis = get(data, 'team.kpis', []);
  const { error } = mergeQueryState(removeState, addState, dashboardKpisRest);
  return (
    <ScrollToTop>
      <MainContent padding="15px 35px 25px">
        <ErrorBoundary>
          <KpisFilterProvider2>
            <KPIsSelectedSlider
              selectedKpis={dashboardKpis}
              loading={loading}
              removeMutation={removeDashboardKpiRemote}
            />
            <Divider margin="0 0 25px" />
            <KpisHeader />
            <KpisFilters />
            <KpisTable>
              {({ kpis }) => (
                <TableResultsMutation
                  selectedKpis={dashboardKpis}
                  kpis={kpis}
                  onAddMutation={addDashboardKpiRemote}
                  onRemoveMutation={removeDashboardKpiRemote}
                />
              )}
            </KpisTable>
          </KpisFilterProvider2>
        </ErrorBoundary>
      </MainContent>
      {error ? <ErrorMessage error={error} /> : null}
    </ScrollToTop>
  );
};

export default withDateProvider(DashboardSelection);
