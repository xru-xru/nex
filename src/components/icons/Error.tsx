type Props = {
  ariaHidden?: boolean;
  focusable?: boolean;
  role?: string;
  style?: Record<string, any>;
};

const SvgError = (props: Props) => (
  <svg
    viewBox="0 0 100 100"
    width="1em"
    height="1em"
    display="block"
    fill="currentColor"
    aria-hidden={true}
    focusable={false}
    role="presentation"
    {...props}
  >
    <path d="M29 79a5.998 5.998 0 005.18 3h30.68A5.998 5.998 0 0070 79l15.34-26.52a6.007 6.007 0 000-6L70 20a5.997 5.997 0 00-5.172-3H34.22a5.998 5.998 0 00-5.218 3L13.73 46.512a6.007 6.007 0 000 6zm24-10.27A3.27 3.27 0 0149.73 72h-.449A3.268 3.268 0 0146 68.73v-.45A3.268 3.268 0 0149.27 65h.449A3.268 3.268 0 0153 68.27zM47.21 27h4.65a3.237 3.237 0 013.23 3.488L52.762 56a3.246 3.246 0 01-3.227 2.93A3.244 3.244 0 0146.308 56L44 30.488A3.234 3.234 0 0147.21 27z" />
  </svg>
);

export default SvgError;
