import Typography from 'components/Typography';

import * as Styles from '../styles/Dashboard';

export default function DashboardPortfoliosHeader() {
  return (
    <Styles.PortfoliosHeader>
      <Typography variant="subtitlePill">NAME</Typography>
      <Typography variant="subtitlePill">GOAL</Typography>
      <Typography variant="subtitlePill">ACHIEVED</Typography>
      <Typography variant="subtitlePill">CPC / ROAS</Typography>
      <Typography variant="subtitlePill">AD SPEND</Typography>
      <Typography variant="subtitlePill">ACTUAL VS PLANNED SPEND</Typography>
    </Styles.PortfoliosHeader>
  );
}
