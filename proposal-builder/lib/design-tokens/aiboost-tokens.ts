/**
 * AI Boost Design Token System
 *
 * Központosított design token rendszer az AI Boost brand identity-hez.
 * Automatikus stílusalkalmazás komponensekben.
 *
 * Elemzés alapja: https://aiboost.hu/
 */

export const aiboostTokens = {
  colors: {
    primary: {
      hex: '#D187FC',
      rgb: 'rgb(209, 135, 252)',
      name: 'AI Boost Purple',
      usage: 'CTA gombok, kiemelések, brand elemek, gradientek',
    },
    secondary: {
      hex: '#1F1F41',
      rgb: 'rgb(31, 31, 65)',
      name: 'AI Boost Navy',
      usage: 'Háttér sávok, másodlagos elemek, sötét kontrasztok',
    },
    accent: {
      hex: '#5152A2',
      rgb: 'rgb(81, 82, 162)',
      name: 'AI Boost Blue',
      usage: 'Másodlagos kiemelések, hover állapotok',
    },
    success: {
      hex: '#80C22E',
      rgb: 'rgb(128, 194, 46)',
      name: 'AI Boost Green',
      usage: 'Sikeres műveletek, pozitív visszajelzések',
    },
    text: {
      primary: {
        hex: '#FFFFFF',
        rgb: 'rgb(255, 255, 255)',
        name: 'White',
        usage: 'Főcímek sötét háttéren, navbár szöveg',
      },
      secondary: {
        hex: '#1F1F41',
        rgb: 'rgb(31, 31, 65)',
        name: 'Dark Navy',
        usage: 'Body szöveg világos háttéren, címsorok',
      },
      muted: {
        hex: '#606266',
        rgb: 'rgb(96, 98, 102)',
        name: 'Gray',
        usage: 'Placeholder szövegek, kevésbé fontos információk',
      },
      faded: {
        hex: '#999999',
        rgb: 'rgb(153, 153, 153)',
        name: 'Light Gray',
        usage: 'Input placeholder, segédszövegek',
      },
    },
    background: {
      dark: {
        hex: '#1F1F41',
        rgb: 'rgb(31, 31, 65)',
        name: 'Dark Navy',
        usage: 'Fő sötét háttér, hero szekciók',
      },
      darker: {
        hex: '#00060D',
        rgb: 'rgb(0, 6, 13)',
        name: 'Deep Black',
        usage: 'Gradiens vége, mély sötét háttér',
      },
      light: {
        hex: '#EEEEEE',
        rgb: 'rgb(238, 238, 255)',
        name: 'Off White',
        usage: 'Világos háttér, content szekciók',
      },
      white: {
        hex: '#FFFFFF',
        rgb: 'rgb(255, 255, 255)',
        name: 'Pure White',
        usage: 'Card háttér, input mezők',
      },
      card: {
        hex: '#F6F6FF',
        rgb: 'rgb(246, 246, 255)',
        name: 'Subtle Purple',
        usage: 'Kártya háttér világos változat',
      },
    },
    border: {
      default: {
        hex: '#DADBE1',
        rgb: 'rgb(218, 219, 221)',
        name: 'Light Border',
        usage: 'Input mezők, kártya szegélyek',
      },
      input: {
        hex: '#666666',
        rgb: 'rgb(102, 102, 102)',
        name: 'Input Border',
        usage: 'Input alapértelmezett szegély',
      },
    },
  },

  typography: {
    fontFamily: {
      primary: 'Inter, sans-serif',
      secondary: 'Montserrat, sans-serif',
    },
    h1: {
      size: '60px',
      weight: 700,
      lineHeight: 1.26, // 75.6px / 60px
      color: '#FFFFFF',
      letterSpacing: '-0.5px',
      usage: 'Hero főcímek sötét háttéren',
    },
    h2: {
      size: '46px',
      weight: 700,
      lineHeight: 1.3,
      color: '#1F1F41',
      letterSpacing: '-0.3px',
      usage: 'Szekció címek világos háttéren',
    },
    h3: {
      size: '32px',
      weight: 700,
      lineHeight: 1.4,
      color: '#1F1F41',
      letterSpacing: '0px',
      usage: 'Alcímek, kártya címek',
    },
    h4: {
      size: '24px',
      weight: 600,
      lineHeight: 1.4,
      color: '#1F1F41',
      letterSpacing: '0px',
      usage: 'Kisebb alcímek, szakasz címek',
    },
    h5: {
      size: '20px',
      weight: 600,
      lineHeight: 1.5,
      color: '#1F1F41',
      letterSpacing: '0px',
      usage: 'Form címek, list címek',
    },
    h6: {
      size: '18px',
      weight: 600,
      lineHeight: 1.5,
      color: '#1F1F41',
      letterSpacing: '0px',
      usage: 'Legkisebb címsor',
    },
    body: {
      size: '18px',
      weight: 400,
      lineHeight: 1.6,
      color: '#1F1F41',
      letterSpacing: '0px',
      usage: 'Alapértelmezett body szöveg',
    },
    bodySmall: {
      size: '16px',
      weight: 400,
      lineHeight: 1.6,
      color: '#606266',
      letterSpacing: '0px',
      usage: 'Kisebb paragrafusok, input szövegek',
    },
    caption: {
      size: '14px',
      weight: 400,
      lineHeight: 1.5,
      color: '#999999',
      letterSpacing: '0px',
      usage: 'Segédszövegek, képfeliratok',
    },
  },

  spacing: {
    xs: '8px',
    sm: '12px',
    md: '16px',
    lg: '20px',
    xl: '32px',
    '2xl': '48px',
    '3xl': '64px',
    '4xl': '80px',
    '5xl': '96px',
    '6xl': '120px',
  },

  borderRadius: {
    pill: '50px',
    rounded: '53px',
    card: '12px',
    input: '6px',
    small: '4px',
    none: '0px',
  },

  shadows: {
    card: {
      default: '0px 5px 10px 0px rgba(0, 0, 0, 0.15)',
      dark: '0px 5px 10px 0px rgba(0, 0, 0, 0.1)',
      hover: '0px 10px 20px 0px rgba(0, 0, 0, 0.2)',
    },
    input: {
      focus: '0 0 0 3px rgba(209, 135, 252, 0.2)',
    },
  },

  gradients: {
    hero: {
      background: 'linear-gradient(180deg, #1F1F41 0%, #00060D 100%)',
      usage: 'Hero szekció háttér',
    },
    purpleGlow: {
      background: 'radial-gradient(circle at center, rgba(209, 135, 252, 0.15) 0%, transparent 70%)',
      usage: 'Purple glow effekt',
    },
  },

  transitions: {
    default: 'all 0.3s ease',
    fast: 'all 0.15s ease',
    slow: 'all 0.5s ease',
  },

  components: {
    button: {
      primary: {
        background: '#D187FC',
        color: '#FFFFFF',
        borderRadius: '50px',
        padding: '15.5px 40px',
        fontSize: '20px',
        fontWeight: 700,
        boxShadow: 'none',
        transition: 'all 0.3s ease',
        hover: {
          transform: 'translateY(-2px)',
          boxShadow: '0px 8px 16px rgba(209, 135, 252, 0.3)',
          background: 'linear-gradient(135deg, #D187FC 0%, #B66EE0 100%)',
          color: '#FFFFFF',
        },
      },
      secondary: {
        background: '#5152A2',
        color: '#FFFFFF',
        borderRadius: '50px',
        padding: '15.5px 40px',
        fontSize: '20px',
        fontWeight: 700,
        boxShadow: 'none',
        transition: 'all 0.3s ease',
        hover: {
          transform: 'translateY(-2px)',
          boxShadow: '0px 8px 16px rgba(81, 82, 162, 0.3)',
          background: '#6163C3',
          color: '#FFFFFF',
        },
      },
      outline: {
        background: 'transparent',
        color: '#D187FC',
        border: '2px solid #D187FC',
        borderRadius: '50px',
        padding: '13.5px 38px', // -2px to account for border
        fontSize: '20px',
        fontWeight: 700,
        boxShadow: 'none',
        transition: 'all 0.3s ease',
        hover: {
          transform: 'translateY(-2px)',
          boxShadow: '0px 4px 12px rgba(209, 135, 252, 0.2)',
          background: '#D187FC',
          color: '#FFFFFF',
        },
      },
      outlineLight: {
        background: 'transparent',
        color: '#FFFFFF',
        border: '2px solid #FFFFFF',
        borderRadius: '50px',
        padding: '13.5px 38px',
        fontSize: '20px',
        fontWeight: 700,
        boxShadow: 'none',
        transition: 'all 0.3s ease',
        hover: {
          transform: 'translateY(-2px)',
          boxShadow: '0px 4px 12px rgba(255, 255, 255, 0.2)',
          background: 'rgba(255, 255, 255, 0.1)',
          color: '#FFFFFF',
        },
      },
      sizes: {
        small: {
          padding: '8px 16px',
          fontSize: '16px',
        },
        medium: {
          padding: '15.5px 40px',
          fontSize: '18px',
        },
        large: {
          padding: '15.5px 40px',
          fontSize: '20px',
        },
      },
    },
    card: {
      background: '#FFFFFF',
      borderRadius: '12px',
      boxShadow: '0px 5px 10px 0px rgba(0, 0, 0, 0.15)',
      padding: '32px',
      transition: 'all 0.3s ease',
      hover: {
        transform: 'translateY(-4px)',
        boxShadow: '0px 10px 20px 0px rgba(0, 0, 0, 0.2)',
      },
    },
    input: {
      background: '#FFFFFF',
      color: '#606266',
      border: '1px solid #DADBE1',
      borderRadius: '6px',
      padding: '12px',
      fontSize: '16px',
      transition: 'all 0.2s ease',
      placeholder: {
        color: '#999999',
      },
      focus: {
        borderColor: '#D187FC',
        boxShadow: '0 0 0 3px rgba(209, 135, 252, 0.2)',
        outline: 'none',
      },
    },
  },

  breakpoints: {
    mobile: '320px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1440px',
  },
} as const;

export type AiBoostTokens = typeof aiboostTokens;
