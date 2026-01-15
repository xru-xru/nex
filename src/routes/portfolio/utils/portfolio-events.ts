import dayjs from 'dayjs';
import {
  NexoyaContentRule,
  NexoyaContentV2,
  NexoyaEventCategory,
  NexoyaEventImpact,
  NexoyaPortfolioEvent,
  NexoyaPortfolioEventSnapshot,
} from '../../../types';
import { DuplicateEvent } from '../components/PortfolioEvents/PortfolioEventsFileUpload';
import { ENV_VARS_WRAPPER } from '../../../configs/envVariables';

export const GET_PORTFOLIO_EVENT_ASSET_API_URL = (portfolioEventId: string) =>
  window[ENV_VARS_WRAPPER]?.REACT_APP_API_BASE_URL.replace('graphql', '') +
  `portfolio-events/${portfolioEventId}/asset`;

export const createFormDataWithFile = (file: File | null | undefined, teamId: number) => {
  const formData = new FormData();
  if (file) {
    formData.append('file', file);
  }
  formData.append('teamId', teamId?.toString());
  return formData;
};

export const getPortfolioEventsWithinTimeframe = ({ portfolioEvents, start, end }) => {
  return portfolioEvents?.filter((event) => isPortfolioEventWithinTimeframe({ event, start, end }));
};

export const isPortfolioEventWithinTimeframe = ({ event, start, end }) => {
  const eventStart = dayjs(event.start);
  const eventEnd = dayjs(event.end);

  return (
    // Event starts within optimization period
    eventStart.isBetween(dayjs(start), dayjs(end), null, '[]') ||
    // Event ends within optimization period
    eventEnd.isBetween(dayjs(start), dayjs(end), null, '[]') ||
    // Event spans across optimization period
    (eventStart.isBefore(dayjs(start)) && eventEnd.isAfter(dayjs(end)))
  );
};

export const findDuplicateEvents = (
  newEvents: Partial<NexoyaPortfolioEvent>[],
  existingEvents: NexoyaPortfolioEvent[],
): DuplicateEvent[] => {
  return newEvents.reduce((duplicates: DuplicateEvent[], newEvent) => {
    const duplicate = existingEvents.find((existing) => existing.name === newEvent.name);
    if (duplicate) {
      duplicates.push({ existing: duplicate, new: newEvent });
    }
    return duplicates;
  }, []);
};

export const calculateImpactedContentsForEvent = ({
  contentRules,
  assignedContents,
}: {
  contentRules: NexoyaContentRule[];
  assignedContents: NexoyaContentV2[];
}) => {
  const contentRulesImpactedContents = contentRules?.reduce((acc, rule) => {
    return acc + rule.matchingDiscoveredContentsCount;
  }, 0);
  const assignedContentsCount = assignedContents?.length || 0;
  return contentRulesImpactedContents + assignedContentsCount;
};

export const calculateMaximumNumberOfOverlappingEvents = ({
  portfolioEvents,
}: {
  portfolioEvents: NexoyaPortfolioEvent[] | NexoyaPortfolioEventSnapshot[];
}): number => {
  if (!portfolioEvents || portfolioEvents.length === 0) {
    return 0;
  }

  // Create an array of time points with event start and end times
  const timePoints: { time: number; isStart: boolean }[] = [];

  // Process each event and add its start and end times to the timePoints array
  portfolioEvents.forEach((event) => {
    const startTime = new Date(event.start).getTime();
    const endTime = new Date(event.end).getTime();

    timePoints.push({ time: startTime, isStart: true });
    timePoints.push({ time: endTime, isStart: false });
  });

  // Sort the time points by time
  // If two points have the same time, put the end time before the start time
  // This is important to handle cases where events end exactly when others start
  timePoints.sort((a, b) => {
    if (a.time !== b.time) {
      return a.time - b.time;
    }
    // If times are equal, place end times first
    return a.isStart ? 1 : -1;
  });

  let currentOverlaps = 0;
  let maxOverlaps = 0;

  // Sweep through the time points
  timePoints.forEach((point) => {
    if (point.isStart) {
      // An event starts, increment the current overlap count
      currentOverlaps++;
      // Update the maximum overlap count if current is greater
      maxOverlaps = Math.max(maxOverlaps, currentOverlaps);
    } else {
      // An event ends, decrement the current overlap count
      currentOverlaps--;
    }
  });

  return maxOverlaps;
};

export const convertToPortfolioEvents = ({ parsedData, columnMapping }): Partial<NexoyaPortfolioEvent>[] => {
  return parsedData.map((row: any) => ({
    __typename: 'PortfolioEvent',
    portfolioEventId: Math.random(),
    name: row[columnMapping.name],
    description: columnMapping.description ? row[columnMapping.description] : null,
    start: new Date(row[columnMapping.start]),
    end: new Date(row[columnMapping.end]),
    category: row[columnMapping.category] as NexoyaEventCategory,
    impact: row[columnMapping.impact] as NexoyaEventImpact,
    created: new Date().toISOString(),
  }));
};

export const validateEvents = (events: NexoyaPortfolioEvent[]) => {
  const validImpacts = [NexoyaEventImpact.Large, NexoyaEventImpact.Small];
  const validCategories = [
    NexoyaEventCategory.BrandAwareness,
    NexoyaEventCategory.NegativeExternalEffects,
    NexoyaEventCategory.PositiveExternalEffects,
    NexoyaEventCategory.PriceIncrease,
    NexoyaEventCategory.PositiveExternalEffects,
    NexoyaEventCategory.PromotionAndDiscounts,
    NexoyaEventCategory.ProductLaunch,
    NexoyaEventCategory.TrackingIssue,
  ];

  const invalidEvents = [];

  events?.forEach((event, index) => {
    if (event.impact && !validImpacts.includes(event.impact)) {
      invalidEvents.push({
        index,
        field: 'impact',
        value: event.impact,
        allowed: validImpacts.join(', '),
      });
    }

    if (event.category && !validCategories.includes(event.category)) {
      invalidEvents.push({
        index,
        field: 'category',
        value: event.category,
        allowed: validCategories.join(', '),
      });
    }
  });

  return invalidEvents;
};
