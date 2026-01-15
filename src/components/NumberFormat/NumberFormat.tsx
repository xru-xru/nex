import React from 'react';
import NumberFormat from 'react-number-format';

// TODO: Fix the typing
type Props = {
  onChange: (ev: any) => void;
};
// TODO: Make this work with the "NumberValue" and the suffixes and prefixes stuff...
const NumberFormatCustom = React.forwardRef<Props, React.ReactElement<React.ComponentProps<any>, any>>(
  function NumberFormatCustom(props: any, ref) {
    const { onChange, ...other } = props;
    return (
      <NumberFormat
        {...other}
        getInputRef={ref}
        onValueChange={(values) => {
          // TODO: remove this once the issue is fixed in `react-number-format`
          // https://github.com/s-yadav/react-number-format/issues/277
          if (props.value === values.value) {
            return;
          }

          onChange({
            target: {
              value: values.value,
            },
          });
        }}
        thousandSeparator
        prefix="$"
        decimalScale={2}
        allowNegative={false}
      />
    );
  }
);
export default NumberFormatCustom;
