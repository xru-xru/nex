import clsx from 'clsx';
import styled from 'styled-components';

import '../../theme/theme';
import { currencySymbol, useCurrencyStore } from 'store/currency-selection';

type Props = {
  amount: number;
  className?: string;
  withColor?: boolean;
  showDecimals?: boolean;
};
export const classes = {
  root: 'NEXYFormattedCurrency',
};

interface StyledWrapperFormattedCurrencyProps {
  withColor?: boolean;
  amount: number;
}

const StyledWrapper = styled.span<StyledWrapperFormattedCurrencyProps>`
  color: ${({ withColor, amount, theme }) =>
    withColor
      ? amount >= 0 // ? `${theme.colors.success}` // TODO: Figure out when to enable success coloring
        ? `default`
        : `${theme.colors.danger}`
      : 'default'};
`;

function FormattedCurrency({
  amount = 0,
  className = '',
  withColor = false,
  showDecimals = true, // Added a new prop for showing decimals
}: Props) {
  const { currency, numberFormat } = useCurrencyStore();

  // Modify the options based on showDecimals prop
  const formatOptions = {
    style: 'currency' as const,
    currency: currency,
    minimumFractionDigits: showDecimals ? 2 : 0, // Show 2 decimals if showDecimals is true, else 0
    maximumFractionDigits: showDecimals ? 2 : 0,
  };

  const formattedAmount = Intl.NumberFormat(numberFormat, formatOptions)
    .formatToParts(amount)
    .map((part) => (part.type === 'currency' ? currencySymbol[currency] : part.value))
    .join('');

  return (
    <StyledWrapper withColor={withColor} amount={amount} className={clsx(className, classes.root)}>
      {formattedAmount}
    </StyledWrapper>
  );
}

export default FormattedCurrency;
