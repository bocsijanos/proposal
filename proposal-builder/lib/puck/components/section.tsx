'use client';

import React from 'react';
import { ComponentConfig, DropZone } from '@measured/puck';
import { usePuckTokens } from '../brand-context';
import { createSectionVariantField, createSpacingField, createRadiusField } from '../custom-fields';

type VariantType = 'default' | 'hero' | 'alternate' | 'dark' | 'primary' | 'gradient' | 'custom';
type PaddingType = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
type MaxWidthType = 'narrow' | 'default' | 'wide' | 'full';
type RadiusType = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

interface SectionProps {
  variant: VariantType;
  customBgColor?: string;
  customTextColor?: string;
  paddingY: PaddingType;
  paddingX: PaddingType;
  maxWidth: MaxWidthType;
  fullBleed: boolean;
  borderRadius: RadiusType;
}

export const SectionConfig: ComponentConfig<SectionProps> = {
  label: 'Szekció',

  defaultProps: {
    variant: 'default',
    paddingY: 'lg',
    paddingX: 'md',
    maxWidth: 'default',
    fullBleed: false,
    borderRadius: 'none',
  },

  fields: {
    variant: {
      ...(createSectionVariantField([
        { value: 'default', label: 'Fehér', preview: { bg: '#ffffff', color: '#374151' } },
        { value: 'alternate', label: 'Világos szürke', preview: { bg: '#f8fafc', color: '#374151' } },
        { value: 'primary', label: 'Márka szín', preview: { bg: '#fa604a', color: '#ffffff' } },
        { value: 'dark', label: 'Sötét', preview: { bg: '#18181b', color: '#ffffff' } },
        { value: 'hero', label: 'Hero (Gradiens)', preview: { bg: 'linear-gradient(135deg, #fa604a 0%, #18181b 100%)', color: '#ffffff' } },
        { value: 'gradient', label: 'Márka Gradiens', preview: { bg: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)', color: '#374151' } },
        { value: 'custom', label: 'Egyedi szín', preview: { bg: '#e0e7ff', color: '#374151' } },
      ]) as any),
      label: 'Háttér variáns',
    },
    customBgColor: {
      type: 'text',
      label: 'Egyedi háttérszín (CSS)',
    },
    customTextColor: {
      type: 'text',
      label: 'Egyedi szövegszín (CSS)',
    },
    paddingY: {
      ...(createSpacingField([
        { value: 'none', label: 'Nincs', pixels: 0 },
        { value: 'sm', label: 'Kicsi', pixels: 16 },
        { value: 'md', label: 'Közepes', pixels: 32 },
        { value: 'lg', label: 'Nagy', pixels: 64 },
        { value: 'xl', label: 'XL', pixels: 96 },
        { value: '2xl', label: '2XL', pixels: 128 },
      ]) as any),
      label: 'Függőleges térköz',
    },
    paddingX: {
      ...(createSpacingField([
        { value: 'none', label: 'Nincs', pixels: 0 },
        { value: 'sm', label: 'Kicsi', pixels: 16 },
        { value: 'md', label: 'Közepes', pixels: 32 },
        { value: 'lg', label: 'Nagy', pixels: 48 },
        { value: 'xl', label: 'XL', pixels: 64 },
        { value: '2xl', label: '2XL', pixels: 96 },
      ]) as any),
      label: 'Vízszintes térköz',
    },
    maxWidth: {
      type: 'select',
      label: 'Tartalom szélesség',
      options: [
        { label: 'Keskeny (800px)', value: 'narrow' },
        { label: 'Alapértelmezett (1200px)', value: 'default' },
        { label: 'Széles (1400px)', value: 'wide' },
        { label: 'Teljes szélesség', value: 'full' },
      ],
    },
    fullBleed: {
      type: 'radio',
      label: 'Háttér teljes szélesség',
      options: [
        { label: 'Igen', value: true },
        { label: 'Nem', value: false },
      ],
    },
    borderRadius: {
      ...(createRadiusField([
        { value: 'none', label: 'Nincs', radius: '0' },
        { value: 'sm', label: 'Kicsi', radius: '8px' },
        { value: 'md', label: 'Közepes', radius: '16px' },
        { value: 'lg', label: 'Nagy', radius: '24px' },
        { value: 'xl', label: 'XL', radius: '32px' },
        { value: '2xl', label: '2XL', radius: '48px' },
      ]) as any),
      label: 'Lekerekítés',
    },
  },

  render: ({ variant = 'default', customBgColor, customTextColor, paddingY = 'lg', paddingX = 'md', maxWidth = 'default', fullBleed = false, borderRadius = 'none' }) => {
    const tokens = usePuckTokens();

    // Variant configurations using design tokens
    const variants: Record<VariantType, { bg: string; color: string }> = {
      default: {
        bg: tokens.colors.background,
        color: tokens.colors.text,
      },
      alternate: {
        bg: tokens.colors.backgroundAlt,
        color: tokens.colors.text,
      },
      primary: {
        bg: tokens.colors.primary,
        color: tokens.colors.textLight,
      },
      dark: {
        bg: tokens.colors.backgroundDark,
        color: tokens.colors.textLight,
      },
      hero: {
        bg: tokens.gradients?.hero || `linear-gradient(135deg, ${tokens.colors.primary} 0%, ${tokens.colors.secondary} 100%)`,
        color: tokens.colors.textLight,
      },
      gradient: {
        bg: `linear-gradient(180deg, ${tokens.colors.background} 0%, ${tokens.colors.backgroundAlt} 100%)`,
        color: tokens.colors.text,
      },
      custom: {
        bg: customBgColor || tokens.colors.background,
        color: customTextColor || tokens.colors.text,
      },
    };

    // Padding maps using design tokens
    const paddingYMap: Record<PaddingType, string> = {
      none: '0',
      sm: tokens.spacing.sm,
      md: tokens.spacing.lg,
      lg: tokens.spacing['2xl'],
      xl: tokens.spacing['3xl'],
      '2xl': tokens.spacing['4xl'],
    };

    const paddingXMap: Record<PaddingType, string> = {
      none: '0',
      sm: tokens.spacing.sm,
      md: tokens.spacing.lg,
      lg: tokens.spacing.xl,
      xl: tokens.spacing['2xl'],
      '2xl': tokens.spacing['3xl'],
    };

    const maxWidthMap: Record<MaxWidthType, string> = {
      narrow: tokens.layout.maxWidthNarrow,
      default: tokens.layout.maxWidth,
      wide: tokens.layout.maxWidthWide,
      full: '100%',
    };

    const radiusMap: Record<RadiusType, string> = {
      none: '0',
      sm: '8px',
      md: '16px',
      lg: '24px',
      xl: '32px',
      '2xl': '48px',
    };

    const v = variants[variant] || variants.default;

    return (
      <section
        style={{
          background: v.bg,
          color: v.color,
          padding: `${paddingYMap[paddingY]} ${fullBleed ? '0' : paddingXMap[paddingX]}`,
          width: '100%',
          borderRadius: radiusMap[borderRadius],
          overflow: borderRadius !== 'none' ? 'hidden' : undefined,
        }}
      >
        <div
          style={{
            maxWidth: maxWidthMap[maxWidth],
            margin: '0 auto',
            padding: fullBleed ? `0 ${paddingXMap[paddingX]}` : '0',
          }}
        >
          <DropZone zone="content" />
        </div>
      </section>
    );
  },
};
