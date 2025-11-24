/**
 * PostCSS Configuration for Tailwind CSS v3
 *
 * This is the standard PostCSS setup for Tailwind CSS v3 in Next.js projects.
 * We use v3 instead of v4 for stability and compatibility.
 *
 * @see https://tailwindcss.com/docs/installation/using-postcss
 */
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};

export default config;
