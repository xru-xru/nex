import styled from 'styled-components';

import '../../../theme/theme';

type Props = {
  text: string;
  focused?: boolean;
  forInput?: string;
  margin?: string;
};

interface LabelStyledInputLabelProps {
  focused: boolean;
  margin?: string;
}
const LabelStyled = styled.label<LabelStyledInputLabelProps>`
  transition: color 0.2s;
  color: ${({ focused, theme }) => (focused ? theme.colors.primary : 'currentColor')};
  margin: ${({ margin }) => margin || '0 0 5px 0'};
`;

const InputLabel = ({ text, focused, forInput, margin }: Props) => (
  <LabelStyled focused={Boolean(focused)} htmlFor={forInput} margin={margin}>
    {text}
  </LabelStyled>
);

export default InputLabel;
