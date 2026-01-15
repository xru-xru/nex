import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useRouteMatch } from 'react-router';

// UI Components
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../../../components-ui/Select';
import { LabelLight } from '../../../../../../components/InputLabel/styles';
import { Input } from '../../../../../../components-ui/Input';
import { Button } from '../../../../../../components-ui/Button';
import { CirclePlus, Trash2 } from 'lucide-react';

// Hooks and API
import { useFunnelStepMappingPreset } from '../../../../../../graphql/portfolioRules/queryFunnelStepMappingPreset';
import { useSaveFunnelStepMappingPreset } from '../../../../../../graphql/portfolioRules/mutationSaveFunnelStepMappingPreset';
import { useTeam } from '../../../../../../context/TeamProvider';
import { useFunnelStepUtmMapping } from '../../../../../../graphql/portfolio/queryFunnelStepUtmMapping';
import { useUpdateFunnelStepMappingPreset } from '../../../../../../graphql/portfolioRules/mutationUpdateFunnelStepMappingPreset';
import { useListFunnelStepUtmVariables } from '../../../../../../graphql/portfolioRules/queryUTMVariables';
import { useIntegrationQuery } from '../../../../../../graphql/integration/queryIntegration';

// Types
import {
  NexoyaFilterListType,
  NexoyaFunnelStepMappingInput,
  NexoyaFunnelStepMappingPreset,
  NexoyaFunnelStepMappingType,
  NexoyaFunnelStepType,
  NexoyaFunnelStepUtmMappingParams,
  NexoyaMeasurement,
} from '../../../../../../types';

// Utilities
import { camelCaseToWords } from '../utils';
import { MetricAssignmentCombobox } from './MetricAssignmentCombobox';
import { AssignedMetric } from '../ContentMetricAssignment';
import { isEqual } from 'lodash';

export const GA4_INTEGRATION_ID = 168;

/**
 * Extended mapping type with additional fields for UI state management
 */
type AssignedMappingExtended = AssignedMetric & {
  funnelStepId?: number;
  presetName?: string;
  analyticsPropertyId?: string;
};

/**
 * Props for the UTMTracking component
 */
interface UTMTrackingProps {
  assignedMetrics: AssignedMappingExtended[];
  setAssignedMetrics: Dispatch<SetStateAction<AssignedMappingExtended[]>>;
  selectedMetricId: number;
  funnelStepId: number;
  funnelStepType: NexoyaFunnelStepType;
  measurements: NexoyaMeasurement[];
}

/**
 * UTMTracking component allows users to configure UTM parameters for tracking
 */
