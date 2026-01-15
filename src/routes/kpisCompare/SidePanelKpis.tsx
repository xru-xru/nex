import { ReactElement } from 'react';

import styled from 'styled-components';

import { NexoyaMeasurement } from '../../types/types';
import { ThunkMutFn } from '../../types/types.custom';

import { KpisFilterProvider2 } from '../../context/KpisFilterProvider';

import { buildKpiKey } from '../../utils/buildReactKeys';

import Divider from '../../components/Divider';
import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary';
import KpisFilters from '../../components/KPIsFilterTable/KpisFilters';
import KpisHeader from '../../components/KPIsFilterTable/KpisHeader';
import KpisTable from '../../components/KPIsFilterTable/KpisTable';
import TableResultsMutation from '../../components/KPIsFilterTable/TableResultsMutation';
import KpiPill from '../../components/KpiPill';
import SidePanel, { SidePanelContent } from '../../components/SidePanel';

import { colorByKey } from '../../theme/utils';

type Props = {
  selectedKpis: NexoyaMeasurement[];
  onClose: () => void;
  open: boolean;
  onRemoveItem: ThunkMutFn<NexoyaMeasurement>;
  onAddItem: ThunkMutFn<NexoyaMeasurement>;
};
const KpisWrapStyled = styled.div`
  display: flex;
  flex-wrap: wrap;
  background-color: ${colorByKey('paleGrey50')};
  padding: 24px 24px 0 24px;
  margin-left: -24px;
  margin-right: -24px;
  margin-bottom: 32px;
  flex-shrink: 0;
`;
const PreselectedKpisOverflowWrapperStyled = styled.div`
  display: flex;
  overflow-x: auto;
  position: relative;
`;

const SidePanelKpis = ({ onClose, open, selectedKpis, onRemoveItem, onAddItem }: Props): ReactElement => {
  return (
    <SidePanel
      isOpen={open}
      onClose={onClose}
      paperProps={{
        style: {
          width: 'calc(100% - 218px)',
          paddingBottom: '24px',
        },
      }}
    >
      <SidePanelContent
        data-cy="dialogKpiContent"
        style={{
          flexDirection: 'column',
          padding: '24px',
        }}
      >
        <ErrorBoundary>
          <KpisFilterProvider2>
            <KpisWrapStyled data-cy="metricsSection">
              <PreselectedKpisOverflowWrapperStyled>
                {selectedKpis.map((m) => (
                  <KpiPill key={buildKpiKey(m, 'kpi-card')} kpi={m} handleRemove={onRemoveItem(m)} />
                ))}
              </PreselectedKpisOverflowWrapperStyled>
            </KpisWrapStyled>
            <Divider margin="0 0 25px" />
            <KpisHeader />
            <KpisFilters />
            <KpisTable>
              {({ loading, kpis }) =>
                !loading && (
                  <TableResultsMutation
                    selectedKpis={selectedKpis}
                    kpis={kpis}
                    onAddMutation={onAddItem}
                    onRemoveMutation={onRemoveItem}
                  />
                )
              }
            </KpisTable>
          </KpisFilterProvider2>
        </ErrorBoundary>
      </SidePanelContent>
    </SidePanel>
  );
};

export default SidePanelKpis;
