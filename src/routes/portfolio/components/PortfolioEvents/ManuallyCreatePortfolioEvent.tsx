import React, { useEffect, useState } from 'react';
import SidePanel, { SidePanelActions, SidePanelContent } from '../../../../components/SidePanel';
import ButtonAsync from '../../../../components/ButtonAsync';
import { toast } from 'sonner';
import { useUpdatePortfolioEventMutation } from '../../../../graphql/portfolioEvents/mutationUpdatePortfolioEvent';
import usePortfolioMetaStore from '../../../../store/portfolio-meta';
import dayjs from 'dayjs';
import { useTeam } from '../../../../context/TeamProvider';
import { isEmpty } from 'lodash';
import { NexoyaPortfolioEvent } from '../../../../types';
import { createFormDataWithFile, GET_PORTFOLIO_EVENT_ASSET_API_URL } from '../../utils/portfolio-events';
import { PortfolioEventDetails } from './PortfolioEventDetails';
import usePortfolioEventsStore from '../../../../store/portfolio-events';
import { StepperWrapper, StepWrapper } from 'routes/portfolios/CreatePortfolio';
import VerticalStepper from '../../../../components/VerticalStepper';
import { MANUAL_PORTFOLIO_EVENT_CREATION_STEPS } from '../../../../configs/portfolioEvents';
import { useDeletePortfolioEventAsset } from '../../../../graphql/portfolioEvents/mutationDeleteEventAsset';
import { useCreatePortfolioEventMutation } from '../../../../graphql/portfolioEvents/mutationCreatePortfolioEvent';
import { track } from '../../../../constants/datadog';
import { EVENT } from '../../../../constants/events';
import { useStepper } from '../../../../components/Stepper';
import { useFilteredContentsStore } from '../../../../store/filter-contents';
import { useContentRulesStore } from '../../../../store/content-rules';
import { PortfolioEventAssignContents } from './PortfolioEventAssignContents';
import { useAssignContentsToPortfolioEventMutation } from '../../../../graphql/portfolioEvents/mutationAssignContentsToPortfolioEvent';
import Button from '../../../../components/Button';
import DOMPurify from 'dompurify';

