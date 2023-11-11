import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/containers/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/layout/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'turbo': 'conic-gradient(from -160deg at 50% 50%, #e92a67 0deg, #a853ba 120deg, #2a8af6 240deg, #e92a67 360deg)',
        'turbo-shadow': '10px 0 15px rgba(42, 138, 246, 0.3), -10px 0 15px rgba(233, 42, 103, 0.3)',
        'turbo-selected': 'conic-gradient(from -160deg at 50% 50%, #e92a67 0deg, #a853ba 120deg, #2a8af6 240deg, rgba(42, 138, 246, 0) 360deg)',
      },
      keyframes: {
        spinner: {
          '100%': {
            transform: 'translate(-50%, -50%) rotate(-360deg);',
          }
        },
      },
      animation: {
        mySpinner: 'bbb 4s linear infinite',
      },
      borderRadius: {
        'std': '10px',
        'std-sm': '4px'
      },
      colors: {
        light: {
          DEFAULT: '#ffffff',
          weak: '#5B5B5B'
        },
        deep: {
          DEFAULT: '#1c1c1c',
          weak: '#3c3c3c',
          strong: '#0c0c0c'
        },
        turbo: {
          deep: '#a853ba',
          light: '#2a8af6',
        }
      },
      spacing: {
        std: '20px',
        'std-sm': '12px',
      }
    },
  },
  plugins: [],
};
export default config;
