/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './modules/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#0F1115', // Primary Background
          panel: '#171A21', // Secondary Background
          card: '#1C2028', // Card Background
          sidebar: '#14171D', // Sidebar Background
          border: '#262A34', // Subtle border
          divider: '#1E222B',
        },
        text: {
          primary: '#FFFFFF', // Pure white
          secondary: '#9CA3AF', // Soft Gray
          muted: '#6B7280', // Muted Gray
        },
        accent: {
          purple: '#8B5CF6',
          green: '#10B981',
          blue: '#3B82F6',
          amber: '#F59E0B',
          red: '#EF4444', // Destructive only
        },
      },
      borderRadius: {
        input: '10px',
        button: '10px',
        card: '12px',
        dialog: '16px',
        badge: '9999px',
      },
      spacing: {
        4: '4px',
        8: '8px',
        12: '12px',
        16: '16px',
        24: '24px',
        32: '32px',
        48: '48px',
        64: '64px',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
