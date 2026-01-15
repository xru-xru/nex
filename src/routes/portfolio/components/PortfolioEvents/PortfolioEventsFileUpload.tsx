import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Button from '../../../../components/Button';
import { CancelIcon } from '../../../../components/icons';
import SvgInfoCircle from '../../../../components/icons/InfoCircle';
import { nexyColors } from '../../../../theme';
import { LabelLight } from '../../../../components/InputLabel/styles';
import Papa from 'papaparse';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components-ui/Select';
import {
  NexoyaBulkCreatePortfolioEventInput,
  NexoyaBulkUpdatePortfolioEventInput,
  NexoyaEventCategory,
  NexoyaEventImpact,
  NexoyaPortfolioEvent,
} from '../../../../types';
import Spinner from '../../../../components/Spinner';
import { toast } from 'sonner';
import { DuplicateEventsDialog } from './DuplicateEventsDialog';
import { PREVIEW_EVENT_DUPLICATES_QUERY } from '../../../../graphql/portfolioEvents/queryPreviewDuplicates';
import { useTeam } from '../../../../context/TeamProvider';
import { useRouteMatch } from 'react-router';
import { useLazyQuery } from '@apollo/client';
import { useTenantName } from '../../../../hooks/useTenantName';
import { convertToPortfolioEvents } from '../../utils/portfolio-events';

interface PortfolioEventColumnMapping {
  name: string;
  description?: string;
  start: string;
  end: string;
  category: string;
  impact: string;
}

const NEEDED_COLUMNS = [
  { field: 'name' as const, label: 'Event name' },
  { field: 'description' as const, label: 'Event description', optional: true },
  { field: 'start' as const, label: 'Start date' },
  { field: 'end' as const, label: 'End date' },
  { field: 'category' as const, label: 'Event category' },
  { field: 'impact' as const, label: 'Impact level' },
];

const DEFAULT_MAPPING: PortfolioEventColumnMapping = {
  name: '',
  description: '',
  start: '',
  end: '',
  category: '',
  impact: '',
};

export interface DuplicateEvent {
  existing: NexoyaPortfolioEvent;
  new: Partial<NexoyaPortfolioEvent>;
}

