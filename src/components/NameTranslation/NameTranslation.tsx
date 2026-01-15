import { get } from 'lodash';
import styled, { css } from 'styled-components';

import { useTranslationsQuery } from '../../graphql/translation/queryTranslations';

import translate from '../../utils/translate';

import { ThemeStyled } from '../../theme';
import Text from '../Text';

type HTMLTypes = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
type Variants = 'primary' | 'secondary' | 'strong' | 'title' | 'subtitle' | 'caption';
type Props = {
  capitalize?: boolean;
  children?: any;
  className?: string;
  color?: 'gray';
  component?: HTMLTypes;
  display?: 'flex' | 'inline-flex' | 'inline' | 'block' | 'inline-block';
  iconAfter?: React.Component<{}> | null;
  iconBefore?: React.Component<{}> | null;
  iconSize?: 'small' | 'normal';
  iconVariant?: 'caption';
  id?: string;
  // Comment: this is for accessibility reasosn
  prefix?: string;
  suffix?: string;
  text: string;
  title?: string;
  variant?: Variants;
  withEllipsis?: boolean;
  style?: Record<string, any>;
  width?: string;
};
// TODO: This should be a variant of the text. I want to reuse this in Portfolio, but without NexoyaTranslation.
const TextCStyled = styled(Text)<{
  readonly display?: string;
  readonly variant: any;
  readonly theme: ThemeStyled;
  readonly color?: string;
}>`
  display: ${({ display }) => display || 'block'};
  ${({ variant }) => {
    if (variant === 'secondary') {
      return css`
        font-size: 0.825em;
        opacity: 0.5;
      `;
    }

    return '';
  }};

  font-weight: ${({ variant }) => (variant === 'strong' ? 'bold' : 'normal')};
  color: ${({ color }) => color || 'inherit'};
`;

const NameTranslation = (props: Props) => {
  const { data } = useTranslationsQuery();
  const translations = get(data, 'translations', []);
  return (
    //@ts-expect-error
    <TextCStyled {...props} title={translate(translations, props.text ? props.text : '')}>
      {String(props.prefix ? props.prefix : '') +
        translate(translations, props.text ? props.text : '') +
        String(props.suffix ? props.suffix : '')}
    </TextCStyled>
  );
};

export default NameTranslation;
