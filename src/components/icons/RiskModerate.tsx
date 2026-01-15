type Props = {
  ariaHidden?: boolean;
  focusable?: boolean;
  role?: string;
  style?: Record<string, any>;
};

const SvgRiskModerate = (props: Props) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 168 67"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    display="block"
    fill="currentColor"
    aria-hidden={true}
    focusable={false}
    role="presentation"
    {...props}
  >
    <defs>
      <rect id="risk-moderate_svg__a" x={0} y={0} width={168} height={67} rx={5} />
    </defs>
    <g fill="none" fillRule="evenodd">
      <path
        d="M84-50c.333 56 5.667 112 16 168H68C78.667 61.667 84 5.667 84-50z"
        fillOpacity={0.3}
        fill="#05A8FA"
        mask="url(#risk-moderate_svg__b)"
        transform="rotate(-90 84 34)"
      />
      <path
        d="M84-50c0 56 2.333 112 7 168H77c4.667-56 7-112 7-168z"
        fillOpacity={0.3}
        fill="#05A8FA"
        mask="url(#risk-moderate_svg__b)"
        transform="rotate(-90 84 34)"
      />
    </g>
  </svg>
);

export default SvgRiskModerate;
