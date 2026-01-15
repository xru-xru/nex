type Props = {
  ariaHidden?: boolean;
  focusable?: boolean;
  role?: string;
  style?: Record<string, any>;
};

const SvgGoal = (props: Props) => (
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
    <g fill="currentColor">
      <circle cx={16} cy={16} r={16} fillOpacity={0.11} />
      <path
        fillOpacity={0.33}
        d="M16 26.24c-5.655 0-10.24-4.585-10.24-10.24S10.345 5.76 16 5.76 26.24 10.345 26.24 16 21.655 26.24 16 26.24zm0-3.52a6.72 6.72 0 100-13.44 6.72 6.72 0 000 13.44zm0-2.88a3.84 3.84 0 110-7.68 3.84 3.84 0 010 7.68z"
      />
      <path d="M19.932 13.374L17.1 16.207a.96.96 0 11-1.358-1.358l2.956-2.955-.227-1.09c-.072-.347.073-.832.32-1.079l3.845-3.845c.249-.249.51-.169.581.178l.493 2.368 2.369.493c.347.072.424.335.177.581l-3.845 3.846c-.249.249-.733.392-1.079.32l-1.4-.292z" />
    </g>
  </svg>
);

export default SvgGoal;
