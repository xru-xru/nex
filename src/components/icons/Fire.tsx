type Props = {
  ariaHidden?: boolean;
  focusable?: boolean;
  role?: string;
  style?: Record<string, any>;
};

const SvgFire = (props: Props) => (
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
    <circle cx={12} cy={12} r={12} fill="#FDE8D3" />
    <path
      d="M12 20.16c3.994 0 6.24-2.97 6.24-7.127 0-5.92-7.54-9.193-7.54-9.193s.49 2.512-1.03 4.338c-1.52 1.825-3.91 3.026-3.91 6.127 0 3.102 1.997 5.855 6.24 5.855z"
      fill="#F6820D"
    />
    <path
      d="M12.202 9.55s2.226 1.239 3.391 4.353-1.03 6.017-3.419 6.268c-1.592.167-3.746-.762-3.769-2.883-.01-1 .56-1.313.805-2.31.245-.997.225-1.844.225-1.844s.705.271 1.142.891c.437.62.583 1.557.583 1.557s.934-.502 1.24-2.153c.306-1.651-.198-3.88-.198-3.88z"
      fill="#fff"
      fillOpacity={0.4}
    />
  </svg>
);

export default SvgFire;
