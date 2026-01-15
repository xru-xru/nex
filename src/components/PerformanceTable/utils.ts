import { Column } from 'react-table';
import { NexoyaFunnelStepPerformance, NexoyaFunnelStepV2 } from '../../types';
import { useCallback, useState } from 'react';
import { useTeam } from '../../context/TeamProvider';
import { useLazyQuery } from '@apollo/client';
import { toast } from 'sonner';
import { PERFORMANCE_FUNNEL_STEP_WITH_DAILY_CONTENTS_QUERY } from 'graphql/performance/queryPerformanceFunnelStep';

export const getCustomCellStyles = (column: Column, selectedFunnelStepId: number) => {
  if (column.id.includes(String(selectedFunnelStepId))) {
    return {
      background: 'rgba(5, 168, 250, 0.03)',
    };
  }
};

export function useSequentialFunnelStepPerformanceQueries() {
  const { teamId } = useTeam();

  const [results, setResults] = useState<NexoyaFunnelStepPerformance[]>([]);
  const [loading, setLoading] = useState(false);

  const [loadPerformanceFunnelStepQuery] = useLazyQuery(PERFORMANCE_FUNNEL_STEP_WITH_DAILY_CONTENTS_QUERY);

  const fetchFunnelSteps = useCallback(
    async (funnelSteps: NexoyaFunnelStepV2[], portfolioId: number, period: { start: string; end: string }) => {
      setResults([]); // Reset results before new fetch
      setLoading(true);

      const fetchPromise = async () => {
        try {
          const fetchedResults: NexoyaFunnelStepPerformance[] = [];

          // Process funnel steps sequentially
          for (const funnelStep of funnelSteps) {
            const { data, error } = await loadPerformanceFunnelStepQuery({
              variables: {
                teamId,
                portfolioId,
                period,
                funnelStepId: funnelStep.funnelStepId,
              },
            });

            if (error) {
              // Throw error to be caught by the catch block as some graphql errors from the fetch are not caught by the promise
              // as the graphql returns a 200 with an error body
              throw error;
            }

            if (data?.portfolioV2?.performance?.funnelStep) {
              fetchedResults.push(data.portfolioV2.performance.funnelStep);
              setResults(fetchedResults); // Update state with current progress
            }

            // Add a small delay between requests to prevent the server from going into a 502 error
            await new Promise((resolve) => setTimeout(resolve, 250));
          }

          return fetchedResults;
        } catch (error) {
          console.error('Error fetching funnel step data:', error);
          return []; // Handle unexpected errors by returning an empty array
        }
      };

      try {
        // Show toast notification tied to the fetch promise
        toast.promise(fetchPromise, {
          loading: 'Generating daily metrics export...',
          error: 'Failed to fetch funnel step data',
          success: () => 'Successfully generated daily metrics export',
        });

        const fetchedResults = await fetchPromise();
        setResults(fetchedResults);
        setLoading(false);
        return true;
      } catch (error) {
        setLoading(false);
        return false;
      }
    },
    [loadPerformanceFunnelStepQuery, teamId],
  );

  return {
    results,
    loading,
    fetchFunnelSteps,
  };
}
