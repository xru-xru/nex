import { Link } from 'react-router-dom';

import { get } from 'lodash';

import { NexoyaCustomKpiConfigType, NexoyaMetric } from 'types';

import isCurrencyDatatype from 'utils/isCurrencyDatatype';

import FormattedCurrency from 'components/FormattedCurrency';
import NumberValue from 'components/NumberValue';
import { buildKpiPath } from 'routes/paths';

import * as Styles from './styles/ContentPageMetricRow';
import Typography from '../../components/Typography';
import { colorByKey } from '../../theme/utils';

type Props = {
  metric: NexoyaMetric;
  contentId: number;
  from: string;
  to: string;
};

export default function ContentPageMetricRow({ metric, contentId, from, to }: Props) {
  const percentage = get(metric, 'detail.valueChangePercentage', 0);
  const isSystemGeneratedCustomKpi = metric?.customKpiConfig?.configType === NexoyaCustomKpiConfigType.Placeholder;

  const kpiLink = buildKpiPath(
    {
      measurement_id: metric.metric_id,
      collection_id: contentId,
    },
    {
      dateFrom: from,
      dateTo: to,
    },
  );
  return (
    <>
      <Styles.GridRowStyled>
        <Link to={kpiLink}>
          {isSystemGeneratedCustomKpi ? (
            <Typography
              variant="h4"
              component="h2"
              withEllipsis
              style={{
                color: colorByKey('cloudyBlue'),
              }}
            >
              {metric?.name}
            </Typography>
          ) : (
            <Styles.TypographyTranslationStyled variant="h4" component="h2" text={metric?.name} withEllipsis />
          )}
        </Link>
        <Styles.ValueStyled>
          {isCurrencyDatatype(metric?.datatype) ? (
            <FormattedCurrency amount={metric?.detail?.value} />
          ) : (
            <NumberValue justify="center" value={metric?.detail?.value} datatype={metric?.datatype} />
          )}
          <Styles.ChangeStyled>
            <NumberValue value={percentage} textWithColor symbol="%" />
          </Styles.ChangeStyled>
        </Styles.ValueStyled>
      </Styles.GridRowStyled>
    </>
  );
}
