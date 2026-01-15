const SvgXCircleFill = (props) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 24 25"
    fill="white"
    xmlns="http://www.w3.org/2000/svg"
    display="block"
    aria-hidden={true}
    focusable={false}
    role="presentation"
    {...props}
  >
    <path
      d="M12 22.5c5.523 0 10-4.477 10-10s-4.477-10-10-10-10 4.477-10 10 4.477 10 10 10Z"
      fill="white"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="m15 9.5-6 6 6-6Z" fill="currentColor" />
    <path d="m15 9.5-6 6" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    <path d="m9 9.5 6 6-6-6Z" fill="currentColor" />
    <path d="m9 9.5 6 6" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
export default SvgXCircleFill;
