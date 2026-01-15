const SvgBdBudgetApplication = (props) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 102 58"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    display="block"
    aria-hidden={true}
    focusable={false}
    role="presentation"
    {...props}
  >
    <g filter="url(#bd-budget-application_svg__a)">
      <path fill="#674CED" fillOpacity={0.16} d="M49.898 5h-14.4v24h14.4z" />
    </g>
    <path d="M0 30.398H102.01" stroke="#744CED" strokeWidth={1.2} strokeDasharray="5.09 5.09" />
    <path d="M32.5.3a.3.3 0 1 1 .6 0v57.3h-.6V.3Z" fill="#C12017" />
    <path d="M16.5 31h14.4v21.72A2.28 2.28 0 0 1 28.62 55h-9.84a2.28 2.28 0 0 1-2.28-2.28V31Z" fill="#05A8FA" />
    <defs>
      <filter
        id="bd-budget-application_svg__a"
        x={35.5}
        y={5}
        width={14.398}
        height={24}
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
        <feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
        <feOffset dy={1.425} />
        <feComposite in2="hardAlpha" operator="arithmetic" k2={-1} k3={1} />
        <feColorMatrix values="0 0 0 0 0.403 0 0 0 0 0.2976 0 0 0 0 0.93 0 0 0 1 0" />
        <feBlend in2="shape" result="effect1_innerShadow_9720_114801" />
      </filter>
    </defs>
  </svg>
);
export default SvgBdBudgetApplication;
