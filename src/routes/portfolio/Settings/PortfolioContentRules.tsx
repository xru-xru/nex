import React, { useEffect, useState } from 'react';
import { useContentRuleQuery } from '../../../graphql/portfolioRules/queryContentRules';
import { useRouteMatch } from 'react-router';
import NoDataFound from '../NoDataFound';
import Typography from '../../../components/Typography';
import { nexyColors } from '../../../theme';
import Button from '../../../components/Button';
import { useSidePanelState } from '../../../components/SidePanel';
import CreateOrUpdatePortfolioRule from '../components/Content/PortfolioRule/CreateOrUpdatePortfolioRule';
import { usePortfolio } from '../../../context/PortfolioProvider';
import { useFunnelStepsV2Query } from '../../../graphql/funnelSteps/queryFunnelSteps';
import { NexoyaContentRule, NexoyaDeleteContentRuleContentActionInput, NexoyaDiscoveredContent } from '../../../types';
import Spinner from '../../../components/Spinner';
import { useCreateContentRuleMutation } from '../../../graphql/portfolioRules/mutationCreateContentRule';
import { PortfolioRuleCard } from './PortfolioRuleCard';
import { useDeleteContentRuleMutation } from '../../../graphql/portfolioRules/mutationDeleteContentRule';
import { useTeam } from '../../../context/TeamProvider';
import { useContentRuleUpdatePreviewQuery } from '../../../graphql/portfolioRules/queryPreviewUpdateContentRule';
import { useDialogState } from '../../../components/Dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../../components-ui/AlertDialog';
import SvgCheckCircle from '../../../components/icons/CheckCircle';
import { LabelLight } from '../../../components/InputLabel/styles';
import ButtonAsync from '../../../components/ButtonAsync';
import SvgWarningTwo from '../../../components/icons/WarningTwo';
import { useProviderRuleStore } from '../../../store/provider-rules';
import { useContentRulesStore } from '../../../store/content-rules';
import { useUpdateContentRuleFiltersMutation } from '../../../graphql/portfolioRules/mutationUpdateContentRuleFilters';

