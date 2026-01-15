import React, { Dispatch, SetStateAction, useEffect } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from 'components-ui/AlertDialog';
import ButtonAsync from 'components/ButtonAsync';
import { LabelLight } from 'components/InputLabel/styles';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'components-ui/Select';
import {
  NexoyaApplicableAttributionRule,
  NexoyaApplicableContentRule,
  NexoyaApplicableImpactGroupRule,
  NexoyaAttributionRule,
  NexoyaContentRule,
  NexoyaDiscoveredContent,
  NexoyaImpactGroupRule,
  NexoyaUpdateAttributionRuleFiltersContentActionInput,
  NexoyaUpdateContentRuleFiltersContentActionInput,
  NexoyaUpdateImpactGroupRuleFiltersContentActionInput,
} from '../../../../../types';
import SvgWarningTwo from '../../../../../components/icons/WarningTwo';
import SvgInfoCircle from '../../../../../components/icons/InfoCircle';
import { Separator } from '../../../../../components-ui/Separator';
import { cn } from '../../../../../lib/utils';
import PortfolioRuleHoverCard from '../../../../../components/HoverCard';
import ContentHoverCard from '../../../../../components/HoverCard/ContentHoverCard';

enum MatchStatus {
  NEW = 'NEW',
  NO_MATCH = 'NO_MATCH',
}

const isContentRule = (rule): rule is NexoyaContentRule => 'contentRuleId' in rule;
const isImpactGroupRule = (rule): rule is NexoyaImpactGroupRule => 'impactGroupRuleId' in rule;
const isAttributionRule = (rule): rule is NexoyaAttributionRule => 'attributionRuleId' in rule;

const getColorBasedOnMatchStatus = (status: MatchStatus) => {
  switch (status) {
    case MatchStatus.NEW:
      return 'bg-[#88E7B7]';
    case MatchStatus.NO_MATCH:
      return 'bg-red-200';
    default:
      return '';
  }
};

interface NexoyaDiscoveredContentWithStatus extends NexoyaDiscoveredContent {
  matchStatus?: { status: MatchStatus; text: string };
}

interface Props<T> {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  loading: boolean;
  // Functions to extract the list of rules, a rule's ID, and a rule's display name
  getRules: (dsc: NexoyaDiscoveredContent) => Array<T | null> | undefined;
  getRuleName: (rule: T) => string;
  type: string; // 'content rule' | 'impact group rule' | 'attribution rule';
  newMatchingDiscoveredContents: NexoyaDiscoveredContent[];
  noLongerMatchingDiscoveredContents: NexoyaDiscoveredContent[];
  contentActions:
    | NexoyaUpdateContentRuleFiltersContentActionInput[]
    | NexoyaUpdateImpactGroupRuleFiltersContentActionInput[]
    | NexoyaUpdateAttributionRuleFiltersContentActionInput[];
  setContentActions: Dispatch<
    SetStateAction<
      | NexoyaUpdateContentRuleFiltersContentActionInput[]
      | NexoyaUpdateImpactGroupRuleFiltersContentActionInput[]
      | NexoyaUpdateAttributionRuleFiltersContentActionInput[]
    >
  >;
  rule: NexoyaContentRule | NexoyaImpactGroupRule | NexoyaAttributionRule;
}

