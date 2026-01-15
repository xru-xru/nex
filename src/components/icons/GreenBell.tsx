const SvgGreenBell = (props) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 32 32"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    display="block"
    aria-hidden={true}
    focusable={false}
    role="presentation"
    {...props}
  >
    <circle cx={16} cy={16} r={16} fill="#0EC76A" fillOpacity={0.11} />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M21.716 12.64c0 3.372.763 4.367 1.762 5.317.499.475.657 1.193.402 1.83-.26.65-.886 1.07-1.594 1.07H9.714c-.708 0-1.334-.42-1.594-1.07a1.662 1.662 0 0 1 .402-1.83c.998-.95 1.762-1.946 1.762-5.318 0-2.842 2.264-5.16 5.145-5.44V6.57a.571.571 0 1 1 1.143 0v.627c2.88.28 5.144 2.599 5.144 5.441ZM14.858 22c0 .63.512 1.144 1.142 1.144.631 0 1.143-.514 1.143-1.144h1.143A2.289 2.289 0 0 1 16 24.287 2.289 2.289 0 0 1 13.715 22h1.143Z"
      fill="#0EC76A"
    />
  </svg>
);

export default SvgGreenBell;
