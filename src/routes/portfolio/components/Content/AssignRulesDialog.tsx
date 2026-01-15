import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from 'components-ui/AlertDialog';
import React, { useState } from 'react';
import { LabelLight } from '../../../../components/InputLabel/styles';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components-ui/Select';
import ButtonAsync from '../../../../components/ButtonAsync';
import { NexoyaDiscoveredContent } from '../../../../types';
import SvgWarningTwo from '../../../../components/icons/WarningTwo';
import { toast } from 'sonner';
import usePortfolioMetaStore from '../../../../store/portfolio-meta';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  discoveredContent: NexoyaDiscoveredContent;
  onConfirm: (rules: { contentRuleId: number; impactGroupRuleId?: number; attributionRuleId?: number }) => Promise<void>;
  loading: boolean;
}

export const AssignRulesDialog = ({ isOpen, onClose, discoveredContent, onConfirm, loading }: Props) => {
  const [selectedContentRule, setSelectedContentRule] = useState(null);
  const [selectedImpactRule, setSelectedImpactRule] = useState(null);
  const [selectedAttributionRule, setSelectedAttributionRule] = useState(null);
  const [showConfirmPartial, setShowConfirmPartial] = useState(false);
  const { portfolioMeta } = usePortfolioMetaStore();
  
  const isAttributed = portfolioMeta?.isAttributed;

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
      toast.success('Selected rules successfully applied to content');
    } catch (error) {
      console.error('Error applying rules:', error);
    } finally {
      const hasSecondaryRule = isAttributed ? selectedAttributionRule : selectedImpactRule;
      
      if (selectedContentRule && !hasSecondaryRule) {
        setShowConfirmPartial(true);
      } else {
        onClose();
        setSelectedContentRule(null);
        setSelectedImpactRule(null);
        setSelectedAttributionRule(null);
        setShowConfirmPartial(false);
      }
    }
  };

  const renderPartialConfirmContent = () => (
    <>
      <AlertDialogHeader>
        <AlertDialogTitle>Content rule successfully applied to content</AlertDialogTitle>

        <div className="!mt-6 mb-3 flex flex-col rounded-md border border-neutral-100 bg-neutral-50 p-3">
          <div className="flex gap-2">
            <SvgWarningTwo warningCircleColor="#FCF1BA" warningColor="#F5CF0F" style={{ height: 20, width: 20 }} />
            <span className="text-md leading-5 text-neutral-800">
              {isAttributed ? 'Attribution rule not assigned' : 'Impact group not assigned'}
            </span>
          </div>
          <span className="ml-7 font-normal leading-5 text-neutral-700">
            The current {isAttributed ? 'attribution rule' : 'impact group rule'} has been removed from this content. You can reassign rules in{' '}
            <span className="font-medium">Portfolio settings {'>'} Unapplied rules.</span>
          </span>
        </div>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogAction className="w-full">
          <ButtonAsync
            className="!w-full"
            onClick={() => onClose()}
            variant="contained"
            color="primary"
            size="small"
            loading={loading}
          >
            Got it
          </ButtonAsync>
        </AlertDialogAction>
      </AlertDialogFooter>
    </>
  );

  const renderMainContent = () => (
    <>
      <AlertDialogHeader>
        <AlertDialogTitle>Assign rules to content</AlertDialogTitle>
        <AlertDialogDescription>
          <span className="font-normal text-neutral-400">
            Assign a content rule and {isAttributed ? 'an attribution rule' : 'an impact group rule'} to this content. These rules will override its existing
            metrics and {isAttributed ? 'attribution' : 'impact group'}.
          </span>
          <div className="mb-[-24px] mt-6 flex flex-col rounded-md border border-neutral-100 bg-neutral-50 p-3">
            <div className="flex gap-2">
              <div>
                <SvgWarningTwo warningCircleColor="#FCF1BA" warningColor="#F5CF0F" style={{ height: 24, width: 24 }} />
              </div>
              <span className="text-md font-light leading-5 text-neutral-600">
                Your selection below, including unselected rules, will override the existing content configuration.
                You'll be able to reassign unselected rules later in{' '}
                <span className="font-medium">Portfolio settings {'>'} Unapplied rules</span>
              </span>
            </div>
          </div>
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
              <SelectValue placeholder="Select content rule metrics" />
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
                <SelectValue placeholder="Select attribution rule" />
              </SelectTrigger>
              <SelectContent>
                {discoveredContent?.attributionRules?.map((ar) => (
                  <SelectItem
                    key={ar.attributionRule.attributionRuleId}
                    value={ar.attributionRule.attributionRuleId.toString()}
                  >
                    {ar.attributionRule.name}
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
                <SelectValue placeholder="Select impact group rule" />
              </SelectTrigger>
              <SelectContent>
                {discoveredContent?.impactGroupRules?.map((igr) => (
                  <SelectItem
                    key={igr.impactGroupRule.impactGroupRuleId}
                    value={igr.impactGroupRule.impactGroupRuleId.toString()}
                  >
                    {igr.impactGroupRule.name}
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
            disabled={loading || !selectedContentRule}
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
    </>
  );

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className="min-w-[600px]">
        {showConfirmPartial ? renderPartialConfirmContent() : renderMainContent()}
      </AlertDialogContent>
    </AlertDialog>
  );
};
