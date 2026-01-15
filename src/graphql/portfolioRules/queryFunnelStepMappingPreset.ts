import { gql, useQuery } from '@apollo/client';
import { useTeam } from 'context/TeamProvider';
import { NexoyaFunnelStepMappingPreset } from '../../types';

export const FUNNEL_STEP_MAPPING_PRESET_QUERY = gql`
  query FunnelStepMappingPreset($teamId: Float!) {
    listFunnelStepMappingPresets(teamId: $teamId) {
      funnelStepMappingPresetId
      name
      mapping {
        conversions {
          accountConversionIds
          conversionName
          metricId
        }
        metricId
        analyticsPropertyId
        utmParams {
          type
          values
        }
      }
    }
  }
`;

type FunnelStepMappingPresetQueryVariables = {
  teamId?: number;
  onCompleted?: (data: { listFunnelStepMappingPresets: NexoyaFunnelStepMappingPreset[] }) => void;
};

export function useFunnelStepMappingPreset() {
  const { teamId } = useTeam();

  const query = useQuery<
    { listFunnelStepMappingPresets: NexoyaFunnelStepMappingPreset[] },
    FunnelStepMappingPresetQueryVariables
  >(FUNNEL_STEP_MAPPING_PRESET_QUERY, {
    variables: {
      teamId,
    },
  });

  return query;
}
