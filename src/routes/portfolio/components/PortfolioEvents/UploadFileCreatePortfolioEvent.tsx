import SidePanel, { SidePanelActions, SidePanelContent } from '../../../../components/SidePanel';
import { StepperWrapper, StepWrapper } from '../../../portfolios/CreatePortfolio';
import VerticalStepper from '../../../../components/VerticalStepper';
import ButtonAsync from '../../../../components/ButtonAsync';
import { UPLOAD_PORTFOLIO_EVENT_CREATION_STEPS } from '../../../../configs/portfolioEvents';
import { useStepper } from '../../../../components/Stepper';
import React, { useState } from 'react';
import { PortfolioEventAssignContents } from './PortfolioEventAssignContents';
import { toast } from 'sonner';
import Button from '../../../../components/Button';
import { PortfolioEventsFileUpload } from './PortfolioEventsFileUpload';
import { NexoyaPortfolioEvent } from '../../../../types';
import { useBulkCreatePortfolioEventsMutation } from '../../../../graphql/portfolioEvents/mutationBulkCreatePortfolioEvents';
import { useAssignContentsToPortfolioEventMutation } from '../../../../graphql/portfolioEvents/mutationAssignContentsToPortfolioEvent';
import { useRouteMatch } from 'react-router';
import { useTeam } from '../../../../context/TeamProvider';
import { useFilteredContentsStore } from '../../../../store/filter-contents';
import dayjs from 'dayjs';
import { GLOBAL_DATE_FORMAT } from '../../../../utils/dates';
import { useContentRulesStore } from '../../../../store/content-rules';
import { useBulkUpdatePortfolioEventsMutation } from '../../../../graphql/portfolioEvents/mutationBulkUpdatePortfolioEvents';
import { validateEvents } from '../../utils/portfolio-events';
import { track } from '../../../../constants/datadog';
import { EVENT } from '../../../../constants/events';
import DOMPurify from 'dompurify';

