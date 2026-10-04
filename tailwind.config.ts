import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Outfit"', 'sans-serif'],
        mochi: ['MochiBoom', 'cursive', 'sans-serif'],
        mochiExtrude: ['MochiBoomExtrude', 'cursive', 'sans-serif'],
        cute: ['Fredoka', 'Quicksand', 'sans-serif'],
        handwriting: ['Caveat', 'cursive'],
        sans: ['Plus Jakarta Sans', '-apple-system', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#fff1f4',
          100: '#ffe4ea',
          200: '#fecdd7',
          300: '#fda4b8',
          400: '#fb7193',
          500: '#f43f6d',
          600: '#e11d4d',
          accent: '#FF2E63',
          glow: 'rgba(255, 46, 99, 0.35)',
        },
        // User's exact 5-color combo:
        palette: {
          pink: '#FF95A6',      // 1. Flamingo Pink / Primary Accent
          blush: '#FDCBD6',     // 2. Cotton Candy / Soft Baby Pink
          peach: '#FCDED3',     // 3. Warm Apricot / Peach Cream
          lilac: '#D2BFDE',     // 4. Dreamy Lilac / Soft Lavender
          orchid: '#BEA2CE',    // 5. Dusty Orchid / Lavender Purple
          // Complementary high-readability text
          dark: '#2D1F38',      // Deep Plum Slate for crystal-clear readability
          muted: '#7A6B85',     // Soft Plum Slate for secondary copy
        },
        love: {
          50: '#FDF7F8',
          100: '#FCDED3',
          200: '#FDCBD6',
          300: '#FBAEC0',
          400: '#FF95A6',
          500: '#F8758D',
          600: '#D2BFDE',
          700: '#BEA2CE',
          800: '#A182B3',
          900: '#2D1F38',
        },
      },
      boxShadow: {
        'phone-pro': '0 30px 80px -15px rgba(225, 29, 77, 0.18), 0 20px 40px -10px rgba(15, 23, 42, 0.35), 0 0 0 10px #0f172a, 0 0 0 12px #334155',
        'glass': '0 8px 32px 0 rgba(255, 46, 99, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)',
        'glow-pink': '0 0 25px -4px rgba(255, 46, 99, 0.45)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-gentle': 'bounceGentle 2s infinite',
        'heartbeat': 'heartbeat 1.2s ease-in-out infinite',
        'gradient-bg': 'animatedBg 15s ease-in-out infinite',
      },
      keyframes: {
        animatedBg: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '15%': { transform: 'scale(1.15)' },
          '30%': { transform: 'scale(1)' },
          '45%': { transform: 'scale(1.1)' },
        }
      }
    },
  },
  plugins: [],
};
export default config;
