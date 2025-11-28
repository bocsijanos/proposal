/**
 * BOOM Marketing Design Tokens
 *
 * Központi design token rendszer a brand book alapján.
 * Forrás: https://boommarketing.hu/
 *
 * Használat:
 * import { boomTokens } from '@/lib/design-tokens/boom-tokens';
 * <h1 style={{ fontSize: boomTokens.typography.h1.size }}>Cím</h1>
 */

export const boomTokens = {
  /**
   * Színpaletta
   * Minden szín HEX és RGB formátumban is elérhető
   */
  colors: {
    primary: {
      hex: '#FE6049',
      rgb: 'rgb(254, 96, 73)',
      name: 'BOOM Coral',
      usage: 'CTA gombok, kiemelések, aktív elemek, hover effektek',
    },
    secondary: {
      hex: '#3E4581',
      rgb: 'rgb(62, 69, 129)',
      name: 'BOOM Navy',
      usage: 'Főcímek (H1, H2), brand szövegek, másodlagos elemek',
    },
    text: {
      primary: {
        hex: '#3E4581',
        rgb: 'rgb(62, 69, 129)',
        name: 'Navy (Headings)',
      },
      secondary: {
        hex: '#777777',
        rgb: 'rgb(119, 119, 119)',
        name: 'Középszürke (Body)',
      },
      tertiary: {
        hex: '#999999',
        rgb: 'rgb(153, 153, 153)',
        name: 'Világos szürke (Subtle)',
      },
    },
    background: {
      primary: {
        hex: '#FFFFFF',
        rgb: 'rgb(255, 255, 255)',
        name: 'Fehér',
      },
      secondary: {
        hex: '#F7F7F7',
        rgb: 'rgb(247, 247, 247)',
        name: 'Világos szürke',
      },
      dark: {
        hex: '#1A1A1A',
        rgb: 'rgb(26, 26, 26)',
        name: 'Sötét szürke',
      },
    },
    border: {
      light: {
        hex: '#E5E7EB',
        rgb: 'rgb(229, 231, 235)',
        name: 'Világos border',
      },
      medium: {
        hex: '#D1D5DB',
        rgb: 'rgb(209, 213, 219)',
        name: 'Közepes border',
      },
    },
  },

  /**
   * Tipográfia
   * Font-family, méretek, vastagságok, line-height-ok
   */
  typography: {
    fontFamily: {
      primary: 'Montserrat, sans-serif',
      system: 'system-ui, -apple-system, sans-serif',
    },

    h1: {
      size: '60px',
      sizeMobile: '36px',
      weight: 700,
      lineHeight: 1.3,
      color: '#FFFFFF',
      letterSpacing: '-0.02em',
    },

    h2: {
      size: '42px',
      sizeMobile: '28px',
      weight: 700,
      lineHeight: 1.3,
      color: '#3E4581',
      letterSpacing: '-0.01em',
    },

    h3: {
      size: '32px',
      sizeMobile: '24px',
      weight: 700,
      lineHeight: 1.4,
      color: '#3E4581',
      letterSpacing: '0',
    },

    h4: {
      size: '24px',
      sizeMobile: '20px',
      weight: 700,
      lineHeight: 1.4,
      color: '#3E4581',
      letterSpacing: '0',
    },

    h5: {
      size: '20px',
      sizeMobile: '18px',
      weight: 600,
      lineHeight: 1.5,
      color: '#3E4581',
      letterSpacing: '0',
    },

    h6: {
      size: '18px',
      sizeMobile: '16px',
      weight: 600,
      lineHeight: 1.5,
      color: '#3E4581',
      letterSpacing: '0',
    },

    body: {
      large: {
        size: '20px',
        weight: 400,
        lineHeight: 1.6,
        color: '#777777',
      },
      medium: {
        size: '18px',
        weight: 400,
        lineHeight: 1.6,
        color: '#777777',
      },
      small: {
        size: '16px',
        weight: 400,
        lineHeight: 1.6,
        color: '#777777',
      },
      tiny: {
        size: '14px',
        weight: 400,
        lineHeight: 1.5,
        color: '#777777',
      },
    },

    bold: {
      weight: 600,
    },
  },

  /**
   * Spacing (8px alapú grid rendszer)
   */
  spacing: {
    xs: '8px',
    sm: '16px',
    md: '24px',
    lg: '32px',
    xl: '48px',
    '2xl': '64px',
    '3xl': '80px',
    '4xl': '96px',
  },

  /**
   * Border Radius
   */
  borderRadius: {
    none: '0',
    sm: '4px',
    md: '8px',
    lg: '10px',
    xl: '12px',
    '2xl': '16px',
    '3xl': '24px',
    pill: '100px',
    full: '9999px',
  },

  /**
   * Box Shadow
   */
  shadow: {
    none: 'none',
    subtle: '0 2px 8px rgba(0, 0, 0, 0.08)',
    medium: '0 4px 12px rgba(0, 0, 0, 0.1)',
    large: '0 8px 24px rgba(0, 0, 0, 0.12)',
    hover: '0 8px 24px rgba(0, 0, 0, 0.12)',
    cta: '0 4px 12px rgba(254, 96, 73, 0.3)',
    ctaHover: '0 6px 16px rgba(254, 96, 73, 0.4)',
  },

  /**
   * Transitions
   */
  transition: {
    fast: '0.15s ease',
    base: '0.3s ease',
    slow: '0.5s ease',
    all: 'all 0.3s ease',
  },

  /**
   * Breakpoints (Responsive)
   */
  breakpoints: {
    mobile: '640px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1280px',
    ultrawide: '1536px',
  },

  /**
   * Container
   */
  container: {
    maxWidth: '1280px',
    padding: '24px',
  },

  /**
   * Components - Előre definiált komponens stílusok
   */
  components: {
    button: {
      primary: {
        background: '#FE6049',
        color: '#FFFFFF',
        borderRadius: '100px',
        padding: '16px 32px',
        fontSize: '18px',
        fontWeight: 400,
        boxShadow: '0 4px 12px rgba(254, 96, 73, 0.3)',
        transition: 'all 0.3s ease',
        hover: {
          transform: 'translateY(-2px)',
          boxShadow: '0 6px 16px rgba(254, 96, 73, 0.4)',
        },
      },
      secondary: {
        background: '#3E4581',
        color: '#FFFFFF',
        borderRadius: '100px',
        padding: '16px 32px',
        fontSize: '18px',
        fontWeight: 400,
        boxShadow: '0 4px 12px rgba(62, 69, 129, 0.3)',
        transition: 'all 0.3s ease',
        hover: {
          transform: 'translateY(-2px)',
          boxShadow: '0 6px 16px rgba(62, 69, 129, 0.4)',
        },
      },
      outline: {
        background: 'transparent',
        color: '#FE6049',
        border: '2px solid #FE6049',
        borderRadius: '100px',
        padding: '14px 30px', // 2px kevesebb a border miatt
        fontSize: '18px',
        fontWeight: 400,
        transition: 'all 0.3s ease',
        hover: {
          background: '#FE6049',
          color: '#FFFFFF',
        },
      },
      outlineLight: {
        background: 'transparent',
        color: '#FFFFFF',
        border: '2px solid #FFFFFF',
        borderRadius: '100px',
        padding: '14px 30px',
        fontSize: '18px',
        fontWeight: 400,
        transition: 'all 0.3s ease',
        hover: {
          background: 'rgba(255, 255, 255, 0.1)',
          color: '#FFFFFF',
        },
      },
      sizes: {
        small: {
          padding: '12px 24px',
          fontSize: '16px',
        },
        medium: {
          padding: '16px 32px',
          fontSize: '18px',
        },
        large: {
          padding: '20px 40px',
          fontSize: '20px',
        },
      },
    },

    card: {
      background: '#FFFFFF',
      borderRadius: '10px',
      padding: '32px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
      transition: 'all 0.3s ease',
      hover: {
        transform: 'translateY(-4px)',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
      },
    },

    input: {
      background: '#FFFFFF',
      border: '1px solid #E5E7EB',
      borderRadius: '8px',
      padding: '12px 16px',
      fontSize: '16px',
      color: '#1F2937',
      transition: 'all 0.3s ease',
      focus: {
        borderColor: '#FE6049',
        outline: 'none',
        boxShadow: '0 0 0 3px rgba(254, 96, 73, 0.1)',
      },
    },
  },
} as const;

