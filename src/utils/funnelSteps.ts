import { NexoyaFunnelStepType, NexoyaFunnelStepV2 } from '../types';
import { isEqual } from 'lodash';

export const extractFunnelSteps = (
  funnelSteps: NexoyaFunnelStepV2[],
): { costFunnelStep: NexoyaFunnelStepV2; otherFunnelSteps: NexoyaFunnelStepV2[] } => {
  if (!funnelSteps?.length) {
    return { costFunnelStep: null, otherFunnelSteps: [] };
  }

  const costFunnelStep = funnelSteps?.find((funnelStep) => funnelStep.type === NexoyaFunnelStepType.Cost);
  const otherFunnelSteps = funnelSteps?.filter((fs) => fs.funnelStepId !== costFunnelStep.funnelStepId);

  return { costFunnelStep, otherFunnelSteps };
};

export const areFunnelStepsEqual = (steps1: NexoyaFunnelStepV2[], steps2: NexoyaFunnelStepV2[]) => {
  const normalizeSteps = (steps: NexoyaFunnelStepV2[]) =>
    // Select only relevant fields
    steps.map(({ title, type, isAttributed }) => ({ title, type, isAttributed }));

  return isEqual(normalizeSteps(steps1), normalizeSteps(steps2));
};
