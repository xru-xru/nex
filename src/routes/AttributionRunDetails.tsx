import React, { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import MainContent from '../components/MainContent';
import Typography from '../components/Typography';
import Button from '../components/Button';
import { toast } from 'sonner';
import dayjs from 'dayjs';
import { NexoyaAttributionModel } from '../types';
import { useFindAttributionModelByIdQuery } from '../graphql/attributionModel/queryFindAttributionModelById';
import BackButton from '../components/Sidebar/components/BackButton';
import { useSidebar } from '../context/SidebarProvider';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components-ui/AlertDialog';
import SvgDownload from 'components/icons/Download';
import AvatarProvider from '../components/AvatarProvider';

// Mock data for the model data table
const MOCK_CHANNELS = [
  { name: 'Facebook Leads', providerId: 1 }, // Facebook
  { name: 'Facebook Retargeting', providerId: 1 }, // Facebook
  { name: 'Google Display', providerId: 2 }, // Google Ads
  { name: 'Google PMAC', providerId: 2 }, // Google Ads
  { name: 'Linkedin retargeting', providerId: 5 }, // LinkedIn
  { name: 'Google Ads', providerId: 2 }, // Google Ads
  { name: 'Instagram', providerId: 4 }, // Instagram
  { name: 'Criteo', providerId: 12 }, // Criteo
];

const CompareModelsDialog = ({
  isOpen,
  onClose,
  currentModelName,
}: {
  isOpen: boolean;
  onClose: () => void;
  currentModelName?: string;
}) => {
  const handleDownload = () => {
    // TODO: Implement download functionality
    toast.message('Download functionality coming soon');
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent className="max-w-[90vw] gap-0 p-0">
        <div className="px-6 py-5">
          <AlertDialogHeader className="p-0">
            <AlertDialogTitle className="text-left">Compare models</AlertDialogTitle>
          </AlertDialogHeader>
          <Typography variant="paragraph" style={{ color: '#6b7280', marginTop: 8 }}>
            Compare this model's data with data from the previous attribution model.
          </Typography>
        </div>
        <div className="h-px w-full bg-[#E5E5E6]" />
        <div className="px-6 py-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Current Model Table */}
            <div>
              <Typography variant="h4" style={{ color: '#1f2937', marginBottom: 12 }}>
                {currentModelName || '[Current model]'}
              </Typography>
              <div className="overflow-hidden rounded-lg border border-neutral-100">
                <table className="w-full">
                  <thead className="bg-neutral-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">
                        Content type
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">
                        Modelled metric
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">
                        Factor
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">
                        Result
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 bg-white">
                    {MOCK_CHANNELS.map((channel, idx) => (
                      <tr key={idx} className="hover:bg-neutral-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <AvatarProvider providerId={channel.providerId} size={20} />
                            <div className="text-xs text-neutral-900">{channel.name}</div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs text-neutral-600">[placeholder]</td>
                        <td className="px-4 py-3 text-xs text-neutral-600">[placeholder]</td>
                        <td className="px-4 py-3 text-xs text-neutral-600">[placeholder]</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Previous Model Table */}
            <div>
              <Typography variant="h4" style={{ color: '#1f2937', marginBottom: 12 }}>
                [Previous model]
              </Typography>
              <div className="overflow-hidden rounded-lg border border-neutral-100">
                <table className="w-full">
                  <thead className="bg-neutral-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">
                        Content type
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">
                        Modelled metric
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">
                        Factor
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">
                        Result
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 bg-white">
                    {MOCK_CHANNELS.map((channel, idx) => (
                      <tr key={idx} className="hover:bg-neutral-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <AvatarProvider providerId={channel.providerId} size={20} />
                            <div className="text-xs text-neutral-900">{channel.name}</div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs text-neutral-600">[placeholder]</td>
                        <td className="px-4 py-3 text-xs text-neutral-600">[placeholder]</td>
                        <td className="px-4 py-3 text-xs text-neutral-600">[placeholder]</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="h-px w-full bg-[#E5E5E6]" />
        <AlertDialogFooter className="flex-row justify-between px-6 py-5">
          <Button onClick={handleDownload} color="secondary" variant="contained" className="gap-2">
            <SvgDownload />
            Download
          </Button>
          <Button onClick={onClose} color="primary" variant="contained">
            Close
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

function AttributionRunDetails() {
  const { attributionID } = useParams<{ attributionID: string }>();
  const { sidebarWidth } = useSidebar();
  const { data } = useFindAttributionModelByIdQuery({ attributionModelId: attributionID, skip: !attributionID });

  const [isCompareDialogOpen, setIsCompareDialogOpen] = useState(false);

  const initialAttributionRun = data?.findAttributionModelById;

  const effectiveRun: NexoyaAttributionModel | null = useMemo(() => {
    if (!initialAttributionRun) return null;
    return { ...initialAttributionRun, files: initialAttributionRun.files || [] };
  }, [initialAttributionRun]);

  const handleCompareModels = () => {
    setIsCompareDialogOpen(true);
  };

  const handleAcceptModel = () => {
    // TODO: Implement accept model functionality
    toast.success('Model accepted');
  };

  const handleRejectModel = () => {
    // TODO: Implement reject model functionality
    toast.error('Model rejected');
  };

  return (
    <MainContent className="sectionToPrint">
      <div className="w-full pb-24">
        {/* Header */}
        <div>
          <BackButton />

          <div className="mb-6 flex items-center justify-between">
            <div>
              <Typography variant="h2" style={{ color: '#1f2937', marginBottom: 8 }}>
                {effectiveRun?.name}
              </Typography>
              <div className="flex items-center space-x-4">
                <Typography variant="caption" style={{ color: '#6b7280' }}>
                  {effectiveRun && (
                    <>
                      Created {dayjs(effectiveRun.createdAt).format('MMM D, YYYY')} • Last updated{' '}
                      {dayjs(effectiveRun.updatedAt).format('MMM D, YYYY HH:mm')}
                    </>
                  )}
                </Typography>
              </div>
            </div>
            <div>
              <Button color="secondary" variant="contained" onClick={handleCompareModels}>
                Compare models
              </Button>
            </div>
          </div>
        </div>

        {/* Model Data Section */}
        <div className="mb-6">
          <div className="mb-4">
            <Typography variant="h3" style={{ color: '#1f2937', marginBottom: 8 }}>
              Model data
            </Typography>
          </div>

          <div className="overflow-hidden rounded-lg border border-neutral-100">
            <table className="w-full">
              <thead className="bg-neutral-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    Content type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    Modelled metric
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    Factor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    Result
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 bg-white">
                {MOCK_CHANNELS.map((channel, idx) => (
                  <tr key={idx} className="hover:bg-neutral-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <AvatarProvider providerId={channel.providerId} size={24} />
                        <div className="text-sm text-neutral-900">{channel.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-600">[placeholder]</td>
                    <td className="px-6 py-4 text-sm text-neutral-600">[placeholder]</td>
                    <td className="px-6 py-4 text-sm text-neutral-600">[placeholder]</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-t-neutral-100 bg-neutral-50">
        <div style={{ marginLeft: sidebarWidth }} className="px-8 py-5">
          <div className="flex justify-end gap-4">
            <Button onClick={handleRejectModel} color="tertiary" variant="contained">
              Reject model
            </Button>
            <Button onClick={handleAcceptModel} color="primary" variant="contained">
              Accept model
            </Button>
          </div>
        </div>
      </div>

      <CompareModelsDialog
        isOpen={isCompareDialogOpen}
        onClose={() => setIsCompareDialogOpen(false)}
        currentModelName={effectiveRun?.name}
      />
    </MainContent>
  );
}

export default AttributionRunDetails;
