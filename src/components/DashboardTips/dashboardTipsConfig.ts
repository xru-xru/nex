import { PATHS } from '../../routes/paths';

const dashboardTipsConfig = [
  {
    content:
      'Did you notice the question mark icons next to some of the titles and metrics? When you click on the icon, a help center article will open, giving you more insights into the feature or metric.',
    link: 'https://www.nexoya.com/help/',
  },
  {
    content:
      'Did you know that you can define the metrics you want to get anomaly notifications on? Go to the metrics and add the ones that are of relevance to you and your team, by adding the star.',
    link: PATHS.APP.KPIS,
  },
  {
    content:
      'You can now compare different time ranges within one KPI, by clicking the “Compare” button in a metric and selecting “Dates“.',
    link: PATHS.APP.KPIS,
  },
  {
    content:
      'Have you wondered how you can stay updated with nexoya and get notified about all the awesome new integrations and features? Follow us on our LinkedIn.',
    link: 'https://www.linkedin.com/company/nexoya/',
  },
  {
    content:
      'Have you ever wondered what affect exchange rates fluctuations may have on your business? Activate the integration to find out.',
    link: PATHS.APP.SETTINGS_INTEGRATIONS,
  },
  {
    content:
      'Did you know that correlations are considered significant, if they are higher than 0.7 positively or -0.7 negatively correlated?',
    link: PATHS.APP.CORRELATIONS,
  },
];
export default dashboardTipsConfig;
