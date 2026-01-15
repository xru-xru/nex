type Props = {
  ariaHidden?: boolean;
  focusable?: boolean;
  role?: string;
  style?: Record<string, any>;
};

const SvgChevronDown = (props: Props) => (
  <svg
    aria-hidden={true}
    data-prefix="far"
    data-icon="chevron-down"
    className="chevron-down_svg__svg-inline--fa chevron-down_svg__fa-chevron-down chevron-down_svg__fa-w-14"
    viewBox="0 0 448 512"
    width="1em"
    height="1em"
    display="block"
    fill="currentColor"
    focusable={false}
    role="presentation"
    {...props}
  >
    <path
      fill="currentColor"
      d="M441.9 167.3l-19.8-19.8c-4.7-4.7-12.3-4.7-17 0L224 328.2 42.9 147.5c-4.7-4.7-12.3-4.7-17 0L6.1 167.3c-4.7 4.7-4.7 12.3 0 17l209.4 209.4c4.7 4.7 12.3 4.7 17 0l209.4-209.4c4.7-4.7 4.7-12.3 0-17z"
    />
  </svg>
);

export default SvgChevronDown;
