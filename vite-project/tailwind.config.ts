import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

const config: Config = {
  content: [
    "./src/**/*.{ts,tsx,js,jsx,html}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    typography,
  ],
};

export default config;