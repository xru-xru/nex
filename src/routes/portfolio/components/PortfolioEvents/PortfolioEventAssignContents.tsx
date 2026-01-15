import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import FormControlLabel from '../../../../components/FormControlLabel';
import Radio from '../../../../components/Radio';
import RadioGroup from '../../../../components/RadioGroup';
import FilterContentsTable from '../../../../components/ContentSelection/components/FilterContentsTable';
import { Input } from 'components-ui/Input';
import { useRouteMatch } from 'react-router';
import { DataTableFilterOption } from '../Content/PortfolioRule/types';
import {
  NexoyaContentFilterFieldName,
  NexoyaContentFilterOperator,
  NexoyaContentRule,
  NexoyaFeatureFlag,
  NexoyaPortfolioEvent,
  NexoyaProvider,
} from '../../../../types';
import { useProviders } from '../../../../context/ProvidersProvider';
import { PortfolioFilter } from '../PerformanceChartHeader/components/PortfolioFilter';
import { usePortfolio } from '../../../../context/PortfolioProvider';
import { useFilteredContentsStore } from '../../../../store/filter-contents';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '../../../../components-ui/Button';
import { LabelLight } from '../../../../components/InputLabel/styles';
import { getCategoryInfo } from '../../../../utils/portfolioEvents';
import dayjs from 'dayjs';
import Checkbox from '../../../../components/Checkbox';
import { useContentRuleQuery } from '../../../../graphql/portfolioRules/queryContentRules';
import { CancelIcon } from '../../../../components/icons';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../../../../components-ui/DropdownMenu';
import { ChevronDown } from 'lucide-react';
import { useContentRulesStore } from '../../../../store/content-rules';
import { PORTFOLIO_FEATURE_FLAGS } from '../../../../constants/featureFlags';

enum AssignmentType {
  ALL_CONTENTS = 'all_contents',
  INDIVIDUAL_CONTENTS = 'individual_contents',
  CONTENT_RULES = 'content_rules',
}

const ASSIGN_CONTENTS_OPTIONS = [
  {
    value: AssignmentType.CONTENT_RULES,
    label: 'Content rules',
    featureFlag: PORTFOLIO_FEATURE_FLAGS.SELF_SERVICE_PORTFOLIO as NexoyaFeatureFlag,
  },
  {
    value: AssignmentType.INDIVIDUAL_CONTENTS,
    label: 'Individual contents',
  },
  {
    value: AssignmentType.ALL_CONTENTS,
    label: 'All contents',
  },
];

