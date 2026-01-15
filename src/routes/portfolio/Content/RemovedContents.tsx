import Typography from '../../../components/Typography';
import { nexyColors } from '../../../theme';
import React, { useEffect, useState } from 'react';
import { useDiscoveredContentsQuery } from '../../../graphql/portfolioRules/queryDiscoveredContents';
import { NexoyaDiscoveredContentStatus } from '../../../types';
import { toast } from 'sonner';
import { useRouteMatch } from 'react-router';
import Spinner from '../../../components/Spinner';
import { useDialogState } from '../../../components/Dialog';
import { useTeam } from '../../../context/TeamProvider';
import { useDiscoverContentsStore } from '../../../store/discovered-contents';
import NoDataFound from '../NoDataFound';
import { useRestoreRemovedDiscoveredContentsMutation } from '../../../graphql/portfolioRules/mutationAddBackToDiscoveredContents';
import styled from 'styled-components';
import GridWrap from '../../../components/GridWrap';
import GridHeader from '../../../components/GridHeader';
import Checkbox from '../../../components/Checkbox';
import GridRow from 'components/GridRow';
import { TagStyled } from '../styles/OptimizationProposal';
import { useSidebar } from '../../../context/SidebarProvider';
import { cn } from '../../../lib/utils';
import Button from '../../../components/Button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
} from '../../../components-ui/AlertDialog';
import ButtonAsync from '../../../components/ButtonAsync';
import AvatarProvider from '../../../components/AvatarProvider';
import TypographyTranslation from '../../../components/TypographyTranslation';
import { PerformanceHeader } from '../components/PerformanceChartHeader';
import TextField from '../../../components/TextField';
import { escapeRegExp, uniq } from 'lodash';
import { usePortfolio } from '../../../context/PortfolioProvider';
import { useLabels } from '../../../context/LabelsProvider';
import { useImpactGroups } from '../../../context/ImpactGroupsProvider';
import useTabNewUpdates from '../../../hooks/useTabNewUpdates';

