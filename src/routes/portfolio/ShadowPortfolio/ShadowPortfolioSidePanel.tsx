import React, { useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router';
import Button from '../../../components/Button';
import ButtonAsync from '../../../components/ButtonAsync';
import SidePanel, { SidePanelActions } from '../../../components/SidePanel';
import VerticalStepper from '../../../components/VerticalStepper';
import useStepper from '../../../components/Stepper/useStepper';
import { SHADOW_PORTFOLIO_STEPS } from '../../../configs/shadowPortfolio';
import { useTeam } from '../../../context/TeamProvider';
import { useCreateShadowPortfolioMutation } from '../../../graphql/portfolio/mutationCreateShadowPortfolio';
import { useAutoGenerateContentRulesMutation } from '../../../graphql/portfolioRules/mutationAutoGenerateContentRules';
import { useAutoGenerateImpactGroupRulesMutation } from '../../../graphql/portfolioRules/mutationAutoGenerateImpactGroupRules';
import { usePortfolio } from '../../../context/PortfolioProvider';
import { buildPortfolioPath } from '../../../routes/paths';
import SvgCheckCircle from '../../../components/icons/CheckCircle';
import SvgWarningTwo from '../../../components/icons/WarningTwo';
import { Copy, ExternalLink, RefreshCcw, SlidersHorizontal } from 'lucide-react';
import { PortfolioRuleCard } from '../Settings/PortfolioRuleCard';
import { NexoyaContentRule, NexoyaImpactGroupRule } from '../../../types';
import NoDataFound from '../NoDataFound';
import useFunnelStepsStore from '../../../store/funnel-steps';
import { PORTFOLIOS_QUERY } from '../../../graphql/portfolio/queryPortfolios';
import { useLazyQuery } from '@apollo/client';
import { toast } from 'sonner';

function SidePanelHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="border-b border-neutral-100 px-8 pb-4 pt-8">
      <h3 className="text-xl font-medium leading-tight text-neutral-900">{title}</h3>
      {subtitle && <div className="mt-1 text-sm font-normal leading-snug text-neutral-500">{subtitle}</div>}
    </div>
  );
}

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const stepTitles = ['Create Shadow Portfolio', 'Auto-Generate Rules', 'Review Generated Rules'];
const stepSubtitles = [
  (portfolioTitle: string) => `Create a copy of ${portfolioTitle} to experiment with auto-generated rules.`,
  () => 'Automatically generate content rules and impact group rules based on your portfolio structure.',
  () => 'Review the auto-generated rules',
];

