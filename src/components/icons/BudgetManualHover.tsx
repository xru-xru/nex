type Props = {
  ariaHidden?: boolean;
  focusable?: boolean;
  role?: string;
  style?: Record<string, any>;
};

const SvgBudgetManualHover = (props: Props) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 48 48"
    xmlns="http://www.w3.org/2000/svg"
    display="block"
    fill="currentColor"
    aria-hidden={true}
    focusable={false}
    role="presentation"
    {...props}
  >
    <g fillRule="nonzero" fill="none">
      <circle fill="#05A8FA" cx={24} cy={24} r={24} />
      <path
        d="M18.72 11.99v10.103l-6.48 9.442c-2.783 4.056-1.053 7.345 3.865 7.345h15.79c4.919 0 6.648-3.288 3.864-7.345l-6.479-9.442V11.99c.551-.076.961-.548.96-1.105v-.168A1.113 1.113 0 0029.127 9.6H18.874a1.114 1.114 0 00-1.114 1.116v.168c0 .567.418 1.031.96 1.105z"
        fillOpacity={0.4}
        fill="#FFF"
      />
      <path
        d="M29.28 26.88l3.814 5.868c1.34 2.061.432 3.732-2.03 3.732H16.936c-2.46 0-3.369-1.672-2.03-3.732l3.814-5.868s2.55 2.177 5.28.48c2.732-1.729 5.28-.48 5.28-.48zm-4.32-8.16a1.92 1.92 0 110-3.84 1.92 1.92 0 010 3.84zm-2.4 6.24a1.44 1.44 0 110-2.88 1.44 1.44 0 010 2.88z"
        fill="#FFF"
      />
    </g>
  </svg>
);

export default SvgBudgetManualHover;
