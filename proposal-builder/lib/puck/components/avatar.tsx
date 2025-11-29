'use client';

import React from 'react';
import { ComponentConfig } from '@measured/puck';
import { usePuckTokens } from '../brand-context';
import { createImagePickerField } from '../custom-fields';

// Avatar size options
type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

interface AvatarImageProps {
  src: string;
  alt: string;
  size: AvatarSize;
  showBorder: boolean;
  borderColor: 'primary' | 'secondary' | 'white' | 'gray';
}

export const AvatarImageConfig: ComponentConfig<AvatarImageProps> = {
  label: 'Profilkép',

  defaultProps: {
    src: '{{adminAvatar}}',
    alt: 'Profilkép',
    size: 'md',
    showBorder: true,
    borderColor: 'white',
  },

  fields: {
    src: {
      ...(createImagePickerField() as any),
      label: 'Kép (vagy változó: {{adminAvatar}})',
    },
    alt: {
      type: 'text',
      label: 'Alt szöveg',
    },
    size: {
      type: 'select',
      label: 'Méret',
      options: [
        { label: 'XS (24px)', value: 'xs' },
        { label: 'SM (32px)', value: 'sm' },
        { label: 'MD (48px)', value: 'md' },
        { label: 'LG (64px)', value: 'lg' },
        { label: 'XL (96px)', value: 'xl' },
        { label: 'XXL (128px)', value: 'xxl' },
      ],
    },
    showBorder: {
      type: 'radio',
      label: 'Keret',
      options: [
        { label: 'Igen', value: true },
        { label: 'Nem', value: false },
      ],
    },
    borderColor: {
      type: 'select',
      label: 'Keret szín',
      options: [
        { label: 'Fehér', value: 'white' },
        { label: 'Elsődleges', value: 'primary' },
        { label: 'Másodlagos', value: 'secondary' },
        { label: 'Szürke', value: 'gray' },
      ],
    },
  },

  render: ({ src, alt, size, showBorder, borderColor }) => {
    const tokens = usePuckTokens();

    // Size map
    const sizeMap: Record<AvatarSize, string> = {
      xs: '24px',
      sm: '32px',
      md: '48px',
      lg: '64px',
      xl: '96px',
      xxl: '128px',
    };

    // Border color map
    const borderColorMap = {
      primary: tokens.colors.primary,
      secondary: tokens.colors.secondary,
      white: '#FFFFFF',
      gray: tokens.colors.muted,
    };

    const dimension = sizeMap[size];

    // Check if src is a variable placeholder that wasn't replaced (e.g., {{adminAvatar}})
    const isPlaceholder = src?.startsWith('{{') && src?.endsWith('}}');
    const isEmpty = !src || src.trim() === '' || isPlaceholder;

    // Default avatar SVG
    const defaultAvatar = (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        style={{
          width: '60%',
          height: '60%',
          color: tokens.colors.muted,
        }}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
        />
      </svg>
    );

    return (
      <div
        style={{
          width: dimension,
          height: dimension,
          borderRadius: '50%',
          overflow: 'hidden',
          flexShrink: 0,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: isEmpty ? tokens.colors.backgroundAlt : 'transparent',
          border: showBorder ? `3px solid ${borderColorMap[borderColor]}` : 'none',
          boxShadow: tokens.shadows.subtle,
        }}
      >
        {isEmpty ? (
          defaultAvatar
        ) : (
          <img
            src={src}
            alt={alt}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        )}
      </div>
    );
  },
};
