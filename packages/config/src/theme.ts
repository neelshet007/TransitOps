// TransitOps Enterprise UI Design System Tokens
// Configured for Charcoal Premium Dark Mode with Purple/Green Accents

export const designTokens = {
  theme: 'dark',
  colors: {
    // Premium Charcoal Palette
    background: {
      default: '#121214',  // Deep charcoal background
      paper: '#1e1e24',    // Elevated cards / panels
      subtle: '#2a2a32',   // Hover / active item background
    },
    text: {
      primary: '#f3f4f6',  // Cool light gray text
      secondary: '#9ca3af',// Soft neutral gray
      disabled: '#6b7280', // Darker gray for disabled text
    },
    // Restrained Accents
    primary: {
      main: '#8b5cf6',     // Violet Purple
      light: '#a78bfa',
      dark: '#7c3aed',
      contrastText: '#ffffff',
    },
    success: {
      main: '#10b981',     // Emerald Green
      light: '#34d399',
      dark: '#059669',
      contrastText: '#ffffff',
    },
    error: {
      main: '#ef4444',     // Crimson Red
      light: '#f87171',
      dark: '#dc2626',
    },
    warning: {
      main: '#f59e0b',     // Amber
      light: '#fbbf24',
      dark: '#d97706',
    },
    border: {
      default: '#2e2e38',  // Thin dark borders
      subtle: '#24242d',
    },
  },
  typography: {
    fontFamily: "'Outfit', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    fontSize: {
      xs: '0.75rem',     // 12px
      sm: '0.875rem',    // 14px - standard text
      base: '1rem',      // 16px
      lg: '1.125rem',    // 18px
      xl: '1.25rem',     // 20px
      h2: '1.5rem',      // 24px
      h1: '1.875rem',    // 30px
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },
  // 8px Spacing System
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },
  // 10-14px Border Radius
  borderRadius: {
    small: '6px',
    medium: '10px',      // Standard card components
    large: '14px',       // Large modal / panels
    pill: '9999px',
  },
  // Subtle shadows (elevated look without being heavy)
  shadows: {
    subtle: '0 2px 8px rgba(0, 0, 0, 0.4)',
    elevated: '0 8px 24px rgba(0, 0, 0, 0.6)',
    glow: '0 0 12px rgba(139, 92, 246, 0.15)', // Purple glow
  },
  animations: {
    transitionSpeed: {
      fast: '150ms ease',
      normal: '250ms ease-in-out',
      slow: '350ms cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },
};

export type DesignTokens = typeof designTokens;
export default designTokens;
