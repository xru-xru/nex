import React, { useState } from 'react';
import { get } from 'lodash';

import { NexoyaDiscoveredContentStatus, NexoyaPortfolioParentContent } from 'types';
import { useAddManyContentRelationsMutation } from '../../../../graphql/portfolio/mutationUpdateContentRelation';
import { KpisFilterProvider2 } from 'context/KpisFilterProvider';

import { copyToClipboard } from 'utils/helpers';
import { Button } from '../../../../components-ui/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../../components-ui/DropdownMenu';
import SvgEllipsisV from '../../../../components/icons/EllipsisV';
import ErrorMessage from '../../../../components/ErrorMessage';
import { ContentManageBudgetDialog } from '../ContentManageBudgetDialog';
import LinkPortfolioContentDialog from '../LinkPortfolioContentDialog';
import { ContentOptimizationDialog } from './ContentOptimizationDialog';
import ContentRemoveDialog from './ContentRemoveDialog';
import { useApplyRulesToDiscoveredContentsMutation } from '../../../../graphql/portfolioRules/mutationApplyRulesToDiscoveredContents';
import { toast } from 'sonner';
import { ChangeRulesDialog } from './ChangeRulesDialog';
import { useTeam } from '../../../../context/TeamProvider';
import PortfolioFeatureSwitch from '../../../../components/PortfolioFeatureSwitch';
import { PORTFOLIO_FEATURE_FLAGS } from '../../../../constants/featureFlags';
import { AssignRulesDialog } from './AssignRulesDialog';
import { updateApolloCache, updatePortfolioParentContentDiscoveredContentCache } from '../../../../utils/cache';
import { PORTFOLIO_PARENT_CONTENTS_QUERY } from '../../../../graphql/content/queryPortfolioContents';
import { buildPortfolioContentFilterVariables } from '../../utils/content';
import { useContentFilterStore } from '../../../../store/content-filter';
import { useSwitchManualContentsToRuleBasedMutation } from '../../../../graphql/portfolioRules/mutationSwitchManaulContentsToRuleBased';

type Props = {
  parentContent: NexoyaPortfolioParentContent;
  portfolioId: number;
  disabled?: boolean;
};

