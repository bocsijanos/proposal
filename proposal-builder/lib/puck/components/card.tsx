'use client';

import React from 'react';
import { ComponentConfig, DropZone } from '@measured/puck';
import { usePuckTokens } from '../brand-context';
import { createShadowField, createSpacingField, createRadiusField } from '../custom-fields';

type ShadowType = 'none' | 'subtle' | 'medium' | 'large';
type PaddingType = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type RadiusType = 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
type BackgroundType = 'white' | 'light' | 'dark' | 'transparent';
type BorderStyleType = 'none' | 'simple' | 'facebook-instagram' | 'google' | 'tiktok' | 'custom';

interface CardProps {
  shadow: ShadowType;
  padding: PaddingType;
  borderRadius: RadiusType;
  background: BackgroundType;
  hasBorder: boolean;
  borderStyle: BorderStyleType;
  borderWidth: number;
  customGradient?: string;
}

export const CardConfig: ComponentConfig<CardProps> = {
  label: 'Kártya',

  defaultProps: {
    shadow: 'subtle',
    padding: 'md',
    borderRadius: 'lg',
    background: 'white',
    hasBorder: true,
    borderStyle: 'simple',
    borderWidth: 2,
  },

  fields: {
    background: {
      type: 'select',
      label: 'Háttér',
      options: [
        { label: 'Fehér', value: 'white' },
        { label: 'Világos szürke', value: 'light' },
        { label: 'Sötét', value: 'dark' },
        { label: 'Átlátszó', value: 'transparent' },
      ],
    },
    shadow: {
      ...(createShadowField([
        { value: 'none', label: 'Nincs', shadow: 'none' },
        { value: 'subtle', label: 'Enyhe', shadow: '0 1px 3px rgba(0,0,0,0.1)' },
        { value: 'medium', label: 'Közepes', shadow: '0 4px 6px rgba(0,0,0,0.1)' },
        { value: 'large', label: 'Erős', shadow: '0 10px 25px rgba(0,0,0,0.15)' },
      ]) as any),
      label: 'Árnyék',
    },
    padding: {
      ...(createSpacingField([
        { value: 'xs', label: 'XS', pixels: 8 },
        { value: 'sm', label: 'Kicsi', pixels: 16 },
        { value: 'md', label: 'Közepes', pixels: 24 },
        { value: 'lg', label: 'Nagy', pixels: 32 },
        { value: 'xl', label: 'XL', pixels: 48 },
      ]) as any),
      label: 'Belső margó',
    },
    borderRadius: {
      ...(createRadiusField([
        { value: 'none', label: 'Nincs', radius: '0' },
        { value: 'sm', label: 'Kicsi', radius: '4px' },
        { value: 'md', label: 'Közepes', radius: '8px' },
        { value: 'lg', label: 'Nagy', radius: '12px' },
        { value: 'xl', label: 'XL', radius: '16px' },
        { value: 'full', label: '2XL', radius: '24px' },
      ]) as any),
      label: 'Lekerekítés',
    },
    hasBorder: {
      type: 'radio',
      label: 'Szegély',
      options: [
        { label: 'Igen', value: true },
        { label: 'Nem', value: false },
      ],
    },
    borderStyle: {
      type: 'select',
      label: 'Keret stílus',
      options: [
        { label: 'Egyszerű', value: 'simple' },
        { label: '🔵🟣 Facebook + Instagram', value: 'facebook-instagram' },
        { label: '🔴🟡🟢🔵 Google', value: 'google' },
        { label: '⬛ TikTok', value: 'tiktok' },
        { label: '🎨 Egyedi gradiens', value: 'custom' },
        { label: 'Nincs', value: 'none' },
      ],
    },
    borderWidth: {
      type: 'number',
      label: 'Keret vastagság (px)',
      min: 1,
      max: 8,
    },
    customGradient: {
      type: 'text',
      label: 'Egyedi gradiens (pl: linear-gradient(45deg, #ff0000, #0000ff))',
    },
  },

  render: ({
    shadow = 'subtle',
    padding = 'md',
    borderRadius = 'lg',
    background = 'white',
    hasBorder = true,
    borderStyle = 'simple',
    borderWidth = 2,
    customGradient,
  }) => {
    const tokens = usePuckTokens();
    const cardId = React.useId();
    const safeId = cardId.replace(/:/g, '');

    // Use design tokens for shadows
    const shadowMap: Record<ShadowType, string> = {
      none: 'none',
      subtle: tokens.shadows.subtle,
      medium: tokens.shadows.medium,
      large: tokens.shadows.large,
    };

    // Use design tokens for border radius
    const radiusMap: Record<RadiusType, string> = {
      none: '0',
      sm: tokens.borderRadius.sm,
      md: tokens.borderRadius.md,
      lg: tokens.borderRadius.lg,
      xl: tokens.borderRadius.xl,
      full: tokens.borderRadius['2xl'],
    };

    // Use design tokens for padding
    const paddingMap: Record<PaddingType, string> = {
      xs: tokens.spacing.xs,
      sm: tokens.spacing.sm,
      md: tokens.spacing.md,
      lg: tokens.spacing.lg,
      xl: tokens.spacing.xl,
    };

    // Background colors from tokens
    const backgroundMap: Record<BackgroundType, string> = {
      white: tokens.colors.background,
      light: tokens.colors.backgroundAlt,
      dark: tokens.colors.backgroundDark,
      transparent: 'transparent',
    };

    // Text color based on background
    const textColorMap: Record<BackgroundType, string> = {
      white: tokens.colors.text,
      light: tokens.colors.text,
      dark: tokens.colors.textLight,
      transparent: tokens.colors.text,
    };

    // Gradient definitions for social platforms
    const gradientMap: Record<BorderStyleType, string> = {
      none: 'none',
      simple: 'none',
      'facebook-instagram': 'linear-gradient(45deg, #1877F2, #833AB4, #E4405F, #F77737)',
      'google': 'linear-gradient(45deg, #4285F4, #EA4335, #FBBC05, #34A853)',
      'tiktok': 'linear-gradient(45deg, #000000, #25F4EE, #FE2C55, #000000)',
      'custom': customGradient || 'linear-gradient(45deg, #ff0000, #0000ff)',
    };

    const hasGradientBorder = borderStyle !== 'none' && borderStyle !== 'simple' && hasBorder;
    const hasSimpleBorder = borderStyle === 'simple' && hasBorder;
    const gradient = gradientMap[borderStyle];
    const radius = radiusMap[borderRadius];

    // For gradient borders, we use a wrapper with pseudo-element
    if (hasGradientBorder) {
      return (
        <>
          <style>{`
            .card-gradient-wrapper-${safeId} {
              position: relative;
              padding: ${borderWidth}px;
              background: ${gradient};
              border-radius: ${radius};
              box-shadow: ${shadowMap[shadow]};
              transition: all 0.3s ease;
            }
            .card-gradient-wrapper-${safeId}:hover {
              box-shadow: ${shadowMap[shadow]}, 0 0 20px rgba(0,0,0,0.1);
              transform: translateY(-2px);
            }
            .card-gradient-inner-${safeId} {
              background: ${backgroundMap[background]};
              color: ${textColorMap[background]};
              border-radius: calc(${radius} - ${borderWidth}px);
              padding: ${paddingMap[padding]};
              height: 100%;
            }
            /* Animated shimmer effect for gradient borders */
            @keyframes shimmer-${safeId} {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
            .card-gradient-wrapper-${safeId}.animated {
              background-size: 200% 200%;
              animation: shimmer-${safeId} 3s ease infinite;
            }
          `}</style>
          <div className={`card-gradient-wrapper-${safeId} animated`}>
            <div className={`card-gradient-inner-${safeId}`}>
              <DropZone zone="cardContent" />
            </div>
          </div>
        </>
      );
    }

    // Simple border or no border
    return (
      <div
        style={{
          backgroundColor: backgroundMap[background],
          color: textColorMap[background],
          border: hasSimpleBorder ? `1px solid ${tokens.colors.border}` : 'none',
          borderRadius: radius,
          boxShadow: shadowMap[shadow],
          padding: paddingMap[padding],
          transition: 'all 0.2s ease',
        }}
      >
        <DropZone zone="cardContent" />
      </div>
    );
  },
};
