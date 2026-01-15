import { Link } from 'react-router-dom';

import clsx from 'clsx';
import { get } from 'lodash';
import styled from 'styled-components';

import { NexoyaMeasurement } from '../../types/types';

import { buildKpiPath } from '../../routes/paths';

import { colorByKey } from '../../theme/utils';

import AvatarProvider from '../AvatarProvider';
import TypographyTranslation from '../TypographyTranslation';
import { CancelIcon } from '../icons';

type Props = {
  kpi: NexoyaMeasurement;
  className?: string;
  handleRemove?: any;
  // TODO: Adjust
  skipMeta?: boolean;
};
export const classes = {
  root: 'NEXYKpiPill',
};
const WrapChipStyled = styled.div`
  display: inline-flex;
  vertical-align: top;
  align-items: center;
  margin: 1px 12px 16px 1px;
  padding: 8px 15px;
  font-size: 14px;
  background-color: white;
  box-shadow: 0 0 0 1px rgba(223, 225, 237, 0.66), 0 2px 4px -1px rgba(7, 97, 52, 0.24);
  border-radius: 5px;
  color: ${colorByKey('darkGrey')};
  flex-shrink: 0;

  .NEXYAvatar {
    margin-right: 15px;
  }
`;
const LinkStyled = styled(Link)`
  display: flex;
  align-items: center;
  width: 175px;
`;
const RemoveButtonStyled = styled.div`
  margin-left: 15px;
  font-size: 10px;
  color: ${colorByKey('lightPeriwinkle')};
  cursor: pointer;
`;

function KpiPill({ kpi, handleRemove, className, skipMeta }: Props) {
  return (
    <WrapChipStyled className={clsx(className, classes.root)} data-cy="kpiPill">
      <LinkStyled to={skipMeta ? '' : buildKpiPath(kpi, {})}>
        <AvatarProvider providerId={kpi.provider_id} size={16} />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0,
          }}
        >
          <TypographyTranslation text={kpi.name} withTooltip />
          {!skipMeta && (
            <TypographyTranslation text={get(kpi, 'collection.title', '')} variant="subtitlePill" withTooltip />
          )}
        </div>
      </LinkStyled>
      <RemoveButtonStyled
        onClick={(e) => {
          e.stopPropagation();

          if (handleRemove) {
            handleRemove();
          }
        }}
      >
        <CancelIcon />
      </RemoveButtonStyled>
    </WrapChipStyled>
  );
}

export default KpiPill;
