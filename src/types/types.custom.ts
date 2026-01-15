import dayjs from 'dayjs';

import { NexoyaMetric, NexoyaPageInfo, NexoyaSimulationScenario } from './types';

export type ObjectMap<T> = Record<string, T>;
export type ReportType = 'PORTFOLIO' | 'KPI' | 'CHANNEL';
export type PopperPlacement =
  | 'bottom-end'
  | 'bottom-start'
  | 'bottom'
  | 'left-end'
  | 'left-start'
  | 'left'
  | 'right-end'
  | 'right-start'
  | 'right'
  | 'top-end'
  | 'top-start'
  | 'top';

export type Auth0ParsedHash = {
  expiresIn: number;
  accessToken: string;
  state: string | null | undefined;
};
export type RangeTypes =
  | '7days'
  | '30days'
  | '90days'
  | 'currentWeek'
  | 'currentMonth'
  | 'currentYear'
  | 'lastWeek'
  | 'lastMonth'
  | 'lastYear'
  | 'custom';
export type DateRange = {
  dateFrom: Date;
  dateTo: Date;
};
export type UIDateRange = {
  key: RangeTypes;
  label: string;
  range: {
    dateFrom: Date;
    dateTo: Date;
  };
};
export type PredictPoint = {
  timestamp: Date;
  value: number;
  smoothValue: number;
  valueLower: number;
  valueUpper: number;
};
export type Event<T> = {
  // type: string, // TODO: make enum
  event_id: number;
  content: string;
  timestamp: Date;
  smoothValue: number;
  ref: T;
};

export type Prediction<T> = {
  data: PredictPoint[];
  ref: T;
};
export type DayjsObj = dayjs.Dayjs;
export type PaginatedNode<T> = {
  node: T;
  cursor: string;
};
export type PaginatedQuery<T> = {
  edges: [PaginatedNode<T>];
  pageInfo: {
    hasNextPage: boolean;
    endCursor: string;
  };
};
export type ConnectionEdges<T> = {
  node: T;
  cursor: string;
};
export type PaginationConnection<T> = {
  edges: ConnectionEdges<T>[];
  pageInfo: NexoyaPageInfo;
};
// TODO: Remove this as soon as we integrated reporting because the types
// from server will be updated with this type.
export type KpiInput = {
  measurement_id: number;
  collection_id: number;
};
export type CollectionInput = {
  collection_id: number;
};
export type RemoteKpiMutOptions = {
  measurementId: number;
  collectionId: number;
};
export type ThunkMutFn<T> = (arg0: T) => () =>
  | Promise<void>
  | Promise<{
      data: any;
    }>
  | void;
export type Channels = 2 | 12 | 13 | 25 | 22;
export type ChannelInput = {
  collection_id: Channels;
  __typename?: 'Measurement';
};
export type CollectionNode = {
  provider: {
    provider_id: Channels;
    name: string;
    logo: string;
  };
};
export type CollectionEdges<T> = {
  node: T;
};
export type NexoyaContentReport = CollectionNode & {
  kpis: NexoyaMetric[];
  __typename: 'ChannelReportContent';
};
export type ShareItemTypes = 'report' | 'funnel' | 'portfolio';
export type CorrelationChartData = {
  metric: string;
  order: number;
  value: number | string | null;
};
export type ChannelCollectionEdge = CollectionNode & CollectionInput;

export type PortfolioTimeSpanSwitch = 'left' | 'right';

export type PortfolioCollectionContent = {
  collection_id: number;
  portfolio_content_id: number;
};

export type DatePickerDateRange = {
  from: Date;
  to: Date;
};

export enum PaginationTypes {
  // eslint-disable-next-line no-unused-vars
  DECREMENT = 'decrement',
  // eslint-disable-next-line no-unused-vars
  INCREMENT = 'increment',
  // eslint-disable-next-line no-unused-vars
  NUMERATION = 'numeration',
}
export type BrickDataFormatted = {
  title: string;
  value: string;
};

export type TypeConstructor<Type> = Type extends String
  ? StringConstructor
  : Type extends Date
    ? DateConstructor
    : Type extends Number
      ? NumberConstructor
      : Type extends Boolean
        ? BooleanConstructor
        : never;

type BorderStyle =
  | 'hair'
  | 'dotted'
  | 'dashDotDot'
  | 'dashDot'
  | 'dashed'
  | 'thin'
  | 'mediumDashDotDot'
  | 'slantDashDot'
  | 'mediumDashDot'
  | 'mediumDashed'
  | 'medium'
  | 'double'
  | 'thick';

type FontWeight = 'bold';

type FontStyle = 'italic';

type Color = string;
export interface CellStyle {
  align?: 'left' | 'center' | 'right';
  alignVertical?: 'top' | 'center' | 'bottom';
  height?: number;
  span?: number;
  rowSpan?: number;
  wrap?: boolean;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: FontWeight;
  fontStyle?: FontStyle;
  color?: Color;
  backgroundColor?: Color;
  borderColor?: Color;
  borderStyle?: BorderStyle;
  leftBorderColor?: Color;
  leftBorderStyle?: BorderStyle;
  rightBorderColor?: Color;
  rightBorderStyle?: BorderStyle;
  topBorderColor?: Color;
  topBorderStyle?: BorderStyle;
  bottomBorderColor?: Color;
  bottomBorderStyle?: BorderStyle;
}
export interface Row<Type> extends CellStyle {
  value?: number | string;
  type?: TypeConstructor<Type>;
  format?: string;
}

export interface NexoyaTargetDailyItem {
  date: string;
  value: number;
  maxBudget: number;
}

export interface ExtendedNexoyaSimulationScenario extends NexoyaSimulationScenario {
  idx: number;
}

export {};
