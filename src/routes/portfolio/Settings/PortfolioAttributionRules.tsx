import React, { useEffect, useState } from 'react';
import { useRouteMatch } from 'react-router';
import NoDataFound from '../NoDataFound';
import Typography from '../../../components/Typography';
import { nexyColors } from '../../../theme';
import Button from '../../../components/Button';
import { useSidePanelState } from '../../../components/SidePanel';
import CreateOrUpdatePortfolioRule from '../components/Content/PortfolioRule/CreateOrUpdatePortfolioRule';
import { usePortfolio } from '../../../context/PortfolioProvider';
import { useFunnelStepsV2Query } from '../../../graphql/funnelSteps/queryFunnelSteps';
import { NexoyaAttributionRule, NexoyaDeleteAttributionRuleContentActionInput } from '../../../types';
import Spinner from '../../../components/Spinner';
import { useCreateAttributionRuleMutation } from '../../../graphql/portfolioRules/mutationCreateAttributionRule';
import { useUpdateAttributionRuleMutation } from '../../../graphql/portfolioRules/mutationUpdateAttributionRule';
import { PortfolioRuleCard } from './PortfolioRuleCard';
import { useDeleteAttributionRuleMutation } from '../../../graphql/portfolioRules/mutationDeleteAttributionRule';
import { useTeam } from '../../../context/TeamProvider';
import { useAttributionRuleUpdatePreviewQuery } from '../../../graphql/portfolioRules/queryPreviewUpdateAttributionRule';
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
import { useAttributionRuleQuery } from '../../../graphql/portfolioRules/queryAttributionRules';
import { useAttributionRulesStore } from '../../../store/attribution-rules';
import { AttributionAssignment } from '../components/Content/PortfolioRule/AttributionAssignment';
import useTabNewUpdates from '../../../hooks/useTabNewUpdates';

