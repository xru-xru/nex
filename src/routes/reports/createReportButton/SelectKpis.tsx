import { get } from 'lodash';
import styled from 'styled-components';

import { NexoyaMeasurement } from '../../../types/types';

import { KpisFilterProvider2 } from '../../../context/KpisFilterProvider';
import { useReportNew } from '../../../context/ReportNewProvider';

import { fullVisibleSelection } from '../../../utils/array';
import { equalKpis, getKpiKey } from '../../../utils/kpi';

import AvatarProvider from '../../../components/AvatarProvider';
import Checkbox from '../../../components/Checkbox';
import DialogContent from '../../../components/DialogContent';
import ErrorBoundary from '../../../components/ErrorBoundary';
import GridHeader from '../../../components/GridHeader';
import GridRow from '../../../components/GridRow';
import GridWrap from '../../../components/GridWrap';
import KpisFilters from '../../../components/KPIsFilterTable/KpisFilters';
import KpisTable from '../../../components/KPIsFilterTable/KpisTable';
import InputSearchFilter from '../../../components/KPIsFilterTable/components/InputSearchFilter';
import NameTranslation from '../../../components/NameTranslation/NameTranslation';
import { SumIcon } from '../../../components/icons';

const DialogContentStyled = styled(DialogContent)`
  .NEXYCard {
    box-shadow: none;
    padding: 0;
    min-width: 640px;
  }
`;

function SelectKpis() {
  const { kpis: kpiSelection } = useReportNew();
  return (
    <KpisFilterProvider2>
      <DialogContentStyled>
        <InputSearchFilter />
        <KpisFilters />
        <KpisTable>
          {({ kpis }) => {
            const areAllSelected = fullVisibleSelection<NexoyaMeasurement>(kpiSelection.selected, kpis, equalKpis);
            return (
              <ErrorBoundary>
                <GridWrap gridTemplateColumns="49px 80px minmax(180px, 1.5fr) minmax(100px, 1fr)">
                  <GridHeader>
                    <Checkbox
                      checked={areAllSelected}
                      onClick={() => {
                        if (areAllSelected) {
                          kpiSelection.remove(kpis.edges.map((kpi) => kpi.node));
                        } else {
                          kpiSelection.add(kpis.edges.map((kpi) => kpi.node));
                        }
                      }}
                    />
                    <span>Source</span>
                    <span>Name</span>
                    <span>Type</span>
                  </GridHeader>
                  {(get(kpis, 'edges') || []).map((kpi) => {
                    const isSelected = kpiSelection.selected.some((k) => equalKpis(k, kpi.node));
                    const parentCollection = get(kpi, 'node.collection.parent_collection', null);
                    return (
                      <GridRow
                        key={getKpiKey(kpi.node, 'row')}
                        isSelected={isSelected}
                        onClick={() => (isSelected ? kpiSelection.remove(kpi.node) : kpiSelection.add(kpi.node))}
                        style={{
                          cursor: 'pointer',
                        }}
                      >
                        <Checkbox
                          checked={isSelected}
                          onClick={() => {
                            if (isSelected) {
                              kpiSelection.remove(kpi.node);
                            } else {
                              kpiSelection.add(kpi.node);
                            }
                          }}
                        />
                        <AvatarProvider
                          providerId={kpi.node.provider_id || 0}
                          style={{
                            margin: '0 auto',
                          }}
                          size={20}
                        />
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            minWidth: 0,
                            paddingRight: 16,
                          }}
                        >
                          {parentCollection ? (
                            <NameTranslation
                              text={parentCollection.title}
                              style={{
                                marginRight: '5',
                                opacity: 0.5,
                              }}
                              display="inline"
                            />
                          ) : null}
                          <NameTranslation text={get(kpi, 'node.collection.title', '')} display="inline" />
                          {!parentCollection ? (
                            <SumIcon
                              style={{
                                fontSize: 12,
                                marginLeft: 7,
                              }}
                            />
                          ) : null}
                        </div>
                        <NameTranslation text={kpi.node.name || ''} variant="secondary" />
                      </GridRow>
                    );
                  })}
                </GridWrap>
              </ErrorBoundary>
            );
          }}
        </KpisTable>
      </DialogContentStyled>
    </KpisFilterProvider2>
  );
}

export default SelectKpis;
