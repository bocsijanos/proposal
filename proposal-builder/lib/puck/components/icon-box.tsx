'use client';

import React from 'react';
import { ComponentConfig } from '@measured/puck';
import { usePuckTokens } from '../brand-context';

interface IconBoxProps {
  icon: string;
  title: string;
  description?: string;
  variant: 'card' | 'minimal' | 'icon-top' | 'icon-left';
  iconStyle: 'emoji' | 'circle' | 'square' | 'outline';
  alignment: 'left' | 'center';
  showBorder: boolean;
}

export const IconBoxConfig: ComponentConfig<IconBoxProps> = {
  label: 'IconBox',

  defaultProps: {
    icon: '✨',
    title: 'Jellemző címe',
    description: 'Rövid leírás a jellemzőről vagy szolgáltatásról.',
    variant: 'card',
    iconStyle: 'emoji',
    alignment: 'left',
    showBorder: true,
  },

  fields: {
    icon: {
      type: 'text',
      label: 'Ikon (emoji vagy szöveg)',
    },
    title: {
      type: 'text',
      label: 'Cím',
    },
    description: {
      type: 'textarea',
      label: 'Leírás',
    },
    variant: {
      type: 'select',
      label: 'Változat',
      options: [
        { label: 'Kártya', value: 'card' },
        { label: 'Minimalista', value: 'minimal' },
        { label: 'Ikon felül', value: 'icon-top' },
        { label: 'Ikon balra', value: 'icon-left' },
      ],
    },
    iconStyle: {
      type: 'select',
      label: 'Ikon stílus',
      options: [
        { label: 'Emoji', value: 'emoji' },
        { label: 'Kör háttér', value: 'circle' },
        { label: 'Négyzet háttér', value: 'square' },
        { label: 'Körvonal', value: 'outline' },
      ],
    },
    alignment: {
      type: 'radio',
      label: 'Igazítás',
      options: [
        { label: 'Balra', value: 'left' },
        { label: 'Középre', value: 'center' },
      ],
    },
    showBorder: {
      type: 'radio',
      label: 'Keret megjelenítése',
      options: [
        { label: 'Igen', value: true },
        { label: 'Nem', value: false },
      ],
    },
  },

  render: ({ icon = '✨', title = '', description, variant = 'card', iconStyle = 'emoji', alignment = 'left', showBorder = true }) => {
    const tokens = usePuckTokens();

    const getIconStyles = (): React.CSSProperties => {
      const baseSize = tokens.sizing.iconMd;
      const fontSize = tokens.sizing.iconSm;

      switch (iconStyle) {
        case 'circle':
          return {
            width: baseSize,
            height: baseSize,
            borderRadius: '50%',
            backgroundColor: `${tokens.colors.primary}15`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize,
            flexShrink: 0,
          };
        case 'square':
          return {
            width: baseSize,
            height: baseSize,
            borderRadius: tokens.borderRadius.md,
            backgroundColor: `${tokens.colors.primary}15`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize,
            flexShrink: 0,
          };
        case 'outline':
          return {
            width: baseSize,
            height: baseSize,
            borderRadius: tokens.borderRadius.md,
            border: `${tokens.borderWidth.medium} solid ${tokens.colors.primary}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize,
            flexShrink: 0,
          };
        default: // emoji
          return {
            fontSize: tokens.sizing.iconSm,
            lineHeight: 1,
            flexShrink: 0,
          };
      }
    };

    const getContainerStyles = (): React.CSSProperties => {
      const base: React.CSSProperties = {
        fontFamily: tokens.fonts.body,
        textAlign: alignment,
      };

      if (variant === 'card') {
        return {
          ...base,
          padding: tokens.spacing.lg,
          backgroundColor: tokens.colors.backgroundAlt,
          borderRadius: tokens.borderRadius.lg,
          border: showBorder ? `1px solid ${tokens.colors.border}` : 'none',
          boxShadow: tokens.shadows.subtle,
        };
      }

      if (variant === 'minimal') {
        return {
          ...base,
          padding: tokens.spacing.md,
          borderLeft: showBorder ? `3px solid ${tokens.colors.primary}` : 'none',
        };
      }

      return base;
    };

    const getLayoutStyles = (): React.CSSProperties => {
      if (variant === 'icon-left') {
        return {
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-start',
          gap: tokens.spacing.md,
        };
      }

      if (variant === 'icon-top' || alignment === 'center') {
        return {
          display: 'flex',
          flexDirection: 'column',
          alignItems: alignment === 'center' ? 'center' : 'flex-start',
          gap: tokens.spacing.sm,
        };
      }

      return {
        display: 'flex',
        flexDirection: 'column',
        gap: tokens.spacing.sm,
      };
    };

    return (
      <div style={getContainerStyles()}>
        <div style={getLayoutStyles()}>
          {/* Icon */}
          <div style={getIconStyles()}>
            {icon}
          </div>

          {/* Content */}
          <div style={{ flex: 1 }}>
            <h4
              style={{
                fontSize: tokens.typography.h5.size,
                fontWeight: tokens.typography.h5.weight,
                lineHeight: tokens.typography.h5.lineHeight,
                fontFamily: tokens.fonts.heading,
                color: tokens.typography.h5.color,
                margin: 0,
                marginBottom: description ? tokens.spacing.xs : 0,
              }}
            >
              {title}
            </h4>

            {description && (
              <p
                style={{
                  fontSize: tokens.typography.body.size,
                  fontWeight: tokens.typography.body.weight,
                  lineHeight: tokens.typography.body.lineHeight,
                  color: tokens.colors.muted,
                  margin: 0,
                }}
              >
                {description}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  },
};
