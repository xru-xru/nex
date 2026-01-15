import React from 'react';

import clsx from 'clsx';
import { get } from 'lodash';

import { useTranslationsQuery } from '../../graphql/translation/queryTranslations';

import translate from '../../utils/translate';

import Tooltip from '../Tooltip';
import Typography from '../Typography';

type Props = {
  text: string;
  className?: string;
  withTooltip?: boolean;
  divStyleOverrides?: Record<string, string>;
};
export const classes = {
  root: 'NEXYTypographyTranslation',
};
const TypographyTranslation = React.forwardRef<Props, any>(function TypographyTranslation(props, ref) {
  const { className, text, withTooltip, ...rest } = props;
  const { data } = useTranslationsQuery();
  const translations = get(data, 'translations', []);
  const divStyle = {
    position: 'relative',
    minWidth: 0,
    ...props.divStyleOverrides,
  };

  if (withTooltip) {
    return (
      <Tooltip
        content={translate(translations, text)}
        variant="dark"
        placement="bottom-start"
        popperProps={{
          style: {
            zIndex: 3300,
          },
        }}
      >
        <div style={divStyle}>
          <Typography className={clsx(className, classes.root, 'whitespace-pre')} ref={ref} {...rest}>
            {translate(translations, text)}
          </Typography>
        </div>
      </Tooltip>
    );
  }

  return (
    <Typography className={clsx(className, classes.root, 'whitespace-pre')} ref={ref} {...rest}>
      {translate(translations, text)}
    </Typography>
  );
});
export default TypographyTranslation;
