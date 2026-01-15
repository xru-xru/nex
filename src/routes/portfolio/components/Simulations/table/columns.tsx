import { NexoyaScenarioFunnelStep } from '../../../../../types';

import { sortTypes } from '../../../../../components/Table/sortTypes';

import { BigHeaderCell } from '../../../styles/OptimizationProposal';

import { ACTIONS_HEADER_ID, getHeader } from '../../OptimizationProposal/columns';
import { withSortSkipped } from '../../OptimizationProposal/withSortSkipped';

export const getColumns = ({ tableMetricsSwitch, funnelSteps }) =>
  [
    {
      Header: '',
      accessor: ACTIONS_HEADER_ID,
      disableSortBy: true,
      disableHiding: true,
      className: 'border-right',
      tableManagerHeader: <BigHeaderCell>Scenario</BigHeaderCell>,
      columns: [
        {
          Header: '',
          accessor: 'actionsRow',
          id: 'actionsRow',
          width: '52',
          isHiddenInManager: true,
          disableSortBy: true,
          disableHiding: true,
        },
        {
          Header: 'Scenario',
          accessor: 'name',
          id: 'scenario',
          className: 'border-right',
          sortType: withSortSkipped(sortTypes.jsxKey),
          enableColumnResize: true,
          disableHiding: true,
        },
        {
          Header: 'Reliability',
          accessor: 'reliability',
          id: 'reliability',
          className: 'border-right',
          sortType: withSortSkipped(sortTypes.jsxKey),
          enableColumnResize: true,
        },
      ],
    },
    {
      accessor: 'budgetTotal',
      disableSortBy: true,
      Header: <BigHeaderCell>Budget</BigHeaderCell>,
      tableManagerHeader: <BigHeaderCell>Budget</BigHeaderCell>,
      className: 'border-right',
      columns: [
        {
          Header: 'Value',
          accessor: 'currentScenarioTotal',
          id: 'currentScenarioTotal',
          sortType: withSortSkipped(sortTypes.jsxKey),
          enableColumnResize: true,
        },
        {
          Header: '%diff. from base',
          accessor: 'changePercentTotal',
          id: 'changePercentTotal',
          sortType: withSortSkipped(sortTypes.jsxKey),
          enableColumnResize: true,
          className: 'border-right',
        },
      ],
    },
    ...getFunnelStepColumns({
      scenarioFunnelSteps: funnelSteps,
      tableMetricsSwitch,
    }),
  ].filter(Boolean);

export const getFunnelStepColumns = ({
  scenarioFunnelSteps,
  tableMetricsSwitch,
}: {
  scenarioFunnelSteps: NexoyaScenarioFunnelStep[];
  tableMetricsSwitch: string;
}) => {
  return scenarioFunnelSteps.map((scenarioFunnelStep) => {
    const header: string = getHeader(scenarioFunnelStep.funnelStep);

    const isCostPerView = tableMetricsSwitch === 'cost-per';

    const columns =
      tableMetricsSwitch === 'cost-per'
        ? createColumnStructure(scenarioFunnelStep?.funnelStep?.funnelStepId, 'funnelStepCostPer', isCostPerView)
        : createColumnStructure(scenarioFunnelStep?.funnelStep?.funnelStepId, 'funnelStepValue', isCostPerView);

    return {
      id: `header-${scenarioFunnelStep?.funnelStep?.funnelStepId}`,
      title: scenarioFunnelStep?.funnelStep?.title,
      disableSticky: true,
      className: 'border-right',

      Header: (
        <BigHeaderCell style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {tableMetricsSwitch === 'cost-per' ? header : scenarioFunnelStep?.funnelStep?.title}
        </BigHeaderCell>
      ),
      disableSortBy: true,
      columns: columns,
    };
  });
};

export const createColumnStructure = (funnelStepId: number, accessorPrefix: string, isCostPerView: boolean) => {
  return [
    {
      Header: isCostPerView ? 'Cost-per' : 'Value',
      accessor: `${accessorPrefix}_${funnelStepId}`,
      sortType: withSortSkipped(sortTypes.jsxKeyAsNumber),
    },
    {
      Header: '% diff. from base',
      className: 'border-right',
      accessor: `${accessorPrefix}_${funnelStepId}_change`,
      sortType: withSortSkipped(sortTypes.jsxKeyAsNumber),
    },
  ];
};
