import React from 'react';
import { useTeam } from 'context/TeamProvider';
import useUserStore from 'store/user';
import { TEAM_FEATURE_FLAGS_QUERY, useTeamFeatureFlagsQuery } from 'graphql/team/queryTeamFeatureFlags';
import { useUpdateTeamFeatureFlagMutation } from 'graphql/team/mutationUpdateTeamFeatureFlag';
import LoadingPlaceholder from 'components/LoadingPlaceholder';
import ErrorMessage from 'components/ErrorMessage';
import Typography from 'components/Typography';
import Checkbox from 'components/Checkbox';
import Divider from 'components/Divider';
import { toast } from 'sonner';
import styled from 'styled-components';

import { nexyColors } from '../../theme';
import { NexoyaTeamFeatureFlagName } from '../../types';

const FeatureFlagsContainer = styled.div`
  background: white;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  padding: 24px;
  margin: 16px 0;
`;

const getFeatureFlagName = (name: NexoyaTeamFeatureFlagName) => {
  switch (name) {
    case NexoyaTeamFeatureFlagName.BudgetV1:
      return 'Budget V1';
    case NexoyaTeamFeatureFlagName.DetailedReportV1:
      return 'What-if validation';
    case NexoyaTeamFeatureFlagName.NexoyaDemo:
      return 'Demo team';
    case NexoyaTeamFeatureFlagName.ExperimentalChatbot:
      return 'Experimental Chatbot';
    case NexoyaTeamFeatureFlagName.GoogleAdsCampaignManagement:
      return 'Google Ads Campaign Management';
    case NexoyaTeamFeatureFlagName.KpiAllHistoricData:
      return 'KPI All Historic Data';
    case NexoyaTeamFeatureFlagName.OptimizationRescaleBaselinePrediction:
      return 'Optimization Rescale Baseline Prediction';
    case NexoyaTeamFeatureFlagName.PortfolioDashboardDisabled:
      return 'Portfolio Dashboard Disabled';
    case NexoyaTeamFeatureFlagName.Simulations:
      return 'Simulations';
    case NexoyaTeamFeatureFlagName.AttributionModel:
      return 'Attributions';
  }
};

export const FeatureFlagsManager = () => {
  const { teamId } = useTeam();
  const { isSupportUser } = useUserStore();
  const { data, loading, error } = useTeamFeatureFlagsQuery();
  const [updateTeamFeatureFlag, { loading: updating }] = useUpdateTeamFeatureFlagMutation({
    onCompleted: () => {
      toast.success('Feature flag updated successfully');
    },
    onError: (error) => {
      console.error('Error updating feature flag:', error);
      toast.error('Failed to update feature flag');
    },
  });

  const featureFlags = data?.teamFeatureFlags || [];

  const handleToggleFeatureFlag = async (flagName: string, currentStatus: boolean) => {
    try {
      await updateTeamFeatureFlag({
        variables: {
          team_id: teamId,
          name: flagName,
          status: !currentStatus,
        },
        refetchQueries: [
          {
            query: TEAM_FEATURE_FLAGS_QUERY,
            variables: {
              team_id: teamId,
            },
            fetchPolicy: 'network-only',
          },
        ],
      });
    } catch (err) {
      console.error('Error toggling feature flag:', err);
    }
  };

  // Only show this to support users
  if (!isSupportUser) {
    return (
      <div style={{ padding: '24px 0' }}>
        <Typography variant="h3">Access Denied</Typography>
        <Typography style={{ marginTop: '8px', color: nexyColors.blueyGrey }}>
          Only users with support role can view feature flags.
        </Typography>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ padding: '24px 0' }}>
        <LoadingPlaceholder />
        <LoadingPlaceholder />
        <LoadingPlaceholder />
      </div>
    );
  }

  if (error) {
    return <ErrorMessage error={error} />;
  }

  const totalCount = featureFlags.length;

  return (
    <div style={{ padding: '24px 0' }}>
      <div className="mb-4 rounded-md border border-neutral-100 bg-neutral-50 p-4">
        <Typography>
          Toggle feature flags to enable or disable features for your team. Changes take effect immediately.
        </Typography>
      </div>

      <FeatureFlagsContainer>
        {featureFlags.length === 0 ? (
          <div style={{ color: nexyColors.blueyGrey, padding: '40px 0', textAlign: 'center' }}>
            <Typography>No feature flags configured for this team.</Typography>
          </div>
        ) : (
          <>
            <Typography variant="h4" style={{ marginBottom: '16px' }}>
              Available Feature Flags ({totalCount})
            </Typography>
            <div className="flex flex-col items-start justify-start">
              {featureFlags.map((flag, index) => (
                <React.Fragment key={flag.name}>
                  <div className="w-full">
                    <Checkbox
                      checked={flag.status}
                      disabled={updating}
                      onChange={() => handleToggleFeatureFlag(flag.name, flag.status)}
                      value={flag.name}
                      name="featureFlag"
                      label={getFeatureFlagName(flag.name)}
                    />
                    {index < featureFlags.length - 1 && <Divider className="!m-1" />}
                  </div>
                </React.Fragment>
              ))}
            </div>
          </>
        )}
      </FeatureFlagsContainer>
    </div>
  );
};
