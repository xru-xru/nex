import React, { useEffect, useState } from 'react';

import { DateSelector } from '../../../../components/DateSelector';
import FormGroup from '../../../../components/Form/FormGroup';
import TextField from '../../../../components/TextField';
import Typography from '../../../../components/Typography';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components-ui/Select';
import usePortfolioEventsStore from '../../../../store/portfolio-events';
import { Info } from 'lucide-react';
import Tooltip from '../../../../components/Tooltip';
import { NexoyaEventCategory, NexoyaEventImpact, NexoyaPortfolioEvent } from '../../../../types';
import { getCategoryInfo } from '../../../../utils/portfolioEvents';
import dayjs from 'dayjs';
import Button from '../../../../components/Button';
import { useDropzone } from 'react-dropzone';
import { CancelIcon } from '../../../../components/icons';
import { useLazyQuery } from '@apollo/client';
import { PREVIEW_EVENT_DUPLICATES_QUERY } from '../../../../graphql/portfolioEvents/queryPreviewDuplicates';
import { useTeam } from '../../../../context/TeamProvider';
import { useRouteMatch } from 'react-router';

export interface PortfolioEventDetailsProps {
  portfolioEventToEdit?: NexoyaPortfolioEvent;
}

export const PortfolioEventDetails: React.FC<PortfolioEventDetailsProps> = ({ portfolioEventToEdit }) => {
  const { teamId } = useTeam();
  const match = useRouteMatch<{ portfolioID: string }>();
  const portfolioId = parseInt(match.params.portfolioID, 10);

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [existingAsset, setExistingAsset] = useState<string | null>(null);

  const { newPortfolioEvent, setNewPortfolioEvent } = usePortfolioEventsStore();

  const [checkDuplicates] = useLazyQuery(PREVIEW_EVENT_DUPLICATES_QUERY);

  useEffect(() => {
    // Set existing asset from portfolioEventToEdit if available
    if (portfolioEventToEdit?.assetUrl) {
      setExistingAsset(portfolioEventToEdit.assetUrl);
    }
  }, [portfolioEventToEdit]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement> | { target: { name: string; value: boolean | string } },
  ) => {
    const { name, value } = e.target;
    setNewPortfolioEvent({ [name]: value });
  };

  const categoryOptions = Object.entries(NexoyaEventCategory).map(([_, value]) => ({
    value,
    label: getCategoryInfo(value)?.title,
  }));

  const impactOptions = [
    { value: 'SMALL', label: 'Small impact' },
    { value: 'LARGE', label: 'Large impact' },
  ];

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'jpg/png/jpeg/mp4/gif': ['.jpg', '.png', '.jpeg', '.mp4', '.gif'],
    },
    maxSize: 1024 * 1024 * 50, // 50 MB
    multiple: false,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        handleFileUpload(acceptedFiles[0]);
      }
    },
  });

  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
    setExistingAsset(null); // Clear existing asset when new file is uploaded
    setNewPortfolioEvent({ file });
  };

  const handleRemoveAsset = () => {
    if (uploadedFile) {
      setUploadedFile(null);
      setNewPortfolioEvent({ file: null });
    }
    if (existingAsset) {
      setExistingAsset(null);
      // Mark the asset for removal
      setNewPortfolioEvent({
        file: null,
        removeAsset: true,
      });
    }
  };

  const isVideo = (url: string) => {
    return url.endsWith('.mp4') || url.endsWith('.mov') || url.endsWith('.webm');
  };

  return (
    <div className="flex max-w-lg flex-col gap-10 py-8">
      <FormGroup className="!m-0">
        <div className="mb-2 text-lg text-neutral-900">Event name</div>
        <TextField
          id="name"
          name="name"
          value={newPortfolioEvent?.name}
          onChange={handleChange}
          placeholder="What is the event"
          onBlur={(e) => {
            checkDuplicates({
              variables: {
                portfolioId,
                teamId,
                portfolioEventNames: [e.target.value],
              },
            }).then(({ data }) => {
              if (data?.previewEventDuplicates?.duplicatePortfolioEvents?.length > 0) {
                // Handle duplicates
                handleChange({
                  target: {
                    name: 'hasDuplicateName',
                    value: true,
                  },
                });
              } else {
                handleChange({
                  target: {
                    name: 'hasDuplicateName',
                    value: false,
                  },
                });
              }
            });
          }}
        />
        {newPortfolioEvent?.hasDuplicateName ? (
          <span className="mt-1 text-xs font-medium text-red-500">
            This event name already exists in your portfolio. Please choose a different name.
          </span>
        ) : null}
      </FormGroup>

      <FormGroup className="!m-0">
        <div className="mb-2 text-lg font-normal text-neutral-500">Description (optional)</div>
        <TextField
          id="description"
          name="description"
          value={newPortfolioEvent?.description}
          onChange={handleChange}
          placeholder="Add some additional information or something notable about the event."
          multiline
          rows={3}
        />
      </FormGroup>

      <FormGroup className="!m-0">
        <Typography variant="h3" style={{ marginBottom: 8 }}>
          Timeframe
        </Typography>
        <DateSelector
          dateFrom={dayjs(newPortfolioEvent?.start)?.toDate() || new Date()}
          dateTo={dayjs(newPortfolioEvent?.end)?.toDate() || new Date()}
          disableAfterDate={null}
          onDateChange={(dateRange) => {
            setNewPortfolioEvent({
              start: dateRange.from,
              end: dateRange.to,
            });
          }}
          style={{ width: '100%' }}
        />
      </FormGroup>

      <FormGroup className="!m-0">
        <div className="mb-2 text-lg text-neutral-900">Category</div>
        <Select
          value={newPortfolioEvent?.category || undefined}
          onValueChange={(value) => setNewPortfolioEvent({ category: value as NexoyaEventCategory })}
        >
          <SelectTrigger className="w-full border-[#E3E3E8] bg-transparent p-2">
            <SelectValue placeholder="What kind of event is it?" />
          </SelectTrigger>
          <SelectContent className="w-full">
            {categoryOptions.map((option) => (
              <div key={option.value} className="flex items-center">
                <SelectItem value={option.value}>{getCategoryInfo(option.value)?.title}</SelectItem>
                <Tooltip
                  popperProps={{
                    style: {
                      zIndex: 3500,
                    },
                  }}
                  style={{
                    maxWidth: 500,
                    wordBreak: 'break-word',
                  }}
                  placement="right"
                  variant="dark"
                  content={getCategoryInfo(option.value)?.description}
                >
                  <div className="px-2">
                    <Info className="h-4 w-4" />
                  </div>
                </Tooltip>
              </div>
            ))}
          </SelectContent>
        </Select>
      </FormGroup>

      <FormGroup className="!m-0">
        <div className="mb-2 text-lg text-neutral-900">Impact</div>
        <Select
          value={newPortfolioEvent?.impact || undefined}
          onValueChange={(value) => setNewPortfolioEvent({ impact: value as NexoyaEventImpact })}
        >
          <SelectTrigger className="w-full border-[#E3E3E8] bg-transparent p-2">
            <SelectValue placeholder="How impactful is the event?" />
          </SelectTrigger>
          <SelectContent>
            {impactOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormGroup>
      <FormGroup>
        <div className="mb-1 text-lg text-neutral-900">Visual asset (optional)</div>
        {uploadedFile ? (
          <div className="mt-3 flex w-full flex-col items-start gap-2 rounded-md border border-neutral-100 px-3 py-2 text-neutral-400">
            {uploadedFile.type.startsWith('video/') ? (
              <video
                src={URL.createObjectURL(uploadedFile)}
                className="h-[216px] w-full rounded-md object-cover"
                controls
                autoPlay
                loop
              >
                <source src={URL.createObjectURL(uploadedFile)} type={uploadedFile.type} />
                Your browser does not support the video tag.
              </video>
            ) : (
              <img
                src={URL.createObjectURL(uploadedFile)}
                alt="Uploaded file"
                className="h-[216px] w-full rounded-md object-cover"
              />
            )}
            <div className="flex items-center justify-start gap-2">
              {uploadedFile.name}
              <span onClick={handleRemoveAsset} className="cursor-pointer hover:text-neutral-800">
                <CancelIcon style={{ height: 10 }} />
              </span>
            </div>
          </div>
        ) : existingAsset ? (
          <div className="mt-3 flex w-full flex-col items-start gap-2 rounded-md border border-neutral-100 px-3 py-2 text-neutral-400">
            {isVideo(existingAsset) ? (
              <video src={existingAsset} className="h-[216px] w-full rounded-md object-cover" controls>
                <source src={existingAsset} />
                Your browser does not support the video tag.
              </video>
            ) : (
              <img src={existingAsset} alt="Event asset" className="h-[216px] w-full rounded-md object-cover" />
            )}
            <div className="flex items-center justify-start gap-2">
              Current asset
              <span onClick={handleRemoveAsset} className="cursor-pointer hover:text-neutral-800">
                <CancelIcon style={{ height: 10 }} />
              </span>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm font-normal text-neutral-400">
              Upload an image or video that represents the event.
            </div>
            <div
              {...getRootProps()}
              className="flex min-h-[216px] cursor-pointer flex-col items-center justify-center gap-2 rounded-lg bg-neutral-50 p-4 transition-colors hover:bg-[#FBFCFC]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' stroke='%23C7C8D1FF' stroke-width='4' stroke-dasharray='12%2c12' stroke-dashoffset='0' stroke-linecap='butt'/%3e%3c/svg%3e")`,
              }}
            >
              <input {...getInputProps()} />
              <div className="text-center text-neutral-600">
                <div className="mb-1 text-mdlg text-neutral-500">Upload asset file</div>
                <div className="mb-2 text-sm font-normal text-neutral-500">
                  {isDragActive
                    ? 'Drop the asset file here'
                    : 'Drag and drop your asset here, or click the button to select a file.'}
                </div>
                <div className="mb-4 text-xs text-neutral-300">Accepted file types: JPEG, PNG, SVG, MP4</div>
                <Button color="primary" size="small" variant="contained">
                  Select file
                </Button>
              </div>
            </div>
          </>
        )}
      </FormGroup>
    </div>
  );
};
