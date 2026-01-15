import { get } from 'lodash';
import {
  NexoyaDiscoveredContentStatus,
  NexoyaFunnelStepV2,
  NexoyaPortfolioContentFunnelStep,
  NexoyaPortfolioContentMetric,
  NexoyaPortfolioParentContent,
  NexoyaProviderMetricOptions,
} from '../../../../../types';
import ContentTableRowTDM from '../ContentTableRowTDM';
import * as Styles from '../../../styles/ContentTableRow';
import { buildContentPath, buildKpiPath } from '../../../../paths';
import ButtonIcon from '../../../../../components/ButtonIcon';
import { toast } from 'sonner';
import SvgCopyToClipboard from '../../../../../components/icons/CopyToClipboard';
import { TagStyled } from '../../../styles/OptimizationProposal';
import { nexyColors } from '../../../../../theme';
import { ContentImpactGroupPanel } from '../ContentImpactGroupsPanel';
import FormattedCurrency from '../../../../../components/FormattedCurrency';
import Typography from '../../../../../components/Typography';
import ContentMetricPanel from '../PortfolioRule/assignment/ContentMetricPanel';
import React from 'react';
import { Link } from 'react-router-dom';
import { encodeDateQuery } from '../../../../../utils/dates';
import dayjs from 'dayjs';
import SvgUnlink from '../../../../../components/icons/Unlink';
import { ContentLabelPanel } from '../ContentLabelPanel';
import ChildTDM from '../../ChildTDM';
import PortfolioRuleHoverCard from '../../../../../components/HoverCard';
import Checkbox from '../../../../../components/Checkbox';
import SvgKpi from '../../../../../components/icons/Kpi';
import Tooltip from '../../../../../components/Tooltip';
import { SYSTEM_GENERATED_COLLECTION_TYPE_ID } from '../../../../../constants/collection';

const getKpiLink = ({ metricTypeId, contentId, start, end }) =>
  buildKpiPath(
    {
      measurement_id: metricTypeId,
      collection_id: contentId,
    },
    {
      // if start/end date are later than today, "crop" them to today
      dateFrom: encodeDateQuery(dayjs().isAfter(start) ? start : dayjs()),
      dateTo: encodeDateQuery(dayjs().isAfter(end) ? end : dayjs()),
    },
  );

