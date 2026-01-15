import { useLabels } from '../../../../context/LabelsProvider';
import { usePortfolio } from '../../../../context/PortfolioProvider';

import AvatarProvider from '../../../../components/AvatarProvider';
import NameTranslation from '../../../../components/NameTranslation';
import Typography from '../../../../components/Typography';
import { CancelIcon } from '../../../../components/icons';
import { Customization } from './components/Customization';
import { PortfolioFilter } from './components/PortfolioFilter';
import * as Styles from 'components/Charts/styles/PortfolioPerformanceChart';

import {
  ChipsContainerStyled,
  FilterChipStyled,
  FiltersContainerStyled,
  StyledButtonIcon,
} from './PerformanceChartHeader.styles';
import { useImpactGroups } from '../../../../context/ImpactGroupsProvider';
import {
  NexoyaAttributionRule,
  NexoyaContentRule,
  NexoyaImpactGroup,
  NexoyaImpactGroupRule,
  NexoyaPortfolioLabel,
} from '../../../../types';
import React from 'react';
import { FilterBullet } from '../../../../components/PerformanceTable/styles';
import useTeamColor from '../../../../hooks/useTeamColor';
import { useContentRulesStore } from '../../../../store/content-rules';
import { useAttributionRulesStore } from '../../../../store/attribution-rules';
import { useImpactGroupRulesStore } from '../../../../store/impact-group-rules';

type Props = {
  disabled: boolean;
  renderSwitcher: () => JSX.Element;
  activeProviderIds: number[];
  shouldRenderCustomization?: boolean;
  shouldRenderLabelsFilter?: boolean;
  shouldRenderProvidersFilter?: boolean;
  shouldRenderImpactGroupsFilter?: boolean;
  shouldRenderContentRulesFilter?: boolean;
  shouldRenderAttributionRulesFilter?: boolean;
  shouldRenderImpactGroupRulesFilter?: boolean;
  renderAdditionalComponents?: () => JSX.Element;
};

export function PerformanceHeader({
  disabled,
  renderSwitcher,
  activeProviderIds,
  shouldRenderCustomization = false,
  shouldRenderLabelsFilter = false,
  shouldRenderProvidersFilter = true,
  shouldRenderImpactGroupsFilter = false,
  shouldRenderContentRulesFilter = false,
  shouldRenderAttributionRulesFilter = false,
  shouldRenderImpactGroupRulesFilter = false,
  renderAdditionalComponents,
}: Props) {
  const {
    providers: { providersFilter, handleRemoveProvider },
  } = usePortfolio();
  const {
    filter: { labelsFilter, handleRemoveLabel },
  } = useLabels();
  const {
    filter: { impactGroupsFilter, handleRemoveImpactGroup },
  } = useImpactGroups();
  const {
    filter: { contentRulesFilter, removeRule: handleRemoveContentRule },
  } = useContentRulesStore();

  const {
    filter: { attributionRulesFilter, removeRule: handleRemoveAttributionRule },
  } = useAttributionRulesStore();

  const {
    filter: { impactGroupRulesFilter, removeRule: handleRemoveImpactGroupRule },
  } = useImpactGroupRulesStore();

  const getThemeColor = useTeamColor();

  return (
    <Styles.ChartHeader>
      <Styles.ChartHeaderContainer>
        <FiltersContainerStyled>
          {shouldRenderCustomization ? <Customization /> : null}
          <PortfolioFilter
            disabled={disabled}
            activeProviderIds={activeProviderIds}
            shouldRenderLabelsFilter={shouldRenderLabelsFilter}
            shouldRenderProvidersFilter={shouldRenderProvidersFilter}
            shouldRenderImpactGroupsFilter={shouldRenderImpactGroupsFilter}
            shouldRenderContentRulesFilter={shouldRenderContentRulesFilter}
            shouldRenderAttributionRulesFilter={shouldRenderAttributionRulesFilter}
            shouldRenderImpactGroupRulesFilter={shouldRenderImpactGroupRulesFilter}
          />
          {renderAdditionalComponents ? renderAdditionalComponents() : null}
        </FiltersContainerStyled>
        {renderSwitcher()}
      </Styles.ChartHeaderContainer>
      <ChipsContainerStyled>
        {providersFilter?.map((provider) => (
          <FilterChipStyled key={provider.provider_id}>
            <AvatarProvider variant="circle" providerId={provider.provider_id} size={15} color="dark" />
            <NameTranslation id={provider.provider_id?.toString()} text={provider.name} />
            <StyledButtonIcon onClick={() => handleRemoveProvider(provider)}>
              <CancelIcon style={{ height: 10 }} />
            </StyledButtonIcon>
          </FilterChipStyled>
        ))}
        {labelsFilter?.map((label: NexoyaPortfolioLabel, idx: number) => (
          <FilterChipStyled key={label.labelId}>
            {labelsFilter ? <FilterBullet style={{ marginRight: 0 }} backgroundColor={getThemeColor(idx)} /> : null}
            <Typography>{label?.name}</Typography>
            <StyledButtonIcon onClick={() => handleRemoveLabel(label)}>
              <CancelIcon style={{ height: 10 }} />
            </StyledButtonIcon>
          </FilterChipStyled>
        ))}
        {impactGroupsFilter?.map((impactGroup: NexoyaImpactGroup, idx: number) => (
          <FilterChipStyled key={impactGroup.impactGroupId}>
            {impactGroupsFilter ? (
              <FilterBullet style={{ marginRight: 0 }} backgroundColor={getThemeColor(idx)} />
            ) : null}
            <Typography>{impactGroup?.name}</Typography>
            <StyledButtonIcon onClick={() => handleRemoveImpactGroup(impactGroup)}>
              <CancelIcon style={{ height: 10 }} />
            </StyledButtonIcon>
          </FilterChipStyled>
        ))}
        {contentRulesFilter?.map((contentRule: NexoyaContentRule, idx: number) => (
          <FilterChipStyled key={contentRule.contentRuleId}>
            {contentRulesFilter ? (
              <FilterBullet style={{ marginRight: 0 }} backgroundColor={getThemeColor(idx)} />
            ) : null}
            <Typography>{contentRule?.name}</Typography>
            <StyledButtonIcon onClick={() => handleRemoveContentRule(contentRule)}>
              <CancelIcon style={{ height: 10 }} />
            </StyledButtonIcon>
          </FilterChipStyled>
        ))}
        {attributionRulesFilter?.map((attributionRule: NexoyaAttributionRule, idx: number) => (
          <FilterChipStyled key={attributionRule.attributionRuleId}>
            <FilterBullet style={{ marginRight: 0 }} backgroundColor={getThemeColor(idx)} />
            <Typography>{attributionRule?.name}</Typography>
            <StyledButtonIcon onClick={() => handleRemoveAttributionRule(attributionRule)}>
              <CancelIcon style={{ height: 10 }} />
            </StyledButtonIcon>
          </FilterChipStyled>
        ))}
        {impactGroupRulesFilter?.map((impactGroupRule: NexoyaImpactGroupRule, idx: number) => (
          <FilterChipStyled key={impactGroupRule.impactGroupRuleId}>
            <FilterBullet style={{ marginRight: 0 }} backgroundColor={getThemeColor(idx)} />
            <Typography>{impactGroupRule?.name}</Typography>
            <StyledButtonIcon onClick={() => handleRemoveImpactGroupRule(impactGroupRule)}>
              <CancelIcon style={{ height: 10 }} />
            </StyledButtonIcon>
          </FilterChipStyled>
        ))}
      </ChipsContainerStyled>
    </Styles.ChartHeader>
  );
}