/**
 * Type-safe accessor függvények
 */
export const getColor = (path: string) => {
  const keys = path.split('.');
  let value: any = boomTokens.colors;
  for (const key of keys) {
    value = value?.[key];
  }
  return value?.hex || value;
};

export const getSpacing = (size: keyof typeof boomTokens.spacing) => {
  return boomTokens.spacing[size];
};

export const getFontSize = (element: keyof typeof boomTokens.typography) => {
  const typography = boomTokens.typography[element];
  if (typeof typography === 'object' && 'size' in typography) {
    return typography.size;
  }
  return undefined;
};

/**
 * CSS változók generálása (opcionális)
 */
export const generateCSSVariables = () => {
  return `
:root {
  /* Colors */
  --boom-color-primary: ${boomTokens.colors.primary.hex};
  --boom-color-secondary: ${boomTokens.colors.secondary.hex};
  --boom-color-text-primary: ${boomTokens.colors.text.primary.hex};
  --boom-color-text-secondary: ${boomTokens.colors.text.secondary.hex};
  --boom-color-bg-primary: ${boomTokens.colors.background.primary.hex};
  --boom-color-bg-secondary: ${boomTokens.colors.background.secondary.hex};

  /* Typography */
  --boom-font-family: ${boomTokens.typography.fontFamily.primary};
  --boom-font-size-h1: ${boomTokens.typography.h1.size};
  --boom-font-size-h2: ${boomTokens.typography.h2.size};
  --boom-font-size-h3: ${boomTokens.typography.h3.size};
  --boom-font-size-body: ${boomTokens.typography.body.medium.size};

  /* Spacing */
  --boom-spacing-xs: ${boomTokens.spacing.xs};
  --boom-spacing-sm: ${boomTokens.spacing.sm};
  --boom-spacing-md: ${boomTokens.spacing.md};
  --boom-spacing-lg: ${boomTokens.spacing.lg};
  --boom-spacing-xl: ${boomTokens.spacing.xl};

  /* Border Radius */
  --boom-radius-sm: ${boomTokens.borderRadius.sm};
  --boom-radius-md: ${boomTokens.borderRadius.md};
  --boom-radius-lg: ${boomTokens.borderRadius.lg};
  --boom-radius-pill: ${boomTokens.borderRadius.pill};

  /* Shadows */
  --boom-shadow-subtle: ${boomTokens.shadow.subtle};
  --boom-shadow-medium: ${boomTokens.shadow.medium};
  --boom-shadow-large: ${boomTokens.shadow.large};
}
`.trim();
};
