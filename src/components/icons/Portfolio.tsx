const SvgPortfolio = (props) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 20 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    display="block"
    aria-hidden={true}
    focusable={false}
    role="presentation"
    {...props}
  >
    <path d="M2 8.5v6.362a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V8.5" stroke="currentColor" strokeWidth={1.345} />
    <path
      d="M1 4a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v3.48a1 1 0 0 1-.816.983l-8 1.502a1 1 0 0 1-.369 0l-8-1.502A1 1 0 0 1 1 7.481V4Z"
      stroke="currentColor"
      strokeWidth={1.5}
    />
    <rect x={9} y={8} width={2} height={4} rx={1} fill="currentColor" />
    <path d="M14 3a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2" stroke="currentColor" />
  </svg>
);

export default SvgPortfolio;
