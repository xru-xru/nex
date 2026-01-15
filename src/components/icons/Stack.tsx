type Props = {
  ariaHidden?: boolean;
  focusable?: boolean;
  role?: string;
  style?: Record<string, any>;
};

const SvgStack = (props: Props) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    display="block"
    fill="currentColor"
    aria-hidden={true}
    focusable={false}
    role="presentation"
    {...props}
  >
    <g fillRule="nonzero" fill="none">
      <circle fill="#131314" cx={12} cy={12} r={12} />
      <path
        d="M15.922 14.28l1.838.973c.356.15.358.543 0 .694l-4.8 2.542a2.214 2.214 0 01-1.92 0l-4.8-2.542c-.356-.15-.358-.543 0-.694l1.838-.973 2.962 1.569a2.214 2.214 0 001.92 0l2.962-1.569z"
        fillOpacity={0.3}
        fill="#FFF"
      />
      <path
        d="M15.922 10.68l1.838.973c.356.15.358.543 0 .694l-4.8 2.542a2.214 2.214 0 01-1.92 0l-4.8-2.542c-.356-.15-.358-.543 0-.694l1.838-.973 2.962 1.569a2.214 2.214 0 001.92 0l2.962-1.569z"
        fillOpacity={0.6}
        fill="#FFF"
      />
      <path
        d="M11.04 5.511a2.214 2.214 0 011.92 0l4.8 2.542c.356.15.358.543 0 .694l-4.8 2.542a2.214 2.214 0 01-1.92 0l-4.8-2.542c-.356-.15-.358-.543 0-.694l4.8-2.542z"
        fill="#FFF"
      />
    </g>
  </svg>
);

export default SvgStack;
