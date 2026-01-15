import {
  NexoyaAttributionRule,
  NexoyaAttributionRuleFactorSourceType,
  NexoyaContentFilterFieldName,
  NexoyaContentFilterOperator,
  NexoyaContentRule,
  NexoyaContentV2,
  NexoyaDeleteAttributionRuleContentActionInput,
  NexoyaDeleteContentRuleContentActionInput,
  NexoyaDeleteImpactGroupRuleContentActionInput,
  NexoyaFunnelStepMappingType,
  NexoyaFunnelStepV2,
  NexoyaImpactGroupRule,
  NexoyaProvider,
} from '../../../types';
import { nexyColors } from '../../../theme';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../../components-ui/DropdownMenu';
import ButtonIcon from '../../../components/ButtonIcon';
import SvgEllipsisV from '../../../components/icons/EllipsisV';
import AvatarProvider from '../../../components/AvatarProvider';
import translate from '../../../utils/translate';
import { capitalize, toNumber, truncate } from 'lodash';
import Tooltip from '../../../components/Tooltip';
import {
  displayFilterValue,
  excludeProviderAndParentCollectionFields,
  getHumanReadableFunnelStepMapping,
  getIconForField,
  humanizeFieldName,
  OPERATORS_MAP,
} from '../components/Content/PortfolioRule/utils';
import { LabelLight } from '../../../components/InputLabel/styles';
import { ContentMetricAssignment } from '../components/Content/PortfolioRule/ContentMetricAssignment';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useProviders } from '../../../context/ProvidersProvider';
import { DeleteRuleDialog } from './DeleteRuleDialog';
import { useDialogState } from '../../../components/Dialog';
import { CONTENT_TYPE_SUB_ACCOUNT_NUMBER, extractProviderMapFromFilters } from '../utils/portfolio-rules';
import { useContentMappingStore } from '../../../store/content-metric-assignments';
import { useLazyQuery, useMutation } from '@apollo/client';
import { MEASUREMENTS_QUERY, useMeasurementsQuery } from '../../../graphql/measurement/queryMeasurements';
import { useTeam } from '../../../context/TeamProvider';
import { HoverableTooltip } from '../../../components-ui/HoverCard';
import Link2 from '../../../components/icons/Link2';
import { usePortfolio } from '../../../context/PortfolioProvider';
import { cn } from '../../../lib/utils';
import SvgNoFillPencil from '../../../components/icons/NoFillPencil';
import { RuleDialog } from './RuleDialog';
import useTranslationStore from '../../../store/translations';
import { BrickLoader } from '../../Portfolio';
import { useProviderSubAccountsQuery } from '../../../graphql/portfolioRules/queryProviderSubAccounts';
import { useUpdateAttributionRuleNameMutation } from '../../../graphql/portfolioRules/mutationUpdateAttributionRuleName';
import { AttributionAssignment } from '../components/Content/PortfolioRule/AttributionAssignment';
import { RemoveContentsDialog } from './RemoveContentsDialog';
import { toast } from 'sonner';
import { REMOVE_PORTFOLIO_CONTENT_MUTATION_WITH_COLLECTION_ID } from '../../../graphql/portfolio/mutationRemovePortfolioContentWithCollectionId';
import { StringParam, useQueryParams } from 'use-query-params';
import { useContentFilterStore } from '../../../store/content-filter';
import { contentTabs, portfolioTabs } from '../../../configs/portfolio';
import { useUpdateContentRuleNameMutation } from '../../../graphql/portfolioRules/mutationUpdateContentRuleName';
import dayjs from 'dayjs';

type NexoyaRule = NexoyaContentRule | NexoyaImpactGroupRule | NexoyaAttributionRule;

