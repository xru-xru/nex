import { toast } from 'sonner';

import { NexoyaOptimizationTasks } from '../../../types';

import { useCancelOptimization } from '../../../graphql/optimization/mutationCancelOptimization';

import { useDialogState } from '../../../components/Dialog';
import { OptimizationWarningDialog } from '../../../components/OptimizationWarningDialog';
import MenuList from 'components/ArrayMenuList';
import ButtonIcon from 'components/ButtonIcon';
import { useMenu } from 'components/Menu';
import MenuItem from 'components/MenuItem';
import Panel from 'components/Panel';
import SvgEllipsisV from 'components/icons/EllipsisV';

interface Props {
  portfolioId: number;
  optimizationId: number;
  optimizationStages: NexoyaOptimizationTasks;
}

export function OptimizationTDM({ portfolioId, optimizationId }: Props) {
  const { anchorEl: anchorElTDM, open: openTDM, toggleMenu: toggleMenuTDM, closeMenu: closeMenuTDM } = useMenu();
  const [cancelOptimization, { loading: loadingCancelOptimization }] = useCancelOptimization({
    portfolioId,
    optimizationId,
  });
  const { isOpen: isCancelDialogOpen, toggleDialog: toggleCancelDialog } = useDialogState({
    initialState: false,
  });

  return (
    <div ref={anchorElTDM} style={{ display: 'flex', justifyContent: 'flex-end' }}>
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
      <Panel
        container={anchorElTDM.current}
        anchorEl={anchorElTDM.current}
        open={openTDM}
        onClose={closeMenuTDM}
        placement="bottom-end"
        style={{
          minWidth: 138,
        }}
      >
        <MenuList color="dark">
          <MenuItem onClick={() => toggleCancelDialog()}>Cancel optimization</MenuItem>
        </MenuList>
      </Panel>
      <OptimizationWarningDialog
        title="Are you sure you want to cancel the optimization?"
        subtitle="This action is irreversible, and you will not be able to see it again."
        ctaText="Cancel optimization"
        isDialogOpen={isCancelDialogOpen}
        handleCloseDialog={toggleCancelDialog}
        loading={loadingCancelOptimization}
        onSubmit={() =>
          cancelOptimization()
            .then(() => {
              toast.success('The optimization was cancelled');
            })
            .catch((reason) => toast.error(reason.message))

            .finally(() => toggleCancelDialog())
        }
      />
    </div>
  );
}