export const getData = ({
  funnelSteps,
  portfolioContents,
  handleCheckboxAction,
  isContentSelected,
  metricOptionsLoading,
  portfolioInfo,
  providerMetricOptions = [],
  isAdvancedView,
  teamId,
}: {
  funnelSteps: NexoyaFunnelStepV2[];
  portfolioContents: NexoyaPortfolioParentContent[];
  handleCheckboxAction: (contentId: number, shiftKey: boolean) => void;
  isContentSelected: (contentId: number) => boolean;
  providerMetricOptions?: NexoyaProviderMetricOptions[];
  metricOptionsLoading?: boolean;
  isAdvancedView?: boolean;
  teamId: number;
  portfolioInfo: {
    start: string;
    end: string;
    portfolioId: number;
  };
}) => {
  return portfolioContents?.map((pc: NexoyaPortfolioParentContent) => {
    const providerId = pc?.content?.provider?.provider_id;
    const appliedContentRule = pc?.discoveredContent?.contentRules?.find((cr) => cr.isApplied);
    const appliedImpactGroupRule = pc?.discoveredContent?.impactGroupRules?.find((igr) => igr.isApplied);
    const appliedAttributionRule = pc?.discoveredContent?.attributionRules?.find((ar) => ar.isApplied);

    const row = {
      hasChildren: pc.childContents?.length > 0,
      highlight: !pc.isIncludedInOptimization || isContentSelected(pc?.content?.contentId),
      editRow: (
        <ContentTableRowTDM
          parentContent={pc}
          portfolioId={portfolioInfo?.portfolioId}
          disabled={isContentSelected(pc?.content?.contentId)}
        />
      ),
      selectContent: (
        <Checkbox
          className="!pl-0 !pr-0.5"
          onClick={(e) => {
            // Prevent default to stop text selection when shift-clicking
            e.preventDefault();
            handleCheckboxAction(pc?.content?.contentId, e.shiftKey);
          }}
          checked={isContentSelected(pc?.content?.contentId)}
        />
      ),
      contentId: pc?.content?.contentId,
      content: (
        <Styles.StyledLink
          className="w-fit"
          key={pc?.content?.title}
          to={buildContentPath(
            pc.content?.contentId,
            {
              dateFrom: portfolioInfo?.start?.substring(0, 10),
              dateTo: portfolioInfo?.end?.substring(0, 10),
              team_id: teamId,
            },
            true,
          )}
        >
          <Styles.AvatarWrapStyled providerId={providerId} size={24} condensed={true} style={{ marginRight: 12 }} />

          <Typography style={{ color: '#000' }}>{pc?.content?.title}</Typography>
          <ButtonIcon
            onClick={(e) => {
              e.preventDefault();
              navigator.clipboard
                .writeText(pc?.content?.title)
                .then(() => toast.message('Content copied to clipboard'));
            }}
            className="copyContentButton"
            title="Copy content name"
          >
            <SvgCopyToClipboard />
          </ButtonIcon>
        </Styles.StyledLink>
      ),
      contentLevel: (
        <div key={pc.content?.contentType?.name} className="flex h-full w-full items-center justify-center">
          <TagStyled bgColor="#eaeaea">{pc.content?.contentType?.name}</TagStyled>
        </div>
      ),
      contentMode: (
        <div key={pc.discoveredContent?.status} className="flex h-full w-full items-center justify-center">
          <TagStyled bgColor="#DCD5FB">
            {pc.discoveredContent?.status === NexoyaDiscoveredContentStatus.Manual ? 'Manual' : 'Rule-Based'}
          </TagStyled>
        </div>
      ),
      optimization: (
        <div key={pc.isIncludedInOptimization?.toString()} className="flex h-full w-full items-center justify-center">
          <TagStyled style={{ maxWidth: 70 }} bgColor={pc.isIncludedInOptimization ? '#88E7B7' : nexyColors.frenchGray}>
            {pc.isIncludedInOptimization ? 'Enabled' : 'Disabled'}
          </TagStyled>
        </div>
      ),
      label: (
        <Styles.RowCell key={pc?.label?.name} className="text-left">
          <ContentLabelPanel parentContent={pc} portfolioId={portfolioInfo?.portfolioId} />
        </Styles.RowCell>
      ),
      impactGroup: (
        <Styles.RowCell key={pc?.impactGroup?.impactGroupId}>
          <ContentImpactGroupPanel parentContent={pc} portfolioId={portfolioInfo?.portfolioId} />
        </Styles.RowCell>
      ),
      contentRule: (
        <Styles.RowCell
          key={`${pc.portfolioContentId}-${appliedContentRule?.contentRule?.contentRuleId ?? 'no-content-rule'}`}
        >
          {pc.discoveredContent.status === NexoyaDiscoveredContentStatus.Manual ? (
            <span className="font-normal text-neutral-200">Not applicable</span>
          ) : appliedContentRule ? (
            <PortfolioRuleHoverCard
              key={appliedContentRule.contentRule.contentRuleId}
              rule={appliedContentRule.contentRule}
              contentProviderId={providerId}
              tooltip={<span>{appliedContentRule.contentRule.name}</span>}
            />
          ) : (
            <span className="font-normal text-neutral-200">No content rules applied</span>
          )}
        </Styles.RowCell>
      ),
      impactGroupRule: (
        <Styles.RowCell
          key={`${pc.portfolioContentId}-${
            appliedImpactGroupRule?.impactGroupRule?.impactGroupRuleId ?? 'no-impact-group-rule'
          }`}
        >
          {pc?.discoveredContent?.status === NexoyaDiscoveredContentStatus.Manual ? (
            <span className="font-normal text-neutral-200">Not applicable</span>
          ) : appliedImpactGroupRule ? (
            <PortfolioRuleHoverCard
              key={appliedImpactGroupRule.impactGroupRule.impactGroupRuleId}
              rule={appliedImpactGroupRule.impactGroupRule}
              contentProviderId={providerId}
              tooltip={<span>{appliedImpactGroupRule.impactGroupRule.name}</span>}
            />
          ) : (
            <span className="font-normal text-neutral-200">No impact group rules applied</span>
          )}
        </Styles.RowCell>
      ),
      attributionRule: (
        <Styles.RowCell
          key={`${pc.portfolioContentId}-${
            appliedAttributionRule?.attributionRule?.attributionRuleId ?? 'no-attribution-rule'
          }`}
        >
          {pc?.discoveredContent?.status === NexoyaDiscoveredContentStatus.Manual ? (
            <span className="font-normal text-neutral-200">Not applicable</span>
          ) : appliedAttributionRule ? (
            <PortfolioRuleHoverCard
              key={appliedAttributionRule.attributionRule.attributionRuleId}
              rule={appliedAttributionRule.attributionRule}
              tooltip={<span>{appliedAttributionRule.attributionRule.name}</span>}
            />
          ) : (
            <span className="font-normal text-neutral-200">No attribution rules applied</span>
          )}
        </Styles.RowCell>
      ),
      budgetLimit: (
        <Styles.WrapStyled className="flex flex-col items-center">
          {pc?.budgetMin || pc?.budgetMax ? (
            <>
              <FormattedCurrency amount={pc?.budgetMin || pc?.budgetMax} />
              <Styles.BudgetLabel>{pc?.budgetMin ? 'Minimum' : pc?.budgetMax ? 'Maximum' : ''}</Styles.BudgetLabel>
            </>
          ) : null}
        </Styles.WrapStyled>
      ),
      bidStrategy: (
        <Styles.RowCell className="text-left">
          {pc?.content?.biddingStrategy?.type ? (
            <TagStyled bgColor="#eaeaea">{pc?.content?.biddingStrategy?.type}</TagStyled>
          ) : null}
        </Styles.RowCell>
      ),

      ...Object.fromEntries(
        pc.funnelSteps.map((portfolioContentFunnelStep: NexoyaPortfolioContentFunnelStep) => {
          const metricOptions = (providerMetricOptions || [])
            ?.find((mo) => mo.providerId === providerId)
            ?.metricOptions?.filter((mo) =>
              mo.optimizationTargetTypes.includes(portfolioContentFunnelStep?.funnelStep?.type),
            );

          const childHasMetricAssigned = portfolioContentFunnelStep?.sourcePortfolioChildContent?.funnelSteps?.some(
            (fs) =>
              fs?.funnelStep?.funnelStepId === portfolioContentFunnelStep?.funnelStep?.funnelStepId &&
              fs?.metric?.metricTypeId,
          );

          return [
            `funnel_${portfolioContentFunnelStep?.funnelStep?.funnelStepId}`,
            <Styles.RowCell key={portfolioContentFunnelStep?.funnelStep?.funnelStepId} className="w-full">
              <ContentMetricPanel
                item={pc}
                key={`metric-panel-${portfolioContentFunnelStep}`}
                metricOptions={metricOptions}
                portfolioId={portfolioInfo?.portfolioId}
                funnelStepId={portfolioContentFunnelStep?.funnelStep?.funnelStepId}
                metricName={portfolioContentFunnelStep?.metric?.name || 'None'}
                metricOptionsLoading={metricOptionsLoading}
                childHasMetricAssigned={childHasMetricAssigned}
                getLink={() => {
                  const portfolioChildContent = portfolioContentFunnelStep?.sourcePortfolioChildContent;

                  const childContentFunnelStep = portfolioChildContent?.funnelSteps?.find(
                    (f) => f.funnelStep?.funnelStepId === portfolioContentFunnelStep?.funnelStep?.funnelStepId,
                  );
                  return portfolioContentFunnelStep?.metric?.metricTypeId === 0
                    ? null
                    : childContentFunnelStep?.metric?.metricTypeId
                      ? getKpiLink({
                          metricTypeId: childContentFunnelStep?.metric?.metricTypeId,
                          contentId: portfolioChildContent?.content?.contentId,
                          start: portfolioInfo?.start,
                          end: portfolioInfo?.end,
                        })
                      : getKpiLink({
                          metricTypeId: portfolioContentFunnelStep?.metric?.metricTypeId,
                          contentId: pc.content?.contentId,
                          start: portfolioInfo?.start,
                          end: portfolioInfo?.end,
                        });
                }}
              />
            </Styles.RowCell>,
          ];
        }),
      ),
      subRows: isAdvancedView
        ? pc.childContents?.map((child) => {
            const childMetrics: NexoyaPortfolioContentMetric[] = get(child, 'metrics', []) || [];
            const childDefaultMetric = childMetrics.filter((item) => item.isOptimizationTarget)[0];

            return {
              contentId: child?.content?.contentId,
              lightHighlight: true,
              editRow: (
                <ChildTDM
                  portfolioId={portfolioInfo?.portfolioId}
                  contentId={child?.content?.contentId}
                  parentContent={pc}
                  isRemoveDisabled={
                    child?.content?.contentType?.collection_type_id === SYSTEM_GENERATED_COLLECTION_TYPE_ID &&
                    pc?.discoveredContent?.status !== NexoyaDiscoveredContentStatus.Manual
                  }
                />
              ),
              content: (
                <Styles.ChildContentWrap key={child?.content?.title} alignItems="center">
                  <div>
                    <SvgUnlink />
                  </div>
                  {child?.content?.contentType?.collection_type_id === SYSTEM_GENERATED_COLLECTION_TYPE_ID ? (
                    <Tooltip content="System Generated Custom KPI" placement="left" variant="dark">
                      <span>
                        <SvgKpi
                          color={nexyColors.lilac}
                          style={{
                            height: 24,
                            width: 24,
                            marginRight: 12,
                            marginLeft: 12,
                          }}
                        />
                      </span>
                    </Tooltip>
                  ) : (
                    <Styles.AvatarWrapStyled providerId={child?.content?.provider?.provider_id} size={24} />
                  )}

                  {childDefaultMetric ? (
                    <Styles.ChildAvatarWrapper
                      to={buildContentPath(
                        child?.content?.contentId,
                        {
                          dateFrom: portfolioInfo?.start.substring(0, 10),
                          dateTo: portfolioInfo?.end.substring(0, 10),
                        },
                        true,
                      )}
                    >
                      <Link
                        to={buildContentPath(
                          child?.content?.contentId,
                          {
                            dateFrom: portfolioInfo?.start.substring(0, 10),
                            dateTo: portfolioInfo?.end.substring(0, 10),
                          },
                          true,
                        )}
                      >
                        <Typography component="p" display="inline-block">
                          {get(child, 'content.title', 'n/a')}
                        </Typography>
                        <span className="contentType">{get(child, 'content.collectionType.name', 'n/a') || 'n/a'}</span>
                      </Link>
                    </Styles.ChildAvatarWrapper>
                  ) : (
                    <Styles.PaddedLabel>
                      <Link
                        to={buildContentPath(
                          child?.content?.contentId,
                          {
                            dateFrom: portfolioInfo?.start.substring(0, 10),
                            dateTo: portfolioInfo?.end.substring(0, 10),
                          },
                          true,
                        )}
                      >
                        <Typography withTooltip component="p" display="inline-block">
                          {get(child, 'content.title', 'n/a')}
                        </Typography>
                      </Link>
                    </Styles.PaddedLabel>
                  )}
                </Styles.ChildContentWrap>
              ),

              ...Object.fromEntries(
                child.funnelSteps?.map((portfolioFunnelStep, idx) => {
                  const funnelStepId = portfolioFunnelStep?.funnelStep?.funnelStepId;

                  const metricOptions = providerMetricOptions
                    ?.find((mo) => mo.providerId === child?.content?.provider?.provider_id)
                    ?.metricOptions?.filter((mo) =>
                      mo.optimizationTargetTypes.includes(portfolioFunnelStep?.funnelStep?.type),
                    );

                  return [
                    `funnel_${funnelStepId}`,
                    <Styles.RowCell alignItems="space-between" key={funnelStepId} className="!justify-between gap-4">
                      <ContentMetricPanel
                        key={`metric-panel-${idx}`}
                        item={child}
                        parentContentId={pc?.content?.contentId}
                        portfolioId={portfolioInfo?.portfolioId}
                        funnelStepId={funnelStepId}
                        metricName={portfolioFunnelStep?.metric?.name || 'None'}
                        metricOptions={metricOptions || []}
                        metricOptionsLoading={metricOptionsLoading}
                        getLink={() =>
                          getKpiLink({
                            metricTypeId: portfolioFunnelStep?.metric?.metricTypeId,
                            contentId: child?.content?.contentId,
                            start: portfolioInfo?.start,
                            end: portfolioInfo?.end,
                          })
                        }
                      />
                    </Styles.RowCell>,
                  ];
                }),
              ),
            };
          })
        : [], // Only render subRows if user is viewing the advanced view
    };

    funnelSteps.forEach((funnelStep) => {
      row[funnelStep.funnelStepId] = funnelStep.title;
    });

    return row;
  });
};
