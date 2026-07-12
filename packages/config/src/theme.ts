// TransitOps Enterprise Design System Tokens
// Handcrafted Dark Theme for Transport Operations ERP

export const designTokens = {
  theme: 'dark',
  colors: {
    // Backgrounds
    background: {
      primary: '#0F1115', // Main background
      secondary: '#171A21', // Sub-panels and layouts
      card: '#1C2028', // Information card modules
      sidebar: '#14171D', // Left navigation bar
    },
    // Typography
    text: {
      primary: '#FFFFFF', // Pure white title text
      secondary: '#9CA3AF', // Soft gray body text
      muted: '#6B7280', // Darker gray muted details
    },
    // Borders
    border: {
      subtle: '#262A34', // Low contrast borders
      divider: '#1E222B',
    },
    // Semantic Accent Status Colors
    status: {
      success: '#10B981', // Green
      warning: '#F59E0B', // Amber
      error: '#EF4444', // Red (destructive only)
      info: '#3B82F6', // Blue
      draft: '#6B7280', // Gray
      accent: '#8B5CF6', // Purple
    },
  },
  typography: {
    fontFamily: "'Inter', 'Geist', 'IBM Plex Sans', -apple-system, sans-serif",
    fontSize: {
      xs: '0.75rem', // 12px
      sm: '0.875rem', // 14px (Default text)
      base: '1rem', // 16px
      lg: '1.125rem', // 18px
      xl: '1.25rem', // 20px
      h2: '1.375rem', // 22px (Section header)
      h1: '1.625rem', // 26px (Page header)
    },
    fontWeight: {
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },
  // 8px Spacing Grid
  spacing: {
    grid_4: '4px',
    grid_8: '8px',
    grid_12: '12px',
    grid_16: '16px',
    grid_24: '24px',
    grid_32: '32px',
    grid_48: '48px',
    grid_64: '64px',
  },
  // Spacing Radius
  borderRadius: {
    input: '10px',
    button: '10px',
    card: '12px',
    dialog: '16px',
    badge: '9999px',
  },
  // Subtly defined shadows (no glows, neon, or glassmorphism)
  shadows: {
    subtle: '0 1px 3px rgba(0,0,0,0.2)',
    card: '0 4px 6px rgba(0,0,0,0.3)',
    dialog: '0 12px 24px rgba(0,0,0,0.5)',
  },
};

export type DesignTokens = typeof designTokens;
export default designTokens;
