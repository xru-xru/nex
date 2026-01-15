import { NexoyaAttributionRule, NexoyaContentRule, NexoyaImpactGroupRule } from '../../types';
import { HoverableTooltip, HoverCard, HoverCardContent, HoverCardTrigger } from '../../components-ui/HoverCard';
import React from 'react';
import useFunnelStepsStore from '../../store/funnel-steps';
import { getHumanReadableFunnelStepMapping } from '../../routes/portfolio/components/Content/PortfolioRule/utils';
import useTranslationStore from '../../store/translations';
import { useMeasurementsQuery } from '../../graphql/measurement/queryMeasurements';
import { cn } from '../../lib/utils';
import usePortfolioMetaStore from '../../store/portfolio-meta';

interface Props {
  rule: NexoyaContentRule | NexoyaImpactGroupRule | NexoyaAttributionRule;
  tooltip: React.JSX.Element;
  contentProviderId?: number;
}
const PortfolioRuleHoverCard = ({ rule, tooltip, contentProviderId = null }: Props) => {
  const { funnelSteps } = useFunnelStepsStore();
  const { translations } = useTranslationStore();
  const {
    portfolioMeta: { impactGroups },
  } = usePortfolioMetaStore();

  const isContentRule = rule?.__typename === 'ContentRule';
  const isImpactGroupRule = rule?.__typename === 'ImpactGroupRule';
  const providerId = isContentRule ? (rule?.filters?.providerId ?? contentProviderId) : null;

  const { data: measurementsData } = useMeasurementsQuery({ providerId });

  const renderContentBasedOnRuleType = (rule: NexoyaContentRule | NexoyaImpactGroupRule | NexoyaAttributionRule) => {
    if (isContentRule) {
      return (
        <>
          <div className="text-mdlg text-neutral-800">{rule?.name}</div>
          <div className="mb-4 text-xs text-neutral-400">Assigned metrics</div>
          <div className="flex w-full flex-col gap-2">
            {funnelSteps?.map((funnelStep) => {
              // @ts-ignore
              const funnelStepMapping = rule?.funnelStepMappings?.find(
                (fsm) => fsm.funnelStepId === funnelStep.funnelStepId,
              );
              const { metric, mappingType } = getHumanReadableFunnelStepMapping({
                funnelStepMapping,
                measurements: measurementsData?.measurements,
                translations,
              });
              return (
                <div
                  className="flex flex-col items-start rounded-md border border-neutral-100 px-3 py-1.5"
                  key={funnelStep.funnelStepId}
                >
                  <div className="text-neutral-500">
                    <span className="font-medium capitalize">{funnelStep?.title}: </span>
                    <span className={cn('font-light', !metric ? 'text-neutral-200' : '')}>
                      {metric ? metric : 'No metric'}
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.32px] text-neutral-300">
                    Mapping type:{' '}
                    <span className={!mappingType ? 'text-neutral-200' : ''}>
                      {mappingType ? mappingType : 'No assignment'}
                    </span>
                  </span>
                </div>
              );
            })}
          </div>
        </>
      );
    }
    return (
      <>
        <div className="text-mdlg text-neutral-800">{rule?.name}</div>
        <div className="text-xs text-neutral-400">
          {isImpactGroupRule ? (
            <>
              {/*// @ts-ignore*/}
              Impact group: <span>{impactGroups?.find((ig) => ig.impactGroupId === rule?.impactGroupId)?.name}</span>
            </>
          ) : null}
        </div>
      </>
    );
  };

  return rule ? (
    <HoverCard>
      <HoverCardTrigger>
        <HoverableTooltip className="w-full break-words text-left align-middle leading-tight">
          {tooltip}
        </HoverableTooltip>
      </HoverCardTrigger>
      <HoverCardContent side="bottom" align="start" className="flex min-w-80 flex-col items-start justify-start">
        {renderContentBasedOnRuleType(rule)}
      </HoverCardContent>
    </HoverCard>
  ) : (
    <span className="w-fit">{tooltip}</span>
  );
};
export default PortfolioRuleHoverCard;