const ContentRules = () => {
  const match = useRouteMatch();
  const { teamId } = useTeam();
  const portfolioId = parseInt(match.params.portfolioID, 10);
  const { setContentRules: setContentRulesInStore } = useContentRulesStore();
  const { data: contentRulesData, loading } = useContentRuleQuery({
    portfolioId,
    onCompleted: (data) => setContentRulesInStore(data?.portfolioV2?.contentRules),
  });
  const contentRules = contentRulesData?.portfolioV2?.contentRules;
  const [funnelSteps, setFunnelSteps] = useState([]);
  const [contentRuleToEdit, setContentRuleToEdit] = useState<NexoyaContentRule>(null);
  const [createdDiscoveredContents, setCreatedDiscoveredContents] = useState<NexoyaDiscoveredContent[]>([]);
  const [latestCreatedContentRule, setLatestCreatedContentRule] = useState<NexoyaContentRule>(null);

  const {
    selectedFunnelStep: { setSelectedFunnelStep },
  } = usePortfolio();
  const { setProviderMapSelection } = useProviderRuleStore();

  const {
    isOpen: isOpenCreateContentRule,
    toggleSidePanel: toggleCreateContentRuleSidepanel,
    closeSidePanel: closeCreateContentRuleSidepanel,
  } = useSidePanelState();
  const {
    isOpen: isOpenAssignMetrics,
    toggleSidePanel: toggleAssignMetricsSidepanel,
    closeSidePanel: closeAssignMetricsSidepanel,
  } = useSidePanelState();

  const {
    isOpen: isOpenAssignRulesDialog,
    toggleDialog: toggleAssignRulesDialog,
    closeDialog: closeAssignRulesDialog,
  } = useDialogState();

  const [previewUpdateContentRule, { loading: loadingPreviewUpdate }] = useContentRuleUpdatePreviewQuery();
  const [deleteContentRule, { loading: loadingDelete }] = useDeleteContentRuleMutation({ portfolioId });
  const [updateContentRule, { loading: loadingUpdate }] = useUpdateContentRuleFiltersMutation({
    portfolioId,
    onCompleted: () => {
      closeContentRuleSidepanel();
    },
  });
  const [createContentRule, { loading: loadingCreate }] = useCreateContentRuleMutation({
    portfolioId,
    onCompleted: (data) => {
      if (data?.createContentRule?.contentRule) {
        setCreatedDiscoveredContents(data?.createContentRule?.discoveredContents);
        setLatestCreatedContentRule(data?.createContentRule?.contentRule);
        setProviderMapSelection({});
        closeContentRuleSidepanel();
        toggleAssignRulesDialog();
      }
    },
  });

  const [contentActions, setContentActions] = useState<NexoyaDeleteContentRuleContentActionInput[]>([]);

  useFunnelStepsV2Query({
    portfolioId,
    onCompleted: (data) => {
      if (data?.portfolioV2?.funnelSteps?.length) {
        setSelectedFunnelStep({
          title: data.portfolioV2.funnelSteps[0]?.title,
          funnel_step_id: data.portfolioV2.funnelSteps[0].funnelStepId,
          type: data.portfolioV2.funnelSteps[0].type,
        });
        setFunnelSteps(data?.portfolioV2?.funnelSteps);
      }
    },
  });

  useEffect(() => {
    if (!isOpenAssignMetrics) {
      setContentRuleToEdit(null);
    }
  }, [isOpenAssignMetrics]);

  const closeContentRuleSidepanel = () => {
    closeCreateContentRuleSidepanel();
    setContentRuleToEdit(null);
  };

  const handleEditContentRule = (contentRule: NexoyaContentRule) => {
    setContentRuleToEdit(contentRule);
    toggleCreateContentRuleSidepanel();
  };

  const handleDuplicateContentRule = (contentRule: NexoyaContentRule) => {
    setContentRuleToEdit({
      __typename: 'ContentRule',
      teamId,
      portfolioId,
      filters: contentRule.filters,
      appliedDiscoveredContents: [],
      contentRuleId: null,
      funnelStepMappings: [],
      matchingDiscoveredContentsCount: 0,
      name: null,
    });
    toggleCreateContentRuleSidepanel();
  };

  const handleDeleteContentRule = (contentRule: NexoyaContentRule) => {
    deleteContentRule({
      variables: {
        contentRuleId: contentRule.contentRuleId,
        portfolioId,
        teamId,
        contentActions,
      },
    });
  };

  return (
    <div>
      <div className="flex justify-between">
        <div>
          <Typography style={{ color: nexyColors.neutral900 }} variant="h3">
            Content rules
          </Typography>
          <Typography style={{ color: nexyColors.neutral400, marginTop: 8 }} variant="paragraph">
            Filter contents into content rules for bulk metric assignment.
          </Typography>
        </div>
        <div className="flex h-full gap-2">
          <Button onClick={toggleCreateContentRuleSidepanel} color="primary" variant="contained">
            Create content rule
          </Button>
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-4">
        {loading ? (
          <Spinner />
        ) : !contentRules?.length ? (
          <NoDataFound
            style={{ height: 200 }}
            title="You don't have any content rules created yet"
            subtitle="Create a content rule to get started by pressing the green button above"
          />
        ) : (
          contentRules.map((contentRule) => (
            <PortfolioRuleCard
              key={contentRule.contentRuleId}
              handleEditRule={handleEditContentRule}
              handleDeleteRule={handleDeleteContentRule}
              handleDuplicateRule={handleDuplicateContentRule}
              funnelSteps={funnelSteps?.filter((f) => !f.isAttributed)}
              rule={contentRule}
              loadingDelete={loadingDelete}
              setContentActions={setContentActions}
              contentActions={contentActions}
              ruleId={contentRule?.contentRuleId}
              resetContentActions={() => setContentActions([])}
              contentMetricAssignment={{
                close: closeAssignMetricsSidepanel,
                rule: contentRuleToEdit,
                isOpen: isOpenAssignMetrics,
                open: (contentRule: NexoyaContentRule) => {
                  setContentRuleToEdit(contentRule);
                  toggleAssignMetricsSidepanel();
                },
              }}
              config={{
                ruleType: 'content-rule',
                update: {
                  mutation: updateContentRule,
                  loading: loadingUpdate,
                },
              }}
            />
          ))
        )}
      </div>
      {isOpenCreateContentRule ? (
        <CreateOrUpdatePortfolioRule
          config={{
            type: 'content-rule',
            labels: {
              name: 'Content rule',
              saveButton: 'Save content rule',
            },
            createMutation: createContentRule,
            updateMutation: updateContentRule,
            previewUpdateMutation: previewUpdateContentRule,
          }}
          loading={{
            create: loadingCreate,
            update: loadingUpdate,
            preview: loadingPreviewUpdate,
          }}
          portfolioId={portfolioId}
          isOpen={isOpenCreateContentRule}
          closeRuleSidepanel={closeContentRuleSidepanel}
          rule={contentRuleToEdit}
        />
      ) : null}

      <AlertDialog open={isOpenAssignRulesDialog}>
        <AlertDialogContent className="min-w-[920px]">
          <AlertDialogHeader className="space-y-3">
            <AlertDialogTitle>Assign rules to contents</AlertDialogTitle>
            <AlertDialogDescription>
              <div className="mb-3 flex items-center gap-2 rounded-md border border-neutral-100 bg-neutral-50 p-3">
                <SvgCheckCircle className="h-4 w-4 text-green-400" />
                <span className="text-sm leading-5 text-neutral-800">
                  {createdDiscoveredContents.length} matching contents have been added to your portfolio.
                </span>
              </div>
              <div className="mb-3 flex flex-col rounded-md border border-neutral-100 bg-neutral-50 p-3">
                <div className="flex gap-2">
                  <SvgWarningTwo
                    warningCircleColor="#FCF1BA"
                    warningColor="#F5CF0F"
                    style={{ height: 20, width: 20 }}
                  />
                  <span className="text-md leading-5 text-neutral-800">Create rules first to assign to contents</span>
                </div>
                <span className="ml-7 font-normal leading-5 text-neutral-700">
                  Create rules by assigning metrics and creating impact group rules. You will then be able to apply them
                  to these matching contents.
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
                {createdDiscoveredContents.map((adc) => (
                  <div key={adc?.content?.contentId} className="grid grid-cols-3 border-t border-neutral-100 px-6 py-4">
                    <div className="max-w-44 truncate overflow-ellipsis text-neutral-900">{adc?.content?.title}</div>
                    <div className="w-fit text-neutral-300">Not assigned</div>
                    <div className="w-fit text-neutral-300">Not assigned</div>
                  </div>
                ))}
              </div>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>
              <ButtonAsync onClick={closeAssignRulesDialog} variant="contained" color="secondary" size="small">
                Close
              </ButtonAsync>
            </AlertDialogAction>
            <AlertDialogAction>
              <ButtonAsync
                onClick={() => {
                  setContentRuleToEdit(latestCreatedContentRule);
                  toggleAssignMetricsSidepanel();
                  closeAssignRulesDialog();
                }}
                variant="contained"
                color="primary"
                size="small"
              >
                Continue to metric assignment
              </ButtonAsync>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ContentRules;
