import React, { useCallback, useState } from 'react';
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
} from '../../../components-ui/DropdownMenu';
import { ButtonStyled, NameStyled } from './PerformanceChartHeader/PerformanceChartHeader.styles';
import SvgSlidersHRegular from '../../../components/icons/SlidersHRegular';
import { SlidersHorizontal } from 'lucide-react';
import AvatarProvider from '../../../components/AvatarProvider';
import NameTranslation from '../../../components/NameTranslation';
import Checkbox from '../../../components/Checkbox';
import Typography from '../../../components/Typography';
import { useContentFilterStore } from '../../../store/content-filter';
import { useContentRulesStore } from '../../../store/content-rules';
import { useAttributionRulesStore } from '../../../store/attribution-rules';
import { useImpactGroupRulesStore } from '../../../store/impact-group-rules';
import { useLabels } from '../../../context/LabelsProvider';
import { useImpactGroups } from '../../../context/ImpactGroupsProvider';
import { useProviders } from '../../../context/ProvidersProvider';
import { NexoyaPortfolioLabel, NexoyaProvider } from '../../../types';
import TextField from '../../../components/TextField';
import Radio from '../../../components/Radio';
import PortfolioFeatureSwitch from '../../../components/PortfolioFeatureSwitch';
import { PORTFOLIO_FEATURE_FLAGS } from '../../../constants/featureFlags';
import { debounce } from 'lodash';
import { usePortfolio } from '../../../context/PortfolioProvider';
import { usePortfolioParentContentFiltersQuery } from '../../../graphql/content/queryPortfolioParentContentFilters';

