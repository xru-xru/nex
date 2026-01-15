import { SlidersHorizontal } from 'lucide-react';
import React from 'react';

import { FastAverageColor } from 'fast-average-color';
import { StringParam, useQueryParam } from 'use-query-params';

import { NexoyaProvider } from '../../../../../types';

import { useLabels } from '../../../../../context/LabelsProvider';
import { usePortfolio } from '../../../../../context/PortfolioProvider';
import { useProviders } from '../../../../../context/ProvidersProvider';

import { track } from '../../../../../constants/datadog';
import { EVENT } from '../../../../../constants/events';
import translate from 'utils/translate';
import AvatarProvider from '../../../../../components/AvatarProvider';
import Checkbox from '../../../../../components/Checkbox';
import NameTranslation from '../../../../../components/NameTranslation';
import Typography from '../../../../../components/Typography';
import SvgSlidersHRegular from '../../../../../components/icons/SlidersHRegular';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '../../../../../components-ui/DropdownMenu';
import { ButtonStyled, NameStyled } from '../PerformanceChartHeader.styles';
import { useRouteMatch } from 'react-router';
import { useLabelsQuery } from '../../../../../graphql/labels/queryLabels';
import { useImpactGroups } from '../../../../../context/ImpactGroupsProvider';
import { useImpactGroupsQuery } from '../../../../../graphql/impactGroups/queryImpactGroups';
import { useContentRulesStore } from '../../../../../store/content-rules';
import { useImpactGroupRulesStore } from '../../../../../store/impact-group-rules';
import { useAttributionRulesStore } from '../../../../../store/attribution-rules';
import { cn } from '../../../../../lib/utils';
import useTranslationStore from '../../../../../store/translations';

interface Props {
  disabled: boolean;
  activeProviderIds: number[];
  shouldRenderLabelsFilter?: boolean;
  shouldRenderProvidersFilter?: boolean;
  shouldRenderImpactGroupsFilter?: boolean;
  shouldRenderContentRulesFilter?: boolean;
  shouldRenderImpactGroupRulesFilter?: boolean;
  shouldRenderAttributionRulesFilter?: boolean;
}