interface Props {
  config: {
    ruleType: 'content-rule' | 'impact-group-rule' | 'attribution-rule';
    update: {
      mutation: any;
      loading: boolean;
    };
    updateRuleName?: (rule: NexoyaRule) => void;
  };
  attributionAssignment?: {
    rule: NexoyaAttributionRule;
    isOpen: boolean;
    close: () => void;
    open: (rule: NexoyaAttributionRule) => void;
  };
  contentMetricAssignment?: {
    rule: NexoyaContentRule;
    isOpen: boolean;
    close: () => void;
    open: (rule: NexoyaContentRule) => void;
  };
  rule: NexoyaRule;
  ruleId: number;
  handleEditRule: (rule: NexoyaRule) => void;
  handleDeleteRule: (rule: NexoyaRule) => void;
  handleDuplicateRule: (rule: NexoyaRule) => void;
  funnelSteps: NexoyaFunnelStepV2[];
  contentActions:
    | NexoyaDeleteContentRuleContentActionInput[]
    | NexoyaDeleteImpactGroupRuleContentActionInput[]
    | NexoyaDeleteAttributionRuleContentActionInput[];
  setContentActions: Dispatch<
    SetStateAction<
      | NexoyaDeleteContentRuleContentActionInput[]
      | NexoyaDeleteImpactGroupRuleContentActionInput[]
      | NexoyaDeleteAttributionRuleContentActionInput[]
    >
  >;
  resetContentActions: () => void;
  loadingDelete: boolean;
  readonly?: boolean;
}

