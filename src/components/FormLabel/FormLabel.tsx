import React from 'react';
import styled from 'styled-components';

interface Props {
  children: React.ReactNode;
  className?: string;
  component?: React.ElementType; // Use React.ElementType for component prop
  disabled?: boolean;
  error?: boolean;
  filled?: boolean;
  focused?: boolean;
  required?: boolean;
}

const LabelStyled = styled.label`
  line-height: 1;
  padding: 0;
  font-size: 1em;
  color: rgba(0, 0, 0, 0.54);
`;

const FormLabel = React.forwardRef<HTMLLabelElement, Props>(function FormLabel(props, ref) {
  const {
    children,
    className,
    component: Component = LabelStyled,
    disabled,
    error,
    filled,
    focused,
    required,
    ...rest
  } = props;

  return (
    <Component className={className} ref={ref} {...rest}>
      {children}
      {required && <span>&thinsp;*</span>}
    </Component>
  );
});

export default FormLabel;
