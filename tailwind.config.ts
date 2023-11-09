import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/layout/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        turbo: {
          normal: 'conic-gradient(from -160deg at 50% 50%, #e92a67 0deg, #a853ba 120deg, #2a8af6 240deg, #e92a67 360deg)',
          selected: 'conic-gradient(from -160deg at 50% 50%, #e92a67 0deg, #a853ba 120deg, #2a8af6 240deg, rgba(42, 138, 246, 0) 360deg)',
          simple: 'conic-gradient(from -160deg at 50% 50%,  #a853ba 0deg, #2a8af6 360deg)',
          shadow: '10px 0 15px rgba(42, 138, 246, 0.3), -10px 0 15px rgba(233, 42, 103, 0.3)',
        },


      }
    },
  },
  plugins: [],
};
export default config;
