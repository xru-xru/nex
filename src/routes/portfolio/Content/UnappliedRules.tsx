import Typography from '../../../components/Typography';
import { nexyColors } from '../../../theme';
import React, { useEffect } from 'react';
import Button from '../../../components/Button';
import { LabelLight } from '../../../components/InputLabel/styles';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components-ui/Select';
import { useDiscoveredContentsQuery } from '../../../graphql/portfolioRules/queryDiscoveredContents';
import { NexoyaDiscoveredContentStatus } from '../../../types';
import { toast } from 'sonner';
import { useRouteMatch } from 'react-router';
import Spinner from '../../../components/Spinner';
import { useApplyRulesToDiscoveredContentsMutation } from '../../../graphql/portfolioRules/mutationApplyRulesToDiscoveredContents';
import { toNumber } from 'lodash';
import { useDialogState } from '../../../components/Dialog';
import { ConfirmationDialog } from '../components/PortfolioEditFunnel/ConfirmationDialog';
import { useTeam } from '../../../context/TeamProvider';
import { SelectedRule, useDiscoverContentsStore } from '../../../store/discovered-contents';
import PortfolioRuleHoverCard from '../../../components/HoverCard';
import NoDataFound from '../NoDataFound';
import ContentHoverCard from '../../../components/HoverCard/ContentHoverCard';
import useTabNewUpdates from '../../../hooks/useTabNewUpdates';
import { PORTFOLIO_PARENT_CONTENTS_QUERY } from '../../../graphql/content/queryPortfolioContents';
import { buildPortfolioContentFilterVariables } from '../utils/content';
import { useContentFilterStore } from '../../../store/content-filter';
import usePortfolioMetaStore from '../../../store/portfolio-meta';