function ContentTableRowTDM({ parentContent, portfolioId, disabled }: Props) {
  const { teamId } = useTeam();

  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isOptimizationDialogOpen, setOptimizationDialogOpen] = useState(false);
  const [isBudgetDialogOpen, setBudgetDialogOpen] = useState(false);
  const [isSidePanelOpen, setSidePanelOpen] = useState(false);
  const [contentId, setContentId] = useState<string>();
  const [isChangeRulesOpen, setChangeRulesOpen] = useState(false);
  const [isAssignRulesOpen, setAssignRulesOpen] = useState(false);

  const filterStore = useContentFilterStore();

  const [addManyContentRelations, { loading, error }] = useAddManyContentRelationsMutation({
    portfolioId,
    contentRelations: [
      {
        contentId: +contentId,
        belongsToContentId: parentContent?.content?.contentId,
      },
    ],
  });

  const [applyRulesToDiscoveredContents, { loading: loadingApplyRules }] = useApplyRulesToDiscoveredContentsMutation({
    portfolioId,
    status: NexoyaDiscoveredContentStatus.AcceptedButHasUnappliedRules,
  });

  const [switchManualContentsToRuleBasedMutation, { loading: loadingSwitchContentsToRuleBased }] =
    useSwitchManualContentsToRuleBasedMutation({
      portfolioId,
      status: NexoyaDiscoveredContentStatus.AcceptedButHasUnappliedRules,
    });

  const handleChangeRules = async ({ contentRuleId, impactGroupRuleId, attributionRuleId }) => {
    try {
      if (parentContent?.discoveredContent?.status === NexoyaDiscoveredContentStatus.Manual) {
        await switchManualContentsToRuleBasedMutation({
          variables: {
            discoveredContentsWithRulesToApply: [
              {
                discoveredContentId: parentContent.discoveredContent?.discoveredContentId,
                contentRuleId,
                impactGroupRuleId,
                attributionRuleId,
              },
            ],
            portfolioId,
            teamId,
          },
        });
      } else {
        await applyRulesToDiscoveredContents({
          variables: {
            discoveredContentsWithRulesToApply: [
              {
                discoveredContentId: parentContent.discoveredContent?.discoveredContentId,
                contentRuleId,
                impactGroupRuleId,
                attributionRuleId,
              },
            ],
            portfolioId,
            teamId,
          },
        });
      }

      if (parentContent.discoveredContent?.status === NexoyaDiscoveredContentStatus.Manual) {
        updateApolloCache({
          query: PORTFOLIO_PARENT_CONTENTS_QUERY,
          variables: buildPortfolioContentFilterVariables(teamId, portfolioId, filterStore),
          updateFn: updatePortfolioParentContentDiscoveredContentCache({
            portfolioContentId: parentContent?.portfolioContentId,
            status: NexoyaDiscoveredContentStatus.Accepted,
          }),
        });
      }
      setChangeRulesOpen(false);
    } catch (error) {
      console.error('Error changing rules:', error);
      toast.error('Failed to change rules');
    }
  };

  async function handleSubmit() {
    try {
      const res = await addManyContentRelations();
      const success = get(res, 'data.addManyContentRelations', false);
      if (success) {
        setSidePanelOpen(false);
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger disabled={disabled} asChild>
        <Button className="rounded-full" variant="ghost" size="sm">
          <SvgEllipsisV style={{ fontSize: 18 }} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-52 font-normal" align="start">
        <DropdownMenuItem onSelect={() => setSidePanelOpen(true)}>Link to</DropdownMenuItem>
        <DropdownMenuItem onSelect={() => copyToClipboard(parentContent?.content?.contentId?.toString())}>
          Copy ID
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => setBudgetDialogOpen(true)}>Manage budget limit</DropdownMenuItem>
        <>
          <PortfolioFeatureSwitch
            features={[PORTFOLIO_FEATURE_FLAGS.SELF_SERVICE_PORTFOLIO]}
            renderOld={() => null}
            renderNew={() => (
              <>
                <DropdownMenuSeparator />

                {parentContent.discoveredContent?.status !== NexoyaDiscoveredContentStatus.Manual && (
                  <DropdownMenuItem onSelect={() => setChangeRulesOpen(true)}>Change rules</DropdownMenuItem>
                )}
                {parentContent.discoveredContent?.status === NexoyaDiscoveredContentStatus.Manual && (
                  <DropdownMenuItem onSelect={() => setAssignRulesOpen(true)}>Switch to rule-based</DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
              </>
            )}
          />
        </>
        <DropdownMenuItem onSelect={() => setOptimizationDialogOpen(true)}>
          {parentContent.isIncludedInOptimization ? 'Disable' : 'Enable'} optimization
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => setDeleteDialogOpen(true)} className="text-red-400">
          Remove from Portfolio
        </DropdownMenuItem>
      </DropdownMenuContent>

      <KpisFilterProvider2>
        {isSidePanelOpen && (
          <LinkPortfolioContentDialog
            isOpen={isSidePanelOpen}
            loading={loading}
            parentId={parentContent?.content?.contentId}
            contentId={contentId}
            setContentId={setContentId}
            onSubmit={handleSubmit}
            onClose={() => setSidePanelOpen(false)}
          />
        )}

        {error && <ErrorMessage error={error} />}
      </KpisFilterProvider2>

      {isDeleteDialogOpen && (
        <ContentRemoveDialog
          isOpen={isDeleteDialogOpen}
          toggleDialog={() => setDeleteDialogOpen(false)}
          parentContents={[parentContent]}
        />
      )}

      {isOptimizationDialogOpen && (
        <ContentOptimizationDialog
          isOpen={isOptimizationDialogOpen}
          toggleDialog={() => setOptimizationDialogOpen(false)}
          parentContents={[parentContent]}
        />
      )}

      {isBudgetDialogOpen && (
        <ContentManageBudgetDialog
          isOpen={isBudgetDialogOpen}
          toggleDialog={() => setBudgetDialogOpen(false)}
          parentContent={parentContent}
        />
      )}
      {isChangeRulesOpen && (
        <ChangeRulesDialog
          isOpen={isChangeRulesOpen}
          onClose={() => setChangeRulesOpen(false)}
          discoveredContent={parentContent?.discoveredContent}
          onConfirm={handleChangeRules}
          loading={loadingApplyRules || loadingSwitchContentsToRuleBased}
        />
      )}
      {isAssignRulesOpen && (
        <AssignRulesDialog
          isOpen={isAssignRulesOpen}
          onClose={() => setAssignRulesOpen(false)}
          discoveredContent={parentContent?.discoveredContent}
          onConfirm={handleChangeRules}
          loading={loadingApplyRules || loadingSwitchContentsToRuleBased}
        />
      )}
    </DropdownMenu>
  );
}

export default ContentTableRowTDM;
