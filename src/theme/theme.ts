// :::::::::
// TYPES :::
// :::::::::
type Fonts = {
  main: string;
  strong: string;
  regular: string;
};
type Layout = {
  sidebar: 250;
  sidebarTablet: 65;
  toolBar: 58;
};
type TextColors = {
  reading: '#000000';
  // Lighter black,
  muted: '#757575';
  // Gray for regular font
  mutedBold: '#4a4a4a'; // Gray for bold font
};
type LayoutColors = {
  sidebarBG: '#ffffff';
  // White
  topbarBG: '#ffffff';
  // White
  mainBG: '#F0F6F7';
  // Light gray
  cardPrimaryBG: '#fff';
  // White
  cardSecondaryBG: '#f4f8f9'; // Light blue gray
};
type MainColors = {
  primary: string;
  secondary: string;
  nexoya: string;
  danger: string;
  warning: string;
  success: string;
  white: string;
};
type Colors = MainColors & {
  text: TextColors;
  layout: LayoutColors;
};
type Layers = {
  base: number;
  body: number;
  menu: number;
  tooltip: number;
  dialog: number;
  chart: number;
  close: number;
};
export type ThemeStyled = {
  colors: Colors;
  layout: Layout;
  fonts: Fonts;
  layers: Layers;
};
// :::::::::
// VALUES:::
// :::::::::
export const mainColors = {
  primary: '#0ec76a',
  // Vivid blue
  // primaryHover: '',
  // primaryActive: '',
  secondary: '#e6eaea',
  // Dark gray
  // secondaryHover: '',
  // secondaryActive: '',
  nexoya: '#0ec76a',
  // Neon green
  danger: '#ed3434',
  // Red
  warning: '#f9db2f',
  // Orange
  success: '#0ec76a',
  // Green
  white: '#fff', // white
};
export const textColors: TextColors = {
  reading: '#000000',
  // Lighter black,
  muted: '#757575',
  // Gray for regular font
  mutedBold: '#4a4a4a', // Gray for bold font
};
export const layoutColors: LayoutColors = {
  sidebarBG: '#ffffff',
  // White
  topbarBG: '#ffffff',
  // White
  mainBG: '#F0F6F7',
  // Light gray
  cardPrimaryBG: '#fff',
  // White
  cardSecondaryBG: '#f4f8f9', // Light blue gray
};
export const layout: Layout = {
  sidebar: 250,
  sidebarTablet: 65,
  toolBar: 58,
};
export const fonts: Fonts = {
  main: 'EuclidCircularB',
  strong:
    "'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'",
  regular:
    "'Roboto', sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif",
};

function layers() {
  return {
    base: 0,
    body: 1,
    menu: 3,
    tooltip: 4,
    dialog: 5,
    chart: 6,
    close: 7,
  };
}

const theme: ThemeStyled = {
  colors: { ...mainColors, text: textColors, layout: layoutColors },
  layout,
  fonts,
  layers: layers(),
};
export default theme;

export const TOAST_OPTIONS = {
  classNames: {
    closeButton: 'border border-[#CBD5E1] text-neutral-500',
  },
  style: {
    fontFamily: 'EuclidCircularB',
    border: '1px solid #CBD5E1',
    boxShadow: '0px 16px 24px -8px rgba(183, 186, 199, 0.22)',
    color: '#2A2A32',
    padding: 16,
    gap: 8,
  },
};
