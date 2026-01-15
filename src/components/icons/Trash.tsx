type Props = {
  ariaHidden?: boolean;
  focusable?: boolean;
  role?: string;
  style?: Record<string, any>;
  className?: string;
};

const SvgTrash = (props: Props) => (
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
    <path d="M12.2 1.8v1.6h4.4c.3 0 .5.2.5.5V5c0 .3-.2.5-.5.5H3.4c-.3 0-.5-.2-.5-.5V4c0-.3.2-.5.5-.5h4.4V1.8c0-.3.2-.5.5-.5h3.3c.3-.1.6.2.6.5zm-6.6 17h8.8c.9 0 1.6-.7 1.6-1.6V7.3H4v9.8c0 .9.7 1.7 1.6 1.7z" />
  </svg>
);

export default SvgTrash;
