type Props = {
  ariaHidden?: boolean;
  focusable?: boolean;
  role?: string;
  style?: Record<string, any>;
  className?: string;
};

const SvgShare = (props: Props) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 14 16"
    display="block"
    fill="currentColor"
    aria-hidden={true}
    focusable={false}
    role="presentation"
    {...props}
  >
    <path
      d="M11 10c-.8 0-1.528.313-2.066.825L5.863 8.903a3.018 3.018 0 000-1.806l3.071-1.922a3 3 0 10-.797-1.272L5.066 5.825a3 3 0 100 4.35l3.071 1.922A3 3 0 1011 10zm0-8.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm-8 8a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm8 5a1.5 1.5 0 110-3 1.5 1.5 0 010 3z"
      fill="#a0a2ad"
      fillRule="nonzero"
    />
  </svg>
);

export default SvgShare;
