import React, { Dispatch, SetStateAction, useEffect } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../../components-ui/AlertDialog';
import ButtonAsync from '../../../components/ButtonAsync';
import Link2 from '../../../components/icons/Link2';
import { LabelLight } from '../../../components/InputLabel/styles';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components-ui/Select';
import {
  NexoyaAttributionRule,
  NexoyaContentRule,
  NexoyaDeleteAttributionRuleContentActionInput,
  NexoyaDeleteContentRuleContentActionInput,
  NexoyaDeleteImpactGroupRuleContentActionInput,
  NexoyaDiscoveredContent,
  NexoyaImpactGroupRule,
} from '../../../types';
import { Separator } from '../../../components-ui/Separator';
import ContentHoverCard from '../../../components/HoverCard/ContentHoverCard';
import PortfolioRuleHoverCard from '../../../components/HoverCard';

type NexoyaRule = NexoyaContentRule | NexoyaImpactGroupRule | NexoyaAttributionRule;

const isContentRule = (rule: NexoyaRule): rule is NexoyaContentRule => 'contentRuleId' in rule;
const isImpactGroupRule = (rule: NexoyaRule): rule is NexoyaImpactGroupRule => 'impactGroupRuleId' in rule;
const isAttributionRule = (rule: NexoyaRule): rule is NexoyaAttributionRule => 'attributionRuleId' in rule;

interface Props {
  isOpen: boolean;
  loading: boolean;
  onCancel: () => void;
  onConfirm: (rule: NexoyaRule) => void;
  rule: NexoyaRule;
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
}

