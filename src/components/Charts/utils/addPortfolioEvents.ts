import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4core from '@amcharts/amcharts4/core';
import { nexyColors } from '../../../theme';
import dayjs from 'dayjs';
import { getCategoryInfo, getEmojiForCategory } from '../../../utils/portfolioEvents';
import { NexoyaPortfolioEvent, NexoyaPortfolioEventSnapshot } from '../../../types';
import {
  calculateImpactedContentsForEvent,
  calculateMaximumNumberOfOverlappingEvents,
  isPortfolioEventWithinTimeframe,
} from '../../../routes/portfolio/utils/portfolio-events';

const MAX_NUMBER_OF_OVERLAPPING_EVENTS = 100;

const getShadow = () => {
  const shadow = new am4core.DropShadowFilter();
  shadow.dx = 0;
  shadow.dy = 2;
  shadow.blur = 2;
  shadow.opacity = 0.13;
  shadow.color = am4core.color('#D7D7D8');
  return shadow;
};

const getTooltipHTML = (event: NexoyaPortfolioEvent | NexoyaPortfolioEventSnapshot) => {
  const isSnapshot = event.__typename === 'PortfolioEventSnapshot';

  // @ts-ignore
  const assetUrl = event.assetUrl || '';

  const totalImpactedContents = isSnapshot
    ? event.contentIds?.length
    : calculateImpactedContentsForEvent({
        assignedContents: event?.assignedContents,
        contentRules: event?.contentRules,
      });

  const impactedContentsString = `${isSnapshot ? totalImpactedContents + ' contents' : event?.includesAllContents ? 'All contents' : totalImpactedContents ? totalImpactedContents + ' contents' : 'No contents'}`;
  return `<div style="border-bottom: 1px solid ${nexyColors.charcoalGrey}; color: ${nexyColors.seasalt}; text-transform: uppercase; padding: 4px 12px 8px 12px; text-align: center">
            ${event.name}
          </div>
            ${
              assetUrl
                ? `
              <div>
                <div style="height: 132px; width: 315px; overflow: hidden; padding: 12px 12px 0; display: flex; justify-content: space-between; gap: 16px">
                  ${
                    assetUrl.match(/\.(mp4|mov)$/i)
                      ? `<video src="${assetUrl}" style="width: 100%; height: 100%; border-radius: 3px; object-fit: cover;" loop muted autoplay />`
                      : `<div style="width: 100%; aspect-ratio: 16/9; position: relative;">
                           <img src="${assetUrl}" alt="Event Image" style="position: absolute; width: 100%; height: 100%; border-radius: 3px; object-fit: cover;" />
                         </div>`
                  }
                </div>
              </div>
            `
                : ''
            }
            <div style="padding:12px 12px 0;display: flex;justify-content: space-between; gap: 16px; min-width: 125px">
              <span style="color: #C7C8D1; font-weight: 300">Timeframe:</span>
              ${dayjs(event.start).format('MMM D YYYY')} - ${dayjs(event.end).format('MMM D YYYY')}
            </div>
            <div style="padding:8px 12px 0;display: flex;justify-content: space-between; gap: 16px; min-width: 125px">
              <span style="color: #C7C8D1; font-weight: 300">Category:</span>
              ${getCategoryInfo(event.category)?.title}
            </div>
            <div style="padding:8px 12px 0;display: flex;justify-content: space-between; gap: 16px; min-width: 125px">
              <span style="color: #C7C8D1; font-weight: 300">Impact:</span>
              <span style="text-transform: capitalize">${event.impact?.toLowerCase()}</span>
            </div>
            <div style="padding:8px 12px 12px;display: flex;justify-content: space-between; gap: 16px; min-width: 125px">
              <span style="color: #C7C8D1; font-weight: 300">Contents:</span>
              ${impactedContentsString}
            </div>
          </div>

`;
};

