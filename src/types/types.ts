import * as Apollo from '@apollo/client';
import { gql } from '@apollo/client';

export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  _Any: { input: any; output: any };
  _FieldSet: { input: any; output: any };
  Date: { input: any; output: any };
  DateTime: { input: any; output: any };
  JSON: { input: any; output: any };
  JSONObject: { input: any; output: any };
};

export type Nexoya_Entity =
  | NexoyaCollection
  | NexoyaCoreMetricValues
  | NexoyaMeasurement
  | NexoyaOtherFunnelStepMetrics
  | NexoyaPortfolio
  | NexoyaProvider
  | NexoyaUser;

export type Nexoya_Service = {
  __typename?: '_Service';
  sdl?: Maybe<Scalars['String']['output']>;
};

export type NexoyaAccuracyBucket = {
  __typename?: 'AccuracyBucket';
  contentCount: Scalars['Int']['output'];
  threshold: Scalars['Int']['output'];
};

export type NexoyaApplicableAttributionRule = {
  __typename?: 'ApplicableAttributionRule';
  attributionRule: NexoyaAttributionRule;
  isApplied: Scalars['Boolean']['output'];
};

export type NexoyaApplicableContentRule = {
  __typename?: 'ApplicableContentRule';
  contentRule: NexoyaContentRule;
  isApplied: Scalars['Boolean']['output'];
};

export type NexoyaApplicableImpactGroupRule = {
  __typename?: 'ApplicableImpactGroupRule';
  impactGroupRule: NexoyaImpactGroupRule;
  isApplied: Scalars['Boolean']['output'];
};

export type NexoyaApplyRulesToDiscoveredContentsMutationResponse = {
  __typename?: 'ApplyRulesToDiscoveredContentsMutationResponse';
  appliedAttributionRules: Scalars['Int']['output'];
  appliedContentRules: Scalars['Int']['output'];
  appliedImpactGroupRules: Scalars['Int']['output'];
};

export type NexoyaApplyRulesToDiscoveredContentsRulesMapInput = {
  attributionRuleId?: InputMaybe<Scalars['Float']['input']>;
  contentRuleId?: InputMaybe<Scalars['Float']['input']>;
  discoveredContentId: Scalars['Float']['input'];
  impactGroupRuleId?: InputMaybe<Scalars['Float']['input']>;
};

export enum NexoyaArgumentAuthorizationRules {
  AttributionModelIsPartOfTeam = 'AttributionModelIsPartOfTeam',
  AttributionRuleIsPartOfTeam = 'AttributionRuleIsPartOfTeam',
  BudgetItemIsPartOfTeam = 'BudgetItemIsPartOfTeam',
  CollectionIsPartOfTeam = 'CollectionIsPartOfTeam',
  ContentRuleIsPartOfTeam = 'ContentRuleIsPartOfTeam',
  CurrencyExchangeTimeframeIsPartOfTeam = 'CurrencyExchangeTimeframeIsPartOfTeam',
  FileIsPartOfAttributionModel = 'FileIsPartOfAttributionModel',
  FunnelStepIsPartOfTeam = 'FunnelStepIsPartOfTeam',
  FunnelStepMappingPresetIsPartOfTeam = 'FunnelStepMappingPresetIsPartOfTeam',
  ImpactGroupIsPartOfTeam = 'ImpactGroupIsPartOfTeam',
  ImpactGroupRuleIsPartOfTeam = 'ImpactGroupRuleIsPartOfTeam',
  IsUserThemselves = 'IsUserThemselves',
  KpisCollectionsBelongToTeam = 'KpisCollectionsBelongToTeam',
  LabelIsPartOfTeam = 'LabelIsPartOfTeam',
  ManyAttributionRulesArePartOfTeam = 'ManyAttributionRulesArePartOfTeam',
  ManyContentRulesArePartOfTeam = 'ManyContentRulesArePartOfTeam',
  ManyImpactGroupRulesArePartOfTeam = 'ManyImpactGroupRulesArePartOfTeam',
  OptimizationIsPartOfTeam = 'OptimizationIsPartOfTeam',
  PortfolioContentIsPartOfTeam = 'PortfolioContentIsPartOfTeam',
  PortfolioEventIsPartOfTeam = 'PortfolioEventIsPartOfTeam',
  PortfolioEventsArePartOfTeam = 'PortfolioEventsArePartOfTeam',
  PortfolioIsPartOfTeam = 'PortfolioIsPartOfTeam',
  PortfolioTargetItemIsPartOfTeam = 'PortfolioTargetItemIsPartOfTeam',
  ScenarioIsPartOfTeam = 'ScenarioIsPartOfTeam',
  SimulationIsPartOfTeam = 'SimulationIsPartOfTeam',
}

export type NexoyaAssignContentsAndRulesToPortfolioEventsResponse = {
  __typename?: 'AssignContentsAndRulesToPortfolioEventsResponse';
  portfolioEvents: Array<NexoyaPortfolioEvent>;
};

export type NexoyaAttributionMetricTotal = {
  __typename?: 'AttributionMetricTotal';
  attributed: Scalars['Float']['output'];
  changePercent: Scalars['Float']['output'];
  measured: Scalars['Float']['output'];
};

