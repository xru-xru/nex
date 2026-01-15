import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../../components-ui/AlertDialog';
import ButtonAsync from '../../../components/ButtonAsync';
import SvgCheckCircle from '../../../components/icons/CheckCircle';
import { LabelLight } from '../../../components/InputLabel/styles';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components-ui/Select';
import { useDiscoverContentsStore } from '../../../store/discovered-contents';
import { NexoyaDiscoveredContent } from '../../../types';

interface Props {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  loading: boolean;
  acceptedDiscoveredContents: NexoyaDiscoveredContent[];
}

export const ApplyContentRules = ({ isOpen, onCancel, onConfirm, loading, acceptedDiscoveredContents }: Props) => {
  const { selectedDiscoveredContentRules: selectedRules, setSelectedDiscoveredContentRules: setSelectedRules } =
    useDiscoverContentsStore();

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className="min-w-[920px]">
        <AlertDialogHeader className="space-y-3">
          <AlertDialogTitle>Apply rules to contents</AlertDialogTitle>
          <AlertDialogDescription>
            <div className="mb-3 flex items-center gap-2 rounded-md border border-neutral-100 bg-neutral-50 p-3">
              <SvgCheckCircle className="h-4 w-4 text-green-400" />
              <span className="text-sm leading-5 text-neutral-800">
                {acceptedDiscoveredContents.length} matching contents have been added to your portfolio.
              </span>
            </div>
          </AlertDialogDescription>
          <div className="rounded-lg border border-neutral-100 bg-neutral-50">
            {/* Table Header */}
            <div className="grid grid-cols-3 items-center px-6 py-3 font-medium text-neutral-600">
              <LabelLight className="!mb-0 px-0 font-semibold !text-neutral-500">Content name</LabelLight>
              <LabelLight className="!mb-0 px-2 font-semibold !text-neutral-500">Content rule metrics</LabelLight>
              <LabelLight className="!mb-0 px-2 font-semibold !text-neutral-500">Impact group rule</LabelLight>
            </div>

            {/* Table Rows */}
            <div className="max-h-96 overflow-x-scroll">
              {acceptedDiscoveredContents.map((adc) => (
                <div key={adc?.content?.contentId} className="grid grid-cols-3 border-t border-neutral-100 px-6 py-4">
                  {/* Content Name */}
                  <div className="max-w-44 truncate overflow-ellipsis text-neutral-900">{adc?.content?.title}</div>

                  {/* Select for Content Rule Metrics */}
                  <div>
                    <Select
                      value={selectedRules[adc?.content?.contentId]?.contentRuleId || ''}
                      onValueChange={(value) => setSelectedRules(adc?.content?.contentId, 'contentRuleId', value)}
                    >
                      <SelectTrigger className="w-56 border-none bg-transparent p-2">
                        <SelectValue placeholder="Select content rule metrics" />
                      </SelectTrigger>
                      <SelectContent>
                        {adc?.contentRules?.map((rule) => (
                          <SelectItem
                            key={rule.contentRule.contentRuleId}
                            value={rule.contentRule.contentRuleId?.toString()}
                          >
                            {rule.contentRule.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Select for Impact Group Rules */}
                  <div>
                    <Select
                      value={selectedRules[adc?.content?.contentId]?.impactGroupRuleId || ''}
                      onValueChange={(value) => setSelectedRules(adc?.content?.contentId, 'impactGroupRuleId', value)}
                    >
                      <SelectTrigger className="w-56 border-none bg-transparent p-2">
                        <SelectValue placeholder="Select impact group rule" />
                      </SelectTrigger>
                      <SelectContent>
                        {adc?.impactGroupRules?.map((rule) => (
                          <SelectItem
                            key={rule.impactGroupRule.impactGroupRuleId}
                            value={rule.impactGroupRule.impactGroupRuleId?.toString()}
                          >
                            {rule.impactGroupRule.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
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
              Select rules later
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
              Apply selected rules
            </ButtonAsync>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
