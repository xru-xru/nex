import { gql, useMutation } from '@apollo/client';

import { NexoyaKpiInputOptMetric } from '../../types/types';

import { track } from '../../constants/datadog';
import { EVENT } from '../../constants/events';

const REMOVE_REPORT_KPIS_MUTATION = gql`
  mutation RemoveReportKpis($report_id: Int!, $kpis: [KpiInputOptMetric!]!) {
    removeReportKpis(report_id: $report_id, kpis: $kpis)
  }
`;
type Options = {
  reportId: number;
  kpis?: NexoyaKpiInputOptMetric[];
};

function useRemoveReportKpisMutation({ reportId, kpis }: Options): any {
  const [mutation, state] = useMutation(REMOVE_REPORT_KPIS_MUTATION, {
    variables: {
      report_id: reportId,
      kpis,
    },
    onCompleted: () => track(EVENT.REPORT_KPI_REMOVE),
  });
  return [mutation, state];
}

export { REMOVE_REPORT_KPIS_MUTATION, useRemoveReportKpisMutation };