export type NexoyaAttributionModel = {
  __typename?: 'AttributionModel';
  attributionModelId: Scalars['String']['output'];
  channelFilters: Array<NexoyaAttributionModelChannelFilter>;
  createdAt: Scalars['DateTime']['output'];
  exportEnd?: Maybe<Scalars['Date']['output']>;
  exportStart: Scalars['Date']['output'];
  files: Array<NexoyaFile>;
  ga4Filters: NexoyaAttributionModelGa4Filters;
  name: Scalars['String']['output'];
  status: NexoyaAttributionModelStatus;
  targetMetric: Scalars['String']['output'];
  teamId: Scalars['Int']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type NexoyaAttributionModelChannelFilter = {
  __typename?: 'AttributionModelChannelFilter';
  adAccountIds: Array<Scalars['Float']['output']>;
  contentFilters: Array<NexoyaContentFilter>;
  conversions: Array<NexoyaAttributionModelConversion>;
  providerId: Scalars['Int']['output'];
};

export type NexoyaAttributionModelChannelFilterInput = {
  adAccountIds: Array<Scalars['Float']['input']>;
  contentFilters: Array<NexoyaContentFilterInput>;
  conversions: Array<NexoyaAttributionModelConversionInput>;
  providerId: Scalars['Int']['input'];
};

export type NexoyaAttributionModelConnection = {
  __typename?: 'AttributionModelConnection';
  edges: Array<NexoyaAttributionModelEdge>;
  pageInfo: NexoyaPageInfo;
  totalPages: Scalars['Int']['output'];
};

export type NexoyaAttributionModelConversion = {
  __typename?: 'AttributionModelConversion';
  conversionId: Scalars['String']['output'];
  metricAlias: Scalars['String']['output'];
};

export type NexoyaAttributionModelConversionInput = {
  conversionId: Scalars['String']['input'];
  metricAlias: Scalars['String']['input'];
};

export type NexoyaAttributionModelEdge = {
  __typename?: 'AttributionModelEdge';
  cursor: Scalars['String']['output'];
  node: NexoyaAttributionModel;
};

export type NexoyaAttributionModelGa4Filters = {
  __typename?: 'AttributionModelGa4Filters';
  dimensions: Array<Scalars['String']['output']>;
  metricIds: Array<Scalars['Int']['output']>;
};

export type NexoyaAttributionModelGa4FiltersInput = {
  dimensions: Array<Scalars['String']['input']>;
  metricIds: Array<Scalars['Int']['input']>;
};

export enum NexoyaAttributionModelStatus {
  Approved = 'APPROVED',
  Cancelled = 'CANCELLED',
  Draft = 'DRAFT',
  InReview = 'IN_REVIEW',
  Rejected = 'REJECTED',
  Running = 'RUNNING',
}

export type NexoyaAttributionOptimizedMetric = {
  __typename?: 'AttributionOptimizedMetric';
  attributed?: Maybe<Scalars['Float']['output']>;
  changePercent?: Maybe<Scalars['Float']['output']>;
  measured?: Maybe<Scalars['Float']['output']>;
};

export type NexoyaAttributionRule = {
  __typename?: 'AttributionRule';
  appliedDiscoveredContents: Array<NexoyaDiscoveredContent>;
  attributionRuleId: Scalars['Float']['output'];
  factors: Array<NexoyaAttributionRuleFactor>;
  filters: NexoyaAttributionRuleFilters;
  matchingDiscoveredContentsCount: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  portfolioId: Scalars['Float']['output'];
  teamId: Scalars['Float']['output'];
};

export type NexoyaAttributionRuleFactor = {
  __typename?: 'AttributionRuleFactor';
  attributionRuleFactorId: Scalars['Float']['output'];
  source: NexoyaAttributionRuleFactorSource;
  start: Scalars['Date']['output'];
  value: Scalars['Float']['output'];
};

export type NexoyaAttributionRuleFactorInput = {
  source: NexoyaAttributionRuleFactorSourceInput;
  start: Scalars['Date']['input'];
  value: Scalars['Float']['input'];
};

export type NexoyaAttributionRuleFactorSource = {
  __typename?: 'AttributionRuleFactorSource';
  accountConversionIds?: Maybe<Array<Scalars['String']['output']>>;
  conversionMetricId?: Maybe<Scalars['Int']['output']>;
  conversionName?: Maybe<Scalars['String']['output']>;
  metricId?: Maybe<Scalars['Int']['output']>;
  type: NexoyaAttributionRuleFactorSourceType;
};

export type NexoyaAttributionRuleFactorSourceInput = {
  accountConversionIds?: InputMaybe<Array<Scalars['String']['input']>>;
  conversionMetricId?: InputMaybe<Scalars['Int']['input']>;
  conversionName?: InputMaybe<Scalars['String']['input']>;
  metricId?: InputMaybe<Scalars['Int']['input']>;
  type: NexoyaAttributionRuleFactorSourceType;
};

export enum NexoyaAttributionRuleFactorSourceType {
  CustomConversion = 'CUSTOM_CONVERSION',
  Metric = 'METRIC',
}

export type NexoyaAttributionRuleFilters = {
  __typename?: 'AttributionRuleFilters';
  adAccountIds: Array<Scalars['Float']['output']>;
  contentFilters: Array<NexoyaContentFilter>;
  providerId: Scalars['Int']['output'];
};

export type NexoyaAttributionRuleFiltersInput = {
  adAccountIds: Array<Scalars['Float']['input']>;
  contentFilters: Array<NexoyaContentFilterInput>;
  providerId: Scalars['Int']['input'];
};

export type NexoyaAttributionRuleMetricTotal = {
  __typename?: 'AttributionRuleMetricTotal';
  attributionRule: NexoyaAttributionRule;
  comparisonChangePercent?: Maybe<NexoyaPerformanceMetric>;
  comparisonTotal?: Maybe<NexoyaPerformanceMetric>;
  contents: Array<NexoyaContentMetricTotal>;
  total: NexoyaPerformanceMetric;
};

export type NexoyaAttributionRulePerformanceTotal = {
  __typename?: 'AttributionRulePerformanceTotal';
  attributionRule: NexoyaAttributionRule;
  value: NexoyaAttributionMetricTotal;
};

export type NexoyaAttributionRuleUpdateFiltersPreviewQueryResponse = {
  __typename?: 'AttributionRuleUpdateFiltersPreviewQueryResponse';
  newMatchingDiscoveredContents: Array<Maybe<NexoyaDiscoveredContent>>;
  noLongerMatchingDiscoveredContents: Array<Maybe<NexoyaDiscoveredContent>>;
};

export type NexoyaAuthZDirectiveCompositeRulesInput = {
  and?: InputMaybe<Array<InputMaybe<NexoyaAuthZRules>>>;
  not?: InputMaybe<NexoyaAuthZRules>;
  or?: InputMaybe<Array<InputMaybe<NexoyaAuthZRules>>>;
};

export type NexoyaAuthZDirectiveDeepCompositeRulesInput = {
  and?: InputMaybe<Array<InputMaybe<NexoyaAuthZDirectiveDeepCompositeRulesInput>>>;
  id?: InputMaybe<NexoyaAuthZRules>;
  not?: InputMaybe<NexoyaAuthZDirectiveDeepCompositeRulesInput>;
  or?: InputMaybe<Array<InputMaybe<NexoyaAuthZDirectiveDeepCompositeRulesInput>>>;
};

export enum NexoyaAuthZRules {
  HasCollectionAccessToKpis = 'HasCollectionAccessToKpis',
  HasSupportRole = 'HasSupportRole',
  HasUserId = 'HasUserId',
  IsActiveUser = 'IsActiveUser',
  IsAdmin = 'IsAdmin',
  IsM2MUser = 'IsM2MUser',
  IsMemberOfCollectionTeam = 'IsMemberOfCollectionTeam',
  IsMemberOfOrg = 'IsMemberOfOrg',
  IsMemberOfTeam = 'IsMemberOfTeam',
  IsOwnUserId = 'IsOwnUserId',
  IsPartOfTeamOptional = 'IsPartOfTeamOptional',
  ShareUserHasWriteAccess = 'ShareUserHasWriteAccess',
  ShareUserHasWriteAccessNoTeamIdCollection = 'ShareUserHasWriteAccessNoTeamIdCollection',
  ShareUserHasWriteAccessNoTeamIdCollectionFromInput = 'ShareUserHasWriteAccessNoTeamIdCollectionFromInput',
  ShareUserHasWriteAccessNoTeamIdCustomKpi = 'ShareUserHasWriteAccessNoTeamIdCustomKPI',
  ShareUserHasWriteAccessNoTeamIdEvent = 'ShareUserHasWriteAccessNoTeamIdEvent',
  ShareUserHasWriteAccessNoTeamIdReport = 'ShareUserHasWriteAccessNoTeamIdReport',
  TeamHasReportAccess = 'TeamHasReportAccess',
  UserHasCustomKpiAccess = 'UserHasCustomKpiAccess',
  UserHasReportAccess = 'UserHasReportAccess',
}

export type NexoyaBiddingStrategy = {
  __typename?: 'BiddingStrategy';
  applicationDelta?: Maybe<Scalars['Float']['output']>;
  currentTcpa?: Maybe<Scalars['Float']['output']>;
  currentTroas?: Maybe<Scalars['Float']['output']>;
  dailyBudgetChange?: Maybe<Scalars['Float']['output']>;
  type: NexoyaBiddingStrategyType;
  value?: Maybe<Scalars['Float']['output']>;
};

export enum NexoyaBiddingStrategyType {
  BidCap = 'BID_CAP',
  CostCap = 'COST_CAP',
  MaximizeConversionValue = 'MAXIMIZE_CONVERSION_VALUE',
  MaximizeConversions = 'MAXIMIZE_CONVERSIONS',
  Other = 'OTHER',
  TargetCpa = 'TARGET_CPA',
  TargetRoas = 'TARGET_ROAS',
}

export type NexoyaBudget = {
  __typename?: 'Budget';
  allocatedValue: Scalars['Float']['output'];
  budgetDetails?: Maybe<Array<NexoyaBudgetDetail>>;
  budgetTotals?: Maybe<Array<NexoyaBudgetTotal>>;
  realizedValue: Scalars['Float']['output'];
  totalValue: Scalars['Float']['output'];
};

export type NexoyaBudgetDailyItem = {
  __typename?: 'BudgetDailyItem';
  budgetAmount: Scalars['Float']['output'];
  date: Scalars['Date']['output'];
};

export enum NexoyaBudgetDeltaHandlingPolicy {
  BudgetApplication = 'BUDGET_APPLICATION',
  EndOfMonth = 'END_OF_MONTH',
  Ignore = 'IGNORE',
  PortfolioLifetime = 'PORTFOLIO_LIFETIME',
  WithinCurrentMonth = 'WITHIN_CURRENT_MONTH',
}

export type NexoyaBudgetDetail = {
  __typename?: 'BudgetDetail';
  providerId: Scalars['Int']['output'];
  totalAllocatedValue: Scalars['Float']['output'];
  totalRealizedValue: Scalars['Float']['output'];
  totalValue: Scalars['Float']['output'];
  weeklyBudgets?: Maybe<Array<NexoyaWeeklyBudget>>;
};

export type NexoyaBudgetDetailInput = {
  allocatedValue: Scalars['Float']['input'];
  endDate: Scalars['DateTime']['input'];
  providerId: Scalars['Int']['input'];
  startDate: Scalars['DateTime']['input'];
};

export type NexoyaBudgetInput = {
  allocatedValue: Scalars['Float']['input'];
  providerId: Scalars['Int']['input'];
};

export type NexoyaBudgetItem = {
  __typename?: 'BudgetItem';
  budgetAmount: Scalars['Float']['output'];
  budgetDailyItems: Array<NexoyaBudgetDailyItem>;
  budgetItemId: Scalars['Float']['output'];
  endDate: Scalars['Date']['output'];
  name: Scalars['String']['output'];
  pacing: NexoyaPacingType;
  spendSoFar?: Maybe<Scalars['Float']['output']>;
  startDate: Scalars['Date']['output'];
  status: NexoyaBudgetItemStatus;
  suspendedDate?: Maybe<Scalars['Date']['output']>;
};

export enum NexoyaBudgetItemStatus {
  Active = 'ACTIVE',
  ActiveNoOptimization = 'ACTIVE_NO_OPTIMIZATION',
  Past = 'PAST',
  Planned = 'PLANNED',
}

export type NexoyaBudgetProposal = {
  __typename?: 'BudgetProposal';
  budgetProposalData: Array<NexoyaBudgetProposalData>;
  optimizationId: Scalars['Int']['output'];
  portfolio: NexoyaPortfolioSummary;
  status: NexoyaBudgetProposalStatus;
  timestampApplied?: Maybe<Scalars['DateTime']['output']>;
  timestampCreated: Scalars['DateTime']['output'];
};

export type NexoyaBudgetProposalBudgetProposalDataArgs = {
  applicationType?: InputMaybe<NexoyaBudgetProposalDataApplicationType>;
};

export type NexoyaBudgetProposalConnection = {
  __typename?: 'BudgetProposalConnection';
  edges: Array<NexoyaBudgetProposalEdge>;
  pageInfo: NexoyaPageInfo;
};

export type NexoyaBudgetProposalData = {
  __typename?: 'BudgetProposalData';
  applicationType: NexoyaBudgetProposalDataApplicationType;
  /** @deprecated Use currency fields instead */
  biddingStrategyChangePercent: Scalars['Float']['output'];
  biddingStrategyWillBeApplied: Scalars['Boolean']['output'];
  /** @deprecated Use currency fields instead */
  budgetType?: Maybe<NexoyaBudgetType>;
  budgetWillBeApplied: Scalars['Boolean']['output'];
  channelCurrency: NexoyaBudgetProposalDataChannelCurrency;
  errorMessage?: Maybe<Scalars['String']['output']>;
  /** @deprecated Use currency fields instead */
  initialBiddingStrategy?: Maybe<NexoyaBiddingStrategy>;
  /** @deprecated Use currency fields instead */
  initialBudget?: Maybe<Scalars['Float']['output']>;
  /** @deprecated Use currency fields instead */
  initialBudgetDaily?: Maybe<Scalars['Float']['output']>;
  /** @deprecated Use currency fields instead */
  lifetimeBudget?: Maybe<NexoyaLifetimeBudget>;
  portfolioContentId: Scalars['Float']['output'];
  /** @deprecated Use currency fields instead */
  proposedBiddingStrategy: NexoyaProposedBiddingStrategy;
  /** @deprecated Use currency fields instead */
  proposedBudget: Scalars['Float']['output'];
  teamCurrency: NexoyaBudgetProposalDataTeamCurrency;
  timestampApplied?: Maybe<Scalars['DateTime']['output']>;
};

export enum NexoyaBudgetProposalDataApplicationType {
  Auto = 'AUTO',
  Manual = 'MANUAL',
  SkipFromProposal = 'SKIP_FROM_PROPOSAL',
}

export type NexoyaBudgetProposalDataChannelCurrency = {
  __typename?: 'BudgetProposalDataChannelCurrency';
  biddingStrategyChangePercent: Scalars['Float']['output'];
  budgetType?: Maybe<NexoyaBudgetType>;
  initialBiddingStrategy?: Maybe<NexoyaBiddingStrategy>;
  initialBudget?: Maybe<Scalars['Float']['output']>;
  initialBudgetDaily?: Maybe<Scalars['Float']['output']>;
  lifetimeBudget?: Maybe<NexoyaLifetimeBudget>;
  proposedBiddingStrategy: NexoyaProposedBiddingStrategy;
  proposedBudget: Scalars['Float']['output'];
};

export type NexoyaBudgetProposalDataTeamCurrency = {
  __typename?: 'BudgetProposalDataTeamCurrency';
  biddingStrategyChangePercent: Scalars['Float']['output'];
  budgetType?: Maybe<NexoyaBudgetType>;
  initialBiddingStrategy?: Maybe<NexoyaBiddingStrategy>;
  initialBudget?: Maybe<Scalars['Float']['output']>;
  initialBudgetDaily?: Maybe<Scalars['Float']['output']>;
  lifetimeBudget?: Maybe<NexoyaLifetimeBudget>;
  proposedBiddingStrategy: NexoyaProposedBiddingStrategy;
  proposedBudget: Scalars['Float']['output'];
};

export type NexoyaBudgetProposalEdge = {
  __typename?: 'BudgetProposalEdge';
  cursor: Scalars['String']['output'];
  node: NexoyaBudgetProposal;
};

export enum NexoyaBudgetProposalStatus {
  Cancelled = 'CANCELLED',
  Pending = 'PENDING',
  Success = 'SUCCESS',
}

export type NexoyaBudgetReallocation = {
  __typename?: 'BudgetReallocation';
  dates: Array<Maybe<NexoyaBudgetReallocationDate>>;
  pastBudget: Scalars['Float']['output'];
  pastSpend: Scalars['Float']['output'];
};

export type NexoyaBudgetReallocationDate = {
  __typename?: 'BudgetReallocationDate';
  budgetAmount: Scalars['Float']['output'];
  date: Scalars['Date']['output'];
};

export type NexoyaBudgetTotal = {
  __typename?: 'BudgetTotal';
  allocatedValue: Scalars['Float']['output'];
  endDate: Scalars['DateTime']['output'];
  realizedValue: Scalars['Float']['output'];
  startDate: Scalars['DateTime']['output'];
  totalValue: Scalars['Float']['output'];
};

export enum NexoyaBudgetType {
  Daily = 'DAILY',
  Lifetime = 'LIFETIME',
}

export type NexoyaBulkCreatePortfolioEventInput = {
  category: NexoyaEventCategory;
  description?: InputMaybe<Scalars['String']['input']>;
  end: Scalars['Date']['input'];
  impact: NexoyaEventImpact;
  name: Scalars['String']['input'];
  start: Scalars['Date']['input'];
};

export type NexoyaBulkCreatePortfolioEventsMutationResponse = {
  __typename?: 'BulkCreatePortfolioEventsMutationResponse';
  portfolioEvents: Array<NexoyaPortfolioEvent>;
};

export type NexoyaBulkUpdatePortfolioEventInput = {
  category: NexoyaEventCategory;
  description?: InputMaybe<Scalars['String']['input']>;
  end: Scalars['Date']['input'];
  impact: NexoyaEventImpact;
  name: Scalars['String']['input'];
  start: Scalars['Date']['input'];
};

export type NexoyaBulkUpdatePortfolioEventsMutationResponse = {
  __typename?: 'BulkUpdatePortfolioEventsMutationResponse';
  portfolioEvents: Array<NexoyaPortfolioEvent>;
};

export enum NexoyaCalcType {
  Avg = 'avg',
  Div = 'div',
  Max = 'max',
  Min = 'min',
  Mul = 'mul',
  Sum = 'sum',
}

export type NexoyaChannelReportContent = {
  __typename?: 'ChannelReportContent';
  kpis?: Maybe<Array<NexoyaMeasurement>>;
  provider?: Maybe<NexoyaProvider>;
};

export type NexoyaCkBulkCreateInput = {
  calc_type: NexoyaCalcType;
  description?: InputMaybe<Scalars['String']['input']>;
  kpis?: InputMaybe<Array<NexoyaCkKpiInput>>;
  name: Scalars['String']['input'];
  search?: InputMaybe<NexoyaCkSearchInput>;
};

export type NexoyaCkKpiInput = {
  collection_id?: InputMaybe<Scalars['Float']['input']>;
  default_value?: InputMaybe<Scalars['Float']['input']>;
  measurement_id?: InputMaybe<Scalars['Int']['input']>;
};

export type NexoyaCkSearch = {
  __typename?: 'CKSearch';
  measurement_id?: Maybe<Array<Maybe<Scalars['Int']['output']>>>;
  provider_id?: Maybe<Array<Maybe<Scalars['Int']['output']>>>;
  query?: Maybe<Scalars['String']['output']>;
  sumOnly?: Maybe<Scalars['Boolean']['output']>;
};

export type NexoyaCkSearchInput = {
  measurement_id?: InputMaybe<Array<Scalars['Int']['input']>>;
  provider_id?: InputMaybe<Array<Scalars['Int']['input']>>;
  query: Scalars['String']['input'];
  sumOnly: Scalars['Boolean']['input'];
};

export type NexoyaCollection = {
  __typename?: 'Collection';
  admin_url?: Maybe<Scalars['String']['output']>;
  child_collections?: Maybe<Array<Maybe<NexoyaCollection>>>;
  collection_id: Scalars['Float']['output'];
  collectionType: NexoyaCollectionType;
  creation_date?: Maybe<Scalars['DateTime']['output']>;
  detection_date?: Maybe<Scalars['DateTime']['output']>;
  identifier?: Maybe<Scalars['String']['output']>;
  measurements?: Maybe<Array<Maybe<NexoyaMeasurement>>>;
  metadata?: Maybe<Array<Maybe<NexoyaMetadata>>>;
  parent_collection?: Maybe<NexoyaCollection>;
  parent_collection_id?: Maybe<Scalars['Float']['output']>;
  platform_identifier?: Maybe<Scalars['JSON']['output']>;
  provider?: Maybe<NexoyaProvider>;
  title?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type NexoyaCollectionChild_CollectionsArgs = {
  first?: InputMaybe<Scalars['Float']['input']>;
};

export type NexoyaCollectionMeasurementsArgs = {
  dateFrom: Scalars['DateTime']['input'];
  dateTo: Scalars['DateTime']['input'];
  metric_ids?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
};

export type NexoyaCollectionMetadataArgs = {
  metadataTypes?: InputMaybe<Array<InputMaybe<NexoyaMetadataType>>>;
};

export type NexoyaCollectionConnection = {
  __typename?: 'CollectionConnection';
  edges: Array<NexoyaCollectionEdges>;
  pageInfo: NexoyaPageInfo;
};

export type NexoyaCollectionEdges = {
  __typename?: 'CollectionEdges';
  cursor: Scalars['String']['output'];
  node: NexoyaCollection;
};

export type NexoyaCollectionInput = {
  active: Scalars['Boolean']['input'];
  admin_url?: InputMaybe<Scalars['String']['input']>;
  collection_id?: InputMaybe<Scalars['Float']['input']>;
  creation_date?: InputMaybe<Scalars['DateTime']['input']>;
  detection_date: Scalars['DateTime']['input'];
  identifier?: InputMaybe<Scalars['String']['input']>;
  parent_collection_id?: InputMaybe<Scalars['Float']['input']>;
  provider_id?: InputMaybe<Scalars['Int']['input']>;
  team_id: Scalars['Int']['input'];
  title?: InputMaybe<Scalars['String']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
};

export type NexoyaCollectionType = {
  __typename?: 'CollectionType';
  collection_type_id: Scalars['Int']['output'];
  name?: Maybe<Scalars['String']['output']>;
};

export type NexoyaComputeBudgetProposalBudgetsReturnType = {
  __typename?: 'ComputeBudgetProposalBudgetsReturnType';
  failedEntryIdsWithError?: Maybe<Array<NexoyaFailedEntryError>>;
};

export type NexoyaContent = {
  __typename?: 'Content';
  admin_url?: Maybe<Scalars['String']['output']>;
  content_id: Scalars['Float']['output'];
  content_type: NexoyaContentType;
  creation_date?: Maybe<Scalars['DateTime']['output']>;
  detection_date?: Maybe<Scalars['DateTime']['output']>;
  metadata?: Maybe<Array<Maybe<NexoyaMetadata>>>;
  metrics?: Maybe<Array<Maybe<NexoyaMetric>>>;
  platform_identifier?: Maybe<Scalars['JSON']['output']>;
  provider?: Maybe<NexoyaProvider>;
  title?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export type NexoyaContentMetadataArgs = {
  metadataTypes?: InputMaybe<Array<InputMaybe<NexoyaMetadataType>>>;
};

export type NexoyaContentMetricsArgs = {
  dateFrom: Scalars['DateTime']['input'];
  dateTo: Scalars['DateTime']['input'];
  metric_ids?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
};

export type NexoyaContentBiddingStrategy = {
  __typename?: 'ContentBiddingStrategy';
  type: Scalars['String']['output'];
  value?: Maybe<Scalars['Float']['output']>;
};

export type NexoyaContentBiddingStrategyValueHistory = {
  __typename?: 'ContentBiddingStrategyValueHistory';
  biddingStrategyType: Scalars['String']['output'];
  biddingStrategyValueHistory: Array<NexoyaDailyTimeSeriesDataPointOptional>;
  contentId: Scalars['Float']['output'];
};

export type NexoyaContentBudget = {
  __typename?: 'ContentBudget';
  shared?: Maybe<Scalars['Boolean']['output']>;
  type: NexoyaBudgetType;
  value: Scalars['Float']['output'];
};

export type NexoyaContentConnection = {
  __typename?: 'ContentConnection';
  edges: Array<NexoyaContentEdges>;
  pageInfo: NexoyaPageInfo;
};

export type NexoyaContentEdges = {
  __typename?: 'ContentEdges';
  cursor: Scalars['String']['output'];
  node: NexoyaContent;
};

export type NexoyaContentFilter = {
  __typename?: 'ContentFilter';
  fieldName: NexoyaContentFilterFieldName;
  operator: NexoyaContentFilterOperator;
  value?: Maybe<NexoyaContentFilterValue>;
};

export enum NexoyaContentFilterFieldName {
  BidStrategy = 'bidStrategy',
  BudgetType = 'budgetType',
  ContentId = 'contentId',
  ContentType = 'contentType',
  EndDate = 'endDate',
  LatestMeasurementDataDate = 'latestMeasurementDataDate',
  Objective = 'objective',
  ParentContentId = 'parentContentId',
  ParentTitle = 'parentTitle',
  SourceProviderId = 'sourceProviderId',
  StartDate = 'startDate',
  Status = 'status',
  TeamId = 'teamId',
  Title = 'title',
}

export type NexoyaContentFilterInput = {
  fieldName: NexoyaContentFilterFieldName;
  operator: NexoyaContentFilterOperator;
  value: NexoyaContentFilterValueInput;
};

export enum NexoyaContentFilterOperator {
  Contains = 'contains',
  Eq = 'eq',
  Gte = 'gte',
  Lte = 'lte',
  Ne = 'ne',
  NotContains = 'notContains',
}

export type NexoyaContentFilterValue = {
  __typename?: 'ContentFilterValue';
  boolean?: Maybe<Scalars['Boolean']['output']>;
  date?: Maybe<Scalars['Date']['output']>;
  number?: Maybe<Scalars['Float']['output']>;
  numberArr?: Maybe<Array<Scalars['Float']['output']>>;
  string?: Maybe<Scalars['String']['output']>;
  stringArr?: Maybe<Array<Scalars['String']['output']>>;
};

export type NexoyaContentFilterValueInput = {
  boolean?: InputMaybe<Scalars['Boolean']['input']>;
  date?: InputMaybe<Scalars['Date']['input']>;
  number?: InputMaybe<Scalars['Float']['input']>;
  numberArr?: InputMaybe<Array<Scalars['Float']['input']>>;
  string?: InputMaybe<Scalars['String']['input']>;
  stringArr?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type NexoyaContentMetricTotal = {
  __typename?: 'ContentMetricTotal';
  comparisonChangePercent?: Maybe<NexoyaPerformanceMetric>;
  comparisonTotal?: Maybe<NexoyaPerformanceMetric>;
  content: NexoyaContentV2;
  /** @deprecated Use content field instead */
  contentId: Scalars['Float']['output'];
  /** @deprecated Use content field instead */
  title: Scalars['String']['output'];
  total: NexoyaPerformanceMetric;
};

export type NexoyaContentRule = {
  __typename?: 'ContentRule';
  appliedDiscoveredContents: Array<NexoyaDiscoveredContent>;
  contentRuleId: Scalars['Float']['output'];
  filters: NexoyaContentRuleFilters;
  funnelStepMappings: Array<Maybe<NexoyaContentRuleFunnelStepMapping>>;
  matchingDiscoveredContentsCount: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  portfolioId: Scalars['Float']['output'];
  teamId: Scalars['Float']['output'];
};

export type NexoyaContentRuleEditInput = {
  filters?: InputMaybe<NexoyaContentRuleFiltersInput>;
  funnelStepMappings?: InputMaybe<Array<NexoyaContentRuleFunnelStepMappingInput>>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type NexoyaContentRuleFilters = {
  __typename?: 'ContentRuleFilters';
  adAccountIds: Array<Scalars['Float']['output']>;
  contentFilters: Array<NexoyaContentFilter>;
  providerId: Scalars['Float']['output'];
};

export type NexoyaContentRuleFiltersInput = {
  adAccountIds: Array<Scalars['Float']['input']>;
  contentFilters: Array<NexoyaContentFilterInput>;
  providerId: Scalars['Float']['input'];
};

export type NexoyaContentRuleFunnelStepMapping = {
  __typename?: 'ContentRuleFunnelStepMapping';
  funnelStepId: Scalars['Int']['output'];
  mapping: NexoyaFunnelStepMapping;
};

export type NexoyaContentRuleFunnelStepMappingInput = {
  funnelStepId: Scalars['Int']['input'];
  mapping: NexoyaFunnelStepMappingInput;
};

export type NexoyaContentRuleUpdateFiltersPreviewMutationResponse = {
  __typename?: 'ContentRuleUpdateFiltersPreviewMutationResponse';
  newMatchingDiscoveredContents: Array<Maybe<NexoyaDiscoveredContent>>;
  noLongerMatchingDiscoveredContents: Array<Maybe<NexoyaDiscoveredContent>>;
};

export type NexoyaContentType = {
  __typename?: 'ContentType';
  content_type_id: Scalars['Int']['output'];
  name?: Maybe<Scalars['String']['output']>;
};

export type NexoyaContentV2 = {
  __typename?: 'ContentV2';
  avgSpendLast7Days?: Maybe<Scalars['Float']['output']>;
  biddingStrategy?: Maybe<NexoyaContentBiddingStrategy>;
  budget?: Maybe<NexoyaContentBudget>;
  contentId: Scalars['Float']['output'];
  contentType: NexoyaCollectionType;
  currency?: Maybe<Scalars['String']['output']>;
  endDatetime?: Maybe<Scalars['DateTime']['output']>;
  latestMeasurementDataDate?: Maybe<Scalars['Date']['output']>;
  metadataHistory: Array<NexoyaHistoricalMetadata>;
  objective?: Maybe<Scalars['String']['output']>;
  parent?: Maybe<NexoyaContentV2>;
  portfolioContentId?: Maybe<Scalars['Float']['output']>;
  provider: NexoyaProvider;
  sourceProvider: NexoyaProvider;
  startDatetime?: Maybe<Scalars['DateTime']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  teamId: Scalars['Float']['output'];
  title?: Maybe<Scalars['String']['output']>;
};

export type NexoyaContentV2MetadataHistoryArgs = {
  from: Scalars['Date']['input'];
  metadataTypes?: InputMaybe<Array<Scalars['String']['input']>>;
  to: Scalars['Date']['input'];
};

export type NexoyaContentV2PortfolioContentIdArgs = {
  portfolioId: Scalars['Float']['input'];
};

export type NexoyaConversion = {
  __typename?: 'Conversion';
  accountConversionIds: Array<Scalars['String']['output']>;
  conversionName: Scalars['String']['output'];
};

export type NexoyaCoreFunnelValues = {
  __typename?: 'CoreFunnelValues';
  costPer?: Maybe<Array<Maybe<NexoyaCostPerData>>>;
  realizedMetricByContent?: Maybe<Array<NexoyaRealizedMetricDataPast>>;
  realizedMetricDataPast?: Maybe<Array<NexoyaRealizedMetricDataPast>>;
  valueTotal?: Maybe<Scalars['Float']['output']>;
};

export type NexoyaCoreMetricValues = {
  __typename?: 'CoreMetricValues';
  costPer?: Maybe<Scalars['Float']['output']>;
  helpcenterLink?: Maybe<Scalars['String']['output']>;
  metricTypeId?: Maybe<Scalars['Float']['output']>;
  metricTypeName?: Maybe<Scalars['String']['output']>;
  valueTotal?: Maybe<Scalars['Float']['output']>;
};

export type NexoyaCoreOptMetricValues = {
  __typename?: 'CoreOptMetricValues';
  helpcenter_link?: Maybe<Scalars['String']['output']>;
  metric_type_id?: Maybe<Scalars['Int']['output']>;
  metric_type_name?: Maybe<Scalars['String']['output']>;
};

export type NexoyaCostPerData = {
  __typename?: 'CostPerData';
  timestamp: Scalars['DateTime']['output'];
  valueCumulative?: Maybe<Scalars['Float']['output']>;
  valueRelative?: Maybe<Scalars['Float']['output']>;
};

export type NexoyaCreateAttributionRuleAndDiscoverContentsMutationResponse = {
  __typename?: 'CreateAttributionRuleAndDiscoverContentsMutationResponse';
  attributionRule: NexoyaAttributionRule;
  clashingDiscoveredContents: Array<NexoyaDiscoveredContent>;
  mappedContentsCount: Scalars['Int']['output'];
};

export enum NexoyaCreateBudgetItemError {
  BudgetItemOverlap = 'BUDGET_ITEM_OVERLAP',
}

export type NexoyaCreateBudgetItemPrecheckResult = {
  __typename?: 'CreateBudgetItemPrecheckResult';
  errors?: Maybe<Array<Maybe<NexoyaCreateBudgetItemError>>>;
};

export type NexoyaCreateContentRuleMutationResponse = {
  __typename?: 'CreateContentRuleMutationResponse';
  contentRule: NexoyaContentRule;
  discoveredContents: Array<NexoyaDiscoveredContent>;
};

export type NexoyaCreateImpactGroupRuleMutationResponse = {
  __typename?: 'CreateImpactGroupRuleMutationResponse';
  clashingDiscoveredContents: Array<NexoyaDiscoveredContent>;
  impactGroupRule: NexoyaImpactGroupRule;
  mappedContentsCount: Scalars['Int']['output'];
};

export type NexoyaCreatePortfolioEventMutationResponse = {
  __typename?: 'CreatePortfolioEventMutationResponse';
  portfolioEvent: NexoyaPortfolioEvent;
};

export type NexoyaCurrencyData = {
  __typename?: 'CurrencyData';
  currencies?: Maybe<Array<Scalars['String']['output']>>;
  numberFormats?: Maybe<Array<Scalars['String']['output']>>;
};

export type NexoyaCurrencyExchangeRate = {
  __typename?: 'CurrencyExchangeRate';
  currencyExchangeRateId: Scalars['Int']['output'];
  currencyExchangeTimeframeId: Scalars['Int']['output'];
  fromCurrency: Scalars['String']['output'];
  toCurrency: Scalars['String']['output'];
  value: Scalars['Float']['output'];
};

export type NexoyaCurrencyExchangeRateInput = {
  currencyExchangeRateId?: InputMaybe<Scalars['Int']['input']>;
  currencyExchangeTimeframeId?: InputMaybe<Scalars['Int']['input']>;
  fromCurrency: Scalars['String']['input'];
  toCurrency: Scalars['String']['input'];
  value: Scalars['Float']['input'];
};

export type NexoyaCurrencyExchangeTimeframe = {
  __typename?: 'CurrencyExchangeTimeframe';
  currencyExchangeTimeframeId: Scalars['Int']['output'];
  end?: Maybe<Scalars['Date']['output']>;
  rates?: Maybe<Array<NexoyaCurrencyExchangeRate>>;
  start?: Maybe<Scalars['Date']['output']>;
  teamId: Scalars['Int']['output'];
};

export type NexoyaCurrencyExchangeTimeframeInput = {
  currencyExchangeTimeframeId?: InputMaybe<Scalars['Int']['input']>;
  rates?: InputMaybe<Array<NexoyaCurrencyExchangeRateInput>>;
  start?: InputMaybe<Scalars['Date']['input']>;
};

export type NexoyaCustomKpi = {
  __typename?: 'CustomKPI';
  calc_type: Scalars['String']['output'];
  configType?: Maybe<NexoyaCustomKpiConfigType>;
  custom_kpi_id: Scalars['Int']['output'];
  defaultValue?: Maybe<Scalars['Float']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  kpis?: Maybe<Array<NexoyaMeasurement>>;
  kpisAll?: Maybe<Array<NexoyaMeasurement>>;
  kpisFromPairs?: Maybe<Array<NexoyaMeasurement>>;
  name: Scalars['String']['output'];
  search?: Maybe<NexoyaCkSearch>;
  team_id: Scalars['Int']['output'];
  updated_at: Scalars['DateTime']['output'];
  updatedBy?: Maybe<NexoyaUser>;
};

export type NexoyaCustomKpiKpisArgs = {
  dateFrom?: InputMaybe<Scalars['DateTime']['input']>;
  dateTo?: InputMaybe<Scalars['DateTime']['input']>;
  first?: InputMaybe<Scalars['Float']['input']>;
  offset?: InputMaybe<Scalars['Float']['input']>;
};

export type NexoyaCustomKpiKpisAllArgs = {
  dateFrom?: InputMaybe<Scalars['DateTime']['input']>;
  dateTo?: InputMaybe<Scalars['DateTime']['input']>;
  first?: InputMaybe<Scalars['Float']['input']>;
  offset?: InputMaybe<Scalars['Float']['input']>;
};

export type NexoyaCustomKpiKpisFromPairsArgs = {
  dateFrom?: InputMaybe<Scalars['DateTime']['input']>;
  dateTo?: InputMaybe<Scalars['DateTime']['input']>;
  measurementCollectionPairs: Array<InputMaybe<NexoyaKpiInputOptCollection>>;
};

export enum NexoyaCustomKpiConfigType {
  Conversion = 'CONVERSION',
  Placeholder = 'PLACEHOLDER',
  PreselectedContents = 'PRESELECTED_CONTENTS',
  Search = 'SEARCH',
  Utm = 'UTM',
}

export type NexoyaDailyContentMetric = {
  __typename?: 'DailyContentMetric';
  comparisonChangePercent?: Maybe<NexoyaPerformanceMetric>;
  comparisonValue?: Maybe<NexoyaPerformanceMetric>;
  contentId: Scalars['Float']['output'];
  isIncludedInOptimization: Scalars['Boolean']['output'];
  providerId: Scalars['Int']['output'];
  title: Scalars['String']['output'];
  value?: Maybe<NexoyaPerformanceMetric>;
};

export type NexoyaDailyImpactGroupMetric = {
  __typename?: 'DailyImpactGroupMetric';
  comparisonChangePercent?: Maybe<NexoyaPerformanceMetric>;
  comparisonValue?: Maybe<NexoyaPerformanceMetric>;
  impactGroup: NexoyaImpactGroup;
  value?: Maybe<NexoyaPerformanceMetric>;
};

export type NexoyaDailyLabelMetric = {
  __typename?: 'DailyLabelMetric';
  comparisonChangePercent?: Maybe<NexoyaPerformanceMetric>;
  comparisonValue?: Maybe<NexoyaPerformanceMetric>;
  labelId: Scalars['Int']['output'];
  value?: Maybe<NexoyaPerformanceMetric>;
};

export type NexoyaDailyMetric = {
  __typename?: 'DailyMetric';
  comparisonDay?: Maybe<Scalars['Date']['output']>;
  contents: Array<NexoyaDailyContentMetric>;
  day?: Maybe<Scalars['Date']['output']>;
  impactGroups: Array<NexoyaDailyImpactGroupMetric>;
  labels: Array<NexoyaDailyLabelMetric>;
  providers: Array<NexoyaDailyProviderMetric>;
};

export type NexoyaDailyOptimizationImpactGroupMetric = {
  __typename?: 'DailyOptimizationImpactGroupMetric';
  cumulativeBaseline: Scalars['Float']['output'];
  cumulativeExpected: Scalars['Float']['output'];
  impactGroup: NexoyaImpactGroup;
  relativeBaseline: Scalars['Float']['output'];
  relativeExpected: Scalars['Float']['output'];
};

export type NexoyaDailyOptimizationLabelMetric = {
  __typename?: 'DailyOptimizationLabelMetric';
  cumulativeBaseline: Scalars['Float']['output'];
  cumulativeExpected: Scalars['Float']['output'];
  labelId: Scalars['Int']['output'];
  relativeBaseline: Scalars['Float']['output'];
  relativeExpected: Scalars['Float']['output'];
};

export type NexoyaDailyOptimizationMetric = {
  __typename?: 'DailyOptimizationMetric';
  day: Scalars['Date']['output'];
  impactGroups: Array<NexoyaDailyOptimizationImpactGroupMetric>;
  labels: Array<Maybe<NexoyaDailyOptimizationLabelMetric>>;
  providers: Array<NexoyaDailyOptimizationProviderMetric>;
};

export type NexoyaDailyOptimizationProviderMetric = {
  __typename?: 'DailyOptimizationProviderMetric';
  cumulativeBaseline: Scalars['Float']['output'];
  cumulativeExpected: Scalars['Float']['output'];
  providerId: Scalars['Int']['output'];
  relativeBaseline: Scalars['Float']['output'];
  relativeExpected: Scalars['Float']['output'];
};

export type NexoyaDailyPrediction = {
  __typename?: 'DailyPrediction';
  achieved: Scalars['Float']['output'];
  day: Scalars['Date']['output'];
  predicted: Scalars['Float']['output'];
  score: Scalars['Float']['output'];
};

export type NexoyaDailyPredictionTotal = {
  __typename?: 'DailyPredictionTotal';
  day: Scalars['Date']['output'];
  score: Scalars['Float']['output'];
};

export type NexoyaDailyProviderMetric = {
  __typename?: 'DailyProviderMetric';
  comparisonChangePercent?: Maybe<NexoyaPerformanceMetric>;
  comparisonValue?: Maybe<NexoyaPerformanceMetric>;
  providerId: Scalars['Int']['output'];
  value?: Maybe<NexoyaPerformanceMetric>;
};

export type NexoyaDailyTimeSeriesDataPoint = {
  __typename?: 'DailyTimeSeriesDataPoint';
  date: Scalars['Date']['output'];
  value: Scalars['Float']['output'];
};

export type NexoyaDailyTimeSeriesDataPointOptional = {
  __typename?: 'DailyTimeSeriesDataPointOptional';
  date: Scalars['Date']['output'];
  value?: Maybe<Scalars['Float']['output']>;
};

export type NexoyaDashboardUrl = {
  __typename?: 'DashboardUrl';
  name: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export type NexoyaDashboardUrlInput = {
  name: Scalars['String']['input'];
  url: Scalars['String']['input'];
};

export type NexoyaDataType = {
  __typename?: 'DataType';
  description?: Maybe<Scalars['String']['output']>;
  format?: Maybe<Scalars['String']['output']>;
  label?: Maybe<Scalars['String']['output']>;
  suffix?: Maybe<Scalars['Boolean']['output']>;
  symbol?: Maybe<Scalars['String']['output']>;
};

export type NexoyaDateRange = {
  __typename?: 'DateRange';
  dateFrom?: Maybe<Scalars['DateTime']['output']>;
  dateTo?: Maybe<Scalars['DateTime']['output']>;
};

export type NexoyaDateRangeInput = {
  end: Scalars['Date']['input'];
  start: Scalars['Date']['input'];
};

export type NexoyaDateRangeRequiredInput = {
  dateFrom: Scalars['DateTime']['input'];
  dateTo: Scalars['DateTime']['input'];
};

export type NexoyaDeleteAttributionRuleContentActionInput = {
  applyAttributionRuleId?: InputMaybe<Scalars['Float']['input']>;
  discoveredContentId: Scalars['Float']['input'];
};

export type NexoyaDeleteContentRuleContentActionInput = {
  applyContentRuleId?: InputMaybe<Scalars['Float']['input']>;
  discoveredContentId: Scalars['Float']['input'];
  removeFromPortfolio: Scalars['Boolean']['input'];
};

export type NexoyaDeleteImpactGroupRuleContentActionInput = {
  applyImpactGroupRuleId?: InputMaybe<Scalars['Float']['input']>;
  discoveredContentId: Scalars['Float']['input'];
  removeImpactGroupAssignment: Scalars['Boolean']['input'];
};

export type NexoyaDiscoveredContent = {
  __typename?: 'DiscoveredContent';
  attributionRules: Array<NexoyaApplicableAttributionRule>;
  content: NexoyaContentV2;
  contentRules: Array<NexoyaApplicableContentRule>;
  discoveredContentId: Scalars['Float']['output'];
  impactGroupRules: Array<NexoyaApplicableImpactGroupRule>;
  status: NexoyaDiscoveredContentStatus;
};

export type NexoyaDiscoveredContentsCount = {
  __typename?: 'DiscoveredContentsCount';
  ACCEPTED: Scalars['Int']['output'];
  ACCEPTED_BUT_HAS_UNAPPLIED_RULES: Scalars['Int']['output'];
  MANUAL: Scalars['Int']['output'];
  NEW: Scalars['Int']['output'];
  REJECTED: Scalars['Int']['output'];
  REMOVED: Scalars['Int']['output'];
};

export enum NexoyaDiscoveredContentStatus {
  Accepted = 'ACCEPTED',
  AcceptedButHasUnappliedRules = 'ACCEPTED_BUT_HAS_UNAPPLIED_RULES',
  Manual = 'MANUAL',
  New = 'NEW',
  Rejected = 'REJECTED',
  Removed = 'REMOVED',
}

export type NexoyaEvent = {
  __typename?: 'Event';
  description?: Maybe<Scalars['String']['output']>;
  emoji?: Maybe<Scalars['String']['output']>;
  event_id: Scalars['Int']['output'];
  subject: Scalars['String']['output'];
  timestamp: Scalars['DateTime']['output'];
};

export enum NexoyaEventCategory {
  BrandAwareness = 'BRAND_AWARENESS',
  NegativeExternalEffects = 'NEGATIVE_EXTERNAL_EFFECTS',
  PositiveExternalEffects = 'POSITIVE_EXTERNAL_EFFECTS',
  PriceIncrease = 'PRICE_INCREASE',
  ProductLaunch = 'PRODUCT_LAUNCH',
  PromotionAndDiscounts = 'PROMOTION_AND_DISCOUNTS',
  TrackingIssue = 'TRACKING_ISSUE',
}

export type NexoyaEventFilter = {
  subject?: InputMaybe<Scalars['String']['input']>;
};

export enum NexoyaEventImpact {
  Large = 'LARGE',
  Small = 'SMALL',
}

export type NexoyaExternalLinkInput = {
  title: Scalars['String']['input'];
  url: Scalars['String']['input'];
};

export type NexoyaFailedEntryError = {
  __typename?: 'FailedEntryError';
  errorReason?: Maybe<Scalars['String']['output']>;
  failedEntryId?: Maybe<Scalars['Int']['output']>;
};

export type NexoyaFeatureFlag = {
  __typename?: 'FeatureFlag';
  name?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['Boolean']['output']>;
};

export type NexoyaFeatureFlagInput = {
  name: Scalars['String']['input'];
  status: Scalars['Boolean']['input'];
};

export type NexoyaFieldAllowedValues = {
  __typename?: 'FieldAllowedValues';
  enumOptionsNumber?: Maybe<Array<Scalars['Float']['output']>>;
  enumOptionsString?: Maybe<Array<Scalars['String']['output']>>;
  fieldType: NexoyaFieldType;
};

export type NexoyaFieldOperation = {
  __typename?: 'FieldOperation';
  allowed: NexoyaFieldAllowedValues;
  fieldName: NexoyaContentFilterFieldName;
  operators: Array<NexoyaContentFilterOperator>;
};

export enum NexoyaFieldType {
  Boolean = 'boolean',
  Date = 'date',
  Number = 'number',
  NumberArr = 'numberArr',
  String = 'string',
  StringArr = 'stringArr',
}

export type NexoyaFile = {
  __typename?: 'File';
  createdAt: Scalars['DateTime']['output'];
  downloadUrl: Scalars['String']['output'];
  extension: Scalars['String']['output'];
  fileId: Scalars['Int']['output'];
  mimeType: Scalars['String']['output'];
  name: Scalars['String']['output'];
  sizeInBytes: Scalars['Int']['output'];
};

export type NexoyaFilter = {
  collectionTypes?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  includeChildren?: InputMaybe<Scalars['Boolean']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  lang?: InputMaybe<Scalars['String']['input']>;
  measurementIds?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  name?: InputMaybe<Scalars['String']['input']>;
  providerIds?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type NexoyaFilterListType = {
  __typename?: 'filterListType';
  id?: Maybe<Scalars['String']['output']>;
  itemInfo?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  selected?: Maybe<Scalars['Boolean']['output']>;
};

export type NexoyaFreeFormBiddingStrategyChangeInput = {
  biddingStrategyType: NexoyaBiddingStrategyType;
  biddingStrategyValue?: InputMaybe<Scalars['Float']['input']>;
  campaignId: Scalars['Float']['input'];
};

export type NexoyaFreeFormBiddingStrategyChangesResult = {
  __typename?: 'FreeFormBiddingStrategyChangesResult';
  campaignId: Scalars['Float']['output'];
  errorMessage?: Maybe<Scalars['String']['output']>;
  newBiddingStrategy?: Maybe<NexoyaBiddingStrategy>;
  oldBiddingStrategy?: Maybe<NexoyaBiddingStrategy>;
  status: Scalars['String']['output'];
};

export type NexoyaFreeFormDailyBudgetChangeInput = {
  campaignId: Scalars['Float']['input'];
  dailyBudget: Scalars['Float']['input'];
};

export type NexoyaFreeFormDailyBudgetChangesResult = {
  __typename?: 'FreeFormDailyBudgetChangesResult';
  campaignId: Scalars['Float']['output'];
  errorMessage?: Maybe<Scalars['String']['output']>;
  newBudget?: Maybe<Scalars['Float']['output']>;
  oldBudget?: Maybe<Scalars['Float']['output']>;
  status: Scalars['String']['output'];
};

export type NexoyaFreeFormLifetimeBudgetChangeInput = {
  budgetSegments: Array<NexoyaFreeFormLifetimeBudgetSegmentInput>;
  campaignId: Scalars['Float']['input'];
};

export type NexoyaFreeFormLifetimeBudgetChangesResult = {
  __typename?: 'FreeFormLifetimeBudgetChangesResult';
  campaignId: Scalars['Float']['output'];
  errorMessage?: Maybe<Scalars['String']['output']>;
  newBudget?: Maybe<Array<NexoyaFreeFormLifetimeBudgetSegment>>;
  oldBudget?: Maybe<Array<NexoyaFreeFormLifetimeBudgetSegment>>;
  status: Scalars['String']['output'];
};

export type NexoyaFreeFormLifetimeBudgetSegment = {
  __typename?: 'FreeFormLifetimeBudgetSegment';
  endDate: Scalars['Date']['output'];
  segmentBudget: Scalars['Float']['output'];
  startDate: Scalars['Date']['output'];
};

export type NexoyaFreeFormLifetimeBudgetSegmentInput = {
  endDate: Scalars['Date']['input'];
  segmentBudget: Scalars['Float']['input'];
  startDate: Scalars['Date']['input'];
};

export type NexoyaFunnelStep = {
  __typename?: 'FunnelStep';
  coreFunnelValues?: Maybe<NexoyaCoreFunnelValues>;
  dateFrom: Scalars['DateTime']['output'];
  dateTo: Scalars['DateTime']['output'];
  funnel_step_id: Scalars['Int']['output'];
  input_funnel_step_id?: Maybe<Scalars['Int']['output']>;
  optimizationTargetType?: Maybe<NexoyaFunnelStepType>;
  realizedMetricDataPast?: Maybe<Array<NexoyaRealizedMetricData>>;
  team_id: Scalars['Int']['output'];
  title?: Maybe<Scalars['String']['output']>;
};

export type NexoyaFunnelStepDefaultMapping = {
  __typename?: 'FunnelStepDefaultMapping';
  funnelStepId: Scalars['Float']['output'];
  metricId?: Maybe<Scalars['Int']['output']>;
};

export type NexoyaFunnelStepMapping = {
  __typename?: 'FunnelStepMapping';
  analyticsPropertyId?: Maybe<Scalars['String']['output']>;
  conversions?: Maybe<Array<NexoyaFunnelStepMappingConversion>>;
  metricId?: Maybe<Scalars['Int']['output']>;
  searchTitle?: Maybe<Scalars['String']['output']>;
  type: NexoyaFunnelStepMappingType;
  utmParams?: Maybe<Array<NexoyaFunnelStepMappingUtmParam>>;
};

export type NexoyaFunnelStepMappingConversion = {
  __typename?: 'FunnelStepMappingConversion';
  accountConversionIds: Array<Scalars['String']['output']>;
  conversionName: Scalars['String']['output'];
  metricId: Scalars['Int']['output'];
};

export type NexoyaFunnelStepMappingConversionInput = {
  accountConversionIds: Array<Scalars['String']['input']>;
  conversionName: Scalars['String']['input'];
  metricId: Scalars['Int']['input'];
};

export type NexoyaFunnelStepMappingInput = {
  analyticsPropertyId?: InputMaybe<Scalars['String']['input']>;
  conversions?: InputMaybe<Array<NexoyaFunnelStepMappingConversionInput>>;
  metricId?: InputMaybe<Scalars['Int']['input']>;
  searchTitle?: InputMaybe<Scalars['String']['input']>;
  type: NexoyaFunnelStepMappingType;
  utmParams?: InputMaybe<Array<NexoyaFunnelStepMappingUtmParamInput>>;
};

export type NexoyaFunnelStepMappingPreset = {
  __typename?: 'FunnelStepMappingPreset';
  funnelStepMappingPresetId: Scalars['Float']['output'];
  mapping: NexoyaFunnelStepMapping;
  name: Scalars['String']['output'];
  teamId: Scalars['Float']['output'];
};

export enum NexoyaFunnelStepMappingType {
  Conversion = 'CONVERSION',
  CustomImport = 'CUSTOM_IMPORT',
  CustomMetric = 'CUSTOM_METRIC',
  Ignore = 'IGNORE',
  Metric = 'METRIC',
  Utm = 'UTM',
}

export type NexoyaFunnelStepMappingUtmParam = {
  __typename?: 'FunnelStepMappingUtmParam';
  type: Scalars['String']['output'];
  values?: Maybe<Array<Scalars['String']['output']>>;
};

export type NexoyaFunnelStepMappingUtmParamInput = {
  type: Scalars['String']['input'];
  values: Array<Scalars['String']['input']>;
};

export type NexoyaFunnelStepPerformance = {
  __typename?: 'FunnelStepPerformance';
  dailyMetrics: Array<NexoyaDailyMetric>;
  dailyOptimizationMetrics: Array<NexoyaDailyOptimizationMetric>;
  funnelStep: NexoyaFunnelStepV2;
  metricTotals: NexoyaMetricTotal;
  optimizationMetricTotals?: Maybe<NexoyaOptimizationMetricTotal>;
};

export type NexoyaFunnelStepPredictionScore = {
  __typename?: 'FunnelStepPredictionScore';
  accuracyBuckets: Array<NexoyaAccuracyBucket>;
  dailyPredictions: Array<NexoyaDailyPrediction>;
  funnelStepId: Scalars['Int']['output'];
  score: Scalars['Float']['output'];
  title: Scalars['String']['output'];
  type: NexoyaFunnelStepType;
};

export enum NexoyaFunnelStepType {
  Awareness = 'AWARENESS',
  Consideration = 'CONSIDERATION',
  Conversion = 'CONVERSION',
  ConversionValue = 'CONVERSION_VALUE',
  Cost = 'COST',
  Other = 'OTHER',
}

export type NexoyaFunnelStepUtmMappingParams = {
  __typename?: 'FunnelStepUtmMappingParams';
  name: Scalars['String']['output'];
  type: Scalars['String']['output'];
};

export type NexoyaFunnelStepV2 = {
  __typename?: 'FunnelStepV2';
  funnelStepId: Scalars['Int']['output'];
  isAttributed: Scalars['Boolean']['output'];
  isMeasured: Scalars['Boolean']['output'];
  title: Scalars['String']['output'];
  type: NexoyaFunnelStepType;
};

export type NexoyaHistoricalMetadata = {
  __typename?: 'HistoricalMetadata';
  date: Scalars['Date']['output'];
  metadataType: Scalars['String']['output'];
  value?: Maybe<Scalars['String']['output']>;
};

export type NexoyaImpactGroup = {
  __typename?: 'ImpactGroup';
  funnelSteps: Array<NexoyaFunnelStep>;
  impactGroupId: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  portfolioId: Scalars['Int']['output'];
};

export type NexoyaImpactGroupMetricTotal = {
  __typename?: 'ImpactGroupMetricTotal';
  comparisonChangePercent?: Maybe<NexoyaPerformanceMetric>;
  comparisonTotal?: Maybe<NexoyaPerformanceMetric>;
  impactGroup: NexoyaImpactGroup;
  total: NexoyaPerformanceMetric;
};

export type NexoyaImpactGroupRule = {
  __typename?: 'ImpactGroupRule';
  appliedDiscoveredContents: Array<NexoyaDiscoveredContent>;
  filters: NexoyaImpactGroupRuleFilters;
  impactGroupId: Scalars['Float']['output'];
  impactGroupRuleId: Scalars['Float']['output'];
  matchingDiscoveredContentsCount: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  portfolioId: Scalars['Float']['output'];
  teamId: Scalars['Float']['output'];
};

export type NexoyaImpactGroupRuleEditInput = {
  filters?: InputMaybe<NexoyaImpactGroupRuleFiltersInput>;
  impactGroupId?: InputMaybe<Scalars['Float']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type NexoyaImpactGroupRuleFilters = {
  __typename?: 'ImpactGroupRuleFilters';
  contentFilters: Array<NexoyaContentFilter>;
  providers: Array<NexoyaImpactGroupRuleProvider>;
};

export type NexoyaImpactGroupRuleFiltersInput = {
  contentFilters: Array<NexoyaContentFilterInput>;
  providers: Array<NexoyaImpactGroupRuleProviderInput>;
};

export type NexoyaImpactGroupRuleProvider = {
  __typename?: 'ImpactGroupRuleProvider';
  adAccountIds: Array<Scalars['Float']['output']>;
  providerId: Scalars['Float']['output'];
};

export type NexoyaImpactGroupRuleProviderInput = {
  adAccountIds: Array<Scalars['Float']['input']>;
  providerId: Scalars['Float']['input'];
};

export type NexoyaImpactGroupRuleUpdatePreviewMutationResponse = {
  __typename?: 'ImpactGroupRuleUpdatePreviewMutationResponse';
  newMatchingDiscoveredContents: Array<Maybe<NexoyaDiscoveredContent>>;
  noLongerMatchingDiscoveredContents: Array<Maybe<NexoyaDiscoveredContent>>;
};

export type NexoyaIntegration = {
  __typename?: 'Integration';
  connected: Scalars['Boolean']['output'];
  connectionUrl?: Maybe<Scalars['String']['output']>;
  fields?: Maybe<Scalars['String']['output']>;
  filterOptions?: Maybe<Array<Maybe<NexoyaProviderFilter>>>;
  hasFilter?: Maybe<Scalars['Boolean']['output']>;
  integration_id: Scalars['Int']['output'];
  lastSyncAt?: Maybe<Scalars['DateTime']['output']>;
  name: Scalars['String']['output'];
  provider?: Maybe<NexoyaProvider>;
  provider_id: Scalars['Int']['output'];
  status?: Maybe<NexoyaIntegrationStatus>;
  title: Scalars['String']['output'];
  type: Scalars['String']['output'];
  user?: Maybe<NexoyaUser>;
};

export type NexoyaIntegrationFilter = {
  connected?: InputMaybe<Scalars['Boolean']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};

export enum NexoyaIntegrationStatus {
  Error = 'ERROR',
  Synced = 'SYNCED',
  Syncing = 'SYNCING',
}

export type NexoyaKpi = {
  __typename?: 'KPI';
  datatype?: Maybe<NexoyaDataType>;
  description?: Maybe<Scalars['String']['output']>;
  kpi_id: Scalars['Int']['output'];
  measurements?: Maybe<Array<Maybe<NexoyaMeasurement>>>;
  name?: Maybe<Scalars['String']['output']>;
  providers?: Maybe<Array<Maybe<NexoyaProvider>>>;
};

export type NexoyaKpiMeasurementsArgs = {
  dateFrom?: InputMaybe<Scalars['DateTime']['input']>;
  dateTo?: InputMaybe<Scalars['DateTime']['input']>;
  team_id: Scalars['Int']['input'];
};

export type NexoyaKpiInput = {
  collection_id: Scalars['Float']['input'];
  measurement_id: Scalars['Int']['input'];
};

export type NexoyaKpiInputOptCollection = {
  collection_id?: InputMaybe<Scalars['Float']['input']>;
  measurement_id: Scalars['Int']['input'];
};

export type NexoyaKpiInputOptMetric = {
  collection_id: Scalars['Float']['input'];
  measurement_id?: InputMaybe<Scalars['Int']['input']>;
};

export type NexoyaKpiSummary = {
  __typename?: 'KPISummary';
  averageType?: Maybe<Scalars['Boolean']['output']>;
  datatype?: Maybe<NexoyaDataType>;
  group?: Maybe<NexoyaKpiSummaryGroup>;
};

export type NexoyaKpiSummaryGroup = {
  __typename?: 'KPISummaryGroup';
  goal?: Maybe<Scalars['Float']['output']>;
  lowerIsBetter?: Maybe<Scalars['Boolean']['output']>;
  measurement_id?: Maybe<Scalars['Int']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  provider_id?: Maybe<Scalars['Int']['output']>;
  value?: Maybe<Scalars['Float']['output']>;
};

export type NexoyaKpiSummaryType = {
  __typename?: 'KPISummaryType';
  summary?: Maybe<Array<Maybe<NexoyaKpiSummary>>>;
};

export type NexoyaLabelMetricTotal = {
  __typename?: 'LabelMetricTotal';
  comparisonChangePercent?: Maybe<NexoyaPerformanceMetric>;
  comparisonTotal?: Maybe<NexoyaPerformanceMetric>;
  labelId: Scalars['Int']['output'];
  total: NexoyaPerformanceMetric;
};

export type NexoyaLifetimeBudget = {
  __typename?: 'LifetimeBudget';
  lifetimeBudgetSegments: Array<Maybe<NexoyaLifetimeBudgetSegment>>;
  providerBudgetMissingDays: Array<Maybe<Scalars['Date']['output']>>;
};

export type NexoyaLifetimeBudgetSegment = {
  __typename?: 'LifetimeBudgetSegment';
  endDate: Scalars['Date']['output'];
  initialBudget: Scalars['Float']['output'];
  proposedBudget: Scalars['Float']['output'];
  spend?: Maybe<Scalars['Float']['output']>;
  spendUpdatedAt?: Maybe<Scalars['DateTime']['output']>;
  startDate: Scalars['Date']['output'];
};

export type NexoyaListAttributionModelsFilters = {
  status?: InputMaybe<Array<NexoyaAttributionModelStatus>>;
};

export type NexoyaManualContentFunnelStepMappingInput = {
  funnelStepId: Scalars['Int']['input'];
  metricId?: InputMaybe<Scalars['Int']['input']>;
};

export type NexoyaMeasurement = {
  __typename?: 'Measurement';
  aggregate_up_to?: Maybe<Scalars['Int']['output']>;
  api_path?: Maybe<Scalars['String']['output']>;
  calculation_type?: Maybe<Scalars['String']['output']>;
  collection?: Maybe<NexoyaCollection>;
  collections?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  customKpiConfig?: Maybe<NexoyaCustomKpi>;
  datatype?: Maybe<NexoyaDataType>;
  datatype_id?: Maybe<Scalars['Int']['output']>;
  deprecated?: Maybe<Scalars['Boolean']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  detail?: Maybe<NexoyaMeasurementDetail>;
  dimensions?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  goal?: Maybe<Scalars['Float']['output']>;
  helpcenter_link?: Maybe<Scalars['String']['output']>;
  import_sum_type?: Maybe<Scalars['String']['output']>;
  isFavorite?: Maybe<Scalars['Boolean']['output']>;
  kpi?: Maybe<NexoyaKpi>;
  lowerIsBetter?: Maybe<Scalars['Boolean']['output']>;
  measurement_id?: Maybe<Scalars['Int']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  optimization_target_type?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  provider?: Maybe<NexoyaProvider>;
  provider_id?: Maybe<Scalars['Int']['output']>;
  showAsTotal?: Maybe<Scalars['Boolean']['output']>;
};

export type NexoyaMeasurementDatatypeArgs = {
  team_id?: InputMaybe<Scalars['Int']['input']>;
};

export type NexoyaMeasurementAggregate = {
  __typename?: 'MeasurementAggregate';
  aggregatedValue: Scalars['Float']['output'];
  dailyValues?: Maybe<Array<Maybe<NexoyaMeasurementData>>>;
};

export type NexoyaMeasurementCollectionInput = {
  collection_id: Scalars['Float']['input'];
  goal?: InputMaybe<Scalars['Float']['input']>;
  measurement_id: Scalars['Int']['input'];
};

export type NexoyaMeasurementCollectionPairInput = {
  collection_id: Scalars['Float']['input'];
  measurement_id: Scalars['Int']['input'];
};

export type NexoyaMeasurementConnection = {
  __typename?: 'MeasurementConnection';
  edges: Array<NexoyaMeasurementEdges>;
  pageInfo: NexoyaPageInfo;
};

export type NexoyaMeasurementData = {
  __typename?: 'MeasurementData';
  dimensions?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  timestamp?: Maybe<Scalars['DateTime']['output']>;
  value?: Maybe<Scalars['Float']['output']>;
  valueSumUp?: Maybe<Scalars['Float']['output']>;
};

export type NexoyaMeasurementDetail = {
  __typename?: 'MeasurementDetail';
  data?: Maybe<Array<Maybe<NexoyaMeasurementData>>>;
  value?: Maybe<Scalars['Float']['output']>;
  valueChangePercentage?: Maybe<Scalars['Float']['output']>;
  valueSum?: Maybe<Scalars['Float']['output']>;
  valueSumUptoEndDate?: Maybe<Scalars['Float']['output']>;
};

export type NexoyaMeasurementEdges = {
  __typename?: 'MeasurementEdges';
  cursor: Scalars['String']['output'];
  node: NexoyaMeasurement;
};

export type NexoyaMeasurementGroup = {
  __typename?: 'MeasurementGroup';
  key: Scalars['String']['output'];
  name: Scalars['String']['output'];
  order: Scalars['Int']['output'];
};

export type NexoyaMetadata = {
  __typename?: 'Metadata';
  created_at?: Maybe<Scalars['DateTime']['output']>;
  metadata_key: Scalars['String']['output'];
  metadata_type?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['String']['output']>;
  value_lookup?: Maybe<Scalars['String']['output']>;
};

export enum NexoyaMetadataType {
  BiddingStrategy = 'BIDDING_STRATEGY',
  DailyBudgetMicros = 'DAILY_BUDGET_MICROS',
  EndDatetime = 'END_DATETIME',
  SharedBudget = 'SHARED_BUDGET',
  StartDatetime = 'START_DATETIME',
  Status = 'STATUS',
  TargetCpaMicros = 'TARGET_CPA_MICROS',
}

export type NexoyaMetric = {
  __typename?: 'Metric';
  aggregate_up_to?: Maybe<Scalars['Int']['output']>;
  api_path?: Maybe<Scalars['String']['output']>;
  calculation_type?: Maybe<Scalars['String']['output']>;
  collection?: Maybe<NexoyaCollection>;
  collections?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  content?: Maybe<NexoyaContent>;
  customKpiConfig?: Maybe<NexoyaCustomKpi>;
  datatype?: Maybe<NexoyaDataType>;
  description?: Maybe<Scalars['String']['output']>;
  detail?: Maybe<NexoyaMetricDetail>;
  dimensions?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  goal?: Maybe<Scalars['Float']['output']>;
  helpcenter_link?: Maybe<Scalars['String']['output']>;
  import_sum_type?: Maybe<Scalars['String']['output']>;
  isFavorite?: Maybe<Scalars['Boolean']['output']>;
  kpi?: Maybe<NexoyaKpi>;
  lowerIsBetter?: Maybe<Scalars['Boolean']['output']>;
  metric_id?: Maybe<Scalars['Int']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  provider?: Maybe<NexoyaProvider>;
  provider_id?: Maybe<Scalars['Int']['output']>;
  showAsTotal?: Maybe<Scalars['Boolean']['output']>;
};

export type NexoyaMetricDatatypeArgs = {
  team_id?: InputMaybe<Scalars['Int']['input']>;
};

export type NexoyaMetricData = {
  timestamp: Scalars['DateTime']['output'];
  valueCumulative: Scalars['Float']['output'];
  valueRelative: Scalars['Float']['output'];
};

export type NexoyaMetricDataCore = {
  __typename?: 'MetricDataCore';
  dimensions?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  timestamp?: Maybe<Scalars['DateTime']['output']>;
  value?: Maybe<Scalars['Float']['output']>;
  valueSumUp?: Maybe<Scalars['Float']['output']>;
};

export type NexoyaMetricDefinitionV2 = {
  __typename?: 'MetricDefinitionV2';
  apiPath?: Maybe<Scalars['String']['output']>;
  calculationType: Scalars['String']['output'];
  dataTypeId: Scalars['String']['output'];
  defaultForFunnelStepType?: Maybe<NexoyaFunnelStepType>;
  metricTypeId: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  optimizationTargetTypes: Array<NexoyaFunnelStepType>;
  providerId: Scalars['Int']['output'];
};

export type NexoyaMetricDetail = {
  __typename?: 'MetricDetail';
  data?: Maybe<Array<Maybe<NexoyaMetricDataCore>>>;
  value?: Maybe<Scalars['Float']['output']>;
  valueChangePercentage?: Maybe<Scalars['Float']['output']>;
  valueSum?: Maybe<Scalars['Float']['output']>;
  valueSumUptoEndDate?: Maybe<Scalars['Float']['output']>;
};

export type NexoyaMetricMeta = {
  __typename?: 'MetricMeta';
  helpcenter_link?: Maybe<Scalars['String']['output']>;
  metric_type_id?: Maybe<Scalars['Int']['output']>;
  metric_type_name?: Maybe<Scalars['String']['output']>;
};

export type NexoyaMetricTotal = {
  __typename?: 'MetricTotal';
  attributionRules: Array<NexoyaAttributionRuleMetricTotal>;
  impactGroups: Array<NexoyaImpactGroupMetricTotal>;
  labels: Array<NexoyaLabelMetricTotal>;
  providers?: Maybe<Array<NexoyaProviderMetricTotal>>;
};

export type NexoyaMissingCurrencyCoverage = {
  __typename?: 'MissingCurrencyCoverage';
  contentCurrency: Scalars['String']['output'];
  /** @deprecated Should not happen anymore with the new business logic */
  missingRanges: Array<NexoyaRequiredDateRange>;
  teamCurrency: Scalars['String']['output'];
};

export type NexoyaMutation = {
  __typename?: 'Mutation';
  acceptDiscoveredContents: Array<NexoyaDiscoveredContent>;
  activateAttribution: NexoyaPortfolioV2;
  addManualContentsToPorfolio: Array<NexoyaPortfolioParentContent>;
  addManualIntegration?: Maybe<Scalars['Boolean']['output']>;
  addManyContentRelations: Scalars['Boolean']['output'];
  addPortfolioContent: Array<Scalars['Int']['output']>;
  addReportKpis?: Maybe<Scalars['Boolean']['output']>;
  addSelectedMeasurement?: Maybe<Array<Maybe<Scalars['Int']['output']>>>;
  addTeamMember?: Maybe<Scalars['Boolean']['output']>;
  applyRulesToDiscoveredContents: NexoyaApplyRulesToDiscoveredContentsMutationResponse;
  applySimulation: NexoyaSimulation;
  assignContentsAndRulesToPortfolioEvents: NexoyaAssignContentsAndRulesToPortfolioEventsResponse;
  assignFunnelStepMetricsToPortfolioContents: Array<NexoyaPortfolioParentContent>;
  assignImpactGroupToPortfolioContents: Array<NexoyaPortfolioParentContent>;
  autoGenerateContentRules: Array<NexoyaContentRule>;
  autoGenerateImpactGroupRules: Array<NexoyaImpactGroupRule>;
  bulkAssignFunnelStepMetrics: Scalars['Boolean']['output'];
  bulkAssignLabels: Scalars['Boolean']['output'];
  bulkCreateCustomKpis: Array<NexoyaCustomKpi>;
  bulkCreatePortfolioEvents?: Maybe<NexoyaBulkCreatePortfolioEventsMutationResponse>;
  bulkUpdatePortfolioEvents?: Maybe<NexoyaBulkUpdatePortfolioEventsMutationResponse>;
  cancelOptimization: Scalars['Boolean']['output'];
  cancelSimulation: Scalars['Boolean']['output'];
  changeBaseScenario: Scalars['Boolean']['output'];
  changeCurrency?: Maybe<NexoyaTeam>;
  changeProposalDataApplicationType?: Maybe<NexoyaBudgetProposal>;
  checkForStuckOptimizations?: Maybe<Scalars['Boolean']['output']>;
  computeBudgetProposalBiddingStrategies?: Maybe<NexoyaBudgetProposal>;
  computeBudgetProposalBudgets?: Maybe<NexoyaComputeBudgetProposalBudgetsReturnType>;
  concludeOptimizationBudgetProposal: NexoyaOptimizationV2;
  copyPortfolio?: Maybe<NexoyaPortfolio>;
  copyReport?: Maybe<NexoyaReport>;
  createAttributionModel: NexoyaAttributionModel;
  createAttributionRule: NexoyaCreateAttributionRuleAndDiscoverContentsMutationResponse;
  createBudgetItem?: Maybe<NexoyaBudgetItem>;
  createBudgetProposal?: Maybe<NexoyaBudgetProposal>;
  createCollection?: Maybe<NexoyaCollection>;
  createContentRule: NexoyaCreateContentRuleMutationResponse;
  createCustomKpi?: Maybe<NexoyaCustomKpi>;
  createEvent?: Maybe<NexoyaEvent>;
  createFunnelStepMappingPreset: NexoyaFunnelStepMappingPreset;
  createImpactGroupRule: NexoyaCreateImpactGroupRuleMutationResponse;
  createOnboardingData?: Maybe<Scalars['Boolean']['output']>;
  createOptimization: NexoyaOptimizationV2;
  createOrUpdateLabel: NexoyaPortfolioLabel;
  createOrUpdatePortfolioImpactGroup: NexoyaImpactGroup;
  createParentCollection?: Maybe<NexoyaCollection>;
  createPortfolio?: Maybe<NexoyaPortfolio>;
  createPortfolioEvent: NexoyaCreatePortfolioEventMutationResponse;
  createPortfolioTargetItem?: Maybe<NexoyaPortfolioTargetItem>;
  createReport?: Maybe<NexoyaReport>;
  createShadowPortfolio: NexoyaPortfolioV2;
  createSimulation: NexoyaSimulation;
  deactivatePortfolio?: Maybe<Scalars['Boolean']['output']>;
  deleteAttributionModel: Scalars['Boolean']['output'];
  deleteAttributionModelFile: Scalars['Boolean']['output'];
  deleteAttributionRule: Scalars['Boolean']['output'];
  deleteBudgetItem?: Maybe<Scalars['Boolean']['output']>;
  deleteContentRule: Scalars['Boolean']['output'];
  deleteCustomImportData: Scalars['Int']['output'];
  deleteCustomKpi?: Maybe<Scalars['Boolean']['output']>;
  deleteEvent?: Maybe<Scalars['Boolean']['output']>;
  deleteFunnelStep?: Maybe<Scalars['Boolean']['output']>;
  deleteFunnelStepMappingPreset: Scalars['Boolean']['output'];
  deleteImpactGroupRule: Scalars['Boolean']['output'];
  deleteIntegration?: Maybe<Scalars['Boolean']['output']>;
  deleteLabel: Scalars['Boolean']['output'];
  deleteOptimization?: Maybe<Scalars['Boolean']['output']>;
  deleteParentCollection?: Maybe<Scalars['Boolean']['output']>;
  deletePortfolioEvent: Scalars['Boolean']['output'];
  deletePortfolioEventAsset: Scalars['Boolean']['output'];
  deletePortfolioImpactGroup?: Maybe<Scalars['Boolean']['output']>;
  deleteReport?: Maybe<Scalars['Boolean']['output']>;
  deleteSimulation: Scalars['Boolean']['output'];
  editBudgetItem?: Maybe<NexoyaBudgetItem>;
  editPortfolioTargetItem?: Maybe<NexoyaPortfolioTargetItem>;
  editSimulation: NexoyaSimulation;
  endBudgetItem?: Maybe<NexoyaBudgetItem>;
  endPortfolioTargetItem?: Maybe<NexoyaPortfolioTargetItem>;
  executeAutomaticFreeFormBiddingStrategyChanges: Array<NexoyaFreeFormBiddingStrategyChangesResult>;
  executeAutomaticFreeFormDailyBudgetChanges: Array<NexoyaFreeFormDailyBudgetChangesResult>;
  executeAutomaticFreeFormLifetimeBudgetChanges: Array<NexoyaFreeFormLifetimeBudgetChangesResult>;
  executeBudgetProposal?: Maybe<NexoyaBudgetProposal>;
  exportAttributionModelChannelsToBlob: Scalars['Boolean']['output'];
  fixPortfolioContentMetrics: Scalars['Boolean']['output'];
  flushCache?: Maybe<Scalars['Boolean']['output']>;
  inviteShareUser?: Maybe<Scalars['Int']['output']>;
  inviteUser?: Maybe<Scalars['Int']['output']>;
  makeOptimizationVisibleToAllUsers: NexoyaOptimizationV2;
  makeSimulationVisibleToAllUsers: NexoyaSimulation;
  markProposalDataAsApplied?: Maybe<Scalars['Boolean']['output']>;
  mergeShadowPortfolio: NexoyaPortfolioV2;
  reapplyContentRulesMappings: Scalars['Boolean']['output'];
  refreshPortfolioContentMeasurements?: Maybe<Scalars['Boolean']['output']>;
  rejectDiscoveredContents: Array<NexoyaDiscoveredContent>;
  removeContentRelation: Scalars['Boolean']['output'];
  removePortfolioContent: Array<NexoyaPortfolioParentContent>;
  removePortfolioContentWithCollectionId: Scalars['Boolean']['output'];
  removePortfolioTargetItem?: Maybe<Scalars['Boolean']['output']>;
  removeReportKpis?: Maybe<Scalars['Boolean']['output']>;
  removeSelectedMeasurement?: Maybe<Array<Maybe<Scalars['Int']['output']>>>;
  removeUser?: Maybe<Scalars['Boolean']['output']>;
  replaceCurrencyExchangeTimeframes: Array<NexoyaCurrencyExchangeTimeframe>;
  restoreRemovedDiscoveredContents: Scalars['Boolean']['output'];
  retryContentAutomaticApplication?: Maybe<NexoyaBudgetProposal>;
  retryOptimizationDataFetches: Scalars['Boolean']['output'];
  retryOptimizationTask?: Maybe<Scalars['Boolean']['output']>;
  revertBudgetProposal?: Maybe<NexoyaBudgetProposal>;
  runSimulation: NexoyaSimulation;
  setSimulationIsArchived: NexoyaSimulation;
  setSimulationMonitoringUrl: NexoyaSimulation;
  setUserInfo?: Maybe<Scalars['Boolean']['output']>;
  setUserState?: Maybe<Scalars['Boolean']['output']>;
  setWhitelistFilter?: Maybe<Scalars['Boolean']['output']>;
  skipOptimizationDataFetches: Scalars['Boolean']['output'];
  switchManualContentsToRuleBased: NexoyaApplyRulesToDiscoveredContentsMutationResponse;
  syncTeamChannel: Scalars['Boolean']['output'];
  updateAttributionModel: NexoyaAttributionModel;
  updateAttributionRuleFactors: NexoyaAttributionRule;
  updateAttributionRuleFilters: NexoyaUpdateAttributionRuleFiltersMutationResponse;
  updateAttributionRuleName: NexoyaAttributionRule;
  updateBudgetCS: Scalars['Boolean']['output'];
  updateBudgetDetail?: Maybe<NexoyaWeeklyBudget>;
  updateContentRuleFilters?: Maybe<NexoyaUpdateContentRuleAndContentsMutationResponse>;
  updateContentRuleFunnelStepMappings: NexoyaUpdateContentRuleFunnelStepMappingsMutationResponse;
  updateContentRuleName: NexoyaContentRule;
  updateContentTargetMetric?: Maybe<Scalars['Boolean']['output']>;
  updateCustomKpi?: Maybe<NexoyaCustomKpi>;
  updateDefaultOptimizationTarget?: Maybe<Scalars['Boolean']['output']>;
  updateEvent?: Maybe<NexoyaEvent>;
  updateFeatureFlag: Scalars['Boolean']['output'];
  updateFunnelStepMappingPreset?: Maybe<NexoyaFunnelStepMappingPreset>;
  updateImpactGroupRule?: Maybe<NexoyaUpdateImpactGroupRuleAndContentsMutationResponse>;
  updateOptimization?: Maybe<Scalars['Boolean']['output']>;
  updatePortfolio?: Maybe<NexoyaPortfolio>;
  updatePortfolioContentBudgetBoundaries: Scalars['Boolean']['output'];
  updatePortfolioContentsIncludedInOptimization: Array<NexoyaPortfolioParentContent>;
  updatePortfolioEvent: NexoyaUpdatePortfolioEventMutationResponse;
  updateReport?: Maybe<NexoyaReport>;
  updateRuleBasedPorfolioContentsToManual: Array<NexoyaPortfolioParentContent>;
  /** @deprecated Use `updateCampaignMeasurements`. */
  updateSelectedKPIs?: Maybe<Array<Maybe<Scalars['Int']['output']>>>;
  /** @deprecated Use `addSelectedMeasurement` and `removeSelectedMeasurement`. */
  updateSelectedMeasurements?: Maybe<Array<Maybe<Scalars['Int']['output']>>>;
  updateTeam?: Maybe<NexoyaTeam>;
  updateTeamFeatureFlag?: Maybe<NexoyaTeam>;
  updateTeamMemberRole?: Maybe<Scalars['Boolean']['output']>;
  upsertPortfolioFunnelSteps: Array<NexoyaFunnelStepV2>;
  upsertPortfolioImpactGroups: Array<NexoyaImpactGroup>;
  upsertProviderKey?: Maybe<NexoyaProviderKey>;
  upsertTeam?: Maybe<NexoyaTeam>;
  whitelistViews?: Maybe<Scalars['Boolean']['output']>;
};

export type NexoyaMutationAcceptDiscoveredContentsArgs = {
  discoveredContentIds: Array<Scalars['Float']['input']>;
  portfolioId: Scalars['Float']['input'];
  teamId: Scalars['Float']['input'];
};

export type NexoyaMutationActivateAttributionArgs = {
  attributedFunnelStepTitle: Scalars['String']['input'];
  createCopy: Scalars['Boolean']['input'];
  measuredFunnelStepId: Scalars['Int']['input'];
  portfolioId: Scalars['Int']['input'];
  teamId: Scalars['Int']['input'];
};

export type NexoyaMutationAddManualContentsToPorfolioArgs = {
  collectionIds: Array<Scalars['Float']['input']>;
  funnelStepMappings?: InputMaybe<Array<NexoyaManualContentFunnelStepMappingInput>>;
  impactGroupId?: InputMaybe<Scalars['Int']['input']>;
  portfolioId: Scalars['Int']['input'];
  teamId: Scalars['Int']['input'];
};

export type NexoyaMutationAddManualIntegrationArgs = {
  data: Scalars['String']['input'];
  provider_id: Scalars['Int']['input'];
  team_id: Scalars['Int']['input'];
};

export type NexoyaMutationAddManyContentRelationsArgs = {
  contentRelations: Array<NexoyaPortfolioContentRelationInput>;
  portfolioId: Scalars['Int']['input'];
  teamId: Scalars['Int']['input'];
};

export type NexoyaMutationAddPortfolioContentArgs = {
  collectionIds: Array<Scalars['Float']['input']>;
  portfolioId: Scalars['Int']['input'];
  teamId: Scalars['Int']['input'];
};

export type NexoyaMutationAddReportKpisArgs = {
  kpis: Array<NexoyaKpiInputOptMetric>;
  report_id: Scalars['Int']['input'];
};

export type NexoyaMutationAddSelectedMeasurementArgs = {
  collection_id: Scalars['Float']['input'];
  measurement_id: Scalars['Int']['input'];
  team_id: Scalars['Int']['input'];
};

export type NexoyaMutationAddTeamMemberArgs = {
  role_def: Scalars['String']['input'];
  team_id: Scalars['Int']['input'];
  user_email?: InputMaybe<Scalars['String']['input']>;
  user_id?: InputMaybe<Scalars['Int']['input']>;
};

export type NexoyaMutationApplyRulesToDiscoveredContentsArgs = {
  discoveredContentsWithRulesToApply: Array<NexoyaApplyRulesToDiscoveredContentsRulesMapInput>;
  portfolioId: Scalars['Float']['input'];
  teamId: Scalars['Float']['input'];
};

export type NexoyaMutationApplySimulationArgs = {
  portfolioId: Scalars['Float']['input'];
  scenarioId: Scalars['Float']['input'];
  simulationId: Scalars['Float']['input'];
  teamId: Scalars['Float']['input'];
};

export type NexoyaMutationAssignContentsAndRulesToPortfolioEventsArgs = {
  assignedContentIds: Array<InputMaybe<Scalars['Float']['input']>>;
  contentRuleIds: Array<InputMaybe<Scalars['Float']['input']>>;
  includesAllContents: Scalars['Boolean']['input'];
  portfolioEventIds: Array<Scalars['Float']['input']>;
  portfolioId: Scalars['Float']['input'];
  teamId: Scalars['Float']['input'];
};

export type NexoyaMutationAssignFunnelStepMetricsToPortfolioContentsArgs = {
  contentIds: Array<Scalars['Float']['input']>;
  funnelStepMappings: Array<NexoyaManualContentFunnelStepMappingInput>;
  portfolioId: Scalars['Int']['input'];
  teamId: Scalars['Int']['input'];
};

export type NexoyaMutationAssignImpactGroupToPortfolioContentsArgs = {
  contentIds: Array<Scalars['Float']['input']>;
  impactGroupId?: InputMaybe<Scalars['Int']['input']>;
  portfolioId: Scalars['Int']['input'];
  teamId: Scalars['Int']['input'];
};

export type NexoyaMutationAutoGenerateContentRulesArgs = {
  portfolioId: Scalars['Float']['input'];
  teamId: Scalars['Float']['input'];
};

export type NexoyaMutationAutoGenerateImpactGroupRulesArgs = {
  portfolioId: Scalars['Float']['input'];
  teamId: Scalars['Float']['input'];
};

export type NexoyaMutationBulkAssignFunnelStepMetricsArgs = {
  childrenProviderId?: InputMaybe<Scalars['Int']['input']>;
  excludedContentIds: Array<Scalars['Float']['input']>;
  funnelStepId: Scalars['Int']['input'];
  metricId?: InputMaybe<Scalars['Int']['input']>;
  portfolioId: Scalars['Int']['input'];
  providerId?: InputMaybe<Scalars['Int']['input']>;
  teamId: Scalars['Int']['input'];
  title?: InputMaybe<Scalars['String']['input']>;
};

export type NexoyaMutationBulkAssignLabelsArgs = {
  contentIds: Array<Scalars['Float']['input']>;
  labelId?: InputMaybe<Scalars['Int']['input']>;
  portfolioId: Scalars['Int']['input'];
  teamId: Scalars['Int']['input'];
};

export type NexoyaMutationBulkCreateCustomKpisArgs = {
  customKpiNamesToBeUpdated?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  customKpis: Array<NexoyaCkBulkCreateInput>;
  team_id: Scalars['Int']['input'];
};

export type NexoyaMutationBulkCreatePortfolioEventsArgs = {
  portfolioEvents: Array<NexoyaBulkCreatePortfolioEventInput>;
  portfolioId: Scalars['Float']['input'];
  teamId: Scalars['Float']['input'];
};

export type NexoyaMutationBulkUpdatePortfolioEventsArgs = {
  portfolioEvents: Array<NexoyaBulkUpdatePortfolioEventInput>;
  portfolioId: Scalars['Float']['input'];
  teamId: Scalars['Float']['input'];
};

export type NexoyaMutationCancelOptimizationArgs = {
  optimizationId: Scalars['Int']['input'];
  teamId: Scalars['Int']['input'];
};

export type NexoyaMutationCancelSimulationArgs = {
  portfolioId: Scalars['Float']['input'];
  simulationId: Scalars['Float']['input'];
  teamId: Scalars['Float']['input'];
};

export type NexoyaMutationChangeBaseScenarioArgs = {
  newBaseScenarioId: Scalars['Float']['input'];
  portfolioId: Scalars['Float']['input'];
  simulationId: Scalars['Float']['input'];
  teamId: Scalars['Float']['input'];
};

export type NexoyaMutationChangeCurrencyArgs = {
  currency: Scalars['String']['input'];
  number_format: Scalars['String']['input'];
  team_id: Scalars['Int']['input'];
};

export type NexoyaMutationChangeProposalDataApplicationTypeArgs = {
  newApplicationType: NexoyaBudgetProposalDataApplicationType;
  optimizationId: Scalars['Int']['input'];
  portfolioContentId: Scalars['Float']['input'];
  portfolioId?: InputMaybe<Scalars['Int']['input']>;
  teamId: Scalars['Int']['input'];
};

export type NexoyaMutationComputeBudgetProposalBiddingStrategiesArgs = {
  A_ImpactReducer_ProposedBudgetChange?: InputMaybe<Scalars['Float']['input']>;
  B_ImpactReducer_BidStrategyTargetDelta?: InputMaybe<Scalars['Float']['input']>;
  boundaryPercent?: InputMaybe<Scalars['Float']['input']>;
  C_ImpactReducer_BudgetApplicationDelta?: InputMaybe<Scalars['Float']['input']>;
  from?: InputMaybe<Scalars['Date']['input']>;
  optimizationId: Scalars['Int']['input'];
  portfolioId: Scalars['Int']['input'];
  teamId: Scalars['Int']['input'];
  to?: InputMaybe<Scalars['Date']['input']>;
};

export type NexoyaMutationComputeBudgetProposalBudgetsArgs = {
  optimizationId: Scalars['Int']['input'];
  portfolioId: Scalars['Int']['input'];
  teamId: Scalars['Int']['input'];
};

export type NexoyaMutationConcludeOptimizationBudgetProposalArgs = {
  accept: Scalars['Boolean']['input'];
  optimizationId: Scalars['Int']['input'];
  skipContentIds?: InputMaybe<Array<Scalars['Float']['input']>>;
  teamId: Scalars['Int']['input'];
};

export type NexoyaMutationCopyPortfolioArgs = {
  portfolioId: Scalars['Int']['input'];
  teamId: Scalars['Int']['input'];
};

export type NexoyaMutationCopyReportArgs = {
  report_id: Scalars['Int']['input'];
};

export type NexoyaMutationCreateAttributionModelArgs = {
  channelFilters: Array<NexoyaAttributionModelChannelFilterInput>;
  exportStart: Scalars['Date']['input'];
  ga4Filters: NexoyaAttributionModelGa4FiltersInput;
  name: Scalars['String']['input'];
  targetMetric: Scalars['String']['input'];
  teamId: Scalars['Int']['input'];
};

export type NexoyaMutationCreateAttributionRuleArgs = {
  filters: NexoyaAttributionRuleFiltersInput;
  name: Scalars['String']['input'];
  portfolioId: Scalars['Float']['input'];
  teamId: Scalars['Float']['input'];
};

export type NexoyaMutationCreateBudgetItemArgs = {
  budgetAmount: Scalars['Float']['input'];
  endDate: Scalars['Date']['input'];
  name: Scalars['String']['input'];
  pacing: NexoyaPacingType;
  portfolioId: Scalars['Int']['input'];
  startDate: Scalars['Date']['input'];
  suspendedDate?: InputMaybe<Scalars['Date']['input']>;
  teamId: Scalars['Int']['input'];
};

export type NexoyaMutationCreateBudgetProposalArgs = {
  optimizationId: Scalars['Int']['input'];
  teamId: Scalars['Int']['input'];
};

export type NexoyaMutationCreateCollectionArgs = {
  collection?: InputMaybe<NexoyaCollectionInput>;
};

export type NexoyaMutationCreateContentRuleArgs = {
  contentIdsToAccept: Array<Scalars['Float']['input']>;
  filters: NexoyaContentRuleFiltersInput;
  name: Scalars['String']['input'];
  portfolioId: Scalars['Float']['input'];
  teamId: Scalars['Float']['input'];
};

export type NexoyaMutationCreateCustomKpiArgs = {
  calc_type: NexoyaCalcType;
  description?: InputMaybe<Scalars['String']['input']>;
  kpis?: InputMaybe<Array<NexoyaCkKpiInput>>;
  name: Scalars['String']['input'];
  noDataFetch?: InputMaybe<Scalars['Boolean']['input']>;
  search?: InputMaybe<NexoyaCkSearchInput>;
  team_id: Scalars['Int']['input'];
};

export type NexoyaMutationCreateEventArgs = {
  description?: InputMaybe<Scalars['String']['input']>;
  emoji?: InputMaybe<Scalars['String']['input']>;
  subject: Scalars['String']['input'];
  team_id: Scalars['Int']['input'];
  timestamp: Scalars['DateTime']['input'];
};

export type NexoyaMutationCreateFunnelStepMappingPresetArgs = {
  mapping: NexoyaFunnelStepMappingInput;
  name: Scalars['String']['input'];
  teamId: Scalars['Float']['input'];
};

export type NexoyaMutationCreateImpactGroupRuleArgs = {
  filters: NexoyaImpactGroupRuleFiltersInput;
  impactGroupId: Scalars['Float']['input'];
  name: Scalars['String']['input'];
  portfolioId: Scalars['Float']['input'];
  teamId: Scalars['Float']['input'];
};

export type NexoyaMutationCreateOnboardingDataArgs = {
  team_id: Scalars['Int']['input'];
};

export type NexoyaMutationCreateOptimizationArgs = {
  end: Scalars['Date']['input'];
  ignoreWeekdays?: InputMaybe<Array<NexoyaWeekday>>;
  portfolioId: Scalars['Int']['input'];
  skipCustomImportCheck?: InputMaybe<Scalars['Boolean']['input']>;
  teamId: Scalars['Int']['input'];
};

export type NexoyaMutationCreateOrUpdateLabelArgs = {
  labelId?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
  portfolioId: Scalars['Int']['input'];
  teamId: Scalars['Int']['input'];
};

export type NexoyaMutationCreateOrUpdatePortfolioImpactGroupArgs = {
  funnelStepIds: Array<Scalars['Int']['input']>;
  impactGroupId?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
  portfolioId: Scalars['Int']['input'];
  teamId: Scalars['Int']['input'];
};

export type NexoyaMutationCreateParentCollectionArgs = {
  children?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  collection?: InputMaybe<NexoyaCollectionInput>;
};

export type NexoyaMutationCreatePortfolioArgs = {
  budgetDeltaHandlingPolicy?: InputMaybe<NexoyaBudgetDeltaHandlingPolicy>;
  budgets?: InputMaybe<Array<InputMaybe<NexoyaBudgetInput>>>;
  contents?: InputMaybe<Array<Scalars['Float']['input']>>;
  createdByUserId: Scalars['Int']['input'];
  defaultOptimizationTarget: NexoyaFunnelStepType;
  description?: InputMaybe<Scalars['String']['input']>;
  endDate: Scalars['DateTime']['input'];
  isAttributed?: InputMaybe<Scalars['Boolean']['input']>;
  optimizationRiskLevel: Scalars['Int']['input'];
  optimizationType: NexoyaOptimizationType;
  skipTrainingDays?: InputMaybe<Scalars['Int']['input']>;
  startDate: Scalars['DateTime']['input'];
  teamId: Scalars['Int']['input'];
  title: Scalars['String']['input'];
  type: NexoyaPortfolioType;
};

export type NexoyaMutationCreatePortfolioEventArgs = {
  category: NexoyaEventCategory;
  description?: InputMaybe<Scalars['String']['input']>;
  end: Scalars['Date']['input'];
  impact: NexoyaEventImpact;
  name: Scalars['String']['input'];
  portfolioId: Scalars['Float']['input'];
  start: Scalars['Date']['input'];
  teamId: Scalars['Float']['input'];
};

export type NexoyaMutationCreatePortfolioTargetItemArgs = {
  end: Scalars['Date']['input'];
  maxBudget: Scalars['Float']['input'];
  name: Scalars['String']['input'];
  portfolioId: Scalars['Int']['input'];
  start: Scalars['Date']['input'];
  teamId: Scalars['Int']['input'];
  value: Scalars['Float']['input'];
};

export type NexoyaMutationCreateReportArgs = {
  config?: InputMaybe<Scalars['String']['input']>;
  dateRange: NexoyaReportDateRangeInput;
  description?: InputMaybe<Scalars['String']['input']>;
  kpis?: InputMaybe<Array<InputMaybe<NexoyaKpiInputOptMetric>>>;
  name: Scalars['String']['input'];
  report_type?: InputMaybe<Scalars['String']['input']>;
  team_id: Scalars['Int']['input'];
};

export type NexoyaMutationCreateShadowPortfolioArgs = {
  portfolioId: Scalars['Int']['input'];
  teamId: Scalars['Int']['input'];
};

export type NexoyaMutationCreateSimulationArgs = {
  budgetPacing?: InputMaybe<NexoyaSimulationBudgetPacing>;
  budgetSteps: Array<NexoyaSimulationBudgetStepInput>;
  budgetStepSize: Scalars['Int']['input'];
  end: Scalars['Date']['input'];
  ignoreContentBudgetLimits: Scalars['Boolean']['input'];
  name: Scalars['String']['input'];
  portfolioId: Scalars['Int']['input'];
  skipNonOptimizedContentBudgets: Scalars['Boolean']['input'];
  start: Scalars['Date']['input'];
  teamId: Scalars['Int']['input'];
};

export type NexoyaMutationDeactivatePortfolioArgs = {
  portfolioId: Scalars['Int']['input'];
  teamId: Scalars['Int']['input'];
};

export type NexoyaMutationDeleteAttributionModelArgs = {
  attributionModelId: Scalars['String']['input'];
  teamId: Scalars['Int']['input'];
};

export type NexoyaMutationDeleteAttributionModelFileArgs = {
  attributionModelFileId: Scalars['Int']['input'];
  attributionModelId: Scalars['String']['input'];
  teamId: Scalars['Int']['input'];
};

export type NexoyaMutationDeleteAttributionRuleArgs = {
  attributionRuleId: Scalars['Float']['input'];
  contentActions: Array<NexoyaDeleteAttributionRuleContentActionInput>;
  portfolioId: Scalars['Float']['input'];
  teamId: Scalars['Float']['input'];
};

export type NexoyaMutationDeleteBudgetItemArgs = {
  budgetItemId: Scalars['Int']['input'];
  portfolioId: Scalars['Int']['input'];
  teamId: Scalars['Int']['input'];
};

export type NexoyaMutationDeleteContentRuleArgs = {
  contentActions: Array<NexoyaDeleteContentRuleContentActionInput>;
  contentRuleId: Scalars['Float']['input'];
  portfolioId: Scalars['Float']['input'];
  teamId: Scalars['Float']['input'];
};

export type NexoyaMutationDeleteCustomImportDataArgs = {
  collectionIds?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  dateFrom?: InputMaybe<Scalars['Date']['input']>;
  dateTo?: InputMaybe<Scalars['Date']['input']>;
  nOfKpisToDeleteConfirm: Scalars['Int']['input'];
  teamId: Scalars['Int']['input'];
};

export type NexoyaMutationDeleteCustomKpiArgs = {
  custom_kpi_id: Scalars['Int']['input'];
};

export type NexoyaMutationDeleteEventArgs = {
  event_id: Scalars['Int']['input'];
};

export type NexoyaMutationDeleteFunnelStepArgs = {
  funnelStepId: Scalars['Int']['input'];
  portfolioId: Scalars['Int']['input'];
  teamId: Scalars['Int']['input'];
};

export type NexoyaMutationDeleteFunnelStepMappingPresetArgs = {
  funnelStepMappingPresetId: Scalars['Float']['input'];
  teamId: Scalars['Float']['input'];
};

export type NexoyaMutationDeleteImpactGroupRuleArgs = {
  contentActions: Array<NexoyaDeleteImpactGroupRuleContentActionInput>;
  impactGroupRuleId: Scalars['Float']['input'];
  portfolioId: Scalars['Float']['input'];
  teamId: Scalars['Float']['input'];
};

export type NexoyaMutationDeleteIntegrationArgs = {
  provider_id: Scalars['Int']['input'];
  provider_key_id?: InputMaybe<Scalars['Int']['input']>;
  team_id: Scalars['Int']['input'];
};

export type NexoyaMutationDeleteLabelArgs = {
  labelId: Scalars['Int']['input'];
  portfolioId: Scalars['Int']['input'];
  teamId: Scalars['Int']['input'];
};

export type NexoyaMutationDeleteOptimizationArgs = {
  optimizationId: Scalars['Int']['input'];
  portfolioId: Scalars['Int']['input'];
  teamId: Scalars['Int']['input'];
};

export type NexoyaMutationDeleteParentCollectionArgs = {
  id: Scalars['Int']['input'];
};

export type NexoyaMutationDeletePortfolioEventArgs = {
  portfolioEventId: Scalars['Float']['input'];
  portfolioId: Scalars['Float']['input'];
  teamId: Scalars['Float']['input'];
};

export type NexoyaMutationDeletePortfolioEventAssetArgs = {
  portfolioEventId: Scalars['Float']['input'];
  portfolioId: Scalars['Float']['input'];
  teamId: Scalars['Float']['input'];
};

export type NexoyaMutationDeletePortfolioImpactGroupArgs = {
  impactGroupId: Scalars['Int']['input'];
  portfolioId: Scalars['Int']['input'];
  teamId: Scalars['Int']['input'];
};

export type NexoyaMutationDeleteReportArgs = {
  report_id: Scalars['Int']['input'];
  team_id: Scalars['Int']['input'];
};

export type NexoyaMutationDeleteSimulationArgs = {
  portfolioId: Scalars['Float']['input'];
  simulationId: Scalars['Float']['input'];
  teamId: Scalars['Float']['input'];
};

export type NexoyaMutationEditBudgetItemArgs = {
  budgetAmount?: InputMaybe<Scalars['Float']['input']>;
  budgetItemId: Scalars['Int']['input'];
  endDate?: InputMaybe<Scalars['Date']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  portfolioId: Scalars['Int']['input'];
  startDate?: InputMaybe<Scalars['Date']['input']>;
  teamId: Scalars['Int']['input'];
};

export type NexoyaMutationEditPortfolioTargetItemArgs = {
  end?: InputMaybe<Scalars['Date']['input']>;
  maxBudget?: InputMaybe<Scalars['Float']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  portfolioId: Scalars['Int']['input'];
  start?: InputMaybe<Scalars['Date']['input']>;
  targetItemId: Scalars['Int']['input'];
  teamId: Scalars['Int']['input'];
  value?: InputMaybe<Scalars['Float']['input']>;
};

export type NexoyaMutationEditSimulationArgs = {
  budgetPacing?: InputMaybe<NexoyaSimulationBudgetPacing>;
  budgetSteps?: InputMaybe<Array<NexoyaSimulationBudgetStepInput>>;
  budgetStepSize?: InputMaybe<Scalars['Int']['input']>;
  end?: InputMaybe<Scalars['Date']['input']>;
  ignoreContentBudgetLimits?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  portfolioId: Scalars['Float']['input'];
  simulationId: Scalars['Float']['input'];
  skipNonOptimizedContentBudgets?: InputMaybe<Scalars['Boolean']['input']>;
  start?: InputMaybe<Scalars['Date']['input']>;
  teamId: Scalars['Float']['input'];
};

export type NexoyaMutationEndBudgetItemArgs = {
  budgetItemId: Scalars['Int']['input'];
  portfolioId: Scalars['Int']['input'];
  teamId: Scalars['Int']['input'];
};

export type NexoyaMutationEndPortfolioTargetItemArgs = {
  portfolioId: Scalars['Int']['input'];
  targetItemId: Scalars['Int']['input'];
  teamId: Scalars['Int']['input'];
};

export type NexoyaMutationExecuteAutomaticFreeFormBiddingStrategyChangesArgs = {
  changes: Array<NexoyaFreeFormBiddingStrategyChangeInput>;
  dryRun?: InputMaybe<Scalars['Boolean']['input']>;
  teamId: Scalars['Int']['input'];
};

export type NexoyaMutationExecuteAutomaticFreeFormDailyBudgetChangesArgs = {
  changes: Array<NexoyaFreeFormDailyBudgetChangeInput>;
  dryRun?: InputMaybe<Scalars['Boolean']['input']>;
  teamId: Scalars['Int']['input'];
};

export type NexoyaMutationExecuteAutomaticFreeFormLifetimeBudgetChangesArgs = {
  changes: Array<NexoyaFreeFormLifetimeBudgetChangeInput>;
  dryRun?: InputMaybe<Scalars['Boolean']['input']>;
  teamId: Scalars['Int']['input'];
};

export type NexoyaMutationExecuteBudgetProposalArgs = {
  dryRun?: InputMaybe<Scalars['Boolean']['input']>;
  optimizationId: Scalars['Int']['input'];
  portfolioContentIdsToApplyManually?: InputMaybe<Array<Scalars['Float']['input']>>;
  targetBiddingApplyMode: NexoyaTargetBiddingApplyMode;
  teamId: Scalars['Int']['input'];
};

export type NexoyaMutationExportAttributionModelChannelsToBlobArgs = {
  attributionModelId: Scalars['String']['input'];
  teamId: Scalars['Int']['input'];
};

export type NexoyaMutationFixPortfolioContentMetricsArgs = {
  portfolioId: Scalars['Int']['input'];
  teamId: Scalars['Int']['input'];
};

export type NexoyaMutationFlushCacheArgs = {
  portfolioId?: InputMaybe<Scalars['Int']['input']>;
  teamId: Scalars['Int']['input'];
};

export type NexoyaMutationInviteShareUserArgs = {
  shareType: NexoyaShareType;
  sharingObjectName?: InputMaybe<NexoyaSharingObjectName>;
  team_id: Scalars['Int']['input'];
  to_email: Scalars['String']['input'];
  to_name: Scalars['String']['input'];
  url: Scalars['String']['input'];
};

export type NexoyaMutationInviteUserArgs = {
  team_id: Scalars['Int']['input'];
  to_email: Scalars['String']['input'];
  to_name: Scalars['String']['input'];
};

export type NexoyaMutationMakeOptimizationVisibleToAllUsersArgs = {
  optimizationId: Scalars['Int']['input'];
  portfolioId: Scalars['Int']['input'];
  teamId: Scalars['Int']['input'];
};

export type NexoyaMutationMakeSimulationVisibleToAllUsersArgs = {
  portfolioId: Scalars['Float']['input'];
  simulationId: Scalars['Float']['input'];
  teamId: Scalars['Float']['input'];
};

export type NexoyaMutationMarkProposalDataAsAppliedArgs = {
  optimizationId: Scalars['Int']['input'];
  portfolioContentIds?: InputMaybe<Array<Scalars['Float']['input']>>;
  teamId: Scalars['Int']['input'];
};

export type NexoyaMutationMergeShadowPortfolioArgs = {
  portfolioId: Scalars['Int']['input'];
  teamId: Scalars['Int']['input'];
};

export type NexoyaMutationReapplyContentRulesMappingsArgs = {
  contentRuleIds?: InputMaybe<Array<Scalars['Float']['input']>>;
  portfolioId: Scalars['Float']['input'];
  teamId: Scalars['Float']['input'];
};

export type NexoyaMutationRefreshPortfolioContentMeasurementsArgs = {
  endDate?: InputMaybe<Scalars['Date']['input']>;
  portfolioId?: InputMaybe<Scalars['Int']['input']>;
  startDate?: InputMaybe<Scalars['Date']['input']>;
  teamId: Scalars['Int']['input'];
};

export type NexoyaMutationRejectDiscoveredContentsArgs = {
  discoveredContentIds: Array<Scalars['Float']['input']>;
  portfolioId: Scalars['Float']['input'];
  teamId: Scalars['Float']['input'];
};

export type NexoyaMutationRemoveContentRelationArgs = {
  contentId: Scalars['Float']['input'];
  portfolioId: Scalars['Int']['input'];
  teamId: Scalars['Int']['input'];
};

export type NexoyaMutationRemovePortfolioContentArgs = {
  portfolioContentIds: Array<Scalars['Int']['input']>;
  portfolioId: Scalars['Int']['input'];
  teamId: Scalars['Int']['input'];
};

export type NexoyaMutationRemovePortfolioContentWithCollectionIdArgs = {
  collectionIds: Array<Scalars['Float']['input']>;
  portfolioId: Scalars['Int']['input'];
  teamId: Scalars['Int']['input'];
};

export type NexoyaMutationRemovePortfolioTargetItemArgs = {
  portfolioId: Scalars['Int']['input'];
  targetItemId: Scalars['Int']['input'];
  teamId: Scalars['Int']['input'];
};

export type NexoyaMutationRemoveReportKpisArgs = {
  kpis: Array<NexoyaKpiInputOptMetric>;
  report_id: Scalars['Int']['input'];
};

export type NexoyaMutationRemoveSelectedMeasurementArgs = {
  collection_id: Scalars['Float']['input'];
  measurement_id: Scalars['Int']['input'];
  team_id: Scalars['Int']['input'];
};

export type NexoyaMutationRemoveUserArgs = {
  team_id: Scalars['Int']['input'];
  user_to_remove_id: Scalars['Int']['input'];
};

export type NexoyaMutationReplaceCurrencyExchangeTimeframesArgs = {
  teamId: Scalars['Int']['input'];
  timeframes: Array<NexoyaCurrencyExchangeTimeframeInput>;
};

export type NexoyaMutationRestoreRemovedDiscoveredContentsArgs = {
  contentIds: Array<Scalars['Float']['input']>;
  portfolioId: Scalars['Float']['input'];
  teamId: Scalars['Float']['input'];
};

export type NexoyaMutationRetryContentAutomaticApplicationArgs = {
  contentId: Scalars['Float']['input'];
  dryRun?: InputMaybe<Scalars['Boolean']['input']>;
  optimizationId: Scalars['Int']['input'];
  teamId: Scalars['Int']['input'];
};

export type NexoyaMutationRetryOptimizationDataFetchesArgs = {
  optimizationId: Scalars['Int']['input'];
  teamId: Scalars['Int']['input'];
};

export type NexoyaMutationRetryOptimizationTaskArgs = {
  optimizationId: Scalars['Int']['input'];
  portfolioId: Scalars['Int']['input'];
  taskToRetry: NexoyaOptimizationTaskType;
  teamId: Scalars['Int']['input'];
};

export type NexoyaMutationRevertBudgetProposalArgs = {
  dryRun?: InputMaybe<Scalars['Boolean']['input']>;
  optimizationId: Scalars['Int']['input'];
  targetBiddingApplyMode: NexoyaTargetBiddingApplyMode;
  teamId: Scalars['Int']['input'];
};

export type NexoyaMutationRunSimulationArgs = {
  portfolioId: Scalars['Float']['input'];
  simulationId: Scalars['Float']['input'];
  teamId: Scalars['Float']['input'];
};

export type NexoyaMutationSetSimulationIsArchivedArgs = {
  isArchived: Scalars['Boolean']['input'];
  portfolioId: Scalars['Float']['input'];
  simulationId: Scalars['Float']['input'];
  teamId: Scalars['Float']['input'];
};

export type NexoyaMutationSetSimulationMonitoringUrlArgs = {
  monitoringUrl?: InputMaybe<Scalars['String']['input']>;
  portfolioId: Scalars['Float']['input'];
  simulationId: Scalars['Float']['input'];
  teamId: Scalars['Float']['input'];
};

export type NexoyaMutationSetUserInfoArgs = {
  userInfo: NexoyaUserInfo;
};

export type NexoyaMutationSetUserStateArgs = {
  state: NexoyaUserStateEnum;
};

export type NexoyaMutationSetWhitelistFilterArgs = {
  addList?: InputMaybe<Array<Scalars['String']['input']>>;
  filterList?: InputMaybe<Array<Scalars['String']['input']>>;
  filterName: Scalars['String']['input'];
  lastFilter?: InputMaybe<Scalars['Boolean']['input']>;
  provider_id: Scalars['Int']['input'];
  removeList?: InputMaybe<Array<Scalars['String']['input']>>;
  team_id: Scalars['Int']['input'];
};

export type NexoyaMutationSkipOptimizationDataFetchesArgs = {
  optimizationId: Scalars['Int']['input'];
  teamId: Scalars['Int']['input'];
};

export type NexoyaMutationSwitchManualContentsToRuleBasedArgs = {
  discoveredContentsWithRulesToApply: Array<NexoyaApplyRulesToDiscoveredContentsRulesMapInput>;
  portfolioId: Scalars['Float']['input'];
  teamId: Scalars['Float']['input'];
};

export type NexoyaMutationSyncTeamChannelArgs = {
  from?: InputMaybe<Scalars['Date']['input']>;
  providerId: Scalars['Int']['input'];
  teamId: Scalars['Int']['input'];
  to?: InputMaybe<Scalars['Date']['input']>;
};

export type NexoyaMutationUpdateAttributionModelArgs = {
  attributionModelId: Scalars['String']['input'];
  teamId: Scalars['Int']['input'];
  updates: NexoyaUpdateAttributionModelInput;
};

export type NexoyaMutationUpdateAttributionRuleFactorsArgs = {
  attributionRuleId: Scalars['Float']['input'];
  factors: Array<NexoyaAttributionRuleFactorInput>;
  portfolioId: Scalars['Float']['input'];
  teamId: Scalars['Float']['input'];
};

export type NexoyaMutationUpdateAttributionRuleFiltersArgs = {
  attributionRuleId: Scalars['Float']['input'];
  contentActions: Array<NexoyaUpdateAttributionRuleFiltersContentActionInput>;
  filters: NexoyaAttributionRuleFiltersInput;
  portfolioId: Scalars['Float']['input'];
  teamId: Scalars['Float']['input'];
};

export type NexoyaMutationUpdateAttributionRuleNameArgs = {
  attributionRuleId: Scalars['Float']['input'];
  name: Scalars['String']['input'];
  portfolioId: Scalars['Float']['input'];
  teamId: Scalars['Float']['input'];
};

export type NexoyaMutationUpdateBudgetCsArgs = {
  dateFrom: Scalars['Date']['input'];
  dateTo: Scalars['Date']['input'];
  newAllocatedValue: Scalars['Float']['input'];
  portfolioId: Scalars['Int']['input'];
  providerId: Scalars['Int']['input'];
  teamId: Scalars['Int']['input'];
};

export type NexoyaMutationUpdateBudgetDetailArgs = {
  budgetDetail: NexoyaBudgetDetailInput;
  portfolioId: Scalars['Int']['input'];
  teamId: Scalars['Int']['input'];
};

export type NexoyaMutationUpdateContentRuleFiltersArgs = {
  contentActions: Array<NexoyaUpdateContentRuleFiltersContentActionInput>;
  contentRuleId: Scalars['Float']['input'];
  filters: NexoyaContentRuleFiltersInput;
  portfolioId: Scalars['Float']['input'];
  teamId: Scalars['Float']['input'];
};

export type NexoyaMutationUpdateContentRuleFunnelStepMappingsArgs = {
  contentRuleId: Scalars['Float']['input'];
  funnelStepMappings: Array<NexoyaContentRuleFunnelStepMappingInput>;
  portfolioId: Scalars['Float']['input'];
  teamId: Scalars['Float']['input'];
};

export type NexoyaMutationUpdateContentRuleNameArgs = {
  contentRuleId: Scalars['Float']['input'];
  name: Scalars['String']['input'];
  portfolioId: Scalars['Float']['input'];
  teamId: Scalars['Float']['input'];
};

export type NexoyaMutationUpdateContentTargetMetricArgs = {
  contentFunnelStepMetric: NexoyaPortfolioContentFunnelStepMetricInput;
  portfolioId: Scalars['Int']['input'];
  teamId: Scalars['Int']['input'];
};

export type NexoyaMutationUpdateCustomKpiArgs = {
  calc_type?: InputMaybe<NexoyaCalcType>;
  custom_kpi_id: Scalars['Int']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  kpis?: InputMaybe<Array<NexoyaCkKpiInput>>;
  name?: InputMaybe<Scalars['String']['input']>;
  search?: InputMaybe<NexoyaCkSearchInput>;
};

export type NexoyaMutationUpdateDefaultOptimizationTargetArgs = {
  funnelStepId: Scalars['Int']['input'];
  portfolioId: Scalars['Int']['input'];
  teamId: Scalars['Int']['input'];
};

export type NexoyaMutationUpdateEventArgs = {
  description?: InputMaybe<Scalars['String']['input']>;
  emoji?: InputMaybe<Scalars['String']['input']>;
  event_id: Scalars['Int']['input'];
  subject?: InputMaybe<Scalars['String']['input']>;
  timestamp?: InputMaybe<Scalars['DateTime']['input']>;
};

export type NexoyaMutationUpdateFeatureFlagArgs = {
  name: NexoyaPortfolioFeatureFlag;
  portfolioId: Scalars['Int']['input'];
  status: Scalars['Boolean']['input'];
  teamId: Scalars['Int']['input'];
};

export type NexoyaMutationUpdateFunnelStepMappingPresetArgs = {
  funnelStepMappingPresetId: Scalars['Float']['input'];
  mapping?: InputMaybe<NexoyaFunnelStepMappingInput>;
  name?: InputMaybe<Scalars['String']['input']>;
  teamId: Scalars['Float']['input'];
};

export type NexoyaMutationUpdateImpactGroupRuleArgs = {
  contentActions?: InputMaybe<Array<InputMaybe<NexoyaUpdateImpactGroupRuleFiltersContentActionInput>>>;
  impactGroupRuleEdit: NexoyaImpactGroupRuleEditInput;
  impactGroupRuleId: Scalars['Float']['input'];
  portfolioId: Scalars['Float']['input'];
  teamId: Scalars['Float']['input'];
};

export type NexoyaMutationUpdateOptimizationArgs = {
  attachment?: InputMaybe<Scalars['String']['input']>;
  dateApplied?: InputMaybe<Scalars['DateTime']['input']>;
  dateArchived?: InputMaybe<Scalars['DateTime']['input']>;
  dateCreated?: InputMaybe<Scalars['DateTime']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  optimizationId: Scalars['Int']['input'];
  portfolioId: Scalars['Int']['input'];
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
  teamId: Scalars['Int']['input'];
  title?: InputMaybe<Scalars['String']['input']>;
};

export type NexoyaMutationUpdatePortfolioArgs = {
  budgetDeltaHandlingPolicy?: InputMaybe<NexoyaBudgetDeltaHandlingPolicy>;
  budgetProposalTargetBiddingApplyMode?: InputMaybe<NexoyaTargetBiddingApplyMode>;
  description?: InputMaybe<Scalars['String']['input']>;
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  optimizationRiskLevel?: InputMaybe<Scalars['Int']['input']>;
  optimizationType?: InputMaybe<NexoyaOptimizationType>;
  portfolioDashboardUrls?: InputMaybe<Array<InputMaybe<NexoyaPortfolioDashboardUrlInput>>>;
  portfolioId: Scalars['Int']['input'];
  portfolioMonitorBudgetThreshold?: InputMaybe<Scalars['Int']['input']>;
  portfolioMonitorFunnelStepThreshold?: InputMaybe<Scalars['Int']['input']>;
  skipTrainingDays?: InputMaybe<Scalars['Int']['input']>;
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
  teamId: Scalars['Int']['input'];
  title?: InputMaybe<Scalars['String']['input']>;
};

export type NexoyaMutationUpdatePortfolioContentBudgetBoundariesArgs = {
  newBudget: NexoyaPortfolioContentBudgetInput;
  onlyContentIds?: InputMaybe<Array<Scalars['Float']['input']>>;
  portfolioId: Scalars['Float']['input'];
  teamId: Scalars['Float']['input'];
};

export type NexoyaMutationUpdatePortfolioContentsIncludedInOptimizationArgs = {
  isIncludedInOptimization: Scalars['Boolean']['input'];
  portfolioContentIds: Array<Scalars['Float']['input']>;
  portfolioId: Scalars['Float']['input'];
  teamId: Scalars['Float']['input'];
};

export type NexoyaMutationUpdatePortfolioEventArgs = {
  category?: InputMaybe<NexoyaEventCategory>;
  description?: InputMaybe<Scalars['String']['input']>;
  end?: InputMaybe<Scalars['Date']['input']>;
  impact?: InputMaybe<NexoyaEventImpact>;
  name?: InputMaybe<Scalars['String']['input']>;
  portfolioEventId: Scalars['Float']['input'];
  portfolioId: Scalars['Float']['input'];
  start?: InputMaybe<Scalars['Date']['input']>;
  teamId: Scalars['Float']['input'];
};

export type NexoyaMutationUpdateReportArgs = {
  config?: InputMaybe<Scalars['String']['input']>;
  dateRange?: InputMaybe<NexoyaReportDateRangeInput>;
  description?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  report_id: Scalars['Int']['input'];
};

export type NexoyaMutationUpdateRuleBasedPorfolioContentsToManualArgs = {
  collectionIds: Array<Scalars['Float']['input']>;
  portfolioId: Scalars['Int']['input'];
  teamId: Scalars['Int']['input'];
};

export type NexoyaMutationUpdateSelectedKpIsArgs = {
  kpi_ids?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  team_id: Scalars['Int']['input'];
};

export type NexoyaMutationUpdateSelectedMeasurementsArgs = {
  measurement_collection?: InputMaybe<Array<InputMaybe<NexoyaMeasurementCollectionInput>>>;
  team_id: Scalars['Int']['input'];
};

export type NexoyaMutationUpdateTeamArgs = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  currency?: InputMaybe<Scalars['String']['input']>;
  dashboardUrls?: InputMaybe<Array<NexoyaDashboardUrlInput>>;
  featureFlags?: InputMaybe<Array<NexoyaFeatureFlagInput>>;
  logo?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  numberFormat?: InputMaybe<Scalars['String']['input']>;
  onboarding?: InputMaybe<NexoyaOnboardingInput>;
  team_id: Scalars['Int']['input'];
};

export type NexoyaMutationUpdateTeamFeatureFlagArgs = {
  name: Scalars['String']['input'];
  status: Scalars['Boolean']['input'];
  team_id: Scalars['Int']['input'];
};

export type NexoyaMutationUpdateTeamMemberRoleArgs = {
  new_role_def: Scalars['String']['input'];
  team_id: Scalars['Int']['input'];
  user_id: Scalars['Int']['input'];
};

export type NexoyaMutationUpsertPortfolioFunnelStepsArgs = {
  funnelSteps: Array<NexoyaUpsertPortfolioFunnelStepsMutationFunnelStepInput>;
  portfolioId: Scalars['Int']['input'];
  teamId: Scalars['Int']['input'];
};

export type NexoyaMutationUpsertPortfolioImpactGroupsArgs = {
  impactGroups: Array<NexoyaUpsertImpactGroupInput>;
  portfolioId: Scalars['Int']['input'];
  teamId: Scalars['Int']['input'];
};

export type NexoyaMutationUpsertProviderKeyArgs = {
  item?: InputMaybe<NexoyaProviderKeyInput>;
};

export type NexoyaMutationUpsertTeamArgs = {
  org?: InputMaybe<NexoyaTeamWithOrgInput>;
  team?: InputMaybe<NexoyaTeamInput>;
};

export type NexoyaMutationWhitelistViewsArgs = {
  provider_id: Scalars['Int']['input'];
  team_id: Scalars['Int']['input'];
  viewIds: Array<Scalars['Int']['input']>;
};

export type NexoyaNewOptimizationSummary = {
  __typename?: 'NewOptimizationSummary';
  allContentsHaveImpactGroupAssigned: Scalars['Boolean']['output'];
  attribution: NexoyaNewOptimizationSummaryAttributionPrecheck;
  daysWithMissingBudget: Array<Scalars['Date']['output']>;
  ignoreWeekdays: Array<NexoyaWeekday>;
  isCustomImportDataFresh: Scalars['Boolean']['output'];
  isOptiPeriodSpanningMultipleTargetItems: Scalars['Boolean']['output'];
  missingCurrencyCoverage: Array<NexoyaMissingCurrencyCoverage>;
  targetItem?: Maybe<NexoyaPortfolioTargetItem>;
  totalBudget: Scalars['Float']['output'];
};

export type NexoyaNewOptimizationSummaryAttributionPrecheck = {
  __typename?: 'NewOptimizationSummaryAttributionPrecheck';
  attributionRuleWithNoFactors: Array<NexoyaAttributionRule>;
  contentWithNoAttributionRules: Array<NexoyaContentV2>;
  hasErrors: Scalars['Boolean']['output'];
};

export type NexoyaNewSimulationSummary = {
  __typename?: 'NewSimulationSummary';
  budgetPreviews: Array<NexoyaSimulationBudgetPreview>;
  hasContentsWithBudgetLimits: Scalars['Boolean']['output'];
  hasDisabledContents: Scalars['Boolean']['output'];
  missingCurrencyCoverage: Array<NexoyaMissingCurrencyCoverage>;
};

export type NexoyaOnboardingInput = {
  onboardingTasks?: InputMaybe<Array<NexoyaOnboardingTaskInput>>;
  videoSrc?: InputMaybe<Scalars['String']['input']>;
};

export type NexoyaOnboardingTaskInput = {
  deadline: Scalars['String']['input'];
  externalLink?: InputMaybe<NexoyaExternalLinkInput>;
  providerId?: InputMaybe<Scalars['Int']['input']>;
  responsible: Scalars['String']['input'];
  status: Scalars['String']['input'];
  title: Scalars['String']['input'];
};

export type NexoyaOptimizationConnection = {
  __typename?: 'OptimizationConnection';
  edges: Array<NexoyaOptimizationEdge>;
  pageInfo: NexoyaPageInfo;
};

export type NexoyaOptimizationEdge = {
  __typename?: 'OptimizationEdge';
  cursor: Scalars['String']['output'];
  node: NexoyaOptimizationV2;
};

export type NexoyaOptimizationLabelMetricTotal = {
  __typename?: 'OptimizationLabelMetricTotal';
  baselineTotal: Scalars['Float']['output'];
  expectedTotal: Scalars['Float']['output'];
  labelId: Scalars['Int']['output'];
};

export type NexoyaOptimizationMetricTotal = {
  __typename?: 'OptimizationMetricTotal';
  baselineTotal: Scalars['Float']['output'];
  expectedTotal: Scalars['Float']['output'];
  labels?: Maybe<Array<NexoyaOptimizationLabelMetricTotal>>;
  potentialPercentage?: Maybe<Scalars['Float']['output']>;
  providers?: Maybe<Array<NexoyaOptimizationProviderMetricTotal>>;
};

export type NexoyaOptimizationPerformance = {
  __typename?: 'OptimizationPerformance';
  channels: Array<NexoyaOptimizedChannel>;
  contents: Array<NexoyaOptimizedContent>;
  impactGroups: Array<NexoyaOptimizedImpactGroup>;
  labels: Array<NexoyaOptimizedLabel>;
  total: NexoyaOptimizedTotal;
};

export type NexoyaOptimizationProviderMetricTotal = {
  __typename?: 'OptimizationProviderMetricTotal';
  baselineTotal: Scalars['Float']['output'];
  expectedTotal: Scalars['Float']['output'];
  providerId: Scalars['Int']['output'];
};

export enum NexoyaOptimizationStatus {
  Applied = 'APPLIED',
  Cancelled = 'CANCELLED',
  Discarded = 'DISCARDED',
  Running = 'RUNNING',
}

export type NexoyaOptimizationTasks = {
  __typename?: 'OptimizationTasks';
  APPLYING_BUDGET_PROPOSAL: NexoyaOptimizationTaskStatus;
  COMPUTING_BUDGET: NexoyaOptimizationTaskStatus;
  FETCHING_DATA: NexoyaOptimizationTaskStatus;
  GENERATING_BUDGET_PROPOSAL: NexoyaOptimizationTaskStatus;
  PROPOSAL_WAITING: NexoyaOptimizationTaskStatus;
  RUNNING_OPTIMIZATION: NexoyaOptimizationTaskStatus;
};

export enum NexoyaOptimizationTaskStatus {
  Failed = 'FAILED',
  Pending = 'PENDING',
  Running = 'RUNNING',
  Skipped = 'SKIPPED',
  Successful = 'SUCCESSFUL',
}

export enum NexoyaOptimizationTaskType {
  ApplyingBudgetProposal = 'APPLYING_BUDGET_PROPOSAL',
  ComputingBudget = 'COMPUTING_BUDGET',
  FetchingData = 'FETCHING_DATA',
  GeneratingBudgetProposal = 'GENERATING_BUDGET_PROPOSAL',
  ProposalWaiting = 'PROPOSAL_WAITING',
  RunningOptimization = 'RUNNING_OPTIMIZATION',
}

export enum NexoyaOptimizationType {
  Auto = 'AUTO',
  Manual = 'MANUAL',
  Skip = 'SKIP',
}

export type NexoyaOptimizationV2 = {
  __typename?: 'OptimizationV2';
  appliedAt?: Maybe<Scalars['Date']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  end: Scalars['Date']['output'];
  isBaselinePredictionRescaled: Scalars['Boolean']['output'];
  onlyVisibleToSupportUsers: Scalars['Boolean']['output'];
  optimizationId: Scalars['Int']['output'];
  performance?: Maybe<NexoyaOptimizationPerformance>;
  portfolioEvents: Array<Maybe<NexoyaPortfolioEventSnapshot>>;
  start: Scalars['Date']['output'];
  status: NexoyaOptimizationStatus;
  target?: Maybe<Scalars['Float']['output']>;
  tasks: NexoyaOptimizationTasks;
  title: Scalars['String']['output'];
  totalBudget?: Maybe<Scalars['Float']['output']>;
  usedBudgetProposalTargetBiddingApplyMode?: Maybe<NexoyaTargetBiddingApplyMode>;
  ignoreWeekdays: Array<Scalars['String']['output']>;
  user: NexoyaUser;
};

export type NexoyaOptimizedChannel = {
  __typename?: 'OptimizedChannel';
  budget: NexoyaOptimizedDailyBudget;
  channelId: Scalars['Int']['output'];
  funnelSteps: Array<Maybe<NexoyaOptimizedFunnelStep>>;
  target?: Maybe<NexoyaOptimizedTarget>;
};

export type NexoyaOptimizedContent = {
  __typename?: 'OptimizedContent';
  budget?: Maybe<NexoyaOptimizedDailyBudget>;
  budgetProposalData?: Maybe<NexoyaBudgetProposalData>;
  content: NexoyaCollection;
  funnelSteps?: Maybe<Array<Maybe<NexoyaOptimizedFunnelStep>>>;
  impactGroup?: Maybe<NexoyaImpactGroup>;
  label?: Maybe<NexoyaPortfolioLabel>;
  status?: Maybe<NexoyaOptimizedContentStatus>;
  target?: Maybe<NexoyaOptimizedTarget>;
};

export type NexoyaOptimizedContentStatus = {
  __typename?: 'OptimizedContentStatus';
  payload?: Maybe<Array<NexoyaOptimizedContentStatusPayload>>;
  reason: NexoyaOptimizedContentStatusReason;
  type: NexoyaOptimizedContentStatusType;
};

export type NexoyaOptimizedContentStatusPayload = {
  __typename?: 'OptimizedContentStatusPayload';
  appliedBudget?: Maybe<Scalars['Float']['output']>;
  budgetMax?: Maybe<Scalars['Float']['output']>;
  budgetMin?: Maybe<Scalars['Float']['output']>;
  budgetRevenueResponseCurve?: Maybe<Array<Array<Scalars['Float']['output']>>>;
  funnelStep?: Maybe<NexoyaFunnelStepV2>;
  impressionShare?: Maybe<Scalars['Float']['output']>;
  plannedBudget?: Maybe<Scalars['Float']['output']>;
  saturationPoint?: Maybe<Array<Scalars['Float']['output']>>;
  saturationProfitPerUnit?: Maybe<Scalars['Float']['output']>;
  saturationScore?: Maybe<Scalars['Float']['output']>;
  saturationTangent?: Maybe<Array<Array<Scalars['Float']['output']>>>;
  spentBudget?: Maybe<Scalars['Float']['output']>;
};

export enum NexoyaOptimizedContentStatusReason {
  BudgetBoundariesMaxBudget = 'BUDGET_BOUNDARIES_MAX_BUDGET',
  BudgetBoundariesMinBudget = 'BUDGET_BOUNDARIES_MIN_BUDGET',
  ContentNotServing = 'CONTENT_NOT_SERVING',
  DisabledOptimzation = 'DISABLED_OPTIMZATION',
  ImpressionShare = 'IMPRESSION_SHARE',
  IsEnding = 'IS_ENDING',
  Materiality = 'MATERIALITY',
  NoData = 'NO_DATA',
  PlannedVsSpent = 'PLANNED_VS_SPENT',
  Saturated = 'SATURATED',
  SpendBelowThreshold = 'SPEND_BELOW_THRESHOLD',
}

export enum NexoyaOptimizedContentStatusType {
  Insight = 'INSIGHT',
  Limited = 'LIMITED',
  Skipped = 'SKIPPED',
}

export type NexoyaOptimizedDailyBudget = {
  __typename?: 'OptimizedDailyBudget';
  changePercent: Scalars['Float']['output'];
  proposed: Scalars['Float']['output'];
  spent: Scalars['Float']['output'];
};

export type NexoyaOptimizedFunnelStep = {
  __typename?: 'OptimizedFunnelStep';
  attribution?: Maybe<NexoyaAttributionOptimizedMetric>;
  costPer: NexoyaOptimizedMetric;
  funnelStep: NexoyaFunnelStepV2;
  lowDataVolume: Scalars['Boolean']['output'];
  metric: NexoyaOptimizedMetric;
  roas: NexoyaOptimizedMetric;
};

export type NexoyaOptimizedImpactGroup = {
  __typename?: 'OptimizedImpactGroup';
  budget: NexoyaOptimizedDailyBudget;
  funnelSteps: Array<Maybe<NexoyaOptimizedFunnelStep>>;
  impactGroup?: Maybe<NexoyaImpactGroup>;
  target?: Maybe<NexoyaOptimizedTarget>;
};

export type NexoyaOptimizedLabel = {
  __typename?: 'OptimizedLabel';
  budget: NexoyaOptimizedDailyBudget;
  funnelSteps: Array<Maybe<NexoyaOptimizedFunnelStep>>;
  label?: Maybe<NexoyaPortfolioLabel>;
  target?: Maybe<NexoyaOptimizedTarget>;
};

export type NexoyaOptimizedMetric = {
  __typename?: 'OptimizedMetric';
  baseline?: Maybe<Scalars['Float']['output']>;
  changePercent?: Maybe<Scalars['Float']['output']>;
  predicted?: Maybe<Scalars['Float']['output']>;
};

export type NexoyaOptimizedTarget = {
  __typename?: 'OptimizedTarget';
  changePercent?: Maybe<Scalars['Float']['output']>;
  lowerIsBetter: Scalars['Boolean']['output'];
  previous?: Maybe<Scalars['Float']['output']>;
  proposed?: Maybe<Scalars['Float']['output']>;
};

export type NexoyaOptimizedTotal = {
  __typename?: 'OptimizedTotal';
  budget: NexoyaOptimizedDailyBudget;
  funnelSteps: Array<Maybe<NexoyaOptimizedFunnelStep>>;
  target?: Maybe<NexoyaOptimizedTarget>;
};

export enum NexoyaOptionalFieldName {
  BudgetItemId = 'budgetItemId',
  CollectionId = 'collectionId',
  ContentRuleIds = 'contentRuleIds',
  FunnelStepId = 'funnelStepId',
  FunnelStepMappings = 'funnelStepMappings',
  ImpactGroupId = 'impactGroupId',
  ImpactGroupRuleIds = 'impactGroupRuleIds',
  LabelId = 'labelId',
  OptimizationId = 'optimizationId',
  PortfolioContentId = 'portfolioContentId',
  PortfolioId = 'portfolioId',
  ScenarioId = 'scenarioId',
  SimulationId = 'simulationId',
  TargetItemId = 'targetItemId',
}

export type NexoyaOrg = {
  __typename?: 'Org';
  logo?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  org_id: Scalars['Int']['output'];
  tenant?: Maybe<NexoyaTenant>;
};

export type NexoyaOrgInfoInput = {
  logo?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type NexoyaOtherFunnelStepMetrics = {
  __typename?: 'OtherFunnelStepMetrics';
  activeFunnelStepMetricId?: Maybe<Scalars['Int']['output']>;
  funnelStepTypeName: Scalars['String']['output'];
  otherMetrics?: Maybe<Array<Maybe<NexoyaMetricMeta>>>;
  providerId?: Maybe<Scalars['Int']['output']>;
};

export enum NexoyaPacingType {
  DataDriven = 'DATA_DRIVEN',
  Fixed = 'FIXED',
  RampUp = 'RAMP_UP',
  Smooth = 'SMOOTH',
}

export type NexoyaPageInfo = {
  __typename?: 'PageInfo';
  endCursor?: Maybe<Scalars['String']['output']>;
  hasNextPage: Scalars['Boolean']['output'];
  hasPreviousPage: Scalars['Boolean']['output'];
  startCursor?: Maybe<Scalars['String']['output']>;
};

export type NexoyaParentContentFilters = {
  __typename?: 'ParentContentFilters';
  providers: Array<NexoyaParentContentProviderFilter>;
};

export type NexoyaParentContentProviderFilter = {
  __typename?: 'ParentContentProviderFilter';
  name?: Maybe<Scalars['String']['output']>;
  providerId: Scalars['Int']['output'];
};

export type NexoyaPerformanceMetric = {
  __typename?: 'PerformanceMetric';
  adSpend: Scalars['Float']['output'];
  costRatio: Scalars['Float']['output'];
  roas?: Maybe<Scalars['Float']['output']>;
  value: Scalars['Float']['output'];
};

export type NexoyaPortfolio = {
  __typename?: 'Portfolio';
  budget: NexoyaBudget;
  budgetDeltaHandlingPolicy?: Maybe<NexoyaBudgetDeltaHandlingPolicy>;
  budgetProposalTargetBiddingApplyMode?: Maybe<NexoyaTargetBiddingApplyMode>;
  content: NexoyaPortfolioContent;
  createdByUserId?: Maybe<Scalars['Int']['output']>;
  defaultOptimizationTarget: NexoyaFunnelStep;
  description?: Maybe<Scalars['String']['output']>;
  endDate?: Maybe<Scalars['DateTime']['output']>;
  funnelSteps?: Maybe<Array<NexoyaFunnelStep>>;
  moneyAllocatedTotal: Scalars['Float']['output'];
  optimizationRiskLevel?: Maybe<Scalars['Int']['output']>;
  optimizationType?: Maybe<NexoyaOptimizationType>;
  portfolioId: Scalars['Int']['output'];
  portfolioMonitorBudgetThreshold?: Maybe<Scalars['Int']['output']>;
  portfolioMonitorData: Array<NexoyaPortfolioMonitorDataEntry>;
  portfolioMonitorFunnelStepThreshold?: Maybe<Scalars['Int']['output']>;
  providers?: Maybe<Array<NexoyaProvider>>;
  skipTrainingDays?: Maybe<Scalars['Int']['output']>;
  startDate?: Maybe<Scalars['DateTime']['output']>;
  teamId: Scalars['Int']['output'];
  title: Scalars['String']['output'];
  validation?: Maybe<NexoyaValidation>;
};

export type NexoyaPortfolioContentArgs = {
  dateFrom?: InputMaybe<Scalars['DateTime']['input']>;
  dateTo?: InputMaybe<Scalars['DateTime']['input']>;
};

export type NexoyaPortfolioPortfolioMonitorDataArgs = {
  groupBy: NexoyaPortfolioMonitorDataGroupingDimension;
};

export type NexoyaPortfolioProvidersArgs = {
  team_id: Scalars['Int']['input'];
};

export type NexoyaPortfolioValidationArgs = {
  avg?: InputMaybe<Scalars['String']['input']>;
  baselineWindow?: InputMaybe<Scalars['Int']['input']>;
  dateFrom?: InputMaybe<Scalars['DateTime']['input']>;
  dateTo?: InputMaybe<Scalars['DateTime']['input']>;
};

export type NexoyaPortfolioAttributionPerformance = {
  __typename?: 'PortfolioAttributionPerformance';
  attributedFunnelStep: NexoyaFunnelStepV2;
  attributionRulesMetrics: Array<NexoyaAttributionRulePerformanceTotal>;
  measuredFunnelStep: NexoyaFunnelStepV2;
};

export type NexoyaPortfolioBudget = {
  __typename?: 'PortfolioBudget';
  budgetItems: Array<NexoyaBudgetItem>;
  budgetReallocation: NexoyaBudgetReallocation;
  spent: NexoyaPortfolioBudgetSpending;
  total: Scalars['Float']['output'];
};

export type NexoyaPortfolioBudgetBudgetItemsArgs = {
  end: Scalars['Date']['input'];
  start: Scalars['Date']['input'];
};

export type NexoyaPortfolioBudgetSpending = {
  __typename?: 'PortfolioBudgetSpending';
  dailySpendings: Array<NexoyaDailyMetric>;
  totalSpent: Scalars['Float']['output'];
};

export type NexoyaPortfolioBudgetSpendingDailySpendingsArgs = {
  end: Scalars['Date']['input'];
  start: Scalars['Date']['input'];
};

export type NexoyaPortfolioChildContent = {
  __typename?: 'PortfolioChildContent';
  content: NexoyaContentV2;
  funnelSteps: Array<NexoyaPortfolioChildContentFunnelStep>;
  portfolioContentId: Scalars['Int']['output'];
};

export type NexoyaPortfolioChildContentFunnelStep = {
  __typename?: 'PortfolioChildContentFunnelStep';
  funnelStep: NexoyaFunnelStepV2;
  metric?: Maybe<NexoyaMetricDefinitionV2>;
  metricOptions: Array<NexoyaMetricDefinitionV2>;
};

export type NexoyaPortfolioConnection = {
  __typename?: 'PortfolioConnection';
  edges: Array<NexoyaPortfolioEdges>;
  pageInfo: NexoyaPageInfo;
};

export type NexoyaPortfolioContent = {
  __typename?: 'PortfolioContent';
  contentDetails?: Maybe<Array<NexoyaPortfolioContentDetail>>;
};

export type NexoyaPortfolioContentBudget = {
  __typename?: 'PortfolioContentBudget';
  max?: Maybe<Scalars['Float']['output']>;
  min?: Maybe<Scalars['Float']['output']>;
};

export type NexoyaPortfolioContentBudgetInput = {
  max?: InputMaybe<Scalars['Float']['input']>;
  min?: InputMaybe<Scalars['Float']['input']>;
};

export type NexoyaPortfolioContentConnection = {
  __typename?: 'PortfolioContentConnection';
  edges: Array<NexoyaPortfolioContentEdges>;
  pageInfo: NexoyaPageInfo;
};

export type NexoyaPortfolioContentDetail = {
  __typename?: 'PortfolioContentDetail';
  budget: NexoyaPortfolioContentBudget;
  childContent?: Maybe<Array<NexoyaPortfolioContentDetail>>;
  content?: Maybe<NexoyaCollection>;
  contentId: Scalars['Float']['output'];
  costs?: Maybe<Scalars['Float']['output']>;
  discoveredContent?: Maybe<NexoyaDiscoveredContent>;
  impactGroup?: Maybe<NexoyaImpactGroup>;
  isIncludedInOptimization: Scalars['Boolean']['output'];
  label?: Maybe<NexoyaPortfolioLabel>;
  metadata?: Maybe<NexoyaPortfolioContentMetadata>;
  metrics?: Maybe<Array<NexoyaPortfolioContentMetric>>;
  optimizationTarget: NexoyaFunnelStep;
  portfolioContentId: Scalars['Int']['output'];
  proposalsAllocationDelta?: Maybe<NexoyaProposalsAllocationDelta>;
};

export type NexoyaPortfolioContentEdges = {
  __typename?: 'PortfolioContentEdges';
  cursor: Scalars['String']['output'];
  node: NexoyaPortfolioContent;
};

export type NexoyaPortfolioContentFilterInput = {
  attributionRuleIds?: InputMaybe<Array<Scalars['Float']['input']>>;
  contentRuleIds?: InputMaybe<Array<Scalars['Float']['input']>>;
  impactGroupIds?: InputMaybe<Array<Scalars['Float']['input']>>;
  impactGroupRuleIds?: InputMaybe<Array<Scalars['Float']['input']>>;
  isIncludedInOptimization?: InputMaybe<Scalars['Boolean']['input']>;
  isRuleManaged?: InputMaybe<Scalars['Boolean']['input']>;
  labelIds?: InputMaybe<Array<Scalars['Float']['input']>>;
  providerIds?: InputMaybe<Array<Scalars['Float']['input']>>;
  titleContains?: InputMaybe<Scalars['String']['input']>;
};

export type NexoyaPortfolioContentFunnelStep = {
  __typename?: 'PortfolioContentFunnelStep';
  funnelStep: NexoyaFunnelStepV2;
  metric?: Maybe<NexoyaMetricDefinitionV2>;
  sourcePortfolioChildContent?: Maybe<NexoyaPortfolioChildContent>;
};

export type NexoyaPortfolioContentFunnelStepMetricInput = {
  contentId: Scalars['Float']['input'];
  funnelStepId: Scalars['Int']['input'];
  metricTypeId?: InputMaybe<Scalars['Int']['input']>;
};

export type NexoyaPortfolioContentMetadata = {
  __typename?: 'PortfolioContentMetadata';
  biddingStrategy?: Maybe<Scalars['String']['output']>;
};

export type NexoyaPortfolioContentMetric = {
  __typename?: 'PortfolioContentMetric';
  coreMetricValues?: Maybe<NexoyaCoreMetricValues>;
  dateFrom: Scalars['DateTime']['output'];
  dateTo: Scalars['DateTime']['output'];
  funnelStep: NexoyaFunnelStep;
  isOptimizationTarget?: Maybe<Scalars['Boolean']['output']>;
  metricTypeId?: Maybe<Scalars['Int']['output']>;
  otherFunnelStepMetrics?: Maybe<NexoyaOtherFunnelStepMetrics>;
  team_id: Scalars['Int']['output'];
};

export type NexoyaPortfolioContentMetricTuple = {
  __typename?: 'PortfolioContentMetricTuple';
  contentId: Scalars['Float']['output'];
  funnelStep: NexoyaFunnelStep;
  metricTypeId: Scalars['Float']['output'];
};

export type NexoyaPortfolioContentRelationInput = {
  belongsToContentId: Scalars['Float']['input'];
  contentId: Scalars['Float']['input'];
};

export type NexoyaPortfolioDashboard = {
  __typename?: 'PortfolioDashboard';
  dateFrom: Scalars['Date']['output'];
  dateTo: Scalars['Date']['output'];
  elements: Array<NexoyaPortfolioDashboardElement>;
  notifications: Array<NexoyaPortfolioDashboardNotification>;
  teamId: Scalars['Int']['output'];
};

export type NexoyaPortfolioDashboardAdspend = {
  __typename?: 'PortfolioDashboardAdspend';
  percentage: Scalars['Float']['output'];
  planned: Scalars['Float']['output'];
  realized: Scalars['Float']['output'];
};

export type NexoyaPortfolioDashboardBudgetProposalNotification = NexoyaPortfolioDashboardNotification & {
  __typename?: 'PortfolioDashboardBudgetProposalNotification';
  date: Scalars['Date']['output'];
  payload: NexoyaPortfolioDashboardBudgetProposalNotificationPayload;
  title: Scalars['String']['output'];
  type: NexoyaPortfolioDashboardNotificationType;
};

export type NexoyaPortfolioDashboardBudgetProposalNotificationPayload = {
  __typename?: 'PortfolioDashboardBudgetProposalNotificationPayload';
  budgetProposalId: Scalars['Int']['output'];
  optimizationId: Scalars['Int']['output'];
  portfolioId: Scalars['Int']['output'];
};

export type NexoyaPortfolioDashboardElement = {
  __typename?: 'PortfolioDashboardElement';
  achieved?: Maybe<NexoyaPortfolioDashboardElementTrend>;
  adSpend?: Maybe<NexoyaPortfolioDashboardAdspend>;
  costPer?: Maybe<NexoyaPortfolioDashboardElementTrend>;
  endDate?: Maybe<Scalars['Date']['output']>;
  goal: Scalars['String']['output'];
  portfolioId: Scalars['Int']['output'];
  startDate?: Maybe<Scalars['Date']['output']>;
  title: Scalars['String']['output'];
};

export type NexoyaPortfolioDashboardElementTrend = {
  __typename?: 'PortfolioDashboardElementTrend';
  percentage: Scalars['Float']['output'];
  trendIndicator: NexoyaPortfolioDashboardTrendIndicator;
  value: Scalars['Float']['output'];
};

export type NexoyaPortfolioDashboardNotification = {
  date: Scalars['Date']['output'];
  title: Scalars['String']['output'];
  type: NexoyaPortfolioDashboardNotificationType;
};

export enum NexoyaPortfolioDashboardNotificationType {
  BudgetApplication = 'BUDGET_APPLICATION',
  OptimizationPotential = 'OPTIMIZATION_POTENTIAL',
}

export type NexoyaPortfolioDashboardOptimizationNotification = NexoyaPortfolioDashboardNotification & {
  __typename?: 'PortfolioDashboardOptimizationNotification';
  date: Scalars['Date']['output'];
  payload: NexoyaPortfolioDashboardOptimizationNotificationPayload;
  title: Scalars['String']['output'];
  type: NexoyaPortfolioDashboardNotificationType;
};

export type NexoyaPortfolioDashboardOptimizationNotificationPayload = {
  __typename?: 'PortfolioDashboardOptimizationNotificationPayload';
  optimizationId: Scalars['Int']['output'];
  portfolioId: Scalars['Int']['output'];
};

export enum NexoyaPortfolioDashboardTrendIndicator {
  DowntrendNegative = 'DOWNTREND_NEGATIVE',
  DowntrendPositive = 'DOWNTREND_POSITIVE',
  Stationary = 'STATIONARY',
  UptrendNegative = 'UPTREND_NEGATIVE',
  UptrendPositive = 'UPTREND_POSITIVE',
}

export type NexoyaPortfolioDashboardUrl = {
  __typename?: 'PortfolioDashboardUrl';
  name: Scalars['String']['output'];
  url: Scalars['String']['output'];
};

export type NexoyaPortfolioDashboardUrlInput = {
  name: Scalars['String']['input'];
  url: Scalars['String']['input'];
};

export type NexoyaPortfolioEdges = {
  __typename?: 'PortfolioEdges';
  cursor: Scalars['String']['output'];
  node: NexoyaPortfolio;
};

export type NexoyaPortfolioEvent = {
  __typename?: 'PortfolioEvent';
  assetUrl?: Maybe<Scalars['String']['output']>;
  assignedContents: Array<Maybe<NexoyaContentV2>>;
  category: NexoyaEventCategory;
  contentRules: Array<Maybe<NexoyaContentRule>>;
  created: Scalars['Date']['output'];
  createdByUserId?: Maybe<Scalars['Float']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  end: Scalars['Date']['output'];
  impact: NexoyaEventImpact;
  includesAllContents: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  portfolioEventId: Scalars['Float']['output'];
  portfolioId: Scalars['Float']['output'];
  start: Scalars['Date']['output'];
  teamId: Scalars['Float']['output'];
};

export type NexoyaPortfolioEventConnection = {
  __typename?: 'PortfolioEventConnection';
  edges: Array<NexoyaPortfolioEventEdge>;
  pageInfo: NexoyaPageInfo;
  totalPages?: Maybe<Scalars['Int']['output']>;
};

export type NexoyaPortfolioEventEdge = {
  __typename?: 'PortfolioEventEdge';
  cursor: Scalars['String']['output'];
  node: NexoyaPortfolioEvent;
};

export type NexoyaPortfolioEventSnapshot = {
  __typename?: 'PortfolioEventSnapshot';
  assetUrl?: Maybe<Scalars['String']['output']>;
  category: NexoyaEventCategory;
  contentIds: Array<Scalars['Float']['output']>;
  created: Scalars['Date']['output'];
  createdByUserId?: Maybe<Scalars['Float']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  end: Scalars['Date']['output'];
  impact: NexoyaEventImpact;
  name: Scalars['String']['output'];
  portfolioEventId: Scalars['Float']['output'];
  portfolioId: Scalars['Float']['output'];
  start: Scalars['Date']['output'];
  teamId: Scalars['Float']['output'];
};

export enum NexoyaPortfolioFeatureFlag {
  Attribution = 'attribution',
  BudgetV1 = 'budget_v1',
  ContentEditV2 = 'content_edit_v2',
  IgnoreWeekdays = 'ignore_weekdays',
  NavigationV2 = 'navigation_v2',
  OptimizationsOnlyVisibleToSupportUsers = 'optimizationsOnlyVisibleToSupportUsers',
  SelfServicePortfolio = 'self_service_portfolio',
  SimulationDataDrivenBudgetPacing = 'simulation_data_driven_budget_pacing',
  SimulationPreviewSupport = 'simulation_preview_support',
  WhatIfValidation = 'what_if_validation',
}

export type NexoyaPortfolioFilter = {
  activeOnly?: InputMaybe<Scalars['Boolean']['input']>;
  completedOnly?: InputMaybe<Scalars['Boolean']['input']>;
  plannedOnly?: InputMaybe<Scalars['Boolean']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type NexoyaPortfolioLabel = {
  __typename?: 'PortfolioLabel';
  labelId: Scalars['Int']['output'];
  name: Scalars['String']['output'];
};

export type NexoyaPortfolioMonitorDataEntry = {
  __typename?: 'PortfolioMonitorDataEntry';
  funnelStepId: Scalars['Int']['output'];
  mAE: Scalars['Float']['output'];
  MAE: Scalars['Float']['output'];
  mAPE: Scalars['Float']['output'];
  MAPE: Scalars['Float']['output'];
  optimizationId: Scalars['Int']['output'];
  SmAPE: Scalars['Float']['output'];
  SMAPE: Scalars['Float']['output'];
  timestamp: Scalars['DateTime']['output'];
  y_pred: Scalars['Float']['output'];
  y_true: Scalars['Float']['output'];
};

export enum NexoyaPortfolioMonitorDataGroupingDimension {
  FunnelStep = 'FUNNEL_STEP',
  Portfolio = 'PORTFOLIO',
}

export type NexoyaPortfolioParentContent = {
  __typename?: 'PortfolioParentContent';
  budgetMax?: Maybe<Scalars['Float']['output']>;
  budgetMin?: Maybe<Scalars['Float']['output']>;
  childContents: Array<NexoyaPortfolioChildContent>;
  content: NexoyaContentV2;
  discoveredContent: NexoyaDiscoveredContent;
  funnelSteps: Array<NexoyaPortfolioContentFunnelStep>;
  impactGroup?: Maybe<NexoyaImpactGroup>;
  isIncludedInOptimization: Scalars['Boolean']['output'];
  label?: Maybe<NexoyaPortfolioLabel>;
  portfolioContentId: Scalars['Int']['output'];
};

export type NexoyaPortfolioParentContentConnection = {
  __typename?: 'PortfolioParentContentConnection';
  edges: Array<NexoyaPortfolioParentContentEdge>;
  pageInfo: NexoyaPageInfo;
  totalPages: Scalars['Int']['output'];
};

export type NexoyaPortfolioParentContentEdge = {
  __typename?: 'PortfolioParentContentEdge';
  cursor: Scalars['String']['output'];
  node: NexoyaPortfolioParentContent;
};

export enum NexoyaPortfolioParentContentsSortField {
  AttributionRuleName = 'attributionRuleName',
  ContentRuleName = 'contentRuleName',
  ContentTitle = 'contentTitle',
  ContentType = 'contentType',
  ImpactGroupName = 'impactGroupName',
  ImpactGroupRuleName = 'impactGroupRuleName',
  IsIncludedInOptimization = 'isIncludedInOptimization',
  IsRuleManaged = 'isRuleManaged',
  LabelName = 'labelName',
  ProviderId = 'providerId',
}

export type NexoyaPortfolioPerformance = {
  __typename?: 'PortfolioPerformance';
  funnelStep: NexoyaFunnelStepPerformance;
  funnelSteps: Array<NexoyaFunnelStepPerformance>;
  optimizations: Array<NexoyaOptimizationV2>;
};

export type NexoyaPortfolioPerformanceFunnelStepArgs = {
  funnelStepId: Scalars['Float']['input'];
};

export type NexoyaPortfolioSummary = {
  __typename?: 'PortfolioSummary';
  portfolioId: Scalars['Int']['output'];
  teamId: Scalars['Int']['output'];
};

export enum NexoyaPortfolioSyncStatus {
  Error = 'ERROR',
  Synced = 'SYNCED',
  Syncing = 'SYNCING',
}

export type NexoyaPortfolioTargetItem = {
  __typename?: 'PortfolioTargetItem';
  achieved?: Maybe<Scalars['Float']['output']>;
  end: Scalars['Date']['output'];
  maxBudget: Scalars['Float']['output'];
  name: Scalars['String']['output'];
  portfolioId: Scalars['Int']['output'];
  start: Scalars['Date']['output'];
  status: NexoyaTargetItemStatus;
  targetItemId: Scalars['Int']['output'];
  value: Scalars['Float']['output'];
};

export enum NexoyaPortfolioType {
  Amount = 'AMOUNT',
  Budget = 'BUDGET',
  CostPer = 'COST_PER',
  Roas = 'ROAS',
}

export type NexoyaPortfolioV2 = {
  __typename?: 'PortfolioV2';
  activeOptimization?: Maybe<NexoyaOptimizationV2>;
  activeTargetItem?: Maybe<NexoyaPortfolioTargetItem>;
  attributionPerformance: NexoyaPortfolioAttributionPerformance;
  attributionRule: NexoyaAttributionRule;
  attributionRules: Array<NexoyaAttributionRule>;
  budget: NexoyaPortfolioBudget;
  budgetDeltaHandlingPolicy?: Maybe<NexoyaBudgetDeltaHandlingPolicy>;
  budgetProposalTargetBiddingApplyMode?: Maybe<NexoyaTargetBiddingApplyMode>;
  contentRule: NexoyaContentRule;
  contentRules: Array<NexoyaContentRule>;
  createdByUserId?: Maybe<Scalars['Int']['output']>;
  defaultOptimizationTarget?: Maybe<NexoyaFunnelStepV2>;
  description?: Maybe<Scalars['String']['output']>;
  discoveredContents: Array<NexoyaDiscoveredContent>;
  end?: Maybe<Scalars['Date']['output']>;
  featureFlags?: Maybe<Array<Maybe<NexoyaFeatureFlag>>>;
  funnelSteps: Array<NexoyaFunnelStepV2>;
  impactGroupRule: NexoyaImpactGroupRule;
  impactGroupRules: Array<NexoyaImpactGroupRule>;
  impactGroups: Array<NexoyaImpactGroup>;
  isAttributed: Scalars['Boolean']['output'];
  labels: Array<NexoyaPortfolioLabel>;
  lastSyncedAt?: Maybe<Scalars['DateTime']['output']>;
  latestAchievedTargetItem?: Maybe<NexoyaPortfolioTargetItem>;
  optimization: NexoyaOptimizationV2;
  optimizationRiskLevel?: Maybe<Scalars['Int']['output']>;
  optimizations: NexoyaOptimizationConnection;
  optimizationType?: Maybe<NexoyaOptimizationType>;
  performance: NexoyaPortfolioPerformance;
  portfolioDashboardUrls?: Maybe<Array<Maybe<NexoyaPortfolioDashboardUrl>>>;
  portfolioEvent: NexoyaPortfolioEvent;
  portfolioEvents: NexoyaPortfolioEventConnection;
  portfolioId: Scalars['Int']['output'];
  portfolioParentContents: NexoyaPortfolioParentContentConnection;
  prediction: NexoyaPrediction;
  providerMetricOptions: Array<NexoyaProviderMetricOptions>;
  simulation: NexoyaSimulation;
  simulations: Array<NexoyaSimulation>;
  skipTrainingDays?: Maybe<Scalars['Int']['output']>;
  start?: Maybe<Scalars['Date']['output']>;
  syncStatus: NexoyaPortfolioSyncStatus;
  targetItems: Array<NexoyaPortfolioTargetItem>;
  teamId: Scalars['Int']['output'];
  title: Scalars['String']['output'];
  type: NexoyaPortfolioType;
};

export type NexoyaPortfolioV2AttributionPerformanceArgs = {
  period: NexoyaDateRangeInput;
};

export type NexoyaPortfolioV2AttributionRuleArgs = {
  attributionRuleId: Scalars['Float']['input'];
};

export type NexoyaPortfolioV2ContentRuleArgs = {
  contentRuleId: Scalars['Float']['input'];
};

export type NexoyaPortfolioV2DiscoveredContentsArgs = {
  status: NexoyaDiscoveredContentStatus;
};

export type NexoyaPortfolioV2ImpactGroupRuleArgs = {
  impactGroupRuleId: Scalars['Float']['input'];
};

export type NexoyaPortfolioV2OptimizationArgs = {
  optimizationId: Scalars['Int']['input'];
};

export type NexoyaPortfolioV2OptimizationsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<NexoyaOptimizationStatus>;
};

export type NexoyaPortfolioV2PerformanceArgs = {
  comparisonPeriod?: InputMaybe<NexoyaDateRangeInput>;
  period: NexoyaDateRangeInput;
};

export type NexoyaPortfolioV2PortfolioEventArgs = {
  portfolioEventId: Scalars['Float']['input'];
};

export type NexoyaPortfolioV2PortfolioEventsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  end?: InputMaybe<Scalars['Date']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  start?: InputMaybe<Scalars['Date']['input']>;
};

export type NexoyaPortfolioV2PortfolioParentContentsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  portfolioContentFilter?: InputMaybe<NexoyaPortfolioContentFilterInput>;
  sortField?: InputMaybe<NexoyaPortfolioParentContentsSortField>;
  sortOrder?: InputMaybe<NexoyaSortOrder>;
};

export type NexoyaPortfolioV2PredictionArgs = {
  end: Scalars['Date']['input'];
  start: Scalars['Date']['input'];
};

export type NexoyaPortfolioV2SimulationArgs = {
  simulationId: Scalars['Int']['input'];
};

export type NexoyaPredict = {
  __typename?: 'Predict';
  collectionId?: Maybe<Scalars['Float']['output']>;
  data?: Maybe<Array<Maybe<NexoyaPredictDetail>>>;
  measurementId?: Maybe<Scalars['Int']['output']>;
  teamId?: Maybe<Scalars['Int']['output']>;
  valueSumUp?: Maybe<Array<Maybe<NexoyaPredictDetail>>>;
};

export type NexoyaPredictDetail = {
  __typename?: 'PredictDetail';
  timestamp?: Maybe<Scalars['DateTime']['output']>;
  value?: Maybe<Scalars['Float']['output']>;
  valueLower?: Maybe<Scalars['Float']['output']>;
  valueUpper?: Maybe<Scalars['Float']['output']>;
};

export type NexoyaPrediction = {
  __typename?: 'Prediction';
  funnelSteps: Array<NexoyaFunnelStepPredictionScore>;
  total: NexoyaPredictionTotal;
};

export type NexoyaPredictionTotal = {
  __typename?: 'PredictionTotal';
  accuracyBuckets: Array<NexoyaAccuracyBucket>;
  dailyPredictionTotal: Array<NexoyaDailyPredictionTotal>;
  score: Scalars['Float']['output'];
};

export type NexoyaPreviewEventDuplicatesQueryResponse = {
  __typename?: 'PreviewEventDuplicatesQueryResponse';
  duplicatePortfolioEvents: Array<Maybe<NexoyaPortfolioEvent>>;
};

export type NexoyaProposalsAllocationDelta = {
  __typename?: 'ProposalsAllocationDelta';
  actualAllocation?: Maybe<Scalars['Float']['output']>;
  allocationPctDelta?: Maybe<Scalars['Float']['output']>;
  proposedAllocation?: Maybe<Scalars['Float']['output']>;
};

export type NexoyaProposedBiddingStrategy = {
  __typename?: 'ProposedBiddingStrategy';
  applicationDelta?: Maybe<Scalars['Float']['output']>;
  currentTcpa?: Maybe<Scalars['Float']['output']>;
  currentTroas?: Maybe<Scalars['Float']['output']>;
  dailyBudgetChange?: Maybe<Scalars['Float']['output']>;
  realizedCpa?: Maybe<Scalars['Float']['output']>;
  realizedRoas?: Maybe<Scalars['Float']['output']>;
  tcpaDelta?: Maybe<Scalars['Float']['output']>;
  troasDelta?: Maybe<Scalars['Float']['output']>;
  type: NexoyaBiddingStrategyType;
  value?: Maybe<Scalars['Float']['output']>;
};

export type NexoyaProvider = {
  __typename?: 'Provider';
  category?: Maybe<Scalars['String']['output']>;
  connected?: Maybe<Scalars['Boolean']['output']>;
  delayed_days?: Maybe<Scalars['Int']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  filterable?: Maybe<Scalars['Boolean']['output']>;
  hasCollections?: Maybe<Scalars['Boolean']['output']>;
  isPortfolioPrimaryChannel?: Maybe<Scalars['Boolean']['output']>;
  logo?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  no_initial?: Maybe<Scalars['Boolean']['output']>;
  provider_id: Scalars['Int']['output'];
  showInToplist?: Maybe<Scalars['Boolean']['output']>;
};

export type NexoyaProviderFilter = {
  __typename?: 'ProviderFilter';
  filterList?: Maybe<Array<NexoyaFilterListType>>;
  filterName: Scalars['String']['output'];
};

export type NexoyaProviderKey = {
  __typename?: 'ProviderKey';
  active?: Maybe<Scalars['Boolean']['output']>;
  api_key?: Maybe<Scalars['String']['output']>;
  api_secret?: Maybe<Scalars['String']['output']>;
  appKey?: Maybe<Scalars['String']['output']>;
  appSecret?: Maybe<Scalars['String']['output']>;
  enc_options?: Maybe<Scalars['String']['output']>;
  integOpts?: Maybe<Scalars['String']['output']>;
  options?: Maybe<Scalars['String']['output']>;
  page_token?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  provider?: Maybe<NexoyaProvider>;
  provider_key_id?: Maybe<Scalars['Int']['output']>;
  refresh_token?: Maybe<Scalars['String']['output']>;
  team?: Maybe<NexoyaTeam>;
  team_id?: Maybe<Scalars['Int']['output']>;
  token?: Maybe<Scalars['String']['output']>;
};

export type NexoyaProviderKeyInput = {
  api_key?: InputMaybe<Scalars['String']['input']>;
  api_secret?: InputMaybe<Scalars['String']['input']>;
  options?: InputMaybe<Scalars['String']['input']>;
  provider_id: Scalars['Int']['input'];
  provider_key_id?: InputMaybe<Scalars['Int']['input']>;
  team_id: Scalars['Int']['input'];
  token?: InputMaybe<Scalars['String']['input']>;
  user_id?: InputMaybe<Scalars['Int']['input']>;
};

export type NexoyaProviderMetricOptions = {
  __typename?: 'ProviderMetricOptions';
  metricOptions: Array<NexoyaMetricDefinitionV2>;
  providerId: Scalars['Float']['output'];
};

export type NexoyaProviderMetricTotal = {
  __typename?: 'ProviderMetricTotal';
  comparisonChangePercent?: Maybe<NexoyaPerformanceMetric>;
  comparisonTotal?: Maybe<NexoyaPerformanceMetric>;
  contents: Array<NexoyaContentMetricTotal>;
  providerId: Scalars['Int']['output'];
  total: NexoyaPerformanceMetric;
};

export type NexoyaQuery = {
  __typename?: 'Query';
  _entities: Array<Maybe<Nexoya_Entity>>;
  _service: Nexoya_Service;
  attributionRuleUpdateFiltersPreview: NexoyaAttributionRuleUpdateFiltersPreviewQueryResponse;
  availableFieldOperations: Array<NexoyaFieldOperation>;
  budgetProposals: NexoyaBudgetProposalConnection;
  childCollectionsPg: NexoyaCollectionConnection;
  collection?: Maybe<NexoyaCollection>;
  collections?: Maybe<Array<Maybe<NexoyaCollection>>>;
  collectionsPg: NexoyaCollectionConnection;
  collectionTypes?: Maybe<Array<Maybe<NexoyaCollectionType>>>;
  collectionWithProvider?: Maybe<Array<Maybe<NexoyaCollection>>>;
  content?: Maybe<NexoyaContent>;
  contentRuleUpdateFiltersPreview: NexoyaContentRuleUpdateFiltersPreviewMutationResponse;
  contents?: Maybe<Array<Maybe<NexoyaContent>>>;
  contentsPg: NexoyaContentConnection;
  contentTypes?: Maybe<Array<Maybe<NexoyaContentType>>>;
  contentWithDataPg: NexoyaCollectionConnection;
  countDiscoveredContents: NexoyaDiscoveredContentsCount;
  createBudgetItemPrecheck?: Maybe<NexoyaCreateBudgetItemPrecheckResult>;
  currencyExchangeTimeframes: Array<NexoyaCurrencyExchangeTimeframe>;
  customKpi?: Maybe<Array<Maybe<NexoyaCustomKpi>>>;
  event?: Maybe<NexoyaEvent>;
  events?: Maybe<Array<Maybe<NexoyaEvent>>>;
  filterContents: Array<NexoyaContentV2>;
  findAttributionModelById: NexoyaAttributionModel;
  flagStatus?: Maybe<Scalars['Boolean']['output']>;
  getDatatype?: Maybe<NexoyaDataType>;
  impactGroupRuleUpdatePreview?: Maybe<NexoyaImpactGroupRuleUpdatePreviewMutationResponse>;
  integration?: Maybe<NexoyaIntegration>;
  integrations?: Maybe<Array<Maybe<NexoyaIntegration>>>;
  KPIValues?: Maybe<NexoyaKpi>;
  listAttributionModels: NexoyaAttributionModelConnection;
  listContentBiddingStrategyValueHistory: Array<NexoyaContentBiddingStrategyValueHistory>;
  listContentsByIds: Array<NexoyaContentV2>;
  listConversions: Array<NexoyaConversion>;
  listCurrencyData?: Maybe<NexoyaCurrencyData>;
  listFunnelStepCustomImportExpansionVariables: Array<Scalars['String']['output']>;
  listFunnelStepCustomMetricExpansionVariables: Array<Scalars['String']['output']>;
  listFunnelStepMappingPresets: Array<NexoyaFunnelStepMappingPreset>;
  listFunnelStepUtmExpansionVariables: Array<Scalars['String']['output']>;
  listFunnelStepUtmMappingParams: Array<NexoyaFunnelStepUtmMappingParams>;
  listMetricDefinitions: Array<NexoyaMetricDefinitionV2>;
  listPortfolioDefaultFunnelStepMappings: Array<NexoyaFunnelStepDefaultMapping>;
  measurement_range?: Maybe<Array<Maybe<NexoyaMeasurement>>>;
  measurementAggregates?: Maybe<NexoyaMeasurementAggregate>;
  measurementdata_range_by_measurement_collection?: Maybe<Array<Maybe<NexoyaMeasurement>>>;
  measurementGroups?: Maybe<Array<Maybe<NexoyaMeasurementGroup>>>;
  measurementRangeSearch?: Maybe<Array<Maybe<NexoyaMeasurement>>>;
  measurementRangeSearchPg: NexoyaMeasurementConnection;
  measurements?: Maybe<Array<Maybe<NexoyaMeasurement>>>;
  measurementsPg: NexoyaMeasurementConnection;
  metadataTypes?: Maybe<Scalars['JSON']['output']>;
  metrics?: Maybe<Array<Maybe<NexoyaMetricDataCore>>>;
  newOptimizationSummary: NexoyaNewOptimizationSummary;
  newSimulationSummary: NexoyaNewSimulationSummary;
  optimization?: Maybe<NexoyaOptimizationV2>;
  optimizationBudgetProposal?: Maybe<NexoyaBudgetProposal>;
  optimizationConfig?: Maybe<Scalars['JSON']['output']>;
  org?: Maybe<NexoyaOrg>;
  orgs?: Maybe<Array<Maybe<NexoyaOrg>>>;
  portfolio?: Maybe<NexoyaPortfolio>;
  portfolioBudgetProposals?: Maybe<Array<Maybe<NexoyaBudgetProposal>>>;
  portfolioContent: NexoyaPortfolioContentConnection;
  portfolioContentMetricTuples?: Maybe<Array<NexoyaPortfolioContentMetricTuple>>;
  portfolioDashboard?: Maybe<NexoyaPortfolioDashboard>;
  portfolioParentContentFilters?: Maybe<NexoyaParentContentFilters>;
  portfolios: NexoyaPortfolioConnection;
  portfolioV2?: Maybe<NexoyaPortfolioV2>;
  predefinedContent?: Maybe<Array<Maybe<NexoyaPortfolioContent>>>;
  predict?: Maybe<NexoyaPredict>;
  previewEventDuplicates?: Maybe<NexoyaPreviewEventDuplicatesQueryResponse>;
  provider?: Maybe<NexoyaProvider>;
  providerKeys?: Maybe<Array<Maybe<NexoyaProviderKey>>>;
  providers?: Maybe<Array<Maybe<NexoyaProvider>>>;
  report?: Maybe<NexoyaReport>;
  reports?: Maybe<Array<Maybe<NexoyaReport>>>;
  reportsSummary?: Maybe<Array<Maybe<NexoyaReportWithSummary>>>;
  reportSummary?: Maybe<NexoyaReportWithSummary>;
  roles?: Maybe<Array<NexoyaRoleDef>>;
  team?: Maybe<NexoyaTeam>;
  teamFeatureFlags?: Maybe<Array<Maybe<NexoyaTeamFeatureFlag>>>;
  teams?: Maybe<Array<Maybe<NexoyaTeam>>>;
  translation?: Maybe<NexoyaTranslation>;
  translations?: Maybe<Array<Maybe<NexoyaTranslation>>>;
  user?: Maybe<NexoyaUser>;
  userByEmail?: Maybe<NexoyaUser>;
  users?: Maybe<Array<Maybe<NexoyaUser>>>;
  validationDetailedReport?: Maybe<Scalars['String']['output']>;
};

export type NexoyaQuery_EntitiesArgs = {
  representations: Array<Scalars['_Any']['input']>;
};

export type NexoyaQueryAttributionRuleUpdateFiltersPreviewArgs = {
  attributionRuleId: Scalars['Float']['input'];
  filters: NexoyaAttributionRuleFiltersInput;
  portfolioId: Scalars['Float']['input'];
  teamId: Scalars['Float']['input'];
};

export type NexoyaQueryAvailableFieldOperationsArgs = {
  providerId: Scalars['Float']['input'];
};

export type NexoyaQueryBudgetProposalsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<NexoyaBudgetProposalStatus>;
};

export type NexoyaQueryChildCollectionsPgArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Float']['input']>;
  offset?: InputMaybe<Scalars['Float']['input']>;
  parent_collection_id: Scalars['Float']['input'];
  team_id: Scalars['Int']['input'];
  where?: InputMaybe<NexoyaSearchFilter>;
};

export type NexoyaQueryCollectionArgs = {
  collection_id: Scalars['Float']['input'];
  team_id: Scalars['Int']['input'];
};

export type NexoyaQueryCollectionsArgs = {
  first?: InputMaybe<Scalars['Float']['input']>;
  offset?: InputMaybe<Scalars['Float']['input']>;
  team_id: Scalars['Int']['input'];
  where?: InputMaybe<NexoyaFilter>;
};

export type NexoyaQueryCollectionsPgArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Float']['input']>;
  offset?: InputMaybe<Scalars['Float']['input']>;
  team_id: Scalars['Int']['input'];
  where?: InputMaybe<NexoyaFilter>;
};

export type NexoyaQueryCollectionWithProviderArgs = {
  provider_id: Scalars['Int']['input'];
  team_id: Scalars['Int']['input'];
};

export type NexoyaQueryContentArgs = {
  content_id: Scalars['Float']['input'];
  team_id: Scalars['Int']['input'];
};

export type NexoyaQueryContentRuleUpdateFiltersPreviewArgs = {
  contentRuleId: Scalars['Float']['input'];
  filters: NexoyaContentRuleFiltersInput;
  portfolioId: Scalars['Float']['input'];
  teamId: Scalars['Float']['input'];
};

export type NexoyaQueryContentsArgs = {
  first?: InputMaybe<Scalars['Float']['input']>;
  offset?: InputMaybe<Scalars['Float']['input']>;
  team_id: Scalars['Int']['input'];
  where?: InputMaybe<NexoyaFilter>;
};

export type NexoyaQueryContentsPgArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Float']['input']>;
  offset?: InputMaybe<Scalars['Float']['input']>;
  team_id: Scalars['Int']['input'];
  where?: InputMaybe<NexoyaFilter>;
};

export type NexoyaQueryContentWithDataPgArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Float']['input']>;
  offset?: InputMaybe<Scalars['Float']['input']>;
  team_id: Scalars['Int']['input'];
  where?: InputMaybe<NexoyaFilter>;
  withDataFor?: InputMaybe<NexoyaFunnelStepType>;
};

export type NexoyaQueryCountDiscoveredContentsArgs = {
  portfolioId: Scalars['Float']['input'];
  teamId: Scalars['Float']['input'];
};

export type NexoyaQueryCreateBudgetItemPrecheckArgs = {
  endDate: Scalars['Date']['input'];
  portfolioId: Scalars['Int']['input'];
  startDate: Scalars['Date']['input'];
  teamId: Scalars['Int']['input'];
};

export type NexoyaQueryCurrencyExchangeTimeframesArgs = {
  teamId: Scalars['Int']['input'];
};

export type NexoyaQueryCustomKpiArgs = {
  custom_kpi_id?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Float']['input']>;
  offset?: InputMaybe<Scalars['Float']['input']>;
  team_id: Scalars['Int']['input'];
};

export type NexoyaQueryEventArgs = {
  event_id: Scalars['Int']['input'];
  team_id: Scalars['Int']['input'];
};

export type NexoyaQueryEventsArgs = {
  dateFrom?: InputMaybe<Scalars['DateTime']['input']>;
  dateTo?: InputMaybe<Scalars['DateTime']['input']>;
  first?: InputMaybe<Scalars['Float']['input']>;
  offset?: InputMaybe<Scalars['Float']['input']>;
  team_id: Scalars['Int']['input'];
  where?: InputMaybe<NexoyaEventFilter>;
};

export type NexoyaQueryFilterContentsArgs = {
  excludePortfolioContents: Scalars['Boolean']['input'];
  filters: Array<NexoyaContentFilterInput>;
  inPortfolioOnly?: InputMaybe<Scalars['Boolean']['input']>;
  portfolioId: Scalars['Float']['input'];
  teamId: Scalars['Float']['input'];
};

export type NexoyaQueryFindAttributionModelByIdArgs = {
  attributionModelId: Scalars['String']['input'];
  teamId: Scalars['Int']['input'];
};

export type NexoyaQueryFlagStatusArgs = {
  name: Scalars['String']['input'];
  team_id: Scalars['Int']['input'];
};

export type NexoyaQueryGetDatatypeArgs = {
  id: Scalars['Int']['input'];
};

export type NexoyaQueryImpactGroupRuleUpdatePreviewArgs = {
  impactGroupRuleEdit: NexoyaImpactGroupRuleEditInput;
  impactGroupRuleId: Scalars['Float']['input'];
  portfolioId: Scalars['Float']['input'];
  teamId: Scalars['Float']['input'];
};

export type NexoyaQueryIntegrationArgs = {
  integration_id: Scalars['Int']['input'];
  team_id: Scalars['Int']['input'];
};

export type NexoyaQueryIntegrationsArgs = {
  filter?: InputMaybe<NexoyaIntegrationFilter>;
  team_id: Scalars['Int']['input'];
};

export type NexoyaQueryKpiValuesArgs = {
  id: Scalars['Int']['input'];
  team_id: Scalars['Int']['input'];
};

export type NexoyaQueryListAttributionModelsArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  before?: InputMaybe<Scalars['String']['input']>;
  filters: NexoyaListAttributionModelsFilters;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  teamId: Scalars['Int']['input'];
};

