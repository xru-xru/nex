import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from 'components-ui/AlertDialog';
import React, { useEffect, useState } from 'react';
import { LabelLight } from '../../../../components/InputLabel/styles';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components-ui/Select';
import ButtonAsync from '../../../../components/ButtonAsync';
import { NexoyaDiscoveredContent } from '../../../../types';
import usePortfolioMetaStore from '../../../../store/portfolio-meta';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  discoveredContent: NexoyaDiscoveredContent;
  onConfirm: (rules: { contentRuleId: number; impactGroupRuleId?: number; attributionRuleId?: number }) => Promise<void>;
  loading: boolean;
}

export const ChangeRulesDialog = ({ isOpen, onClose, discoveredContent, onConfirm, loading }: Props) => {
  const { portfolioMeta } = usePortfolioMetaStore();
  const isAttributed = portfolioMeta?.isAttributed;
  
  const initialContentRule = discoveredContent?.contentRules
    ?.find((rule) => rule.isApplied)
    ?.contentRule?.contentRuleId?.toString();
  const initialImpactRule = discoveredContent?.impactGroupRules
    ?.find((rule) => rule.isApplied)
    ?.impactGroupRule?.impactGroupRuleId?.toString();
  const initialAttributionRule = discoveredContent?.attributionRules
    ?.find((rule) => rule.isApplied)
    ?.attributionRule?.attributionRuleId?.toString();

  const [selectedContentRule, setSelectedContentRule] = useState(initialContentRule ?? '');
  const [selectedImpactRule, setSelectedImpactRule] = useState(initialImpactRule ?? '');
  const [selectedAttributionRule, setSelectedAttributionRule] = useState(initialAttributionRule ?? '');

  const hasContentRuleChange = selectedContentRule && selectedContentRule !== initialContentRule;
  const hasImpactRuleChange = selectedImpactRule && selectedImpactRule !== initialImpactRule;
  const hasAttributionRuleChange = selectedAttributionRule && selectedAttributionRule !== initialAttributionRule;
  const hasChanges = hasContentRuleChange || hasImpactRuleChange || hasAttributionRuleChange;

  const handleConfirm = async () => {
    try {
      const rules: { contentRuleId: number; impactGroupRuleId?: number; attributionRuleId?: number } = {
        contentRuleId: parseInt(selectedContentRule),
      };
      
      if (isAttributed && selectedAttributionRule) {
        rules.attributionRuleId = parseInt(selectedAttributionRule);
      } else if (!isAttributed && selectedImpactRule) {
        rules.impactGroupRuleId = parseInt(selectedImpactRule);
      }
      
      await onConfirm(rules);
    } catch (error) {
      console.error('Error applying rules:', error);
    }
  };

  useEffect(() => {
    setSelectedContentRule(initialContentRule ?? '');
    setSelectedImpactRule(initialImpactRule ?? '');
    setSelectedAttributionRule(initialAttributionRule ?? '');
  }, [initialContentRule, initialImpactRule, initialAttributionRule]);

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Change content rules</AlertDialogTitle>
          <AlertDialogDescription>
            <span className="font-normal text-neutral-400">Select different rules to assign to this content.</span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex flex-col gap-4 py-4">
          <div className="flex flex-col gap-2">
            <LabelLight className="!mb-0 px-0 font-semibold">Content rule metrics</LabelLight>
            <Select
              disabled={!discoveredContent?.contentRules?.length || loading}
              value={selectedContentRule || undefined}
              onValueChange={setSelectedContentRule}
            >
              <SelectTrigger className="w-full border-neutral-100 bg-transparent p-2">
                <SelectValue placeholder={selectedContentRule ? 'Select content rule metrics' : ''} />
              </SelectTrigger>
              <SelectContent>
                {discoveredContent?.contentRules?.map((cr) => (
                  <SelectItem key={cr.contentRule.contentRuleId} value={cr.contentRule?.contentRuleId?.toString()}>
                    {cr.contentRule.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isAttributed ? (
            <div className="flex flex-col gap-2">
              <LabelLight className="!mb-0 px-0 font-semibold">Attribution rule</LabelLight>
              <Select
                disabled={!discoveredContent?.attributionRules?.length || loading}
                value={selectedAttributionRule || undefined}
                onValueChange={setSelectedAttributionRule}
              >
                <SelectTrigger className="w-full border-neutral-100 bg-transparent p-2">
                  <SelectValue placeholder={selectedAttributionRule ? 'Select attribution rule' : ''} />
                </SelectTrigger>
                <SelectContent>
                  {discoveredContent?.attributionRules?.map((ar) => (
                    <SelectItem
                      key={ar.attributionRule?.attributionRuleId}
                      value={ar?.attributionRule?.attributionRuleId?.toString()}
                    >
                      {ar?.attributionRule?.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <LabelLight className="!mb-0 px-0 font-semibold">Impact group rule</LabelLight>
              <Select
                disabled={!discoveredContent?.impactGroupRules?.length || loading}
                value={selectedImpactRule || undefined}
                onValueChange={setSelectedImpactRule}
              >
                <SelectTrigger className="w-full border-neutral-100 bg-transparent p-2">
                  <SelectValue placeholder={selectedImpactRule ? 'Select impact group rule' : ''} />
                </SelectTrigger>
                <SelectContent>
                  {discoveredContent?.impactGroupRules?.map((igr) => (
                    <SelectItem
                      key={igr.impactGroupRule?.impactGroupRuleId}
                      value={igr?.impactGroupRule?.impactGroupRuleId?.toString()}
                    >
                      {igr?.impactGroupRule?.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <AlertDialogFooter>
          <AlertDialogAction>
            <ButtonAsync disabled={loading} onClick={onClose} variant="contained" color="secondary" size="small">
              Cancel
            </ButtonAsync>
          </AlertDialogAction>
          <AlertDialogAction>
            <ButtonAsync
              disabled={loading || !hasChanges}
              onClick={handleConfirm}
              loading={loading}
              variant="contained"
              color="primary"
              size="small"
            >
              Apply rules to content
            </ButtonAsync>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