export const UploadFileCreatePortfolioEvent = ({ isOpen, onClose }) => {
  const match = useRouteMatch();
  const portfolioId = parseInt(match.params.portfolioID, 10);

  const { teamId } = useTeam();
  const { selectedContentIds } = useFilteredContentsStore();
  const { selectedContentRules, resetSelectedContentRules } = useContentRulesStore();

  const { step, nextStep, resetStep } = useStepper({
    initialValue: 1,
    end: UPLOAD_PORTFOLIO_EVENT_CREATION_STEPS.length,
  });

  const [parsedEvents, setParsedEvents] = useState<{
    eventsToCreate: NexoyaPortfolioEvent[];
    eventsToUpdate: NexoyaPortfolioEvent[];
  }>({ eventsToUpdate: [], eventsToCreate: [] });
  const [createdPortfolioEventIds, setCreatedPortfolioEventIds] = useState<number[]>([]);

  const [includesAllContents, setIncludesAllContents] = useState<boolean>(false);
  const [selectedEventIds, setSelectedEventIds] = useState<number[]>([]);

  const [bulkUpdatePortfolioEvents, { loading: loadingUpdate }] = useBulkUpdatePortfolioEventsMutation();
  const [bulkCreatePortfolioEvents, { loading: loadingCreate }] = useBulkCreatePortfolioEventsMutation();
  const [assignContents, { loading: loadingAssignContents }] = useAssignContentsToPortfolioEventMutation();

  const handleSaveEvent = async () => {
    try {
      // Handle the structured case with events to create and update
      const { eventsToCreate, eventsToUpdate } = parsedEvents;

      if (!eventsToCreate.length && !eventsToUpdate.length) {
        toast.error('Please upload a file with events');
        return;
      }

      // Validate all events before submitting
      const invalidCreateEvents = validateEvents(eventsToCreate);
      const invalidUpdateEvents = validateEvents(eventsToUpdate);

      const allInvalidEvents = [...invalidCreateEvents, ...invalidUpdateEvents];

      if (allInvalidEvents.length > 0) {
        const errorMessage = allInvalidEvents
          .map(
            (err) =>
              `Row ${err.index + 1}: Invalid ${err.field} value "${err.value}". Allowed values are: ${err.allowed}`,
          )
          .join('\n');

        toast.error('CSV contains invalid values:', {
          description: (
            <pre className="max-h-[200px] overflow-auto whitespace-break-spaces text-xs">{errorMessage}</pre>
          ),
          duration: 10000,
        });
        return;
      }

      // Array to collect all event IDs (both created and updated)
      let allEventIds = [];

      // First, handle events that need to be updated
      if (eventsToUpdate?.length) {
        const { data: updateData } = await bulkUpdatePortfolioEvents({
          variables: {
            portfolioId,
            teamId,
            portfolioEvents: eventsToUpdate.map((event) => ({
              name: DOMPurify.sanitize(event?.name, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }),
              description: DOMPurify.sanitize(event?.description, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }),
              start: DOMPurify.sanitize(dayjs(event?.start).format(GLOBAL_DATE_FORMAT), {
                ALLOWED_TAGS: [],
                ALLOWED_ATTR: [],
              }),
              end: DOMPurify.sanitize(dayjs(event?.end).format(GLOBAL_DATE_FORMAT), {
                ALLOWED_TAGS: [],
                ALLOWED_ATTR: [],
              }),
              category: DOMPurify.sanitize(event?.category, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }),
              impact: DOMPurify.sanitize(event?.impact, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }),
            })),
          },
        });

        if (updateData?.bulkUpdatePortfolioEvents?.portfolioEvents?.length) {
          track(EVENT.PORTFOLIO_EVENT_UPLOAD_BULK_UPDATE);
          allEventIds = updateData?.bulkUpdatePortfolioEvents?.portfolioEvents.map((event) => event.portfolioEventId);
        }
      }

      // Then, handle events that need to be created
      if (eventsToCreate?.length) {
        const { data: createData } = await bulkCreatePortfolioEvents({
          variables: {
            portfolioId,
            teamId,
            portfolioEvents: eventsToCreate.map((event) => ({
              name: DOMPurify.sanitize(event?.name, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }),
              description: DOMPurify.sanitize(event?.description, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }),
              start: DOMPurify.sanitize(dayjs(event?.start).format(GLOBAL_DATE_FORMAT), {
                ALLOWED_TAGS: [],
                ALLOWED_ATTR: [],
              }),
              end: DOMPurify.sanitize(dayjs(event?.end).format(GLOBAL_DATE_FORMAT), {
                ALLOWED_TAGS: [],
                ALLOWED_ATTR: [],
              }),
              category: DOMPurify.sanitize(event?.category, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }),
              impact: DOMPurify.sanitize(event?.impact, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }),
            })),
          },
        });

        if (createData?.bulkCreatePortfolioEvents?.portfolioEvents?.length) {
          track(EVENT.PORTFOLIO_EVENT_UPLOAD_BULK_CREATE);

          allEventIds = [
            ...allEventIds,
            ...createData.bulkCreatePortfolioEvents.portfolioEvents.map((event) => event.portfolioEventId),
          ];
        }
      }

      if (allEventIds.length > 0) {
        setCreatedPortfolioEventIds(allEventIds);
        toast.success('Events successfully added to portfolio');
        nextStep();
      }
    } catch (err) {
      toast.error(err.message);
      console.error(err);
    }
  };

  const handleAssignContents = () => {
    assignContents({
      variables: {
        portfolioId,
        teamId,
        includesAllContents,
        contentRuleIds: selectedContentRules?.map((rule) => rule.contentRuleId),
        assignedContentIds: includesAllContents ? [] : selectedContentIds,
        portfolioEventIds: createdPortfolioEventIds,
      },
    }).then(() => {
      toast.success('Successfully assigned contents to events');
      handleClose();
    });
  };

  const handleClose = () => {
    onClose();
    resetStep();
    resetSelectedContentRules();
    setParsedEvents({
      eventsToCreate: [],
      eventsToUpdate: [],
    });
  };

  const canSubmit =
    step === 1
      ? parsedEvents.eventsToUpdate?.length || parsedEvents.eventsToCreate?.length
      : selectedEventIds?.length > 0 && (includesAllContents || selectedContentIds?.length > 0);

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
        <h3 className="text-xl font-medium text-neutral-900">Create events</h3>
      </div>
      <SidePanelContent className="!p-0">
        <StepperWrapper className="!w-[24%] border-r-[1px] border-[#EAEAEA] p-6">
          <VerticalStepper className="max-w-80 !p-0" current={step} steps={UPLOAD_PORTFOLIO_EVENT_CREATION_STEPS} />
        </StepperWrapper>
        <StepWrapper>
          {step === 1 ? (
            <PortfolioEventsFileUpload setParsedEvents={setParsedEvents} />
          ) : (
            <div>
              <div className="mt-8">
                <div className="text-[20px] font-medium tracking-normal">Assign contents</div>
              </div>
              <PortfolioEventAssignContents
                renderSubtitle
                renderTitle={false}
                portfolioEvents={[...(parsedEvents.eventsToUpdate || []), ...(parsedEvents.eventsToCreate || [])]}
                setIncludesAllContents={setIncludesAllContents}
                selectedEventIds={selectedEventIds}
                setSelectedEventIds={setSelectedEventIds}
              />
            </div>
          )}
        </StepWrapper>
      </SidePanelContent>
      <SidePanelActions>
        {step > 1 ? (
          <Button
            color="secondary"
            variant="contained"
            style={{
              marginRight: 'auto',
            }}
            onClick={handleClose}
            id="previousStepBtn"
          >
            Assign contents later
          </Button>
        ) : null}
        <ButtonAsync
          id="next"
          variant="contained"
          color="primary"
          disabled={!canSubmit || loadingCreate || loadingUpdate || loadingAssignContents}
          loading={loadingCreate || loadingUpdate || loadingAssignContents}
          onClick={() => {
            if (step === 1) {
              handleSaveEvent();
            } else {
              handleAssignContents();
            }
          }}
          style={{
            marginLeft: 'auto',
          }}
        >
          {step === 1 ? 'Add events and continue' : 'Assign contents'}
        </ButtonAsync>
      </SidePanelActions>
    </SidePanel>
  );
};
