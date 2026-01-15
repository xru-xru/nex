type Props = {
  ariaHidden?: boolean;
  focusable?: boolean;
  role?: string;
  style?: Record<string, any>;
};

const SvgBudgetAutomaticDefault = (props: Props) => (
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
    <g fill="#674CED" fillRule="nonzero">
      <circle fillOpacity={0.1} cx={24} cy={24} r={24} />
      <path
        d="M29.564 20.133c.942.941.92 2.475 0 3.394l-3.733 3.734-5.092-5.091 3.734-3.734a2.407 2.407 0 013.394 0l1.697 1.697z"
        fillOpacity={0.4}
      />
      <path d="M25.83 27.26l-9.444 9.442c-.97.97-2.509 1.006-3.445.07l-1.715-1.714c-.932-.932-.897-2.478.07-3.445l9.433-9.43 5.102 5.078zM18.99 16.05l-2.028-.8c-.854-.337-.858-.882 0-1.22l2.028-.8.8-2.028c.337-.854.882-.858 1.22 0l.8 2.028 2.028.8c.854.337.858.882 0 1.22l-2.028.8-.8 2.028c-.337.854-.882.858-1.22 0l-.8-2.028zm12.96 0l-2.028-.8c-.854-.337-.858-.882 0-1.22l2.028-.8.8-2.028c.337-.854.882-.858 1.22 0l.8 2.028 2.028.8c.854.337.858.882 0 1.22l-2.028.8-.8 2.028c-.337.854-.882.858-1.22 0l-.8-2.028zm0 13.44l-2.028-.8c-.854-.337-.858-.882 0-1.22l2.028-.8.8-2.028c.337-.854.882-.858 1.22 0l.8 2.028 2.028.8c.854.337.858.882 0 1.22l-2.028.8-.8 2.028c-.337.854-.882.858-1.22 0l-.8-2.028z" />
    </g>
  </svg>
);

export default SvgBudgetAutomaticDefault;
