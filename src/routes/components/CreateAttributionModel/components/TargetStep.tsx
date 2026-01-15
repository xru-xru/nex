import React, { useState } from 'react';
import Button from '../../../../components/Button';
import clsx from 'clsx';
import Spinner from '../../../../components/Spinner';
import { TargetMetricState } from '../types';
import { Popover, PopoverContent, PopoverTrigger } from '../../../../components-ui/Popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../../../../components-ui/Command';
import { ChevronDown, FileText } from 'lucide-react';
import translate from '../../../../utils/translate';
import useTranslationStore from '../../../../store/translations';
import { NexoyaMeasurement } from '../../../../types';
import { toNumber } from 'lodash';

type TargetStepProps = {
  targetMetric: TargetMetricState;
  measurements: NexoyaMeasurement[];
  isUploading: boolean;
  getRootProps: () => Record<string, unknown>;
  getInputProps: () => Record<string, unknown>;
  isDragActive: boolean;
  onMetricChange: (metricId: number | null) => void;
  onReplaceFile: () => void;
  onBrowseFile: () => void;
  onSkipFileChange: (skip: boolean) => void;
  formatFileSize: (bytes: number) => string;
};

export function TargetStep({
  targetMetric,
  measurements,
  isUploading,
  getRootProps,
  getInputProps,
  isDragActive,
  onMetricChange,
  onReplaceFile,
  onBrowseFile,
  onSkipFileChange,
  formatFileSize,
}: TargetStepProps) {
  const [isMetricSelectOpen, setIsMetricSelectOpen] = useState(false);
  const { translations } = useTranslationStore();

  const selectedMeasurement = measurements.find((m) => m.measurement_id === targetMetric.metricId);
  const selectedMetricName = selectedMeasurement
    ? translate(translations, selectedMeasurement.name)
    : 'Select target metric';

  return (
    <div className="flex flex-col gap-8">
      <div className="flex max-w-2xl flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-neutral-700">Target metric</label>
          <Popover open={isMetricSelectOpen} onOpenChange={setIsMetricSelectOpen}>
            <PopoverTrigger asChild>
              <div className="w-full whitespace-pre rounded-md border border-neutral-100 bg-white p-2 shadow-sm">
                <span className="flex cursor-pointer items-center justify-between truncate text-sm">
                  {selectedMetricName}
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </span>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Command>
                <CommandInput placeholder="Search metrics..." />
                <CommandList>
                  <CommandEmpty>No metrics found.</CommandEmpty>
                  <CommandGroup>
                    {measurements.map((measurement) => (
                      <CommandItem
                        key={measurement.measurement_id}
                        value={measurement.measurement_id?.toString()}
                        onSelect={() => {
                          onMetricChange(toNumber(measurement.measurement_id));
                          setIsMetricSelectOpen(false);
                        }}
                      >
                        <span>{translate(translations, measurement.name)}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <span className="text-sm font-medium text-neutral-700">Target metric file</span>
            <p className="mt-2 text-sm font-normal text-neutral-600">Each row must have the following columns:</p>
            <ul className="ml-6 mt-2 list-disc text-sm font-normal text-neutral-600">
              <li>Date</li>
              <li>Sales</li>
              <li>Revenue</li>
            </ul>
            <p className="mt-2 text-sm font-normal text-neutral-600">
              The file cannot contain additional columns, special characters or missing fields.
            </p>
          </div>

          {!targetMetric.skipFile && (
            <div
              {...getRootProps()}
              className={clsx(
                'flex min-h-[216px] cursor-pointer flex-col items-center justify-center gap-2 rounded-lg bg-neutral-50 p-4 transition-colors',
                isDragActive && 'border-emerald-400 bg-emerald-50',
                'hover:bg-[#FBFCFC]',
              )}
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' stroke='%23C7C8D1FF' stroke-width='4' stroke-dasharray='12%2c12' stroke-dashoffset='0' stroke-linecap='butt'/%3e%3c/svg%3e")`,
              }}
            >
              <input {...getInputProps()} />
              {isUploading ? (
                <div className="flex flex-col items-center gap-3 text-neutral-400">
                  <Spinner size="24px" variant="light" />
                  <span className="text-xs">Uploading file…</span>
                </div>
              ) : targetMetric.file ? (
                <div className="flex flex-col items-center gap-2 text-sm text-neutral-600">
                  <span className="font-medium">{targetMetric.file.name}</span>
                  <span className="text-xs text-neutral-400">{formatFileSize(targetMetric.file.size)}</span>
                  <div className="flex gap-2">
                    <Button
                      size="small"
                      variant="contained"
                      color="secondary"
                      onClick={(event) => {
                        event.stopPropagation();
                        onReplaceFile();
                      }}
                    >
                      Replace file
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      color="secondary"
                      onClick={(event) => {
                        event.stopPropagation();
                        onBrowseFile();
                      }}
                    >
                      Browse
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center text-neutral-600">
                  <div className="mb-1 text-mdlg font-medium text-neutral-500">Upload CSV file</div>
                  <div className="mb-4 text-sm font-normal text-neutral-400">
                    {isDragActive
                      ? 'Drop the CSV file here'
                      : 'Drag and drop a CSV file here, or click the button to select a file.'}
                  </div>
                  <Button
                    color="primary"
                    size="small"
                    variant="contained"
                    onClick={(event) => {
                      event.stopPropagation();
                      onBrowseFile();
                    }}
                    startAdornment={<FileText className="h-4 w-4" />}
                  >
                    Select CSV file
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="skip-file"
            checked={targetMetric.skipFile}
            onChange={(e) => onSkipFileChange(e.target.checked)}
            className="h-4 w-4 rounded border-neutral-300 text-emerald-500 focus:ring-emerald-400"
          />
          <label htmlFor="skip-file" className="cursor-pointer text-sm font-normal text-neutral-600">
            I don't have target metric data to add to this file
          </label>
        </div>
      </div>
    </div>
  );
}
