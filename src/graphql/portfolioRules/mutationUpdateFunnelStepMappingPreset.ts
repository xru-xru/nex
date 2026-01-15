import { gql, useMutation } from '@apollo/client';
import { toast } from 'sonner';
import { NexoyaFunnelStepMappingInput } from '../../types';
import { useTeam } from '../../context/TeamProvider';
import { FUNNEL_STEP_MAPPING_PRESET_QUERY } from './queryFunnelStepMappingPreset';

const UPDATE_FUNNEL_STEP_MAPPING_PRESET_QUERY = gql`
  mutation UpdateFunnelStepMappingPreset(
    $teamId: Float!
    $name: String!
    $mapping: FunnelStepMappingInput!
    $funnelStepMappingPresetId: Float!
  ) {
    updateFunnelStepMappingPreset(
      funnelStepMappingPresetId: $funnelStepMappingPresetId
      teamId: $teamId
      name: $name
      mapping: $mapping
    ) {
      name
    }
  }
`;

type UpdateFunnelStepMappingPresetProps = {
  teamId: number;
  name: string;
  mapping: NexoyaFunnelStepMappingInput;
  funnelStepMappingPresetId: number;
};

export function useUpdateFunnelStepMappingPreset({ portfolioId }: { portfolioId: number }) {
  const { teamId } = useTeam();

  return useMutation<
    {
      updateFunnelStepMappingPreset: {
        name: string;
        funnelStepMappingPresetId: number;
      };
    },
    UpdateFunnelStepMappingPresetProps
  >(UPDATE_FUNNEL_STEP_MAPPING_PRESET_QUERY, {
    awaitRefetchQueries: true,
    onError: (error) => {
      console.error(error);
      toast.error(error.message);
    },
    onCompleted: (data) => {
      toast.success(`Preset ${data.updateFunnelStepMappingPreset.name} updated successfully`);
    },
    refetchQueries: [
      {
        notifyOnNetworkStatusChange: true,
        query: FUNNEL_STEP_MAPPING_PRESET_QUERY,
        variables: {
          teamId,
          portfolioId,
        },
        fetchPolicy: 'network-only',
      },
    ],
  });
}
