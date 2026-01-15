type Props = {
  ariaHidden?: boolean;
  focusable?: boolean;
  role?: string;
  style?: Record<string, any>;
};

const SvgMinus = (props: Props) => (
  <svg
    viewBox="0 0 10 2"
    width="1em"
    height="1em"
    display="block"
    fill="currentColor"
    aria-hidden={true}
    focusable={false}
    role="presentation"
    {...props}
  >
    <path d="M.857 2a.43.43 0 01-.428-.429V.43A.43.43 0 01.857 0h8.286a.43.43 0 01.428.429V1.57A.43.43 0 019.143 2H.857z" />
  </svg>
);

export default SvgMinus;
