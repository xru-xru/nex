type Props = {
  ariaHidden?: boolean;
  focusable?: boolean;
  role?: string;
  style?: Record<string, any>;
};

const SvgPencil = (props: Props) => (
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
    <path d="M14.6 1.438l-2 2 3.9 3.9 2-2-3.9-3.9zm-2.6 2.6l-8.9 8.9 3.9 3.9 8.9-8.9-3.9-3.9zm-9.5 9.6l-1.1 5 5-1.1-3.9-3.9z" />
  </svg>
);

export default SvgPencil;
