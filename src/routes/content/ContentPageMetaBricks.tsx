import { Fragment } from 'react';

import { BrickDataFormatted } from 'types/types.custom';

import metadataTypes from '../../constants/metadataTypes';

import Typography from '../../components/Typography';

import * as Styles from './styles/ContentPageMeta';
import { HeaderBrickStyled } from './styles/ContentPageMeta';

type Props = {
  data: Map<string, BrickDataFormatted>;
};

const keys = [
  'bidding_strategy',
  'bid_amount_micros',
  'budget_setting',
  'daily_budget_micros',
  'lifetime_budget_micros',
  'target_roas',
  'target_cost_per_metric_micros',
  'start_datetime',
  'end_datetime',
  'id',
];

export const ContentPageMetaBricks = ({ data }: Props) => (
  <Styles.BricksWrapper>
    {keys.map((key, i) => {
      const metadata = data.get(key);
      const metadataInfo = metadataTypes[key];
      const title = metadataInfo ? metadataInfo.name : null;

      return (
        <Fragment key={i}>
          <HeaderBrickStyled>
            <Styles.NameWrapStyled>
              <Typography component="span">{title}</Typography>
              {metadata?.value ? (
                <Typography variant="h4" component="span" dangerouslySetInnerHTML={{ __html: metadata?.value }} />
              ) : (
                <Typography style={{ color: '#C7C8D1' }}>Empty</Typography>
              )}
            </Styles.NameWrapStyled>
          </HeaderBrickStyled>
          {i < keys.length - 1 && <Styles.VerticalDivider />}
        </Fragment>
      );
    })}
  </Styles.BricksWrapper>
);