export function addPortfolioEvents({
  dateAxis,
  portfolioEvents = [],
  timeperiod,
  timeperiodComparison,
  dateComparisonActive,
  getSeriesColor,
  extended,
}: {
  dateAxis: am4charts.DateAxis;
  portfolioEvents: NexoyaPortfolioEvent[] | NexoyaPortfolioEventSnapshot[];
  extended?: boolean;
  getSeriesColor?: (type: string) => string;
  dateComparisonActive?: boolean;
  timeperiod?: {
    start: string;
    end: string;
  };
  timeperiodComparison?: {
    start: string;
    end: string;
  };
}) {
  if (!portfolioEvents?.length) return;

  const maximumNumberOfOverlappingEvents = calculateMaximumNumberOfOverlappingEvents({
    portfolioEvents,
  });

  const BAR_HEIGHT = extended ? 24 : 8;
  const BAR_SPACING = 6;

  // Create container
  const container = dateAxis.createChild(am4core.Container);
  container.width = am4core.percent(100);
  container.height = (BAR_HEIGHT + BAR_SPACING) * maximumNumberOfOverlappingEvents;
  container.marginTop = 12;
  container.align = 'left'; // Changed from center
  container.valign = 'bottom';
  container.zIndex = 1; // Ensure container is visible

  dateAxis.events.on('validated', () => {
    container.removeChildren(); // Clear existing bars
    const sortedEvents = [...portfolioEvents].sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
    const rows: { end: number; bar: am4core.RoundedRectangle }[][] = Array(MAX_NUMBER_OF_OVERLAPPING_EVENTS)
      .fill([])
      .map(() => []);

    sortedEvents.forEach((event) => {
      const eventBar = container.createChild(am4core.RoundedRectangle);
      const start = dayjs(event.start).utc().endOf('day').toDate();
      const end = dayjs(event.end).utc().endOf('day').toDate();

      let rowIndex = 0;
      const startTime = start.getTime();

      while (rowIndex < rows.length) {
        const rowEvents = rows[rowIndex];
        const hasOverlap = rowEvents.some((existing) => existing.end > startTime);
        if (!hasOverlap) break;
        rowIndex++;
      }

      if (rowIndex >= rows.length) rowIndex = rows.length - 1;

      // Set bar properties
      eventBar.height = BAR_HEIGHT;
      if (dateComparisonActive) {
        const isEventWithinTimeperiod = isPortfolioEventWithinTimeframe({
          event,
          start: timeperiod?.start,
          end: timeperiod?.end,
        });

        const isEventWithinTimeperiodComparison = isPortfolioEventWithinTimeframe({
          event,
          start: timeperiodComparison?.start,
          end: timeperiodComparison?.end,
        });

        let eventBarColor;

        if (isEventWithinTimeperiod) {
          eventBarColor = getSeriesColor('potential');
        } else if (isEventWithinTimeperiodComparison) {
          eventBarColor = getSeriesColor('past');
        }
        eventBar.fill = am4core.color(eventBarColor);
        eventBar.fillOpacity = 0.6;
      } else {
        eventBar.fill = am4core.color(nexyColors.neutral100);
        eventBar.fillOpacity = 1;
      }
      eventBar.strokeOpacity = 0;
      eventBar.cornerRadiusTopLeft = 5;
      eventBar.cornerRadiusTopRight = 5;
      eventBar.cornerRadiusBottomLeft = 5;
      eventBar.cornerRadiusBottomRight = 5;
      eventBar.filters.push(getShadow());

      const startX = dateAxis.dateToPosition(start);
      const endX = dateAxis.dateToPosition(end);
      const visibleStartX = Math.max(0, startX); // Ensure we don't go below 0
      const visibleEndX = Math.min(1, endX); // Ensure we don't exceed container width
      const visibleWidth = (visibleEndX - visibleStartX) * container.pixelWidth;

      eventBar.x = startX * container.pixelWidth;
      eventBar.width = Math.max((endX - startX) * container.pixelWidth, BAR_HEIGHT); // Minimum width
      eventBar.y = rowIndex * (BAR_HEIGHT + BAR_SPACING);

      // Add label when extended
      const label = container.createChild(am4core.Label);
      const emojiCircle = container.createChild(am4core.Circle);
      emojiCircle.fill = am4core.color(nexyColors.neutral50);
      emojiCircle.stroke = am4core.color(nexyColors.neutral200);
      emojiCircle.strokeWidth = 1;
      emojiCircle.interactionsEnabled = false;
      emojiCircle.isActive = false;

      // Calculate minimum width needed for emoji display
      const MIN_WIDTH_FOR_EMOJI = 140;

      if (extended) {
        label.text = event.name;
        label.x = visibleStartX * container.pixelWidth + visibleWidth / 2;
        label.y = eventBar.y + BAR_HEIGHT / 2;
        label.fontSize = 11;
        label.maxWidth = visibleWidth - 12;
        label.paddingLeft = 8;

        // Only show emoji circle and label if there's enough space
        if (visibleWidth >= MIN_WIDTH_FOR_EMOJI) {
          emojiCircle.radius = 9;
          emojiCircle.x = visibleStartX * container.pixelWidth + 15;
          emojiCircle.y = eventBar.y + BAR_HEIGHT / 2;

          const emojiLabel = container.createChild(am4core.Label);
          emojiLabel.text = getEmojiForCategory(event.category);
          emojiLabel.x = emojiCircle.x + 1;
          emojiLabel.y = emojiCircle.y;
          emojiLabel.fontSize = 11;
          emojiLabel.horizontalCenter = 'middle';
          emojiLabel.verticalCenter = 'middle';
          emojiLabel.zIndex = 2;
          emojiLabel.interactionsEnabled = false;
          emojiLabel.isActive = false;
        } else {
          // Hide circle and don't create emoji label
          emojiCircle.visible = false;
        }
      } else {
        if (eventBar.width >= MIN_WIDTH_FOR_EMOJI) {
          emojiCircle.radius = BAR_HEIGHT + 2;
          emojiCircle.x = eventBar.x + eventBar.width / 2;
          emojiCircle.y = eventBar.y + BAR_HEIGHT / 2;
          label.text = getEmojiForCategory(event.category);
          label.x = emojiCircle.x + 1;
          label.y = emojiCircle.y;
          label.zIndex = 2;
          label.fontSize = 11;
        } else {
          emojiCircle.visible = false;
          label.visible = false;
        }
      }
      label.fill = am4core.color(nexyColors.neutral900);

      label.horizontalCenter = 'middle';
      label.verticalCenter = 'middle';
      label.truncate = true;
      label.maxWidth = eventBar.width < MIN_WIDTH_FOR_EMOJI ? eventBar.width - 12 : eventBar.width - 24;

      label.interactionsEnabled = false;
      label.isActive = false; // Prevent label from capturing events

      eventBar.tooltip.pointerOrientation = 'right';
      eventBar.tooltip.getFillFromObject = false;
      eventBar.tooltip.background.fillOpacity = 1;
      eventBar.tooltip.background.fill = am4core.color(nexyColors.darkGrey);
      eventBar.tooltip.background.stroke = am4core.color(nexyColors.darkGrey);
      eventBar.tooltip.label.fontSize = 12;
      eventBar.tooltip.background.pointerLength = 0;
      eventBar.tooltip.label.paddingLeft = 0;
      eventBar.tooltip.label.paddingRight = 0;
      eventBar.tooltip.label.paddingBottom = 0;
      eventBar.tooltip.label.interactionsEnabled = true;
      eventBar.tooltip.clickable = true;
      eventBar.tooltip.keepTargetHover = true;
      eventBar.tooltip.dy = -150;
      eventBar.tooltip.dx = -10;
      eventBar.tooltip.animationDuration = 150;
      eventBar.tooltip.animationEasing = am4core.ease.sinOut;
      eventBar.tooltipPosition = 'pointer';

      eventBar.tooltipHTML = getTooltipHTML(event);

      const hoverState = eventBar.states.create('hover');
      hoverState.properties.fillOpacity = 0.5;
      eventBar.cursorOverStyle = am4core.MouseCursorStyle.pointer;

      rows[rowIndex].push({ end: end.getTime(), bar: eventBar });
    });
  });

  return container;
}
