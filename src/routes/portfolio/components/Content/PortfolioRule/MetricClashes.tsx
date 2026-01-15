import React, { useEffect } from 'react';
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
import SvgCheckCircle from 'components/icons/CheckCircle';
import { LabelLight } from 'components/InputLabel/styles';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'components-ui/Select';
import { useRuleClashStore } from 'store/metric-clashes';
import { 
  NexoyaDiscoveredContent,
  NexoyaApplicableAttributionRule,
  NexoyaAttributionRule,
} from '../../../../../types';
import SvgWarningTwo from '../../../../../components/icons/WarningTwo';
import ContentHoverCard from '../../../../../components/HoverCard/ContentHoverCard';
import PortfolioRuleHoverCard from '../../../../../components/HoverCard';

// Type guards
const isAttributionRule = (rule: any): rule is NexoyaAttributionRule => 'attributionRuleId' in rule;

interface GenericClashesDialogProps<T> {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  loading: boolean;
  // Functions to extract the list of rules, a rule's ID, and a rule's display name
  getRules: (dsc: NexoyaDiscoveredContent) => Array<T | null> | undefined;
  getRuleId: (rule: T) => string;
  getRuleName: (rule: T) => string;
  // Customizable text
  dialogTitle: string;
  type: 'content rule' | 'impact group rule' | 'attribution rule';
}

export const MetricClashesDialog = <T,>({
  isOpen,
  onCancel,
  onConfirm,
  loading,
  getRules,
  getRuleId,
  getRuleName,
  dialogTitle,
  type,
}: GenericClashesDialogProps<T>) => {
  const { clashingDiscoveredContents, selectedRules, setSelectedRule } = useRuleClashStore();

  const propertyKey = type === 'content rule' ? 'contentRule' : type === 'impact group rule' ? 'impactGroupRule' : 'attributionRule';
  const isContentRule = type === 'content rule';
  const isAttributionRuleType = type === 'attribution rule';

  // Pre-select single matched rules
  useEffect(() => {
    clashingDiscoveredContents.forEach((dsc) => {
      const discoveredContentId = dsc.discoveredContentId;
      const rules = getRules(dsc) || [];
      // @ts-ignore
      const appliedRules = rules.filter((rule) => rule?.isApplied);

      // If there's exactly one applied rule and no selection has been made yet
      if (appliedRules.length === 1 && !selectedRules[discoveredContentId]) {
        setSelectedRule(discoveredContentId, getRuleId(appliedRules[0]));
      }
    });
  }, [clashingDiscoveredContents, getRules, getRuleId, selectedRules, setSelectedRule]);

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className="min-w-[920px]">
        <AlertDialogHeader className="space-y-3">
          <AlertDialogTitle className="mb-4">{dialogTitle}</AlertDialogTitle>
          <AlertDialogDescription>
            <div className="mb-3 flex items-center gap-2 rounded-md border border-neutral-100 bg-neutral-50 p-3">
              <SvgCheckCircle className="h-4 w-4 text-green-400" />
              <span className="text-sm font-normal leading-5 text-neutral-800">
                Your metrics have been successfully applied to all matching contents, apart from the contents below.
              </span>
            </div>
            <div className="mb-3 flex flex-col rounded-md border border-neutral-100 bg-neutral-50 p-3">
              <div className="flex gap-2">
                <SvgWarningTwo warningCircleColor="#FCF1BA" warningColor="#F5CF0F" style={{ height: 20, width: 20 }} />
                <span className="text-md leading-5 text-neutral-800">
                  The contents below match with multiple {type}s
                </span>
              </div>
              <span className="ml-7 font-normal leading-5 text-neutral-700">
                Select the {type} that should apply to each content.
              </span>
            </div>
          </AlertDialogDescription>
          <div className="rounded-lg border border-neutral-100 bg-neutral-50">
            <div className="grid grid-cols-3 items-center px-6 py-3 font-medium text-neutral-600">
              <LabelLight className="!mb-0 px-0 font-semibold !text-neutral-500">Content name</LabelLight>
              <LabelLight className="!mb-0 px-0 font-semibold !text-neutral-500">Matched with {type}</LabelLight>
              <LabelLight className="!mb-0 justify-self-end px-0 font-semibold !text-neutral-500">{type}</LabelLight>
            </div>
            <div className="max-h-96 overflow-x-scroll">
              {clashingDiscoveredContents.map((dsc) => {
                const discoveredContentId = dsc.discoveredContentId;
                const selectedRule = selectedRules[discoveredContentId]?.ruleId || '';

                const rules = getRules(dsc) || [];

                return (
                  <div key={discoveredContentId} className="grid grid-cols-3 border-t border-neutral-100 px-6 py-4">
                    <div className="flex max-w-44 items-center truncate overflow-ellipsis text-neutral-900">
                      <ContentHoverCard
                        content={dsc.content}
                        tooltip={<span className="max-w-screen-sm truncate">{dsc?.content?.title}</span>}
                      />
                    </div>
                    <div className="flex items-center text-neutral-900">
                      {rules
                        // @ts-ignore
                        .filter((rule) => rule.isApplied)
                        .map((rule, idx) => (
                          <PortfolioRuleHoverCard
                            key={idx}
                            rule={rule[propertyKey]}
                            tooltip={<span>{getRuleName(rule)}</span>}
                          />
                        ))}
                    </div>
                    <div className="flex w-full justify-end">
                      <Select
                        value={selectedRule || undefined}
                        onValueChange={(value) => setSelectedRule(discoveredContentId, value)}
                      >
                        <SelectTrigger className="w-56 justify-end self-end border-none bg-transparent p-2">
                          <SelectValue placeholder={`Select ${type}`} />
                        </SelectTrigger>
                        <SelectContent>
                          {rules.map((rule) => (
                            <SelectItem key={getRuleId(rule)} value={getRuleId(rule)}>
                              {getRuleName(rule)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
              {isContentRule ? 'Select metrics later' : isAttributionRuleType ? 'Select assignments later' : 'Select assignments later'}
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
              {isContentRule ? 'Apply selected rules' : isAttributionRuleType ? 'Apply selected assignments' : 'Apply selected assignments'}
            </ButtonAsync>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
