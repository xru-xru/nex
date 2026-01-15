// Define standard chart features
// TODO: Maybe move into a theme later on
import nexyColors from '../../../theme';

export const CHARTS_CONFIG = {
  // Axis labels, grid etc
  AXIS_LABEL_FONT_SIZE: 12,
  // line series
  LINE_STROKE_WIDTH: 3,
  // Tooltip
  TOOLTIP_FONT_SIZE: 12,
  TOOLTIP_LABEL_BORDER: nexyColors.nexy.charcoalGrey,
  // Colors
  AXIS_GRID_FILL: nexyColors.nexy.paleGrey,
  AXIS_LABEL_FILL: nexyColors.nexy.cloudyBlue80,
  TOOLTIP_BACKGROUND_FILL: nexyColors.nexy.darkGrey,
  TOOLTIP_BACKGROUND_STROKE: nexyColors.nexy.darkGrey,
  CORRELATION_CONTAINER_ID: 'correlations-kpi-chart',
  CORRELATION_CELL_SIZE: 63,
  CORRELATION_GRID_FILL: nexyColors.nexy.cloudyBlue,
  CORRELATION_TEMPLATE_FILL: nexyColors.nexy.paleGrey,
  CORRELATION_HEADER_BACKGROUND: 'rgba(255, 255, 255, 0)',
};
