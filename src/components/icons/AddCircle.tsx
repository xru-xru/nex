type Props = {
  ariaHidden?: boolean;
  focusable?: boolean;
  role?: string;
  style?: Record<string, any>;
};

const SvgAddCircle = (props: Props) => (
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
    <path d="M10 18.9c-4.9 0-8.9-4-8.9-8.9s4-8.9 8.9-8.9 8.9 4 8.9 8.9-4 8.9-8.9 8.9zm0-16.3c-4.1 0-7.4 3.3-7.4 7.4s3.3 7.4 7.4 7.4 7.4-3.3 7.4-7.4-3.3-7.4-7.4-7.4zm3.7 8.1H6.3c-.4 0-.7-.3-.7-.7s.3-.7.7-.7h7.4c.4 0 .7.3.7.7s-.3.7-.7.7zM10 14.5c-.4 0-.7-.3-.7-.7V6.3c0-.4.3-.7.7-.7s.7.3.7.7v7.4c0 .4-.3.8-.7.8z" />
  </svg>
);

export default SvgAddCircle;