export const UnappliedRules = () => {
  const { teamId } = useTeam();

  const match = useRouteMatch();
  const portfolioId = parseInt(match.params.portfolioID, 10);

  const { portfolioMeta } = usePortfolioMetaStore();
  const filterStore = useContentFilterStore();
  const {
    contentsWithUnappliedRules,
    setContentsWithUnappliedRules,
    setSelectedUnappliedContentRules: setSelectedRules,
    selectedUnappliedContentRules: selectedContentRules,
    resetSelectedUnappliedContentRules: resetSelectedRules,
  } = useDiscoverContentsStore();

  const { refreshCountDiscoveredContents } = useTabNewUpdates(portfolioId);

  const { isOpen: isApproveOpen, openDialog: openApproveDialog, closeDialog: closeApproveDialog } = useDialogState();

  const [applyRulesToDiscoveredContents, { loading: loadingApply }] = useApplyRulesToDiscoveredContentsMutation({
    portfolioId,
    status: NexoyaDiscoveredContentStatus.AcceptedButHasUnappliedRules,
    refetchQueries: [
      {
        query: PORTFOLIO_PARENT_CONTENTS_QUERY,
        variables: buildPortfolioContentFilterVariables(teamId, portfolioId, filterStore),
      },
    ],
  });

  const { loading, data } = useDiscoveredContentsQuery({
    portfolioId,
    status: NexoyaDiscoveredContentStatus.AcceptedButHasUnappliedRules,
    onError: (error) => {
      console.error('Error fetching contents:', error);
      toast.error('Error fetching contents');
      setContentsWithUnappliedRules([]);
    },
  });

  useEffect(() => {
    if (!data?.portfolioV2?.discoveredContents) return;

    setContentsWithUnappliedRules(data.portfolioV2.discoveredContents);

    const initialSelectedRules: Record<number, SelectedRule> = {};
    data.portfolioV2.discoveredContents.forEach((content) => {
      const appliedContentRule = content.contentRules?.find((rule) => rule.isApplied);
      let contentRuleToSet = appliedContentRule;
      if (!appliedContentRule && content.contentRules?.length === 1) {
        contentRuleToSet = content.contentRules[0];
      }

      const appliedImpactGroupRule = content.impactGroupRules?.find((rule) => rule.isApplied);
      let impactGroupRuleToSet = appliedImpactGroupRule;
      if (!appliedImpactGroupRule && content.impactGroupRules?.length === 1) {
        impactGroupRuleToSet = content.impactGroupRules[0];
      }

      if (contentRuleToSet || impactGroupRuleToSet) {
        initialSelectedRules[content.discoveredContentId] = {
          contentRuleId: contentRuleToSet?.contentRule?.contentRuleId?.toString() ?? null,
          impactGroupRuleId: impactGroupRuleToSet?.impactGroupRule?.impactGroupRuleId?.toString() ?? null,
        };
      }
    });

    resetSelectedRules();
    Object.entries(initialSelectedRules).forEach(([contentId, rules]) => {
      if (rules.contentRuleId) {
        setSelectedRules(Number(contentId), 'contentRuleId', rules.contentRuleId);
      }
      if (rules.impactGroupRuleId) {
        setSelectedRules(Number(contentId), 'impactGroupRuleId', rules.impactGroupRuleId);
      }
    });
  }, [data?.portfolioV2?.discoveredContents]);

  const handleApplyRules = async () => {
    const discoveredContentsWithRulesToApply = Object.entries(selectedContentRules).map(([contentId, rules]) => ({
      discoveredContentId: parseInt(contentId, 10),
      contentRuleId: toNumber(rules.contentRuleId),
      impactGroupRuleId: toNumber(rules.impactGroupRuleId),
      attributionRuleId: toNumber(rules.attributionRuleId),
    }));

    await applyRulesToDiscoveredContents({
      variables: {
        discoveredContentsWithRulesToApply,
        portfolioId,
        teamId,
      },
    }).then(() => {
      closeApproveDialog();
      refreshCountDiscoveredContents();
    });
  };

  return (
    <div>
      <div className="mb-6 flex justify-between">
        <div>
          <Typography style={{ color: nexyColors.neutral900 }} variant="h3">
            Unapplied rules
          </Typography>
          <Typography style={{ color: nexyColors.neutral400, marginTop: 8 }} variant="paragraph">
            Assign content rule metrics, impact group rules, and attribution rules to portfolio contents.
          </Typography>
        </div>
        <Button
          className="h-fit"
          onClick={openApproveDialog}
          disabled={Object.keys(selectedContentRules).length === 0}
          color="primary"
          variant="contained"
        >
          Apply selected rules
        </Button>
      </div>

      {/* Table Container */}
      {loading ? (
        <Spinner />
      ) : contentsWithUnappliedRules.length ? (
        <div className="rounded-lg border border-neutral-100">
          <div className="grid grid-cols-[1fr_0.5fr_0.5fr] px-6 py-3 font-medium text-neutral-600">
            <LabelLight className="!mb-0 px-0 font-semibold !text-neutral-500">Content name</LabelLight>
            <LabelLight className="!mb-0 px-2 font-semibold !text-neutral-500">Content rule metrics</LabelLight>
            <LabelLight className="!mb-0 px-2 font-semibold !text-neutral-500">
              {portfolioMeta.isAttributed ? 'Attribution rules' : 'Impact group rules'}
            </LabelLight>
          </div>

          {/* Table Rows */}
          <div className="max-h-full overflow-x-scroll">
            {contentsWithUnappliedRules.map((dsc) => {
              const contentId = dsc?.discoveredContentId;
              const selectedMetric = selectedContentRules[contentId]?.contentRuleId ?? '';
              const selectedImpactGroup = selectedContentRules[contentId]?.impactGroupRuleId ?? '';
              const selectedAttribution = selectedContentRules[contentId]?.attributionRuleId ?? '';

              const selectedContentRule = dsc?.contentRules?.find(
                (cr) => cr.contentRule?.contentRuleId === toNumber(selectedMetric),
              )?.contentRule;
              const selectedImpactGroupRule = dsc?.impactGroupRules?.find(
                (igr) => igr.impactGroupRule?.impactGroupRuleId === toNumber(selectedImpactGroup),
              )?.impactGroupRule;

              const selectedAttributionRule = dsc?.attributionRules?.find(
                (igr) => igr.attributionRule?.attributionRuleId === toNumber(selectedAttribution),
              )?.attributionRule;

              return (
                <div key={contentId} className="grid grid-cols-[1fr_0.5fr_0.5fr] border-t border-neutral-100 px-6 py-4">
                  {/* Content Name */}
                  <div className="flex items-center text-neutral-900">
                    <ContentHoverCard
                      content={dsc.content}
                      tooltipClassName="max-w-sm truncate overflow-ellipsis"
                      tooltip={<span>{dsc?.content?.title}</span>}
                    />
                  </div>

                  {/* Select for Content Rule Metrics */}
                  <div>
                    <Select
                      disabled={!dsc?.contentRules?.length}
                      onValueChange={(value) => setSelectedRules(contentId, 'contentRuleId', value)}
                      value={selectedMetric || undefined}
                    >
                      <SelectTrigger className="w-56 border-none bg-transparent p-2">
                        <PortfolioRuleHoverCard
                          rule={selectedContentRule}
                          tooltip={<SelectValue placeholder="Select content rule metrics" />}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {dsc?.contentRules?.map((acr) => (
                          <SelectItem
                            key={acr?.contentRule?.contentRuleId}
                            value={acr?.contentRule?.contentRuleId?.toString()}
                          >
                            <div className="max-w-48 truncate">{acr?.contentRule?.name}</div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {portfolioMeta.isAttributed ? (
                    <div>
                      <Select
                        disabled={!dsc?.attributionRules?.length}
                        onValueChange={(value) => setSelectedRules(contentId, 'attributionRuleId', value)}
                        value={selectedAttribution || undefined}
                      >
                        <SelectTrigger className="w-56 border-none bg-transparent p-2">
                          <PortfolioRuleHoverCard
                            rule={selectedAttributionRule}
                            tooltip={<SelectValue placeholder="Select attribution rule" />}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {dsc?.attributionRules?.map((aigr) => (
                            <SelectItem
                              key={aigr?.attributionRule?.attributionRuleId}
                              value={aigr?.attributionRule?.attributionRuleId?.toString()}
                            >
                              <div className="max-w-48 truncate">{aigr?.attributionRule?.name}</div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ) : (
                    <div>
                      <Select
                        disabled={!dsc?.impactGroupRules?.length}
                        onValueChange={(value) => setSelectedRules(contentId, 'impactGroupRuleId', value)}
                        value={selectedImpactGroup || undefined}
                      >
                        <SelectTrigger className="w-56 border-none bg-transparent p-2">
                          <PortfolioRuleHoverCard
                            rule={selectedImpactGroupRule}
                            tooltip={<SelectValue placeholder="Select impact group rule" />}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {dsc?.impactGroupRules?.map((aigr) => (
                            <SelectItem
                              key={aigr?.impactGroupRule?.impactGroupRuleId}
                              value={aigr?.impactGroupRule?.impactGroupRuleId?.toString()}
                            >
                              <div className="max-w-48 truncate">{aigr?.impactGroupRule?.name}</div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <NoDataFound
          style={{ height: 200 }}
          title="You don't have any unapplied rules"
          subtitle="You will see them appear here once we detect a new content with unapplied rules"
        />
      )}
      <ConfirmationDialog
        titleText="Apply rules to contents"
        ctaText="Apply rules"
        description={`${Object.keys(selectedContentRules).length} rules will be applied. You can always change them back later.`}
        onConfirm={handleApplyRules}
        type="apply"
        disabled={loadingApply}
        loading={loadingApply}
        isOpen={isApproveOpen}
        onCancel={closeApproveDialog}
      />
    </div>
  );
};
