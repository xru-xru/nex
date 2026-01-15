import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Button from '../../../../../components/Button';
import ButtonAsync from '../../../../../components/ButtonAsync';
import SidePanel, { SidePanelActions } from '../../../../../components/SidePanel';
import ContentSelectionV2 from '../../../../../components/ContentSelection/ContentSelectionV2';
import { useTeam } from 'context/TeamProvider';
import {
  NexoyaApplicableAttributionRule,
  NexoyaApplicableContentRule,
  NexoyaApplicableImpactGroupRule,
  NexoyaAttributionRule,
  NexoyaContentFilter,
  NexoyaContentFilterFieldName,
  NexoyaContentFilterOperator,
  NexoyaContentRule,
  NexoyaDiscoveredContent,
  NexoyaDiscoveredContentStatus,
  NexoyaImpactGroupRule,
  NexoyaImpactGroupRuleProviderInput,
  NexoyaUpdateAttributionRuleFiltersContentActionInput,
  NexoyaUpdateContentRuleFiltersContentActionInput,
  NexoyaUpdateImpactGroupRuleFiltersContentActionInput,
} from '../../../../../types';
import { DataTableFilterOption } from './types';
import { useDialogState } from '../../../../../components/Dialog';
import { SaveFilterDialog } from '../../../../../components/ContentSelection/components/SaveFilterDialog';
import { getFilterValueInputBasedOnType, normalizeFilter, PortfolioRuleType } from './utils';
import { usePortfolio } from '../../../../../context/PortfolioProvider';
import { toast } from 'sonner';
import { MetricClashesDialog } from './MetricClashes';
import { useRuleClashStore } from '../../../../../store/metric-clashes';
import { isEqual, sortBy, toNumber } from 'lodash';
import { useApplyRulesToDiscoveredContentsMutation } from '../../../../../graphql/portfolioRules/mutationApplyRulesToDiscoveredContents';
import { PreviewEditDialog } from './PreviewEditDialog';
import { useProviderRuleStore } from '../../../../../store/provider-rules';
import Tooltip from '../../../../../components/Tooltip';
import { useFilteredContentsStore } from '../../../../../store/filter-contents';

export type CommonRuleConfig = {
  type: PortfolioRuleType;
  createMutation: (variables: any) => Promise<any>;
  updateMutation: (variables: any) => Promise<any>;
  previewUpdateMutation: (variables: any) => Promise<any>;
  labels: {
    name: string;
    saveButton: string;
  };
};

type Props = {
  closeRuleSidepanel: () => void;
  isOpen: boolean;
  portfolioId: number;
  config: CommonRuleConfig;
  rule?: NexoyaContentRule | NexoyaImpactGroupRule | NexoyaAttributionRule;
  loading: {
    create: boolean;
    update: boolean;
    preview: boolean;
  };
};

