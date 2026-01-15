import { get } from 'lodash';
import styled from 'styled-components';

import { useReportNew } from '../../../context/ReportNewProvider';

import { getKpiKey } from '../../../utils/kpi';

import AvatarProvider from '../../../components/AvatarProvider';
import ErrorBoundary from '../../../components/ErrorBoundary';
import GridHeader from '../../../components/GridHeader';
import GridRow from '../../../components/GridRow';
import GridWrap from '../../../components/GridWrap';
import TypographyTranslation from '../../../components/TypographyTranslation';
import { SumIcon } from '../../../components/icons';

const WrapStyled = styled.div`
  .NEXYGridHeader {
    min-height: 64px;
  }
  .NEXYCSSGrid {
    min-width: 100%;
  }
`;

function KpiList() {
  const { kpis: kpiSelection } = useReportNew();
  return (
    <WrapStyled>
      <ErrorBoundary>
        <GridWrap gridTemplateColumns="80px minmax(300px, 1.5fr) minmax(200px, 0.75fr)">
          <GridHeader>
            <span>Source</span>
            <span>Name</span>
            <span>Type</span>
          </GridHeader>
          {kpiSelection.selected.map((kpi) => {
            const parentCollection = get(kpi, 'collection.parent_collection', null);
            return (
              <GridRow key={getKpiKey(kpi, 'row')}>
                <AvatarProvider
                  providerId={kpi.provider_id || 0}
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
                    <TypographyTranslation
                      text={parentCollection.title}
                      style={{
                        marginRight: 5,
                        opacity: 0.5,
                      }}
                      display="inline"
                    />
                  ) : null}
                  <TypographyTranslation text={get(kpi, 'collection.title', '')} display="inline" />
                  {!parentCollection ? (
                    <SumIcon
                      style={{
                        fontSize: 12,
                        marginLeft: 7,
                      }}
                    />
                  ) : null}
                </div>
                <TypographyTranslation text={kpi.name || ''} variant="secondary" />
              </GridRow>
            );
          })}
        </GridWrap>
      </ErrorBoundary>
    </WrapStyled>
  );
}

export default KpiList;
