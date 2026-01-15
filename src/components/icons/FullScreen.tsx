const SvgFullScreen = (props) => (
  <svg
    className="full-screen_svg__with-icon_icon__MHUeb"
    data-testid="geist-icon"
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
    <path d="M15 3h6m0 0v6m0-6-7 7M9 21H3m0 0v-6m0 6 7-7M3 9V3m0 0h6M3 3l7 7m11 5v6m0 0h-6m6 0-7-7" />
  </svg>
);
export default SvgFullScreen;
