import { RouterHistory, withRouter } from 'react-router-dom';

import get from 'lodash/get';

import { NexoyaPortfolioV2 } from 'types';

import { useFlushCacheMutation } from 'graphql/cache/mutationFlushCache';
import { useCopyPortfolioMutation } from 'graphql/portfolio/mutationCopyPortfolio';

import Button from '../../components/Button';
import ShareDialog from '../../components/Share/ShareDialog';
import Share from '../../components/icons/Share';
import ButtonAdornment from 'components/ButtonAdornment';
import { useDialogState } from 'components/Dialog';
import { useSidePanelState } from 'components/SidePanel';
import SvgClone from 'components/icons/CloneRegular';
import SvgEllipsisV from 'components/icons/EllipsisV';
import SvgTrash from 'components/icons/Trash';
import SvgWarning from 'components/icons/Warning';
import { buildPortfolioPath } from 'routes/paths';

import PortfolioDeleteDialog from './PortfolioDeleteDialog';
import PortfolioEditMetaSidepanel from './PortfolioEditMetaSidepanel';
import { PortfolioFeatureFlagsManagementDialog } from './PortfolioFeatureFlagsManagementDialog';
import ShadowPortfolioSidePanel from './ShadowPortfolio/ShadowPortfolioSidePanel';
import { FetchPortfolioContentDialog } from './FetchPortfolioContentDialog';
import React from 'react';
import { Combine, Flag, RefreshCcw } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../components-ui/DropdownMenu';
import useUserStore from '../../store/user';

type Props = {
  portfolio: NexoyaPortfolioV2;
  history: RouterHistory;
};

function PortfolioHeaderMenu({ portfolio, history }: Props) {
  const { isSupportUser } = useUserStore()


  const { isOpen: isDeleteOpen, toggleDialog: toggleDelete } = useDialogState({
    initialState: false,
  });
  const { isOpen: isFeatureFlagsDialogOpen, toggleDialog: toggleFeatureFlagsDialog } = useDialogState({
    initialState: false,
  });
  const { isOpen: isFetchDialogOpen, toggleDialog: toggleFetchDialog } = useDialogState({
    initialState: false,
  });
  const { isOpen: isShareOpen, toggleDialog: toggleShare } = useDialogState({
    initialState: false,
  });
  const { isOpen: isEditOpen, toggleSidePanel: toggleEdit } = useSidePanelState();
  const { isOpen: isShadowPortfolioOpen, toggleSidePanel: toggleShadowPortfolio } = useSidePanelState();
  const [copyPortfolio] = useCopyPortfolioMutation({
    portfolioId: portfolio?.portfolioId,
  });

  const [flushCache] = useFlushCacheMutation({
    portfolioId: portfolio?.portfolioId,
  });

  async function handleCopy() {
    try {
      const res = await copyPortfolio();
      const portfolioId = get(res, 'data.copyPortfolio.portfolioId', null);

      if (portfolioId) {
        history.push(buildPortfolioPath(portfolioId));
        // refresh the page in order to have
        // a proper selectedFunnelStep in place
        history.go(0);
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
    }
  }

  async function handleCacheFlush() {
    try {
      await flushCache();
      setTimeout(() => window?.location?.reload(), 500);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
    }
  }

  if (!portfolio) {
    return;
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="contained"
            color="secondary"
            size="small"
            startAdornment={
              <ButtonAdornment>
                <SvgEllipsisV
                  style={{
                    fontSize: 18,
                    marginRight: 4,
                    marginLeft: -4,
                  }}
                />
              </ButtonAdornment>
            }
            data-cy="portfolioHeaderMenuButton"
          >
            More
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="font-normal">
          <DropdownMenuItem key="edit-portfolio2" data-cy="edit-portfolio2" onClick={toggleShare}>
            <Share className="mr-2 h-4 w-4" />
            <span>Share</span>
          </DropdownMenuItem>
          <DropdownMenuItem key="invalidate-cache" onClick={handleCacheFlush}>
            <SvgWarning className="mr-2 h-4 w-4" />
            <span>Hard Refresh</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            key="copy-portfolio2"
            data-cy="copy-portfolio2"
            onClick={() => {
              handleCopy();
            }}
          >
            <SvgClone className="mr-2 h-4 w-4" />
            <span>Duplicate</span>
          </DropdownMenuItem>
          {isSupportUser ? (
            <DropdownMenuItem
              key="shadow-portfolio"
              data-cy="shadow-portfolio"
              onClick={() => {
                toggleShadowPortfolio();
              }}
            >
              <Combine className="mr-2 h-4 w-4" />
              <span>Migrate SSPM</span>
            </DropdownMenuItem>
          ) : null}
          {isSupportUser ? (
            <DropdownMenuItem
              key="feature-flags-portfolio"
              data-cy="feature-flags-portfolio"
              onClick={() => {
                toggleFeatureFlagsDialog();
              }}
            >
              <Flag className="mr-2 h-4 w-4" />
              <span>Feature flags</span>
            </DropdownMenuItem>
          ) : null}
          {isSupportUser ? (
            <DropdownMenuItem
              key="fetch-measurements-portfolio"
              data-cy="fetch-measurements-portfolio"
              onClick={() => {
                toggleFetchDialog();
              }}
            >
              <RefreshCcw className="mr-2 h-4 w-4" />
              <span>Fetch measurements</span>
            </DropdownMenuItem>
          ) : null}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            key="delete-portfolio2"
            data-cy="delete-portfolio2"
            onClick={() => {
              toggleDelete();
            }}
            className="text-red-400"
          >
            <SvgTrash className="mr-2 h-4 w-4" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {isSupportUser ? (
        <PortfolioFeatureFlagsManagementDialog
          open={isFeatureFlagsDialogOpen}
          toggleDialog={toggleFeatureFlagsDialog}
          activeFeatureFlags={portfolio.featureFlags}
          portfolioId={portfolio?.portfolioId}
        />
      ) : null}
      <PortfolioDeleteDialog isOpen={isDeleteOpen} toggleDialog={toggleDelete} portfolio={portfolio} />
      <PortfolioEditMetaSidepanel isOpen={isEditOpen} onClose={toggleEdit} portfolio={portfolio} />
      <ShadowPortfolioSidePanel isOpen={isShadowPortfolioOpen} onClose={toggleShadowPortfolio} />
      <ShareDialog isOpen={isShareOpen} toggleDialog={toggleShare} type="portfolio" itemId={portfolio?.portfolioId} />
      <FetchPortfolioContentDialog
        portfolio={portfolio}
        isOpen={isFetchDialogOpen}
        onClose={toggleFetchDialog}
      />
    </>
  );
}

export default withRouter(PortfolioHeaderMenu);
