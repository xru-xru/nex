import clsx from 'clsx';
import styled from 'styled-components';

import { NexoyaDataType } from '../../types/types';
import '../../types/types';

import { formatNumber } from '../../utils/formater';
import isCurrencyDatatype from '../../utils/isCurrencyDatatype';

import '../../theme/theme';

import FormattedCurrency from '../FormattedCurrency';
import { ThemeStyled } from '../../theme';
import { ValueArrowIcon } from '../icons';
import { useCurrencyStore } from 'store/currency-selection';

type Variants = 'positive' | 'default' | 'negative';
type Props = {
  arrowWithColor?: boolean;
  className?: string;
  datatype?: NexoyaDataType;
  justify?: 'flex-start' | 'center' | 'flex-end';
  lowerIsBetter?: boolean | null;
  noValue?: boolean;
  showArrow?: boolean;
  style?: Record<string, any>;
  symbol?: string;
  textWithColor?: boolean;
  showChangePrefix?: boolean;
  // whether to show + or - in front of number
  title?: string;
  value: number;
  variant?: Variants;
  customColors?: Record<string, any>;
  numberFormatProp?: string; // en-US or de-CH string
};
export const classes = {
  root: 'NEXYNumberValue',
};
const WrapStyled = styled.div<{
  readonly justify: string;
}>`
  display: flex;
  align-items: center;
  justify-content: ${({ justify }) => justify};
`;
export const SymbolStyled = styled.span`
  display: inline-block;
`;
const ValueStyled = styled.span<{
  readonly variant: Variants;
  readonly customColors?: Record<string, string>;
  readonly theme: ThemeStyled;
}>`
  display: inline-flex;
  align-items: center;
  color: ${({ variant, theme, customColors }) => {
    if (variant === 'positive') return customColors ? customColors.success : theme.colors.success;
    if (variant === 'negative') return customColors ? customColors.danger : theme.colors.danger;
    if (variant === 'default') return 'currentColor';
    return 'currentColor';
  }};

  ${SymbolStyled} {
    &:first-child {
      margin-right: 2px;
    }
    &:last-child {
      margin-left: 2px;
    }
  }
`;
const IconWrapStyled = styled.span<{
  readonly colorVariant: Variants;
  readonly arrowVariant?: Variants;
  readonly theme: ThemeStyled;
}>`
  display: inline-block;
  color: ${({ colorVariant, theme }) => {
    if (colorVariant === 'positive') return theme.colors.success;
    if (colorVariant === 'negative') return theme.colors.danger;
    if (colorVariant === 'default') return 'currentColor';
    return 'currentColor';
  }};
  transform: ${({ arrowVariant }) => {
    if (arrowVariant === 'negative') {
      return 'rotate(180deg)';
    }

    return 'rotate(0)';
  }};
  margin-left: 5px;
  position: relative;
  top: -1px;
`;

const NumberValue = ({
  arrowWithColor,
  className,
  datatype,
  justify = 'flex-start',
  lowerIsBetter,
  noValue = false,
  showArrow,
  style = {},
  symbol,
  textWithColor,
  showChangePrefix,
  title,
  value,
  variant,
  customColors,
  numberFormatProp,
}: Props) => {
  const numberValue = !value ? 0 : value;
  const datatypeSymbol = symbol ? symbol : datatype ? datatype.symbol : '';
  const isSuffix = datatype ? datatype.suffix : true;
  const { numberFormat } = useCurrencyStore();
  let calcVariant = variant;
  let calcArrow: Variants = 'default';

  if (!variant && numberValue > 0) {
    calcVariant = 'positive';
    calcArrow = 'positive';
  }

  if (!variant && numberValue === 0) {
    calcVariant = 'default';
  }

  if (!variant && numberValue < 0) {
    calcVariant = 'negative';
    calcArrow = 'negative';
  }

  // TODO: Rework this. At the moment, we need to do too many checks since the "calcVariant" is used in the color as well as the arrow.
  if (lowerIsBetter && numberValue < 0) {
    calcVariant = 'positive';
  } else if (lowerIsBetter && numberValue > 0) {
    calcVariant = 'negative';
  }

  const isCurrency = isCurrencyDatatype(datatype);

  if (isCurrency) {
    return <FormattedCurrency amount={value} />;
  }

  const showArrowForSure = showArrow && numberValue !== 0;
  const formattedNumber = formatNumber(
    isCurrency ? Math.abs(numberValue) : numberValue,
    numberFormatProp ?? numberFormat,
  );

  return (
    <WrapStyled style={style} title={title} justify={justify} className={clsx(className, classes.root)}>
      <ValueStyled variant={textWithColor ? calcVariant : 'default'} customColors={customColors}>
        {/*{isNegativeMoney ? '-' : ''}*/}
        {showChangePrefix && variant === 'positive' ? <span>+</span> : null}
        {!isSuffix && <SymbolStyled>{datatypeSymbol}</SymbolStyled>}
        <span>{noValue ? ' - ' : formattedNumber}</span>
        {isSuffix ? <SymbolStyled>{datatypeSymbol}</SymbolStyled> : null}
      </ValueStyled>
      {showArrowForSure ? (
        <IconWrapStyled arrowVariant={calcArrow} colorVariant={arrowWithColor ? calcVariant : 'default'}>
          <ValueArrowIcon />
        </IconWrapStyled>
      ) : null}
    </WrapStyled>
  );
};

export default NumberValue;