function CreateOrUpdatePortfolioRule({ closeRuleSidepanel, isOpen, portfolioId, rule, config, loading }: Props) {
  const isImpactGroupRule = config.type === 'impact-group-rule';
  const isAttributionRule = config.type === 'attribution-rule';
  const ruleId = isImpactGroupRule
    ? // @ts-ignore
      rule?.impactGroupRuleId
    : isAttributionRule
      ? // @ts-ignore
        rule?.attributionRuleId
      : // @ts-ignore
        rule?.contentRuleId;

  const [selectedContentIds, setSelectedContentIds] = useState<number[]>(
    // @ts-ignore
    ruleId ? rule?.contents?.map((c) => c.contentId) : [],
  );

  const [selectedProviderIds, setSelectedProviderIds] = useState<number[]>([]);
  const [selectedAccountIds, setSelectedAccountIds] = useState<number[]>([]);
  // @ts-ignore
  const [selectedImpactGroupId, setSelectedImpactGroupId] = useState<number | null>(rule ? rule.impactGroupId : null);
  const [selectedOptions, setSelectedOptions] = useState<DataTableFilterOption[]>([]);
  const [pendingFilters, setPendingFilters] = useState<NexoyaContentFilter[]>([]);
  const [contentActions, setContentActions] = useState<
    | NexoyaUpdateImpactGroupRuleFiltersContentActionInput[]
    | NexoyaUpdateContentRuleFiltersContentActionInput[]
    | NexoyaUpdateAttributionRuleFiltersContentActionInput[]
  >([]);
  const [newMatchingDiscoveredContents, setNewMatchingDiscoveredContents] = useState<NexoyaDiscoveredContent[]>([]);
  const [noLongerMatchingDiscoveredContents, setNoLongerMatchingDiscoveredContents] = useState<
    NexoyaDiscoveredContent[]
  >([]);

  const { setClashingDiscoveredContents, selectedRules, resetSelectedRules } = useRuleClashStore();
  const { providerMapSelection, setProviderMapSelection } = useProviderRuleStore();
  const { setFilteredContents } = useFilteredContentsStore();

  const [applyRulesToDiscoveredContents, { loading: loadingApply }] = useApplyRulesToDiscoveredContentsMutation({
    portfolioId,
    status: NexoyaDiscoveredContentStatus.Manual,
  });

  const { teamId } = useTeam();

  const {
    portfolioV2Info: {
      meta: { data: portfolioMeta },
    },
  } = usePortfolio();

  const impactGroups = portfolioMeta?.impactGroups || [];

  const {
    isOpen: isOpenApplyDialog,
    toggleDialog: toggleApplyDialog,
    closeDialog: closeApplyDialog,
  } = useDialogState();

  const {
    isOpen: isOpenClashesDialog,
    toggleDialog: toggleClashesDialog,
    closeDialog: closeClashesDialog,
  } = useDialogState();

  const {
    isOpen: isOpenPreviewDialog,
    toggleDialog: togglePreviewDialog,
    closeDialog: closePreviewDialog,
  } = useDialogState();

  const resetPreviewContentActions = useCallback(() => setContentActions([]), [setContentActions]);
  const handleClosePreviewDialog = useCallback(() => {
    resetPreviewContentActions();
    closePreviewDialog();
  }, [closePreviewDialog, resetPreviewContentActions]);

  const computedFilters = useMemo(() => {
    return [
      ...selectedOptions.map((option) => ({
        fieldName: option.value as NexoyaContentFilterFieldName,
        operator: option.filterOperator as NexoyaContentFilterOperator,
        value: getFilterValueInputBasedOnType(option.type, option.filterValues),
      })),
      {
        fieldName: NexoyaContentFilterFieldName.SourceProviderId,
        operator: NexoyaContentFilterOperator.Eq,
        value: { numberArr: selectedProviderIds.map((providerId) => providerId) },
      },
    ];
  }, [selectedOptions, selectedProviderIds, selectedAccountIds]);

  const baseFilters = useMemo(() => {
    return rule ? rule.filters?.contentFilters : [];
  }, [rule]);

  const areFiltersChanged = rule
    ? !isEqual(
        sortBy(computedFilters.map(normalizeFilter), 'fieldName'),
        sortBy(baseFilters?.map(normalizeFilter), 'fieldName'),
      )
    : true;

  const hasContentFilters = (options: DataTableFilterOption[]): boolean => {
    return options.length > 0;
  };

  useEffect(() => {
    if (rule?.filters) {
      setSelectedOptions([]);
      setPendingFilters(rule.filters?.contentFilters);

      const isImpactGroupRule = rule?.__typename === 'ImpactGroupRule';

      const providers = isImpactGroupRule
        ? rule.filters?.providers.map((p) => p.providerId)
        : [rule.filters?.providerId];

      setSelectedProviderIds(providers);

      const adAccountIds = isImpactGroupRule
        ? rule.filters?.providers.flatMap((p) => p.adAccountIds)
        : rule.filters?.adAccountIds;

      setSelectedAccountIds(adAccountIds);
    }
  }, [rule?.filters]);

  const handleUpdate = () => {
    const actualFilters = [
      ...selectedOptions.map((option) => ({
        fieldName: option.value as NexoyaContentFilterFieldName,
        operator: option.filterOperator as NexoyaContentFilterOperator,
        value: getFilterValueInputBasedOnType(option.type, option.filterValues),
      })),
    ];

    const providerIds = selectedProviderIds.map((providerId) => providerId);
    const adAccountIds = selectedAccountIds.map((adAccountId) => adAccountId);

    const impactGroupRuleProviderInput: NexoyaImpactGroupRuleProviderInput[] = Object.entries(providerMapSelection).map(
      ([providerId, adAccountIds]) => ({
        providerId: toNumber(providerId),
        adAccountIds,
      }),
    );

    const filters = isImpactGroupRule
      ? {
          contentFilters: actualFilters,
          providers: impactGroupRuleProviderInput,
        }
      : {
          contentFilters: actualFilters,
          providerId: providerIds[0],
          adAccountIds,
        };

    const sharedVariables = {
      portfolioId,
      teamId,
      name: rule.name,
      filters,
      impactGroupId: isImpactGroupRule ? selectedImpactGroupId : undefined,
      contentIdsToAccept: selectedContentIds,
    };

    if (ruleId) {
      // For PREVIEW update, wrap in contentRuleEdit or impactGroupRuleEdit
      const previewRuleId = isImpactGroupRule
        ? // @ts-ignore
          { impactGroupRuleId: rule.impactGroupRuleId }
        : isAttributionRule
          ? // @ts-ignore
            { attributionRuleId: rule.attributionRuleId }
          : // @ts-ignore
            { contentRuleId: rule.contentRuleId };

      const previewVariables = {
        contentActions,
        ...sharedVariables,
        ...(isImpactGroupRule
          ? { impactGroupRuleEdit: { name: rule.name, filters }, contentRuleEdit: {} }
          : isAttributionRule
            ? // @ts-ignore
              { filters, attributionRuleId: rule.attributionRuleId }
            : { contentRuleEdit: { name: rule.name, filters }, impactGroupRuleEdit: {} }),
        ...previewRuleId,
      };

      config.updateMutation({ variables: previewVariables }).then(() => handleClosePreviewDialog());
    }
  };

  const handleSubmit = (name?: string) => {
    const isImpactGroupRule = config.type === 'impact-group-rule';
    const isAttributionRule = config.type === 'attribution-rule';

    const providerIds = selectedProviderIds.map((providerId) => providerId);
    const adAccountIds = selectedAccountIds.map((adAccountId) => adAccountId);

    const actualFilters = [
      ...selectedOptions.map((option) => ({
        fieldName: option.value as NexoyaContentFilterFieldName,
        operator: option.filterOperator as NexoyaContentFilterOperator,
        value: getFilterValueInputBasedOnType(option.type, option.filterValues),
      })),
    ];

    const impactGroupRuleProviderInput: NexoyaImpactGroupRuleProviderInput[] = Object.entries(
      providerMapSelection,
    ).flatMap(([providerId, adAccountIds]) => ({
      providerId: toNumber(providerId),
      adAccountIds,
    }));

    const filters = isImpactGroupRule
      ? {
          contentFilters: actualFilters,
          providers: impactGroupRuleProviderInput,
        }
      : isAttributionRule
        ? {
            contentFilters: actualFilters,
            providerId: providerIds[0],
            adAccountIds,
          }
        : {
            contentFilters: actualFilters,
            providerId: providerIds[0],
            adAccountIds,
          };

    const sharedVariables = {
      portfolioId,
      teamId,
      name: name ?? rule.name,
      filters,
      impactGroupId: isImpactGroupRule ? selectedImpactGroupId : undefined,
      ...(!isImpactGroupRule && !isAttributionRule && { contentIdsToAccept: selectedContentIds }),
    };

    if (ruleId) {
      // For PREVIEW update, wrap in contentRuleEdit or impactGroupRuleEdit
      const ruleId = isImpactGroupRule
        ? // @ts-ignore
          { impactGroupRuleId: rule.impactGroupRuleId }
        : isAttributionRule
          ? // @ts-ignore
            { attributionRuleId: rule.attributionRuleId }
          : // @ts-ignore
            { contentRuleId: rule.contentRuleId };

      const previewVariables = {
        ...sharedVariables,
        ...(isImpactGroupRule
          ? { impactGroupRuleEdit: { name, filters }, contentRuleEdit: {} }
          : isAttributionRule
            ? // @ts-ignore
              { filters, attributionRuleId: rule.attributionRuleId }
            : { contentRuleEdit: { name, filters }, impactGroupRuleEdit: {} }),
        ...ruleId,
      };

      config.previewUpdateMutation({ variables: previewVariables }).then(({ data }) => {
        const { newMatchingDiscoveredContents, noLongerMatchingDiscoveredContents } = isImpactGroupRule
          ? data.impactGroupRuleUpdatePreview
          : isAttributionRule
            ? data.attributionRuleUpdateFiltersPreview
            : data.contentRuleUpdateFiltersPreview;

        setNewMatchingDiscoveredContents(newMatchingDiscoveredContents);
        setNoLongerMatchingDiscoveredContents(noLongerMatchingDiscoveredContents);
        togglePreviewDialog();
        closeApplyDialog();
      });
    } else {
      // For CREATE mutation, DO NOT wrap in edit objects
      config
        .createMutation({
          variables: sharedVariables,
        })
        .then((response) => {
          const data = response?.data;
          const errors = response?.errors;

          if (errors) {
            console.error('GraphQL errors:', errors);
            return; // Exit early, don't close dialogs or sidepanel
          }

          closeApplyDialog();

          const clashingDiscoveredContents =
            data?.updateContentRuleFunnelStepMappings?.clashingDiscoveredContents ||
            data?.createImpactGroupRule?.clashingDiscoveredContents ||
            data?.createAttributionRule?.clashingDiscoveredContents;

          if (clashingDiscoveredContents?.length) {
            setClashingDiscoveredContents(clashingDiscoveredContents);
            toast.warning('Some contents have clashes');
            toggleClashesDialog();
          } else {
            // Only close the side panel if there are no clashes
            closeSidepanel();
          }
        });
    }
  };

  const handleApplyClashes = async () => {
    const discoveredContentsWithRulesToApply = Object.entries(selectedRules).map(([contentId, rule]) => {
      const baseRule = {
        discoveredContentId: parseInt(contentId, 10),
        contentRuleId: null,
      };

      if (config.type === 'impact-group-rule') {
        return {
          ...baseRule,
          impactGroupRuleId: toNumber(rule.ruleId),
        };
      } else if (config.type === 'attribution-rule') {
        return {
          ...baseRule,
          attributionRuleId: toNumber(rule.ruleId),
        };
      } else {
        return {
          ...baseRule,
          contentRuleId: toNumber(rule.ruleId),
        };
      }
    });

    await applyRulesToDiscoveredContents({
      variables: {
        discoveredContentsWithRulesToApply,
        portfolioId,
        teamId,
      },
    }).then(() => {
      closeClashesDialog();
      closeSidepanel();
      resetSelectedRules();
    });
  };

  const closeSidepanel = () => {
    closeRuleSidepanel();
    setSelectedProviderIds([]);
    setSelectedAccountIds([]);
    setSelectedImpactGroupId(null);
    setSelectedContentIds([]);
    setSelectedOptions([]);
    setProviderMapSelection({});
    setFilteredContents([]);
  };

  return (
    <>
      <SidePanel
        isOpen={isOpen}
        onClose={closeSidepanel}
        paperProps={{ style: { width: 'calc(100% - 218px)', paddingBottom: '78px' } }}
      >
        <div className="border border-b-[#eaeaea] px-6 py-5">
          <h3 className="text-xl font-medium text-neutral-900">
            {ruleId ? `Edit ${config.labels.name}` : `Create ${config.labels.name}`}
          </h3>
        </div>
        <div className="pr-6">
          <ContentSelectionV2
            selectedContentIds={selectedContentIds}
            setSelectedProviderIds={setSelectedProviderIds}
            selectedProviderIds={selectedProviderIds}
            setSelectedContentIds={setSelectedContentIds}
            selectedAccountIds={selectedAccountIds}
            setSelectedAccountIds={setSelectedAccountIds}
            selectedOptions={selectedOptions}
            setSelectedOptions={setSelectedOptions}
            pendingFilters={pendingFilters}
            setPendingFilters={setPendingFilters}
            allowMultipleProviderSelection={isImpactGroupRule || isAttributionRule}
            configType={config.type}
          />
        </div>
        <SidePanelActions className="!fixed bottom-0 z-[3400] !w-[calc(100%-218px)] border-t border-neutral-100">
          <Button
            disabled={loading.create || loading.update}
            id="previous"
            variant="contained"
            onClick={closeSidepanel}
          >
            Cancel
          </Button>
          <Tooltip
            placement="left"
            variant="dark"
            style={{ wordBreak: 'break-word', maxWidth: 350 }}
            open={!isImpactGroupRule && !isAttributionRule && !hasContentFilters(selectedOptions)}
            popperProps={{
              style: { zIndex: 3100 },
            }}
            content={
              !isImpactGroupRule && !isAttributionRule && !hasContentFilters(selectedOptions)
                ? 'Please add at least one filter argument besides channel selection'
                : ''
            }
          >
            <div>
              <ButtonAsync
                id="next"
                variant="contained"
                color="primary"
                disabled={
                  (!isImpactGroupRule && !isAttributionRule && !hasContentFilters(selectedOptions)) ||
                  loading.create ||
                  loading.update ||
                  loading.preview ||
                  (rule && !areFiltersChanged)
                }
                loading={loading.create || loading.update}
                onClick={ruleId ? () => handleSubmit() : toggleApplyDialog}
                style={{ marginLeft: 'auto' }}
              >
                {ruleId ? 'Update rule' : 'Finish'}
              </ButtonAsync>
            </div>
          </Tooltip>
        </SidePanelActions>
        <SaveFilterDialog
          config={config}
          impactGroups={impactGroups}
          initialName={rule?.name}
          selectedImpactGroupId={selectedImpactGroupId}
          setSelectedImpactGroupId={setSelectedImpactGroupId}
          closeDialog={closeApplyDialog}
          loading={loading.create || loading.update}
          open={isOpenApplyDialog}
          handleSave={(name) => handleSubmit(name)}
          contentsToAddLength={selectedContentIds?.length}
        />
        {isOpenClashesDialog && (
          <>
            {config.type === 'impact-group-rule' && (
              <MetricClashesDialog<NexoyaApplicableImpactGroupRule>
                isOpen={isOpenClashesDialog}
                onConfirm={() => handleApplyClashes()}
                loading={loadingApply}
                getRules={(dsc) => dsc.impactGroupRules}
                getRuleId={(rule) => rule?.impactGroupRule?.impactGroupRuleId?.toString()}
                getRuleName={(rule) => rule?.impactGroupRule?.name}
                dialogTitle="Impact group clashes"
                type="impact group rule"
                onCancel={() => {
                  closeClashesDialog();
                  closeSidepanel();
                }}
              />
            )}
            {config.type === 'attribution-rule' && (
              <MetricClashesDialog<NexoyaApplicableAttributionRule>
                isOpen={isOpenClashesDialog}
                onConfirm={() => handleApplyClashes()}
                loading={loadingApply}
                getRules={(dsc) => dsc.attributionRules}
                getRuleId={(rule) => rule?.attributionRule?.attributionRuleId?.toString()}
                getRuleName={(rule) => rule?.attributionRule?.name}
                dialogTitle="Attribution rule clashes"
                type="attribution rule"
                onCancel={() => {
                  closeClashesDialog();
                  closeSidepanel();
                }}
              />
            )}
          </>
        )}
        {isOpenPreviewDialog && (
          <PreviewEditDialog
            rule={rule}
            isOpen={isOpenPreviewDialog}
            onCancel={handleClosePreviewDialog}
            onConfirm={() => handleUpdate()}
            loading={loadingApply || loading.preview || loading.update}
            getRules={(dsc) =>
              config.type === 'content-rule'
                ? dsc.contentRules
                : config.type === 'impact-group-rule'
                  ? dsc.impactGroupRules
                  : dsc.attributionRules
            }
            getRuleName={(
              rule: NexoyaApplicableImpactGroupRule | NexoyaApplicableContentRule | NexoyaApplicableAttributionRule,
            ) =>
              config.type === 'content-rule'
                ? // @ts-ignore
                  rule.contentRule?.name
                : config.type === 'impact-group-rule'
                  ? // @ts-ignore
                    rule?.impactGroupRule?.name
                  : // @ts-ignore
                    rule?.attributionRule?.name
            }
            contentActions={contentActions}
            setContentActions={setContentActions}
            newMatchingDiscoveredContents={newMatchingDiscoveredContents}
            noLongerMatchingDiscoveredContents={noLongerMatchingDiscoveredContents}
            type={config.type.replaceAll('-', ' ')}
          />
        )}
      </SidePanel>
    </>
  );
}

export default CreateOrUpdatePortfolioRule;
