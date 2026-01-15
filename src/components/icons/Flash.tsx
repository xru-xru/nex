type Props = {
  ariaHidden?: boolean;
  focusable?: boolean;
  role?: string;
  style?: Record<string, any>;
};

const SvgFlash = (props: Props) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 32 32"
    display="block"
    fill="currentColor"
    aria-hidden={true}
    focusable={false}
    role="presentation"
    {...props}
  >
    <g fill="none">
      <circle cx={16} cy={16} r={16} fill="#0EC76A" fillOpacity={0.2} />
      <circle cx={16} cy={16} r={11} fill="#0EC76A" />
      <path
        fill="#FFF"
        d="M16.65 14.353l.526-4.559c.104-.898-.248-1.057-.785-.36l-5.162 6.693c-.433.56-.234 1.083.44 1.17l2.682.35-.527 4.559c-.104.898.248 1.057.785.36l5.163-6.693c.432-.56.232-1.083-.442-1.17l-2.68-.35z"
      />
    </g>
  </svg>
);

export default SvgFlash;
