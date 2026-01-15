import React from 'react';

import { NexoyaMeasurement } from '../../../types/types';
import { ThunkMutFn } from '../../../types/types.custom';

import ButtonIcon from '../../ButtonIcon';
import SvgPlusRegular from '../../icons/PlusRegular';
import SvgTimes from '../../icons/Times';

type Props = {
  kpi: NexoyaMeasurement;
  isSelected: boolean;
  onAddMutation: ThunkMutFn<NexoyaMeasurement>;
  onRemoveMutation: ThunkMutFn<NexoyaMeasurement>;
};

function TableCellAction({ isSelected, kpi, onAddMutation, onRemoveMutation }: Props) {
  const [loading, setLoading] = React.useState(false);
  const addMutation = onAddMutation(kpi);
  const removeMutation = onRemoveMutation(kpi);

  async function handleAction() {
    setLoading(true);

    if (!isSelected) {
      await addMutation();
    } else {
      await removeMutation();
    }

    setLoading(false);
  }

  return (
    <ButtonIcon
      disabled={loading}
      onClick={handleAction}
      color={isSelected ? 'danger' : 'primary'}
      variant="contained"
      style={{
        marginLeft: 'auto',
      }}
    >
      {isSelected ? <SvgTimes /> : <SvgPlusRegular />}
    </ButtonIcon>
  );
}

export default TableCellAction;