export const PortfolioEventsFileUpload = ({ setParsedEvents }) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState([]);
  const tenantName = useTenantName();
  const [parsedHeaders, setParsedHeaders] = useState<string[]>([]);
  const [columnMapping, setColumnMapping] = useState<PortfolioEventColumnMapping>(DEFAULT_MAPPING);
  const [mappingValid, setMappingValid] = useState(false);
  const [loading, setLoading] = useState(false);

  const match = useRouteMatch();
  const portfolioId = parseInt(match.params.portfolioID, 10);

  const { teamId } = useTeam();

  const [checkDuplicates] = useLazyQuery(PREVIEW_EVENT_DUPLICATES_QUERY);

  const [duplicateEvents, setDuplicateEvents] = useState<NexoyaPortfolioEvent[]>([]);
  const [showDuplicatesDialog, setShowDuplicatesDialog] = useState(false);

  useEffect(() => {
    const checkDuplicatesOnUpload = async () => {
      if (!uploadedFile || parsedHeaders.length !== Object.keys(columnMapping).length) {
        return;
      }

      const newEvents = convertToPortfolioEvents({
        parsedData,
        columnMapping,
      });

      setLoading(true);
      try {
        let duplicates = [];
        if (teamId && portfolioId && newEvents?.every((event) => event.name)) {
          const { data } = await checkDuplicates({
            variables: {
              portfolioId,
              teamId,
              portfolioEventNames: newEvents.map((event) => event.name),
            },
          });

          duplicates = data?.previewEventDuplicates?.duplicatePortfolioEvents;
        }

        if (duplicates?.length > 0) {
          setDuplicateEvents(duplicates);
          setShowDuplicatesDialog(true);
        } else {
          setParsedEvents({ eventsToCreate: newEvents });
        }
      } catch (error) {
        console.error('Error checking duplicates:', error);
      } finally {
        setLoading(false);
      }
    };

    checkDuplicatesOnUpload();
  }, [
    columnMapping,
    mappingValid,
    uploadedFile,
    parsedHeaders,
    teamId,
    portfolioId,
    convertToPortfolioEvents,
    setParsedEvents,
  ]);

  useEffect(() => {
    if (uploadedFile && parsedHeaders.length === Object.keys(columnMapping).length) {
      setLoading(true);
      setTimeout(() => {
        const events = convertToPortfolioEvents({
          parsedData,
          columnMapping,
        });
        setParsedEvents({ eventsToCreate: events });
        setLoading(false);
      }, 1000);
    }
  }, [columnMapping, mappingValid, uploadedFile]);

  useEffect(() => {
    if (uploadedFile && parsedHeaders?.length) {
      const detectColumn = (patterns: string[]): string => {
        return (
          parsedHeaders.find((header) =>
            patterns.some((pattern) => header.toLowerCase().includes(pattern.toLowerCase())),
          ) ?? ''
        );
      };

      setColumnMapping({
        name: detectColumn(['name', 'event name', 'title']),
        description: detectColumn(['description', 'desc']),
        start: detectColumn(['start', 'startDate', 'from']),
        end: detectColumn(['end', 'endDate', 'to']),
        category: detectColumn(['category', 'type']),
        impact: detectColumn(['impact', 'level', 'severity']),
      });
    }
  }, [uploadedFile, parsedHeaders]);

  const validateMapping = (mapping: PortfolioEventColumnMapping) => {
    const requiredFields: (keyof PortfolioEventColumnMapping)[] = ['name', 'start', 'end', 'category', 'impact'];
    return requiredFields.every((field) => mapping[field] !== '');
  };

  const handleColumnSelect = (field: keyof PortfolioEventColumnMapping, value: string) => {
    const newMapping = { ...columnMapping, [field]: value };
    setColumnMapping(newMapping);
    setMappingValid(validateMapping(newMapping));
  };

  const handleDuplicateResolution = (selections: Record<number, 'replace_with_new' | 'keep_existing'>) => {
    // Identify which events to keep and which to replace
    const eventsToCreate: NexoyaBulkCreatePortfolioEventInput[] = [];
    const eventsToUpdate: NexoyaBulkUpdatePortfolioEventInput[] = [];

    // Process each event
    convertToPortfolioEvents({
      parsedData,
      columnMapping,
    }).forEach((newEvent) => {
      const duplicate = duplicateEvents.find((d) => d.name === newEvent.name);

      if (!duplicate) {
        // Not a duplicate, will be created
        eventsToCreate.push({
          name: newEvent.name,
          description: newEvent.description,
          start: newEvent.start,
          end: newEvent.end,
          category: newEvent.category,
          impact: newEvent.impact,
        });
      } else if (selections[duplicate?.portfolioEventId] === 'replace_with_new') {
        // Duplicate marked for replacement
        eventsToUpdate.push({
          name: newEvent.name,
          description: newEvent.description,
          start: newEvent.start,
          end: newEvent.end,
          category: newEvent.category,
          impact: newEvent.impact,
        });
      }
      // Else: duplicate marked to keep existing - don't include in any array
    });

    // Pass both arrays to the parent
    setParsedEvents({
      eventsToCreate,
      eventsToUpdate,
    });

    setShowDuplicatesDialog(false);
    setDuplicateEvents([]);
  };

  const handleFileUpload = (file: File) => {
    if (file.type !== 'text/csv') {
      toast.error('Please upload a CSV file');
      return;
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          toast.error('Error parsing CSV file');
          console.error('Parse errors:', results.errors);
          return;
        }

        const headers = Object.keys(results.data[0] || {});
        setUploadedFile(file);
        setParsedData(results.data);
        setParsedHeaders(headers);
      },
      error: (error) => {
        toast.error('Failed to parse CSV file');
        console.error('Parse error:', error);
      },
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'text/csv': ['.csv'],
    },
    multiple: false,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        handleFileUpload(acceptedFiles[0]);
      }
    },
  });

  const generateSampleCSV = () => {
    const sampleData = [
      {
        name: 'Black Friday Campaign',
        description: 'Special marketing campaign for Black Friday',
        start: '2024-11-29',
        end: '2024-11-30',
        category: NexoyaEventCategory.PromotionAndDiscounts,
        impact: NexoyaEventImpact.Large,
      },
      {
        name: 'Negative external effects',
        description: '',
        start: '2024-11-29',
        end: '2024-11-30',
        category: NexoyaEventCategory.NegativeExternalEffects,
        impact: NexoyaEventImpact.Small,
      },
      {
        name: 'Positive external effects',
        description: '',
        start: '2024-11-29',
        end: '2024-11-30',
        category: NexoyaEventCategory.PositiveExternalEffects,
        impact: NexoyaEventImpact.Small,
      },
      {
        name: 'Price increase',
        description: '',
        start: '2024-11-29',
        end: '2024-11-30',
        category: NexoyaEventCategory.PriceIncrease,
        impact: NexoyaEventImpact.Large,
      },
      {
        name: 'Brand Awareness',
        description: '',
        start: '2024-11-29',
        end: '2024-11-30',
        category: NexoyaEventCategory.BrandAwareness,
        impact: NexoyaEventImpact.Small,
      },
      {
        name: 'Product launch',
        description: '',
        start: '2024-11-29',
        end: '2024-11-30',
        category: NexoyaEventCategory.ProductLaunch,
        impact: NexoyaEventImpact.Small,
      },
      {
        name: 'Tracking issues',
        description: '',
        start: '2024-11-29',
        end: '2024-11-30',
        category: NexoyaEventCategory.TrackingIssue,
        impact: NexoyaEventImpact.Large,
      },
    ];

    const csv = Papa.unparse(sampleData);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'events_sample.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="flex max-w-xl flex-col gap-8 py-8">
      <div>
        <div className="text-[20px] font-medium tracking-normal">Upload event file</div>
        <div className="text-md font-normal text-neutral-500">
          Upload a CSV with at least one event to bulk upload to {tenantName}.
        </div>
      </div>
      <div className="line-height-2 text-sm font-medium tracking-normal text-neutral-300">
        Each event row should have the following columns:
        <ul className="list-disc">
          <li className="ml-4">Event name</li>
          <li className="ml-4">Event description (Optional)</li>
          <li className="ml-4">Start date and end date</li>
          <li className="ml-4">Event category</li>
          <li className="ml-4">Impact level</li>
        </ul>
        <div className="mt-3">It cannot contain additional columns, special characters or missing fields.</div>
      </div>
      <div className="flex flex-col gap-2">
        {loading ? (
          <div
            className="flex min-h-[216px] cursor-pointer flex-col items-center justify-center gap-2 rounded-lg bg-neutral-50 p-4 transition-colors hover:bg-[#FBFCFC]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' stroke='%23C7C8D1FF' stroke-width='4' stroke-dasharray='12%2c12' stroke-dashoffset='0' stroke-linecap='butt'/%3e%3c/svg%3e")`,
            }}
          >
            <input {...getInputProps()} disabled />
            <div className="text-center text-neutral-300">
              <Spinner size="24px" variant="light" />
              <div className="mt-3 text-xs">Uploading file and detecting columns...</div>
            </div>
          </div>
        ) : uploadedFile ? (
          <div className="flex flex-col gap-6">
            <div>
              <div className="mb-2 text-mdlg font-medium tracking-normal">Uploaded file</div>
              <div className="flex w-fit items-center gap-2 rounded-md border border-neutral-100 px-3 py-2 text-neutral-400">
                {uploadedFile.name}
                <span onClick={() => setUploadedFile(null)} className="cursor-pointer hover:text-neutral-800">
                  <CancelIcon style={{ height: 10 }} />
                </span>
              </div>
            </div>
            <div className="text-md font-normal text-neutral-500">
              Review the columns from your CSV to make sure they align with the predefined column names below.
            </div>
            <div>
              <div className="rounded-md border border-neutral-100 bg-neutral-50 px-3 py-2 font-normal text-neutral-600">
                <SvgInfoCircle style={{ color: nexyColors.neutral400, height: 16, width: 16, margin: '4px 8px 0 0' }} />
                Separate start date and end date columns will be merged into one column called “Timeframe”.
              </div>
            </div>
            <div className="rounded-lg border border-neutral-100">
              <div className="grid grid-cols-[1fr_1fr] px-6 py-3 font-medium text-neutral-600">
                <LabelLight className="!mb-0 px-0 font-semibold !text-neutral-300">Column name</LabelLight>
                <LabelLight className="!mb-0 px-2 text-end font-semibold !text-neutral-300">CSV column</LabelLight>
              </div>
              <div className="grid grid-cols-[1fr_1fr] border-t border-neutral-100 px-6 py-1">
                {NEEDED_COLUMNS.map(({ field, label, optional }) => (
                  <React.Fragment key={field}>
                    <div className="my-auto py-4">
                      {label}
                      {optional && <span className="text-neutral-300"> (Optional)</span>}
                    </div>
                    <div className="flex justify-end py-4 text-end font-normal">
                      <Select value={columnMapping[field]} onValueChange={(value) => handleColumnSelect(field, value)}>
                        <SelectTrigger className="w-fit border-none bg-white p-2">
                          <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
                        </SelectTrigger>
                        <SelectContent>
                          {parsedHeaders.map((header) => (
                            <SelectItem key={header} value={header}>
                              {header}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full">
            <div
              {...getRootProps()}
              className="flex min-h-[216px] cursor-pointer flex-col items-center justify-center gap-2 rounded-lg bg-neutral-50 p-4 transition-colors hover:bg-[#FBFCFC]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' stroke='%23C7C8D1FF' stroke-width='4' stroke-dasharray='12%2c12' stroke-dashoffset='0' stroke-linecap='butt'/%3e%3c/svg%3e")`,
              }}
            >
              <input {...getInputProps()} />
              <div className="text-center text-neutral-600">
                <div className="mb-1 text-mdlg text-neutral-500">Upload CSV file</div>
                <div className="mb-4 text-sm font-normal text-neutral-400">
                  {isDragActive
                    ? 'Drop the CSV file here'
                    : 'Drag and drop a CSV file here, or click the button to select a file.'}
                </div>
                <Button color="primary" size="small" variant="contained">
                  Select CSV file
                </Button>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-start gap-1 text-xs text-neutral-300">
              <span>Not sure about the format?</span>
              <div
                onClick={generateSampleCSV}
                className="cursor-pointer font-medium underline transition-all hover:text-purple-300"
              >
                Download template CSV
              </div>
            </div>
          </div>
        )}
        <DuplicateEventsDialog
          duplicates={duplicateEvents}
          isOpen={showDuplicatesDialog}
          onClose={() => setShowDuplicatesDialog(false)}
          onConfirm={handleDuplicateResolution}
          numberOfImportedEvents={parsedData.length}
        />
      </div>
    </div>
  );
};
