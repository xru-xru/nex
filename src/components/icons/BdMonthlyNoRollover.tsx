const SvgBdMonthlyNoRollover = (props) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 102 73"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    display="block"
    aria-hidden={true}
    focusable={false}
    role="presentation"
    {...props}
  >
    <g filter="url(#bd-monthly-no-rollover_svg__a)">
      <path fill="#674CED" fillOpacity={0.16} d="M50 0H36v44h14z" />
    </g>
    <g filter="url(#bd-monthly-no-rollover_svg__b)">
      <path fill="#674CED" fillOpacity={0.16} d="M66 0H52v44h14z" />
    </g>
    <path d="M0 45.4H102.01" stroke="#744CED" strokeWidth={1.2} strokeDasharray="5.09 5.09" />
    <path d="M33 15.3a.3.3 0 1 1 .6 0v57.3H33V15.3Z" fill="#C12017" />
    <path d="M16 46h14.4v21.72A2.28 2.28 0 0 1 28.12 70h-9.84A2.28 2.28 0 0 1 16 67.72V46Z" fill="#05A8FA" />
    <defs>
      <filter
        id="bd-monthly-no-rollover_svg__a"
        x={36}
        y={0}
        width={14}
        height={44}
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
        <feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
        <feOffset dy={1.425} />
        <feComposite in2="hardAlpha" operator="arithmetic" k2={-1} k3={1} />
        <feColorMatrix values="0 0 0 0 0.403 0 0 0 0 0.2976 0 0 0 0 0.93 0 0 0 1 0" />
        <feBlend in2="shape" result="effect1_innerShadow_10891_41089" />
      </filter>
      <filter
        id="bd-monthly-no-rollover_svg__b"
        x={52}
        y={0}
        width={14}
        height={44}
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
        <feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
        <feOffset dy={1.425} />
        <feComposite in2="hardAlpha" operator="arithmetic" k2={-1} k3={1} />
        <feColorMatrix values="0 0 0 0 0.403 0 0 0 0 0.2976 0 0 0 0 0.93 0 0 0 1 0" />
        <feBlend in2="shape" result="effect1_innerShadow_10891_41089" />
      </filter>
    </defs>
  </svg>
);
export default SvgBdMonthlyNoRollover;
