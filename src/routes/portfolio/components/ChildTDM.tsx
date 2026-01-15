import { get } from 'lodash';
import { toast } from 'sonner';

import { usePortfolio } from 'context/PortfolioProvider';
import { useRemoveContentRelationMutation } from 'graphql/portfolio/mutationUpdateContentRelation';

import MenuList from 'components/ArrayMenuList';
import ButtonAdornment from 'components/ButtonAdornment';
import ButtonIcon from 'components/ButtonIcon';
import ErrorMessage from 'components/ErrorMessage';
import MenuItem from 'components/MenuItem';
import Panel from 'components/Panel';
import SvgCloneRegular from 'components/icons/CloneRegular';
import SvgEllipsisV from 'components/icons/EllipsisV';
import SvgUnlink from 'components/icons/Unlink';
import { useDropdownMenu } from '../../../components/DropdownMenu';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../../components-ui/AlertDialog';
import React, { useState } from 'react';
import Checkbox from '../../../components/Checkbox';
import Button from '../../../components/Button';
import { NexoyaDiscoveredContentStatus, NexoyaPortfolioParentContent } from 'types';
import { useTeam } from 'context/TeamProvider';
import { useContentFilterStore } from 'store/content-filter';
import { updateApolloCache, updatePortfolioParentContentDiscoveredContentCache } from 'utils/cache';
import { PORTFOLIO_PARENT_CONTENTS_QUERY } from 'graphql/content/queryPortfolioContents';
import { buildPortfolioContentFilterVariables } from 'routes/portfolio/utils/content';

function ChildTDM({
  portfolioId,
  contentId,
  parentContent,
  isRemoveDisabled,
}: {
  portfolioId: number;
  contentId: number;
  parentContent: NexoyaPortfolioParentContent;
  isRemoveDisabled?: boolean;
}) {
  const [showAlert, setShowAlert] = useState(false);
  const [hideMessage, setHideMessage] = useState(localStorage.getItem('hideUnlinkMessage') === 'true');
  const { teamId } = useTeam();
  const filterStore = useContentFilterStore();
  const isRuleBased = parentContent.discoveredContent?.status !== NexoyaDiscoveredContentStatus.Manual;

  const {
    anchorEl: anchorElTDM,
    open: openTDM,
    toggleMenu: toggleMenuTDM,
    closeMenu: closeMenuTDM,
  } = useDropdownMenu();
  const {
    contentSelection: { reset },
  } = usePortfolio();
  const [removeContentRelation, { loading: loadingTDM, error: errorTDM }] = useRemoveContentRelationMutation({
    portfolioId,
    contentId,
  });

  async function handleUnlinkSubmit() {
    reset();
    try {
      const res = await removeContentRelation();

      if (get(res, 'data.removeContentRelation', null)) {
        toggleMenuTDM();
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
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
    }
  }

  const handleCheckboxChange = (checked: boolean) => {
    setHideMessage(checked);
    localStorage.setItem('hideUnlinkMessage', JSON.stringify(checked));
  };

  const handleConfirm = () => {
    handleUnlinkSubmit();
    setShowAlert(false);
  };

  const handleCancel = () => {
    setShowAlert(false);
  };

  const handleRemoveClick = () => {
    if (isRemoveDisabled) {
      return;
    }

    if (isRuleBased && !hideMessage) {
      setShowAlert(true);
    } else {
      handleUnlinkSubmit();
    }
  };

  return (
    <>
      <div ref={anchorElTDM}>
        <ButtonIcon
          active={openTDM}
          onClick={(e) => {
            e.stopPropagation();
            toggleMenuTDM();
          }}
        >
          <SvgEllipsisV
            style={{
              fontSize: 18,
            }}
          />
        </ButtonIcon>
        {openTDM ? (
          <Panel
            anchorEl={anchorElTDM.current}
            open={openTDM}
            onClose={closeMenuTDM}
            placement="bottom-end"
            popperProps={{
              style: {
                zIndex: 2200,
              },
            }}
            style={{
              minWidth: 138,
            }}
          >
            <MenuList color="dark">
              <MenuItem
                onClick={() => {
                  navigator.clipboard
                    .writeText(String(contentId))
                    .then(() => toast.message('Content ID copied to clipboard'));
                  toggleMenuTDM();
                }}
                buttonProps={{
                  startAdornment: (
                    <ButtonAdornment position="start">
                      <SvgCloneRegular />
                    </ButtonAdornment>
                  ),
                }}
              >
                Copy ID
              </MenuItem>
              <MenuItem
                key="link-content"
                async={true}
                loading={loadingTDM}
                disabled={loadingTDM || isRemoveDisabled}
                onClick={() => handleRemoveClick()}
                buttonProps={{
                  startAdornment: (
                    <ButtonAdornment position="start">
                      <SvgUnlink />
                    </ButtonAdornment>
                  ),
                }}
              >
                Remove
              </MenuItem>
            </MenuList>
          </Panel>
        ) : null}

        {errorTDM ? <ErrorMessage error={errorTDM} /> : null}
      </div>
      <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Change belong-to manually</AlertDialogTitle>
            <AlertDialogDescription className="!mt-3">
              <span className="font-light text-neutral-400">
                Removing this content's belong-to will switch the content's mode to "Manual" and will detach it from all
                rules defined in portfolio settings. The current rule configuration will not be affected.
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

export default ChildTDM;