export type NexoyaQueryListContentBiddingStrategyValueHistoryArgs = {
  biddingStrategyType: Scalars['String']['input'];
  contentIds: Array<Scalars['Float']['input']>;
  period: NexoyaDateRangeInput;
  teamId: Scalars['Float']['input'];
};

export type NexoyaQueryListContentsByIdsArgs = {
  contentIds: Array<Scalars['Float']['input']>;
  teamId: Scalars['Float']['input'];
};

export type NexoyaQueryListConversionsArgs = {
  adAccountContentIds: Array<Scalars['Float']['input']>;
  teamId: Scalars['Float']['input'];
};

export type NexoyaQueryListFunnelStepMappingPresetsArgs = {
  teamId: Scalars['Float']['input'];
};

export type NexoyaQueryListPortfolioDefaultFunnelStepMappingsArgs = {
  portfolioId: Scalars['Float']['input'];
  providerId: Scalars['Int']['input'];
  teamId: Scalars['Float']['input'];
};

export type NexoyaQueryMeasurement_RangeArgs = {
  collection_id?: InputMaybe<Scalars['Float']['input']>;
  collections?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  dateFrom?: InputMaybe<Scalars['DateTime']['input']>;
  dateTo?: InputMaybe<Scalars['DateTime']['input']>;
  first?: InputMaybe<Scalars['Float']['input']>;
  measurement_id?: InputMaybe<Scalars['Int']['input']>;
  measurements?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  offset?: InputMaybe<Scalars['Float']['input']>;
  parentOnly?: InputMaybe<Scalars['Boolean']['input']>;
  providers?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  team_id: Scalars['Int']['input'];
  where?: InputMaybe<NexoyaFilter>;
};

