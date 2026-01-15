import { createGlobalStyle } from 'styled-components';

import { colorByKey, fontByKey } from './utils';

const GlobalStyles = createGlobalStyle`
  @font-face {
    font-family: "EuclidCircularB";
    src: url("https://cdn.nexoya.io/font/EuclidCircularB-Regular.woff2")
      format("woff2");
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: "EuclidCircularB";
    src: url("https://cdn.nexoya.io/font/EuclidCircularB-Medium.woff2")
      format("woff2");
    font-weight: 500;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: "FF Max Pro";
    src: url("https://cdn.nexoya.io/font/MaxOT-Regular.otf")
      format("opentype");
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  /* devanagari */
  @font-face {
    font-family: 'Poppins';
    font-style: normal;
    font-weight: 400;
    font-display: swap;
    src: local('Poppins Regular'), local('Poppins-Regular'), url(https://fonts.gstatic.com/s/poppins/v8/pxiEyp8kv8JHgFVrJJbecnFHGPezSQ.woff2) format('woff2');
    unicode-range: U+0900-097F, U+1CD0-1CF6, U+1CF8-1CF9, U+200C-200D, U+20A8, U+20B9, U+25CC, U+A830-A839, U+A8E0-A8FB;
  }
  /* latin-ext */
  @font-face {
    font-family: 'Poppins';
    font-style: normal;
    font-weight: 400;
    font-display: swap;
    src: local('Poppins Regular'), local('Poppins-Regular'), url(https://fonts.gstatic.com/s/poppins/v8/pxiEyp8kv8JHgFVrJJnecnFHGPezSQ.woff2) format('woff2');
    unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
  }
  /* latin */
  @font-face {
    font-family: 'Poppins';
    font-style: normal;
    font-weight: 400;
    font-display: swap;
    src: local('Poppins Regular'), local('Poppins-Regular'), url(https://fonts.gstatic.com/s/poppins/v8/pxiEyp8kv8JHgFVrJJfecnFHGPc.woff2) format('woff2');
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
  }
  /* devanagari */
  @font-face {
    font-family: 'Poppins';
    font-style: normal;
    font-weight: 500;
    font-display: swap;
    src: local('Poppins Medium'), local('Poppins-Medium'), url(https://fonts.gstatic.com/s/poppins/v8/pxiByp8kv8JHgFVrLGT9Z11lFd2JQEl8qw.woff2) format('woff2');
    unicode-range: U+0900-097F, U+1CD0-1CF6, U+1CF8-1CF9, U+200C-200D, U+20A8, U+20B9, U+25CC, U+A830-A839, U+A8E0-A8FB;
  }
  /* latin-ext */
  @font-face {
    font-family: 'Poppins';
    font-style: normal;
    font-weight: 500;
    font-display: swap;
    src: local('Poppins Medium'), local('Poppins-Medium'), url(https://fonts.gstatic.com/s/poppins/v8/pxiByp8kv8JHgFVrLGT9Z1JlFd2JQEl8qw.woff2) format('woff2');
    unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
  }
  /* latin */
  @font-face {
    font-family: 'Poppins';
    font-style: normal;
    font-weight: 500;
    font-display: swap;
    src: local('Poppins Medium'), local('Poppins-Medium'), url(https://fonts.gstatic.com/s/poppins/v8/pxiByp8kv8JHgFVrLGT9Z1xlFd2JQEk.woff2) format('woff2');
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
  }


  * {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }

  html {
    min-height: 100%;
    height: 100%;
  }

  body {
    color: ${colorByKey('darkGreyTwo')};
    font-family: ${fontByKey('fontFamily')};
    background: ${colorByKey('white')};
    font-weight: 500;
    font-size: 14px;
    letter-spacing: 0.4px;
    min-height: 100%;
    height: 100%;
    -webkit-font-smoothing: antialiased;
    -moz-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
    font-smooth: always;
    -webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none;
    -webkit-text-size-adjust: 100%;
    -ms-overflow-style: -ms-autohiding-scrollbar;

    overscroll-behavior-x: none;
  }
#root {
  min-height: 100%;
  position: relative;
}
/* #F0F6F7 */

h1,
h2,
h3,
h4,
h5,
h6 {
  font-weight: 400;
}

h1 {

}

h2 {
  font-size: 2rem;
}

h3 {
  font-size: 1.125rem;
}

h4 {

}

h5 {

}

h6 {

}

hr {
  margin: 25px 0;
  border: none;
  background: #ccc;
  height: 1px;
  width: 100%;
}

a {
  text-decoration: none;
  color: inherit;
}

  @media print {
    @page {
      size: landscape;
    }

    body * {
      visibility: hidden;
    }
    .sectionToPrint, .sectionToPrint * {
      visibility: visible;
    }
    .sectionToPrint {
      position: absolute;
      left: 0;
      top: 0;
    }
  }

.nexoya-main-content {
  margin-left: 200px;
  margin-top: 75px;
  padding: 2em;
}

.nexoya-hoverable:hover {
  background-color: WhiteSmoke !important;
}


/* COMMENT: http://react-day-picker.js.org -> overwrites */
.Selectable
  .DayPicker-Day--selected:not(.DayPicker-Day--start):not(.DayPicker-Day--end):not(.DayPicker-Day--outside) {
  background-color: #DCF9ED !important;
  color: #0ec76a;
}
.DayPicker:not(.DayPicker--interactionDisabled) .DayPicker-Day:not(.DayPicker-Day--disabled):not(.DayPicker-Day--selected):not(.DayPicker-Day--outside):hover {
  color: #0ec76a;
  box-shadow: 0 0 0 1px #d4d4d4;
  border-radius: 4px !important;
  background-color: transparent !important;
}
.Selectable .DayPicker-Day--start {
  border-radius: 3px;
}
.Selectable .DayPicker-Day--selected:not(.DayPicker-Day--disabled):not(.DayPicker-Day--outside) {
  background-color:#0ec76a;
  color: white;
}
.Selectable .DayPicker-Day--selected:not(.DayPicker-Day--disabled):not(.DayPicker-Day--outside):hover {
 background-color:#3fda8c;
}
.Selectable .DayPicker-Day {
  border-radius: 0 !important;
}
.Selectable .DayPicker-Day--start {
  border-radius: 3px !important;
}
.Selectable .DayPicker-Day--end {
  border-radius: 3px !important;
}

.Selectable.DayPicker {
  margin: 0 auto;
  display: block;
}

.selection-drop {
  box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.2),
    0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 2px 1px -1px rgba(0, 0, 0, 0.12);
  position: absolute;
  border-radius: 5px;
  overflow: hidden;
  background: white;
  z-index: 100;
  width: 600px;
  left: 50%;
  transform: translateX(-50%);
  top: 50px;
}



/* Slider */
.slick-slider
{
    position: relative;
    display: block;
    box-sizing: border-box;
            user-select: none;
        touch-action: pan-y;
}

.slick-list
{
    position: relative;

    display: block;
    overflow: hidden;

    margin: 0;
    padding: 0;
}
.slick-list:focus
{
    outline: none;
}
.slick-list.dragging
{
    cursor: pointer;
    cursor: hand;
}

.slick-slider .slick-track,
.slick-slider .slick-list
{
            transform: translate3d(0, 0, 0);
}

.slick-track
{
    position: relative;
    top: 0;
    left: 0;

    display: block;
    margin-left: auto;
    margin-right: auto;
}
.slick-track:before,
.slick-track:after
{
    display: table;

    content: '';
}
.slick-track:after
{
    clear: both;
}
.slick-loading .slick-track
{
    visibility: hidden;
}

.slick-slide
{
    display: none;
    float: left;

    height: 100%;
    min-height: 1px;
}
[dir='rtl'] .slick-slide
{
    float: right;
}
.slick-slide img
{
    display: block;
}
.slick-slide.slick-loading img
{
    display: none;
}
.slick-slide.dragging img
{
    pointer-events: none;
}
.slick-initialized .slick-slide
{
    display: block;
}
.slick-loading .slick-slide
{
    visibility: hidden;
}
.slick-vertical .slick-slide
{
    display: block;

    height: auto;

    border: 1px solid transparent;
}
.slick-arrow.slick-hidden {
    display: none;
}

`;
export default GlobalStyles;
