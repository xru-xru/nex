type Props = {
  ariaHidden?: boolean;
  focusable?: boolean;
  role?: string;
  style?: Record<string, any>;
  onClick?: () => any;
  className?: string;
};

const SvgSort = (props: Props) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 16 14"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    display="block"
    aria-hidden={true}
    focusable={false}
    role="presentation"
    {...props}
  >
    <path d="M4.897 11.633l-2.124 2.25a.375.375 0 01-.546 0l-2.124-2.25A.375.375 0 01.375 11H1.75V.375c0-.207.168-.375.375-.375h.75c.207 0 .375.168.375.375V11h1.375c.33 0 .496.396.272.633zM7.375 3.25h8.25A.375.375 0 0016 2.875v-.75a.375.375 0 00-.375-.375h-8.25A.375.375 0 007 2.125v.75c0 .207.168.375.375.375zM7 5.875v-.75c0-.207.168-.375.375-.375h6.25c.207 0 .375.168.375.375v.75a.375.375 0 01-.375.375h-6.25A.375.375 0 017 5.875zm0 6v-.75c0-.207.168-.375.375-.375h2.25c.207 0 .375.168.375.375v.75a.375.375 0 01-.375.375h-2.25A.375.375 0 017 11.875zm0-3v-.75c0-.207.168-.375.375-.375h4.25c.207 0 .375.168.375.375v.75a.375.375 0 01-.375.375h-4.25A.375.375 0 017 8.875z" />
  </svg>
);

export default SvgSort;