export type NexoyaQueryMeasurementAggregatesArgs = {
  dateFrom: Scalars['DateTime']['input'];
  dateTo: Scalars['DateTime']['input'];
  measurement_collection?: InputMaybe<Array<InputMaybe<NexoyaMeasurementCollectionPairInput>>>;
  team_id: Scalars['Int']['input'];
};

export type NexoyaQueryMeasurementdata_Range_By_Measurement_CollectionArgs = {
  dateFrom: Scalars['DateTime']['input'];
  dateTo: Scalars['DateTime']['input'];
  measurement_collection?: InputMaybe<Array<InputMaybe<NexoyaMeasurementCollectionPairInput>>>;
  team_id: Scalars['Int']['input'];
};

export type NexoyaQueryMeasurementGroupsArgs = {
  where?: InputMaybe<NexoyaFilter>;
};

export type NexoyaQueryMeasurementRangeSearchArgs = {
  collection_id?: InputMaybe<Scalars['Float']['input']>;
  collections?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  dateFrom?: InputMaybe<Scalars['DateTime']['input']>;
  dateTo?: InputMaybe<Scalars['DateTime']['input']>;
  first?: InputMaybe<Scalars['Float']['input']>;
  measurement_id?: InputMaybe<Scalars['Int']['input']>;
  measurements?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  offset?: InputMaybe<Scalars['Float']['input']>;
  parentOnly?: InputMaybe<Scalars['Boolean']['input']>;
  providers?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  team_id: Scalars['Int']['input'];
  where?: InputMaybe<NexoyaFilter>;
};