export const PreviewEditDialog = <T,>({
  newMatchingDiscoveredContents,
  noLongerMatchingDiscoveredContents,
  isOpen,
  onCancel,
  onConfirm,
  loading,
  getRules,
  getRuleName,
  type,
  setContentActions,
  contentActions,
  rule,
}: Props<T>) => {
  const mergedDiscoveredContents = [
    ...newMatchingDiscoveredContents.map((dsc) => ({
      ...dsc,
      matchStatus: { status: MatchStatus.NEW, text: 'New match' },
    })),
    ...noLongerMatchingDiscoveredContents.map((dsc) => ({
      ...dsc,
      matchStatus: { status: MatchStatus.NO_MATCH, text: 'No longer a match' },
    })),
  ];

  const getSelectedUserChoice = (contentId: number) => {
    const propertyKey = isContentRule(rule)
      ? 'applyContentRuleId'
      : isImpactGroupRule(rule)
        ? 'applyImpactGroupRuleId'
        : 'applyAttributionRuleId';
    // @ts-ignore
    return contentActions.find((choice) => choice.contentId === contentId)?.[propertyKey];
  };

  const handleUserChoiceChange = (contentId: number, newValue: string) => {
    setContentActions((prevChoices) => {
      const index = prevChoices.findIndex((choice) => choice.contentId === contentId);
      let updatedChoice;
      if (isContentRule(rule)) {
        // For content rules:
        // - 'keep_current': keep current assignment (no removal, no new assignment)
        // - 'remove_current': remove current assignment (set removal flag)
        // - Otherwise, treat newValue as new rule id to apply
        updatedChoice =
          newValue === 'keep_current'
            ? { contentId, removeFromPortfolio: false }
            : newValue === 'remove_current'
              ? { contentId, removeFromPortfolio: true }
              : {
                  contentId,
                  removeFromPortfolio: false,
                  applyContentRuleId: Number(newValue),
                };
      } else if (isImpactGroupRule(rule)) {
        // For impact group rules:
        updatedChoice =
          newValue === 'keep_current'
            ? { contentId, removeImpactGroupAssignment: false }
            : newValue === 'remove_current'
              ? { contentId, removeImpactGroupAssignment: true }
              : {
                  contentId,
                  removeImpactGroupAssignment: false,
                  applyImpactGroupRuleId: Number(newValue),
                };
      } else {
        // For attribution rules:
        updatedChoice =
          newValue === 'remove_current'
            ? { contentId }
            : {
                contentId,
                applyAttributionRuleId: Number(newValue),
              };
      }
      if (index > -1) {
        return prevChoices.map((choice, idx) => (idx === index ? updatedChoice : choice));
      }

      return [...prevChoices, updatedChoice];
    });
  };

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className="min-w-[1580px]">
        <AlertDialogHeader className="space-y-3">
          <AlertDialogTitle className="mb-4">Review and apply changes</AlertDialogTitle>
          <AlertDialogDescription>
            <div className="mb-3 flex flex-col rounded-md border border-neutral-100 bg-neutral-50 p-3">
              <div className="flex gap-2">
                <SvgWarningTwo warningCircleColor="#FCF1BA" warningColor="#F5CF0F" style={{ height: 20, width: 20 }} />
                <span className="text-md leading-5 text-neutral-800">
                  Select metric assignments for certain contents
                </span>
              </div>
              <span className="ml-7 font-normal leading-5 text-neutral-700">
                The updated filters match {newMatchingDiscoveredContents.length} new contents and no longer match{' '}
                {noLongerMatchingDiscoveredContents?.length} contents. Select an assignment for these contents required.
              </span>
            </div>
            <div className="mb-3 flex flex-col rounded-md border border-neutral-100 bg-neutral-50 p-3">
              <div>
                <SvgInfoCircle style={{ height: 20, width: 20 }} />
                <span className="ml-2 font-normal leading-5 text-neutral-700">
                  Contents already in your portfolio will remain unchanged. Any contents without a metric assignment
                  from a content rule can be managed in{' '}
                  <span className="font-semibold">Portfolio Settings {'>'} Unapplied Rules</span>.
                </span>
              </div>
            </div>
          </AlertDialogDescription>
          <div className="rounded-lg border border-neutral-100 bg-neutral-50">
            <div
              className={cn(
                'grid items-center px-6 py-3 font-medium text-neutral-600',
                isAttributionRule(rule) ? 'grid-cols-5' : 'grid-cols-6',
              )}
            >
              <LabelLight className="!mb-0 px-0 font-semibold !text-neutral-500">Content name</LabelLight>
              <LabelLight className="!mb-0 px-0 font-semibold !text-neutral-500">Status</LabelLight>
              <LabelLight className="!mb-0 px-0 font-semibold !text-neutral-500">In portfolio?</LabelLight>
              {!isAttributionRule(rule) ? (
                <LabelLight className="!mb-0 px-0 font-semibold !text-neutral-500">Previous match</LabelLight>
              ) : null}
              <LabelLight className="!mb-0 px-0 font-semibold !text-neutral-500">Matched with {type}</LabelLight>
              <LabelLight className="!mb-0 justify-self-end px-0 font-semibold !text-neutral-500">{type}</LabelLight>
            </div>
            <div className="max-h-96 overflow-x-scroll">
              {mergedDiscoveredContents.map((dsc) => {
                const contentId = dsc.content?.contentId;
                // @ts-ignore
                const rules:
                  | NexoyaApplicableContentRule[]
                  // add attribution rule here
                  | NexoyaApplicableImpactGroupRule[] = getRules(dsc) || [];
                // @ts-ignore
                const previouslyAppliedRules = rules.filter((rule) => rule.isApplied);

                return (
                  <div
                    key={`${dsc.matchStatus?.status}-${contentId}-${dsc.content?.portfolioContentId || 'new'}`}
                    className={cn(
                      'grid items-center border-t border-neutral-100 px-6 py-4',
                      isAttributionRule(rule) ? 'grid-cols-5' : 'grid-cols-6',
                    )}
                  >
                    <ContentHoverCard
                      content={dsc?.content}
                      tooltipClassName="max-w-52 truncate overflow-ellipsis"
                      tooltip={<span className="text-neutral-900">{dsc.content?.title}</span>}
                    />

                    <div
                      className={cn(
                        'flex h-fit w-full max-w-44 items-center justify-center rounded-full px-2 py-0.5 text-neutral-900',
                        getColorBasedOnMatchStatus(dsc.matchStatus?.status),
                      )}
                    >
                      {dsc.matchStatus?.text}
                    </div>
                    <div className="flex items-center text-neutral-900">
                      {dsc.content?.portfolioContentId ? 'Yes' : 'No'}
                    </div>
                    {!isAttributionRule(rule) ? (
                      <div
                        className={cn(
                          'flex items-center',
                          previouslyAppliedRules.length ? 'text-neutral-900' : 'text-neutral-300',
                        )}
                      >
                        {previouslyAppliedRules.length
                          ? previouslyAppliedRules.map((rule, idx) => {
                              let portfolioRule: any = null;
                              if ((rule as any).__typename === 'ApplicableContentRule')
                                portfolioRule = (rule as any).contentRule;
                              else if ((rule as any).__typename === 'ApplicableImpactGroupRule')
                                portfolioRule = (rule as any).impactGroupRule;
                              else if ((rule as any).__typename === 'ApplicableAttributionRule')
                                portfolioRule = (rule as any).attributionRule;
                              return portfolioRule ? (
                                <PortfolioRuleHoverCard
                                  key={idx}
                                  rule={portfolioRule}
                                  tooltip={
                                    <span className="block max-w-44 truncate overflow-ellipsis whitespace-nowrap">
                                      {getRuleName(rule as any)}
                                    </span>
                                  }
                                />
                              ) : null;
                            })
                          : 'No metrics'}
                      </div>
                    ) : null}
                    <div
                      className={cn(
                        'flex flex-wrap items-center gap-3',
                        rules?.length ? 'text-neutral-900' : 'text-neutral-300',
                      )}
                    >
                      {rules.length
                        ? rules.map((rule, idx) => {
                            let portfolioRule: any = null;
                            if ((rule as any).__typename === 'ApplicableContentRule')
                              portfolioRule = (rule as any).contentRule;
                            else if ((rule as any).__typename === 'ApplicableImpactGroupRule')
                              portfolioRule = (rule as any).impactGroupRule;
                            else if ((rule as any).__typename === 'ApplicableAttributionRule')
                              portfolioRule = (rule as any).attributionRule;
                            return portfolioRule ? (
                              <PortfolioRuleHoverCard
                                key={idx}
                                rule={portfolioRule}
                                tooltip={
                                  <span className="block max-w-44 truncate overflow-ellipsis whitespace-nowrap">
                                    {getRuleName(rule as any)}
                                  </span>
                                }
                              />
                            ) : null;
                          })
                        : `No ${type}s`}
                    </div>
                    <div className="flex w-full justify-end">
                      <ContentRuleSelect
                        dsc={dsc}
                        rule={rule}
                        handleUserChoiceChange={handleUserChoiceChange}
                        getSelectedUserChoice={getSelectedUserChoice}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction>
            <ButtonAsync
              disabled={loading}
              loading={loading}
              onClick={onCancel}
              variant="contained"
              color="secondary"
              size="small"
            >
              Cancel
            </ButtonAsync>
          </AlertDialogAction>
          <AlertDialogAction>
            <ButtonAsync
              disabled={loading}
              loading={loading}
              onClick={onConfirm}
              variant="contained"
              color="primary"
              size="small"
            >
              Apply selection and confirm changes
            </ButtonAsync>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const ContentRuleSelect = ({
  dsc,
  rule,
  handleUserChoiceChange,
  getSelectedUserChoice,
}: {
  dsc: NexoyaDiscoveredContentWithStatus;
  rule: NexoyaContentRule | NexoyaImpactGroupRule | NexoyaAttributionRule;
  handleUserChoiceChange: (contentId: number, newValue: string) => void;
  getSelectedUserChoice: (contentId: number) => string;
}) => {
  const contentId = dsc.content?.contentId;
  const allRules = isContentRule(rule)
    ? dsc?.contentRules
    : isImpactGroupRule(rule)
      ? dsc?.impactGroupRules
      : dsc?.attributionRules;
  const [hasAutoSelected, setHasAutoSelected] = React.useState(false);

  // Create an appropriate new rule object based on the current rule type
  const createNewRuleObj = () => {
    if (isContentRule(rule)) {
      return {
        __typename: 'ApplicableContentRule',
        contentRule: rule,
        isApplied: false,
      } as NexoyaApplicableContentRule;
    } else if (isImpactGroupRule(rule)) {
      return {
        __typename: 'ApplicableImpactGroupRule',
        impactGroupRule: rule,
        isApplied: false,
      } as NexoyaApplicableImpactGroupRule;
    } else {
      return { __typename: 'ApplicableAttributionRule', attributionRule: rule, isApplied: false } as any; // Use proper type if available
    }
  };

  // Get rules based on match status, properly typed for each rule type
  const getRulesByMatchStatus = () => {
    if (dsc.matchStatus?.status === MatchStatus.NEW) {
      return [...(allRules || []), createNewRuleObj()];
    } else if (dsc.matchStatus?.status === MatchStatus.NO_MATCH) {
      // Type guard to ensure proper filtering based on rule type
      if (isContentRule(rule) && dsc?.contentRules) {
        return dsc.contentRules.filter((r) => !r.isApplied);
      } else if (isImpactGroupRule(rule) && dsc?.impactGroupRules) {
        return dsc.impactGroupRules.filter((r) => !r.isApplied);
      } else if (dsc?.attributionRules) {
        return dsc.attributionRules.filter((r) => !r.isApplied);
      }
      return [];
    }
    return allRules || [];
  };

  const rules = getRulesByMatchStatus();

  // Create type-safe function to extract ID
  const getRuleId = (
    rule: NexoyaApplicableContentRule | NexoyaApplicableImpactGroupRule | NexoyaApplicableAttributionRule,
  ) => {
    if (rule.__typename === 'ApplicableContentRule' && rule.contentRule) {
      return rule.contentRule.contentRuleId;
    } else if (rule.__typename === 'ApplicableImpactGroupRule' && rule.impactGroupRule) {
      return rule.impactGroupRule.impactGroupRuleId;
    } else if (rule.__typename === 'ApplicableAttributionRule' && rule.attributionRule) {
      return rule.attributionRule.attributionRuleId;
    }
    return null;
  };

  // Deduplicate rules based on their IDs
  const uniqueRules = rules
    ? Array.from(
        new Map(
          rules.map((r) => {
            const id = getRuleId(r);
            return [id, r];
          }),
        ).values(),
      )
    : [];

  const selectedUserChoice = getSelectedUserChoice(contentId)?.toString();

  // Type-safe function to get rule name
  const getRuleName = (rule: any) => {
    if (rule.__typename === 'ApplicableContentRule' && rule.contentRule) {
      return rule.contentRule.name;
    } else if (rule.__typename === 'ApplicableImpactGroupRule' && rule.impactGroupRule) {
      return rule.impactGroupRule.name;
    } else if (rule.__typename === 'ApplicableAttributionRule' && rule.attributionRule) {
      return rule.attributionRule.name;
    }
    return '';
  };

  // Pre-select the rule if there is only one rule possible
  useEffect(() => {
    if (uniqueRules?.length === 1 && !selectedUserChoice && !hasAutoSelected) {
      const id = getRuleId(uniqueRules[0])?.toString();
      if (id) {
        handleUserChoiceChange(contentId, id);
        setHasAutoSelected(true);
      }
    } else {
      // For impact group/attribution rules, set default to 'remove_current' if no choice yet made
      if (!selectedUserChoice && !hasAutoSelected) {
        handleUserChoiceChange(contentId, 'remove_current');
        setHasAutoSelected(true);
      }
    }
  }, [uniqueRules, contentId, handleUserChoiceChange, selectedUserChoice, hasAutoSelected]);

  // Function to get rule type prefix for key generation
  const getRuleTypePrefix = (rule: any) => {
    if (rule.__typename === 'ApplicableContentRule') return 'content';
    if (rule.__typename === 'ApplicableImpactGroupRule') return 'impact';
    return 'attribution';
  };

  return (
    <Select onValueChange={(value) => handleUserChoiceChange(contentId, value)} value={selectedUserChoice || undefined}>
      <SelectTrigger data-testid={`select-content-rule-${contentId}`} className="border-none bg-transparent p-2">
        <SelectValue placeholder="Select" />
      </SelectTrigger>
      <SelectContent className="rounded-lg text-white shadow-md">
        {dsc.matchStatus?.status !== MatchStatus.NEW && (
          <>
            {!isAttributionRule(rule) ? (
              <SelectItem value="remove_current">
                <div className="flex flex-col items-start justify-start">
                  <span className="text-md whitespace-pre text-red-400">Remove from portfolio</span>
                  <span className="text-[10px] font-medium text-neutral-400">WILL GO INTO REMOVED CONTENT</span>
                </div>
              </SelectItem>
            ) : null}
            <SelectItem value="keep_current">
              <div className="flex flex-col items-start justify-start">
                <span className="text-md whitespace-pre">Remove previous assignment</span>
                <span className="text-[10px] font-medium text-neutral-400">WILL GO INTO UNAPPLIED RULES</span>
              </div>
            </SelectItem>
            {uniqueRules?.length ? <Separator className="my-2 bg-neutral-600" /> : null}
          </>
        )}
        {uniqueRules?.map((r, idx) => {
          const id = getRuleId(r)?.toString();
          const name = getRuleName(r);
          const typePrefix = getRuleTypePrefix(r);

          return id ? (
            <SelectItem key={`${typePrefix}-${id}-${idx}`} value={id} className="text-left text-mdlg">
              {name}
            </SelectItem>
          ) : null;
        })}
      </SelectContent>
    </Select>
  );
};
