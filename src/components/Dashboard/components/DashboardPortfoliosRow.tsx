import { Link } from 'react-router-dom';

import { capitalize } from 'lodash';
import { nexyColors } from 'theme';

import { buildPortfolioPathWithDates } from '../../../utils/portfolio';

import SpendProgressBar from 'components/SpendProgressBar';
import Text from 'components/Text';

import * as Styles from '../styles/Dashboard';
import { useCurrencyStore } from 'store/currency-selection';

type Props = {
  data: any;
  counter: number;
};

export const chartColors = [
  nexyColors.greenTeal,
  nexyColors.lilac,
  nexyColors.pumpkinOrange,
  nexyColors.azure,
  nexyColors.brightLilac,
  nexyColors.dandelion,
  nexyColors.lightPeriwinkle,
  nexyColors.orangeyRed,
  nexyColors.purpleish,
  nexyColors.slateGray,
];

export default function DashboardPortfoliosRow({ data, counter }: Props) {
  const { currency, numberFormat } = useCurrencyStore();

  return (
    <Styles.PortfolioRow>
      <Styles.FlexCell>
        <Styles.ColorMark color={chartColors[counter]} />
        <Link to={buildPortfolioPathWithDates(data)}>{data.title}</Link>
      </Styles.FlexCell>
      <Styles.FlexCell>
        <Text>{capitalize(data.goal)}</Text>
      </Styles.FlexCell>
      <Styles.FlexCell>
        <Text>{data.achieved ?? '-'}</Text>
      </Styles.FlexCell>
      <Styles.FlexCell>
        <Text>
          {typeof data.roas === 'number'
            ? `${Intl.NumberFormat(numberFormat, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
              }).format(data.roas)}%`
            : typeof data.costPer === 'number'
              ? Intl.NumberFormat(numberFormat, {
                  style: 'currency',
                  currency,
                }).format(data.costPer)
              : '-'}
        </Text>
      </Styles.FlexCell>
      <Styles.FlexCell>
        <Text>
          {typeof data.adSpend?.realized === 'number'
            ? Intl.NumberFormat(numberFormat, {
                style: 'currency',
                currency,
                maximumFractionDigits: 0,
                minimumFractionDigits: 0,
              }).format(data.adSpend?.realized)
            : '-'}
        </Text>
      </Styles.FlexCell>
      <div>
        <SpendProgressBar percentage={data.adSpend?.percentage ?? 0} />
      </div>
    </Styles.PortfolioRow>
  );
}