export type NexoyaQueryMeasurementRangeSearchPgArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  collection_id?: InputMaybe<Scalars['Float']['input']>;
  collections?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  dateFrom?: InputMaybe<Scalars['DateTime']['input']>;
  dateTo?: InputMaybe<Scalars['DateTime']['input']>;
  first?: InputMaybe<Scalars['Float']['input']>;
  measurement_id?: InputMaybe<Scalars['Int']['input']>;
  measurements?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  offset?: InputMaybe<Scalars['Float']['input']>;
  parentOnly?: InputMaybe<Scalars['Boolean']['input']>;
  providers?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  team_id: Scalars['Int']['input'];
  where?: InputMaybe<NexoyaFilter>;
};

export type NexoyaQueryMeasurementsArgs = {
  provider_id?: InputMaybe<Scalars['Int']['input']>;
};

export type NexoyaQueryMeasurementsPgArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Float']['input']>;
  offset?: InputMaybe<Scalars['Float']['input']>;
  where?: InputMaybe<NexoyaFilter>;
};

export type NexoyaQueryMetricsArgs = {
  provider_id?: InputMaybe<Scalars['Int']['input']>;
};

export type NexoyaQueryNewOptimizationSummaryArgs = {
  end: Scalars['Date']['input'];
  portfolioId: Scalars['Int']['input'];
  teamId: Scalars['Int']['input'];
};

