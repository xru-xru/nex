import { NexoyaMetric } from 'types';

import Text from 'components/Text';

import * as Styles from './styles/ContentPageMetricsTable';

import ContentPageMetricRow from './ContentPageMetricRow';

type Props = {
  items: NexoyaMetric[];
  contentId: number;
  from: string;
  to: string;
};

export default function ContentPageMetricTable({ items, contentId, from, to }: Props) {
  return (
    <Styles.WrapperStyled data-cy="contentPageMetricsTable">
      <Styles.HeaderStyled>
        <Text>Name</Text>
        <Styles.ValueStyled>Value</Styles.ValueStyled>
      </Styles.HeaderStyled>
      {items.map((item) => (
        <ContentPageMetricRow key={item.metric_id} metric={item} contentId={contentId} from={from} to={to} />
      ))}
    </Styles.WrapperStyled>
  );
}