export const ContentFilter = () => {
  const { contentRules } = useContentRulesStore();
  const { attributionRules } = useAttributionRulesStore();
  const { impactGroupRules } = useImpactGroupRulesStore();
  const { labels } = useLabels();
  const { impactGroups } = useImpactGroups();
  const { providerById } = useProviders();
  const {
    portfolioV2Info: {
      meta: { data: portfolioV2 },
    },
  } = usePortfolio();
  const portfolioId = portfolioV2?.portfolioId;
  const isAttributed = portfolioV2?.isAttributed || false;

  const { data: parentContentFiltersData } = usePortfolioParentContentFiltersQuery({
    portfolioId,
    skip: !portfolioId,
  });

  const {
    providersFilter,
    labelsFilter,
    impactGroupsFilter,
    contentRulesFilter,
    attributionRulesFilter,
    impactGroupRulesFilter,

    isIncludedInOptimization,
    handleSetIsIncludedInOptimization,

    isRuleManaged,
    handleSetIsRuleManaged,

    titleContains,
    handleChangeTitleContains,

    handleAddProvider,
    handleRemoveProvider,

    handleAddLabel,
    handleRemoveLabel,

    handleAddImpactGroup,
    handleRemoveImpactGroup,

    handleAddContentRule,
    handleRemoveContentRule,

    handleAddAttributionRule,
    handleRemoveAttributionRule,

    handleAddImpactGroupRule,
    handleRemoveImpactGroupRule,
  } = useContentFilterStore();

  const [searchInputValue, setSearchInputValue] = useState(titleContains || '');

  const debouncedSearch = useCallback(
    debounce((value) => {
      handleChangeTitleContains(value);
    }, 350),
    [handleChangeTitleContains],
  );

  const availableProviders = parentContentFiltersData?.portfolioParentContentFilters?.providers;

  return (
    <div className="flex flex-col items-start">
      <div className="flex gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <ButtonStyled variant="contained" color="secondary">
              <SvgSlidersHRegular />
              <span className="ml-1.5">Filter</span>
            </ButtonStyled>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-60 font-normal" align="start">
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                <span>Optimization status</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem
                    className="w-52 justify-between"
                    onClick={(e) => {
                      e.preventDefault();
                      handleSetIsIncludedInOptimization(true);
                    }}
                  >
                    Enabled
                    <Radio style={{ padding: 4 }} checked={isIncludedInOptimization === true} color="dark" />
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="w-52 justify-between"
                    onClick={(e) => {
                      e.preventDefault();
                      handleSetIsIncludedInOptimization(false);
                    }}
                  >
                    Disabled
                    <Radio style={{ padding: 4 }} checked={isIncludedInOptimization === false} color="dark" />
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                <span>Content mode</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem
                    className="w-52 justify-between"
                    onClick={(e) => {
                      e.preventDefault();
                      handleSetIsRuleManaged(false);
                    }}
                  >
                    Manual
                    <Radio style={{ padding: 4 }} checked={isRuleManaged === false} color="dark" />
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="w-52 justify-between"
                    onClick={(e) => {
                      e.preventDefault();
                      handleSetIsRuleManaged(true);
                    }}
                  >
                    Rule-based
                    <Radio style={{ padding: 4 }} checked={isRuleManaged === true} color="dark" />
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuSeparator />

            <DropdownMenuSub>
              <DropdownMenuSubTrigger disabled={!availableProviders?.length}>
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                <span>Channels</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  {availableProviders?.map((provider) => {
                    const fullProvider = providerById(provider.providerId) as NexoyaProvider;
                    const isActive = providersFilter.some((f) => f.provider_id === provider?.providerId);
                    return (
                      <DropdownMenuItem
                        key={provider?.providerId}
                        onSelect={async (e) => {
                          e.preventDefault();
                          if (isActive) {
                            handleRemoveProvider(fullProvider);
                          } else {
                            handleAddProvider(fullProvider);
                          }
                        }}
                      >
                        <AvatarProvider providerId={provider?.providerId} size={15} color="dark" />
                        <NameStyled>
                          <NameTranslation text={fullProvider?.name} />
                        </NameStyled>
                        <Checkbox style={{ padding: 4 }} checked={isActive} color="dark" />
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>

            <DropdownMenuSub>
              <DropdownMenuSubTrigger disabled={!labels?.length}>
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                <span>Labels</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  {labels?.map((label: NexoyaPortfolioLabel) => {
                    const isActive = labelsFilter?.some((f) => f.labelId === label.labelId);
                    return (
                      <DropdownMenuItem
                        className="flex w-full justify-between"
                        key={label.labelId}
                        onClick={(e) => {
                          e.preventDefault();
                          if (isActive) {
                            handleRemoveLabel(label);
                          } else {
                            handleAddLabel(label);
                          }
                        }}
                      >
                        <NameStyled>
                          <Typography>{label?.name}</Typography>
                        </NameStyled>
                        <Checkbox style={{ padding: 4 }} checked={isActive} color="dark" />
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>

            <DropdownMenuSub>
              <DropdownMenuSubTrigger disabled={!impactGroups?.length}>
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                <span>Impact groups</span>
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
                          if (isActive) {
                            handleRemoveImpactGroup(impactGroup);
                          } else {
                            handleAddImpactGroup(impactGroup);
                          }
                        }}
                      >
                        <NameStyled>
                          <Typography>{impactGroup?.name}</Typography>
                        </NameStyled>
                        <Checkbox style={{ padding: 4 }} checked={isActive} color="dark" />
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>

            <PortfolioFeatureSwitch
              features={[PORTFOLIO_FEATURE_FLAGS.SELF_SERVICE_PORTFOLIO]}
              renderOld={() => null}
              renderNew={() => (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger disabled={!contentRules?.length}>
                      <SlidersHorizontal className="mr-2 h-4 w-4" />
                      <span>Content rules</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        {contentRules?.map((rule) => {
                          const isActive = contentRulesFilter?.some((cr) => cr.contentRuleId === rule.contentRuleId);
                          return (
                            <DropdownMenuItem
                              className="flex w-full justify-between"
                              key={rule.contentRuleId}
                              onClick={(e) => {
                                e.preventDefault();
                                if (isActive) {
                                  handleRemoveContentRule(rule);
                                } else {
                                  handleAddContentRule(rule);
                                }
                              }}
                            >
                              <NameStyled>
                                <Typography>{rule?.name}</Typography>
                              </NameStyled>
                              <Checkbox style={{ padding: 4 }} checked={isActive} color="dark" />
                            </DropdownMenuItem>
                          );
                        })}
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger disabled={!impactGroupRules?.length}>
                      <SlidersHorizontal className="mr-2 h-4 w-4" />
                      <span>Impact group rules</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        {impactGroupRules?.map((rule) => {
                          const isActive = impactGroupRulesFilter?.some(
                            (ir) => ir.impactGroupRuleId === rule.impactGroupRuleId,
                          );
                          return (
                            <DropdownMenuItem
                              className="flex w-full justify-between"
                              key={rule.impactGroupRuleId}
                              onClick={(e) => {
                                e.preventDefault();
                                if (isActive) {
                                  handleRemoveImpactGroupRule(rule);
                                } else {
                                  handleAddImpactGroupRule(rule);
                                }
                              }}
                            >
                              <NameStyled>
                                <Typography>{rule?.name}</Typography>
                              </NameStyled>
                              <Checkbox style={{ padding: 4 }} checked={isActive} color="dark" />
                            </DropdownMenuItem>
                          );
                        })}
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                </>
              )}
            />

            {isAttributed ? (
              <>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger disabled={!attributionRules?.length}>
                    <SlidersHorizontal className="mr-2 h-4 w-4" />
                    <span>Attribution rules</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      {attributionRules?.map((rule) => {
                        const isActive = attributionRulesFilter?.some(
                          (cr) => cr.attributionRuleId === rule.attributionRuleId,
                        );
                        return (
                          <DropdownMenuItem
                            className="flex w-full justify-between"
                            key={rule.attributionRuleId}
                            onClick={(e) => {
                              e.preventDefault();
                              if (isActive) {
                                handleRemoveAttributionRule(rule);
                              } else {
                                handleAddAttributionRule(rule);
                              }
                            }}
                          >
                            <NameStyled>
                              <Typography>{rule?.name}</Typography>
                            </NameStyled>
                            <Checkbox style={{ padding: 4 }} checked={isActive} color="dark" />
                          </DropdownMenuItem>
                        );
                      })}
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              </>
            ) : null}
          </DropdownMenuContent>
        </DropdownMenu>

        <TextField
          style={{ width: 304 }}
          wrapProps={{ style: { padding: '6px 12px' } }}
          placeholder="Search contents..."
          value={searchInputValue}
          name="titleContains"
          id="content-search"
          labelVariant="light"
          onChange={(e) => {
            const value = e?.target?.value;
            setSearchInputValue(value);
            debouncedSearch(value);
          }}
        />
      </div>
    </div>
  );
};