export type NexoyaQueryNewSimulationSummaryArgs = {
  budgetMax: Scalars['Int']['input'];
  budgetMin: Scalars['Int']['input'];
  end: Scalars['Date']['input'];
  portfolioId: Scalars['Int']['input'];
  simulationId?: InputMaybe<Scalars['Float']['input']>;
  start: Scalars['Date']['input'];
  teamId: Scalars['Int']['input'];
};

export type NexoyaQueryOptimizationArgs = {
  optimizationId: Scalars['Int']['input'];
  portfolioId: Scalars['Int']['input'];
  teamId: Scalars['Int']['input'];
};

export type NexoyaQueryOptimizationBudgetProposalArgs = {
  optimizationId: Scalars['Int']['input'];
  teamId: Scalars['Int']['input'];
};

export type NexoyaQueryOptimizationConfigArgs = {
  portfolioId: Scalars['Int']['input'];
  teamId: Scalars['Int']['input'];
};

export type NexoyaQueryOrgArgs = {
  org_id: Scalars['ID']['input'];
};

export type NexoyaQueryPortfolioArgs = {
  dateFrom?: InputMaybe<Scalars['DateTime']['input']>;
  dateTo?: InputMaybe<Scalars['DateTime']['input']>;
  portfolioId: Scalars['Int']['input'];
  teamId: Scalars['Int']['input'];
};