export const UTMTracking: React.FC<UTMTrackingProps> = ({
  assignedMetrics,
  setAssignedMetrics,
  selectedMetricId,
  funnelStepId,
  funnelStepType,
  measurements,
}) => {
  // Context and route state
  const { teamId } = useTeam();
  const match = useRouteMatch();
  const portfolioId = parseInt(match.params.portfolioID, 10);

  // Local state for UI
  const [openSuggestionIndex, setOpenSuggestionIndex] = useState<number | null>(null);
  const [openValueIndex, setOpenValueIndex] = useState<number | null>(null);
  const [isConfigModified, setIsConfigModified] = useState(false);

  // Store the original configuration for comparison
  const originalConfigRef = useRef<{
    metricId?: number;
    utmParams?: any[];
    presetName?: string;
    analyticsPropertyId?: string;
  } | null>(null);

  const { data: integrationData, loading: loadingIntegration } = useIntegrationQuery({
    integrationId: GA4_INTEGRATION_ID,
    withUser: false,
    withConnection: false,
    withFilters: true,
    withMeta: false,
    skip: !teamId,
  });

  const GA4Filters =
    integrationData?.integration?.filterOptions
      ?.find((option) => option.filterName === 'property')
      ?.filterList?.filter((option: NexoyaFilterListType) => option.selected)
      ?.map((item) => {
        const propertyId = item.id.split(';')[1]?.split('/')[1];
        return {
          id: propertyId,
          name: `${item.itemInfo[0]} - ${item.itemInfo[1]}`,
        };
      })
      .filter(Boolean) || [];

  // Query data for UTM variable options
  const { data: funnelStepUtmVariablesData } = useListFunnelStepUtmVariables();
  const utmVariables = funnelStepUtmVariablesData?.listFunnelStepUtmExpansionVariables;

  // Query data for UTM parameter types
  const { data: funnelStepsUtmMappingData } = useFunnelStepUtmMapping();
  const utmTrackingOptions: NexoyaFunnelStepUtmMappingParams[] =
    funnelStepsUtmMappingData?.listFunnelStepUtmMappingParams?.map((param: NexoyaFunnelStepUtmMappingParams) => ({
      name: camelCaseToWords(param.name),
      type: param.type,
    })) || [];

  // Mutations for saving and updating presets
  const [saveFunnelStepMappingPreset, { loading: loadingSavePreset }] = useSaveFunnelStepMappingPreset({ portfolioId });
  const [updateFunnelStepMappingPreset] = useUpdateFunnelStepMappingPreset({ portfolioId });

  // Query for existing presets
  const { data: funnelStepPresetsData } = useFunnelStepMappingPreset();
  const mappingPresets: NexoyaFunnelStepMappingPreset[] = funnelStepPresetsData?.listFunnelStepMappingPresets || [];

  // Derived state from assignedMetrics
  const currentMapping = assignedMetrics.find((m) => m.funnelStepId === funnelStepId);
  const utmParams = currentMapping?.utmParams || [];
  const presetName = currentMapping?.presetName || '';

  // Validate that the current analyticsPropertyId exists in the available GA4Filters
  const currentAnalyticsPropertyId = currentMapping?.analyticsPropertyId;
  const analyticsPropertyId =
    currentAnalyticsPropertyId && GA4Filters?.length > 0
      ? GA4Filters.some((filter) => filter.id.toString() === currentAnalyticsPropertyId)
        ? currentAnalyticsPropertyId
        : ''
      : currentAnalyticsPropertyId;

  // Modify the updateAssignedMapping function to set the modification flag
  const updateAssignedMapping = (partial: Partial<AssignedMappingExtended>) => {
    setAssignedMetrics((prev) => {
      const index = prev.findIndex((m) => m.funnelStepId === funnelStepId);
      if (index === -1) return prev;

      const newMetrics = [...prev];
      newMetrics[index] = { ...newMetrics[index], ...partial };

      // Compare with original config immediately after state update
      const updatedMapping = newMetrics[index];
      const currentConfig = {
        metricId: updatedMapping.metricId,
        presetName: updatedMapping.presetName,
        utmParams: updatedMapping.utmParams || [],
        analyticsPropertyId: updatedMapping.analyticsPropertyId,
      };

      setIsConfigModified(originalConfigRef.current !== null && !isEqual(originalConfigRef.current, currentConfig));
      return newMetrics;
    });
  };

  // Initialize metric entry for this funnel step if it doesn't exist
  useEffect(() => {
    setAssignedMetrics((prev) => {
      const index = prev.findIndex((m) => m.funnelStepId === funnelStepId);
      if (index === -1) {
        // Create a new entry with defaults
        return [
          ...prev,
          {
            type: NexoyaFunnelStepMappingType.Utm,
            funnelStepId,
            metricId: selectedMetricId,
            analyticsPropertyId: '',
            conversions: [],
            utmParams: [],
            presetName: '',
          },
        ];
      }
      return prev;
    });
  }, [funnelStepId, selectedMetricId, setAssignedMetrics]);

  // Add a default parameter if none exist and options are available
  useEffect(() => {
    if (utmTrackingOptions?.length && !utmParams.length) {
      handleAddParam();
    }
  }, [funnelStepId, utmTrackingOptions]);

  // Handler functions

  /**
   * Add a new UTM parameter to the list (limited to 5)
   */
  const handleAddParam = () => {
    if (utmParams.length < 5) {
      const newParams = [...utmParams, { type: '', values: [''] }];
      updateAssignedMapping({ utmParams: newParams });
    }
  };

  /**
   * Add a new value option to a specific UTM parameter
   */
  const handleAddValue = (paramIndex: number) => {
    const newParams = utmParams.map((p, i) => {
      if (i === paramIndex) {
        return {
          ...p,
          values: [...p.values, ''],
        };
      }
      return p;
    });
    updateAssignedMapping({ utmParams: newParams });
  };

  /**
   * Delete a value from a UTM parameter, or the entire parameter if it's the last value
   */
  const handleDeleteValue = (paramIndex: number, valueIndex: number) => {
    // If this is the last value for this parameter, delete the entire parameter
    if (utmParams[paramIndex].values.length <= 1) {
      const newParams = utmParams.filter((_, i) => i !== paramIndex);
      updateAssignedMapping({ utmParams: newParams });
      return;
    }

    // Otherwise just delete the specific value
    const newParams = utmParams.map((p, i) => {
      if (i === paramIndex) {
        return {
          ...p,
          values: p.values.filter((_, vi) => vi !== valueIndex),
        };
      }
      return p;
    });
    updateAssignedMapping({ utmParams: newParams });
  };

  /**
   * Update a UTM parameter type or value
   */
  const handleUpdateParam = (paramIndex: number, valueIndex: number, key: 'type' | 'value', value: string) => {
    // Show variable suggestions dropdown if user types "{}"
    if (key === 'value' && value.endsWith('{}')) {
      setOpenSuggestionIndex(paramIndex);
      setOpenValueIndex(valueIndex);
    } else if (key === 'value') {
      setOpenSuggestionIndex(null);
      setOpenValueIndex(null);
    }

    // Update the parameter or value
    const newParams = utmParams.map((p, i) => {
      if (i === paramIndex) {
        if (key === 'type') {
          return { ...p, type: value };
        } else {
          const newValues = [...p.values];
          newValues[valueIndex] = value;
          return { ...p, values: newValues };
        }
      }
      return p;
    });
    updateAssignedMapping({ utmParams: newParams });
  };

  /**
   * Handle selection of a variable from the suggestions dropdown
   */
  const handleSuggestionSelect = (selectedOption: string, value: string, paramIndex: number, valueIndex: number) => {
    const newValue = value.replace('{}', `{${selectedOption}}`);
    handleUpdateParam(paramIndex, valueIndex, 'value', newValue);
    setOpenSuggestionIndex(null);
    setOpenValueIndex(null);
  };

  const handleUpdateProperty = (propertyId: string) => {
    updateAssignedMapping({ analyticsPropertyId: propertyId });
  };

  const findSelectedPreset = () => {
    if (!presetName) return undefined;
    const found = mappingPresets.find((p) => p.name === presetName);
    return found?.funnelStepMappingPresetId.toString();
  };

  // Modify handleSelectPreset to set isConfigModified to false when loading a preset
  const handleSelectPreset = (id: string) => {
    const selectedPreset = mappingPresets.find((preset) => preset.funnelStepMappingPresetId.toString() === id);
    if (selectedPreset) {
      // Validate that the analyticsPropertyId from the preset exists in current GA4Filters
      const presetAnalyticsPropertyId = selectedPreset.mapping?.analyticsPropertyId;
      const validAnalyticsPropertyId =
        presetAnalyticsPropertyId && GA4Filters?.length > 0
          ? GA4Filters.some((filter) => filter.id.toString() === presetAnalyticsPropertyId)
            ? presetAnalyticsPropertyId
            : ''
          : presetAnalyticsPropertyId;

      // Create a deep copy of the selected preset's mapping for comparison
      originalConfigRef.current = {
        metricId: selectedPreset.mapping?.metricId,
        presetName: selectedPreset.name || '',
        // Deep clone the utmParams to avoid reference issues
        utmParams: JSON.parse(JSON.stringify(selectedPreset.mapping?.utmParams || [])),
        analyticsPropertyId: validAnalyticsPropertyId,
      };

      updateAssignedMapping({
        metricId: selectedPreset.mapping?.metricId,
        presetName: selectedPreset.name || '',
        analyticsPropertyId: validAnalyticsPropertyId,
        // @ts-ignore
        utmParams: JSON.parse(JSON.stringify(selectedPreset.mapping?.utmParams || [])),
      });

      // Reset the modification flag when loading a preset
      setIsConfigModified(false);
    }
  };

  // Modify handleSaveConfiguration to reset the modification flag when saving
  const handleSaveConfiguration = () => {
    // Validate required fields
    if (!presetName.trim()) {
      toast.warning('Please enter a name for your configuration.');
      return;
    }

    if (!selectedMetricId) {
      toast.warning('Please select a metric. This is mandatory for UTM tracking.');
      return;
    }

    if (!analyticsPropertyId) {
      toast.warning('Please select a GA4 property.');
      return;
    }

    // Find any existing preset with the same name
    const existingPreset = mappingPresets.find((p) => p.name.toLowerCase() === presetName.trim().toLowerCase());

    // Filter params to only include those with valid values
    const mappedParams = utmParams.filter((p) => p.type && p.type.trim() && p.values.some((v) => v.trim()));

    // Validate that at least one parameter is provided
    if (mappedParams.length === 0) {
      toast.warning('Please fill in at least one UTM parameter with both Parameter type and Parameter value.');
      return;
    }

    // Create the mapping object for the preset
    const mapping: NexoyaFunnelStepMappingInput = {
      metricId: selectedMetricId,
      type: NexoyaFunnelStepMappingType.Utm,
      analyticsPropertyId,
      utmParams: mappedParams.map((p) => ({
        type: p.type,
        values: p.values,
      })),
    };

    // Save the preset name in the current component state
    updateAssignedMapping({ presetName });

    // Update or create the preset in the backend
    if (existingPreset) {
      updateFunnelStepMappingPreset({
        variables: {
          teamId,
          name: presetName,
          mapping,
          funnelStepMappingPresetId: existingPreset.funnelStepMappingPresetId,
        },
      });
    } else {
      saveFunnelStepMappingPreset({
        variables: {
          teamId,
          name: presetName,
          mapping,
        },
      });
    }

    // Update the original config reference to the current state
    originalConfigRef.current = {
      metricId: selectedMetricId,
      presetName,
      utmParams: JSON.parse(JSON.stringify(mappedParams)),
      analyticsPropertyId,
    };

    // Reset modification flag after saving
    setIsConfigModified(false);
  };

  return (
    <div className="flex max-w-[526px] flex-col gap-6">
      {/* Header Section */}
      <div className="flex flex-col gap-1">
        <div className="mt-3 text-lg text-neutral-700">GA4 Tracking</div>
        <div className="mt-0.5 max-w-lg text-sm font-light text-neutral-400">
          Use an existing GA4 Tracking configuration or create a new configuration for this funnel step.
        </div>

        {/* Load Preset Section */}
        <div className="mt-4">
          <LabelLight>
            Load configuration <span className="text-lg text-red-400">{isConfigModified ? ' *' : ''}</span>
          </LabelLight>
          <Select disabled={!mappingPresets?.length} onValueChange={handleSelectPreset} value={findSelectedPreset()}>
            <SelectTrigger className="max-w-xl border-neutral-100 bg-white p-2 shadow-sm">
              {loadingSavePreset ? (
                'Loading...'
              ) : (
                // In the render function, modify the SelectValue component to show the asterisk
                <SelectValue
                  placeholder={
                    !mappingPresets?.length
                      ? 'No configurations saved'
                      : presetName
                        ? `${presetName}`
                        : 'Load configuration'
                  }
                />
              )}
            </SelectTrigger>
            <SelectContent>
              {mappingPresets.map((config) => (
                <SelectItem key={config.funnelStepMappingPresetId} value={config.funnelStepMappingPresetId.toString()}>
                  <span>{config.name}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* GA4 Property Section */}
      <div className="flex flex-col gap-1">
        <LabelLight>GA4 Property</LabelLight>
        <Select
          disabled={loadingIntegration || !GA4Filters?.length}
          onValueChange={handleUpdateProperty}
          value={analyticsPropertyId || undefined}
        >
          <SelectTrigger className="max-w-xl border-neutral-100 bg-white p-2 shadow-sm">
            <SelectValue placeholder="Select GA4 Property..." />
          </SelectTrigger>
          <SelectContent>
            {GA4Filters.map((property: { id: number; name: string }) => (
              // @ts-ignore
              <SelectItem key={property.id} value={property.id}>
                {property.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* UTM Parameters Section */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <div className="text-md mt-3 font-semibold tracking-normal text-neutral-700">
            Configuration step 1: UTM Parameters
          </div>
          <div className="mt-0.5 text-sm font-light text-neutral-400">
            Select up to 5 different UTM parameters for this funnel step.
            <br />
            This step is optional.
          </div>
        </div>

        {/* Parameter List */}
        <div>
          {utmParams.map((param, paramIndex) => (
            <div key={paramIndex} className="mb-4">
              <div className="flex w-full flex-row items-start justify-between gap-3">
                {/* Parameter Type */}
                <div className="w-44">
                  <LabelLight style={{ fontSize: 11 }}>Dimension</LabelLight>
                  <Select
                    value={param.type || undefined}
                    onValueChange={(value) => handleUpdateParam(paramIndex, 0, 'type', value)}
                  >
                    <SelectTrigger
                      data-testid="utm_dimension_select"
                      className="max-w-32 whitespace-pre border-neutral-100 bg-white p-2 shadow-sm"
                    >
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      {utmTrackingOptions.map((option) => (
                        <SelectItem key={option.type} value={option.type}>
                          <span>{option.name}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Parameter Values */}
                <div className="flex w-full flex-col">
                  {param.values.map((value, valueIndex) => (
                    <React.Fragment key={valueIndex}>
                      <div className="flex w-full items-center">
                        <div className="w-full">
                          <LabelLight style={{ fontSize: 11 }}>Parameter value {valueIndex + 1}</LabelLight>
                          <div className="flex w-full items-center gap-2">
                            {/* Value Input with Variable Suggestions */}
                            <Select
                              open={openSuggestionIndex === paramIndex && openValueIndex === valueIndex}
                              onValueChange={(val) => handleSuggestionSelect(val, value, paramIndex, valueIndex)}
                            >
                              <Input
                                className="relative w-full shadow-sm"
                                placeholder="Enter value"
                                value={value}
                                data-testid="utm_value_input"
                                onChange={(e) => handleUpdateParam(paramIndex, valueIndex, 'value', e.target.value)}
                              />
                              <SelectTrigger className="h-0 w-0 border-none p-0 opacity-0" />
                              <SelectContent className="absolute left-[-345px] top-4">
                                {utmVariables?.map((variable) => (
                                  <SelectItem key={variable} value={variable}>
                                    {`{${variable}}`}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>

                            {/* Delete Value Button */}
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleDeleteValue(paramIndex, valueIndex)}
                              disabled={paramIndex === 0 ? valueIndex === 0 : false}
                            >
                              <Trash2 className="h-5 w-5 text-neutral-300" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* "OR" Separator between values */}
                      {valueIndex !== param.values.length - 1 && (
                        <div className="my-4 flex items-center gap-2">
                          <div className="h-[1px] w-6 border-t-2 border-dotted border-neutral-100"></div>
                          <span className="text-xs text-neutral-400">OR</span>
                          <div className="h-[1px] flex-1 border-t-2 border-dotted border-neutral-100"></div>
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Add Value Link */}
              <span
                onClick={() => handleAddValue(paramIndex)}
                className="ml-36 cursor-pointer text-[10px] text-neutral-300"
              >
                + <span className="underline">Add new value</span>
              </span>

              {/* "AND" Separator between parameters */}
              {paramIndex !== utmParams.length - 1 && (
                <div className="my-4 flex items-center gap-2">
                  <div className="h-[1px] w-6 border-t-2 border-dotted border-neutral-100"></div>
                  <span className="text-xs text-neutral-400">AND</span>
                  <div className="h-[1px] flex-1 border-t-2 border-dotted border-neutral-100"></div>
                </div>
              )}
            </div>
          ))}

          {/* Add Parameter Button */}
          <div className="flex items-center gap-4">
            <div className="h-[1px] w-full bg-neutral-100"></div>
            <Button onClick={handleAddParam} size="icon" variant="ghost" disabled={utmParams.length >= 5}>
              <CirclePlus className="h-5 w-5 text-neutral-300" />
            </Button>
          </div>
        </div>
      </div>

      {/* Metric Type Section */}
      <div className="flex max-w-[526px] flex-col gap-2">
        <div className="flex flex-col gap-1">
          <div className="text-md font-semibold tracking-normal text-neutral-700">
            Configuration step 2: Metric Type
          </div>
          <div className="mt-0.5 text-sm font-light text-neutral-400">
            Select one metric type for this funnel step.
            <br />
            This step is mandatory.
          </div>
        </div>
        <div className="flex items-end gap-4">
          <div className="w-full">
            <LabelLight>Metric</LabelLight>
            <MetricAssignmentCombobox
              measurementsList={measurements}
              selectedFunnelStepId={funnelStepId}
              assignedMetrics={assignedMetrics}
              setAssignedMetrics={setAssignedMetrics}
              selectedFunnelStepType={funnelStepType}
              triggerClassName="w-full"
            />
          </div>
        </div>
      </div>

      {/* Save Configuration Section */}
      <div className="mb-40 flex max-w-[526px] flex-col gap-4">
        <div className="flex flex-col gap-1">
          <div className="text-md font-semibold tracking-normal text-neutral-700">Save GA4 Tracking configuration</div>
          <div className="mt-0.5 text-sm font-light text-neutral-400">
            You can save your configuration above and give it a name for future use.
          </div>
        </div>
        <div className="flex items-end gap-4">
          <div className="w-full">
            <Input
              className="shadow-sm"
              placeholder="Configuration name"
              value={presetName}
              onChange={(e) => updateAssignedMapping({ presetName: e.target.value })}
            />
          </div>
          <Button
            disabled={
              !presetName ||
              !selectedMetricId ||
              !analyticsPropertyId ||
              !utmParams.some((u) => u.type && u.values.some((v) => v))
            }
            variant="secondary"
            onClick={handleSaveConfiguration}
          >
            Save configuration
          </Button>
        </div>
      </div>
    </div>
  );
};
