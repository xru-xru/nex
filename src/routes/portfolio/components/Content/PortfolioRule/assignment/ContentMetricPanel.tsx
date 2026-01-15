import React, { SyntheticEvent, useEffect, useState } from 'react';
import { ChevronsUpDown, ExternalLink } from 'lucide-react';
import { useTeam } from '../../../../../../context/TeamProvider';
import { useUpdateContentTargetMetric } from 'graphql/portfolio/mutationUpdateContentTargetMetric';
import {
  updateApolloCache,
  updatePortfolioParentContentDiscoveredContentCache,
  updatePortfolioParentContentFunnelStepMetricsCache,
} from '../../../../../../utils/cache';
import ErrorMessage from 'components/ErrorMessage';
import TypographyTranslation from 'components/TypographyTranslation';
import ButtonIcon from '../../../../../../components/ButtonIcon';
import {
  NexoyaMetricDefinitionV2,
  NexoyaPortfolioChildContent,
  NexoyaPortfolioContentFunnelStepMetricInput,
  NexoyaPortfolioParentContent,
} from '../../../../../../types';
import TextField from '../../../../../../components/TextField';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from 'components-ui/DropdownMenu';
import { nexyColors } from '../../../../../../theme';
import styled from 'styled-components';
import translate from '../../../../../../utils/translate';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../../../../../components-ui/AlertDialog';
import Button from '../../../../../../components/Button';
import { toast } from 'sonner';
import Checkbox from '../../../../../../components/Checkbox';
import { useDebounce } from 'use-debounce';
import { PORTFOLIO_PARENT_CONTENTS_QUERY } from '../../../../../../graphql/content/queryPortfolioContents';
import { buildPortfolioContentFilterVariables } from '../../../../utils/content';
import { useContentFilterStore } from '../../../../../../store/content-filter';
import useTranslationStore from '../../../../../../store/translations';
import { useUserQuery } from '../../../../../../graphql/user/queryUser';

const formatNoDataAsNone = (text: string) => (text === 'No data' ? 'None' : text);

// Function to escape special characters in a string
const escapeSpecialChars = (text: string) => {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};
const StyledTextField = styled(TextField)`
  .NEXYInputWrap {
    padding: 4px 6px;
    box-shadow: rgba(223, 225, 237, 0.2) 0 0 0 1px;
  }
`;

interface Props {
  item: NexoyaPortfolioChildContent | NexoyaPortfolioParentContent;
  portfolioId: number;
  funnelStepId: number;
  metricOptions: NexoyaMetricDefinitionV2[];
  parentContentId?: number;
  metricName: string | null;
  getLink: () => string | null;
  metricOptionsLoading: boolean;
  childHasMetricAssigned?: boolean; // Optional prop to indicate if child content has a metric assigned
}

