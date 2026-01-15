import client from '../apollo';
import {
  NexoyaDiscoveredContentStatus,
  NexoyaImpactGroup,
  NexoyaMetricDefinitionV2,
  NexoyaPortfolioLabel,
  NexoyaPortfolioParentContentConnection,
} from '../types';

// Base function remains the same
export function updateApolloCache({ query, variables, updateFn }) {
  client.cache.updateQuery(
    {
      query: query,
      broadcast: false,
      variables: variables,
    },
    updateFn,
  );
}

// Function to update the impact group for a specific content
export function updatePortfolioParentContentImpactGroupCache({
  portfolioContentIds,
  impactGroup,
}: {
  portfolioContentIds: number[];
  impactGroup: NexoyaImpactGroup;
}) {
  return (currentCache: { portfolioV2: { portfolioParentContents: NexoyaPortfolioParentContentConnection } }) => {
    if (!currentCache?.portfolioV2?.portfolioParentContents?.edges) {
      return currentCache;
    }

    return {
      ...currentCache,
      portfolioV2: {
        ...currentCache.portfolioV2,
        portfolioParentContents: {
          ...currentCache.portfolioV2.portfolioParentContents,
          edges: currentCache.portfolioV2.portfolioParentContents.edges.map((edge) => {
            if (portfolioContentIds?.includes(edge.node.portfolioContentId)) {
              return {
                ...edge,
                node: {
                  ...edge.node,
                  impactGroup,
                },
              };
            }
            return edge;
          }),
        },
      },
    };
  };
}

// Function to update funnel step metrics for a content
export function updatePortfolioParentContentFunnelStepMetricsCache({
  contentId,
  funnelStepId,
  metricTypeId,
  isChildContent,
  metricsList,
}: {
  contentId: number;
  funnelStepId: number;
  metricTypeId: number | null;
  isChildContent: boolean;
  metricsList: NexoyaMetricDefinitionV2[];
}) {
  const effectiveMetricTypeId = metricTypeId ?? 0;

  return (currentCache: { portfolioV2: { portfolioParentContents: NexoyaPortfolioParentContentConnection } }) => {
    if (!currentCache?.portfolioV2?.portfolioParentContents?.edges) {
      return currentCache;
    }

    return {
      ...currentCache,
      portfolioV2: {
        ...currentCache.portfolioV2,
        portfolioParentContents: {
          ...currentCache.portfolioV2.portfolioParentContents,
          edges: currentCache.portfolioV2.portfolioParentContents.edges.map((edge) => {
            const node = edge.node;

            if (isChildContent) {
              // Update child content metrics
              if (node.childContents?.some((child) => child.content.contentId === contentId)) {
                return {
                  ...edge,
                  node: {
                    ...node,
                    childContents: node.childContents.map((child) => {
                      if (child.content.contentId === contentId) {
                        return {
                          ...child,
                          funnelSteps: child.funnelSteps.map((fs) => {
                            if (fs.funnelStep.funnelStepId === funnelStepId) {
                              return {
                                ...fs,
                                metric: {
                                  metricTypeId: effectiveMetricTypeId,
                                  name:
                                    metricsList?.find((opt) => opt.metricTypeId === effectiveMetricTypeId)?.name ||
                                    'None',
                                },
                              };
                            }
                            return fs;
                          }),
                        };
                      }
                      return child;
                    }),
                  },
                };
              }
            } else if (node.content.contentId === contentId) {
              // Update parent content metrics
              return {
                ...edge,
                node: {
                  ...node,
                  funnelSteps: node.funnelSteps.map((fs) => {
                    if (fs.funnelStep.funnelStepId === funnelStepId) {
                      return {
                        ...fs,
                        metric: {
                          metricTypeId: effectiveMetricTypeId,
                          name: metricsList?.find((opt) => opt.metricTypeId === effectiveMetricTypeId)?.name || 'None',
                        },
                      };
                    }
                    return fs;
                  }),
                },
              };
            }

            return edge;
          }),
        },
      },
    };
  };
}

// Function to update the label for a content
export function updatePortfolioParentContentLabelCache({
  portfolioContentIds,
  label,
}: {
  portfolioContentIds: number[];
  label: NexoyaPortfolioLabel;
}) {
  return (currentCache: { portfolioV2: { portfolioParentContents: NexoyaPortfolioParentContentConnection } }) => {
    if (!currentCache?.portfolioV2?.portfolioParentContents?.edges) {
      return currentCache;
    }

    return {
      ...currentCache,
      portfolioV2: {
        ...currentCache.portfolioV2,
        portfolioParentContents: {
          ...currentCache.portfolioV2.portfolioParentContents,
          edges: currentCache.portfolioV2.portfolioParentContents.edges.map((edge) => {
            if (portfolioContentIds?.includes(edge.node.portfolioContentId)) {
              return {
                ...edge,
                node: {
                  ...edge.node,
                  label,
                },
              };
            }
            return edge;
          }),
        },
      },
    };
  };
}

// Function to update discovered content status
export function updatePortfolioParentContentDiscoveredContentCache({
  portfolioContentId,
  status = NexoyaDiscoveredContentStatus.Manual,
}: {
  portfolioContentId: number;
  status?: NexoyaDiscoveredContentStatus;
}) {
  return (currentCache: { portfolioV2: { portfolioParentContents: NexoyaPortfolioParentContentConnection } }) => {
    if (!currentCache?.portfolioV2?.portfolioParentContents?.edges) {
      return currentCache;
    }

    return {
      ...currentCache,
      portfolioV2: {
        ...currentCache.portfolioV2,
        portfolioParentContents: {
          ...currentCache.portfolioV2.portfolioParentContents,
          edges: currentCache.portfolioV2.portfolioParentContents.edges.map((edge) => {
            if (edge.node.portfolioContentId === portfolioContentId) {
              return {
                ...edge,
                node: {
                  ...edge.node,
                  discoveredContent: {
                    ...edge.node.discoveredContent,
                    status,
                  },
                },
              };
            }
            return edge;
          }),
        },
      },
    };
  };
}
// Function to update optimization status
export function updatePortfolioParentContentOptimizationStatusCache({
  portfolioContentIds,
  isIncludedInOptimization,
}: {
  portfolioContentIds: number[];
  isIncludedInOptimization: boolean;
}) {
  return (currentCache: { portfolioV2: { portfolioParentContents: NexoyaPortfolioParentContentConnection } }) => {
    if (!currentCache?.portfolioV2?.portfolioParentContents?.edges) {
      return currentCache;
    }

    return {
      ...currentCache,
      portfolioV2: {
        ...currentCache.portfolioV2,
        portfolioParentContents: {
          ...currentCache.portfolioV2.portfolioParentContents,
          edges: currentCache.portfolioV2.portfolioParentContents.edges.map((edge) => {
            if (portfolioContentIds?.includes(edge.node.portfolioContentId)) {
              return {
                ...edge,
                node: {
                  ...edge.node,
                  isIncludedInOptimization,
                },
              };
            }
            return edge;
          }),
        },
      },
    };
  };
}
