import { get } from 'lodash';
import styled from 'styled-components';

import { useNewCustomKpi } from '../../context/NewCustomKpiProvider';

import { buildKpiKey } from '../../utils/buildReactKeys';
import { allSelected, equalCustomKpis, equalKpis } from '../../utils/kpi';

import InputSearchFilter from '../KPIsFilterTable/components/InputSearchFilter';
import TypographyTranslation from 'components/TypographyTranslation';

import { colorByKey } from 'theme/utils';

import AvatarProvider from '../AvatarProvider';
import Checkbox from '../Checkbox';
import DialogContent from '../DialogContent';
import ErrorBoundary from '../ErrorBoundary';
import GridHeader from '../GridHeader/GridHeader';
import GridRow from '../GridRow';
import GridWrap from '../GridWrap';
import KpisFilters from '../KPIsFilterTable/KpisFilters';
import KpisTable from '../KPIsFilterTable/KpisTable';

const DialogContentStyled = styled(DialogContent)`
  min-width: 900px;
  max-width: 900px;
  max-height: 727px !important;
`;
type Props = {
  isCustomKpi?: boolean;
};

const LinkWrapper = styled.div`
  display: flex;
  align-items: center;
  min-width: 0;
  padding-right: 16px;
  margin-right: 16px;
  a {
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: ${colorByKey('darkGrey')};
    font-weight: 400;
  }
  svg {
    display: inline !important;
  }
`;
function KpisSelection({ isCustomKpi }: Props) {
  const { kpis: selectedKpis, addKpi, removeKpi, includeSearch } = useNewCustomKpi();
  return (
    <>
      <DialogContentStyled>
        <p
          style={{
            marginBottom: 25,
          }}
        >
          Please select the metrics you would like to combine together.
        </p>
        <InputSearchFilter includeSearch={includeSearch} />
        <KpisFilters />
        <KpisTable noCard>
          {({ kpis }) => {
            const areAllSelected = allSelected(selectedKpis, kpis);
            return (
              <ErrorBoundary>
                <GridWrap gridTemplateColumns="49px 80px minmax(150px, 1.5fr) minmax(100px, 1fr)">
                  <GridHeader>
                    <Checkbox
                      checked={areAllSelected || includeSearch}
                      disabled={includeSearch}
                      onClick={() => {
                        if (areAllSelected) {
                          removeKpi(kpis.edges.map((kpi) => kpi.node));
                        } else {
                          addKpi(kpis.edges.map((kpi) => kpi.node));
                        }
                      }}
                    />
                    <span>Source</span>
                    <span>Name</span>
                    <span>Type</span>
                  </GridHeader>
                  {/*// @ts-ignore */}
                  {get(kpis, 'edges', []).map((kpi) => {
                    const isSelected = selectedKpis.some((k) =>
                      isCustomKpi ? equalCustomKpis(k, kpi.node) : equalKpis(k, kpi.node),
                    );
                    const parentCollection = get(kpi, 'node.collection.parent_collection', null);
                    const handleMetricClick = (node) => {
                      if (!includeSearch) {
                        !isSelected ? addKpi(node) : removeKpi(node);
                      }
                    };
                    return (
                      <GridRow key={buildKpiKey(kpi.node, 'row')} isSelected={isSelected}>
                        <Checkbox
                          checked={isSelected || includeSearch}
                          onClick={() => {
                            handleMetricClick(kpi.node);
                          }}
                          disabled={includeSearch}
                        />
                        <AvatarProvider providerId={kpi.node.provider_id} align="center" size={20} />
                        <LinkWrapper data-cy="metricsDiv">
                          {parentCollection ? (
                            <TypographyTranslation
                              text={parentCollection.title}
                              component="p"
                              style={{
                                color: colorByKey('cloudyBlue'),
                                fontWeight: 400,
                                marginRight: 5,
                                opacity: 0.5,
                              }}
                              display="inline"
                              withTooltip
                              onClick={() => {
                                handleMetricClick(kpi.node);
                              }}
                            />
                          ) : null}
                          <TypographyTranslation
                            text={get(kpi, 'node.collection.title', '')}
                            component="p"
                            display="inline"
                            data-cy={get(kpi, 'node.collection.title', '')}
                            withTooltip
                            onClick={() => {
                              handleMetricClick(kpi.node);
                            }}
                          />
                        </LinkWrapper>
                        <TypographyTranslation
                          text={kpi.node.name}
                          component="p"
                          withTooltip
                          onClick={() => {
                            handleMetricClick(kpi.node);
                          }}
                        />
                      </GridRow>
                    );
                  })}
                </GridWrap>
              </ErrorBoundary>
            );
          }}
        </KpisTable>
      </DialogContentStyled>
    </>
  );
}

export default KpisSelection;
