type Props = {
  ariaHidden?: boolean;
  focusable?: boolean;
  role?: string;
  style?: Record<string, any>;
};

// IMPORTANT
// This is a custom version because we need to preserve the paths to be separated.
const SvgSort = (props: Props) => (
  <svg
    viewBox="0 0 6 9"
    width="1em"
    height="1em"
    display="block"
    fill="currentColor"
    aria-hidden={true}
    focusable={false}
    role="presentation"
    {...props}
  >
    <path className="top" d="M5.1,4H0.9C0.1,4-0.3,3,0.3,2.4l2.1-2.2c0.3-0.4,0.9-0.4,1.3,0l2.1,2.2C6.3,3,5.9,4,5.1,4z" />
    <path
      className="bottom"
      d="M5.1,5H0.9C0.1,5-0.3,6,0.3,6.6l2.1,2.2c0.3,0.4,0.9,0.4,1.3,0l2.1-2.2C6.3,6,5.9,5,5.1,5z"
    />
  </svg>
);

export default SvgSort;
