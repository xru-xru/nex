const SvgSliderHandle = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 58 58"
    fill="currentColor"
    display="block"
    aria-hidden={true}
    focusable={false}
    role="presentation"
    {...props}
  >
    <g filter="url(#slider-handle_svg__a)">
      <circle cx={29} cy={26} r={24} fill="#0EC76A" />
    </g>
    <path
      color="transparent"
      d="M24.448 19.5 17 26.25 24.448 33m9.4 0 7.448-6.75-7.448-6.75"
      stroke="#fff"
      strokeWidth={2.025}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <defs>
      <filter
        id="slider-handle_svg__a"
        x={0.5}
        y={0.5}
        width={57}
        height={57}
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
        <feOffset dy={3} />
        <feGaussianBlur stdDeviation={2.25} />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix values="0 0 0 0 0.054902 0 0 0 0 0.780392 0 0 0 0 0.415686 0 0 0 0.2 0" />
        <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_870_65513" />
        <feBlend in="SourceGraphic" in2="effect1_dropShadow_870_65513" result="shape" />
      </filter>
    </defs>
  </svg>
);
export default SvgSliderHandle;