export const RemovedContents = () => {
  const { teamId } = useTeam();

  const match = useRouteMatch();
  const portfolioId = parseInt(match.params.portfolioID, 10);
  const [selectedRemovedContentIds, setSelectedRemovedContentIds] = useState<number[]>([]);
  const [search, setSearch] = useState('');

  const { setTabNewUpdates } = useDiscoverContentsStore();
  const { removedContents, setRemovedContents } = useDiscoverContentsStore();
  const {
    providers: { providersFilter },
  } = usePortfolio();

  const {
    filter: { labelsFilter },
  } = useLabels();

  const {
    filter: { impactGroupsFilter },
  } = useImpactGroups();

  const {
    isOpen: isAssignContentsOpen,
    openDialog: openAssignContents,
    closeDialog: closeAssignContents,
  } = useDialogState();

  const { sidebarWidth } = useSidebar();

  const [addBackToDiscoveredContents, { loading: loadingAddBackToDiscovered }] =
    useRestoreRemovedDiscoveredContentsMutation();

  const { refreshCountDiscoveredContents } = useTabNewUpdates(portfolioId);

  const { loading, data, refetch } = useDiscoveredContentsQuery({
    portfolioId,
    status: NexoyaDiscoveredContentStatus.Removed,
    onError: (error) => {
      console.error('Error fetching contents:', error);
      toast.error('Error fetching contents');
      setRemovedContents([]);
    },
  });

  useEffect(() => {
    if (data?.portfolioV2?.discoveredContents) {
      setRemovedContents(data.portfolioV2.discoveredContents);
    }
  }, [loading, data]);

  const filteredProviderIds = providersFilter.map((provider) => provider.provider_id);
  const filteredLabelIds = labelsFilter.map((label) => label.labelId);
  const filteredImpactGroupIds = impactGroupsFilter.map((impactGroup) => impactGroup.impactGroupId);

  const activeProviderIds = uniq(removedContents.map((item) => item?.content?.provider?.provider_id));

  const filteredContents = removedContents.filter((dsc) => {
    const content = dsc?.content;
    const normalizedSearch = search?.trim().toLowerCase() || '';
    const contentTitle = (dsc.content?.title || '').toLowerCase();

    const searchTerms = normalizedSearch.split(/\s+/).map((term) => escapeRegExp(term));
    const regex = new RegExp(searchTerms.join('.*'), 'i');

    const matchesProviders =
      !filteredProviderIds.length || filteredProviderIds.includes(dsc.content?.provider?.provider_id);

    const matchesLabels =
      // TODO: Add impact group & label to ContentV2
      // @ts-ignore
      !filteredLabelIds.length || (content?.label?.labelId && filteredLabelIds.includes(content.label.labelId));

    const matchesImpactGroups =
      !filteredImpactGroupIds.length ||
      // @ts-ignore
      (content.impactGroup?.impactGroupId && filteredImpactGroupIds.includes(content?.impactGroup.impactGroupId));

    const matchesSearch = !normalizedSearch || regex.test(contentTitle);

    return matchesProviders && matchesLabels && matchesImpactGroups && matchesSearch;
  });

  const handleAddBackToDiscoveredContents = async () => {
    await addBackToDiscoveredContents({
      variables: {
        contentIds: selectedRemovedContentIds,
        portfolioId,
        teamId,
      },
    }).then(() => {
      closeAssignContents();
      refetch();
      setSelectedRemovedContentIds([]);

      refreshCountDiscoveredContents();
    });
  };

  const handleSelectRemovedContent = (contentId: number) => {
    setSelectedRemovedContentIds((prev) =>
      prev.includes(contentId) ? prev.filter((id) => id !== contentId) : [...prev, contentId],
    );
  };

  return (
    <div>
      <div className="mb-6 flex justify-between">
        <div>
          <Typography style={{ color: nexyColors.neutral900 }} variant="h3">
            Removed contents
          </Typography>
          <Typography style={{ color: nexyColors.neutral400, marginTop: 8 }} variant="paragraph">
            See and manage contents removed from the portfolio.
          </Typography>
        </div>
      </div>

      <PerformanceHeader
        disabled={false}
        activeProviderIds={activeProviderIds}
        shouldRenderCustomization={false}
        shouldRenderLabelsFilter={false}
        renderSwitcher={() => null}
        renderAdditionalComponents={() => (
          <TextField
            style={{ width: 304 }}
            wrapProps={{ style: { padding: '6px 12px' } }}
            placeholder="Search removed contents..."
            value={search}
            name="search"
            labelVariant="light"
            onChange={(e) => setSearch(e?.target?.value)}
          />
        )}
      />
      {/* Table Container */}
      {loading ? (
        <Spinner />
      ) : filteredContents.length ? (
        <div className="mb-14 rounded-md border border-neutral-100">
          <WrapStyled>
            <GridWrap className="!pb-0">
              <GridHeader
                className="border-neutral-100"
                style={{ justifyItems: 'start', borderBottom: `1px solid ${nexyColors.neutral100}` }}
              >
                <div>
                  <Checkbox
                    checked={selectedRemovedContentIds?.length === filteredContents?.length}
                    indeterminate={
                      selectedRemovedContentIds?.length > 0 &&
                      selectedRemovedContentIds?.length < filteredContents?.length
                    }
                    onChange={() => {
                      if (selectedRemovedContentIds?.length === filteredContents?.length) {
                        setSelectedRemovedContentIds([]);
                      } else {
                        setSelectedRemovedContentIds(filteredContents.map((c) => c?.content?.contentId));
                      }
                    }}
                  />
                </div>
                <div>
                  <span>Content Name</span>
                </div>
                <div>
                  <span>Channel</span>
                </div>
                <div>
                  <span>Account</span>
                </div>
                <div>
                  <span>Content Level</span>
                </div>
              </GridHeader>

              {filteredContents?.map((discoveredContent) => (
                <GridRow className="!p-4" key={discoveredContent.content?.contentId}>
                  <div>
                    <Checkbox
                      checked={selectedRemovedContentIds.includes(discoveredContent?.content?.contentId)}
                      onChange={() => handleSelectRemovedContent(discoveredContent?.content?.contentId)}
                    />
                  </div>
                  <div className="flex items-center">
                    <Typography
                      withTooltip={discoveredContent?.content?.title.length > 30}
                      withEllipsis
                      style={{ maxWidth: 230 }}
                    >
                      {discoveredContent?.content?.title}
                    </Typography>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-500">
                    <AvatarProvider providerId={discoveredContent?.content?.provider?.provider_id} size={24} />
                    <TypographyTranslation text={discoveredContent?.content?.provider?.name} />
                  </div>
                  <div className="flex items-center text-neutral-500">
                    <Typography>{discoveredContent?.content?.parent?.title}</Typography>
                  </div>
                  <div className="flex items-center text-neutral-500">
                    <TagStyled bgColor="#eaeaea">{discoveredContent?.content?.contentType?.name}</TagStyled>
                  </div>
                </GridRow>
              ))}
            </GridWrap>
          </WrapStyled>
        </div>
      ) : (
        <NoDataFound
          style={{ height: 200 }}
          title="You don't have any removed contents"
          subtitle="You will see them appear here once you remove a content from the portfolio."
        />
      )}
      <div
        style={{ width: `calc(100% - ${sidebarWidth})`, left: sidebarWidth }}
        className={cn(
          'fixed bottom-0 border-t border-t-neutral-100 bg-seasalt px-8 py-5 transition-all',
          selectedRemovedContentIds.length ? 'opacity-100' : 'pointer-events-none z-[-1] opacity-0',
        )}
      >
        <div className="flex justify-between">
          <Button color="tertiary" variant="contained" onClick={() => setSelectedRemovedContentIds([])}>
            Cancel
          </Button>

          <Button onClick={openAssignContents} color="primary" variant="contained">
            Add back to discovered contents
          </Button>
        </div>
      </div>
      <AlertDialog open={isAssignContentsOpen}>
        <AlertDialogContent>
          <div>
            <AlertDialogTitle>
              <div className="mb-2 text-[20px] font-medium tracking-normal"> Add back to discovered contents</div>
            </AlertDialogTitle>
            <AlertDialogDescription>
              <div className="text-md font-normal text-neutral-500">
                The contents will go back to discovered contents and will be available for assignment. If there are no
                portfolio rules that match this content, it will not appear in the discovered contents list.
              </div>
            </AlertDialogDescription>
          </div>

          <AlertDialogFooter className="items-end">
            <AlertDialogAction>
              <ButtonAsync
                disabled={loadingAddBackToDiscovered}
                onClick={closeAssignContents}
                variant="contained"
                color="secondary"
                size="small"
              >
                Cancel
              </ButtonAsync>
            </AlertDialogAction>

            <AlertDialogAction>
              <ButtonAsync
                onClick={handleAddBackToDiscoveredContents}
                disabled={loadingAddBackToDiscovered}
                loading={loadingAddBackToDiscovered}
                variant="contained"
                color="primary"
                size="small"
              >
                Add back to discovered contents
              </ButtonAsync>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

const WrapStyled = styled.div`
  width: 100%;

  .NEXYCSSGrid {
    min-width: 100%;
    padding: 0 16px;
    grid-template-columns: 80px 1fr 1fr 1fr 1fr;

    border-bottom: 0;
  }
`;