const AttributionRules = () => {
  const match = useRouteMatch();
  const { teamId } = useTeam();
  const portfolioId = parseInt(match.params.portfolioID, 10);

  const { refreshCountDiscoveredContents } = useTabNewUpdates(portfolioId);

  const { setAttributionRules: setAttributionRulesInStore } = useAttributionRulesStore();
  const { data: attributionRulesData, loading } = useAttributionRuleQuery({
    portfolioId,
    onCompleted: (data) => setAttributionRulesInStore(data?.portfolioV2?.attributionRules),
  });
  const attributionRules = attributionRulesData?.portfolioV2?.attributionRules as NexoyaAttributionRule[];
  const [funnelSteps, setFunnelSteps] = useState([]);
  const [attributionRuleToEdit, setAttributionRuleToEdit] = useState<NexoyaAttributionRule>(null);
  const [latestCreatedAttributionRule, setLatestCreatedAttributionRule] = useState<NexoyaAttributionRule>(null);
  const [mappedContentsCount, setMappedContentsCount] = useState<NexoyaAttributionRule>(null);

  const {
    selectedFunnelStep: { setSelectedFunnelStep },
  } = usePortfolio();
  const { setProviderMapSelection } = useProviderRuleStore();

  const {
    isOpen: isOpenCreateAttributionRule,
    toggleSidePanel: toggleCreateAttributionRuleSidepanel,
    closeSidePanel: closeCreateAttributionRuleSidepanel,
  } = useSidePanelState();

  const {
    isOpen: isOpenAssignAttributionDialog,
    toggleDialog: toggleAssignAttributionDialog,
    closeDialog: closeAssignAttributionDialog,
  } = useDialogState();

  const {
    isOpen: isOpenContinueToFactorsDialog,
    toggleDialog: toggleContinueToFactorsDialog,
    closeDialog: closeContinueToFactorsDialog,
  } = useDialogState();

  const [previewUpdateAttributionRule, { loading: loadingPreviewUpdate }] = useAttributionRuleUpdatePreviewQuery();
  const [deleteAttributionRule, { loading: loadingDelete }] = useDeleteAttributionRuleMutation({ portfolioId });
  const [updateAttributionRule, { loading: loadingUpdate }] = useUpdateAttributionRuleMutation({
    portfolioId,
    onCompleted: () => {
      closeAttributionRuleSidepanel();
    },
  });
  const [createAttributionRule, { loading: loadingCreate }] = useCreateAttributionRuleMutation({
    portfolioId,
    onCompleted: (data) => {
      if (data?.createAttributionRule?.attributionRule) {
        setMappedContentsCount(data?.createAttributionRule?.mappedContentsCount);
        setLatestCreatedAttributionRule(data?.createAttributionRule?.attributionRule);
        setProviderMapSelection({});
        refreshCountDiscoveredContents();
      }
    },
  });

  const [contentActions, setContentActions] = useState<NexoyaDeleteAttributionRuleContentActionInput[]>([]);

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
    if (!isOpenAssignAttributionDialog) {
      setAttributionRuleToEdit(null);
    }
  }, [isOpenAssignAttributionDialog]);

  const closeAttributionRuleSidepanel = () => {
    closeCreateAttributionRuleSidepanel();
    setAttributionRuleToEdit(null);

    if (latestCreatedAttributionRule) {
      toggleContinueToFactorsDialog();
    }
  };

  const handleEditAttributionRule = (attributionRule: NexoyaAttributionRule) => {
    setAttributionRuleToEdit(attributionRule);
    toggleCreateAttributionRuleSidepanel();
  };

  const handleDuplicateAttributionRule = (attributionRule: NexoyaAttributionRule) => {
    setAttributionRuleToEdit({
      __typename: 'AttributionRule',
      teamId,
      portfolioId,
      filters: attributionRule.filters,
      factors: attributionRule.factors,
      appliedDiscoveredContents: [],
      attributionRuleId: null,
      matchingDiscoveredContentsCount: 0,
      name: null,
    });
    toggleCreateAttributionRuleSidepanel();
  };

  const handleDeleteAttributionRule = (attributionRule: NexoyaAttributionRule) => {
    deleteAttributionRule({
      variables: {
        attributionRuleId: attributionRule.attributionRuleId,
        portfolioId,
        teamId,
        contentActions,
      },
    });
  };

  return (
    <div>
      <AttributionAssignment
        attributionRule={attributionRuleToEdit}
        isOpen={isOpenAssignAttributionDialog}
        closeSidePanel={closeAssignAttributionDialog}
      />
      <div className="flex justify-between">
        <div>
          <Typography style={{ color: nexyColors.neutral900 }} variant="h3">
            Attribution rules
          </Typography>
          <Typography style={{ color: nexyColors.neutral400, marginTop: 8 }} variant="paragraph">
            Filter contents into attribution rules for bulk metric assignment.
          </Typography>
        </div>
        <div className="flex h-full gap-2">
          <Button onClick={toggleCreateAttributionRuleSidepanel} color="primary" variant="contained">
            Create attribution rule
          </Button>
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-4">
        {loading ? (
          <Spinner />
        ) : !attributionRules?.length ? (
          <NoDataFound
            style={{ height: 200 }}
            title="You don't have any attribution rules created yet"
            subtitle="Create a attribution rule to get started by pressing the green button above"
          />
        ) : (
          attributionRules.map((attributionRule) => (
            <PortfolioRuleCard
              key={attributionRule.attributionRuleId}
              handleEditRule={handleEditAttributionRule}
              handleDeleteRule={handleDeleteAttributionRule}
              handleDuplicateRule={handleDuplicateAttributionRule}
              funnelSteps={funnelSteps}
              rule={attributionRule}
              loadingDelete={loadingDelete}
              setContentActions={setContentActions}
              contentActions={contentActions}
              ruleId={attributionRule?.attributionRuleId}
              resetContentActions={() => setContentActions([])}
              attributionAssignment={{
                close: closeAssignAttributionDialog,
                rule: attributionRuleToEdit,
                isOpen: isOpenAssignAttributionDialog,
                open: (attributionRule: NexoyaAttributionRule) => {
                  setAttributionRuleToEdit(attributionRule);
                  toggleAssignAttributionDialog();
                },
              }}
              config={{
                ruleType: 'attribution-rule',
                update: {
                  mutation: updateAttributionRule,
                  loading: loadingUpdate,
                },
              }}
            />
          ))
        )}
      </div>
      {isOpenCreateAttributionRule ? (
        <CreateOrUpdatePortfolioRule
          config={{
            type: 'attribution-rule',
            labels: {
              name: 'Attribution rule',
              saveButton: 'Save attribution rule',
            },
            createMutation: createAttributionRule,
            updateMutation: updateAttributionRule,
            previewUpdateMutation: previewUpdateAttributionRule,
          }}
          loading={{
            create: loadingCreate,
            update: loadingUpdate,
            preview: loadingPreviewUpdate,
          }}
          portfolioId={portfolioId}
          isOpen={isOpenCreateAttributionRule}
          closeRuleSidepanel={closeAttributionRuleSidepanel}
          rule={attributionRuleToEdit}
        />
      ) : null}

      <AlertDialog open={isOpenContinueToFactorsDialog}>
        <AlertDialogContent className="min-w-[920px]">
          <AlertDialogHeader className="space-y-3">
            <AlertDialogTitle>Assign factors to contents</AlertDialogTitle>
            <AlertDialogDescription>
              <div className="mb-3 flex items-center gap-2 rounded-md border border-neutral-100 bg-neutral-50 p-3">
                <SvgCheckCircle className="h-4 w-4 text-green-400" />
                <span className="text-sm leading-5 text-neutral-800">
                  {mappedContentsCount} matching contents have been added to your attribution rule.
                </span>
              </div>
              <div className="mb-3 flex flex-col rounded-md border border-neutral-100 bg-neutral-50 p-3">
                <div className="flex gap-2">
                  <SvgWarningTwo
                    warningCircleColor="#FCF1BA"
                    warningColor="#F5CF0F"
                    style={{ height: 20, width: 20 }}
                  />
                  <span className="text-md leading-5 text-neutral-800">Assigning attribution factors</span>
                </div>
                <span className="ml-7 font-normal leading-5 text-neutral-700">
                  Now that your rule is created, you can assign attribution factors to the contents that match your rule
                </span>
              </div>
            </AlertDialogDescription>
            <div className="rounded-lg border border-neutral-100 bg-neutral-50">
              {/* Table Header */}
              <div className="grid grid-cols-3 items-center px-6 py-3 font-medium text-neutral-600">
                <LabelLight className="!mb-0 px-0 font-semibold !text-neutral-500">Content name</LabelLight>
                <LabelLight className="!mb-0 px-2 font-semibold !text-neutral-500">Attribution rule metrics</LabelLight>
              </div>

              {/* Table Rows */}
              <div className="max-h-96 overflow-x-scroll">
                {[1, 2, 3, 4].map((id) => (
                  <div key={id} className="grid grid-cols-3 border-t border-neutral-100 px-6 py-4">
                    <div className="max-w-44 truncate overflow-ellipsis text-neutral-900">Content {id}</div>
                    <div className="w-fit text-neutral-300">Not assigned</div>
                  </div>
                ))}
              </div>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>
              <ButtonAsync onClick={closeContinueToFactorsDialog} variant="contained" color="secondary" size="small">
                Close
              </ButtonAsync>
            </AlertDialogAction>
            <AlertDialogAction>
              <ButtonAsync
                onClick={() => {
                  setAttributionRuleToEdit(latestCreatedAttributionRule);
                  toggleAssignAttributionDialog();
                  closeContinueToFactorsDialog();
                }}
                variant="contained"
                color="primary"
                size="small"
              >
                Continue to factor assignment
              </ButtonAsync>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AttributionRules;
