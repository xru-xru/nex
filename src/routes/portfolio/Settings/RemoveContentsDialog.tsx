import React, { Dispatch, SetStateAction } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../../components-ui/AlertDialog';
import ButtonAsync from '../../../components/ButtonAsync';
import { LabelLight } from '../../../components/InputLabel/styles';
import { NexoyaAttributionRule, NexoyaContentRule, NexoyaImpactGroupRule } from '../../../types';
import SvgWarningTwo from '../../../components/icons/WarningTwo';
import Checkbox from '../../../components/Checkbox';
import ContentHoverCard from 'components/HoverCard/ContentHoverCard';
import PortfolioRuleHoverCard from '../../../components/HoverCard';

type NexoyaRule = NexoyaContentRule | NexoyaImpactGroupRule | NexoyaAttributionRule;

const isContentRule = (rule: NexoyaRule): rule is NexoyaContentRule => 'contentRuleId' in rule;

interface Props {
  isOpen: boolean;
  loading: boolean;
  onCancel: () => void;
  onConfirm: (rule: NexoyaRule) => void;
  rule: NexoyaRule;
  contentsToBeRemoved: number[];
  setContentsToBeRemoved: Dispatch<SetStateAction<number[]>>;
}

export const RemoveContentsDialog = ({
  isOpen,
  onCancel,
  onConfirm,
  loading,
  rule,
  contentsToBeRemoved,
  setContentsToBeRemoved,
}: Props) => {
  const contents = rule.appliedDiscoveredContents;

  const getContentToBeRemoved = (contentId: number) => {
    return contentsToBeRemoved.find((contentIdToBeRemoved) => contentIdToBeRemoved === contentId);
  };

  const handleCheckContent = (contentId: number) => {
    const contentIdToBeRemoved = getContentToBeRemoved(contentId);
    if (!contentIdToBeRemoved) {
      setContentsToBeRemoved((prev) => [...prev, contentId]);
    } else {
      setContentsToBeRemoved((prev) => prev.filter((contentIdToBeRemoved) => contentIdToBeRemoved !== contentId));
    }
  };

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className="min-w-[720px]">
        <AlertDialogHeader className="space-y-3">
          <AlertDialogTitle>Remove contents from portfolio?</AlertDialogTitle>
        </AlertDialogHeader>
        <div>
          <div className="mb-5 flex items-start gap-2 rounded-md border border-neutral-100 bg-neutral-50 p-3">
            <div>
              <SvgWarningTwo warningCircleColor="#FCF1BA" warningColor="#F5CF0F" style={{ height: 24, width: 24 }} />
            </div>
            <span className="text-sm font-normal leading-5 text-neutral-800">
              Unchecked contents under “Keep in Portfolio” will be removed from the portfolio, losing their optimization
              status and rule assignments, including metrics. You’ll be able to add back and manage the content in
              <span className="font-medium">Content {'>'} Removed Contents.</span>
            </span>
          </div>
          {contents?.length ? (
            <div className="rounded-lg border border-neutral-100 bg-neutral-50">
              {/* Table Header */}
              <div className="grid grid-cols-3 items-center px-6 py-3 font-medium text-neutral-600">
                <LabelLight className="!mb-0 px-0 font-semibold !text-neutral-500">Content name</LabelLight>
                <LabelLight className="!mb-0 font-semibold !text-neutral-500">Metric assignment</LabelLight>
                <LabelLight className="!mb-0 !flex justify-center px-2 font-semibold !text-neutral-500">
                  Keep in portfolio
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
                        : discoveredContent?.impactGroupRules?.map(({ impactGroupRule }) => (
                            <PortfolioRuleHoverCard
                              key={impactGroupRule?.impactGroupRuleId}
                              rule={impactGroupRule}
                              tooltip={
                                <span
                                  className={
                                    // @ts-ignore
                                    impactGroupRule.impactGroupRuleId === rule.impactGroupRuleId
                                      ? 'text-red-400'
                                      : 'text-neutral-900'
                                  }
                                >
                                  {impactGroupRule.name}
                                </span>
                              }
                            />
                          ))}
                    </div>

                    {/* Select for Metric Assignment */}
                    <div className="flex items-center justify-center">
                      <Checkbox
                        className="!pl-0 !font-normal"
                        checked={!getContentToBeRemoved(discoveredContent?.content?.contentId)}
                        onChange={() => handleCheckContent(discoveredContent?.content?.contentId)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
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
              disabled={loading || contentsToBeRemoved.length === 0}
              onClick={() => onConfirm(rule)}
              variant="contained"
              color="danger"
              size="small"
            >
              Yes, remove unchecked contents
            </ButtonAsync>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