export type NexoyaQueryPortfolioBudgetProposalsArgs = {
  portfolioId: Scalars['Int']['input'];
  status?: InputMaybe<NexoyaBudgetProposalStatus>;
  teamId: Scalars['Int']['input'];
};

export type NexoyaQueryPortfolioContentArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<NexoyaSortBy>;
  teamId: Scalars['Int']['input'];
  where?: InputMaybe<NexoyaSearchFilter>;
};

export type NexoyaQueryPortfolioContentMetricTuplesArgs = {
  funnelStepId?: InputMaybe<Scalars['Int']['input']>;
  portfolioId: Scalars['Int']['input'];
  teamId: Scalars['Int']['input'];
};

export type NexoyaQueryPortfolioDashboardArgs = {
  completed?: InputMaybe<Scalars['Boolean']['input']>;
  dateFrom: Scalars['Date']['input'];
  dateTo: Scalars['Date']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  teamId: Scalars['Int']['input'];
};

export type NexoyaQueryPortfolioParentContentFiltersArgs = {
  portfolioId: Scalars['Int']['input'];
  teamId: Scalars['Int']['input'];
};

export type NexoyaQueryPortfoliosArgs = {
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<NexoyaSortBy>;
  teamId?: InputMaybe<Scalars['Int']['input']>;
  where?: InputMaybe<NexoyaSearchFilter>;
};

export type NexoyaQueryPortfolioV2Args = {
  portfolioId: Scalars['Int']['input'];
  teamId: Scalars['Int']['input'];
};

