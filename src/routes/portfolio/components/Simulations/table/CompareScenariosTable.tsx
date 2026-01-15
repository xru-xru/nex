import React from 'react';

import { NumericArrayParam, StringParam, useQueryParam, useQueryParams } from 'use-query-params';

import { ExtendedNexoyaSimulationScenario } from '../../../../../types';

import { TableManagerWithRows } from '../../../../../components/Table/TableManagerWithRows';
import { ExtendedTable } from '../../../../../components/Table/ExtendedTable';
import { TableStyled } from 'routes/portfolio/styles/OptimizationProposal';

import { getColumns } from './columns';
import { getData } from './data-table';

export const CompareScenariosTable = ({
  scenarios,
  simulationId,
  portfolioId,
}: {
  simulationId: number;
  portfolioId: number;
  scenarios: ExtendedNexoyaSimulationScenario[];
}) => {
  const [comparisonIds] = useQueryParam('comparisonIds', NumericArrayParam);
  const [queryParams] = useQueryParams({
    tableViewSwitch: StringParam,
    tableMetricsSwitch: StringParam,
  });

  // We add the idx so that we don't show the scenario id, also to avoid bugs with the TableManager (when hiding)
  const data = getData({
    scenarios,
    comparisonIds,
    simulationId,
    portfolioId,
  });

  return (
    <TableStyled style={{ borderTop: '1px solid rgb(234, 234, 234)' }}>
      <ExtendedTable
        data={data}
        columns={getColumns({
          tableMetricsSwitch: queryParams.tableMetricsSwitch,
          funnelSteps: scenarios[0].funnelSteps,
        })}
        tableId="scenario_comparison_table"
        renderTableManager={({
          columns,
          getToggleHideAllColumnsProps,
          toggleHideAllColumns,
          setStickyColumns,
          stickyColumns,
        }) => (
          <TableManagerWithRows
            rows={scenarios}
            columns={columns}
            getToggleHideAllColumnsProps={getToggleHideAllColumnsProps}
            toggleHideAllColumns={toggleHideAllColumns}
            setStickyColumns={setStickyColumns}
            stickyColumns={stickyColumns}
            depth={1}
          />
        )}
      />
    </TableStyled>
  );
};
