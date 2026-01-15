type Props = {
  ariaHidden?: boolean;
  focusable?: boolean;
  role?: string;
  style?: Record<string, any>;
  className?: string;
};

const SvgWarning = ({ className, ...props }: Props) => (
  <svg
    viewBox="0 0 20 20"
    width="1em"
    height="1em"
    display="block"
    fill="currentColor"
    aria-hidden={true}
    focusable={false}
    role="presentation"
    className={className}
    {...props}
  >
    <path d="M18.7 16.1L11 2.8c-.5-.8-1.5-.8-2 0L1.3 16.1c-.4.7.1 1.7 1 1.7h15.4c.9 0 1.4-.9 1-1.7zM9.8 6.9c.5-.1.9.1 1.1.5.1.2.1.3.1.5 0 .5-.1 1-.1 1.5 0 .8-.1 1.5-.1 2.3v.7c0 .4-.3.7-.7.7-.4 0-.7-.3-.7-.7-.2-1.2-.3-2.4-.3-3.6 0-.3 0-.6-.1-1 0-.4.3-.8.8-.9zm.2 8.8c-.5 0-1-.4-1-1 0-.5.4-1 1-1s1 .4 1 1-.5 1-1 1z" />
  </svg>
);

export default SvgWarning;