export type NexoyaQueryPredefinedContentArgs = {
  mainGoals?: InputMaybe<Array<NexoyaFunnelStepType>>;
  teamId: Scalars['Int']['input'];
};

export type NexoyaQueryPredictArgs = {
  collectionId: Scalars['Float']['input'];
  measurementId: Scalars['Int']['input'];
  periods?: InputMaybe<Scalars['Int']['input']>;
  teamId: Scalars['Int']['input'];
};

export type NexoyaQueryPreviewEventDuplicatesArgs = {
  portfolioEventNames: Array<Scalars['String']['input']>;
  portfolioId: Scalars['Float']['input'];
  teamId: Scalars['Float']['input'];
};

export type NexoyaQueryProviderArgs = {
  provider_id: Scalars['Int']['input'];
};

export type NexoyaQueryProviderKeysArgs = {
  provider_id?: InputMaybe<Scalars['Int']['input']>;
  team_id?: InputMaybe<Scalars['Int']['input']>;
};

export type NexoyaQueryProvidersArgs = {
  team_id?: InputMaybe<Scalars['Int']['input']>;
};

export type NexoyaQueryReportArgs = {
  report_id: Scalars['Int']['input'];
  team_id: Scalars['Int']['input'];
};

export type NexoyaQueryReportsArgs = {
  report_type?: InputMaybe<Scalars['String']['input']>;
  sortBy?: InputMaybe<NexoyaSortBy>;
  team_id: Scalars['Int']['input'];
  where?: InputMaybe<NexoyaSearchFilter>;
};

export type NexoyaQueryReportsSummaryArgs = {
  report_type?: InputMaybe<Scalars['String']['input']>;
  sortBy?: InputMaybe<NexoyaSortBy>;
  team_id: Scalars['Int']['input'];
};

export type NexoyaQueryReportSummaryArgs = {
  report_id: Scalars['Int']['input'];
  team_id: Scalars['Int']['input'];
};

export type NexoyaQueryTeamArgs = {
  team_id: Scalars['Int']['input'];
};

export type NexoyaQueryTeamFeatureFlagsArgs = {
  team_id: Scalars['Int']['input'];
};

export type NexoyaQueryTeamsArgs = {
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
};

export type NexoyaQueryTranslationArgs = {
  key: Scalars['String']['input'];
  lang: Scalars['String']['input'];
};

export type NexoyaQueryTranslationsArgs = {
  lang: Scalars['String']['input'];
};

export type NexoyaQueryUserArgs = {
  user_id?: InputMaybe<Scalars['Int']['input']>;
};

export type NexoyaQueryUserByEmailArgs = {
  email?: InputMaybe<Scalars['String']['input']>;
};

export type NexoyaQueryValidationDetailedReportArgs = {
  dateFrom: Scalars['DateTime']['input'];
  dateTo: Scalars['DateTime']['input'];
  portfolioId: Scalars['Int']['input'];
  teamId: Scalars['Int']['input'];
};

export type NexoyaRealizedMetricData = NexoyaMetricData & {
  __typename?: 'RealizedMetricData';
  timestamp: Scalars['DateTime']['output'];
  valueCumulative: Scalars['Float']['output'];
  valueRelative: Scalars['Float']['output'];
};

export type NexoyaRealizedMetricDataPast = {
  __typename?: 'RealizedMetricDataPast';
  timestamp: Scalars['DateTime']['output'];
  valueCumulative: Scalars['Float']['output'];
  valueRelative: Scalars['Float']['output'];
};

export type NexoyaReport = {
  __typename?: 'Report';
  archived?: Maybe<Scalars['Boolean']['output']>;
  config?: Maybe<Scalars['String']['output']>;
  contents?: Maybe<Array<Maybe<NexoyaChannelReportContent>>>;
  dateRange: NexoyaReportDateRange;
  description?: Maybe<Scalars['String']['output']>;
  kpis: Array<NexoyaMeasurement>;
  name: Scalars['String']['output'];
  report_id: Scalars['Int']['output'];
  report_type?: Maybe<Scalars['String']['output']>;
  updated_at: Scalars['DateTime']['output'];
  updatedBy?: Maybe<NexoyaUser>;
};

export type NexoyaReportDateRange = {
  __typename?: 'ReportDateRange';
  customRange?: Maybe<NexoyaDateRange>;
  rangeType: Scalars['String']['output'];
};

export type NexoyaReportDateRangeInput = {
  customRange?: InputMaybe<NexoyaDateRangeRequiredInput>;
  rangeType: Scalars['String']['input'];
};

export type NexoyaReportWithSummary = {
  __typename?: 'ReportWithSummary';
  data?: Maybe<NexoyaSumReport>;
  report_id?: Maybe<Scalars['Int']['output']>;
  team_id?: Maybe<Scalars['Int']['output']>;
};

export type NexoyaRequiredDateRange = {
  __typename?: 'RequiredDateRange';
  from: Scalars['Date']['output'];
  to: Scalars['Date']['output'];
};

export type NexoyaRoleDef = {
  __typename?: 'RoleDef';
  description?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

export type NexoyaScenarioBudget = {
  __typename?: 'ScenarioBudget';
  dailyMetrics: Array<NexoyaScenarioDailyBudget>;
  totals: NexoyaScenarioTotalBudget;
};

export type NexoyaScenarioDailyBudget = {
  __typename?: 'ScenarioDailyBudget';
  baseScenario?: Maybe<Scalars['Float']['output']>;
  changePercent?: Maybe<Scalars['Float']['output']>;
  currentScenario: Scalars['Float']['output'];
  day: Scalars['Date']['output'];
};

export type NexoyaScenarioDailyMetric = {
  __typename?: 'ScenarioDailyMetric';
  costPer?: Maybe<NexoyaScenarioMetric>;
  day: Scalars['Date']['output'];
  roas?: Maybe<NexoyaScenarioMetric>;
  value: NexoyaScenarioMetric;
};

export type NexoyaScenarioFunnelStep = {
  __typename?: 'ScenarioFunnelStep';
  costPer?: Maybe<NexoyaScenarioTotalMetric>;
  dailyMetrics: Array<NexoyaScenarioDailyMetric>;
  funnelStep: NexoyaFunnelStepV2;
  isTarget: Scalars['Boolean']['output'];
  roas?: Maybe<NexoyaScenarioTotalMetric>;
  total?: Maybe<NexoyaScenarioTotalMetric>;
};

export type NexoyaScenarioMetric = {
  __typename?: 'ScenarioMetric';
  baseScenario?: Maybe<Scalars['Float']['output']>;
  changePercent?: Maybe<Scalars['Float']['output']>;
  currentScenario: Scalars['Float']['output'];
  lowerIsBetter: Scalars['Boolean']['output'];
};

export enum NexoyaScenarioReliabilityLabel {
  High = 'HIGH',
  Low = 'LOW',
  Medium = 'MEDIUM',
}

export type NexoyaScenarioTotalBudget = {
  __typename?: 'ScenarioTotalBudget';
  baseScenarioNotOptimizedTotal?: Maybe<Scalars['Float']['output']>;
  baseScenarioTotal?: Maybe<Scalars['Float']['output']>;
  changePercentTotal?: Maybe<Scalars['Float']['output']>;
  currentScenarioNotOptimizedTotal: Scalars['Float']['output'];
  currentScenarioTotal: Scalars['Float']['output'];
};

export type NexoyaScenarioTotalMetric = {
  __typename?: 'ScenarioTotalMetric';
  baseScenario?: Maybe<Scalars['Float']['output']>;
  changePercent?: Maybe<Scalars['Float']['output']>;
  currentScenario: Scalars['Float']['output'];
  currentScenarioPredictionRange: NexoyaScenarioTotalMetricPedictionRange;
  lowerIsBetter: Scalars['Boolean']['output'];
};

export type NexoyaScenarioTotalMetricPedictionRange = {
  __typename?: 'ScenarioTotalMetricPedictionRange';
  high: Scalars['Float']['output'];
  highChangePercent: Scalars['Float']['output'];
  low: Scalars['Float']['output'];
  lowChangePercent: Scalars['Float']['output'];
};

export type NexoyaSearchFilter = {
  search?: InputMaybe<Scalars['String']['input']>;
};

export enum NexoyaShareType {
  Fullaccess = 'fullaccess',
  Readonly = 'readonly',
}

export enum NexoyaSharingObjectName {
  Portfolio = 'portfolio',
  Report = 'report',
}

export type NexoyaSimulation = {
  __typename?: 'Simulation';
  budget: NexoyaSimulationBudget;
  budgetPacing: NexoyaSimulationBudgetPacing;
  createdAt: Scalars['DateTime']['output'];
  end: Scalars['Date']['output'];
  ignoreContentBudgetLimits: Scalars['Boolean']['output'];
  isArchived: Scalars['Boolean']['output'];
  monitoringUrl?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  onlyVisibleToSupportUsers: Scalars['Boolean']['output'];
  portfolioEvents: Array<Maybe<NexoyaPortfolioEventSnapshot>>;
  scenario: NexoyaSimulationScenario;
  scenarios: Array<NexoyaSimulationScenario>;
  simulationId: Scalars['Float']['output'];
  skipNonOptimizedContentBudgets: Scalars['Boolean']['output'];
  start: Scalars['Date']['output'];
  state: NexoyaSimulationState;
};

export type NexoyaSimulationScenarioArgs = {
  scenarioId: Scalars['Int']['input'];
};

export type NexoyaSimulationBudget = {
  __typename?: 'SimulationBudget';
  max: Scalars['Int']['output'];
  min: Scalars['Int']['output'];
  stepCount: Scalars['Int']['output'];
  steps: Array<NexoyaSimulationBudgetStep>;
  stepSize: Scalars['Int']['output'];
};

export enum NexoyaSimulationBudgetPacing {
  Dynamic = 'DYNAMIC',
  Static = 'STATIC',
}

export type NexoyaSimulationBudgetPreview = {
  __typename?: 'SimulationBudgetPreview';
  budgets: Array<NexoyaSimulationBudgetStep>;
  isDefaultScenario: Scalars['Boolean']['output'];
  stepCount: Scalars['Int']['output'];
  stepSize: Scalars['Int']['output'];
};

export type NexoyaSimulationBudgetStep = {
  __typename?: 'SimulationBudgetStep';
  budget: Scalars['Float']['output'];
  isBaseScenario: Scalars['Boolean']['output'];
  isCustomScenario: Scalars['Boolean']['output'];
};

export type NexoyaSimulationBudgetStepInput = {
  budget: Scalars['Float']['input'];
  isBaseScenario: Scalars['Boolean']['input'];
  isCustomScenario: Scalars['Boolean']['input'];
};

export type NexoyaSimulationScenario = {
  __typename?: 'SimulationScenario';
  appliedAt?: Maybe<Scalars['DateTime']['output']>;
  budget: NexoyaScenarioBudget;
  funnelSteps: Array<NexoyaScenarioFunnelStep>;
  isApplied: Scalars['Boolean']['output'];
  isBaseScenario: Scalars['Boolean']['output'];
  isCustomScenario: Scalars['Boolean']['output'];
  reliabilityLabel: NexoyaScenarioReliabilityLabel;
  scenarioId: Scalars['Float']['output'];
  targetFunnelStep: NexoyaScenarioFunnelStep;
};

export enum NexoyaSimulationState {
  Applied = 'APPLIED',
  Completed = 'COMPLETED',
  Pending = 'PENDING',
  Running = 'RUNNING',
}

export type NexoyaSortBy = {
  field: NexoyaSortField;
  order: NexoyaSortOrder;
};

export enum NexoyaSortField {
  Name = 'name',
  Title = 'title',
}

export enum NexoyaSortOrder {
  Asc = 'ASC',
  Desc = 'DESC',
}

export enum NexoyaSumGroupOption {
  Measurement = 'measurement',
}

export type NexoyaSumReport = {
  __typename?: 'SumReport';
  archived?: Maybe<Scalars['Boolean']['output']>;
  config?: Maybe<Scalars['String']['output']>;
  contents?: Maybe<Array<Maybe<NexoyaChannelReportContent>>>;
  dateRange: NexoyaReportDateRange;
  description?: Maybe<Scalars['String']['output']>;
  kpis: Array<NexoyaMeasurement>;
  name: Scalars['String']['output'];
  report_id: Scalars['Int']['output'];
  report_type?: Maybe<Scalars['String']['output']>;
  updated_at: Scalars['DateTime']['output'];
  updatedBy?: Maybe<NexoyaUser>;
};

export type NexoyaSumReportContentsArgs = {
  groupBy?: InputMaybe<NexoyaSumGroupOption>;
};

export enum NexoyaTargetBiddingApplyMode {
  BiddingStrategyOnly = 'BIDDING_STRATEGY_ONLY',
  BudgetAndBiddingStrategy = 'BUDGET_AND_BIDDING_STRATEGY',
  BudgetOnly = 'BUDGET_ONLY',
}

export enum NexoyaTargetItemStatus {
  Active = 'ACTIVE',
  ActiveNoOptimization = 'ACTIVE_NO_OPTIMIZATION',
  Past = 'PAST',
  Planned = 'PLANNED',
}

export type NexoyaTeam = {
  __typename?: 'Team';
  active?: Maybe<Scalars['Boolean']['output']>;
  currency?: Maybe<Scalars['String']['output']>;
  customization?: Maybe<Scalars['String']['output']>;
  dashboardUrls?: Maybe<Array<Maybe<NexoyaDashboardUrl>>>;
  featureFlags?: Maybe<Array<Maybe<NexoyaTeamFeatureFlag>>>;
  /**
   * currently active KPIs
   * @deprecated Use `measurement_range`.
   */
  kpi_range?: Maybe<Array<Maybe<NexoyaKpi>>>;
  /** @deprecated Use `measurement_selected`. */
  kpi_selected?: Maybe<Array<Maybe<NexoyaKpi>>>;
  logo?: Maybe<Scalars['String']['output']>;
  /** @deprecated Use `measurement_range` root query. */
  measurement_range?: Maybe<Array<Maybe<NexoyaMeasurement>>>;
  measurement_selected?: Maybe<Array<Maybe<NexoyaMeasurement>>>;
  members: Array<Maybe<NexoyaTeamMember>>;
  name?: Maybe<Scalars['String']['output']>;
  number_format?: Maybe<Scalars['String']['output']>;
  onboarding?: Maybe<Scalars['JSON']['output']>;
  organization?: Maybe<NexoyaOrg>;
  team_id: Scalars['Int']['output'];
};

export type NexoyaTeamKpi_RangeArgs = {
  collections?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  dateFrom?: InputMaybe<Scalars['DateTime']['input']>;
  dateTo?: InputMaybe<Scalars['DateTime']['input']>;
  team_id: Scalars['Int']['input'];
};

export type NexoyaTeamMeasurement_RangeArgs = {
  collection_id?: InputMaybe<Scalars['Float']['input']>;
  collections?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  dateFrom?: InputMaybe<Scalars['DateTime']['input']>;
  dateTo?: InputMaybe<Scalars['DateTime']['input']>;
  first?: InputMaybe<Scalars['Float']['input']>;
  measurement_id?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Float']['input']>;
  parentOnly?: InputMaybe<Scalars['Boolean']['input']>;
  providers?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  where?: InputMaybe<NexoyaFilter>;
};

export type NexoyaTeamMeasurement_SelectedArgs = {
  dateFrom?: InputMaybe<Scalars['DateTime']['input']>;
  dateTo?: InputMaybe<Scalars['DateTime']['input']>;
};

export type NexoyaTeamFeatureFlag = {
  __typename?: 'TeamFeatureFlag';
  name?: Maybe<NexoyaTeamFeatureFlagName>;
  status?: Maybe<Scalars['Boolean']['output']>;
};

export enum NexoyaTeamFeatureFlagName {
  AttributionModel = 'attribution_model',
  BudgetV1 = 'budget_v1',
  DetailedReportV1 = 'detailed_report_v1',
  ExperimentalChatbot = 'experimental_chatbot',
  GoogleAdsCampaignManagement = 'google_ads_campaign_management',
  KpiAllHistoricData = 'kpi_all_historic_data',
  NexoyaDemo = 'nexoya_demo',
  OptimizationRescaleBaselinePrediction = 'optimization_rescale_baseline_prediction',
  PortfolioDashboardDisabled = 'portfolio_dashboard_disabled',
  Simulations = 'simulations',
}

export type NexoyaTeamInfoInput = {
  logo?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type NexoyaTeamInput = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  currency?: InputMaybe<Scalars['String']['input']>;
  logo?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  org_id?: InputMaybe<Scalars['Int']['input']>;
  team_id?: InputMaybe<Scalars['Int']['input']>;
};

export type NexoyaTeamMember = {
  __typename?: 'TeamMember';
  active?: Maybe<Scalars['Boolean']['output']>;
  email: Scalars['String']['output'];
  firstname?: Maybe<Scalars['String']['output']>;
  lastLogin?: Maybe<Scalars['DateTime']['output']>;
  lastname?: Maybe<Scalars['String']['output']>;
  role: NexoyaRoleDef;
  user_id: Scalars['Int']['output'];
};

export type NexoyaTeamWithOrgInput = {
  logo?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type NexoyaTenant = {
  __typename?: 'Tenant';
  name?: Maybe<Scalars['String']['output']>;
  tenant_id: Scalars['Int']['output'];
  uiCustomization?: Maybe<NexoyaTenantUiCustomization>;
};

export type NexoyaTenantUiCustomization = {
  __typename?: 'TenantUICustomization';
  faviconUrl?: Maybe<Scalars['String']['output']>;
  helpPageUrl?: Maybe<Scalars['String']['output']>;
  logoUrl?: Maybe<Scalars['String']['output']>;
  onboardingMail?: Maybe<Scalars['String']['output']>;
  pageTitlePrefix?: Maybe<Scalars['String']['output']>;
  supportMail?: Maybe<Scalars['String']['output']>;
};

export type NexoyaTranslation = {
  __typename?: 'Translation';
  key: Scalars['String']['output'];
  lang: Scalars['String']['output'];
  text?: Maybe<Scalars['String']['output']>;
};

export type NexoyaUpdateAttributionModelInput = {
  name?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<NexoyaAttributionModelStatus>;
};

export type NexoyaUpdateAttributionRuleFiltersContentActionInput = {
  applyAttributionRuleId?: InputMaybe<Scalars['Float']['input']>;
  contentId: Scalars['Float']['input'];
};

export type NexoyaUpdateAttributionRuleFiltersMutationResponse = {
  __typename?: 'UpdateAttributionRuleFiltersMutationResponse';
  updatedAttributionRule: NexoyaAttributionRule;
};

export type NexoyaUpdateContentRelationPayload = {
  __typename?: 'updateContentRelationPayload';
  error?: Maybe<Scalars['String']['output']>;
  success?: Maybe<Scalars['Boolean']['output']>;
  warning?: Maybe<Scalars['String']['output']>;
};

export type NexoyaUpdateContentRuleAndContentsMutationResponse = {
  __typename?: 'UpdateContentRuleAndContentsMutationResponse';
  updatedContentRule: NexoyaContentRule;
};

export type NexoyaUpdateContentRuleFiltersContentActionInput = {
  applyContentRuleId?: InputMaybe<Scalars['Float']['input']>;
  contentId: Scalars['Float']['input'];
  removeFromPortfolio: Scalars['Boolean']['input'];
};

export type NexoyaUpdateContentRuleFunnelStepMappingsMutationResponse = {
  __typename?: 'UpdateContentRuleFunnelStepMappingsMutationResponse';
  clashingDiscoveredContents: Array<NexoyaDiscoveredContent>;
  contentRule: NexoyaContentRule;
};

export type NexoyaUpdateImpactGroupRuleAndContentsMutationResponse = {
  __typename?: 'UpdateImpactGroupRuleAndContentsMutationResponse';
  updatedImpactGroupRule: NexoyaImpactGroupRule;
};

export type NexoyaUpdateImpactGroupRuleFiltersContentActionInput = {
  applyImpactGroupRuleId?: InputMaybe<Scalars['Float']['input']>;
  contentId: Scalars['Float']['input'];
  removeImpactGroupAssignment: Scalars['Boolean']['input'];
};

export type NexoyaUpdatePortfolioEventMutationResponse = {
  __typename?: 'UpdatePortfolioEventMutationResponse';
  updatedPortfolioEvent?: Maybe<NexoyaPortfolioEvent>;
};

export type NexoyaUpsertImpactGroupInput = {
  funnelStepIds: Array<Scalars['Int']['input']>;
  impactGroupId?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
};

export type NexoyaUpsertPortfolioFunnelStepsMutationFunnelStepInput = {
  funnelStepId?: InputMaybe<Scalars['Int']['input']>;
  title: Scalars['String']['input'];
  type: NexoyaFunnelStepType;
};

export type NexoyaUser = {
  __typename?: 'User';
  active?: Maybe<Scalars['Boolean']['output']>;
  activeRole?: Maybe<NexoyaRoleDef>;
  email: Scalars['String']['output'];
  firstname?: Maybe<Scalars['String']['output']>;
  lastLogin?: Maybe<Scalars['DateTime']['output']>;
  lastname?: Maybe<Scalars['String']['output']>;
  slackUserId?: Maybe<Scalars['String']['output']>;
  state?: Maybe<NexoyaUserStateEnum>;
  teams?: Maybe<Array<Maybe<NexoyaTeam>>>;
  user_id: Scalars['Int']['output'];
};

export type NexoyaUserActiveRoleArgs = {
  team_id: Scalars['Int']['input'];
};

export type NexoyaUserInfo = {
  firstname?: InputMaybe<Scalars['String']['input']>;
  lastname?: InputMaybe<Scalars['String']['input']>;
};

export enum NexoyaUserStateEnum {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
  Onboarding = 'ONBOARDING',
}

export type NexoyaValidation = {
  __typename?: 'Validation';
  tooltip?: Maybe<NexoyaValidationTooltip>;
  validationPerformance?: Maybe<Array<Maybe<NexoyaValidationPerformance>>>;
  validationReport?: Maybe<Array<Maybe<NexoyaValidationReportRows>>>;
};

export type NexoyaValidationTooltipArgs = {
  funnelStepId: Scalars['Int']['input'];
};

export type NexoyaValidationData = {
  __typename?: 'ValidationData';
  achieved: Scalars['Float']['output'];
  nonOptimized: Scalars['Float']['output'];
  optimized: Scalars['Float']['output'];
  timestamp: Scalars['DateTime']['output'];
};

export type NexoyaValidationDataTotal = {
  __typename?: 'ValidationDataTotal';
  costPerAchieved: Scalars['Float']['output'];
  costPerNonOptimized: Scalars['Float']['output'];
  costPerOptimized: Scalars['Float']['output'];
  gainLossCostPer: Scalars['Float']['output'];
  gainLossTotal: Scalars['Float']['output'];
  totalAchieved: Scalars['Float']['output'];
  totalNonOptimized: Scalars['Float']['output'];
  totalOptimized: Scalars['Float']['output'];
};

export type NexoyaValidationPerfomanceTooltip = {
  __typename?: 'ValidationPerfomanceTooltip';
  achieved: Scalars['Float']['output'];
  nonOptimized: Scalars['Float']['output'];
  optimized: Scalars['Float']['output'];
};

export type NexoyaValidationPerformance = {
  __typename?: 'ValidationPerformance';
  funnelStep: NexoyaFunnelStep;
  validationData?: Maybe<Array<NexoyaValidationData>>;
  validationDataTotal?: Maybe<NexoyaValidationDataTotal>;
  validationTooltip?: Maybe<NexoyaValidationPerfomanceTooltip>;
};

export type NexoyaValidationReportBudgetChanges = {
  __typename?: 'validationReportBudgetChanges';
  applicationDelta?: Maybe<Scalars['Float']['output']>;
  appliedPctChange?: Maybe<Scalars['Float']['output']>;
  suggestedPctChange?: Maybe<Scalars['Float']['output']>;
};

export type NexoyaValidationReportRows = {
  __typename?: 'ValidationReportRows';
  budgetChanges?: Maybe<NexoyaValidationReportBudgetChanges>;
  channelTitle?: Maybe<Scalars['String']['output']>;
  contentTitle?: Maybe<Scalars['String']['output']>;
  parentContentTitle?: Maybe<Scalars['String']['output']>;
  spendings?: Maybe<NexoyaValidationReportSpendings>;
  valuesPerFunnel?: Maybe<Array<Maybe<NexoyaValidationReportValuesPerFunnel>>>;
};

export type NexoyaValidationReportSpendings = {
  __typename?: 'validationReportSpendings';
  baseline?: Maybe<Scalars['Float']['output']>;
  proposed?: Maybe<Scalars['Float']['output']>;
  spent?: Maybe<Scalars['Float']['output']>;
};

export type NexoyaValidationReportValuesPerFunnel = {
  __typename?: 'validationReportValuesPerFunnel';
  achieved?: Maybe<Scalars['Float']['output']>;
  costPer?: Maybe<Scalars['Float']['output']>;
  funnelStepId?: Maybe<Scalars['Int']['output']>;
  funnelStepTitle?: Maybe<Scalars['String']['output']>;
  nonOptimized?: Maybe<Scalars['Float']['output']>;
  optimized?: Maybe<Scalars['Float']['output']>;
};

export type NexoyaValidationTooltip = {
  __typename?: 'ValidationTooltip';
  funnelStep: NexoyaFunnelStep;
  validationData?: Maybe<Array<NexoyaValidationData>>;
  validationDataTotal?: Maybe<NexoyaValidationDataTotal>;
};

export enum NexoyaWeekday {
  Friday = 'FRIDAY',
  Monday = 'MONDAY',
  Saturday = 'SATURDAY',
  Sunday = 'SUNDAY',
  Thursday = 'THURSDAY',
  Tuesday = 'TUESDAY',
  Wednesday = 'WEDNESDAY',
}

export type NexoyaWeeklyBudget = {
  __typename?: 'WeeklyBudget';
  allocatedValue: Scalars['Float']['output'];
  endDate: Scalars['DateTime']['output'];
  providerId?: Maybe<Scalars['Int']['output']>;
  realizedValue: Scalars['Float']['output'];
  startDate: Scalars['DateTime']['output'];
};

export type NexoyaRemoveUserMutationVariables = Exact<{
  team_id: Scalars['Int']['input'];
  user_to_remove_id: Scalars['Int']['input'];
}>;

export type NexoyaRemoveUserMutation = { __typename?: 'Mutation'; removeUser?: boolean | null };

export const RemoveUserDocument = gql`
  mutation RemoveUser($team_id: Int!, $user_to_remove_id: Int!) {
    removeUser(team_id: $team_id, user_to_remove_id: $user_to_remove_id)
  }
`;
export type NexoyaRemoveUserMutationFn = Apollo.MutationFunction<
  NexoyaRemoveUserMutation,
  NexoyaRemoveUserMutationVariables
>;

/**
 * __useRemoveUserMutation__
 *
 * To run a mutation, you first call `useRemoveUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeUserMutation, { data, loading, error }] = useRemoveUserMutation({
 *   variables: {
 *      team_id: // value for 'team_id'
 *      user_to_remove_id: // value for 'user_to_remove_id'
 *   },
 * });
 */
export function useRemoveUserMutation(
  baseOptions?: Apollo.MutationHookOptions<NexoyaRemoveUserMutation, NexoyaRemoveUserMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<NexoyaRemoveUserMutation, NexoyaRemoveUserMutationVariables>(RemoveUserDocument, options);
}
export type RemoveUserMutationHookResult = ReturnType<typeof useRemoveUserMutation>;
export type RemoveUserMutationResult = Apollo.MutationResult<NexoyaRemoveUserMutation>;
export type RemoveUserMutationOptions = Apollo.BaseMutationOptions<
  NexoyaRemoveUserMutation,
  NexoyaRemoveUserMutationVariables
>;
