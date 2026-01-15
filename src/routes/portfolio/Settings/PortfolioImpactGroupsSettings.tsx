import React, { useEffect, useMemo, useState } from 'react';
import { useTeam } from '../../../context/TeamProvider';
import {
  NexoyaDeleteImpactGroupRuleContentActionInput,
  NexoyaFunnelStepType,
  NexoyaFunnelStepV2,
  NexoyaImpactGroupRule,
} from '../../../types';
import { usePortfolio } from '../../../context/PortfolioProvider';
import { useLazyQuery } from '@apollo/client';
import { FUNNEL_STEPS_V2_QUERY } from '../../../graphql/funnelSteps/queryFunnelSteps';
import Checkbox from '../../../components/Checkbox';
import { ImpactGroupsTableTDM } from '../components/ImpactGroups/ImpactGroupsTableTDM';
import TextField from '../../../components/TextField';
import { toast } from 'sonner';
import Typography from '../../../components/Typography';
import Tooltip from '../../../components/Tooltip';
import SvgWarning from '../../../components/icons/Warning';
import { nexyColors } from '../../../theme';
import { Table } from '../../../components/Table';
import { ExtendedImpactGroup } from '../components/ImpactGroups/ImpactGroupsEditTable';
import { useDialogState } from '../../../components/Dialog';
import Button from '../../../components/Button';
import ButtonIcon from '../../../components/ButtonIcon';
import { Check, CirclePlus, Pencil } from 'lucide-react';
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
import { ConfirmationDialog } from '../components/PortfolioEditFunnel/ConfirmationDialog';
import { useUpsertPortfolioImpactGroups } from '../../../graphql/impactGroups/mutationUpsertPortfolioImpactGroups';
import { isEqual } from 'lodash';
import Spinner from '../../../components/Spinner';
import { useDeletePortfolioImpactGroupMutation } from '../../../graphql/impactGroups/mutationDeleteImpactGroup';
import { Button as ShadcnButton } from '../../../components-ui/Button';
import styled from 'styled-components';
import { useUnsavedChanges } from '../../../context/UnsavedChangesProvider';
import NoDataFound from '../NoDataFound';
import { useImpactGroupRuleQuery } from '../../../graphql/portfolioRules/queryImpactGroupRules';
import { useSidePanelState } from '../../../components/SidePanel';
import CreateOrUpdatePortfolioRule from '../components/Content/PortfolioRule/CreateOrUpdatePortfolioRule';
import { useCreateImpactGroupRuleMutation } from '../../../graphql/portfolioRules/mutationCreateImpactGroupRule';
import { PortfolioRuleCard } from './PortfolioRuleCard';
import { useDeleteImpactGroupRuleMutation } from '../../../graphql/portfolioRules/mutationDeleteImpactGroupRule';
import { useImpactGroupRuleUpdatePreviewQuery } from '../../../graphql/portfolioRules/queryPreviewUpdateImpactGroupRule';
import PortfolioFeatureSwitch from '../../../components/PortfolioFeatureSwitch';
import { PORTFOLIO_FEATURE_FLAGS } from '../../../constants/featureFlags';
import useTabNewUpdates from '../../../hooks/useTabNewUpdates';
import { useUpdateImpactGroupRuleMutation } from '../../../graphql/portfolioRules/mutationUpdateImpactGroupRule';
import DOMPurify from 'dompurify';

// Reference conditions
const REFERENCE_SCREEN_WIDTH = 2220;

