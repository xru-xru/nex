import { VerticalStep } from '../components/VerticalStepper/Step';

export const MANUAL_PORTFOLIO_EVENT_CREATION_STEPS = (isEditMode: boolean): VerticalStep[] =>
  [
    {
      id: 'portfolio-event-details',
      name: 'Enter event information',
      description: 'Name the event, set its timeframe and define the event’s impact.',
    },
    !isEditMode
      ? {
          id: 'portfolio-event-contents',
          name: 'Assign contents',
          description: 'Define which contents are impacted by the event.',
        }
      : null,
  ].filter(Boolean);

export const UPLOAD_PORTFOLIO_EVENT_CREATION_STEPS: VerticalStep[] = [
  {
    id: 'upload-file',
    name: 'Upload file',
    description: 'Upload a file with event data and review columns to make sure they align.',
  },
  {
    id: 'portfolio-event-contents',
    name: 'Assign contents',
    description: 'Define which contents are impacted by the event.',
  },
];
