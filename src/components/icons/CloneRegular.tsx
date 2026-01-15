import { cn } from '../../lib/utils';

type Props = {
  ariaHidden?: boolean;
  focusable?: boolean;
  role?: string;
  style?: Record<string, any>;
  className?: string;
};

const SvgCloneRegular = ({ className, ...props }: Props) => (
  <svg
    aria-hidden={true}
    data-prefix="far"
    data-icon="clone"
    className={cn(
      'clone-regular_svg__svg-inline--fa clone-regular_svg__fa-clone clone-regular_svg__fa-w-16',
      className,
    )}
    xmlns="http://www.w3.org/2000/svg"
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
      d="M464 0H144c-26.51 0-48 21.49-48 48v48H48c-26.51 0-48 21.49-48 48v320c0 26.51 21.49 48 48 48h320c26.51 0 48-21.49 48-48v-48h48c26.51 0 48-21.49 48-48V48c0-26.51-21.49-48-48-48zM362 464H54a6 6 0 01-6-6V150a6 6 0 016-6h42v224c0 26.51 21.49 48 48 48h224v42a6 6 0 01-6 6zm96-96H150a6 6 0 01-6-6V54a6 6 0 016-6h308a6 6 0 016 6v308a6 6 0 01-6 6z"
    />
  </svg>
);

export default SvgCloneRegular;
