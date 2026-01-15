import React, { useEffect, useState } from 'react';

import { useMutation } from '@apollo/client';
import { toast } from 'sonner';

import { NexoyaImpactGroup, NexoyaPortfolioParentContent } from 'types';

import { useTeam } from '../../../../context/TeamProvider';
import { ASSIGN_IMPACT_GROUP_TO_PORTFOLIO_CONTENT_MUTATION } from '../../../../graphql/impactGroups/mutationAssignImpactGroupToPortfolioContent';

import { track } from '../../../../constants/datadog';
import { EVENT } from '../../../../constants/events';

import Typography from '../../../../components/Typography';
import Button from 'components/Button';
import ButtonAdornment from 'components/ButtonAdornment';
import {
  updateApolloCache,
  updatePortfolioParentContentDiscoveredContentCache,
  updatePortfolioParentContentImpactGroupCache,
} from '../../../../utils/cache';
import { ChevronsUpDown } from 'lucide-react';
import { usePortfolio } from '../../../../context/PortfolioProvider';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../../../components-ui/AlertDialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../../components-ui/DropdownMenu';
import Checkbox from '../../../../components/Checkbox';
import { PORTFOLIO_PARENT_CONTENTS_QUERY } from '../../../../graphql/content/queryPortfolioContents';
import { buildPortfolioContentFilterVariables } from '../../utils/content';
import { useContentFilterStore } from '../../../../store/content-filter';

interface Props {
  parentContent: NexoyaPortfolioParentContent;
  portfolioId: number;
}
export function ContentImpactGroupPanel({ parentContent, portfolioId }: Props) {
  const { teamId } = useTeam();
  const [showAlert, setShowAlert] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const [hideMessage, setHideMessage] = useState(localStorage.getItem('hideMetricChangeMessage') || false);

  const filterStore = useContentFilterStore();
  const {
    portfolioV2Info: {
      meta: { data: portfolioMeta },
    },
  } = usePortfolio();

  const impactGroups = portfolioMeta?.impactGroups;
  const isRuleBased = parentContent.discoveredContent?.status !== 'MANUAL';

  const [assignImpactGroupToPortfolioContent, { loading }] = useMutation(
    ASSIGN_IMPACT_GROUP_TO_PORTFOLIO_CONTENT_MUTATION,
  );

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

  const handleImpactGroupChange = (callback: () => void) => {
    if (isRuleBased && !hideMessage) {
      setShowAlert(true);
      setPendingAction(() => callback);
    } else {
      callback();
    }
  };

  function handleAddContentToImpactGroup(impactGroup: NexoyaImpactGroup) {
    const updateCaches = () => {
      assignImpactGroupToPortfolioContent({
        notifyOnNetworkStatusChange: false,
        variables: {
          contentIds: [parentContent?.content?.contentId],
          impactGroupId: impactGroup.impactGroupId,
          portfolioId,
          teamId,
        },
      })
        .then(({ data }) => {
          if (data?.assignImpactGroupToPortfolioContents) {
            // Update impact group cache
            updateApolloCache({
              query: PORTFOLIO_PARENT_CONTENTS_QUERY,
              variables: buildPortfolioContentFilterVariables(teamId, portfolioId, filterStore),
              updateFn: updatePortfolioParentContentImpactGroupCache({
                portfolioContentIds: [parentContent?.portfolioContentId],
                impactGroup,
              }),
            });

            // Update discovered content status if it's rule-based
            if (isRuleBased) {
              updateApolloCache({
                query: PORTFOLIO_PARENT_CONTENTS_QUERY,
                variables: buildPortfolioContentFilterVariables(teamId, portfolioId, filterStore),
                updateFn: updatePortfolioParentContentDiscoveredContentCache({
                  portfolioContentId: parentContent?.portfolioContentId,
                }),
              });
              toast.info('Content switched to manual mode', {
                description:
                  'The content has been detached from its rules defined in settings. The current configuration has not been affected.',
              });
            }

            track(EVENT.CONTENT_CHANGE_IMPACT_GROUP, {
              contentId: parentContent?.content?.contentId,
              impactGroupId: impactGroup.impactGroupId,
            });
          }
        })
        .catch((err) => {
          toast(err.message);
          console.error(err);
        });
    };

    handleImpactGroupChange(updateCaches);
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="text"
            color="tertiary"
            flat
            type="button"
            className="NEXYButtonMetric !rounded-md !px-1.5 !py-0.5 hover:bg-seasalt"
            endAdornment={
              <ButtonAdornment position="end">
                <ChevronsUpDown
                  className={`h-4 w-4 ${parentContent?.impactGroup?.name ? 'text-blue-grey' : 'text-neutral-200'}`}
                />
              </ButtonAdornment>
            }
          >
            {parentContent?.impactGroup?.name ? (
              parentContent?.impactGroup?.name
            ) : (
              <span className="text-neutral-200">None</span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="max-h-[500px] min-w-[200px] overflow-auto">
          {impactGroups?.length ? (
            impactGroups?.map((impactGroup: NexoyaImpactGroup) => (
              <DropdownMenuItem
                key={`impactGroup-${impactGroup.impactGroupId}`}
                disabled={loading}
                onSelect={(e) => {
                  e.preventDefault();
                  handleAddContentToImpactGroup(impactGroup);
                }}
              >
                <Typography>{impactGroup.name}</Typography>
              </DropdownMenuItem>
            ))
          ) : (
            <DropdownMenuItem disabled>
              <span className="text-neutral-400">No impact groups available</span>
            </DropdownMenuItem>
          )}
          {parentContent?.impactGroup?.impactGroupId ? (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                key={`label-unassign-${parentContent?.impactGroup?.impactGroupId}`}
                disabled={loading}
                onSelect={() =>
                  // @ts-ignore
                  handleAddContentToImpactGroup({
                    impactGroupId: null,
                    name: '',
                  })
                }
              >
                <span className="text-red-400">Unassign</span>
              </DropdownMenuItem>
            </>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Change impact group manually</AlertDialogTitle>
            <AlertDialogDescription className="!mt-3">
              <span className="font-light text-neutral-400">
                Changing this impact group will switch this content’s mode to “Manual” and will detach it from all rules
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
    </>
  );
}
