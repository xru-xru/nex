const SvgFullScreenClose = (props) => (
  <svg
    className="full-screen-close_svg__with-icon_icon__MHUeb"
    fill="currentColor"
    height="1em"
    shapeRendering="geometricPrecision"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={1.5}
    viewBox="0 0 24 24"
    width="1em"
    style={{
      color: 'var(--geist-foreground)',
      width: 24,
      height: 24,
    }}
    display="block"
    aria-hidden={true}
    focusable={false}
    role="presentation"
    {...props}
  >
    <path d="M4 14h6m0 0v6m0-6-7 7m17-11h-6m0 0V4m0 6 7-7m-7 17v-6m0 0h6m-6 0 7 7M10 4v6m0 0H4m6 0L3 3" />
  </svg>
);
export default SvgFullScreenClose;
