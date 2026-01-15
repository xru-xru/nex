import { useState } from 'react';

import DOMPurify from 'dompurify';
import { toast } from 'sonner';

import { NexoyaImpactGroup, NexoyaPortfolioV2 } from '../types';

import { useTeam } from '../context/TeamProvider';
import { useCreateOrUpdatePortfolioImpactGroupMutation } from '../graphql/impactGroups/mutationCreateOrUpdateImpactGroup';
import { useDeletePortfolioImpactGroupMutation } from '../graphql/impactGroups/mutationDeleteImpactGroup';

import { ExtendedImpactGroup } from '../routes/portfolio/components/ImpactGroups/ImpactGroupsEditTable';

const CONSTRAINT_ERROR_MESSAGE_INCLUDES = 'constraint fails';
const AT_LEAST_ONE_FUNNEL_ERROR_MESSAGE_INCLUDES = 'must contain at least';

interface Props {
  portfolioMeta: NexoyaPortfolioV2;
  initialImpactGroups: NexoyaImpactGroup[];
}

export const useImpactGroups = ({ portfolioMeta, initialImpactGroups }: Props) => {
  const { teamId } = useTeam();
  const portfolioId = portfolioMeta?.portfolioId;
  const [impactGroups, setImpactGroups] = useState<Partial<ExtendedImpactGroup>[]>(initialImpactGroups);

  const [deletePortfolioImpactGroup, { loading: loadingDelete }] = useDeletePortfolioImpactGroupMutation({
    portfolioId,
    impactGroupId: null,
  });

  const [updatePortfolioImpactGroup, { loading: loadingUpdate }] = useCreateOrUpdatePortfolioImpactGroupMutation({
    portfolioId,
    name: null,
    impactGroupId: null,
    funnelStepIds: null,
  });

  const handleEdit = (impactGroup: ExtendedImpactGroup) => {
    updatePortfolioImpactGroup({
      variables: {
        name: DOMPurify.sanitize(impactGroup.name, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }),
        impactGroupId: impactGroup.impactGroupId < 0 ? null : impactGroup.impactGroupId,
        funnelStepIds: impactGroup.funnelSteps.map((fs) => fs.funnel_step_id),
        portfolioId,
        teamId,
      },
    }).then(() => {
      setImpactGroups((prevState) => {
        return prevState.map((igState) => {
          if (igState.impactGroupId === impactGroup.impactGroupId) {
            return { ...igState, isEditing: !igState.isEditing };
          }
          return igState;
        });
      });
    });
  };

  const handleDelete = (impactGroupId: number) => {
    if (impactGroupId < 0) {
      setImpactGroups((prevState) => {
        return prevState.filter((igState) => igState.impactGroupId !== impactGroupId);
      });
      return;
    }

    deletePortfolioImpactGroup({
      variables: {
        impactGroupId,
        portfolioId,
        teamId,
      },
    })
      .then(() => {
        setImpactGroups((prevState) => {
          return prevState.filter((igState) => igState.impactGroupId !== impactGroupId);
        });
      })
      .catch((error) => {
        if (error.message.includes(CONSTRAINT_ERROR_MESSAGE_INCLUDES)) {
          toast.error('The impact group is currently linked to content and cannot be removed');
        } else {
          toast.error(error.message);
        }
      });
  };

  const handleEditImpactGroupFunnelSteps = (impactGroup: ExtendedImpactGroup, funnelStepId: number) => {
    const isStepIdIncluded = impactGroup.funnelSteps.some((fs) => fs.funnel_step_id === funnelStepId);
    const newFunnelSteps = isStepIdIncluded
      ? impactGroup.funnelSteps.filter((fs) => fs.funnel_step_id !== funnelStepId)
      : [...impactGroup.funnelSteps, { funnel_step_id: funnelStepId }];

    updatePortfolioImpactGroup({
      variables: {
        name: impactGroup.name,
        impactGroupId: impactGroup.impactGroupId < 0 ? null : impactGroup.impactGroupId,
        funnelStepIds: newFunnelSteps.map((fs) => fs.funnel_step_id),
        portfolioId,
        teamId,
      },
    })
      .then((res) => {
        const createdOrExistingImpactGroup = res.data?.createOrUpdatePortfolioImpactGroup;
        // @ts-ignore
        setImpactGroups((prevState: ExtendedImpactGroup[]) => {
          return prevState.map((prevIgState) => {
            if (prevIgState.impactGroupId === impactGroup.impactGroupId) {
              const isStepIdIncluded = prevIgState.funnelSteps.some((fs) => fs.funnel_step_id === funnelStepId);
              const newFunnelSteps = isStepIdIncluded
                ? prevIgState.funnelSteps.filter((fs) => fs.funnel_step_id !== funnelStepId)
                : [...prevIgState.funnelSteps, { funnel_step_id: funnelStepId }];

              return { ...prevIgState, ...createdOrExistingImpactGroup, funnelSteps: newFunnelSteps };
            }
            return prevIgState;
          });
        });
      })
      .catch((error) => {
        if (error.message.includes(AT_LEAST_ONE_FUNNEL_ERROR_MESSAGE_INCLUDES)) {
          toast.error('The impact group must contain at least 1 funnel step');
        } else {
          toast.error(error.message);
        }
      });
  };

  return {
    impactGroups,
    setImpactGroups,
    handleEdit,
    handleEditImpactGroupFunnelSteps,
    handleDelete,
    loadingDelete,
    loadingUpdate,
  };
};
