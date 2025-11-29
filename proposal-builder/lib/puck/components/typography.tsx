'use client';

import React from 'react';
import { ComponentConfig } from '@measured/puck';
import { usePuckTokens } from '../brand-context';

type AlignmentValue = 'left' | 'center' | 'right';

// Design token color options for heading
type HeadingColorValue =
  | 'default'      // Level default from typography tokens
  | 'primary'      // Brand primary
  | 'secondary'    // Brand secondary
  | 'text'         // Main text color
  | 'textLight'    // Light text (for dark backgrounds)
  | 'muted'        // Muted/subtle text
  | 'white'        // Pure white
  | 'custom';      // Custom hex color

// ============== CÍMSOR KOMPONENS ==============

interface HeadingProps {
  text: string;
  level: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  alignment: AlignmentValue;
  color: HeadingColorValue;
  customColor?: string;
}

export const HeadingConfig: ComponentConfig<HeadingProps> = {
  label: 'Címsor',

  defaultProps: {
    text: 'Címsor szövege',
    level: 'h2',
    alignment: 'left',
    color: 'default',
  },

  fields: {
    text: {
      type: 'textarea',
      label: 'Címsor szöveg',
    },
    level: {
      type: 'select',
      label: 'Címsor szint',
      options: [
        { label: 'H1 - Főcím (60px)', value: 'h1' },
        { label: 'H2 - Szekciócím (42-46px)', value: 'h2' },
        { label: 'H3 - Alcím (32px)', value: 'h3' },
        { label: 'H4 - Kis alcím (24px)', value: 'h4' },
        { label: 'H5 - Form cím (20px)', value: 'h5' },
        { label: 'H6 - Legkisebb (18px)', value: 'h6' },
      ],
    },
    alignment: {
      type: 'select',
      label: 'Igazítás',
      options: [
        { label: 'Balra', value: 'left' },
        { label: 'Középre', value: 'center' },
        { label: 'Jobbra', value: 'right' },
      ],
    },
    color: {
      type: 'select',
      label: 'Szín',
      options: [
        { label: 'Alapértelmezett', value: 'default' },
        { label: 'Elsődleges (brand)', value: 'primary' },
        { label: 'Másodlagos (brand)', value: 'secondary' },
        { label: 'Szöveg', value: 'text' },
        { label: 'Világos (sötét háttérhez)', value: 'textLight' },
        { label: 'Halvány', value: 'muted' },
        { label: 'Fehér', value: 'white' },
        { label: 'Egyedi...', value: 'custom' },
      ],
    },
    customColor: {
      type: 'text',
      label: 'Egyedi szín (hex)',
    },
  },

  render: ({ text = '', level = 'h2', alignment = 'left', color = 'default', customColor }) => {
    const tokens = usePuckTokens();
    const headingId = React.useId();
    const safeId = headingId.replace(/:/g, '');

    // Get typography settings from design tokens (including mobile size)
    const typography = tokens.typography[level];

    // Resolve color from design tokens
    const getColor = (): string => {
      switch (color) {
        case 'primary':
          return tokens.colors.primary;
        case 'secondary':
          return tokens.colors.secondary;
        case 'text':
          return tokens.colors.text;
        case 'textLight':
          return tokens.colors.textLight;
        case 'muted':
          return tokens.colors.muted;
        case 'white':
          return '#FFFFFF';
        case 'custom':
          return customColor || typography.color;
        case 'default':
        default:
          return typography.color;
      }
    };

    const resolvedColor = getColor();
    const HeadingTag = level as React.ElementType;

    return (
      <>
        <style>{`
          .puck-heading-container-${safeId} {
            container-type: inline-size;
            width: 100%;
          }
          .puck-heading-${safeId} {
            color: ${resolvedColor};
            font-family: ${tokens.fonts.heading};
            font-size: ${typography.size};
            line-height: ${typography.lineHeight};
            font-weight: ${typography.weight};
            margin: 0;
            margin-bottom: ${tokens.spacing.sm};
            text-align: ${alignment};
            word-wrap: break-word;
            overflow-wrap: break-word;
          }
          @container (max-width: ${tokens.breakpoints.tablet}) {
            .puck-heading-${safeId} {
              font-size: ${typography.mobileSize};
            }
          }
          @supports not (container-type: inline-size) {
            @media (max-width: ${tokens.breakpoints.tablet}) {
              .puck-heading-${safeId} {
                font-size: ${typography.mobileSize};
              }
            }
          }
        `}</style>
        <div className={`puck-heading-container-${safeId}`}>
          <HeadingTag className={`puck-heading-${safeId}`}>
            {text}
          </HeadingTag>
        </div>
      </>
    );
  },
};

// ============== BEKEZDÉS KOMPONENS ==============

type BodyTextColorValue = 'text' | 'primary' | 'secondary' | 'muted' | 'textLight' | 'white' | 'custom';

