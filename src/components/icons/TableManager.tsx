const SvgTableManager = (props) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    display="block"
    aria-hidden={true}
    focusable={false}
    role="presentation"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="m19.442 13.285-.587-.586a.997.997 0 0 0-1.414 0l-1.164 1.164-.543.543-3.799 3.799-.198 1.785a.375.375 0 0 0 .414.414l1.783-.197 3.8-3.8.543-.544 1.164-1.163a1 1 0 0 0 0-1.415Zm-5.858 6.204-1.056.116.118-1.057 3.613-3.613.485-.485.94.94-.485.484-3.615 3.615Zm4.634-4.628.692-.692a.25.25 0 0 0 0-.353l-.587-.587a.249.249 0 0 0-.353 0l-.692.692.94.94Z"
      fill="#8A8C9E"
    />
    <mask
      id="table-manager_svg__a"
      style={{
        maskType: 'alpha',
      }}
      maskUnits="userSpaceOnUse"
      x={4}
      y={3}
      width={15}
      height={17}
    >
      <path
        d="M4.281 3.594h14.4v7.872a3.246 3.246 0 0 0-2.49.933l-2.23 2.21-2.167 2.236a3.951 3.951 0 0 0-1.113 2.749h-6.4v-16Z"
        fill="#D9D9D9"
      />
    </mask>
    <g mask="url(#table-manager_svg__a)">
      <path
        d="M12.921 6.072a.8.8 0 0 0-.8-.8h-1.28a.8.8 0 0 0-.8.8v11.2a.8.8 0 0 0 .8.8h1.28a.8.8 0 0 0 .8-.8v-11.2Zm2.24-.8a.8.8 0 0 0-.8.8v11.2a.8.8 0 0 0 .8.8h1.28a.8.8 0 0 0 .8-.8v-11.2a.8.8 0 0 0-.8-.8h-1.28Zm-6.56.8a.8.8 0 0 0-.8-.8h-1.28a.8.8 0 0 0-.8.8v11.2a.8.8 0 0 0 .8.8h1.28a.8.8 0 0 0 .8-.8v-11.2Zm-4.32-.8a1.6 1.6 0 0 1 1.6-1.6h11.2a1.6 1.6 0 0 1 1.6 1.6v12.8a1.6 1.6 0 0 1-1.6 1.6h-11.2a1.6 1.6 0 0 1-1.6-1.6v-12.8Z"
        fill="#8A8C9E"
      />
    </g>
  </svg>
);
export default SvgTableManager;