function ContentMetricPanel({
  item,
  portfolioId,
  funnelStepId,
  metricOptions,
  parentContentId,
  metricName,
  getLink,
  metricOptionsLoading,
  childHasMetricAssigned,
}: Props) {
  const { teamId } = useTeam();

  const { translations } = useTranslationStore();

  const [isMounted, setIsMounted] = useState(false);

  const { data: userData } = useUserQuery();
  const isSupportUser = userData?.user?.activeRole?.name?.includes('support');

  const [searchTerm, setSearchTerm] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [hideMessage, setHideMessage] = useState(localStorage.getItem('hideMetricChangeMessage') || false);

  const [showAlert, setShowAlert] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const [filteredMetricOptions, setFilteredMetricOptions] = useState<NexoyaMetricDefinitionV2[]>(metricOptions);
  const [debouncedSearchTerm] = useDebounce(searchTerm, 150);

  const filterStore = useContentFilterStore();

  const isChildContent = item.__typename == 'PortfolioChildContent';
  const isRuleBased = !isChildContent
    ? item.discoveredContent?.status && item.discoveredContent?.status !== 'MANUAL'
    : false;

  const [, { error }, extendContentTargetMetric] = useUpdateContentTargetMetric({
    portfolioId,
    isChildContent,
  });

  useEffect(() => {
    setTimeout(() => setIsMounted(true), 100);
  }, []);

  const handleUpdateContentTargetMetric = async (
    contentFunnelStepMetric: NexoyaPortfolioContentFunnelStepMetricInput,
  ) => {
    try {
      const res = await extendContentTargetMetric({
        contentFunnelStepMetric,
      });

      if (res) {
        // Update metrics cache with new function
        updateApolloCache({
          query: PORTFOLIO_PARENT_CONTENTS_QUERY,
          variables: buildPortfolioContentFilterVariables(teamId, portfolioId, filterStore),
          updateFn: updatePortfolioParentContentFunnelStepMetricsCache({
            isChildContent,
            contentId: contentFunnelStepMetric.contentId,
            funnelStepId: contentFunnelStepMetric.funnelStepId,
            metricTypeId: contentFunnelStepMetric.metricTypeId,
            metricsList: metricOptions,
          }),
        });

        // Update discovered content status if it's rule-based
        if (isRuleBased) {
          const targetContentId = isChildContent ? parentContentId : getParentContentIdForContent();

          updateApolloCache({
            query: PORTFOLIO_PARENT_CONTENTS_QUERY,
            variables: buildPortfolioContentFilterVariables(teamId, portfolioId, filterStore),
            updateFn: updatePortfolioParentContentDiscoveredContentCache({
              portfolioContentId: targetContentId,
            }),
          });

          toast.info('Content switched to manual mode', {
            description:
              'The content has been detached from its rules defined in settings. The current configuration has not been affected.',
          });
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Helper function to get portfolioContentId from contentId
  const getParentContentIdForContent = () => {
    // Find the parent content that contains this contentId
    const parentContent = item.__typename === 'PortfolioParentContent' ? item : null; // You may need to search through parent contents to find the one with matching contentId

    return parentContent?.portfolioContentId;
  };

  const onContentSelection = (event: SyntheticEvent, metric: NexoyaMetricDefinitionV2) => {
    event.stopPropagation();
    handleUpdateContentTargetMetric({
      contentId: item?.content?.contentId,
      funnelStepId: funnelStepId,
      metricTypeId: metric.metricTypeId,
    });
    setIsMenuOpen(false); // Close the menu after selection
  };

  // Filter metrics based on the search term using a smart regex pattern
  useEffect(() => {
    if (!debouncedSearchTerm) {
      setFilteredMetricOptions(metricOptions);
      return;
    }

    const regexPattern = debouncedSearchTerm
      .split(' ')
      .filter(Boolean)
      .map((term) => escapeSpecialChars(term))
      .join('.*');

    const regex = new RegExp(regexPattern, 'i');

    const filtered = metricOptions.filter((metric) =>
      regex.test(formatNoDataAsNone(translate(translations, metric.name))),
    );

    setFilteredMetricOptions(filtered);
  }, [debouncedSearchTerm, metricOptions, translations]);

  useEffect(() => {
    const savedPreference = localStorage.getItem('hideMetricChangeMessage');
    if (savedPreference) {
      setHideMessage(JSON.parse(savedPreference));
    }
  }, []);

  const handleCheckboxChange = (checked: boolean) => {
    setHideMessage(checked);
    localStorage.setItem('hideMetricChangeMessage', JSON.stringify(checked));
  };

  // Reset the search term with a delay when the dropdown menu closes
  useEffect(() => {
    let resetTimeout: ReturnType<typeof setTimeout>;

    if (!isMenuOpen) {
      resetTimeout = setTimeout(() => {
        setSearchTerm('');
      }, 300);
    }

    // Cleanup timeout if the component unmounts or if the menu opens again before the timeout completes
    return () => {
      clearTimeout(resetTimeout);
    };
  }, [isMenuOpen]);

  const handleMetricChange = (callback: () => void) => {
    if (isRuleBased && !hideMessage) {
      setShowAlert(true);
      setPendingAction(() => callback);
    } else {
      callback();
    }
  };

  const handleConfirm = () => {
    if (pendingAction) {
      pendingAction();
    }
    setShowAlert(false);
    setPendingAction(null);
  };

  const handleCancel = () => {
    setShowAlert(false);
    setPendingAction(null);
  };

  const shouldRenderDropdown =
    isSupportUser &&
    !metricOptionsLoading &&
    metricOptions?.length &&
    (isChildContent ? true : !childHasMetricAssigned);

  return isMounted ? (
    <div className="flex w-full justify-between gap-2">
      {shouldRenderDropdown ? (
        <DropdownMenu modal={false} onOpenChange={(open) => setIsMenuOpen(open)}>
          <DropdownMenuTrigger asChild>
            <div className="flex cursor-pointer items-center rounded-md px-1.5 py-0.5 transition-all hover:bg-seasalt">
              <TypographyTranslation text={metricName} />
              <ChevronsUpDown className="ml-1 h-4 w-4" />
            </div>
          </DropdownMenuTrigger>
          {/* Show search input always inside the dropdown */}
          <DropdownMenuContent
            className="w-full min-w-[350px] font-normal"
            style={{ maxHeight: '400px', overflowY: 'auto' }} // Fixed height to avoid shrinking
          >
            <StyledTextField
              type="text"
              placeholder="Search metrics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '4px 8px', color: nexyColors.white }}
              onKeyDown={(e) => e.stopPropagation()} // Prevents keydown events from affecting focus
            />
            <div className="w-full px-3 py-2 font-normal">
              {filteredMetricOptions?.length
                ? filteredMetricOptions.map((metricDefinition) => (
                    <DropdownMenuItem
                      key={`optionalMetric-${metricDefinition.metricTypeId}`}
                      className="metricMenuItem"
                      onSelect={(e) =>
                        handleMetricChange(() => onContentSelection(e as unknown as SyntheticEvent, metricDefinition))
                      }
                      onMouseDown={(e) => e.preventDefault()} // Prevent focus shift on selection
                    >
                      <div className="flex items-center">
                        <TypographyTranslation text={formatNoDataAsNone(metricDefinition.name)} />
                      </div>
                    </DropdownMenuItem>
                  ))
                : 'No metrics found'}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div className="flex items-center rounded-md px-1.5 py-0.5">
          <TypographyTranslation text={metricName} />
          {metricOptionsLoading ? (
            <span className="ml-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-neutral-200 border-t-transparent"></span>
          ) : null}
        </div>
      )}

      {metricName !== 'None' && getLink() ? (
        <ButtonIcon
          variant="text"
          color="secondary"
          flat
          type="button"
          className="NEXYButtonMetric"
          onClick={(e) => {
            e.stopPropagation();
            window.open(getLink(), '_blank');
          }}
          style={{ padding: 4 }}
        >
          <ExternalLink className="h-4 w-4" />
        </ButtonIcon>
      ) : null}

      {error && <ErrorMessage error={error} />}

      {showAlert ? (
        <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Change funnel step metric manually</AlertDialogTitle>
              <AlertDialogDescription className="!mt-3">
                <span className="font-light text-neutral-400">
                  Changing this metric will switch this content’s mode to “Manual” and will detach it from all rules
                  defined in portfolio settings. The current rule configuration will not be affected.
                </span>
              </AlertDialogDescription>
              <div className="text-neutral-400">
                <Checkbox
                  label="Don't show this message again"
                  className="!pl-0 !font-normal"
                  checked={hideMessage}
                  onChange={(_, checked: boolean) => handleCheckboxChange(checked)}
                />
              </div>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <Button size="small" variant="contained" color="secondary" onClick={handleCancel}>
                Cancel
              </Button>
              <Button size="small" variant="contained" color="primary" onClick={handleConfirm}>
                Continue
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ) : null}
    </div>
  ) : (
    <div className="inline-block flex h-4 w-4 animate-spin justify-center rounded-full border-2 border-solid border-neutral-200 border-t-transparent"></div>
  );
}

export default ContentMetricPanel;
