const SvgMinusCircle = (props) => (
  <svg
    fill="white"
    height="1em"
    shapeRendering="geometricPrecision"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={1.5}
    viewBox="0 0 24 24"
    width="1em"
    style={{
      width: 24,
      height: 24,
    }}
    display="block"
    aria-hidden={true}
    focusable={false}
    role="presentation"
    {...props}
  >
    <circle cx={12} cy={12} r={10} />
    <path d="M8 12h8" />
  </svg>
);
export default SvgMinusCircle;
