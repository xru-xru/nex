import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from 'components-ui/AlertDialog';
import Divider from '../../components/Divider';

import React from 'react';
import Checkbox from '../../components/Checkbox';
import { NexoyaFeatureFlag, NexoyaPortfolioFeatureFlag } from '../../types';
import { useMutation } from '@apollo/client';
import { UPDATE_FEATURE_FLAG_MUTATION } from '../../graphql/featureFlags/mutationUpdateFeatureFlag';
import { useTeam } from '../../context/TeamProvider';
import ButtonAsync from '../../components/ButtonAsync';
import { toast } from 'sonner';
import { useQueryParam } from 'use-query-params';
import { portfolioTabs } from '../../configs/portfolio';
import { ACTIVE_OPTIMIZATION_QUERY } from '../../graphql/optimization/queryActiveOptimization';
import { PORTFOLIO_V2_META_QUERY } from '../../graphql/portfolio/queryPortfolioMeta';
import { PORTFOLIO_FEATURE_FLAGS } from '../../constants/featureFlags';

const translateFeatureFlag = (featureFlag: string) => {
  switch (featureFlag) {
    case NexoyaPortfolioFeatureFlag.SelfServicePortfolio:
      return 'Self service portfolio';
    case NexoyaPortfolioFeatureFlag.Attribution:
      return 'Attribution insights';
    case NexoyaPortfolioFeatureFlag.WhatIfValidation:
      return 'What-if validation';
    case NexoyaPortfolioFeatureFlag.OptimizationsOnlyVisibleToSupportUsers:
      return 'Preview optimization for support users';
    case NexoyaPortfolioFeatureFlag.SimulationDataDrivenBudgetPacing:
      return 'Data-driven budget pacing';
    case NexoyaPortfolioFeatureFlag.SimulationPreviewSupport:
      return 'Preview simulation for support users';
    case NexoyaPortfolioFeatureFlag.BudgetV1:
      return 'Budget v1 (deprecated)';
    case NexoyaPortfolioFeatureFlag.IgnoreWeekdays:
      return 'Ignore weekdays';
    // @ts-ignore
    case NexoyaPortfolioFeatureFlag.IsOptimizationPredictionRescaledValue:
      return 'Rescaled optimization prediction';
    default:
      return '';
  }
};

export const PortfolioFeatureFlagsManagementDialog = ({
  open,
  toggleDialog,
  activeFeatureFlags,
  portfolioId,
}: {
  open: boolean;
  toggleDialog: () => void;
  activeFeatureFlags: NexoyaFeatureFlag[];
  portfolioId: number;
}) => {
  const [activeTab] = useQueryParam('activeTab');
  const { teamId } = useTeam();
  const [updateFeatureFlag, { loading, error }] = useMutation(UPDATE_FEATURE_FLAG_MUTATION);

  return (
    <AlertDialog onOpenChange={() => toggleDialog()} open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Manage this portfolio's feature flags</AlertDialogTitle>
        </AlertDialogHeader>
        <div className="flex flex-col items-start justify-start">
          {Object.values(PORTFOLIO_FEATURE_FLAGS).map((featureFlag, index) => {
            const checked = activeFeatureFlags.some((ff) => ff.name === featureFlag && ff.status);

            return (
              <React.Fragment key={featureFlag}>
                <div className="w-full">
                  <Checkbox
                    key={featureFlag}
                    checked={checked}
                    onChange={() => {
                      updateFeatureFlag({
                        variables: {
                          teamId,
                          portfolioId,
                          name: featureFlag,
                          status: !activeFeatureFlags.some((ff) => ff.name === featureFlag && ff.status),
                        },
                        refetchQueries: [
                          {
                            notifyOnNetworkStatusChange: true,
                            query: PORTFOLIO_V2_META_QUERY,
                            variables: {
                              teamId,
                              portfolioId,
                            },
                            fetchPolicy: 'network-only',
                          },
                          activeTab === portfolioTabs.OPTIMIZATION && {
                            notifyOnNetworkStatusChange: true,
                            query: ACTIVE_OPTIMIZATION_QUERY,
                            variables: {
                              teamId,
                              portfolioId,
                            },
                            fetchPolicy: 'network-only',
                          },
                        ],
                      }).catch(() => {
                        console.error(error);
                        toast.error('Failed to update feature flag');
                      });
                    }}
                    value={featureFlag}
                    name="optimizationType"
                    label={translateFeatureFlag(featureFlag)}
                  />

                  {index < Object.values(PORTFOLIO_FEATURE_FLAGS).length - 1 && <Divider className="!m-1" />}
                </div>
              </React.Fragment>
            );
          })}
        </div>
        <AlertDialogFooter>
          <AlertDialogAction>
            <ButtonAsync disabled={loading} loading={loading} variant="contained" color="primary">
              Done
            </ButtonAsync>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
