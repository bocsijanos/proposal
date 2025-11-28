'use client';

import React from 'react';
import { ComponentConfig } from '@measured/puck';
import { usePuckTokens } from '../brand-context';

interface BadgeProps {
  text: string;
  variant: 'solid' | 'outline' | 'subtle' | 'gradient';
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'muted';
  size: 'sm' | 'md' | 'lg';
  icon?: string;
  iconPosition: 'left' | 'right';
  pill: boolean;
}

export const BadgeConfig: ComponentConfig<BadgeProps> = {
  label: 'Badge',

  defaultProps: {
    text: 'Címke',
    variant: 'solid',
    color: 'primary',
    size: 'md',
    icon: '',
    iconPosition: 'left',
    pill: true,
  },

  fields: {
    text: {
      type: 'text',
      label: 'Szöveg',
    },
    variant: {
      type: 'select',
      label: 'Változat',
      options: [
        { label: 'Teli', value: 'solid' },
        { label: 'Körvonal', value: 'outline' },
        { label: 'Finom', value: 'subtle' },
        { label: 'Gradiens', value: 'gradient' },
      ],
    },
    color: {
      type: 'select',
      label: 'Szín',
      options: [
        { label: 'Elsődleges', value: 'primary' },
        { label: 'Másodlagos', value: 'secondary' },
        { label: 'Sikeres', value: 'success' },
        { label: 'Figyelmeztetés', value: 'warning' },
        { label: 'Hiba', value: 'error' },
        { label: 'Szürke', value: 'muted' },
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
    icon: {
      type: 'text',
      label: 'Ikon (emoji vagy szöveg)',
    },
    iconPosition: {
      type: 'radio',
      label: 'Ikon pozíció',
      options: [
        { label: 'Balra', value: 'left' },
        { label: 'Jobbra', value: 'right' },
      ],
    },
    pill: {
      type: 'radio',
      label: 'Kerekített',
      options: [
        { label: 'Igen', value: true },
        { label: 'Nem', value: false },
      ],
    },
  },

  render: ({ text, variant, color, size, icon, iconPosition, pill }) => {
    const tokens = usePuckTokens();

    // Színek meghatározása
    const getColorValues = () => {
      switch (color) {
        case 'primary':
          return {
            main: tokens.colors.primary,
            text: tokens.colors.textLight,
            bg: `${tokens.colors.primary}15`,
          };
        case 'secondary':
          return {
            main: tokens.colors.secondary,
            text: tokens.colors.textLight,
            bg: `${tokens.colors.secondary}15`,
          };
        case 'success':
          return {
            main: tokens.colors.success,
            text: tokens.colors.textLight,
            bg: `${tokens.colors.success}15`,
          };
        case 'warning':
          return {
            main: tokens.colors.warning,
            text: tokens.colors.text,
            bg: `${tokens.colors.warning}15`,
          };
        case 'error':
          return {
            main: tokens.colors.error,
            text: tokens.colors.textLight,
            bg: `${tokens.colors.error}15`,
          };
        case 'muted':
        default:
          return {
            main: tokens.colors.muted,
            text: tokens.colors.textLight,
            bg: `${tokens.colors.muted}15`,
          };
      }
    };

    const colorValues = getColorValues();

    // Méret alapján stílusok
    const getSizeStyles = (): React.CSSProperties => {
      switch (size) {
        case 'sm':
          return {
            padding: `${tokens.spacing.xs} ${tokens.spacing.sm}`,
            fontSize: tokens.typography.caption.size,
          };
        case 'lg':
          return {
            padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
            fontSize: tokens.typography.body.size,
          };
        case 'md':
        default:
          return {
            padding: `6px ${tokens.spacing.sm}`,
            fontSize: tokens.typography.bodySmall.size,
          };
      }
    };

    // Változat alapján stílusok
    const getVariantStyles = (): React.CSSProperties => {
      const sizeStyles = getSizeStyles();

      const base: React.CSSProperties = {
        ...sizeStyles,
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        fontFamily: tokens.fonts.body,
        fontWeight: '500',
        lineHeight: 1,
        borderRadius: pill ? tokens.borderRadius.pill : tokens.borderRadius.sm,
        whiteSpace: 'nowrap',
        transition: 'all 0.2s ease',
      };

      switch (variant) {
        case 'solid':
          return {
            ...base,
            backgroundColor: colorValues.main,
            color: colorValues.text,
            border: 'none',
          };
        case 'outline':
          return {
            ...base,
            backgroundColor: 'transparent',
            color: colorValues.main,
            border: `1.5px solid ${colorValues.main}`,
          };
        case 'subtle':
          return {
            ...base,
            backgroundColor: colorValues.bg,
            color: colorValues.main,
            border: 'none',
          };
        case 'gradient':
          return {
            ...base,
            background: `linear-gradient(135deg, ${tokens.colors.primary} 0%, ${tokens.colors.secondary} 100%)`,
            color: tokens.colors.textLight,
            border: 'none',
          };
        default:
          return base;
      }
    };

    return (
      <span style={getVariantStyles()}>
        {icon && iconPosition === 'left' && <span>{icon}</span>}
        <span>{text}</span>
        {icon && iconPosition === 'right' && <span>{icon}</span>}
      </span>
    );
  },
};
