type Props = {
  ariaHidden?: boolean;
  focusable?: boolean;
  role?: string;
  style?: Record<string, any>;
  color?: string;
};

const SvgKpi = (props: Props) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 48 48"
    display="block"
    fill="currentColor"
    aria-hidden={true}
    focusable={false}
    role="presentation"
    {...props}
  >
    <g fill={props.color || '#0EC76A'}>
      <circle cx={24} cy={24} r={24} fillOpacity={0.11} />
      <path
        fillOpacity={0.5}
        d="M21.12 11.039a1.44 1.44 0 012.88 0v2.882a1.44 1.44 0 01-2.88 0V11.04zm-7.622 4.495a1.44 1.44 0 012.036-2.037l2.038 2.039a1.44 1.44 0 01-2.036 2.036l-2.039-2.038zm16.438-2.037a1.44 1.44 0 012.036 2.037l-2.038 2.038a1.44 1.44 0 01-2.037-2.036l2.039-2.039zm-14.4 7.798a1.44 1.44 0 010 2.88h-2.883a1.44 1.44 0 010-2.88h2.883z"
      />
      <path d="M29.794 28.632l4.692-2.228c.476-.226.481-.61.018-.86l-12.95-6.998c-.463-.25-.811-.028-.776.497l.974 14.457c.036.53.393.683.8.353l4.041-3.274 3.423 5.478c.28.445.868.58 1.314.302l1.557-.973a.955.955 0 00.305-1.314l-3.398-5.44z" />
    </g>
  </svg>
);

export default SvgKpi;
