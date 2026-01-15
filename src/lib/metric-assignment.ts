import { NexoyaMeasurement } from '../types';
import { AssignedMetric } from '../routes/portfolio/components/Content/PortfolioRule/ContentMetricAssignment';

export const getSelectedMeasurementForFunnelStepId = (
  funnelStepId: number,
  measurementsList: Partial<NexoyaMeasurement>[],
  assignedMetrics: AssignedMetric[],
) =>
  measurementsList?.find(
    (m) => m?.measurement_id === assignedMetrics.find((a) => a.funnelStepId === funnelStepId)?.metricId,
  );
