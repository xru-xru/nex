type Props = {
  ariaHidden?: boolean;
  focusable?: boolean;
  role?: string;
  style?: Record<string, any>;
};

const SvgSlidersHRegular = (props: Props) => (
  <svg
    aria-hidden={true}
    data-prefix="far"
    data-icon="sliders-h"
    className="sliders-h-regular_svg__svg-inline--fa sliders-h-regular_svg__fa-sliders-h sliders-h-regular_svg__fa-w-16"
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
      d="M496 72H288V48c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16v24H16C7.2 72 0 79.2 0 88v16c0 8.8 7.2 16 16 16h208v24c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16v-24h208c8.8 0 16-7.2 16-16V88c0-8.8-7.2-16-16-16zm0 320H160v-24c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16v24H16c-8.8 0-16 7.2-16 16v16c0 8.8 7.2 16 16 16h80v24c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16v-24h336c8.8 0 16-7.2 16-16v-16c0-8.8-7.2-16-16-16zm0-160h-80v-24c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16v24H16c-8.8 0-16 7.2-16 16v16c0 8.8 7.2 16 16 16h336v24c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16v-24h80c8.8 0 16-7.2 16-16v-16c0-8.8-7.2-16-16-16z"
    />
  </svg>
);

export default SvgSlidersHRegular;
