type Props = {
  ariaHidden?: boolean;
  focusable?: boolean;
  role?: string;
  style?: Record<string, any>;
};

const SvgFilter = (props: Props) => (
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
    <path
      d="M22.498 0H1.503C.169 0-.503 1.617.442 2.56L9 11.122v8.754c0 .433.187.844.512 1.129l3 2.624c.958.838 2.488.173 2.488-1.129V11.121l8.56-8.56C24.5 1.619 23.833 0 22.498 0zM13.5 10.5v12l-3-2.625V10.5l-9-9h21l-9 9z"
      fillRule="nonzero"
    />
  </svg>
);

export default SvgFilter;