export const ManuallyCreatePortfolioEvent = ({
  isOpen,
  onClose,
  portfolioEventToEdit,
}: {
  isOpen: boolean;
  onClose: () => void;
  portfolioEventToEdit?: NexoyaPortfolioEvent;
}) => {
  const [loadingAsset, setLoadingAsset] = useState(false);

  const [portfolioEventId, setPortfolioEventId] = useState<number | null>(null);
  const [includesAllContents, setIncludesAllContents] = useState<boolean>(false);

  const {
    portfolioMeta: { portfolioId },
  } = usePortfolioMetaStore();

  const { teamId } = useTeam();

  const { newPortfolioEvent, setNewPortfolioEvent, resetNewPortfolioEvent } = usePortfolioEventsStore();
  const { selectedContentIds } = useFilteredContentsStore();
  const { selectedContentRules, resetSelectedContentRules } = useContentRulesStore();

  const { step, nextStep, previousStep, resetStep } = useStepper({
    initialValue: 1,
    end: MANUAL_PORTFOLIO_EVENT_CREATION_STEPS.length,
  });

  const [deletePortfolioEventAsset, { loading: loadingDeleteAsset }] = useDeletePortfolioEventAsset();
  const [createPortfolioEvent, { loading: loadingCreate }] = useCreatePortfolioEventMutation({ portfolioId });
  const [updatePortfolioEvent, { loading: loadingUpdate }] = useUpdatePortfolioEventMutation({ portfolioId });
  const [assignContents, { loading: loadingAssignContents }] = useAssignContentsToPortfolioEventMutation();

  const isEditMode = !isEmpty(portfolioEventToEdit);

  const hasChanges = () => {
    if (step === 1) {
      return (
        newPortfolioEvent.name !== portfolioEventToEdit?.name ||
        newPortfolioEvent.description !== portfolioEventToEdit?.description ||
        newPortfolioEvent.start !== portfolioEventToEdit?.start ||
        newPortfolioEvent.end !== portfolioEventToEdit?.end ||
        newPortfolioEvent.category !== portfolioEventToEdit?.category ||
        newPortfolioEvent.impact !== portfolioEventToEdit?.impact ||
        newPortfolioEvent.file ||
        newPortfolioEvent.removeAsset
      );
    } else if (step === 2) {
      const includesAllContentsChanged = includesAllContents !== portfolioEventToEdit?.includesAllContents;

      const hasSelectedContentsChanged =
        !includesAllContents && selectedContentIds.length !== portfolioEventToEdit?.assignedContents.length;

      const hasContentRulesChanged =
        !includesAllContents && selectedContentRules?.length !== portfolioEventToEdit?.contentRules?.length;

      return includesAllContentsChanged || hasSelectedContentsChanged || hasContentRulesChanged;
    }
  };

  useEffect(() => {
    if (isEditMode && portfolioEventToEdit) {
      setNewPortfolioEvent({
        name: portfolioEventToEdit.name,
        description: portfolioEventToEdit.description,
        start: portfolioEventToEdit.start,
        end: portfolioEventToEdit.end,
        category: portfolioEventToEdit.category,
        impact: portfolioEventToEdit.impact,
      });
    } else {
      resetNewPortfolioEvent();
    }
  }, [isEditMode, portfolioEventToEdit, setNewPortfolioEvent, resetNewPortfolioEvent]);

  const handleSaveOrUpdateEvent = () => {
    const baseVariables = {
      teamId,
      portfolioId,
    };

    if (portfolioEventToEdit) {
      // Only include fields that have changed
      const changedFields = {};

      if (newPortfolioEvent.name !== portfolioEventToEdit.name) {
        changedFields['name'] = DOMPurify.sanitize(newPortfolioEvent.name, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
      }
      if (newPortfolioEvent.description !== portfolioEventToEdit.description) {
        changedFields['description'] = DOMPurify.sanitize(newPortfolioEvent.description, {
          ALLOWED_TAGS: [],
          ALLOWED_ATTR: [],
        });
      }
      if (newPortfolioEvent.start !== portfolioEventToEdit.start) {
        changedFields['start'] = dayjs(newPortfolioEvent.start).endOf('day').toISOString().slice(0, 10);
      }
      if (newPortfolioEvent.end !== portfolioEventToEdit.end) {
        changedFields['end'] = dayjs(newPortfolioEvent.end).endOf('day').toISOString().slice(0, 10);
      }
      if (newPortfolioEvent.category !== portfolioEventToEdit.category) {
        changedFields['category'] = newPortfolioEvent.category;
      }
      if (newPortfolioEvent.impact !== portfolioEventToEdit.impact) {
        changedFields['impact'] = newPortfolioEvent.impact;
      }
      if (newPortfolioEvent.file) {
        changedFields['file'] = newPortfolioEvent.file;
      }

      const variables = {
        ...baseVariables,
        portfolioEventId: portfolioEventToEdit.portfolioEventId,
        ...changedFields,
      };

      updatePortfolioEvent({ variables })
        .then(({ data }) => {
          if (data?.updatePortfolioEvent) {
            track(EVENT.PORTFOLIO_EVENT_UPDATE);
            if (newPortfolioEvent?.file) {
              setLoadingAsset(true);
              fetch(
                GET_PORTFOLIO_EVENT_ASSET_API_URL(data?.updatePortfolioEvent?.updatedPortfolioEvent?.portfolioEventId),
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                  },
                  method: 'POST',
                  body: createFormDataWithFile(newPortfolioEvent?.file, teamId),
                },
              )
                .then(() => {
                  toast.success('Event successfully updated with asset file');
                  handleClose();
                })
                .catch((err) => {
                  toast.error('Failed to upload file');
                  console.error('Failed to upload file', err);
                })
                .finally(() => setLoadingAsset(false));
            } else if (newPortfolioEvent.removeAsset) {
              deletePortfolioEventAsset({
                variables: {
                  portfolioId,
                  portfolioEventId: portfolioEventToEdit.portfolioEventId,
                  teamId,
                },
              })
                .then(() => {
                  toast.success('Event successfully updated and asset file removed');
                  handleClose();
                })
                .catch((err) => {
                  toast.error('Failed to remove asset file');
                  console.error('Failed to remove asset file', err);
                });
            } else {
              toast.success('Event successfully updated');
              handleClose();
            }
          }
        })
        .catch((err) => {
          toast.error('Failed to update event');
          console.error('Failed to update event', err);
        });
    } else {
      const variables = {
        ...baseVariables,
        name: DOMPurify.sanitize(newPortfolioEvent.name, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }),
        description: DOMPurify.sanitize(newPortfolioEvent.description, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }),
        start: dayjs(newPortfolioEvent.start).endOf('day').toISOString().slice(0, 10),
        end: dayjs(newPortfolioEvent.end).endOf('day').toISOString().slice(0, 10),
        category: newPortfolioEvent.category,
        impact: newPortfolioEvent.impact,
      };

      createPortfolioEvent({ variables })
        .then(({ data }) => {
          if (data?.createPortfolioEvent) {
            const event = data.createPortfolioEvent?.portfolioEvent;
            track(EVENT.PORTFOLIO_EVENT_CREATE);

            if (newPortfolioEvent?.file) {
              fetch(GET_PORTFOLIO_EVENT_ASSET_API_URL(event.portfolioEventId), {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                },
                method: 'POST',
                body: createFormDataWithFile(newPortfolioEvent?.file, teamId),
              })
                .then(() => {
                  toast.success('Event successfully added to portfolio');
                  setPortfolioEventId(event.portfolioEventId);
                  if (isEditMode) {
                    handleClose();
                  } else {
                    nextStep();
                  }
                })
                .catch((err) => {
                  toast.error('Failed to upload file');
                  console.error('Failed to upload file', err);
                });
            } else {
              setPortfolioEventId(event.portfolioEventId);
              toast.success('Event successfully added to portfolio');
              if (isEditMode) {
                handleClose();
              } else {
                nextStep();
              }
            }
          }
        })
        .catch((err) => {
          toast.error('Failed to create event');
          console.error('Failed to create event', err);
        });
    }
  };

  const handleAssignContents = () => {
    assignContents({
      variables: {
        teamId,
        portfolioId,
        portfolioEventIds: [portfolioEventId],
        assignedContentIds: includesAllContents ? [] : selectedContentIds,
        includesAllContents,
        contentRuleIds: selectedContentRules?.map((rule) => rule.contentRuleId),
      },
    })
      .then(({ data }) => {
        if (data?.assignContentsAndRulesToPortfolioEvents?.portfolioEvents) {
          toast.success('Event successfully added to portfolio');
          handleClose();
        }
      })
      .catch((err) => {
        toast.error('Failed to assign contents to event');
        console.error('Failed to assign contents to event', err);
      });
  };

  const handleClose = () => {
    onClose();
    resetStep();
    resetSelectedContentRules();
    resetNewPortfolioEvent();
  };

  const canSubmit = () => {
    if (loadingCreate || loadingUpdate || loadingAssignContents || newPortfolioEvent?.hasDuplicateName) {
      return false;
    }
    if (isEditMode) {
      return hasChanges();
    }

    if (step === 1) {
      return (
        newPortfolioEvent.name &&
        newPortfolioEvent.start &&
        newPortfolioEvent.end &&
        newPortfolioEvent.category &&
        newPortfolioEvent.impact
      );
    }

    if (step === 2) {
      return selectedContentIds.length > 0 || selectedContentRules?.length > 0 || includesAllContents;
    }

    return false;
  };

  return (
    <SidePanel
      isOpen={isOpen}
      onClose={handleClose}
      paperProps={{
        style: {
          width: 'calc(100% - 218px)',
          paddingBottom: '78px',
        },
      }}
    >
      <div className="border border-b-[#eaeaea] px-6 py-5">
        <h3 className="text-xl font-medium text-neutral-900">{isEditMode ? 'Edit event' : 'Create event'}</h3>
      </div>
      <SidePanelContent className="!p-0">
        <StepperWrapper className="border-r-[1px] border-[#EAEAEA] p-6">
          <VerticalStepper
            className="max-w-72 !p-0"
            current={step}
            steps={MANUAL_PORTFOLIO_EVENT_CREATION_STEPS(isEditMode)}
          />
        </StepperWrapper>
        <StepWrapper>
          {step === 1 ? (
            <PortfolioEventDetails portfolioEventToEdit={portfolioEventToEdit} />
          ) : (
            <PortfolioEventAssignContents
              setIncludesAllContents={setIncludesAllContents}
              portfolioEventToEdit={portfolioEventToEdit}
            />
          )}
        </StepWrapper>
      </SidePanelContent>
      <SidePanelActions>
        {step > 1 ? (
          <Button
            variant="contained"
            style={{
              marginRight: 'auto',
            }}
            disabled={loadingAssignContents}
            onClick={previousStep}
            id="previousStepBtn"
          >
            Previous step
          </Button>
        ) : null}
        <ButtonAsync
          id="save"
          variant="contained"
          color="primary"
          disabled={!canSubmit()}
          loading={loadingCreate || loadingUpdate || loadingDeleteAsset || loadingAsset}
          onClick={() => {
            if (isEditMode) {
              handleSaveOrUpdateEvent();
            } else if (step === 1) {
              // In create mode, first step
              hasChanges() ? handleSaveOrUpdateEvent() : nextStep();
            } else {
              // In create mode, second step
              handleAssignContents();
            }
          }}
          style={{
            marginLeft: 'auto',
          }}
        >
          {step === 1 ? `${isEditMode ? 'Update event ' : 'Add event and continue'}` : 'Assign contents'}
        </ButtonAsync>
      </SidePanelActions>
    </SidePanel>
  );
};
