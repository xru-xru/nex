import { gql, useMutation } from '@apollo/client';

import { NexoyaKpiInputOptMetric } from '../../types/types';

import { track } from '../../constants/datadog';
import { EVENT } from '../../constants/events';

const ADD_REPORT_KPIS_MUTATION = gql`
  mutation AddReportKpis($report_id: Int!, $kpis: [KpiInputOptMetric!]!) {
    addReportKpis(report_id: $report_id, kpis: $kpis)
  }
`;
type Options = {
  reportId: number;
  kpis?: NexoyaKpiInputOptMetric[];
};

function useAddReportKpisMutation({ reportId, kpis }: Options) {
  const [mutation, state] = useMutation(ADD_REPORT_KPIS_MUTATION, {
    variables: {
      report_id: reportId,
      kpis,
    },
    onCompleted: () => track(EVENT.REPORT_KPI_ADD),
  });
  return [mutation, state];
}

export { ADD_REPORT_KPIS_MUTATION, useAddReportKpisMutation };
