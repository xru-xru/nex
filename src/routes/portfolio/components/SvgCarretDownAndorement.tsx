import ButtonAdornment from 'components/ButtonAdornment';
import SvgCaretDown from 'components/icons/CaretDown';

type Props = {
  open: boolean;
};

export default function SvgCarretDownAndorement({ open }: Props) {
  return (
    <ButtonAdornment position="end">
      <SvgCaretDown
        style={{
          transform: `rotate(${open ? '180' : '0'}deg)`,
        }}
      />
    </ButtonAdornment>
  );
}
