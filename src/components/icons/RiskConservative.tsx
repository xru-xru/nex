type Props = {
  ariaHidden?: boolean;
  focusable?: boolean;
  role?: string;
  style?: Record<string, any>;
};

const SvgRiskConservative = (props: Props) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 168 20"
    xmlns="http://www.w3.org/2000/svg"
    display="block"
    fill="currentColor"
    aria-hidden={true}
    focusable={false}
    role="presentation"
    {...props}
  >
    <g fill="#05A8FA" fillRule="evenodd" fillOpacity={0.3}>
      <path d="M0 10C56 9 112 5.667 168 0v20C112 14 56 10.667 0 10z" />
      <path d="M0 10c56 0 112-2.333 168-7v14c-56-4.667-112-7-168-7z" />
    </g>
  </svg>
);

export default SvgRiskConservative;
