/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    /^bg-/,
    /^to-/,
    /^from-/,
    'text-2xl',
    'text-3xl',
    'text-4xl',
    'text-5xl',
    'text-6xl',
    'sm:text-2xl',
    'sm:text-3xl',
    'sm:text-4xl',
    'sm:text-5xl',
    'sm:text-6xl',
    'md:text-2xl',
    'md:text-3xl',
    'md:text-4xl',
    'md:text-5xl',
    'md:text-6xl',
    'lg:text-2xl',
    'lg:text-3xl',
    'lg:text-4xl',
    'lg:text-5xl',
    'lg:text-6xl',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          '100': '#ff5ea5',
          '200': '#ffb2d5'
        },
        secondary: {
          '100': '#0896ff',
          '200': '#ffb2d5'
        }
        },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
    fontFamily: {
      Montserrant:["Montserrat"],
      OpenSans: ["Open Sans"],
      Roboto: ["Roboto"],
      LeagueSpartan: ["League Spartan"]
    },
    fontSize: {
      'xs': '.75rem',
      'sm': '.875rem',
      'base': '1rem',
      'lg': '1.125rem',
      'xl': '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '3.2rem',
     },
  },
  plugins: [],
}
