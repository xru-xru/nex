import { NexoyaPortfolioDashboardNotification } from 'types';

import LoadingPlaceholder from 'components/LoadingPlaceholder';

import * as Styles from '../styles/Dashboard';

import DashboardNotification from './DashboardNotification';

type Props = {
  notifications: NexoyaPortfolioDashboardNotification[];
  loading: boolean;
};

export default function DashboardNotifications({ notifications, loading }: Props) {
  return (
    <Styles.Notifications>
      <Styles.NotificationsTitle>Your notifications</Styles.NotificationsTitle>
      {loading && (
        <Styles.LoaderWrap>
          <LoadingPlaceholder />
        </Styles.LoaderWrap>
      )}
      {!loading && !notifications.length && <Styles.Notification>Currently no notifications</Styles.Notification>}
      {!loading &&
        notifications.map((notification, index) => <DashboardNotification key={index} data={notification} />)}
    </Styles.Notifications>
  );
}
