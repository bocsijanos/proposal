'use client';

import React from 'react';
import { ComponentConfig, DropZone } from '@measured/puck';
import { usePuckTokens, usePuckBrand } from '../brand-context';

interface GradientSectionProps {
  variant: 'hero' | 'dark' | 'light' | 'accent';
  paddingY: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showGlow: boolean;
  textColor: 'light' | 'dark' | 'auto';
}

export const GradientSectionConfig: ComponentConfig<GradientSectionProps> = {
  label: 'Gradiens Szekció',

  defaultProps: {
    variant: 'hero',
    paddingY: 'xl',
    showGlow: true,
    textColor: 'auto',
  },

  fields: {
    variant: {
      type: 'select',
      label: 'Variáns',
      options: [
        { label: 'Hero (sötét gradiens)', value: 'hero' },
        { label: 'Sötét', value: 'dark' },
        { label: 'Világos', value: 'light' },
        { label: 'Akcentus', value: 'accent' },
      ],
    },
    paddingY: {
      type: 'select',
      label: 'Függőleges padding',
      options: [
        { label: 'Small', value: 'sm' },
        { label: 'Medium', value: 'md' },
        { label: 'Large', value: 'lg' },
        { label: 'Extra Large', value: 'xl' },
        { label: '2XL', value: '2xl' },
      ],
    },
    showGlow: {
      type: 'radio',
      label: 'Glow effekt (AIBOOST)',
      options: [
        { label: 'Igen', value: true },
        { label: 'Nem', value: false },
      ],
    },
    textColor: {
      type: 'select',
      label: 'Szöveg szín',
      options: [
        { label: 'Automatikus', value: 'auto' },
        { label: 'Világos', value: 'light' },
        { label: 'Sötét', value: 'dark' },
      ],
    },
  },

  render: ({ variant, paddingY, showGlow, textColor }) => {
    const tokens = usePuckTokens();
    const brand = usePuckBrand();

    const getBackground = () => {
      switch (variant) {
        case 'hero':
          // Use gradient for AIBOOST, solid dark for BOOM
          if (brand === 'AIBOOST' && tokens.gradients?.hero) {
            return tokens.gradients.hero;
          }
          return tokens.colors.backgroundDark;
        case 'dark':
          return tokens.colors.backgroundDark;
        case 'light':
          return tokens.colors.backgroundAlt;
        case 'accent':
          return tokens.colors.primary;
        default:
          return tokens.colors.background;
      }
    };

    const getTextColor = () => {
      if (textColor === 'light') return tokens.colors.textLight;
      if (textColor === 'dark') return tokens.colors.text;

      // Auto: based on variant
      if (variant === 'hero' || variant === 'dark' || variant === 'accent') {
        return tokens.colors.textLight;
      }
      return tokens.colors.text;
    };

    const isGradient = variant === 'hero' && brand === 'AIBOOST';

    return (
      <div
        style={{
          position: 'relative',
          background: getBackground(),
          paddingTop: tokens.spacing[paddingY],
          paddingBottom: tokens.spacing[paddingY],
          paddingLeft: tokens.spacing.lg,
          paddingRight: tokens.spacing.lg,
          color: getTextColor(),
          overflow: 'hidden',
        }}
      >
        {/* Glow effect for AIBOOST */}
        {showGlow && brand === 'AIBOOST' && tokens.gradients?.glow && (variant === 'hero' || variant === 'dark') && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '150%',
              height: '150%',
              background: tokens.gradients.glow,
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />
        )}

        {/* Content */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            maxWidth: tokens.layout.maxWidth,
            margin: '0 auto',
          }}
        >
          <DropZone zone="gradientContent" />
        </div>
      </div>
    );
  },
};
