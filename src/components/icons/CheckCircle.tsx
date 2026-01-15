type Props = {
  ariaHidden?: boolean;
  focusable?: boolean;
  role?: string;
  style?: Record<string, any>;
  className?: string;
};

const SvgCheckCircle = (props: Props) => (
  <svg
    aria-hidden={true}
    data-prefix="fas"
    data-icon="check-circle"
    data-testid="check_circle_icon"
    className="check-circle_svg__svg-inline--fa check-circle_svg__fa-check-circle check-circle_svg__fa-w-16"
    viewBox="0 0 512 512"
    width="1em"
    height="1em"
    display="block"
    fill="currentColor"
    focusable={false}
    role="presentation"
    {...props}
  >
    <path
      fill="currentColor"
      d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z"
    />
  </svg>
);

export default SvgCheckCircle;
