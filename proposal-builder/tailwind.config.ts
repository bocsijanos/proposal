/**
 * Tailwind CSS v3 Configuration
 *
 * This is the stable, production-ready configuration for Tailwind CSS v3.
 * We use v3 instead of v4 because:
 * - v3 is stable and battle-tested
 * - v4 has compatibility issues with current Next.js setup
 * - All utility classes work reliably in v3
 *
 * @see https://tailwindcss.com/docs/configuration
 */
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
