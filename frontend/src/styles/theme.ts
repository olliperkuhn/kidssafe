/**
 * Kidssafe Central Design System & Theme Definition
 * Gemäß AGENTS.md: Alle UI-Komponenten importieren ausschließlich diese Parameter.
 */

export const theme = {
  colors: {
    primary: {
      default: '#4F46E5', // Indigo 600
      hover: '#4338CA',   // Indigo 700
      light: '#EEF2FF',   // Indigo 50
      contrast: '#FFFFFF',
    },
    secondary: {
      default: '#0EA5E9', // Sky 500
      hover: '#0284C7',   // Sky 600
      light: '#F0F9FF',   // Sky 50
      contrast: '#FFFFFF',
    },
    success: {
      default: '#10B981', // Emerald 500
      light: '#ECFDF5',
      contrast: '#FFFFFF',
    },
    warning: {
      default: '#F59E0B', // Amber 500
      light: '#FFFBEB',
      contrast: '#FFFFFF',
    },
    danger: {
      default: '#EF4444', // Red 500
      light: '#FEF2F2',
      contrast: '#FFFFFF',
    },
    neutral: {
      50: '#F8FAFC',
      100: '#F1F5F9',
      200: '#E2E8F0',
      300: '#CBD5E1',
      400: '#94A3B8',
      500: '#64748B',
      600: '#475569',
      700: '#334155',
      800: '#1E293B',
      900: '#0F172A',
    },
    background: '#F8FAFC',
    surface: '#FFFFFF',
    text: {
      primary: '#0F172A',
      secondary: '#475569',
      muted: '#94A3B8',
      inverse: '#FFFFFF',
    },
    border: '#E2E8F0',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },
  borderRadius: {
    sm: '6px',
    md: '10px',
    lg: '16px',
    full: '9999px',
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSize: {
      xs: '0.75rem',   // 12px
      sm: '0.875rem',  // 14px
      md: '1rem',      // 16px
      lg: '1.125rem',  // 18px
      xl: '1.25rem',   // 20px
      xxl: '1.75rem',  // 28px
      huge: '2.5rem',  // 40px
    },
    fontWeight: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  },
  breakpoints: {
    mobile: '640px',
    tablet: '768px',
    laptop: '1024px',
    desktop: '1280px',
  },
} as const;

export type Theme = typeof theme;
