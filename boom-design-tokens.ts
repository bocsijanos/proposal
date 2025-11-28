/**
 * BOOM Marketing Agency - Design Tokens
 * TypeScript definíciók és használható konstansok
 */

// ==================== COLORS ====================

export const colors = {
  // Brand Colors
  brand: {
    primary: '#FE6049',
    primaryHover: '#E5513D',
    primaryActive: '#CC4432',
    primaryLight: '#FFE5E0',
  },

  // Text Colors
  text: {
    primary: '#3E4581',
    secondary: '#777777',
    tertiary: '#999999',
    disabled: '#CCCCCC',
    white: '#FFFFFF',
  },

  // Background Colors
  background: {
    primary: '#FFFFFF',
    secondary: '#F7F7F7',
    tertiary: '#FAFAFA',
    dark: '#1A1A1A',
  },

  // Border Colors
  border: {
    light: '#E5E5E5',
    medium: '#CCCCCC',
    dark: '#999999',
  },

  // Utility Colors
  utility: {
    success: '#48BB78',
    warning: '#ECC94B',
    error: '#E53E3E',
    info: '#4299E1',
  },
} as const;

// ==================== TYPOGRAPHY ====================

export const typography = {
  fontFamily: {
    primary: "'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    mono: "'Fira Code', 'Courier New', monospace",
  },

  fontSize: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '32px',
    '4xl': '42px',
    '5xl': '60px',
  },

  fontWeight: {
    regular: 400,
    semibold: 600,
    bold: 700,
    black: 900,
  },

  lineHeight: {
    tight: 1.3,
    normal: 1.5,
    relaxed: 1.6,
    loose: 1.8,
  },

  letterSpacing: {
    tighter: '-0.5px',
    tight: '-0.3px',
    normal: '0px',
    wide: '0.5px',
    wider: '1px',
  },
} as const;

// ==================== SPACING ====================

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
  '3xl': '64px',
  '4xl': '80px',
  '5xl': '96px',
  '6xl': '128px',
} as const;

// ==================== BORDER RADIUS ====================

export const borderRadius = {
  none: '0px',
  sm: '3px',
  md: '10px',
  lg: '15px',
  xl: '20px',
  full: '100px',
  circle: '50%',
} as const;

// ==================== SHADOWS ====================

export const shadows = {
  none: 'none',
  sm: '0px 2px 4px rgba(0, 0, 0, 0.08)',
  md: '0px 4px 8px rgba(0, 0, 0, 0.1)',
  lg: '0px 8px 16px rgba(0, 0, 0, 0.12)',
  xl: '0px 12px 24px rgba(0, 0, 0, 0.15)',
  '2xl': '0px 16px 32px rgba(0, 0, 0, 0.18)',

  // Branded shadows
  primary: {
    sm: '0px 4px 12px rgba(254, 96, 73, 0.15)',
    md: '0px 8px 20px rgba(254, 96, 73, 0.25)',
    lg: '0px 12px 32px rgba(254, 96, 73, 0.3)',
  },

  // Component specific
  card: '0px 0px 10px rgba(0, 0, 0, 0.15)',
  cardHover: '0px 16px 32px rgba(0, 0, 0, 0.15)',
  testimonial: '0px 0px 20px rgba(254, 96, 73, 0.15)',
  inner: 'inset 0px 2px 4px rgba(0, 0, 0, 0.06)',
} as const;

// ==================== TRANSITIONS ====================

export const transitions = {
  duration: {
    fast: '150ms',
    base: '200ms',
    medium: '300ms',
    slow: '500ms',
  },

  timing: {
    ease: 'ease',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },

  // Shorthand használatra
  default: 'all 200ms ease',
  smooth: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
  transform: 'transform 300ms cubic-bezier(0.4, 0, 0.2, 1)',
  color: 'color 200ms ease',
} as const;

// ==================== BREAKPOINTS ====================

export const breakpoints = {
  xs: '320px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1440px',
} as const;

// ==================== Z-INDEX ====================

export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  fixed: 1200,
  modalBackdrop: 1300,
  modal: 1400,
  popover: 1500,
  tooltip: 1600,
} as const;

// ==================== CONTAINER ====================

export const container = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1440px',
} as const;

// ==================== TYPE DEFINITIONS ====================

export type ColorKey = keyof typeof colors;
export type SpacingKey = keyof typeof spacing;
export type BorderRadiusKey = keyof typeof borderRadius;
export type ShadowKey = keyof typeof shadows;
export type BreakpointKey = keyof typeof breakpoints;

// ==================== THEME OBJECT ====================

export const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  transitions,
  breakpoints,
  zIndex,
  container,
} as const;

export default theme;
