'use client';

import React, { createContext, useContext } from 'react';
import { boomTokens } from '@/lib/design-tokens/boom-tokens';
import { aiboostTokens } from '@/lib/design-tokens/aiboost-tokens';
import { useTheme, Brand } from '@/components/providers/ThemeProvider';

// Re-export Brand type for backward compatibility
export type { Brand } from '@/components/providers/ThemeProvider';

// Extended tokens structure for Puck components based on brand book
export interface BrandTokens {
  colors: {
    primary: string;
    secondary: string;
    accent?: string;
    background: string;
    backgroundAlt: string;
    backgroundDark: string;
    text: string;
    textLight: string;
    muted: string;
    border: string;
    success: string;
    warning: string;
    error: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  typography: {
    h1: { size: string; weight: number; lineHeight: number; color: string; mobileSize: string };
    h2: { size: string; weight: number; lineHeight: number; color: string; mobileSize: string };
    h3: { size: string; weight: number; lineHeight: number; color: string; mobileSize: string };
    h4: { size: string; weight: number; lineHeight: number; color: string; mobileSize: string };
    h5: { size: string; weight: number; lineHeight: number; color: string; mobileSize: string };
    h6: { size: string; weight: number; lineHeight: number; color: string; mobileSize: string };
    body: { size: string; weight: number; lineHeight: number; color: string };
    bodyLarge: { size: string; weight: number; lineHeight: number; color: string };
    bodySmall: { size: string; weight: number; lineHeight: number; color: string };
    caption: { size: string; weight: number; lineHeight: number; color: string };
    label: { size: string; weight: number; lineHeight: number; color: string };
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    pill: string;
  };
  borderWidth: {
    thin: string;
    medium: string;
    thick: string;
  };
  shadows: {
    subtle: string;
    medium: string;
    large: string;
    cta: string;
  };
  gradients?: {
    hero?: string;
    glow?: string;
  };
  button: {
    primary: {
      background: string;
      color: string;
      borderRadius: string;
      shadow: string;
    };
    secondary: {
      background: string;
      color: string;
      borderRadius: string;
      shadow: string;
    };
    outline: {
      background: string;
      color: string;
      border: string;
      borderRadius: string;
    };
    outlineLight: {
      background: string;
      color: string;
      border: string;
      borderRadius: string;
    };
  };
  layout: {
    maxWidth: string;
    maxWidthNarrow: string;
    maxWidthWide: string;
    containerPadding: string;
  };
  sizing: {
    iconSm: string;
    iconMd: string;
    iconLg: string;
    indicatorSm: string;
    indicatorMd: string;
    indicatorLg: string;
  };
  breakpoints: {
    mobile: string;
    tablet: string;
    desktop: string;
  };
  opacity: {
    disabled: number;
    muted: number;
  };
}

interface PuckBrandContextValue {
  tokens: BrandTokens;
}

const PuckBrandContext = createContext<PuckBrandContextValue | null>(null);

// Get extended tokens for a brand based on brand book
export function getSimplifiedTokens(brand: Brand): BrandTokens {
  if (brand === 'BOOM') {
    return {
      colors: {
        primary: boomTokens.colors.primary.hex,
        secondary: boomTokens.colors.secondary.hex,
        background: boomTokens.colors.background.primary.hex,
        backgroundAlt: boomTokens.colors.background.secondary.hex,
        backgroundDark: boomTokens.colors.background.dark.hex,
        text: boomTokens.colors.text.secondary.hex,
        textLight: '#FFFFFF',
        muted: boomTokens.colors.text.tertiary.hex,
        border: boomTokens.colors.border.light.hex,
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
      },
      fonts: {
        heading: boomTokens.typography.fontFamily.primary,
        body: boomTokens.typography.fontFamily.primary,
      },
      typography: {
        h1: { size: boomTokens.typography.h1.size, weight: boomTokens.typography.h1.weight, lineHeight: boomTokens.typography.h1.lineHeight, color: boomTokens.typography.h1.color, mobileSize: '36px' },
        h2: { size: boomTokens.typography.h2.size, weight: boomTokens.typography.h2.weight, lineHeight: boomTokens.typography.h2.lineHeight, color: boomTokens.typography.h2.color, mobileSize: '28px' },
        h3: { size: boomTokens.typography.h3.size, weight: boomTokens.typography.h3.weight, lineHeight: boomTokens.typography.h3.lineHeight, color: boomTokens.typography.h3.color, mobileSize: '24px' },
        h4: { size: boomTokens.typography.h4.size, weight: boomTokens.typography.h4.weight, lineHeight: boomTokens.typography.h4.lineHeight, color: boomTokens.typography.h4.color, mobileSize: '20px' },
        h5: { size: boomTokens.typography.h5.size, weight: boomTokens.typography.h5.weight, lineHeight: boomTokens.typography.h5.lineHeight, color: boomTokens.typography.h5.color, mobileSize: '18px' },
        h6: { size: boomTokens.typography.h6.size, weight: boomTokens.typography.h6.weight, lineHeight: boomTokens.typography.h6.lineHeight, color: boomTokens.typography.h6.color, mobileSize: '16px' },
        body: { size: boomTokens.typography.body.medium.size, weight: boomTokens.typography.body.medium.weight, lineHeight: boomTokens.typography.body.medium.lineHeight, color: boomTokens.typography.body.medium.color },
        bodyLarge: { size: '1.125rem', weight: 400, lineHeight: 1.6, color: boomTokens.typography.body.medium.color },
        bodySmall: { size: boomTokens.typography.body.small.size, weight: boomTokens.typography.body.small.weight, lineHeight: boomTokens.typography.body.small.lineHeight, color: boomTokens.typography.body.small.color },
        caption: { size: boomTokens.typography.body.tiny.size, weight: boomTokens.typography.body.tiny.weight, lineHeight: boomTokens.typography.body.tiny.lineHeight, color: boomTokens.typography.body.tiny.color },
        label: { size: boomTokens.typography.body.small.size, weight: 600, lineHeight: 1.4, color: boomTokens.typography.body.medium.color },
      },
      spacing: {
        xs: boomTokens.spacing.xs,
        sm: boomTokens.spacing.sm,
        md: boomTokens.spacing.md,
        lg: boomTokens.spacing.lg,
        xl: boomTokens.spacing.xl,
        '2xl': boomTokens.spacing['2xl'],
        '3xl': boomTokens.spacing['3xl'],
        '4xl': '128px',
      },
      borderRadius: {
        sm: boomTokens.borderRadius.sm,
        md: boomTokens.borderRadius.md,
        lg: boomTokens.borderRadius.lg,
        xl: boomTokens.borderRadius.xl,
        '2xl': '24px',
        pill: boomTokens.borderRadius.pill,
      },
      borderWidth: {
        thin: '1px',
        medium: '2px',
        thick: '4px',
      },
      shadows: {
        subtle: boomTokens.shadow.subtle,
        medium: boomTokens.shadow.medium,
        large: boomTokens.shadow.large,
        cta: boomTokens.shadow.cta,
      },
      button: {
        primary: {
          background: boomTokens.components.button.primary.background,
          color: boomTokens.components.button.primary.color,
          borderRadius: boomTokens.components.button.primary.borderRadius,
          shadow: boomTokens.components.button.primary.boxShadow,
        },
        secondary: {
          background: boomTokens.components.button.secondary.background,
          color: boomTokens.components.button.secondary.color,
          borderRadius: boomTokens.components.button.secondary.borderRadius,
          shadow: boomTokens.components.button.secondary.boxShadow,
        },
        outline: {
          background: boomTokens.components.button.outline.background,
          color: boomTokens.components.button.outline.color,
          border: boomTokens.components.button.outline.border,
          borderRadius: boomTokens.components.button.outline.borderRadius,
        },
        outlineLight: {
          background: boomTokens.components.button.outlineLight.background,
          color: boomTokens.components.button.outlineLight.color,
          border: boomTokens.components.button.outlineLight.border,
          borderRadius: boomTokens.components.button.outlineLight.borderRadius,
        },
      },
      layout: {
        maxWidth: '1200px',
        maxWidthNarrow: '800px',
        maxWidthWide: '1400px',
        containerPadding: boomTokens.spacing.lg,
      },
      sizing: {
        iconSm: '32px',
        iconMd: '48px',
        iconLg: '64px',
        indicatorSm: '32px',
        indicatorMd: '48px',
        indicatorLg: '64px',
      },
      breakpoints: {
        mobile: '480px',
        tablet: '768px',
        desktop: '1024px',
      },
      opacity: {
        disabled: 0.5,
        muted: 0.7,
      },
    };
  }

  // AIBOOST - with gradients support
  return {
    colors: {
      primary: aiboostTokens.colors.primary.hex,
      secondary: aiboostTokens.colors.secondary.hex,
      accent: aiboostTokens.colors.accent.hex,
      background: aiboostTokens.colors.background.white.hex,
      backgroundAlt: aiboostTokens.colors.background.card.hex,
      backgroundDark: aiboostTokens.colors.background.dark.hex,
      text: aiboostTokens.colors.text.secondary.hex,
      textLight: aiboostTokens.colors.text.primary.hex,
      muted: aiboostTokens.colors.text.muted.hex,
      border: aiboostTokens.colors.border.default.hex,
      success: aiboostTokens.colors.success.hex,
      warning: '#F59E0B',
      error: '#EF4444',
    },
    fonts: {
      heading: aiboostTokens.typography.fontFamily.primary,
      body: aiboostTokens.typography.fontFamily.primary,
    },
    typography: {
      h1: { size: aiboostTokens.typography.h1.size, weight: aiboostTokens.typography.h1.weight, lineHeight: aiboostTokens.typography.h1.lineHeight, color: aiboostTokens.typography.h1.color, mobileSize: '36px' },
      h2: { size: aiboostTokens.typography.h2.size, weight: aiboostTokens.typography.h2.weight, lineHeight: aiboostTokens.typography.h2.lineHeight, color: aiboostTokens.typography.h2.color, mobileSize: '28px' },
      h3: { size: aiboostTokens.typography.h3.size, weight: aiboostTokens.typography.h3.weight, lineHeight: aiboostTokens.typography.h3.lineHeight, color: aiboostTokens.typography.h3.color, mobileSize: '24px' },
      h4: { size: aiboostTokens.typography.h4.size, weight: aiboostTokens.typography.h4.weight, lineHeight: aiboostTokens.typography.h4.lineHeight, color: aiboostTokens.typography.h4.color, mobileSize: '20px' },
      h5: { size: aiboostTokens.typography.h5.size, weight: aiboostTokens.typography.h5.weight, lineHeight: aiboostTokens.typography.h5.lineHeight, color: aiboostTokens.typography.h5.color, mobileSize: '18px' },
      h6: { size: aiboostTokens.typography.h6.size, weight: aiboostTokens.typography.h6.weight, lineHeight: aiboostTokens.typography.h6.lineHeight, color: aiboostTokens.typography.h6.color, mobileSize: '16px' },
      body: { size: aiboostTokens.typography.body.size, weight: aiboostTokens.typography.body.weight, lineHeight: aiboostTokens.typography.body.lineHeight, color: aiboostTokens.typography.body.color },
      bodyLarge: { size: '1.125rem', weight: 400, lineHeight: 1.6, color: aiboostTokens.typography.body.color },
      bodySmall: { size: aiboostTokens.typography.bodySmall.size, weight: aiboostTokens.typography.bodySmall.weight, lineHeight: aiboostTokens.typography.bodySmall.lineHeight, color: aiboostTokens.typography.bodySmall.color },
      caption: { size: aiboostTokens.typography.caption.size, weight: aiboostTokens.typography.caption.weight, lineHeight: aiboostTokens.typography.caption.lineHeight, color: aiboostTokens.typography.caption.color },
      label: { size: aiboostTokens.typography.bodySmall.size, weight: 600, lineHeight: 1.4, color: aiboostTokens.typography.body.color },
    },
    spacing: {
      xs: aiboostTokens.spacing.xs,
      sm: aiboostTokens.spacing.sm,
      md: aiboostTokens.spacing.md,
      lg: aiboostTokens.spacing.lg,
      xl: aiboostTokens.spacing.xl,
      '2xl': aiboostTokens.spacing['2xl'],
      '3xl': aiboostTokens.spacing['3xl'],
      '4xl': '128px',
    },
    borderRadius: {
      sm: aiboostTokens.borderRadius.small,
      md: aiboostTokens.borderRadius.input,
      lg: aiboostTokens.borderRadius.card,
      xl: '16px',
      '2xl': '24px',
      pill: aiboostTokens.borderRadius.pill,
    },
    borderWidth: {
      thin: '1px',
      medium: '2px',
      thick: '4px',
    },
    shadows: {
      subtle: aiboostTokens.shadows.card.default,
      medium: aiboostTokens.shadows.card.dark,
      large: aiboostTokens.shadows.card.hover,
      cta: '0px 8px 16px rgba(209, 135, 252, 0.3)',
    },
    gradients: {
      hero: aiboostTokens.gradients.hero.background,
      glow: aiboostTokens.gradients.purpleGlow.background,
    },
    button: {
      primary: {
        background: aiboostTokens.components.button.primary.background,
        color: aiboostTokens.components.button.primary.color,
        borderRadius: aiboostTokens.components.button.primary.borderRadius,
        shadow: 'none',
      },
      secondary: {
        background: aiboostTokens.components.button.secondary.background,
        color: aiboostTokens.components.button.secondary.color,
        borderRadius: aiboostTokens.components.button.secondary.borderRadius,
        shadow: 'none',
      },
      outline: {
        background: aiboostTokens.components.button.outline.background,
        color: aiboostTokens.components.button.outline.color,
        border: aiboostTokens.components.button.outline.border,
        borderRadius: aiboostTokens.components.button.outline.borderRadius,
      },
      outlineLight: {
        background: aiboostTokens.components.button.outlineLight.background,
        color: aiboostTokens.components.button.outlineLight.color,
        border: aiboostTokens.components.button.outlineLight.border,
        borderRadius: aiboostTokens.components.button.outlineLight.borderRadius,
      },
    },
    layout: {
      maxWidth: '1200px',
      maxWidthNarrow: '800px',
      maxWidthWide: '1400px',
      containerPadding: aiboostTokens.spacing.lg,
    },
    sizing: {
      iconSm: '32px',
      iconMd: '48px',
      iconLg: '64px',
      indicatorSm: '32px',
      indicatorMd: '48px',
      indicatorLg: '64px',
    },
    breakpoints: {
      mobile: '480px',
      tablet: '768px',
      desktop: '1024px',
    },
    opacity: {
      disabled: 0.5,
      muted: 0.7,
    },
  };
}

interface PuckBrandProviderProps {
  children: React.ReactNode;
  // initialBrand is deprecated - brand is now sourced from global ThemeProvider
  initialBrand?: Brand;
  // onBrandChange is deprecated - use useTheme().setTheme() instead
  onBrandChange?: (brand: Brand) => void;
}

/**
 * PuckBrandProvider - Provides brand tokens to Puck components
 *
 * Brand is now sourced from the global ThemeProvider.
 * The initialBrand and onBrandChange props are deprecated and ignored.
 * To change the brand, use the main brand switcher in the dashboard menu.
 */
export function PuckBrandProvider({
  children,
}: PuckBrandProviderProps) {
  // Get brand from global ThemeProvider
  const { theme: brand } = useTheme();
  const tokens = getSimplifiedTokens(brand);

  return (
    <PuckBrandContext.Provider value={{ tokens }}>
      {children}
    </PuckBrandContext.Provider>
  );
}

/**
 * Hook for Puck components to access current brand
 * Now sources brand from global ThemeProvider
 */
export function usePuckBrand(): Brand {
  const { theme } = useTheme();
  return theme;
}

/**
 * Hook for accessing brand tokens directly
 * Tokens are computed from the global theme
 */
export function usePuckTokens(): BrandTokens {
  const context = useContext(PuckBrandContext);
  if (!context) {
    // Fallback: compute tokens directly if not within PuckBrandProvider
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { theme } = useTheme();
    return getSimplifiedTokens(theme);
  }
  return context.tokens;
}

/**
 * Hook for brand switcher UI
 * @deprecated Use useTheme() from ThemeProvider directly instead
 * Brand is now controlled by the main dashboard brand switcher
 */
export function usePuckBrandSwitcher() {
  const { theme, setTheme } = useTheme();
  return {
    brand: theme,
    setBrand: setTheme,
  };
}
