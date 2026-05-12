import type { Config } from 'tailwindcss'

export default {
  darkMode: ['class', '[data-theme="dark"]'],
  content: ['./index.html', './src/**/*.{ts,tsx}', '../../packages/shared/src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--primary)',
          light: 'var(--primary-light)',
        },
        secondary: 'var(--secondary)',
        success: 'var(--success)',
        warning: 'var(--warning)',
        danger: 'var(--danger)',
        background: 'var(--bg)',
        foreground: 'var(--fg)',
        card: 'var(--card)',
        muted: 'var(--muted)',
        border: 'var(--border)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
      },
    },
  },
  plugins: [],
} satisfies Config