export const PortfolioEventAssignContents = ({
  renderTitle = true,
  renderSubtitle = false,
  portfolioEvents,
  setIncludesAllContents,
  selectedEventIds,
  setSelectedEventIds,
  portfolioEventToEdit,
}: {
  renderTitle?: boolean;
  renderSubtitle?: boolean;
  portfolioEvents?: NexoyaPortfolioEvent[];
  setIncludesAllContents: Dispatch<SetStateAction<boolean>>;
  selectedEventIds?: number[];
  setSelectedEventIds?: Dispatch<SetStateAction<number[]>>;
  portfolioEventToEdit?: NexoyaPortfolioEvent;
}) => {
  const match = useRouteMatch();
  const portfolioId = parseInt(match.params.portfolioID, 10);
  const {
    portfolioV2Info: {
      meta: { data: portfolioMeta },
    },
  } = usePortfolio();

  const portfolioFeatureFlags = portfolioMeta?.featureFlags || [];

  const [assignContentsOptions, setAssignContentsOptions] = useState(ASSIGN_CONTENTS_OPTIONS);

  const [selectedAssignment, setSelectedAssignment] = useState<AssignmentType>(null);
  const [shouldFetch, setShouldFetch] = useState(false);

  const [contentRules, setContentRules] = useState<NexoyaContentRule[]>([]);

  const [selectedOptions, setSelectedOptions] = useState<DataTableFilterOption[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const { activeProviders } = useProviders();
  const {
    providers: { providersFilter },
  } = usePortfolio();

  const { selectedContentIds, setSelectedContentIds } = useFilteredContentsStore();
  const { selectedContentRules, setSelectedContentRules } = useContentRulesStore();

  const { loading } = useContentRuleQuery({
    portfolioId,
    onCompleted: (data) => setContentRules(data?.portfolioV2?.contentRules),
  });

  const providerIds = providersFilter?.length
    ? providersFilter.map((provider) => provider.provider_id)
    : activeProviders?.map((provider: NexoyaProvider) => provider.provider_id);

  useEffect(() => {
    const assignContentsOptions = ASSIGN_CONTENTS_OPTIONS.filter((option) => {
      // For content rules option, show it if feature flag is enabled OR if content rules exist
      if (option.value === AssignmentType.CONTENT_RULES) {
        const flag = portfolioFeatureFlags.find((ff) => ff.name === option.featureFlag);
        return flag?.status === true && contentRules && contentRules.length > 0;
      }
      // For other options with feature flags, check only the flag
      else if (option.featureFlag) {
        const flag = portfolioFeatureFlags.find((ff) => ff.name === option.featureFlag);
        return flag?.status === true;
      }
      // Options without feature flags are always shown
      return true;
    });

    setAssignContentsOptions(assignContentsOptions);
  }, [portfolioFeatureFlags, portfolioMeta, contentRules]);

  useEffect(() => {
    if (!portfolioEventToEdit) {
      return;
    }
    if (portfolioEventToEdit?.includesAllContents) {
      setSelectedAssignment(AssignmentType.ALL_CONTENTS);
    }
    if (portfolioEventToEdit?.contentRules.length > 0) {
      setSelectedContentRules(portfolioEventToEdit.contentRules);
      setSelectedAssignment(AssignmentType.CONTENT_RULES);
    }
    if (portfolioEventToEdit.assignedContents.length > 0) {
      setSelectedContentIds(portfolioEventToEdit.assignedContents.map((content) => content.contentId));
      setSelectedAssignment(AssignmentType.INDIVIDUAL_CONTENTS);
    }
  }, [portfolioEventToEdit]);

  useEffect(() => {
    if (selectedAssignment === AssignmentType.INDIVIDUAL_CONTENTS) {
      setSelectedContentRules([]);
      setShouldFetch(true);
    }

    if (selectedAssignment === AssignmentType.ALL_CONTENTS) {
      setSelectedContentIds([]);
      setSelectedContentRules([]);
      setShouldFetch(false);
    }
  }, [selectedAssignment]);

  useEffect(() => {
    if (selectedAssignment === AssignmentType.INDIVIDUAL_CONTENTS) {
      setShouldFetch(true);
    }
  }, [providerIds, selectedAssignment]);

  const handleSelectEvent = (eventId: number) => {
    setSelectedEventIds((prev) => (prev.includes(eventId) ? prev.filter((id) => id !== eventId) : [...prev, eventId]));
  };

  const handleSearchInput = (value: string) => {
    setSearchInput(value);
    setSelectedOptions([
      {
        id: uuidv4(),
        label: 'Title',
        icon: null,
        value: NexoyaContentFilterFieldName.Title,
        options: [],
        type: 'string',
        filterValues: [value],
        filterOperator: NexoyaContentFilterOperator.Contains,
        operators: [],
      },
    ]);
  };

  return (
    <div className="flex flex-col gap-2 py-8">
      {renderTitle ? (
        <div>
          <div className="text-[20px] font-medium tracking-normal">Assign contents</div>
          <div className="text-md font-normal text-neutral-500">
            Select the content type and contents that are impacted by your event.
          </div>
        </div>
      ) : null}
      {portfolioEvents?.length ? (
        <div>
          <div>
            <div className="text-mdlg font-medium tracking-normal">Select events</div>
            <div className="text-md font-normal text-neutral-500">
              Select the events you want to assign contents to.
            </div>
          </div>
          <div className="mb-6 mt-4 divide-y divide-neutral-100 rounded-lg border border-neutral-100">
            <div className="grid grid-cols-[40px_1.45fr_1fr_1fr_1fr_0.3fr] items-center px-6 py-1 font-medium text-neutral-600">
              <LabelLight className="!mb-0 px-0 font-semibold !text-neutral-300">
                <Checkbox
                  checked={selectedEventIds?.length === portfolioEvents?.length}
                  onChange={() => {
                    setSelectedEventIds(
                      selectedEventIds?.length === portfolioEvents?.length
                        ? []
                        : portfolioEvents?.map((event) => event.portfolioEventId),
                    );
                  }}
                />
              </LabelLight>
              <LabelLight className="!mb-0 px-0 font-semibold !text-neutral-300">Name</LabelLight>
              <LabelLight className="!mb-0 px-2 font-semibold !text-neutral-300">Impacted contents</LabelLight>
              <LabelLight className="!mb-0 px-2 font-semibold !text-neutral-300">Timeframe</LabelLight>
              <LabelLight className="!mb-0 px-2 font-semibold !text-neutral-300">Category</LabelLight>
              <LabelLight className="!mb-0 px-2 font-semibold !text-neutral-300">Impact</LabelLight>
            </div>
            <div className="divide-y divide-neutral-100">
              {portfolioEvents.map((event) => (
                <div
                  key={event.portfolioEventId}
                  className="grid grid-cols-[40px_1.5fr_1fr_1fr_1fr_0.3fr] px-6 py-1 font-normal text-neutral-500"
                >
                  <div className="my-auto py-3">
                    <Checkbox
                      checked={selectedEventIds.includes(event.portfolioEventId)}
                      onChange={() => handleSelectEvent(event.portfolioEventId)}
                    />
                  </div>
                  <div className="my-auto py-3 font-medium text-neutral-700">{event.name}</div>
                  <div className="my-auto py-3 font-normal text-neutral-200">Assign contents</div>
                  <div className="my-auto py-3">
                    {dayjs(event.start).format('MMM D')} - {dayjs(event.end).format('MMM DD, YYYY')}
                  </div>
                  <div className="my-auto py-3">{getCategoryInfo(event.category)?.title}</div>
                  <div className="my-auto py-3 text-center capitalize">{event.impact?.toLowerCase()}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
      <div>
        {renderSubtitle ? (
          <div>
            <div className="text-mdlg font-medium tracking-normal">Select contents</div>
            <div className="text-md font-normal text-neutral-500">
              Select the content type and contents that are impacted by your event.
            </div>
          </div>
        ) : null}
        <RadioGroup className="ml-[-3px] mt-4 flex flex-col gap-1.5">
          {assignContentsOptions.map((option) => (
            <div key={option.value} className="flex items-center gap-2">
              <FormControlLabel
                className="text-neutral-600"
                checked={option.value === selectedAssignment}
                onChange={() => {
                  setSelectedAssignment(option.value as AssignmentType);
                  if (option.value === AssignmentType.ALL_CONTENTS) {
                    setIncludesAllContents(true);
                  } else {
                    setIncludesAllContents(false);
                  }
                }}
                value={option.value}
                label={option.label}
                control={<Radio />}
                data-cy={option.value}
              />
            </div>
          ))}
        </RadioGroup>
      </div>
      <div>
        {selectedAssignment === AssignmentType.CONTENT_RULES ? (
          <div className="mt-4 flex w-full flex-col gap-2">
            <div className="py-2.5 text-neutral-600">Content rules</div>
            <div className="w-72">
              <DropdownMenu>
                <DropdownMenuTrigger asChild className="w-full">
                  <Button
                    disabled={!contentRules?.length}
                    variant="outline"
                    className="w-full justify-between rounded-md border-neutral-200 bg-white px-3 py-2 shadow-sm"
                  >
                    {loading ? (
                      'Loading...'
                    ) : (
                      <span className="text-neutral-800">
                        {selectedContentRules.length
                          ? `${selectedContentRules.length} content rules selected`
                          : 'Select content rules'}
                      </span>
                    )}
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  side="bottom"
                  className="w-[var(--radix-dropdown-menu-trigger-width)]"
                  onCloseAutoFocus={(e) => e.preventDefault()}
                >
                  {contentRules.map((rule) => (
                    <DropdownMenuCheckboxItem
                      key={rule.contentRuleId}
                      checked={selectedContentRules.some((r) => r.contentRuleId === rule.contentRuleId)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedContentRules([...selectedContentRules, rule]);
                        } else {
                          setSelectedContentRules(
                            selectedContentRules.filter((r) => r.contentRuleId !== rule.contentRuleId),
                          );
                        }
                      }}
                      onSelect={(e) => e.preventDefault()}
                    >
                      {rule.name}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="mt-2 flex flex-wrap gap-2">
                {selectedContentRules.map((rule) => (
                  <div
                    key={rule.contentRuleId}
                    className="flex items-center gap-2 rounded-md border border-neutral-200 bg-white py-2 pl-3 pr-2 text-sm"
                  >
                    <span className="font-normal text-neutral-400">
                      <span className="font-medium">{rule.name}:</span> {rule.matchingDiscoveredContentsCount} contents
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedContentRules(
                          selectedContentRules.filter((r) => r.contentRuleId !== rule.contentRuleId),
                        );
                      }}
                      className="size-3 rounded-full p-0.5 hover:bg-neutral-50"
                    >
                      <CancelIcon className="h-3 w-3 text-neutral-400" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}
        {selectedAssignment === AssignmentType.INDIVIDUAL_CONTENTS && (
          <div className="mt-4 flex w-full flex-col gap-2">
            <div className="flex justify-between">
              <div className="flex w-60 items-center justify-between">
                <span className="text-neutral-600">Individual contents</span>
              </div>
            </div>

            <div className="ml-[1px]">
              <div className="mb-4 flex items-center justify-between gap-2">
                <PortfolioFilter
                  disabled={false}
                  activeProviderIds={activeProviders?.map((provider) => provider.provider_id)}
                  shouldRenderProvidersFilter
                  shouldRenderLabelsFilter={false}
                  shouldRenderImpactGroupsFilter={false}
                />
                <Input
                  value={searchInput}
                  onChange={(e) => handleSearchInput(e.target.value)}
                  onBlur={() => setShouldFetch(true)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      setShouldFetch(true);
                    }
                  }}
                  placeholder="Search contents..."
                  className="h-[32px] px-3 py-2.5 data-[placeholder]:text-red-400"
                />
              </div>
              <FilterContentsTable
                inPortfolioOnly
                portfolioId={portfolioId}
                providerIds={providerIds}
                accountIds={[]}
                preselectNewFilteredItems={false}
                filters={selectedOptions}
                excludePortfolioContents={false}
                selectedContentIds={selectedContentIds}
                setSelectedContentIds={setSelectedContentIds}
                shouldFetch={shouldFetch}
                setShouldFetch={setShouldFetch}
                defaultPageSize={10}
                configType="portfolio-events"
                handleCheckboxAction={(contentId: number) => {
                  const newSelectedIds = selectedContentIds?.includes(contentId)
                    ? selectedContentIds.filter((id) => id !== contentId)
                    : [...selectedContentIds, contentId];
                  setSelectedContentIds(newSelectedIds);
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
