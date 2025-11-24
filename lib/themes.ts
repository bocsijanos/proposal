/**
 * Brand Theme Configuration
 * Defines color schemes and styling for Boom Marketing and AiBoost brands
 */

export const themes = {
  boom: {
    name: 'Boom Marketing',
    colors: {
      primary: '#fa604a',       // Coral - CTAs, links, accents
      secondary: '#3e4581',     // Slate Blue - secondary elements
      background: '#0b0326',    // Deep Navy - dark backgrounds
      backgroundAlt: '#fef5f4', // Light Pink - alternate sections
      text: '#0b0326',          // Navy - body text
      textLight: '#ffffff',     // White - text on dark
      border: '#e9ecef',        // Light border
      muted: '#6c757d',         // Muted text
    },
    gradients: {
      hero: 'linear-gradient(135deg, #0b0326 0%, #3e4581 100%)',
      cta: 'linear-gradient(135deg, #fa604a 0%, #ff7a65 100%)',
    },
    logo: '/logos/boom.svg',
    borderRadius: {
      sm: '4px',
      md: '8px',
      lg: '12px',
      xl: '16px',
    },
    transition: {
      duration: '0.3s',
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
    shadows: {
      sm: '0 1px 2px 0 rgba(11, 3, 38, 0.05)',
      md: '0 4px 6px -1px rgba(11, 3, 38, 0.1)',
      lg: '0 10px 15px -3px rgba(11, 3, 38, 0.1)',
      xl: '0 20px 25px -5px rgba(11, 3, 38, 0.1)',
    },
  },
  aiboost: {
    name: 'AiBoost',
    colors: {
      primary: '#d187fc',       // Magenta-Purple - CTAs, highlights
      secondary: '#5152a4',     // Muted Purple - secondary elements
      background: '#1f1f43',    // Deep Navy - dark backgrounds
      backgroundAlt: '#f5f0ff', // Light Purple - alternate sections
      text: '#1f1f43',          // Deep Navy - body text
      textLight: '#ffffff',     // White - text on dark
      border: '#e9ecef',        // Light border
      muted: '#6c757d',         // Muted text
    },
    gradients: {
      hero: 'linear-gradient(135deg, #1f1f43 0%, #5152a4 100%)',
      cta: 'linear-gradient(135deg, #d187fc 0%, #b565e8 100%)',
      subtle: 'linear-gradient(135deg, rgba(81, 82, 164, 0.05), rgba(209, 135, 252, 0.05))',
    },
    logo: '/logos/aiboost.svg',
    borderRadius: {
      sm: '6px',
      md: '12px',
      lg: '16px',
      xl: '24px',
    },
    transition: {
      duration: '0.6s',
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
    shadows: {
      sm: '0 1px 2px 0 rgba(31, 31, 67, 0.05)',
      md: '0 4px 6px -1px rgba(31, 31, 67, 0.1)',
      lg: '0 10px 15px -3px rgba(31, 31, 67, 0.1)',
      xl: '0 20px 25px -5px rgba(31, 31, 67, 0.1)',
      glow: '0 0 20px rgba(209, 135, 252, 0.3)',
    },
  },
} as const;

export type ThemeType = keyof typeof themes;
export type Theme = typeof themes[ThemeType];

/**
 * Get theme configuration by brand name
 */
export function getTheme(brand: ThemeType): Theme {
  return themes[brand];
}

/**
 * CSS Custom Properties mapping for dynamic theme switching
 */
export function getThemeCSSVariables(brand: ThemeType): Record<string, string> {
  const theme = themes[brand];

  return {
    '--color-primary': theme.colors.primary,
    '--color-secondary': theme.colors.secondary,
    '--color-background': theme.colors.background,
    '--color-background-alt': theme.colors.backgroundAlt,
    '--color-text': theme.colors.text,
    '--color-text-light': theme.colors.textLight,
    '--color-border': theme.colors.border,
    '--color-muted': theme.colors.muted,
    '--gradient-hero': theme.gradients.hero,
    '--gradient-cta': theme.gradients.cta,
    '--border-radius-sm': theme.borderRadius.sm,
    '--border-radius-md': theme.borderRadius.md,
    '--border-radius-lg': theme.borderRadius.lg,
    '--border-radius-xl': theme.borderRadius.xl,
    '--transition-duration': theme.transition.duration,
    '--transition-easing': theme.transition.easing,
  };
}

/**
 * Apply theme to document root
 */
export function applyTheme(brand: ThemeType): void {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  const cssVars = getThemeCSSVariables(brand);

  Object.entries(cssVars).forEach(([property, value]) => {
    root.style.setProperty(property, value);
  });

  root.setAttribute('data-theme', brand);
}

/**
 * Get contrasting text color for a background color
 */
export function getContrastTextColor(brand: ThemeType, isDark: boolean = false): string {
  const theme = themes[brand];
  return isDark ? theme.colors.textLight : theme.colors.text;
}

/**
 * Inter font configuration
 */
export const fontConfig = {
  family: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  weights: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  sizes: {
    // Desktop sizes
    desktop: {
      h1: '56px',
      h2: '40px',
      h3: '32px',
      h4: '24px',
      h5: '20px',
      h6: '18px',
      bodyLg: '18px',
      body: '16px',
      bodySm: '14px',
      caption: '12px',
    },
    // Mobile sizes (~ 70% of desktop)
    mobile: {
      h1: '40px',
      h2: '32px',
      h3: '24px',
      h4: '20px',
      h5: '18px',
      h6: '16px',
      bodyLg: '16px',
      body: '16px',
      bodySm: '14px',
      caption: '12px',
    },
  },
  lineHeights: {
    tight: '1.1',
    normal: '1.5',
    relaxed: '1.75',
  },
};
