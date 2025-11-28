'use client';

import React from 'react';
import { ComponentConfig } from '@measured/puck';
import { usePuckTokens } from '../brand-context';
import { createImagePickerField } from '../custom-fields';

interface LogoItemProps {
  imageUrl: string;
  altText: string;
  companyName?: string;
  link?: string;
  variant: 'simple' | 'card' | 'hover-zoom' | 'grayscale';
  size: 'sm' | 'md' | 'lg';
  showName: boolean;
}

export const LogoItemConfig: ComponentConfig<LogoItemProps> = {
  label: 'LogoItem',

  defaultProps: {
    imageUrl: '',
    altText: 'Cég logo',
    companyName: 'Cég neve',
    link: '',
    variant: 'simple',
    size: 'md',
    showName: false,
  },

  fields: {
    imageUrl: {
      ...(createImagePickerField() as any),
      label: 'Logo',
    },
    altText: {
      type: 'text',
      label: 'Alt szöveg (SEO)',
    },
    companyName: {
      type: 'text',
      label: 'Cég neve',
    },
    link: {
      type: 'text',
      label: 'Link (opcionális)',
    },
    variant: {
      type: 'select',
      label: 'Változat',
      options: [
        { label: 'Egyszerű', value: 'simple' },
        { label: 'Kártya', value: 'card' },
        { label: 'Hover nagyítás', value: 'hover-zoom' },
        { label: 'Szürke (hover színes)', value: 'grayscale' },
      ],
    },
    size: {
      type: 'radio',
      label: 'Méret',
      options: [
        { label: 'Kicsi', value: 'sm' },
        { label: 'Közepes', value: 'md' },
        { label: 'Nagy', value: 'lg' },
      ],
    },
    showName: {
      type: 'radio',
      label: 'Cég neve megjelenítése',
      options: [
        { label: 'Igen', value: true },
        { label: 'Nem', value: false },
      ],
    },
  },

  render: ({ imageUrl = '', altText = '', companyName, link, variant = 'simple', size = 'md', showName = false }) => {
    const tokens = usePuckTokens();

    // Méret alapján
    const getSizeStyles = (): { height: string; padding: string } => {
      switch (size) {
        case 'sm':
          return { height: '40px', padding: tokens.spacing.sm };
        case 'lg':
          return { height: '80px', padding: tokens.spacing.lg };
        case 'md':
        default:
          return { height: '60px', padding: tokens.spacing.md };
      }
    };

    const sizeStyles = getSizeStyles();

    const getContainerStyles = (): React.CSSProperties => {
      const base: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: tokens.fonts.body,
        textDecoration: 'none',
        transition: 'all 0.3s ease',
        cursor: link ? 'pointer' : 'default',
      };

      switch (variant) {
        case 'card':
          return {
            ...base,
            padding: sizeStyles.padding,
            backgroundColor: tokens.colors.backgroundAlt,
            borderRadius: tokens.borderRadius.md,
            border: `1px solid ${tokens.colors.border}`,
            boxShadow: tokens.shadows.subtle,
          };
        case 'hover-zoom':
          return {
            ...base,
            padding: sizeStyles.padding,
          };
        case 'grayscale':
          return {
            ...base,
            padding: sizeStyles.padding,
            filter: 'grayscale(100%)',
            opacity: 0.7,
          };
        case 'simple':
        default:
          return {
            ...base,
            padding: sizeStyles.padding,
          };
      }
    };

    const getImageStyles = (): React.CSSProperties => ({
      maxHeight: sizeStyles.height,
      maxWidth: '100%',
      objectFit: 'contain',
      transition: 'all 0.3s ease',
    });

    const content = (
      <div
        style={getContainerStyles()}
        onMouseEnter={(e) => {
          if (variant === 'hover-zoom') {
            const img = e.currentTarget.querySelector('img');
            if (img) img.style.transform = 'scale(1.1)';
          }
          if (variant === 'grayscale') {
            e.currentTarget.style.filter = 'grayscale(0%)';
            e.currentTarget.style.opacity = '1';
          }
          if (variant === 'card') {
            e.currentTarget.style.boxShadow = tokens.shadows.medium;
            e.currentTarget.style.borderColor = tokens.colors.primary;
          }
        }}
        onMouseLeave={(e) => {
          if (variant === 'hover-zoom') {
            const img = e.currentTarget.querySelector('img');
            if (img) img.style.transform = 'scale(1)';
          }
          if (variant === 'grayscale') {
            e.currentTarget.style.filter = 'grayscale(100%)';
            e.currentTarget.style.opacity = '0.7';
          }
          if (variant === 'card') {
            e.currentTarget.style.boxShadow = tokens.shadows.subtle;
            e.currentTarget.style.borderColor = tokens.colors.border;
          }
        }}
      >
        <img src={imageUrl} alt={altText} style={getImageStyles()} />
        {showName && companyName && (
          <span
            style={{
              marginTop: tokens.spacing.xs,
              fontSize: tokens.typography.caption.size,
              color: tokens.colors.muted,
              textAlign: 'center',
            }}
          >
            {companyName}
          </span>
        )}
      </div>
    );

    if (link) {
      return (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: 'none' }}
        >
          {content}
        </a>
      );
    }

    return content;
  },
};