const ShadowPortfolioSidePanel = ({ isOpen, onClose }: Props) => {
  const match = useRouteMatch();
  const history = useHistory();
  const { teamId } = useTeam();
  const portfolioId = parseInt(match.params.portfolioID, 10);
  const { portfolioV2Info } = usePortfolio();
  const portfolio = portfolioV2Info?.meta?.data;

  const { funnelSteps } = useFunnelStepsStore();

  const [shadowPortfolioId, setShadowPortfolioId] = useState<number | null>(null);
  const [autoGenerationResults, setAutoGenerationResults] = useState<{
    contentRules: NexoyaContentRule[];
    impactGroupRules: NexoyaImpactGroupRule[];
  } | null>(null);
  const [isRulesGenerated, setIsRulesGenerated] = useState(false);
  const [fetchPortfolios] = useLazyQuery(PORTFOLIOS_QUERY);

  const { step, nextStep, previousStep, setStep } = useStepper({ initialValue: 1, end: 4 });

  const [createShadowPortfolio, { loading: loadingCreateShadow }] = useCreateShadowPortfolioMutation({
    onCompleted: (data) => {
      if (data?.createShadowPortfolio) {
        setShadowPortfolioId(data.createShadowPortfolio.portfolioId);
        nextStep();
      }
    },
  });

  const [autoGenerateContentRules, { loading: loadingContentRules }] = useAutoGenerateContentRulesMutation({
    portfolioId: shadowPortfolioId || portfolioId,
    onCompleted: (data) => {
      if (data?.autoGenerateContentRules) {
        setAutoGenerationResults((prev) => ({
          ...prev,
          contentRules: data.autoGenerateContentRules,
        }));
      }
    },
  });

  const [autoGenerateImpactGroupRules, { loading: loadingImpactGroupRules }] = useAutoGenerateImpactGroupRulesMutation({
    portfolioId: shadowPortfolioId || portfolioId,
    onCompleted: (data) => {
      if (data?.autoGenerateImpactGroupRules) {
        setAutoGenerationResults((prev) => ({
          ...prev,
          contentRules: prev?.contentRules || [],
          impactGroupRules: data.autoGenerateImpactGroupRules,
        }));
        setIsRulesGenerated(true);
        nextStep();
      }
    },
  });

  const handleCreateShadowPortfolio = async () => {
    try {
      const shadowPortfolioAlreadyExists =
        (
          await fetchPortfolios({
            variables: {
              teamId,
              where: {
                search: `${portfolio?.title} (shadow copy)`,
              },
            },
          })
        ).data?.portfolios?.edges?.length > 0;

      if (shadowPortfolioAlreadyExists) {
        toast.error('A shadow portfolio already exists for this portfolio.');
        return;
      }

      await createShadowPortfolio({
        variables: {
          portfolioId,
          teamId,
        },
      });
    } catch (error) {
      console.error('Failed to create shadow portfolio:', error);
    }
  };

  const handleAutoGenerateRules = async () => {
    const targetPortfolioId = shadowPortfolioId || portfolioId;
    try {
      await autoGenerateContentRules({
        variables: {
          portfolioId: targetPortfolioId,
          teamId,
        },
      });
      await autoGenerateImpactGroupRules({
        variables: {
          portfolioId: targetPortfolioId,
          teamId,
        },
      });
    } catch (error) {
      console.error('Failed to auto-generate rules:', error);
    }
  };

  const handleNavigateToShadowPortfolio = () => {
    if (shadowPortfolioId) {
      window.open(buildPortfolioPath(shadowPortfolioId), '_blank');
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="min-h-[80vh] max-w-2xl font-normal">
            <div className="mb-6 mt-2">
              <div className="rounded border border-neutral-100 bg-gray-50 px-4 py-3 text-sm text-gray-700">
                A shadow portfolio is an exact copy of your current portfolio where you can safely experiment with
                auto-generated rules without affecting the original portfolio.
              </div>
            </div>
            <div className="mb-4">
              <div className="flex items-start gap-3 rounded border border-neutral-100 bg-white px-4 py-3">
                <Copy className="mt-1 h-5 w-5 text-gray-400" />
                <div>
                  <div className="mb-1 font-medium text-gray-800">What will be copied:</div>
                  <ul className="ml-5 list-disc text-sm text-gray-700">
                    <li>All portfolio settings and configuration</li>
                    <li>All settings found in the portfolio</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded border border-neutral-100 px-4 py-3">
              <SvgWarningTwo
                className="mt-1 h-8 w-8 text-yellow-400"
                warningCircleColor="#FEF3C7"
                warningColor="#F59E0F"
              />
              <div>
                <div className="mb-1 font-medium text-neutral-700">Safe Experimentation</div>
                <div className="text-sm text-neutral-800">
                  The shadow portfolio is completely separate from your original portfolio. You can experiment freely
                  without any risk to your production data.
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="min-h-[80vh] max-w-2xl">
            <div className="mb-4 rounded border border-neutral-100 bg-gray-50 px-4 py-3 text-sm font-normal text-gray-700">
              Our algorithm will analyze your portfolio content and automatically generate optimal rules based on your
              content structure.
            </div>
            {shadowPortfolioId && (
              <div className="mb-4 flex items-center justify-between gap-3 rounded border border-neutral-100 bg-white px-4 py-3">
                <div className="flex items-center gap-3">
                  <SvgCheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <div className="font-normal text-gray-800">Shadow Portfolio Created</div>
                  </div>
                </div>
                <Button
                  onClick={handleNavigateToShadowPortfolio}
                  color="secondary"
                  variant="outlined"
                  size="small"
                  endAdornment={<ExternalLink className="ml-1 h-3.5 w-3.5" />}
                >
                  Open
                </Button>
              </div>
            )}

            <div className="flex items-start gap-3 rounded border border-neutral-100 bg-white px-4 py-3">
              <RefreshCcw className="mt-1 h-3.5 w-3.5 text-gray-400" />
              <div>
                <div className="mb-1 font-medium text-gray-800">Auto-generation will create rules based on:</div>
                <ul className="ml-5 list-disc text-sm font-normal text-gray-700">
                  <li>Channels</li>
                  <li>Ad account structure</li>
                  <li>Content patterns</li>
                  <li>Existing metric mappings</li>
                </ul>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div>
            {isRulesGenerated &&
              autoGenerationResults?.contentRules &&
              autoGenerationResults.contentRules.length > 0 && (
                <div className="mb-4 flex items-center gap-3 rounded border border-neutral-100 bg-white px-4 py-3">
                  <SvgCheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <div className="font-medium text-gray-800">Rules Generated Successfully</div>
                    <div className="text-sm text-gray-700">
                      Content rules and impact group rules have been auto-generated for your shadow portfolio.
                    </div>
                  </div>
                </div>
              )}

            <div className="space-y-8">
              {autoGenerationResults?.contentRules && autoGenerationResults.contentRules.length > 0 ? (
                <div>
                  <h4 className="mb-2 mt-8 text-lg font-medium text-gray-800">Content Rules</h4>
                  <div className="space-y-2">
                    {autoGenerationResults.contentRules.map((rule) => (
                      <PortfolioRuleCard
                        readonly
                        key={rule.contentRuleId}
                        rule={rule}
                        ruleId={rule.contentRuleId}
                        handleEditRule={() => handleNavigateToShadowPortfolio()}
                        handleDeleteRule={() => {}}
                        handleDuplicateRule={() => {}}
                        funnelSteps={funnelSteps}
                        contentActions={[]}
                        setContentActions={() => {}}
                        resetContentActions={() => {}}
                        loadingDelete={false}
                        config={{
                          ruleType: 'content-rule',
                          update: { mutation: () => Promise.resolve(), loading: false },
                        }}
                        contentMetricAssignment={{
                          rule: rule,
                          isOpen: false,
                          close: () => {},
                          open: () => handleNavigateToShadowPortfolio(),
                        }}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <NoDataFound
                  icon={
                    <div className="rounded-full bg-[#E6F9F0] p-2">
                      <SlidersHorizontal className="!size-6 text-[#0EC76A]" />
                    </div>
                  }
                  title="No rules generated"
                  subtitle="There are no auto-generated content rules in your shadow portfolio, probably because the portfolio is empty or has no content."
                />
              )}

              {autoGenerationResults?.impactGroupRules && autoGenerationResults.impactGroupRules.length > 0 && (
                <div>
                  <h4 className="mb-2 text-lg font-medium text-gray-800">Impact Group Rules</h4>
                  <div className="space-y-2">
                    {autoGenerationResults.impactGroupRules.map((rule) => (
                      <PortfolioRuleCard
                        readonly
                        key={rule.impactGroupRuleId}
                        rule={rule}
                        ruleId={rule.impactGroupRuleId}
                        handleEditRule={() => handleNavigateToShadowPortfolio()}
                        handleDeleteRule={() => {}}
                        handleDuplicateRule={() => {}}
                        funnelSteps={funnelSteps}
                        contentActions={[]}
                        setContentActions={() => {}}
                        resetContentActions={() => {}}
                        loadingDelete={false}
                        config={{
                          ruleType: 'impact-group-rule',
                          update: { mutation: () => Promise.resolve(), loading: false },
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderStepActions = () => {
    switch (step) {
      case 1:
        return (
          <>
            <Button onClick={onClose} color="secondary" variant="contained">
              Cancel
            </Button>
            <ButtonAsync
              onClick={handleCreateShadowPortfolio}
              loading={loadingCreateShadow}
              color="primary"
              variant="contained"
              disabled={loadingCreateShadow}
            >
              {loadingCreateShadow ? 'Creating...' : 'Create Shadow Portfolio'}
            </ButtonAsync>
          </>
        );
      case 2:
        return (
          <>
            <Button onClick={onClose} color="secondary" variant="contained">
              Cancel
            </Button>
            <ButtonAsync
              onClick={handleAutoGenerateRules}
              loading={loadingContentRules || loadingImpactGroupRules}
              color="primary"
              variant="contained"
              disabled={!shadowPortfolioId || loadingContentRules || loadingImpactGroupRules}
            >
              {loadingContentRules || loadingImpactGroupRules ? 'Generating...' : 'Auto-Generate Rules'}
            </ButtonAsync>
          </>
        );
      case 3:
        return (
          <>
            <Button onClick={previousStep} color="secondary" variant="contained">
              Back
            </Button>
            <Button
              onClick={() => history.push(`/portfolios/${shadowPortfolioId}`)}
              disabled={autoGenerationResults?.contentRules?.length === 0}
              color="primary"
              variant="contained"
            >
              Continue to portfolio
            </Button>
          </>
        );
      default:
        return null;
    }
  };

  // --- Layout ---
  return (
    <SidePanel
      isOpen={isOpen}
      onClose={onClose}
      paperProps={{ style: { width: 'calc(100% - 218px)', paddingBottom: '78px', overflow: 'hidden' } }}
    >
      <SidePanelHeader title={stepTitles[step - 1]} subtitle={stepSubtitles[step - 1](portfolio?.title || '')} />
      <div className="flex h-full w-full pb-20">
        {/* Stepper column with padding and vertical divider */}
        <div className="flex w-[340px] flex-col items-center border-r border-neutral-100 bg-gray-50 px-0 py-8 pr-0">
          <div className="flex w-full flex-col items-center pr-0">
            <div className="flex w-full flex-row">
              {/* Stepper wrapper to force text wrapping */}
              <div className="max-w-[260px] flex-1 py-2 pl-8 pr-6">
                <VerticalStepper
                  className="max-w-xs"
                  current={step}
                  steps={SHADOW_PORTFOLIO_STEPS}
                  onStepClick={(index) => {
                    if (
                      index <= step ||
                      (index === 2 && shadowPortfolioId) ||
                      (index === 3 && isRulesGenerated) ||
                      index === 4
                    ) {
                      setStep(index);
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        {/* Content area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Consistent header for every step */}
          <div className="flex-1 overflow-y-auto bg-white p-8">{renderStepContent()}</div>
        </div>
      </div>
      <SidePanelActions className="border-t border-neutral-100">{renderStepActions()}</SidePanelActions>
    </SidePanel>
  );
};

export default ShadowPortfolioSidePanel;
