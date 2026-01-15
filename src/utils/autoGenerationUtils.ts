import { NexoyaContentFilterFieldName, NexoyaContentFilterOperator, NexoyaContentV2 } from '../types';
import { ACCOUNT_COLLECTION_TYPE_ID } from '../constants/collection';

export interface AutoGenerationSummary {
  byProvider: Record<string, number>;
  byContentType: Record<string, number>;
  byAdAccount: Record<string, number>;
  byImpactGroup?: Record<string, number>;
}

export interface AutoGenerationRule {
  name: string;
  filters: any;
  funnelStepMappings?: any[];
  impactGroupId?: number;
}

/**
 * Analyzes portfolio content to generate optimal content rules
 */
export function analyzeContentForAutoGeneration(contents: NexoyaContentV2[]): {
  contentRules: AutoGenerationRule[];
  summary: AutoGenerationSummary;
} {
  const summary: AutoGenerationSummary = {
    byProvider: {},
    byContentType: {},
    byAdAccount: {},
  };

  const contentRules: AutoGenerationRule[] = [];

  // Group contents by provider
  const contentsByProvider = groupContentsByProvider(contents);

  // Group contents by content type within each provider
  Object.entries(contentsByProvider).forEach(([providerId, providerContents]) => {
    const providerName = providerContents[0]?.provider?.name || `Provider ${providerId}`;

    // Update summary
    summary.byProvider[providerName] = providerContents.length;

    // Group by content type
    const contentsByType = groupContentsByType(providerContents);

    Object.entries(contentsByType).forEach(([contentType, typeContents]) => {
      const contentTypeName = typeContents[0]?.contentType?.name || `Type ${contentType}`;

      // Update summary
      summary.byContentType[contentTypeName] = (summary.byContentType[contentTypeName] || 0) + typeContents.length;

      // For content rules, we'll group by provider and content type
      // Ad account grouping will be handled by the backend auto-generation
      const ruleName = `${providerName} - ${contentTypeName}`;
      const rule = createContentRuleFromContents(ruleName, typeContents, providerId);
      contentRules.push(rule);
    });
  });

  return { contentRules, summary };
}

/**
 * Analyzes portfolio content to generate optimal impact group rules
 */
export function analyzeContentForImpactGroupAutoGeneration(
  contents: NexoyaContentV2[],
  impactGroups: any[],
): {
  impactGroupRules: AutoGenerationRule[];
  summary: AutoGenerationSummary;
} {
  const summary: AutoGenerationSummary = {
    byProvider: {},
    byContentType: {},
    byAdAccount: {},
    byImpactGroup: {},
  };

  const impactGroupRules: AutoGenerationRule[] = [];

  // For each impact group, create rules based on content patterns
  impactGroups.forEach((impactGroup) => {
    const impactGroupName = impactGroup.name;
    summary.byImpactGroup[impactGroupName] = 0;

    // Group contents by provider for this impact group
    const contentsByProvider = groupContentsByProvider(contents);

    Object.entries(contentsByProvider).forEach(([providerId, providerContents]) => {
      const providerName = providerContents[0]?.provider?.name || `Provider ${providerId}`;

      // Group by content type
      const contentsByType = groupContentsByType(providerContents);

      Object.entries(contentsByType).forEach(([contentType, typeContents]) => {
        const contentTypeName = typeContents[0]?.contentType?.name || `Type ${contentType}`;

        // Create impact group rule
        const ruleName = `${impactGroupName} - ${providerName} - ${contentTypeName}`;
        const rule = createImpactGroupRuleFromContents(ruleName, typeContents, providerId, impactGroup.impactGroupId);
        impactGroupRules.push(rule);

        summary.byImpactGroup[impactGroupName] += typeContents.length;
      });
    });
  });

  return { impactGroupRules, summary };
}

function groupContentsByProvider(contents: NexoyaContentV2[]): Record<string, NexoyaContentV2[]> {
  return contents.reduce(
    (groups, content) => {
      const providerId = content.provider?.provider_id?.toString() || 'unknown';
      if (!groups[providerId]) {
        groups[providerId] = [];
      }
      groups[providerId].push(content);
      return groups;
    },
    {} as Record<string, NexoyaContentV2[]>,
  );
}

function groupContentsByType(contents: NexoyaContentV2[]): Record<string, NexoyaContentV2[]> {
  return contents.reduce(
    (groups, content) => {
      const contentTypeId = content.contentType?.collection_type_id?.toString() || 'unknown';
      if (!groups[contentTypeId]) {
        groups[contentTypeId] = [];
      }
      groups[contentTypeId].push(content);
      return groups;
    },
    {} as Record<string, NexoyaContentV2[]>,
  );
}

function createContentRuleFromContents(
  name: string,
  contents: NexoyaContentV2[],
  providerId: string,
): AutoGenerationRule {
  // Extract ad account IDs from contents that are accounts (collection_type_id === 2)
  const adAccountIds = contents
    .filter((content) => content.contentType?.collection_type_id === ACCOUNT_COLLECTION_TYPE_ID)
    .map((content) => content.contentId);

  const filters = {
    providerId: parseInt(providerId, 10),
    adAccountIds,
    contentFilters: [
      {
        fieldName: NexoyaContentFilterFieldName.SourceProviderId,
        operator: NexoyaContentFilterOperator.Eq,
        value: { numberArr: [parseInt(providerId, 10)] },
      },
      {
        fieldName: NexoyaContentFilterFieldName.ContentType,
        operator: NexoyaContentFilterOperator.Eq,
        value: { string: contents[0]?.contentType?.name },
      },
    ],
  };

  return {
    name,
    filters,
  };
}

function createImpactGroupRuleFromContents(
  name: string,
  contents: NexoyaContentV2[],
  providerId: string,
  impactGroupId: number,
): AutoGenerationRule {
  // Extract ad account IDs from contents that are accounts (collection_type_id === 2)
  const adAccountIds = contents
    .filter((content) => content.contentType?.collection_type_id === ACCOUNT_COLLECTION_TYPE_ID)
    .map((content) => content.contentId);

  const filters = {
    providers: [
      {
        providerId: parseInt(providerId, 10),
        adAccountIds,
      },
    ],
    contentFilters: [
      {
        fieldName: NexoyaContentFilterFieldName.SourceProviderId,
        operator: NexoyaContentFilterOperator.Eq,
        value: { numberArr: [parseInt(providerId, 10)] },
      },
      {
        fieldName: NexoyaContentFilterFieldName.ContentType,
        operator: NexoyaContentFilterOperator.Eq,
        value: { string: contents[0]?.contentType?.name },
      },
    ],
  };

  return {
    name,
    filters,
    impactGroupId,
  };
}
