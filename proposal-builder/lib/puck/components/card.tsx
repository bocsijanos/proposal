'use client';

import React from 'react';
import { ComponentConfig, DropZone } from '@measured/puck';
import { usePuckTokens } from '../brand-context';
import { createShadowField, createSpacingField, createRadiusField } from '../custom-fields';

type ShadowType = 'none' | 'subtle' | 'medium' | 'large';
type PaddingType = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type RadiusType = 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
type BackgroundType = 'white' | 'light' | 'dark' | 'transparent';

interface CardProps {
  shadow: ShadowType;
  padding: PaddingType;
  borderRadius: RadiusType;
  background: BackgroundType;
  hasBorder: boolean;
}

export const CardConfig: ComponentConfig<CardProps> = {
  label: 'Kártya',

  defaultProps: {
    shadow: 'subtle',
    padding: 'md',
    borderRadius: 'lg',
    background: 'white',
    hasBorder: true,
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
  },

  render: ({ shadow = 'subtle', padding = 'md', borderRadius = 'lg', background = 'white', hasBorder = true }) => {
    const tokens = usePuckTokens();

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

    return (
      <div
        style={{
          backgroundColor: backgroundMap[background],
          color: textColorMap[background],
          border: hasBorder ? `1px solid ${tokens.colors.border}` : 'none',
          borderRadius: radiusMap[borderRadius],
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
