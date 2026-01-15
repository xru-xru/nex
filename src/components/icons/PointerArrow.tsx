type Props = {
  ariaHidden?: boolean;
  focusable?: boolean;
  role?: string;
  style?: Record<string, any>;
};

const SvgPointerArrow = (props: Props) => (
  <svg
    viewBox="0 0 20 20"
    width="1em"
    height="1em"
    display="block"
    fill="currentColor"
    aria-hidden={true}
    focusable={false}
    role="presentation"
    {...props}
  >
    <path d="M6.3 8.3c-.3.3-.3.7 0 1 .3.3.7.3 1 0l2-2v7.1c0 .4.3.7.7.7s.7-.3.7-.7V7.3l2 2c.3.3.7.3 1 0 .1-.1.2-.3.2-.5s-.1-.4-.2-.5l-3.2-3.2c-.1-.1-.3-.2-.5-.2s-.4.1-.5.2L6.3 8.3z" />
  </svg>
);

export default SvgPointerArrow;
