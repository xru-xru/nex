type Props = {
  ariaHidden?: boolean;
  focusable?: boolean;
  role?: string;
  style?: Record<string, any>;
};

const SvgRiskAggressive = (props: Props) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 168 67"
    xmlns="http://www.w3.org/2000/svg"
    display="block"
    fill="currentColor"
    aria-hidden={true}
    focusable={false}
    role="presentation"
    {...props}
  >
    <g fill="#05A8FA" fillRule="evenodd" fillOpacity={0.3}>
      <path d="M0 33.5c56 0 112-11.167 168-33.5v67C112 44.282 56 33.115 0 33.5z" />
      <path d="M0 33.5c56 0 112-4.62 168-13.862v27.724C112 37.736 56 33.115 0 33.5z" />
    </g>
  </svg>
);

export default SvgRiskAggressive;
