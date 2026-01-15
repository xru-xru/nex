type Props = {
  ariaHidden?: boolean;
  focusable?: boolean;
  role?: string;
  style?: Record<string, any>;
  warningCircleColor?: string;
  warningColor?: string;
  className?: string;
};

const SvgWarningTwo = (props: Props) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    display="block"
    fill="currentColor"
    aria-hidden={true}
    focusable={false}
    role="presentation"
    style={props.style}
    className={props.className}
  >
    <g fill="none">
      <circle cx={12} cy={12} r={12} fill={props.warningCircleColor ?? 'rgba(237,52,52,0.11)'} fillOpacity={1} />
      <path
        fill={props.warningColor ?? '#ED3434'}
        d="M6.221 17.52c-.845 0-1.184-.598-.755-1.339l5.758-10.346c.429-.74 1.123-.74 1.552 0l5.759 10.346c.428.74.088 1.339-.755 1.339H6.22z"
      />
      <path
        fill="#FFF"
        d="M11.28 9.36a.72.72 0 011.44 0v3.12a.72.72 0 01-1.44 0V9.36zm-.24 5.52a.96.96 0 111.92 0 .96.96 0 01-1.92 0z"
      />
    </g>
  </svg>
);

export default SvgWarningTwo;