function PortfolioFilter({
  disabled,
  activeProviderIds,
  shouldRenderLabelsFilter,
  shouldRenderProvidersFilter,
  shouldRenderImpactGroupsFilter,
  shouldRenderContentRulesFilter,
  shouldRenderImpactGroupRulesFilter,
  shouldRenderAttributionRulesFilter,
}: Props) {
  const [activeTab] = useQueryParam('activeTab', StringParam);

  const match = useRouteMatch();
  const portfolioId = parseInt(match.params.portfolioID, 10);

  const { providerById } = useProviders();
  const {
    providers: { providersFilter, handleRemoveProvider, handleAddProvider, handleResetProvideFilterState },
  } = usePortfolio();

  const {
    labelById,
    filter: { labelsFilter, handleAddLabel, handleRemoveLabel, handleResetLabelFilterState },
  } = useLabels();

  const {
    filter: { impactGroupsFilter, handleAddImpactGroup, handleRemoveImpactGroup, handleResetImpactGroupFilterState },
  } = useImpactGroups();

  const {
    contentRules,
    filter: {
      contentRulesFilter,
      addRule: handleAddContentRule,
      removeRule: handleRemoveContentRule,
      reset: resetContentRulesFilter,
    },
  } = useContentRulesStore();

  const {
    impactGroupRules,
    filter: {
      impactGroupRulesFilter,
      addRule: handleAddImpactGroupRule,
      removeRule: handleRemoveImpactGroupRule,
      reset: resetImpactGroupRulesFilter,
    },
  } = useImpactGroupRulesStore();

  const {
    attributionRules,
    filter: {
      attributionRulesFilter,
      addRule: handleAddAttributionRule,
      removeRule: handleRemoveAttributionRule,
      reset: resetAttributionRulesFilter,
    },
  } = useAttributionRulesStore();

  const { data: labelsData } = useLabelsQuery({ portfolioId });
  const { data: impactGroupsData } = useImpactGroupsQuery({ portfolioId });

  const { translations } = useTranslationStore();

  const labelIds = labelsData?.portfolioV2?.labels?.map((label) => label.labelId) || [];
  const impactGroups = impactGroupsData?.portfolioV2?.impactGroups || [];

  const getColorForProvider = async (provider: NexoyaProvider) => {
    const fac = new FastAverageColor();
    const color = await fac.getColorAsync(provider.logo, {
      algorithm: 'dominant',
      ignoredColor: [
        [255, 255, 255, 255], // white
        [0, 0, 0, 0], // black
      ],
    });
    return color.hex;
  };

  const resetAllFilters = (except: string) => {
    if (except !== 'providers' && providersFilter.length) {
      handleResetProvideFilterState();
    }
    if (except !== 'labels' && labelsFilter.length) {
      handleResetLabelFilterState();
    }
    if (except !== 'impactGroups' && impactGroupsFilter.length) {
      handleResetImpactGroupFilterState();
    }
    if (except !== 'contentRules' && contentRulesFilter?.length) {
      resetContentRulesFilter();
    }
    if (except !== 'attributionRules' && attributionRulesFilter?.length) {
      resetAttributionRulesFilter();
    }
    if (except !== 'impactGroupRules' && impactGroupRulesFilter?.length) {
      resetImpactGroupRulesFilter();
    }
  };

  return (
    <>
      <DropdownMenu>
        {shouldRenderProvidersFilter && (
          <DropdownMenuTrigger disabled={disabled} asChild>
            <ButtonStyled disabled={disabled} variant="contained" color="secondary">
              <SvgSlidersHRegular />
              <span style={{ marginLeft: 5 }}>Filter</span>
            </ButtonStyled>
          </DropdownMenuTrigger>
        )}
        <DropdownMenuContent
          className={cn(shouldRenderImpactGroupRulesFilter ? 'w-72' : 'w-60', 'font-normal')}
          align="start"
        >
          <DropdownMenuSub>
            <DropdownMenuSubTrigger disabled={!activeProviderIds?.length}>
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              <span>Filter by channels</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                {activeProviderIds?.map((providerId) => {
                  const fullProviderObj = providerById(Number(providerId));
                  const isActive = providersFilter.some((f) => f.provider_id === providerId);
                  return (
                    <DropdownMenuItem
                      key={providerId}
                      onSelect={async (e) => {
                        e.preventDefault();

                        const providerWithColor = {
                          ...fullProviderObj,
                          providerLogoColor: await getColorForProvider(fullProviderObj),
                        };
                        if (isActive) {
                          handleRemoveProvider(providerWithColor);
                        } else {
                          resetAllFilters('providers');
                          handleAddProvider(providerWithColor);
                        }
                        track(EVENT.PORTFOLIO_FILTER, {
                          tab: activeTab,
                          providers: [],
                          labels: labelsFilter.map((label) => label.name),
                        });
                      }}
                    >
                      <AvatarProvider providerId={providerId} size={15} color="dark" />
                      <NameStyled>
                        <NameTranslation text={fullProviderObj?.name} data-cy={fullProviderObj?.name} />
                      </NameStyled>
                      <Checkbox style={{ padding: 4 }} checked={isActive} name="check" color="dark" />
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          {shouldRenderLabelsFilter && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuSub>
                <DropdownMenuSubTrigger disabled={!labelIds?.length}>
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  <span>Filter by labels</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    {labelIds?.map((labelId) => {
                      const label = labelById(labelId);
                      const isActive = labelsFilter?.some((f) => f.labelId === label.labelId);
                      return (
                        <DropdownMenuItem
                          className="flex w-full justify-between"
                          key={label.labelId}
                          onClick={(e) => {
                            e.preventDefault();
                            track(EVENT.PORTFOLIO_FILTER, {
                              tab: activeTab,
                              providers: providersFilter.map((provider) => translate(translations, provider.name)),
                              labels: [],
                            });
                            if (isActive) {
                              handleRemoveLabel(label);
                            } else {
                              resetAllFilters('labels');
                              handleAddLabel(label);
                            }
                          }}
                        >
                          <NameStyled>
                            <Typography>{label?.name}</Typography>
                          </NameStyled>
                          <Checkbox style={{ padding: 4 }} checked={isActive} name="check" color="dark" />
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            </>
          )}
          {shouldRenderImpactGroupsFilter && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuSub>
                <DropdownMenuSubTrigger disabled={!impactGroups?.length}>
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  <span>Filter by impact groups</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    {impactGroups?.map((impactGroup) => {
                      const isActive = impactGroupsFilter?.some((f) => f.impactGroupId === impactGroup.impactGroupId);
                      return (
                        <DropdownMenuItem
                          className="flex w-full justify-between"
                          key={impactGroup.impactGroupId}
                          onClick={(e) => {
                            e.preventDefault();
                            track(EVENT.PORTFOLIO_FILTER, {
                              tab: activeTab,
                              providers: providersFilter.map((provider) => translate(translations, provider.name)),
                              labels: labelsFilter.map((label) => label.name),
                              impactGroups: [],
                            });
                            if (isActive) {
                              handleRemoveImpactGroup(impactGroup);
                            } else {
                              resetAllFilters('impactGroups');
                              handleAddImpactGroup(impactGroup);
                            }
                          }}
                        >
                          <NameStyled>
                            <Typography>{impactGroup?.name}</Typography>
                          </NameStyled>
                          <Checkbox style={{ padding: 4 }} checked={isActive} name="check" color="dark" />
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            </>
          )}
          {shouldRenderContentRulesFilter && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuSub>
                <DropdownMenuSubTrigger disabled={!contentRules?.length}>
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  <span>Filter by content rules</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    {contentRules?.map((contentRule) => {
                      const isActive = contentRulesFilter?.some((cr) => cr.contentRuleId === contentRule.contentRuleId);
                      return (
                        <DropdownMenuItem
                          className="flex w-full justify-between"
                          key={contentRule.contentRuleId}
                          onClick={(e) => {
                            e.preventDefault();

                            if (isActive) {
                              handleRemoveContentRule(contentRule);
                            } else {
                              resetAllFilters('contentRules');
                              handleAddContentRule(contentRule);
                            }
                          }}
                        >
                          <NameStyled>
                            <Typography>{contentRule?.name}</Typography>
                          </NameStyled>
                          <Checkbox style={{ padding: 4 }} checked={isActive} name="check" color="dark" />
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            </>
          )}
          {shouldRenderAttributionRulesFilter && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuSub>
                <DropdownMenuSubTrigger disabled={!attributionRules?.length}>
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  <span>Filter by attribution rules</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    {attributionRules?.map((attributionRule) => {
                      const isActive = attributionRulesFilter?.some(
                        (cr) => cr.attributionRuleId === attributionRule.attributionRuleId,
                      );
                      return (
                        <DropdownMenuItem
                          className="flex w-full justify-between"
                          key={attributionRule.attributionRuleId}
                          onClick={(e) => {
                            e.preventDefault();

                            if (isActive) {
                              handleRemoveAttributionRule(attributionRule);
                            } else {
                              resetAllFilters('attributionRules');
                              handleAddAttributionRule(attributionRule);
                            }
                          }}
                        >
                          <NameStyled>
                            <Typography>{attributionRule?.name}</Typography>
                          </NameStyled>
                          <Checkbox style={{ padding: 4 }} checked={isActive} name="check" color="dark" />
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            </>
          )}
          {shouldRenderImpactGroupRulesFilter && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuSub>
                <DropdownMenuSubTrigger disabled={!impactGroupRules?.length}>
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  <span>Filter by impact group rules</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    {impactGroupRules?.map((impactGroupRule) => {
                      const isActive = impactGroupRulesFilter?.some(
                        (ir) => ir.impactGroupRuleId === impactGroupRule.impactGroupRuleId,
                      );
                      return (
                        <DropdownMenuItem
                          className="flex w-full justify-between"
                          key={impactGroupRule.impactGroupRuleId}
                          onClick={(e) => {
                            e.preventDefault();

                            if (isActive) {
                              handleRemoveImpactGroupRule(impactGroupRule);
                            } else {
                              resetAllFilters('impactGroupRules');
                              handleAddImpactGroupRule(impactGroupRule);
                            }
                          }}
                        >
                          <NameStyled>
                            <Typography>{impactGroupRule?.name}</Typography>
                          </NameStyled>
                          <Checkbox style={{ padding: 4 }} checked={isActive} name="check" color="dark" />
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

export { PortfolioFilter };
