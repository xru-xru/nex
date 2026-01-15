type Props = {
  ariaHidden?: boolean;
  focusable?: boolean;
  role?: string;
  style?: Record<string, any>;
};

const SvgAttributions = (props: Props) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="9.6001" cy="9.59998" r="2.9" stroke="currentColor" strokeWidth="1.2" />
    <circle cx="9.6001" cy="1" r="1" fill="currentColor" />
    <circle cx="9.6001" cy="18.2" r="1" fill="currentColor" />
    <circle cx="1" cy="9.59998" r="1" fill="currentColor" />
    <circle cx="18.2002" cy="9.59998" r="1" fill="currentColor" />
    <rect
      x="12.7954"
      y="9.84998"
      width="0.5"
      height="6.20441"
      rx="0.2"
      transform="rotate(-90 12.7954 9.84998)"
      fill="currentColor"
    />
    <rect y="9.84998" width="0.5" height="6.69922" rx="0.2" transform="rotate(-90 0 9.84998)" fill="currentColor" />
    <rect x="9.3501" width="0.5" height="6.6198" rx="0.2" fill="currentColor" />
    <rect x="9.3501" y="12.7968" width="0.5" height="6.20325" rx="0.2" fill="currentColor" />
  </svg>
);

export default SvgAttributions;
