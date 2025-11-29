'use client';

import React from 'react';
import { ComponentConfig } from '@measured/puck';
import { usePuckTokens } from '../brand-context';
import { createAlignmentField, createRadiusField, createShadowField, createImagePickerField } from '../custom-fields';

interface ImageProps {
  src: string;
  alt: string;
  width: 'auto' | 'full' | 'half' | 'third';
  height: 'auto' | 'small' | 'medium' | 'large' | 'xlarge' | 'custom';
  customHeight?: number;
  objectFit: 'cover' | 'contain' | 'fill';
  alignment: 'left' | 'center' | 'right';
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  shadow: 'none' | 'subtle' | 'medium' | 'large';
  caption?: string;
}

export const ImageConfig: ComponentConfig<ImageProps> = {
  label: 'Kép',

  defaultProps: {
    src: '',
    alt: 'Kép leírása',
    width: 'full',
    height: 'auto',
    customHeight: 300,
    objectFit: 'cover',
    alignment: 'center',
    borderRadius: 'md',
    shadow: 'subtle',
    caption: '',
  },

  fields: {
    src: {
      ...(createImagePickerField() as any),
      label: 'Kép',
    },
    alt: {
      type: 'text',
      label: 'Alt szöveg (SEO)',
    },
    width: {
      type: 'radio',
      label: 'Szélesség',
      options: [
        { label: '▪️ Auto', value: 'auto' },
        { label: '████ 100%', value: 'full' },
        { label: '██ 50%', value: 'half' },
        { label: '█ 33%', value: 'third' },
      ],
    },
    height: {
      type: 'select',
      label: 'Magasság',
      options: [
        { label: 'Automatikus', value: 'auto' },
        { label: 'Kicsi (150px)', value: 'small' },
        { label: 'Közepes (250px)', value: 'medium' },
        { label: 'Nagy (400px)', value: 'large' },
        { label: 'Extra nagy (600px)', value: 'xlarge' },
        { label: 'Egyedi...', value: 'custom' },
      ],
    },
    customHeight: {
      type: 'number',
      label: 'Egyedi magasság (px)',
      min: 50,
      max: 1200,
    },
    objectFit: {
      type: 'radio',
      label: 'Kép illeszkedés',
      options: [
        { label: 'Kitöltés (levágás)', value: 'cover' },
        { label: 'Beillesztés (teljes)', value: 'contain' },
        { label: 'Nyújtás', value: 'fill' },
      ],
    },
    alignment: {
      ...(createAlignmentField() as any),
      label: 'Igazítás',
    },
    borderRadius: {
      ...(createRadiusField([
        { value: 'none', label: 'Nincs', radius: '0' },
        { value: 'sm', label: 'Kicsi', radius: '4px' },
        { value: 'md', label: 'Közepes', radius: '8px' },
        { value: 'lg', label: 'Nagy', radius: '12px' },
        { value: 'xl', label: 'XL', radius: '16px' },
        { value: 'full', label: 'Kör', radius: '50%' },
      ]) as any),
      label: 'Lekerekítés',
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
    caption: {
      type: 'text',
      label: 'Képaláírás (opcionális)',
    },
  },

  render: ({ src, alt, width, height, customHeight, objectFit, alignment, borderRadius, shadow, caption }) => {
    const tokens = usePuckTokens();

    const widthMap = {
      auto: 'auto',
      full: '100%',
      half: '50%',
      third: '33.333%',
    };

    const heightMap: Record<string, string> = {
      auto: 'auto',
      small: '150px',
      medium: '250px',
      large: '400px',
      xlarge: '600px',
      custom: `${customHeight || 300}px`,
    };

    const alignmentMap = {
      left: 'flex-start',
      center: 'center',
      right: 'flex-end',
    };

    const radiusMap = {
      none: '0',
      sm: tokens.borderRadius.sm,
      md: tokens.borderRadius.md,
      lg: tokens.borderRadius.lg,
      xl: tokens.borderRadius.xl,
      full: '50%',
    };

    const shadowMap = {
      none: 'none',
      subtle: tokens.shadows.subtle,
      medium: tokens.shadows.medium,
      large: tokens.shadows.large,
    };

    const computedHeight = heightMap[height || 'auto'];
    const hasFixedHeight = height && height !== 'auto';

    return (
      <figure
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: alignmentMap[alignment],
          width: '100%',
          margin: 0,
        }}
      >
        <img
          src={src}
          alt={alt}
          style={{
            width: widthMap[width],
            maxWidth: '100%',
            height: computedHeight,
            objectFit: hasFixedHeight ? (objectFit || 'cover') : undefined,
            borderRadius: radiusMap[borderRadius],
            boxShadow: shadowMap[shadow],
            display: 'block',
          }}
        />
        {caption && (
          <figcaption
            style={{
              marginTop: tokens.spacing.sm,
              fontSize: tokens.typography.caption.size,
              fontWeight: tokens.typography.caption.weight,
              lineHeight: tokens.typography.caption.lineHeight,
              color: tokens.colors.muted,
              textAlign: alignment,
              fontFamily: tokens.fonts.body,
            }}
          >
            {caption}
          </figcaption>
        )}
      </figure>
    );
  },
};
