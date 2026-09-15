// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './context/**/*.{ts,tsx}',
    './data/**/*.{ts,tsx}', // important: badgeColor strings live here
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-jakarta)', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#fff7ed',
          100: '#ffedd5',
          500: '#ff6b35',
          600: '#ea580c',
          700: '#c2410c',
          dark: '#121417',
          card: '#1a1d21',
        },
      },
      boxShadow: {
        glow: '0 0 25px -5px rgba(255, 107, 53, 0.4)',
        'glow-lg': '0 0 35px -5px rgba(255, 107, 53, 0.6)',
      },
      keyframes: {
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        'toast-in': {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'bounce-subtle': 'bounce-subtle 2s infinite',
        'toast-in': 'toast-in 0.25s ease-out',
      },
    },
  },
  plugins: [],
};

export default config;