export function PortfolioImpactGroupsSettings() {
  const { teamId } = useTeam();
  const { setHasUnsavedChanges } = useUnsavedChanges();

  const {
    portfolioV2Info: {
      meta: { data: portfolioMeta, loading: portfolioMetaLoading },
      funnelSteps: { data: portfolioFunnelStepsData },
    },
  } = usePortfolio();

  const portfolioId = portfolioMeta?.portfolioId;
  const { refreshCountDiscoveredContents } = useTabNewUpdates(portfolioId);

  const {
    isOpen: isOpenCreateImpactGroupRule,
    toggleSidePanel: toggleCreateImpactGroupRuleSidepanel,
    closeSidePanel: closeCreateImpactGroupRuleSidepanel,
  } = useSidePanelState();

  const { isOpen, closeDialog, openDialog } = useDialogState();
  const { isOpen: isApplyOpen, openDialog: openApplyDialog, closeDialog: closeApplyDialog } = useDialogState();
  const { isOpen: isDiscardOpen, openDialog: openDiscardDialog, closeDialog: closeDiscardDialog } = useDialogState();

  const [impactGroups, setImpactGroups] = useState<Partial<ExtendedImpactGroup>[]>(portfolioMeta?.impactGroups || []);
  const [newImpactGroup, setNewImpactGroup] = useState('');
  const [deletedImpactGroupIds, setDeletedImpactGroupIds] = useState<number[]>([]);
  const [lastNewId, setLastNewId] = useState(null); // State to keep track of the last assigned id
  const [funnelSteps, setFunnelSteps] = useState<NexoyaFunnelStepV2[]>([]);
  const [stepWidth, setStepWidth] = useState(250); // Default initial width

  const [contentActions, setContentActions] = useState<NexoyaDeleteImpactGroupRuleContentActionInput[]>([]);

  // State to keep track of the Impact group rule being edited
  const [impactGroupRuleToEdit, setImpactGroupRuleToEdit] = useState<NexoyaImpactGroupRule>(null);

  const hasNoChanges = isEqual(portfolioMeta?.impactGroups, impactGroups);

  const { data: impactGroupRulesData } = useImpactGroupRuleQuery({ portfolioId });
  const impactGroupRules = impactGroupRulesData?.portfolioV2?.impactGroupRules;

  const [deleteImpactGroupRule, { loading: loadingDelete }] = useDeleteImpactGroupRuleMutation({ portfolioId });

  // Handler for deleting an Impact group rule
  const handleDeleteImpactGroupRule = (impactGroupRule: NexoyaImpactGroupRule) => {
    deleteImpactGroupRule({
      variables: {
        impactGroupRuleId: impactGroupRule.impactGroupRuleId,
        portfolioId,
        teamId,
        contentActions,
      },
    });
    setContentActions([]);
  };

  const [loadSimpleFunnelSteps, { loading }] = useLazyQuery(FUNNEL_STEPS_V2_QUERY, {
    variables: {
      teamId,
      portfolioId,
    },
  });

  const [updatePortfolioImpactGroup, { loading: loadingUpdate }] = useUpsertPortfolioImpactGroups({
    portfolioId,
    impactGroups: [],
  });

  const [deletePortfolioImpactGroup] = useDeletePortfolioImpactGroupMutation({
    portfolioId,
    impactGroupId: null,
  });

  const [createImpactGroupRule, { loading: loadingCreateImpactGroupRule }] = useCreateImpactGroupRuleMutation({
    portfolioId,
    onCompleted: () => {
      refreshCountDiscoveredContents();
    },
  });
  const [updateImpactGroupRule, { loading: loadingUpdateImpactGroupRule }] = useUpdateImpactGroupRuleMutation({
    portfolioId,
    onCompleted: () => {
      closeSidepanel();
    },
  });

  const [previewUpdateImpactGroupRule, { loading: loadingPreviewUpdateImpactGroupRule }] =
    useImpactGroupRuleUpdatePreviewQuery();

  // Dynamically calculate width whenever funnelSteps or window size changes
  useEffect(() => {
    const calculateWidths = () => {
      const currentSteps = (funnelSteps || []).filter((fs) => fs.type !== NexoyaFunnelStepType.Cost).length;

      const MIN_STEPS = 3;
      const MAX_STEPS = 10;
      const MIN_WIDTH = 140;
      const MAX_WIDTH = 350;

      let baseCalculatedStepWidth;

      if (currentSteps <= MIN_STEPS) {
        baseCalculatedStepWidth = MAX_WIDTH;
      } else if (currentSteps >= MAX_STEPS) {
        baseCalculatedStepWidth = MIN_WIDTH;
      } else {
        const ratio = (currentSteps - MIN_STEPS) / (MAX_STEPS - MIN_STEPS);
        baseCalculatedStepWidth = MAX_WIDTH + ratio * (MIN_WIDTH - MAX_WIDTH);
      }

      const scaledStepWidth = baseCalculatedStepWidth * (window.innerWidth / REFERENCE_SCREEN_WIDTH);
      const finalStepWidth = Math.max(120, Math.min(scaledStepWidth, 400));
      setStepWidth(finalStepWidth);
    };

    calculateWidths();
    window.addEventListener('resize', calculateWidths);
    return () => window.removeEventListener('resize', calculateWidths);
  }, [funnelSteps]);

  useEffect(() => {
    if (portfolioFunnelStepsData) {
      setFunnelSteps(portfolioFunnelStepsData?.map((fsp) => fsp.funnelStep));
    } else if (portfolioId) {
      loadSimpleFunnelSteps().then((res) => {
        setFunnelSteps(res?.data?.portfolioV2?.funnelSteps);
      });
    }

    if (portfolioMeta) {
      setImpactGroups(portfolioMeta?.impactGroups);
    }
  }, [portfolioFunnelStepsData, portfolioMetaLoading]);

  useEffect(() => {
    const hasUnsavedChanges = !hasNoChanges;

    setHasUnsavedChanges(hasUnsavedChanges);
  }, [hasNoChanges]);

  const handleSubmit = () => {
    const upsertImpactGroups = impactGroups.map((impactGroup) => ({
      impactGroupId: impactGroup.impactGroupId < 0 ? null : impactGroup.impactGroupId,
      name: DOMPurify.sanitize(impactGroup.name, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }),
      funnelStepIds: impactGroup.funnelSteps.map((fs) => fs.funnel_step_id),
    }));

    const deletionPromises = deletedImpactGroupIds.map((id) =>
      deletePortfolioImpactGroup({
        variables: {
          portfolioId,
          impactGroupId: id,
        },
      }),
    );

    const upsertPromise = updatePortfolioImpactGroup({
      variables: {
        teamId,
        portfolioId,
        impactGroups: upsertImpactGroups,
      },
    });

    // Execute all mutations concurrently
    Promise.all([...deletionPromises, upsertPromise])
      .then(([...results]) => {
        toast.success('Impact groups updated successfully');
        setDeletedImpactGroupIds([]); // Clear deleted IDs
        setImpactGroups(
          results.find((result) => result.data?.upsertPortfolioImpactGroups)?.data.upsertPortfolioImpactGroups || [],
        );
      })
      .catch((reason) => toast.error(`Failed to update impact groups: ${reason}`));
  };

  // Function to close the side panel and reset editing state
  const closeSidepanel = () => {
    closeCreateImpactGroupRuleSidepanel();
    setImpactGroupRuleToEdit(null);
  };

  // Handler for editing an Impact group rule
  const handleEditImpactGroupRule = (impactGroupRule: NexoyaImpactGroupRule) => {
    setImpactGroupRuleToEdit(impactGroupRule);
    toggleCreateImpactGroupRuleSidepanel();
  };

  const handleDuplicateImpactGroupRule = (impactGroupRule: NexoyaImpactGroupRule) => {
    setImpactGroupRuleToEdit({
      __typename: 'ImpactGroupRule',
      teamId,
      portfolioId,
      filters: impactGroupRule.filters,
      matchingDiscoveredContentsCount: 0,
      appliedDiscoveredContents: [],
      impactGroupRuleId: null,
      impactGroupId: null,
      name: null,
    });
    toggleCreateImpactGroupRuleSidepanel();
  };

  const handleEdit = (impactGroup: ExtendedImpactGroup) => {
    setImpactGroups((prevState) => {
      return prevState.map((igState) => {
        if (igState.impactGroupId === impactGroup.impactGroupId) {
          return { ...igState, isEditing: !igState.isEditing };
        }
        return igState;
      });
    });
  };

  const handleDelete = (impactGroupId: number) => {
    if (impactGroupId < 0) {
      // If it's a new group not yet saved, simply remove it
      setImpactGroups((prevState) => prevState.filter((igState) => igState.impactGroupId !== impactGroupId));
    } else {
      // For saved groups, mark them as deleted
      setDeletedImpactGroupIds((prevState) => [...prevState, impactGroupId]);
      setImpactGroups((prevState) => prevState.filter((igState) => igState.impactGroupId !== impactGroupId));
    }
  };

  const handleEditImpactGroupFunnelSteps = (impactGroup: ExtendedImpactGroup, funnelStepId: number) => {
    const isStepIdIncluded = impactGroup.funnelSteps.some((fs) => fs.funnel_step_id === funnelStepId);
    const newFunnelSteps = isStepIdIncluded
      ? impactGroup.funnelSteps.filter((fs) => fs.funnel_step_id !== funnelStepId)
      : [...impactGroup.funnelSteps, { funnel_step_id: funnelStepId }];

    // @ts-ignore
    setImpactGroups((prevState: ExtendedImpactGroup[]) => {
      return prevState.map((prevIgState) => {
        if (prevIgState.impactGroupId === impactGroup.impactGroupId) {
          return { ...prevIgState, funnelSteps: newFunnelSteps };
        }
        return prevIgState;
      });
    });
  };

  const getMappedFunnelSteps = (impactGroup: ExtendedImpactGroup) =>
    funnelSteps?.reduce((acc, item) => {
      acc[item.funnelStepId] = (
        <Checkbox
          key={impactGroup.impactGroupId + item.funnelStepId}
          style={{
            display: 'flex',
            alignItems: 'center',
            height: '100%',
            justifyContent: 'center',
          }}
          checked={!!impactGroup?.funnelSteps?.find((fs) => fs.funnel_step_id === item.funnelStepId)}
          onChange={() => handleEditImpactGroupFunnelSteps(impactGroup, item.funnelStepId)}
        />
      );
      return acc;
    }, {});

  const data = [
    ...impactGroups.map((impactGroup: ExtendedImpactGroup) => ({
      highlight: false,
      editRow: (
        <ImpactGroupsTableTDM
          loading={loading}
          impactGroupsLength={impactGroups.length}
          impactGroup={impactGroup}
          handleDelete={handleDelete}
        />
      ),
      impactGroup: impactGroup.isEditing ? (
        <div style={{ display: 'flex', gap: 8 }}>
          <StyledTextField
            fullWidth
            autoComplete="off"
            id={`impact-group-edit-${impactGroup?.impactGroupId}`}
            name={`impact-group-edit-${impactGroup?.impactGroupId}`}
            placeholder="Edit Impact Group"
            value={
              impactGroups.find(
                (editableImpactGroup) => editableImpactGroup.impactGroupId === impactGroup?.impactGroupId,
              )?.name
            }
            onChange={(ev) => {
              const value = ev?.target?.value;
              setImpactGroups((prevState: ExtendedImpactGroup[]) => {
                return prevState.map((igState) => {
                  if (igState.impactGroupId === impactGroup?.impactGroupId) {
                    return { ...igState, name: value };
                  }
                  return igState;
                });
              });
            }}
          />
          <div className="flex gap-1">
            <Tooltip content="Save changes" variant="dark" size="small">
              <ShadcnButton
                className="rounded-full"
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (impactGroup.name === '' || impactGroup.name.length < 3) {
                    toast.error('Impact group name must be at least 3 characters long');
                  }
                  handleEdit(impactGroup);
                }}
              >
                <Check className="h-4 w-4" />
              </ShadcnButton>
            </Tooltip>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Typography
            withEllipsis
            style={{ display: 'flex', alignItems: 'center', height: '100%', justifyContent: 'flex-start' }}
          >
            {impactGroup.name}
            {impactGroup.impactGroupId < 0 ? (
              <Tooltip
                variant="dark"
                placement="right"
                content="The impact group will be saved only once you assign a funnel step to it"
                popperProps={{
                  style: {
                    zIndex: 3300,
                  },
                }}
              >
                <div>
                  <SvgWarning style={{ marginLeft: 12, color: nexyColors.pumpkinOrange }} />
                </div>
              </Tooltip>
            ) : null}
          </Typography>
          <ShadcnButton className="rounded-full" variant="ghost" size="sm" onClick={() => handleEdit(impactGroup)}>
            <Pencil className="h-4 w-4" />
          </ShadcnButton>
        </div>
      ),
      ...getMappedFunnelSteps(impactGroup),
    })),
  ];

  const columns = useMemo(
    () => [
      {
        Header: '',
        id: 'editRow',
        accessor: 'editRow',
        width: 40,
        isHiddenInManager: true,
        disableSortBy: true,
      },
      {
        Header: <div className="text-sm font-medium capitalize leading-[1.4] tracking-[0.28px]">Impact groups</div>,
        id: 'impactGroup',
        accessor: 'impactGroup',
        enableColumnResize: true,
        disableSortBy: true,
        width: '300',
      },
      ...(funnelSteps || [])
        .filter((fs) => fs.type !== NexoyaFunnelStepType.Cost)
        .map((funnelStep) => ({
          Header: funnelStep?.title,
          id: funnelStep?.funnelStepId?.toString(),
          accessor: funnelStep?.funnelStepId?.toString(),
          enableColumnResize: true,
          disableSortBy: true,
          width: stepWidth,
        })),
    ],
    [funnelSteps, stepWidth],
  );

  return !portfolioMetaLoading ? (
    <div>
      <div className="mb-8 flex w-full flex-row items-end justify-between">
        <div>
          <div className="text-[20px] font-medium tracking-normal">Impact groups</div>
          <div className="text-md font-normal text-neutral-500">
            Create and manage the impact groups to assign your funnel steps to.
          </div>
        </div>
        <div className="flex h-fit gap-4">
          <Button variant="contained" onClick={openDiscardDialog} disabled={loadingUpdate || loading || hasNoChanges}>
            Discard changes
          </Button>
          <Button
            variant="contained"
            color="primary"
            disabled={loadingUpdate || loading || hasNoChanges}
            onClick={openApplyDialog}
          >
            Apply changes
          </Button>
        </div>
      </div>
      <div className="rounded-md border border-[#EAEAEA]">
        <Table data={data} columns={columns} tableId="impact-group-crud-table" disableManager={true} />
        <div className="flex h-12 w-full items-center justify-between gap-1 border-t border-[#EAEAEA] p-2">
          <div className="flex items-center gap-2">
            <ButtonIcon onClick={() => openDialog()} style={{ marginRight: 8 }}>
              <CirclePlus className="h-5 w-5 text-neutral-300" />
            </ButtonIcon>
          </div>
          <div className="h-[1px] w-full bg-neutral-100"></div>

          <AlertDialog open={isOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Add a new impact group</AlertDialogTitle>
                <AlertDialogDescription>
                  <span className="mt-1 text-sm font-normal leading-5 text-neutral-400">
                    Give the impact group a name
                  </span>
                </AlertDialogDescription>
              </AlertDialogHeader>

              <TextField
                fullWidth
                autoComplete="off"
                id="new-impact-group"
                name="new-impact-group"
                placeholder="New Impact Group"
                value={newImpactGroup}
                onChange={(ev) => setNewImpactGroup(ev?.target?.value)}
              />

              <AlertDialogFooter>
                <AlertDialogAction
                  onClick={() => {
                    closeDialog();
                  }}
                >
                  <ButtonAsync variant="contained" color="secondary" size="small">
                    Cancel
                  </ButtonAsync>
                </AlertDialogAction>

                <AlertDialogAction>
                  <Button
                    size="small"
                    color="primary"
                    variant="contained"
                    disabled={newImpactGroup === ''}
                    onClick={() => {
                      if (newImpactGroup === '' || newImpactGroup.length < 3) {
                        toast.error('Impact group name must be at least 3 characters long');
                        return;
                      }

                      setNewImpactGroup('');
                      setLastNewId((prevLastId) => prevLastId - 1); // Decrement the lastNewId
                      // @ts-ignore
                      setImpactGroups((prevState) => [
                        ...prevState,
                        {
                          portfolioId: null,
                          impactGroupId: lastNewId,
                          name: newImpactGroup,
                          isEditing: false,
                          funnelSteps: [],
                        },
                      ]);
                      closeDialog();
                    }}
                  >
                    Add impact group
                  </Button>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      <PortfolioFeatureSwitch
        features={[PORTFOLIO_FEATURE_FLAGS.SELF_SERVICE_PORTFOLIO]}
        renderOld={() => null}
        renderNew={() => (
          <div className="mt-8">
            <div className="flex justify-between">
              <div>
                <Typography style={{ color: nexyColors.neutral900 }} variant="h3">
                  Impact group rules
                </Typography>
                <Typography style={{ color: nexyColors.neutral400, marginTop: 8 }} variant="paragraph">
                  Filter contents into impact group rules for bulk metric assignment.
                </Typography>
              </div>
              <div className="flex h-full gap-2">
                <Button
                  disabled={!portfolioMeta?.impactGroups?.length}
                  onClick={toggleCreateImpactGroupRuleSidepanel}
                  color="primary"
                  variant="contained"
                >
                  Create impact group rule
                </Button>
              </div>
            </div>
            <div className="mt-4 flex flex-col gap-4">
              {loading ? (
                <Spinner />
              ) : !impactGroupRules?.length ? (
                <NoDataFound
                  style={{ height: 200 }}
                  title="You don't have any impact group rules created yet"
                  subtitle="Create an impact group rule to get started by pressing the green button above"
                />
              ) : (
                impactGroupRules.map((impactGroupRule) => (
                  <PortfolioRuleCard
                    key={impactGroupRule.impactGroupRuleId}
                    handleEditRule={handleEditImpactGroupRule}
                    handleDeleteRule={handleDeleteImpactGroupRule}
                    handleDuplicateRule={handleDuplicateImpactGroupRule}
                    funnelSteps={funnelSteps?.filter((f) => !f.isAttributed)}
                    rule={impactGroupRule}
                    loadingDelete={loadingDelete}
                    setContentActions={setContentActions}
                    contentActions={contentActions}
                    ruleId={impactGroupRule?.impactGroupRuleId}
                    resetContentActions={() => setContentActions([])}
                    config={{
                      ruleType: 'impact-group-rule',
                      update: {
                        mutation: updateImpactGroupRule,
                        loading: loadingUpdateImpactGroupRule,
                      },
                    }}
                  />
                ))
              )}
            </div>
            {isOpenCreateImpactGroupRule ? (
              <CreateOrUpdatePortfolioRule
                config={{
                  type: 'impact-group-rule',
                  labels: {
                    name: 'Impact group rule',
                    saveButton: 'Save impact group rule',
                  },
                  createMutation: createImpactGroupRule,
                  updateMutation: updateImpactGroupRule,
                  previewUpdateMutation: previewUpdateImpactGroupRule,
                }}
                loading={{
                  create: loadingCreateImpactGroupRule,
                  update: loadingUpdateImpactGroupRule,
                  preview: loadingPreviewUpdateImpactGroupRule,
                }}
                portfolioId={portfolioId}
                isOpen={isOpenCreateImpactGroupRule}
                closeRuleSidepanel={closeSidepanel}
                rule={impactGroupRuleToEdit}
              />
            ) : null}
          </div>
        )}
      />

      <ConfirmationDialog
        description="Your changes will be applied to all impact groups throughout your portfolio"
        onConfirm={() => {
          handleSubmit();
          closeApplyDialog();
        }}
        type="apply"
        isOpen={isApplyOpen}
        onCancel={closeApplyDialog}
      />
      <ConfirmationDialog
        description="Are you sure you want to discard all changes?"
        onConfirm={() => {
          setImpactGroups(portfolioMeta?.impactGroups);
          closeDiscardDialog();
        }}
        type="discard"
        isOpen={isDiscardOpen}
        onCancel={closeDiscardDialog}
      />
    </div>
  ) : (
    <Spinner />
  );
}

const StyledTextField = styled(TextField)`
  .NEXYFormControl {
    flex-direction: column;
    justify-content: center;
  }
  .NEXYInputWrap {
    padding: 4px 16px;
  }
`;
