import React from 'react';

import { get } from 'lodash';
import styled from 'styled-components';

import { NexoyaMeasurement } from '../../types/types';
import '../../types/types';
import { ThunkMutFn } from '../../types/types.custom';

import AvatarProvider from '../AvatarProvider';
import ButtonIcon from '../ButtonIcon';
import ErrorMessage from '../ErrorMessage';
import NameTranslation from '../NameTranslation';
import SvgTimes from '../icons/Times';

type Props = {
  kpi: NexoyaMeasurement;
  onRemoveMutation: ThunkMutFn<NexoyaMeasurement>;
  disabled: boolean;
};
const WrapStyled = styled.div<{
  readonly isDisabled?: boolean;
}>`
  background: #fff;
  padding: 5px 10px;
  border: 1px solid #eee;
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  opacity: ${({ isDisabled }) => (isDisabled ? '0.5' : '1')};
  transition: opacity 0.2 ease;
  margin: 5px 0 5px 0;
  width: 100%;

  & > div:first-child {
    margin-right: 10px;
  }

  & > button {
    margin-left: auto;
  }
`;
const TextWrapStyled = styled.div`
  overflow: hidden;
  margin-right: 10px;

  & > span {
    display: block;
  }
`;

function KpiChip({ kpi, onRemoveMutation, disabled }: Props) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const removeMutation = onRemoveMutation(kpi);

  async function handleRemoval() {
    setLoading(true);

    try {
      await removeMutation();
    } catch (err) {
      setError(err);
    }

    setLoading(false);
  }

  return (
    <>
      <WrapStyled isDisabled={loading} data-cy="KPIChip">
        <AvatarProvider providerId={kpi.provider_id} size={25} />
        <TextWrapStyled>
          <NameTranslation text={kpi.name || ''} width="90px" />
          <NameTranslation text={get(kpi, 'collection.title', '')} variant="secondary" width="90px" />
        </TextWrapStyled>
        <ButtonIcon
          color="danger"
          variant="contained"
          onClick={handleRemoval}
          disabled={disabled || loading}
          data-cy="removeKPIChip"
        >
          <SvgTimes />
        </ButtonIcon>
      </WrapStyled>
      {error && <ErrorMessage error={error} />}
    </>
  );
}

export default KpiChip;
