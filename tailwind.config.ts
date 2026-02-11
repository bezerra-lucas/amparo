import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: 'rgb(var(--brand-50) / <alpha-value>)',
          100: 'rgb(var(--brand-100) / <alpha-value>)',
          200: 'rgb(var(--brand-200) / <alpha-value>)',
          300: 'rgb(var(--brand-300) / <alpha-value>)',
          400: 'rgb(var(--brand-400) / <alpha-value>)',
          500: 'rgb(var(--brand-500) / <alpha-value>)',
          600: 'rgb(var(--brand-600) / <alpha-value>)',
          700: 'rgb(var(--brand-700) / <alpha-value>)',
          800: 'rgb(var(--brand-800) / <alpha-value>)',
          900: 'rgb(var(--brand-900) / <alpha-value>)',
          DEFAULT: 'rgb(var(--brand-600) / <alpha-value>)'
        },
        canvas: 'rgb(var(--surface-canvas) / <alpha-value>)',
        surface: {
          DEFAULT: 'rgb(var(--surface-card) / <alpha-value>)',
          muted: 'rgb(var(--surface-muted) / <alpha-value>)'
        },
        ink: {
          strong: 'rgb(var(--text-strong) / <alpha-value>)',
          muted: 'rgb(var(--text-muted) / <alpha-value>)',
          subtle: 'rgb(var(--text-subtle) / <alpha-value>)'
        },
        line: {
          DEFAULT: 'rgb(var(--line-default) / <alpha-value>)',
          strong: 'rgb(var(--line-strong) / <alpha-value>)'
        }
      },
      fontFamily: {
        sans: ['var(--font-body)', 'ui-sans-serif', 'Segoe UI', 'sans-serif'],
        heading: ['var(--font-heading)', 'ui-serif', 'Georgia', 'serif']
      },
      boxShadow: {
        panel:
          '0 1px 2px rgb(var(--brand-900) / 0.08), 0 14px 30px -26px rgb(var(--brand-700) / 0.4)',
        soft: '0 20px 34px -24px rgb(var(--brand-700) / 0.45)'
      }
    }
  },
  plugins: []
} satisfies Config;
