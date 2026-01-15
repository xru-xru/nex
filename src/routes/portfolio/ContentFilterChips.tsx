import { useContentFilterStore } from '../../store/content-filter';
import translate from '../../utils/translate';
import useTranslationStore from '../../store/translations';

export const ContentFilterChips = () => {
  const { translations } = useTranslationStore();

  const {
    providersFilter,
    labelsFilter,
    impactGroupsFilter,
    contentRulesFilter,
    attributionRulesFilter,
    impactGroupRulesFilter,
    isIncludedInOptimization,
    isRuleManaged,
    titleContains,

    handleRemoveProvider,
    handleRemoveLabel,
    handleRemoveImpactGroup,
    handleRemoveContentRule,
    handleRemoveAttributionRule,
    handleRemoveImpactGroupRule,
    handleSetIsIncludedInOptimization,
    handleSetIsRuleManaged,
    resetAllFilters,
  } = useContentFilterStore();

  // Check if any filters are applied
  const hasFilters = !!(
    providersFilter.length ||
    labelsFilter.length ||
    impactGroupsFilter.length ||
    contentRulesFilter.length ||
    attributionRulesFilter.length ||
    impactGroupRulesFilter.length ||
    isIncludedInOptimization === false ||
    isIncludedInOptimization === true ||
    isRuleManaged === true ||
    isRuleManaged === false
  );

  if (!hasFilters) return null;

  return (
    <div className="mt-3 flex flex-wrap items-center">
      {providersFilter.map((provider) => (
        <FilterChip
          key={provider.provider_id}
          label="Channel"
          value={translate(translations, provider.name)}
          onRemove={() => handleRemoveProvider(provider)}
        />
      ))}

      {labelsFilter.map((label) => (
        <FilterChip key={label.labelId} label="Label" value={label.name} onRemove={() => handleRemoveLabel(label)} />
      ))}

      {impactGroupsFilter.map((group) => (
        <FilterChip
          key={group.impactGroupId}
          label="Impact group"
          value={group.name}
          onRemove={() => handleRemoveImpactGroup(group)}
        />
      ))}

      {contentRulesFilter.map((rule) => (
        <FilterChip
          key={rule.contentRuleId}
          label="Content rule"
          value={rule.name}
          onRemove={() => handleRemoveContentRule(rule)}
        />
      ))}

      {attributionRulesFilter.map((rule) => (
        <FilterChip
          key={rule.attributionRuleId}
          label="Attribution rule"
          value={rule.name}
          onRemove={() => handleRemoveAttributionRule(rule)}
        />
      ))}

      {impactGroupRulesFilter.map((rule) => (
        <FilterChip
          key={rule.impactGroupRuleId}
          label="Impact group rule"
          value={rule.name}
          onRemove={() => handleRemoveImpactGroupRule(rule)}
        />
      ))}

      {(isIncludedInOptimization === false || isIncludedInOptimization === true) && (
        <FilterChip
          label="Optimization status"
          value={isIncludedInOptimization === true ? 'Enabled' : 'Disabled'}
          onRemove={() => handleSetIsIncludedInOptimization(undefined)}
        />
      )}

      {(isRuleManaged === true || isRuleManaged === false) && (
        <FilterChip
          label="Content mode"
          value={isRuleManaged ? 'Rule-based' : 'Manual'}
          onRemove={() => handleSetIsRuleManaged(undefined)}
        />
      )}

      {hasFilters && (
        <button
          onClick={() => {
            resetAllFilters();
            handleSetIsIncludedInOptimization(undefined);
          }}
          className="ml-2 text-xs text-purple-600 hover:text-purple-800 hover:underline"
        >
          Clear all
        </button>
      )}
    </div>
  );
};

interface FilterChipProps {
  label: string;
  value: string;
  onRemove: () => void;
}
const FilterChip = ({ label, value, onRemove }: FilterChipProps) => (
  <div className="mr-2 inline-flex items-center rounded-md border border-neutral-100 px-2 py-1 text-sm text-neutral-800">
    <span className="font-medium">{label}: </span>
    <span className="ml-1 font-normal">{value}</span>
    <button
      onClick={() => {
        onRemove();
      }}
      className="ml-2 text-gray-500 hover:text-gray-700 focus:outline-none"
      aria-label={`Remove ${label} filter`}
    >
      <span className="text-xs">✕</span>
    </button>
  </div>
);
