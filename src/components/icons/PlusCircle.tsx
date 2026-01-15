type Props = {
  ariaHidden?: boolean;
  focusable?: boolean;
  role?: string;
  style?: Record<string, any>;
};

const SvgPlusCircle = (props: Props) => (
  <svg
    aria-hidden={true}
    data-prefix="far"
    data-icon="plus-circle"
    className="plus-circle_svg__svg-inline--fa plus-circle_svg__fa-plus-circle plus-circle_svg__fa-w-16"
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
      d="M384 240v32c0 6.6-5.4 12-12 12h-88v88c0 6.6-5.4 12-12 12h-32c-6.6 0-12-5.4-12-12v-88h-88c-6.6 0-12-5.4-12-12v-32c0-6.6 5.4-12 12-12h88v-88c0-6.6 5.4-12 12-12h32c6.6 0 12 5.4 12 12v88h88c6.6 0 12 5.4 12 12zm120 16c0 137-111 248-248 248S8 393 8 256 119 8 256 8s248 111 248 248zm-48 0c0-110.5-89.5-200-200-200S56 145.5 56 256s89.5 200 200 200 200-89.5 200-200z"
    />
  </svg>
);

export default SvgPlusCircle;
