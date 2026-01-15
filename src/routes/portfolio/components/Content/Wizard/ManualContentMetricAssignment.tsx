import React, { useEffect, useState } from 'react';
import SidePanel from '../../../../../components/SidePanel';
import {
  NexoyaFunnelStepMappingType,
  NexoyaManualContentFunnelStepMappingInput,
  NexoyaPortfolioParentContent,
} from '../../../../../types';
import StepAssignMetrics from './StepAssignMetrics';
import { useTeam } from '../../../../../context/TeamProvider';
import { toast } from 'sonner';
import { useRouteMatch } from 'react-router';
import { useAssignFunnelStepMetricsToPortfolioContentsMutation } from '../../../../../graphql/content/mutationAssignFunnelStepMetricsToPortfolioContents';
import useFunnelStepsStore from '../../../../../store/funnel-steps';
import { usePortfolioDefaultFunnelStepMappingsQuery } from '../../../../../graphql/portfolioRules/queryPortfolioDefaultFunnelStepMappings';

interface Props {
  isOpen: boolean;
  closeSidePanel: () => void;
  contents: NexoyaPortfolioParentContent[];
  providerIds: number[];
}

export function ManualContentMetricAssignment({ isOpen, closeSidePanel, contents, providerIds }: Props) {
  const [hasSetMappings, setHasSetMappings] = useState(false);
  const [funnelStepMappings, setFunnelStepMappings] = useState<
    Array<NexoyaManualContentFunnelStepMappingInput & { type: NexoyaFunnelStepMappingType; disabled?: boolean }>
  >([]);

  const match = useRouteMatch();
  const portfolioId = parseInt(match.params.portfolioID, 10);

  const { teamId } = useTeam();
  const { funnelSteps } = useFunnelStepsStore();

  useEffect(() => {
    // Reset mapping state when dialog opens
    if (isOpen) {
      setHasSetMappings(false);

      // If any belong to contents have metrics assigned, we need make sure to disable those mappings
      const childContentsHaveMetricsAssigned = funnelSteps.reduce((result, funnelStep) => {
        const funnelStepId = funnelStep.funnelStepId;
        // Check if any content's child has a metric assigned for this funnel step
        const isDisabled = contents.some((content) =>
          content?.childContents?.some((childContent) =>
            childContent?.funnelSteps?.some(
              (fs) => fs.funnelStep?.funnelStepId === funnelStepId && fs.metric?.metricTypeId,
            ),
          ),
        );

        result[funnelStepId] = isDisabled;
        return result;
      }, {});

      const funnelStepIds = new Set(funnelSteps?.map((fs) => fs?.funnelStepId) || []);
      const consolidatedMappings = Array.from(funnelStepIds).map((funnelStepId) => {
        // Get mappings for this funnel step from all contents
        const mappings = contents
          .map((content) => {
            const funnelStep = (content.funnelSteps || []).find((fs) => fs.funnelStep?.funnelStepId === funnelStepId);

            if (!funnelStep) return null;

            return {
              metricId: funnelStep.metric?.metricTypeId ?? null,
              disabled: childContentsHaveMetricsAssigned[funnelStepId],
              type: funnelStep.metric?.metricTypeId
                ? NexoyaFunnelStepMappingType.Metric
                : NexoyaFunnelStepMappingType.Ignore,
            };
          })
          .filter(Boolean);

        // Check if all mappings have the same type and metric (if type is Metric)
        const allSameType = mappings.length > 0 && mappings.every((m) => m.type === mappings[0].type);
        const allSameMetricId = mappings.length > 0 && mappings.every((m) => m.metricId === mappings[0].metricId);

        if (allSameType && (mappings[0].type !== NexoyaFunnelStepMappingType.Metric || allSameMetricId)) {
          return {
            funnelStepId,
            metricId: mappings[0].metricId,
            type: mappings[0].type,
            disabled: mappings[0].disabled,
          };
        }

        // Mappings are inconsistent or not present
        return {
          funnelStepId,
          metricId: null,
          disabled: childContentsHaveMetricsAssigned[funnelStepId],
          type: null, // "incomplete" state
        };
      });

      setFunnelStepMappings(consolidatedMappings);
      setHasSetMappings(true);
    } else {
      // Reset state when closed
      setFunnelStepMappings([]);
      setHasSetMappings(false);
    }
  }, [isOpen]);

  usePortfolioDefaultFunnelStepMappingsQuery({
    portfolioId,
    providerId: providerIds[0],
    skip: providerIds.length > 1 || hasSetMappings || contents?.length > 0,
    onCompleted: (data) => {
      if (!data.listPortfolioDefaultFunnelStepMappings || hasSetMappings) return;

      const defaultMappings = data.listPortfolioDefaultFunnelStepMappings;
      setFunnelStepMappings(
        defaultMappings.map((mapping) => ({
          funnelStepId: mapping.funnelStepId,
          metricId: mapping.metricId,
          type: mapping.metricId ? NexoyaFunnelStepMappingType.Metric : NexoyaFunnelStepMappingType.Ignore,
        })),
      );
      setHasSetMappings(true);
    },
  });

  const [assignFunnelStepMetricsToContents] = useAssignFunnelStepMetricsToPortfolioContentsMutation({
    onCompleted: () => {
      toast.success('Metrics assigned successfully');
    },
  });

  const handleCloseSidePanel = () => {
    closeSidePanel();

    // Reset state
    setFunnelStepMappings([]);
  };

  const handleComplete = () => {
    assignFunnelStepMetricsToContents({
      variables: {
        teamId,
        portfolioId,
        contentIds: contents?.map((c) => c?.content?.contentId),
        funnelStepMappings: funnelStepMappings
          ?.filter((fsm) => !fsm.disabled)
          ?.map((fsm) => ({
            funnelStepId: fsm.funnelStepId,
            metricId: fsm.metricId,
          })),
      },
    }).then(() => {
      handleCloseSidePanel();
    });
  };

  return (
    <SidePanel
      isOpen={isOpen}
      onClose={handleCloseSidePanel}
      paperProps={{ style: { width: 'calc(100% - 218px)', paddingBottom: '78px' } }}
    >
      <div className="flex w-full justify-between border border-b-[#eaeaea]">
        <div className="px-6 py-5">
          <h3 className="text-xl font-medium text-neutral-900">Assign metrics to funnel steps</h3>
          <span className="text-md font-medium text-neutral-400">
            Assign metrics per funnel step to your selected manual contents.
          </span>
        </div>
      </div>

      <StepAssignMetrics
        providerIds={providerIds}
        funnelStepMappings={funnelStepMappings}
        setFunnelStepMappings={setFunnelStepMappings}
        onNextStep={handleComplete}
        onPreviousStep={() => handleCloseSidePanel()}
        showSkipButton={false}
      />
    </SidePanel>
  );
}
