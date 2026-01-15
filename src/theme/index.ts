export const nexyColors = {
  azure: '#05a8fa',
  lightBlue200: '#94DCF4',
  lightBlue100: '#C3EBF9',
  aliceBlue: '#edf9ff',
  battleshipGrey: '#71727a',
  battleshipGrey09: 'rgba(113, 114, 122, 0.09)',
  battleshipGrey08: 'rgba(113,114,122,0.08)',
  blueGrey: '#888a94',
  blueyGrey: '#a0a2ad',
  brightLilac: '#d564ed',
  charcoalGrey: '#424347',
  charcoal: '#41424e',
  cloudyBlue: '#b7bac7',
  cloudyBlue80: 'rgba(183,186,199,0.8)',
  dandelion: '#fad311',
  darkGrey: '#2a2b2e',
  darkGreyTwo: '#2a2b2e',
  ghostWhite: '#fafbff',
  greenTeal: '#0ec76a',
  greenTeal2: '#0ebf66',
  // button hover
  greenTeal3: '#0db862',
  // button
  greenTeal4: '#0dba63',
  // hover button text color
  greenTeal5: '#7edcb1',
  // hover button text color
  greenTeal10: 'rgba(14, 199, 106, 0.1)',
  lightPeriwinkle: '#ced1e0',
  orangeyRed: '#ed3434',
  orangeyRed2: '#da3030',
  orangeyRed3: '#c72b2b',
  frenchGray: '#C7C8D1',
  paleGrey: '#F0F2FA',
  paleGrey50: 'rgba(240,242,250,0.5)',
  paleGrey40: 'rgba(240,242,250,0.4)',
  paleGrey25: 'rgba(240,242,250,0.25)',
  paleLilac: '#dfe1ed',
  paleLilac07: 'rgba(223, 225, 237, 0.07)',
  paleLilac10: 'rgba(223, 225, 237, 0.10)',
  paleLilac25: 'rgba(223, 225, 237, 0.25)',
  paleLilac33: 'rgba(223, 225, 237, 0.33)',
  paleLilac40: 'rgba(223, 225, 237, 0.40)',
  paleLilac50: 'rgba(223, 225, 237, 0.50)',
  paleLilac66: 'rgba(223, 225, 237, 0.66)',
  lilac: '#744CED',
  pumpkinOrange: '#f6820d',
  pumpkinOrangeLight: '#FDDBBA',
  pumpkinOrangeVeryLight: '#FEF6EE',
  purpleish: '#d7d0f7',
  lavender: '#EBE7FB',
  purpleishBlue: '#674ced',
  slateGray: '#595a61',
  paleSlateGray: '#6F7185',
  davyGray: '#585A6A80',
  neutral50: '#F9FAFA',
  neutral100: '#E3E4E8',
  neutral200: '#C7C8D1',
  neutral300: '#A6A7B5',
  neutral400: '#8A8C9E',
  neutral500: '#6F7185',
  neutral600: '#585A6A',
  neutral700: '#41424E',
  neutral900: '#151519',
  coolGray: '#8A8C9E',
  seasalt: '#F9FAFA',
  white: '#ffffff',
  paleWhite: '#FBFBFD',
  black: '#131314',
  raisinBlack: '#2A2A32',
  secondaryText: '#a6a7b5',
  red400: '#E22252',
};
const nexyLayout = {
  sidebarTablet: '76px',
  sidebarLaptop: '218px',
  bodyHorizontalPaddingTablet: '32px',
  bodyHorizontalPaddingLaptopL: '48px',
  bodyHorizontalPaddingDesktop: '80px',
  headerExpandedHeight: '125px',
  headerCollapsedHeight: '64px',
};

function createLayout(layouts) {
  return { ...layouts };
}

const nexyFonts = {
  font: '"EuclidCircularB"',
  fontFallback: 'Poppins',
  fontSystem:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
};

function createFonts(fonts) {
  return {
    ...fonts,
    fontFamily: Object.keys(fonts)
      .map((key) => fonts[key])
      .join(','),
  };
}

function createTheme(colors) {
  const transformed = Object.keys(colors)
    .map((c) => ({
      key: c,
      value: colors[c],
    }))
    .map(({ key, value }) => ({
      key,
      value,
    }))
    .reduce((prev, { key, value }) => ({ ...prev, [key]: value }), {});
  return transformed;
}

const theme = {
  nexy: {
    ...createTheme(nexyColors),
    ...createFonts(nexyFonts),
    ...createLayout(nexyLayout),
  },
};

if (import.meta.env.MODE === 'development') {
  // eslint-disable-next-line no-console
  console.log(theme);
}

export type ThemeStyled = typeof theme;
export default theme;
