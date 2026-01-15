import { Link } from 'react-router-dom';

import dayjs from 'dayjs';

import Text from 'components/Text';
import Typography from 'components/Typography';
import SvgGreenBell from 'components/icons/GreenBell';
import SvgPinkGauge from 'components/icons/PinkGauge';
import { buildPortfolioPath } from 'routes/paths';

import * as Styles from '../styles/Dashboard';

type Props = {
  data: any;
};

const formatDateToDaysAgo = (date) => {
  const now = dayjs();
  const givenDate = dayjs(date);
  const diffDays = now.diff(givenDate, 'day');
  return `${diffDays} days ago`;
};

export default function DashboardNotification({ data }: Props) {
  return (
    <Link to={buildPortfolioPath(data.payload?.portfolioId ?? 0)}>
      <Styles.Notification>
        <Styles.NotificationIcon>
          {data.type === 'BUDGET_APLICATION' ? <SvgGreenBell /> : <SvgPinkGauge />}
        </Styles.NotificationIcon>
        <div>
          <Text>{data.title}</Text>
          <Typography variant="subtitlePill">{formatDateToDaysAgo(data.date)}</Typography>
        </div>
      </Styles.Notification>
    </Link>
  );
}
