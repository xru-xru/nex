import React from 'react';

import { get } from 'lodash';
import styled from 'styled-components';
import { ArrayParam, useQueryParams } from 'use-query-params';

import { NexoyaCustomKpiConfigType, NexoyaMeasurementConnection, NexoyaMeasurementEdges } from '../../types/types';
import '../../types/types';

import { useKpisSelection } from '../../context/KpisSelectionProvider';
import useAllCheckboxController from '../../hooks/useAllCheckboxController';

import { buildKpiKey } from '../../utils/buildReactKeys';
import isCurrencyDatatype from '../../utils/isCurrencyDatatype';
import { decodeKpisQuery, equalKpis, equalKpisInput, kpiInput } from '../../utils/kpi';

import AvatarProvider from '../../components/AvatarProvider';
import Checkbox from '../../components/Checkbox';
import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary';
import FavoriteKPI from '../../components/FavoriteKPI';
import FormattedCurrency from '../../components/FormattedCurrency';
import GridHeader from '../../components/GridHeader';
import GridNameLink from '../../components/GridNameLink';
import GridRow from '../../components/GridRow';
import GridWrap from '../../components/GridWrap';
import KPIsCompareSidePanel from '../../components/KPIsCompareSidePanel';
import NumberValue from '../../components/NumberValue';
import Text from '../../components/Text';
import TypographyTranslation from '../../components/TypographyTranslation';
import { SumIcon } from '../../components/icons';
import KpiTableTDM from './components/KpiTableTDM';
import TableResultsActionHeader from './components/TableResultsActionHeader';

import { buildContentPath, buildKpiPath } from '../paths';
import SvgKpi from '../../components/icons/Kpi';
import { nexyColors } from '../../theme';
import Typography from '../../components/Typography';

type Props = {
  kpis: NexoyaMeasurementConnection;
  edges: NexoyaMeasurementEdges[];
  enableHeaderActions?: boolean;
};
// TODO: this is a copy of all the other grid like lists. Needs to be extracted
const GridWrapStyled = styled(GridWrap)`
  padding-bottom: 0;

  .NEXYGridHeader {
    min-height: 48px;
  }
  .NEXYCSSGrid {
    min-width: 100%;
    grid-template-columns:
      49px 80px minmax(100px, 1.5fr) minmax(100px, 1fr) minmax(75px, 0.5fr)
      100px;
  }
  .valueColumnTitle {
    text-align: right;
  }
`;

const NumberWrapperStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const ValueStyled = styled.div`
  font-size: 16px;
  line-height: 24px;
`;
const ChangeStyled = styled.div`
  font-size: 13px;
  line-height: 18px;
`;

const TableResults = ({ kpis, edges, enableHeaderActions }: Props) => {
  const { add, remove, reset, selected } = useKpisSelection();
  const allCheckbox = useAllCheckboxController({
    selected,
    connection: kpis,
    filter: equalKpis,
    add,
    reset,
  });
  // preselect kpis which are in the url
  const [queryParams] = useQueryParams({
    kpi: ArrayParam,
  });
  React.useEffect(() => {
    if (queryParams.kpi) {
      const decodedKpis = decodeKpisQuery(queryParams.kpi);
      const preselectedKpis = edges.filter((edge) =>
        decodedKpis.some((decodedKpi) => equalKpisInput(decodedKpi, kpiInput(edge.node))),
      );
      add(preselectedKpis.map((kpi) => kpi.node));
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <ErrorBoundary>
      <GridWrapStyled>
        {selected.length > 0 ? (
          <TableResultsActionHeader
            allCheckbox={allCheckbox}
            selected={selected}
            enableHeaderActions={enableHeaderActions}
          />
        ) : (
          <GridHeader>
            <Checkbox
              onClick={allCheckbox.onClick}
              checked={allCheckbox.checked}
              indeterminate={allCheckbox.indeterminate}
              disabled={allCheckbox.disabled}
            />
            <Text>Source</Text>
            <Text>Name</Text>
            <Text>Type</Text>
            <Text className="valueColumnTitle">Value</Text>
          </GridHeader>
        )}
        {edges.length === 0
          ? null
          : edges.map((kpi) => {
              const isSelected = selected.some((k) => equalKpis(k, kpi.node));
              const parentCollection = get(kpi, 'node.collection.parent_collection', null);
              const collectionId = get(kpi, 'node.collection.collection_id', '');
              const isSystemGeneratedCustomKpi =
                kpi.node?.customKpiConfig?.configType === NexoyaCustomKpiConfigType.Placeholder;
              return (
                <GridRow key={buildKpiKey(kpi.node, 'row')}>
                  <Checkbox
                    name="checkKpi"
                    checked={isSelected}
                    onChange={(_: any, beingChecked: any) => {
                      if (beingChecked) {
                        add(kpi.node);
                      } else {
                        remove(kpi.node);
                      }
                    }}
                  />
                  {isSystemGeneratedCustomKpi ? (
                    <SvgKpi
                      color={nexyColors.lilac}
                      style={{
                        height: 20,
                        width: 20,
                        margin: 'auto',
                      }}
                    />
                  ) : (
                    <AvatarProvider
                      providerId={kpi.node.provider_id}
                      size={20}
                      style={{
                        margin: 'auto',
                      }}
                    />
                  )}
                  <GridNameLink
                    to={buildContentPath(kpi.node?.collection?.collection_id)}
                    style={{
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
                        withTooltip
                      />
                    ) : null}
                    <TypographyTranslation text={get(kpi, 'node.collection.title', '')} display="inline" withTooltip />
                    {!parentCollection ? (
                      <SumIcon
                        style={{
                          fontSize: 12,
                          marginLeft: 7,
                        }}
                      />
                    ) : null}
                    <FavoriteKPI kpi={kpi.node} showMode={true} />
                  </GridNameLink>
                  <GridNameLink
                    to={buildKpiPath(kpi.node, {
                      measurement: null,
                      source: null,
                      searchPg: null,
                      search: null,
                      extendSearch: null,
                    })}
                  >
                    {isSystemGeneratedCustomKpi ? (
                      <Typography>{kpi.node.name}</Typography>
                    ) : (
                      <TypographyTranslation text={kpi.node.name} withTooltip />
                    )}
                  </GridNameLink>
                  <NumberWrapperStyled>
                    <ValueStyled>
                      {isCurrencyDatatype(kpi.node.datatype) ? (
                        <FormattedCurrency amount={get(kpi, 'node.detail.value', 0)} />
                      ) : (
                        <NumberValue value={get(kpi, 'node.detail.value', 0)} datatype={kpi.node.datatype} />
                      )}
                    </ValueStyled>
                    <ChangeStyled>
                      <NumberValue value={get(kpi, 'node.detail.valueChangePercentage', 0)} textWithColor symbol="%" />
                    </ChangeStyled>
                  </NumberWrapperStyled>
                  <KpiTableTDM collectionId={collectionId} />
                </GridRow>
              );
            })}
      </GridWrapStyled>
      <KPIsCompareSidePanel />
    </ErrorBoundary>
  );
};

export default TableResults;