export const PortfolioRuleCard = ({
  rule,
  ruleId,
  handleEditRule,
  handleDeleteRule,
  handleDuplicateRule,
  funnelSteps,
  loadingDelete,
  setContentActions,
  contentActions,
  resetContentActions,
  config,
  contentMetricAssignment,
  attributionAssignment,
  readonly = false,
}: Props) => {
  const { teamId } = useTeam();
  const { activeProviders } = useProviders();

  const [, setQueryParams] = useQueryParams({
    activeTab: StringParam,
    activeContentTab: StringParam,
  });

  const { handleAddImpactGroupRule, handleAddAttributionRule, handleAddContentRule } = useContentFilterStore();

  const { measurementsByProvider, setMeasurementsByProvider } = useContentMappingStore();
  const { translations } = useTranslationStore();

  const {
    portfolioV2Info: {
      meta: { data: portfolioMeta },
    },
  } = usePortfolio();

  const [contentsToBeRemoved, setContentsToBeRemoved] = useState<number[]>(
    rule.appliedDiscoveredContents?.map((dsc) => dsc.content?.contentId),
  );
  const [subAccounts, setSubAccounts] = useState<NexoyaContentV2[]>([]);
  const [name, setName] = useState(rule?.name);

  const isImpactGroupRule = rule.__typename === 'ImpactGroupRule';
  const isAttributionRule = rule.__typename === 'AttributionRule';
  const isContentRule = rule.__typename === 'ContentRule';

  const [selectedImpactGroupId, setSelectedImpactGroupId] = useState<number | null>(
    rule.__typename === 'ImpactGroupRule' ? rule?.impactGroupId : null,
  );

  const impactGroups = portfolioMeta?.impactGroups || [];
  const portfolioId = portfolioMeta?.portfolioId;

  const measurements = Object.values(measurementsByProvider).flat();

  const { loading: subAccountsLoading } = useProviderSubAccountsQuery({
    teamId,
    portfolioId,
    filters: [
      {
        fieldName: NexoyaContentFilterFieldName.ContentType,
        operator: NexoyaContentFilterOperator.Eq,
        value: { number: CONTENT_TYPE_SUB_ACCOUNT_NUMBER },
      },
    ],
    skip: !teamId || !portfolioId,
    excludePortfolioContents: false,
    onCompleted: (data) => setSubAccounts(data?.filterContents),
  });

  const [fetchMeasurements, { loading: measurementsLoading }] = useLazyQuery(MEASUREMENTS_QUERY);
  const [removeContents, { loading: removeContentsLoading }] = useMutation(
    REMOVE_PORTFOLIO_CONTENT_MUTATION_WITH_COLLECTION_ID,
  );

  const {
    isOpen: isOpenRemoveContentsDialog,
    toggleDialog: toggleRemoveContentsDialog,
    closeDialog: closeRemoveContentsDialog,
  } = useDialogState();
  const { isOpen: isOpenDeleteDialog, toggleDialog, closeDialog: closeDeleteDialog } = useDialogState();
  const { isOpen: isOpenRuleDialog, toggleDialog: toggleRuleDialog, closeDialog: closeRuleDialog } = useDialogState();

  const [dialogMode, setDialogMode] = useState<'content-name' | 'impact-name' | 'impact-assign' | 'attribution-name'>(
    'content-name',
  );

  const handleOpenDialog = (mode: 'content-name' | 'impact-name' | 'impact-assign' | 'attribution-name') => {
    setDialogMode(mode);
    toggleRuleDialog();
  };

  const handleViewContentsInContentTab = (rule: NexoyaRule) => {
    switch (config.ruleType) {
      case 'content-rule':
        handleAddContentRule(rule as NexoyaContentRule);
        break;
      case 'impact-group-rule':
        handleAddImpactGroupRule(rule as NexoyaImpactGroupRule);
        break;
      case 'attribution-rule':
        handleAddAttributionRule(rule as NexoyaAttributionRule);
        break;
      default:
        break;
    }

    setQueryParams({
      activeTab: portfolioTabs.CONTENT,
      activeContentTab: contentTabs.CONTENT,
    });
  };

  useEffect(() => {
    if (subAccountsLoading) return;

    const providerMap = Object.entries(extractProviderMapFromFilters(rule.filters, subAccounts));

    if (!providerMap?.length) return;

    const fetchData = async () => {
      providerMap.map(async ([providerIdString]) => {
        const providerId = toNumber(providerIdString);

        const { data: measurementsData } = await fetchMeasurements({
          variables: { providerId },
        });

        if (measurementsData?.measurements) {
          setMeasurementsByProvider(providerId, measurementsData.measurements);
        }
      });
    };

    if (providerMap?.length) {
      fetchData();
    }
  }, [ruleId, subAccounts]);

  const [updateAttributionRuleName, { loading: updateAttributionRuleNameLoading }] =
    useUpdateAttributionRuleNameMutation({
      portfolioId,
      onCompleted: () => closeRuleDialog(),
    });

  const [updateContentRuleName, { loading: updateContentRuleNameLoading }] = useUpdateContentRuleNameMutation({
    portfolioId,
    onCompleted: () => closeRuleDialog(),
  });

  // Measurements for attribution factors display
  const attributionProviderId = (rule as any)?.filters?.providerId as number | undefined;
  const { data: attributionMeasurementsData, loading: attributionMeasurementsLoading } = useMeasurementsQuery({
    providerId: attributionProviderId,
  });

  const attributionMeasurements = attributionMeasurementsData?.measurements ?? [];
  const attributionFactors = isAttributionRule ? ((rule as NexoyaAttributionRule)?.factors ?? []) : [];
  const attributionSortedFactors = attributionFactors
    .slice()
    .sort((a, b) => new Date(b.start).getTime() - new Date(a.start).getTime());

  const handleUpdateName = () => {
    if (config.ruleType === 'content-rule') {
      updateContentRuleName({
        variables: {
          contentRuleId: ruleId,
          name: name,
          portfolioId: portfolioId,
          teamId: teamId,
        },
      });
    }
    if (config.ruleType === 'attribution-rule') {
      updateAttributionRuleName({
        variables: {
          attributionRuleId: ruleId,
          name: name,
          portfolioId: portfolioId,
          teamId: teamId,
        },
      });
    }
    if (config.ruleType === 'impact-group-rule') {
      handleUpdate();
    }
  };

  const handleUpdate = () => {
    const ruleId = isImpactGroupRule
      ? { impactGroupRuleId: rule.impactGroupRuleId }
      : isAttributionRule
        ? { attributionRuleId: rule.attributionRuleId }
        : { contentRuleId: rule.contentRuleId };

    const previewVariables = {
      portfolioId,
      teamId,
      name,
      ...(isImpactGroupRule
        ? { impactGroupRuleEdit: { name, impactGroupId: selectedImpactGroupId }, contentRuleEdit: {} }
        : isAttributionRule
          ? { filters: rule.filters, attributionRuleId: rule.attributionRuleId }
          : { contentRuleEdit: { name }, impactGroupRuleEdit: {} }),
      ...ruleId,
    };

    config.update.mutation({ variables: previewVariables }).then(() => closeRuleDialog());
  };

  const handleRemoveContents = () => {
    removeContents({
      variables: {
        teamId,
        portfolioId,
        collectionIds: contentsToBeRemoved,
      },
    })
      .then(() => {
        setContentsToBeRemoved([]);
        closeRemoveContentsDialog();
      })
      .catch((error) => {
        toast.error('Error removing contents from portfolio');
        console.error('Error removing contents from portfolio', error);
      });
  };

  const getSelectedProvider = (providerId: number) =>
    activeProviders.find((provider: NexoyaProvider) => provider.provider_id === providerId);

  const getImpactGroupName = (impactGroupId: number) =>
    portfolioMeta?.impactGroups?.find((ig) => ig.impactGroupId === impactGroupId)?.name;

  return (
    <div className="rounded-[5px] border border-neutral-100" key={ruleId}>
      <div className="flex items-center justify-between rounded-t-[5px] border-b border-neutral-100 bg-seasalt p-4">
        <div>
          <div className="flex items-center gap-0 text-lg text-neutral-900" style={{ color: nexyColors.neutral900 }}>
            <div className="flex items-center">
              {rule.name}
              {!readonly && (
                <ButtonIcon
                  style={{ marginLeft: 4 }}
                  onClick={() =>
                    handleOpenDialog(
                      isImpactGroupRule ? 'impact-name' : isAttributionRule ? 'attribution-name' : 'content-name',
                    )
                  }
                >
                  <SvgNoFillPencil />
                </ButtonIcon>
              )}
            </div>
            {/* Warning icon if not all funnel steps have an assigned metric */}
            {rule.__typename === 'ContentRule' &&
            (rule as NexoyaContentRule)?.funnelStepMappings?.length !== funnelSteps?.length ? (
              <Tooltip
                placement="right"
                style={{ maxWidth: 400 }}
                variant="dark"
                content="Not all funnel steps have assigned metrics"
              >
                <span>
                  <Link2 className="ml-3 h-7 w-7" />
                </span>
              </Tooltip>
            ) : null}
          </div>
          {/* Impact group name if the rule is an Impact group rule */}
          {rule.__typename === 'ImpactGroupRule' ? (
            <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
              {getImpactGroupName(rule.impactGroupId)}
            </span>
          ) : null}
        </div>
        {!readonly && (
          <div className="flex items-center gap-3">
            <div
              onClick={() => {
                if (rule.matchingDiscoveredContentsCount) {
                  handleViewContentsInContentTab(rule);
                }
              }}
              className={cn(
                'cursor-pointer text-xs font-medium text-purple-400 underline',
                !rule.matchingDiscoveredContentsCount ? 'cursor-not-allowed opacity-50' : '',
              )}
            >
              See matching contents in content tab
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <ButtonIcon
                  style={{
                    fontSize: 18,
                  }}
                >
                  <SvgEllipsisV />
                </ButtonIcon>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="font-normal" align="end">
                <DropdownMenuItem onSelect={() => handleEditRule(rule)}>Edit filters</DropdownMenuItem>
                {!isImpactGroupRule && !isAttributionRule ? (
                  <DropdownMenuItem onSelect={() => contentMetricAssignment.open(rule as NexoyaContentRule)}>
                    Edit metrics
                  </DropdownMenuItem>
                ) : null}
                {isAttributionRule ? (
                  <DropdownMenuItem onSelect={() => attributionAssignment.open(rule as NexoyaAttributionRule)}>
                    Assign attributions
                  </DropdownMenuItem>
                ) : null}
                {isImpactGroupRule ? (
                  <DropdownMenuItem onSelect={() => handleOpenDialog('impact-assign')}>
                    Assign impact group
                  </DropdownMenuItem>
                ) : null}
                <DropdownMenuItem onSelect={() => handleDuplicateRule(rule)}>Duplicate</DropdownMenuItem>
                <div className="my-2.5 h-[1px] w-full bg-neutral-600" />
                <DropdownMenuItem onSelect={toggleDialog} className="text-red-400">
                  Delete {config.ruleType?.replaceAll('-', ' ')}
                </DropdownMenuItem>
                {isContentRule ? (
                  <DropdownMenuItem
                    disabled={!rule.appliedDiscoveredContents?.length}
                    onSelect={toggleRemoveContentsDialog}
                    className="text-red-400"
                  >
                    Remove contents from portfolio
                  </DropdownMenuItem>
                ) : null}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
      <div className="p-3">
        <div className="mb-4 flex items-center gap-3">
          <div className="text-neutral-500">Channel and filter selection</div>
          {!readonly && (
            <span className="cursor-pointer text-xs text-neutral-400 underline" onClick={() => handleEditRule(rule)}>
              Edit filters
            </span>
          )}
        </div>
        <div className="overflow-x-auto">
          <div className="flex w-fit gap-2 py-1">
            {Object.entries(extractProviderMapFromFilters(rule.filters, subAccounts)).map(
              ([providerId, adAccountIds]) => (
                <div
                  key={providerId + adAccountIds}
                  className="w-fit gap-1.5 truncate rounded-[5px] border border-[#D2D3DA] px-3 py-1.5"
                >
                  <Tooltip
                    variant="dark"
                    placement="bottom-start"
                    style={{ wordBreak: 'break-word', maxWidth: 500 }}
                    popperProps={{
                      style: { zIndex: 38000 },
                    }}
                    content={
                      <>
                        <div className="flex items-center gap-3">
                          <AvatarProvider variant="circle" providerId={providerId} size={16} color="dark" />
                          {translate(translations, getSelectedProvider(toNumber(providerId))?.name)}
                        </div>
                        <div className="flex w-full flex-col text-neutral-200">
                          {adAccountIds?.map((adAccountId) => (
                            <div key={adAccountId} className="flex w-full flex-row gap-2">
                              <span className="text-neutral-400">&#x2022;</span>
                              {translate(translations, subAccounts.find((c) => c.contentId === adAccountId)?.title)}
                            </div>
                          ))}
                        </div>
                      </>
                    }
                  >
                    <div className="flex items-center gap-3">
                      <AvatarProvider variant="circle" providerId={providerId} size={16} color="dark" />
                      {translate(translations, getSelectedProvider(toNumber(providerId))?.name)}
                      {adAccountIds ? (
                        <>
                          :
                          <span className="text-neutral-400">
                            {adAccountIds?.map((adAccountId) =>
                              truncate(
                                translate(translations, subAccounts.find((c) => c.contentId === adAccountId)?.title),
                                {
                                  length: 10,
                                },
                              ),
                            )}
                          </span>
                        </>
                      ) : null}
                    </div>
                  </Tooltip>
                </div>
              ),
            )}
            {rule.filters?.contentFilters?.filter(excludeProviderAndParentCollectionFields).map((filter, idx) => (
              <div key={idx} className="w-fit gap-1.5 truncate rounded-[5px] border border-[#D2D3DA] px-3 py-1.5">
                <Tooltip
                  popperProps={{
                    style: { zIndex: 38000 },
                  }}
                  variant="dark"
                  size="small"
                  placement="right-start"
                  content={`${capitalize(humanizeFieldName(filter.fieldName))} ${
                    OPERATORS_MAP[filter.operator]?.humanReadable
                  }: ${displayFilterValue(filter)}`}
                >
                  <div>
                    <span className="mr-2 text-neutral-400">{getIconForField(filter.fieldName)}</span>
                    <span className="font-light capitalize">{humanizeFieldName(filter.fieldName)}</span>
                    <>
                      <span className="font-light">: </span>
                      <span className="font-light text-muted-foreground">{displayFilterValue(filter)}</span>
                    </>
                  </div>
                </Tooltip>
              </div>
            ))}
          </div>
        </div>
      </div>
      {!isImpactGroupRule && !isAttributionRule && !readonly ? (
        measurementsLoading || subAccountsLoading ? (
          <div className="p-3">
            <div className="mb-4 text-neutral-500">Metric assignment</div>
            <div className="flex gap-8">
              {funnelSteps?.map((funnelStep) => (
                <div key={funnelStep.funnelStepId} className="w-fit gap-1.5 truncate">
                  <LabelLight>{funnelStep.title}</LabelLight>
                  <BrickLoader className="!h-4 !w-24" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-3">
            <div className="mb-4 flex items-center gap-3">
              <div className="text-neutral-500">Metric assignment</div>
              {!readonly && (
                <span
                  className="cursor-pointer text-xs text-neutral-400 underline"
                  onClick={() => contentMetricAssignment.open(rule as NexoyaContentRule)}
                >
                  Edit metrics
                </span>
              )}
            </div>
            <div className="flex w-full gap-8 overflow-x-auto">
              {funnelSteps?.map((funnelStep) => {
                const funnelStepMapping = rule.funnelStepMappings?.find(
                  (fsm) => fsm.funnelStepId === funnelStep.funnelStepId,
                );
                const { metric, mappingType } = getHumanReadableFunnelStepMapping({
                  funnelStepMapping,
                  measurements,
                  translations,
                });
                return (
                  <div key={funnelStep.funnelStepId} className="w-fit gap-1.5 truncate">
                    <LabelLight>{funnelStep.title}</LabelLight>
                    <Tooltip
                      style={{ wordBreak: 'break-word', maxWidth: 400 }}
                      popperProps={{
                        style: { zIndex: 38000 },
                      }}
                      variant="dark"
                      size="small"
                      placement="bottom"
                      content={`Mapping type: ${mappingType ? mappingType : 'No assignment'}`}
                    >
                      <HoverableTooltip className="w-fit max-w-fit cursor-none">
                        <span className={`text-xs font-light ${mappingType ? 'text-neutral-800' : 'text-neutral-300'}`}>
                          {funnelStepMapping?.mapping?.type === NexoyaFunnelStepMappingType.Ignore
                            ? 'No metric'
                            : funnelStepMapping?.mapping?.type === NexoyaFunnelStepMappingType.Utm
                              ? mappingType
                              : metric}
                        </span>
                      </HoverableTooltip>
                    </Tooltip>
                  </div>
                );
              })}
            </div>
          </div>
        )
      ) : null}
      <RuleDialog
        isOpen={isOpenRuleDialog}
        onClose={closeRuleDialog}
        mode={dialogMode}
        name={name}
        setName={setName}
        selectedImpactGroupId={selectedImpactGroupId}
        setSelectedImpactGroupId={setSelectedImpactGroupId}
        impactGroups={impactGroups}
        loading={config?.update?.loading || updateAttributionRuleNameLoading || updateContentRuleNameLoading}
        onSave={handleUpdateName}
      />

      {contentMetricAssignment?.isOpen &&
      contentMetricAssignment?.rule?.contentRuleId === (rule as NexoyaContentRule)?.contentRuleId &&
      !isImpactGroupRule &&
      !isAttributionRule ? (
        <ContentMetricAssignment
          funnelSteps={funnelSteps}
          isOpen={contentMetricAssignment.isOpen}
          closeSidePanel={contentMetricAssignment.close}
          contentRule={contentMetricAssignment.rule as NexoyaContentRule}
        />
      ) : null}

      {isAttributionRule && !readonly ? (
        <div className="p-3">
          <div className="mb-4 flex items-center gap-3">
            <div className="text-neutral-500">Most recent attribution factor</div>
            {!readonly && (
              <span
                className="cursor-pointer text-xs text-neutral-400 underline"
                onClick={() => attributionAssignment?.open(rule as NexoyaAttributionRule)}
              >
                Edit attributions
              </span>
            )}
          </div>

          {attributionMeasurementsLoading ? (
            <div className="flex gap-8">
              {[0, 1, 2].map((i) => (
                <div key={i} className="w-fit gap-1.5 truncate">
                  <LabelLight>
                    <BrickLoader className="!h-4 !w-24" />
                  </LabelLight>
                  <BrickLoader className="!h-4 !w-40" />
                </div>
              ))}
            </div>
          ) : !attributionSortedFactors.length ? (
            <div className="text-xs text-neutral-400">No attribution factors assigned</div>
          ) : (
            <div className="flex w-full gap-8 overflow-x-auto">
              {
                // Display only the most recent attribution factor
                attributionSortedFactors.slice(0, 1).map((factor, idx) => {
                  const measurementName =
                    factor.source?.type === NexoyaAttributionRuleFactorSourceType.Metric
                      ? translate(
                          translations,
                          attributionMeasurements.find((m) => m.measurement_id === factor.source?.metricId)?.name,
                        )
                      : 'Custom Conversions';
                  return (
                    <div key={idx} className="w-fit gap-1.5 truncate">
                      <LabelLight>{dayjs(factor.start).format('D MMM YYYY')}</LabelLight>
                      <Tooltip
                        style={{ wordBreak: 'break-word', maxWidth: 400 }}
                        popperProps={{
                          style: { zIndex: 38000 },
                        }}
                        variant="dark"
                        size="small"
                        placement="bottom"
                        content={`Measurement: ${measurementName ?? 'Unknown'}`}
                      >
                        <HoverableTooltip className="w-fit max-w-fit cursor-none">
                          <span
                            className={`text-xs font-light ${measurementName ? 'text-neutral-800' : 'text-neutral-300'}`}
                          >
                            {measurementName ?? 'Unknown'}: {factor.value}
                          </span>
                        </HoverableTooltip>
                      </Tooltip>
                    </div>
                  );
                })
              }
            </div>
          )}
        </div>
      ) : null}

      {attributionAssignment?.isOpen &&
      attributionAssignment?.rule?.attributionRuleId === (rule as NexoyaAttributionRule)?.attributionRuleId &&
      isAttributionRule ? (
        <AttributionAssignment
          isOpen={attributionAssignment.isOpen}
          closeSidePanel={attributionAssignment.close}
          attributionRule={attributionAssignment.rule as NexoyaAttributionRule}
        />
      ) : null}
      {isOpenDeleteDialog && (
        <DeleteRuleDialog
          isOpen={isOpenDeleteDialog}
          onCancel={() => {
            resetContentActions();
            closeDeleteDialog();
          }}
          onConfirm={handleDeleteRule}
          loading={loadingDelete}
          rule={rule}
          contentActions={contentActions}
          setContentActions={setContentActions}
        />
      )}
      {isOpenRemoveContentsDialog && (
        <RemoveContentsDialog
          rule={rule}
          isOpen={isOpenRemoveContentsDialog}
          onConfirm={handleRemoveContents}
          loading={removeContentsLoading}
          contentsToBeRemoved={contentsToBeRemoved}
          setContentsToBeRemoved={setContentsToBeRemoved}
          onCancel={() => {
            setContentsToBeRemoved([]);
            closeRemoveContentsDialog();
          }}
        />
      )}
    </div>
  );
};
