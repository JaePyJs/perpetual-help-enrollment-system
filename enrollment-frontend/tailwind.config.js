/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './**/*.html',
    './js/**/*.js',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#e77f33', // accent color from checklist
          dark: '#d06a23',    // darker variant
          light: '#f19a5a',   // lighter variant
        },
        sidebar: {
          DEFAULT: '#41413c',  // sidebar color from checklist
          dark: '#343431',
          light: '#5a5a52',
        },
        background: {
          DEFAULT: '#fdf6f2',  // background color from checklist
          dark: '#f8e8df',
          light: '#ffffff',
        },
        success: '#38c172',
        warning: '#ffed4a',
        danger: '#e3342f',
        info: '#3490dc',
      },
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
      },
    },
  },
  plugins: [],
}
