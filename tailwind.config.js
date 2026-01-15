const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import("tailwindcss").Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './src/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    './src/components-ui/*.ts,tsx}',
    './src/**/**/*.{ts,tsx}',
    './src/**/**/**/*.{ts,tsx}',
    './src/**/**/**/**/*.{ts,tsx}',
    './src/**/**/**/**/**/*.{ts,tsx}',
    './src/**/**/**/**/**/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
    },
    extend: {
      screens: {
        laptop: '1024px',
        laptopL: '1440px',
        desktop: '1920px',
        desktopL: '2560px',
      },
      boxShadow: {
        secondary: '0px 2px 3px -1px rgba(136, 138, 148, 0.12)',
      },
      colors: {
        border: '#F9FAFA',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: '#6F7185',
          foreground: '#8A8C9E',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: '#E3E4E8',
          dark: '#41424E',
        },
        popover: {
          DEFAULT: '#2A2A32',
          foreground: '#B7BAC7',
        },
        card: {
          DEFAULT: '#2A2B2E',
          foreground: '#B7BAC7',
        },
        darkGrey: {
          100: '#2A2B2E',
        },
        davyGray: {
          DEFAULT: '#585A6A80',
        },
        cloudyBlue: {
          DEFAULT: '#B7BAC7',
        },
        blueGrey: {
          DEFAULT: '#888A94',
        },
        aliceBlue: {
          DEFAULT: '#EDF9FF',
        },
        charcoalGrey: {
          DEFAULT: '#424347',
        },
        seasalt: {
          DEFAULT: '#F9FAFA',
        },
        blueyGrey: {
          DEFAULT: '#A0A2Ad',
        },
        frenchGray: {
          DEFAULT: '#C7C8D1',
        },
        paleGrey: {
          DEFAULT: '#F9FAFA',
        },
        neutral: {
          900: '#151519',
          800: '#2A2A32',
          700: '#41424E',
          600: '#585A6A',
          500: '#6F7185',
          400: '#8A8C9E',
          300: '#A6A7B5',
          200: '#C7C8D1',
          100: '#E3E4E8',
          50: '#F9FAFA',
        },
        green: {
          400: '#0EC76A',
          300: '#16DA77',
          200: '#88E7B7',
          100: '#ABF7D1',
        },
        purple: {
          400: '#744CED',
          300: '#8D79F2',
          200: '#B4A7F6',
          100: '#DCD5FB',
        },
        orange: {
          400: '#F6820D',
          300: '#F89C3F',
          200: '#FAB570',
          100: '#FCCFA2',
          10: '#FDE7D0',
        },
        lightBlue: {
          400: '#20B7E9',
          300: '#58C9EE',
          200: '#94DCF4',
          100: '#C3EBF9',
          10: '#DDF3FC',
        },
        red: {
          500: '#ED3434',
          400: '#E22252',
          300: '#E95379',
          200: '#F490A9',
          100: '#F9BECD',
          10: '#FCDFE6',
        },
      },
      borderRadius: {
        lg: `var(--radius)`,
        md: '5px',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', ...fontFamily.sans],
      },
      fontSize: {
        mdlg: '16px',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
