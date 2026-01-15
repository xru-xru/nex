import { gql, useMutation } from '@apollo/client';
import { toast } from 'sonner';
import { useTeam } from '../../context/TeamProvider';
import { FUNNEL_STEP_MAPPING_PRESET_QUERY } from './queryFunnelStepMappingPreset';
import { NexoyaFunnelStepMappingInput } from '../../types';

const CREATE_FUNNEL_STEP_MAPPING_PRESET_QUERY = gql`
  mutation CreateFunnelStepMappingPreset($teamId: Float!, $name: String!, $mapping: FunnelStepMappingInput!) {
    createFunnelStepMappingPreset(teamId: $teamId, name: $name, mapping: $mapping) {
      name
    }
  }
`;

type CreateFunnelStepMappingPresetProps = {
  teamId: number;
  name: string;
  mapping: NexoyaFunnelStepMappingInput;
};

export function useSaveFunnelStepMappingPreset({ portfolioId }: { portfolioId: number }) {
  const { teamId } = useTeam();

  return useMutation<
    {
      createFunnelStepMappingPreset: {
        name: string;
        funnelStepMappingPresetId: number;
      };
    },
    CreateFunnelStepMappingPresetProps
  >(CREATE_FUNNEL_STEP_MAPPING_PRESET_QUERY, {
    awaitRefetchQueries: true,
    onError: (error) => {
      console.error(error);
      toast.error(error.message);
    },
    onCompleted: (data) => {
      toast.success(`Preset ${data.createFunnelStepMappingPreset.name} saved successfully`);
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