export const DeleteRuleDialog = ({
  isOpen,
  onCancel,
  onConfirm,
  loading,
  rule,
  contentActions,
  setContentActions,
}: Props) => {
  const contents = rule.appliedDiscoveredContents;

  useEffect(() => {
    if (!contents?.length) return;

    if (isAttributionRule(rule)) {
      setContentActions(
        contents.map((discoveredContent) => ({ discoveredContentId: discoveredContent?.discoveredContentId })),
      );
    } else if (isContentRule(rule)) {
      setContentActions(
        contents.map((discoveredContent) => ({
          discoveredContentId: discoveredContent?.discoveredContentId,
          removeFromPortfolio: true,
        })),
      );
    } else if (isImpactGroupRule(rule)) {
      setContentActions(
        contents.map((discoveredContent) => ({
          discoveredContentId: discoveredContent?.discoveredContentId,
          removeImpactGroupAssignment: true,
        })),
      );
    }
  }, [contents, rule, setContentActions]);

  const hasAnyOtherRules = (discoveredContent: NexoyaDiscoveredContent) => {
    if (isContentRule(rule)) {
      return discoveredContent.contentRules.some(
        ({ contentRule }) => contentRule?.contentRuleId !== rule.contentRuleId,
      );
    }
    if (isImpactGroupRule(rule)) {
      return discoveredContent.impactGroupRules.some(
        ({ impactGroupRule }) => impactGroupRule?.impactGroupRuleId !== rule.impactGroupRuleId,
      );
    }
    return discoveredContent.attributionRules?.some(
      ({ attributionRule }) => attributionRule?.attributionRuleId !== rule.attributionRuleId,
    );
  };

  const getSelectedUserChoice = (discoveredContentId: number) => {
    // @ts-ignore
    const choice = contentActions.find((c) => c.discoveredContentId === discoveredContentId);
    if (!choice) return undefined;

    if (isContentRule(rule)) {
      const contentChoice = choice as NexoyaDeleteContentRuleContentActionInput;
      if (contentChoice.removeFromPortfolio) return 'remove_content';
      if (contentChoice.applyContentRuleId) return contentChoice.applyContentRuleId.toString();
      return 'keep_current';
    } else if (isImpactGroupRule(rule)) {
      const impactChoice = choice as NexoyaDeleteImpactGroupRuleContentActionInput;
      if (impactChoice.removeImpactGroupAssignment) return 'remove_content';
      if (impactChoice.applyImpactGroupRuleId) return impactChoice.applyImpactGroupRuleId.toString();
      return 'keep_current';
    } else {
      const attributionChoice = choice as NexoyaDeleteAttributionRuleContentActionInput;
      if (attributionChoice.applyAttributionRuleId) return attributionChoice.applyAttributionRuleId.toString();
      return 'remove_current';
    }
  };

  const handleUserChoiceChange = (discoveredContentId: number, newValue: string) => {
    setContentActions((prevChoices) => {
      const index = prevChoices.findIndex((choice) => choice.discoveredContentId === discoveredContentId);
      let updatedChoice;
      if (isContentRule(rule)) {
        // For content rules:
        // • 'keep_current' means keep the current assignment (no removal, no new assignment)
        // • 'remove_content' means remove the current assignment (set removal flag)
        // • otherwise, treat the value as the new rule id to apply
        updatedChoice =
          newValue === 'keep_current'
            ? { discoveredContentId, removeFromPortfolio: false }
            : newValue === 'remove_content'
              ? { discoveredContentId, removeFromPortfolio: true }
              : {
                  discoveredContentId,
                  removeFromPortfolio: false,
                  applyContentRuleId: Number(newValue),
                };
      } else if (isImpactGroupRule(rule)) {
        // For impact group rules:
        updatedChoice =
          newValue === 'keep_current'
            ? { discoveredContentId, removeImpactGroupAssignment: false }
            : newValue === 'remove_content'
              ? { discoveredContentId, removeImpactGroupAssignment: true }
              : {
                  discoveredContentId,
                  removeImpactGroupAssignment: false,
                  applyImpactGroupRuleId: Number(newValue),
                };
      } else {
        // For attribution rules:
        updatedChoice =
          newValue === 'remove_current'
            ? { discoveredContentId }
            : {
                discoveredContentId,
                applyAttributionRuleId: Number(newValue),
              };
      }
      // If there's an existing entry for this discoveredContent, update it.
      if (index > -1) {
        return prevChoices.map((choice, idx) => (idx === index ? updatedChoice : choice));
      }
      // Otherwise, add a new entry.
      return [...prevChoices, updatedChoice];
    });
  };

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className={contents?.length ? 'min-w-[920px]' : ''}>
        <AlertDialogHeader className="space-y-3">
          <AlertDialogTitle>
            Delete{' '}
            {isContentRule(rule) ? 'content rule' : isImpactGroupRule(rule) ? 'impact group rule' : 'attribution rule'}
          </AlertDialogTitle>
        </AlertDialogHeader>

        {contents?.length ? (
          <div>
            <div className="mb-3 flex gap-2 rounded-md border border-neutral-100 bg-neutral-50 p-3">
              <Link2 className="h-5 w-5 text-green-400" />
              <div className="flex flex-col">
                <span className="text-md leading-5 text-neutral-800">
                  The assignment from this rule is applied to the contents below.
                </span>
                <span className="text-xs font-normal leading-5 text-neutral-700">
                  To delete this rule, select the assignments for the relevant contents.
                </span>
              </div>
            </div>
            <div className="rounded-lg border border-neutral-100 bg-neutral-50">
              {/* Table Header */}
              <div className="grid grid-cols-3 items-center px-6 py-3 font-medium text-neutral-600">
                <LabelLight className="!mb-0 px-0 font-semibold !text-neutral-500">Content name</LabelLight>
                <LabelLight className="!mb-0 px-2 font-semibold !text-neutral-500">
                  {isContentRule(rule)
                    ? 'Match with content rules'
                    : isImpactGroupRule(rule)
                      ? 'Match with impact group rules'
                      : 'Match with attribution rules'}
                </LabelLight>
                <LabelLight className="!mb-0 px-2 font-semibold !text-neutral-500">
                  {isContentRule(rule)
                    ? 'Metric assignment'
                    : isImpactGroupRule(rule)
                      ? 'Impact group'
                      : 'Attribution assignment'}
                </LabelLight>
              </div>

              <div className="max-h-96 overflow-x-scroll">
                {/* Table Rows */}
                {contents?.map((discoveredContent) => (
                  <div
                    key={discoveredContent.content.contentId}
                    className="grid grid-cols-3 border-t border-neutral-100 px-6 py-4"
                  >
                    {/* Content Name */}
                    <ContentHoverCard
                      content={discoveredContent?.content}
                      tooltip={
                        <div className="max-w-48 truncate text-neutral-900">{discoveredContent.content?.title}</div>
                      }
                    />

                    {/* Matched Rules Column */}
                    <div className="flex gap-2">
                      {isContentRule(rule)
                        ? discoveredContent?.contentRules?.map(({ contentRule }) => (
                            <PortfolioRuleHoverCard
                              key={contentRule?.contentRuleId}
                              rule={contentRule}
                              tooltip={
                                <span
                                  className={
                                    contentRule?.contentRuleId === rule.contentRuleId
                                      ? 'text-red-300'
                                      : 'text-neutral-900'
                                  }
                                >
                                  {contentRule?.name}
                                </span>
                              }
                            />
                          ))
                        : isImpactGroupRule(rule)
                          ? discoveredContent?.impactGroupRules?.map(({ impactGroupRule }) => (
                              <PortfolioRuleHoverCard
                                key={impactGroupRule?.impactGroupRuleId}
                                rule={impactGroupRule}
                                tooltip={
                                  <span
                                    className={
                                      impactGroupRule.impactGroupRuleId === rule.impactGroupRuleId
                                        ? 'text-red-400'
                                        : 'text-neutral-900'
                                    }
                                  >
                                    {impactGroupRule.name}
                                  </span>
                                }
                              />
                            ))
                          : discoveredContent?.attributionRules?.map(({ attributionRule }) => (
                              <PortfolioRuleHoverCard
                                key={attributionRule?.attributionRuleId}
                                rule={attributionRule}
                                tooltip={
                                  <span
                                    className={
                                      attributionRule.attributionRuleId === rule.attributionRuleId
                                        ? 'text-red-400'
                                        : 'text-neutral-900'
                                    }
                                  >
                                    {attributionRule.name}
                                  </span>
                                }
                              />
                            ))}
                    </div>

                    {/* Select for Metric Assignment */}
                    <div>
                      <Select
                        defaultValue="remove_content"
                        onValueChange={(value) => handleUserChoiceChange(discoveredContent.discoveredContentId, value)}
                        value={getSelectedUserChoice(discoveredContent.discoveredContentId) || undefined}
                      >
                        <SelectTrigger className="border-none bg-transparent p-2">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        {/* Select Options */}
                        <SelectContent className="rounded-lg text-white shadow-md">
                          {!isAttributionRule(rule) ? (
                            <SelectItem value="keep_current">
                              <div className="flex flex-col items-start justify-start">
                                <span className="text-md">Keep current configuration</span>
                                <span className="text-[10px] font-medium text-neutral-400">
                                  WILL GO INTO UNAPPLIED RULES
                                </span>
                              </div>
                            </SelectItem>
                          ) : null}

                          <SelectItem value={isAttributionRule(rule) ? 'remove_current' : 'remove_content'}>
                            <div className="flex flex-col items-start justify-start">
                              <span className="text-md">
                                {isContentRule(rule)
                                  ? 'Remove content from portfolio'
                                  : isImpactGroupRule(rule)
                                    ? 'Remove impact group assignment'
                                    : 'Remove attribution assignment'}
                              </span>

                              <span className="text-[10px] font-medium text-neutral-400">
                                {isContentRule(rule)
                                  ? 'WILL GO INTO REMOVED CONTENTS'
                                  : isImpactGroupRule(rule)
                                    ? 'WILL REMOVE IMPACT GROUP ASSIGNMENT'
                                    : null}
                              </span>
                            </div>
                          </SelectItem>
                          {hasAnyOtherRules(discoveredContent) ? <Separator className="my-2 bg-neutral-600" /> : null}
                          {isContentRule(rule)
                            ? discoveredContent?.contentRules
                                ?.filter(({ contentRule }) => contentRule?.contentRuleId !== rule.contentRuleId)
                                .map(({ contentRule }) => (
                                  <SelectItem
                                    key={contentRule?.contentRuleId}
                                    value={contentRule?.contentRuleId?.toString()}
                                    className="text-left text-mdlg"
                                  >
                                    {contentRule?.name}
                                  </SelectItem>
                                ))
                            : isImpactGroupRule(rule)
                              ? discoveredContent?.impactGroupRules
                                  ?.filter(
                                    ({ impactGroupRule }) =>
                                      impactGroupRule?.impactGroupRuleId !== rule.impactGroupRuleId,
                                  )
                                  .map(({ impactGroupRule }) => (
                                    <SelectItem
                                      key={impactGroupRule?.impactGroupRuleId}
                                      value={impactGroupRule.impactGroupRuleId.toString()}
                                      className="text-left text-mdlg"
                                    >
                                      {impactGroupRule?.name}
                                    </SelectItem>
                                  ))
                              : discoveredContent?.attributionRules
                                  ?.filter(
                                    ({ attributionRule }) =>
                                      attributionRule?.attributionRuleId !== rule.attributionRuleId,
                                  )
                                  .map(({ attributionRule }) => (
                                    <SelectItem
                                      key={attributionRule?.attributionRuleId}
                                      value={attributionRule.attributionRuleId.toString()}
                                      className="text-left text-mdlg"
                                    >
                                      {attributionRule?.name}
                                    </SelectItem>
                                  ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-md mt-[-16px] font-normal text-neutral-500">
            Deleting this rule will not affect any content, as it is not applied to any content.
          </div>
        )}
        <AlertDialogFooter>
          <AlertDialogAction>
            <ButtonAsync
              loading={loading}
              disabled={loading}
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
              loading={loading}
              disabled={loading || contentActions.length !== contents?.length}
              onClick={() => onConfirm(rule)}
              variant="contained"
              color="danger"
              size="small"
            >
              {contents?.length
                ? `Apply selection and delete ${
                    isContentRule(rule)
                      ? 'content rule'
                      : isImpactGroupRule(rule)
                        ? 'impact group rule'
                        : 'attribution rule'
                  }`
                : 'Delete rule'}
            </ButtonAsync>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