interface BodyTextProps {
  text: string;
  variant: 'default' | 'large' | 'lead' | 'small';
  alignment: AlignmentValue;
  color: BodyTextColorValue;
  customColor?: string;
}

export const BodyTextConfig: ComponentConfig<BodyTextProps> = {
  label: 'Bekezdés',

  defaultProps: {
    text: 'Ide írja a szöveget...',
    variant: 'default',
    alignment: 'left',
    color: 'text',
  },

  fields: {
    text: {
      type: 'textarea',
      label: 'Szöveg tartalma',
    },
    variant: {
      type: 'select',
      label: 'Szövegméret',
      options: [
        { label: 'Bevezető (nagyobb)', value: 'lead' },
        { label: 'Nagy', value: 'large' },
        { label: 'Normál', value: 'default' },
        { label: 'Kicsi', value: 'small' },
      ],
    },
    alignment: {
      type: 'select',
      label: 'Igazítás',
      options: [
        { label: 'Balra', value: 'left' },
        { label: 'Középre', value: 'center' },
        { label: 'Jobbra', value: 'right' },
      ],
    },
    color: {
      type: 'select',
      label: 'Szín',
      options: [
        { label: 'Szöveg', value: 'text' },
        { label: 'Elsődleges (brand)', value: 'primary' },
        { label: 'Másodlagos (brand)', value: 'secondary' },
        { label: 'Halvány', value: 'muted' },
        { label: 'Világos (sötét háttérhez)', value: 'textLight' },
        { label: 'Fehér', value: 'white' },
        { label: 'Egyedi...', value: 'custom' },
      ],
    },
    customColor: {
      type: 'text',
      label: 'Egyedi szín (hex)',
    },
  },

  render: ({ text = '', variant = 'default', alignment = 'left', color = 'text', customColor }) => {
    const tokens = usePuckTokens();

    // Use typography tokens for font sizes
    const sizeMap = {
      lead: tokens.typography.bodyLarge.size,
      large: tokens.typography.bodyLarge.size,
      default: tokens.typography.body.size,
      small: tokens.typography.bodySmall.size,
    };

    const lineHeightMap = {
      lead: tokens.typography.bodyLarge.lineHeight,
      large: tokens.typography.bodyLarge.lineHeight,
      default: tokens.typography.body.lineHeight,
      small: tokens.typography.bodySmall.lineHeight,
    };

    const getColor = (): string => {
      switch (color) {
        case 'primary':
          return tokens.colors.primary;
        case 'secondary':
          return tokens.colors.secondary;
        case 'muted':
          return tokens.colors.muted;
        case 'textLight':
          return tokens.colors.textLight;
        case 'white':
          return '#FFFFFF';
        case 'custom':
          return customColor || tokens.typography.body.color;
        case 'text':
        default:
          return tokens.typography.body.color;
      }
    };

    return (
      <p
        style={{
          color: getColor(),
          fontFamily: tokens.fonts.body,
          fontSize: sizeMap[variant],
          lineHeight: lineHeightMap[variant],
          margin: 0,
          marginBottom: tokens.spacing.md,
          textAlign: alignment,
          whiteSpace: 'pre-line',
        }}
      >
        {text}
      </p>
    );
  },
};

// ============== KIEMELÉS KOMPONENS ==============

type HighlightColorValue = 'primary' | 'secondary' | 'text' | 'white' | 'custom';

interface HighlightProps {
  text: string;
  color: HighlightColorValue;
  customColor?: string;
}

export const HighlightConfig: ComponentConfig<HighlightProps> = {
  label: 'Kiemelés',

  defaultProps: {
    text: 'kiemelt szöveg',
    color: 'primary',
  },

  fields: {
    text: {
      type: 'text',
      label: 'Kiemelt szöveg',
    },
    color: {
      type: 'select',
      label: 'Szín',
      options: [
        { label: 'Elsődleges (brand)', value: 'primary' },
        { label: 'Másodlagos (brand)', value: 'secondary' },
        { label: 'Szöveg', value: 'text' },
        { label: 'Fehér', value: 'white' },
        { label: 'Egyedi...', value: 'custom' },
      ],
    },
    customColor: {
      type: 'text',
      label: 'Egyedi szín (hex)',
    },
  },

  render: ({ text = '', color = 'primary', customColor }) => {
    const tokens = usePuckTokens();

    const getColor = (): string => {
      switch (color) {
        case 'primary':
          return tokens.colors.primary;
        case 'secondary':
          return tokens.colors.secondary;
        case 'text':
          return tokens.colors.text;
        case 'white':
          return '#FFFFFF';
        case 'custom':
          return customColor || tokens.colors.primary;
        default:
          return tokens.colors.primary;
      }
    };

    return (
      <span
        style={{
          color: getColor(),
          fontWeight: 600,
        }}
      >
        {text}
      </span>
    );
  },
};
