'use client';

import React from 'react';
import { ComponentConfig } from '@measured/puck';
import { usePuckTokens } from '../brand-context';
import { createButtonVariantField } from '../custom-fields';

type SizeValue = 'small' | 'medium' | 'large';
type AlignmentValue = 'left' | 'center' | 'right';

interface ButtonProps {
  label: string;
  variant: 'primary' | 'secondary' | 'outline' | 'outline-light' | 'ghost' | 'link';
  size: SizeValue;
  fullWidth: boolean;
  icon?: string;
  iconPosition: 'left' | 'right';
  href?: string;
  alignment: AlignmentValue;
}

export const ButtonConfig: ComponentConfig<ButtonProps> = {
  label: 'Gomb',

  defaultProps: {
    label: 'Kattints ide',
    variant: 'primary',
    size: 'medium',
    fullWidth: false,
    icon: '',
    iconPosition: 'left',
    href: '',
    alignment: 'left',
  },

  fields: {
    label: {
      type: 'text',
      label: 'Gomb szöveg',
    },
    variant: {
      ...createButtonVariantField([
        { value: 'primary', label: 'Elsődleges', preview: { bg: '#fa604a', color: '#fff' } },
        { value: 'secondary', label: 'Másodlagos', preview: { bg: '#18181b', color: '#fff' } },
        { value: 'outline', label: 'Körvonal', preview: { bg: 'transparent', color: '#18181b', border: '2px solid #18181b' } },
        { value: 'outline-light', label: 'Körvonal (fehér)', preview: { bg: '#3e4581', color: '#fff', border: '2px solid #fff' } },
        { value: 'ghost', label: 'Szellem', preview: { bg: '#f3f4f6', color: '#374151' } },
        { value: 'link', label: 'Link', preview: { bg: 'transparent', color: '#3b82f6' } },
      ]) as any,
      label: 'Variáns',
    },
    size: {
      type: 'select',
      label: 'Méret',
      options: [
        { value: 'small', label: 'Kicsi' },
        { value: 'medium', label: 'Közepes' },
        { value: 'large', label: 'Nagy' },
      ],
    },
    fullWidth: {
      type: 'radio',
      label: 'Teljes szélesség',
      options: [
        { label: 'Nem', value: false },
        { label: 'Igen', value: true },
      ],
    },
    icon: {
      type: 'text',
      label: 'Ikon (emoji)',
    },
    iconPosition: {
      type: 'radio',
      label: 'Ikon pozíció',
      options: [
        { label: '⬅️ Bal', value: 'left' },
        { label: 'Jobb ➡️', value: 'right' },
      ],
    },
    href: {
      type: 'text',
      label: 'Link URL (opcionális)',
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
  },

  render: ({ label = '', variant = 'primary', size = 'medium', fullWidth = false, icon, iconPosition = 'left', href, alignment = 'left' }) => {
    const tokens = usePuckTokens();

    // Use brand-specific button styles
    const getVariantStyles = () => {
      switch (variant) {
        case 'primary':
          return {
            backgroundColor: tokens.button.primary.background,
            color: tokens.button.primary.color,
            border: 'none',
            boxShadow: tokens.button.primary.shadow,
            borderRadius: tokens.button.primary.borderRadius,
          };
        case 'secondary':
          return {
            backgroundColor: tokens.button.secondary.background,
            color: tokens.button.secondary.color,
            border: 'none',
            boxShadow: tokens.button.secondary.shadow,
            borderRadius: tokens.button.secondary.borderRadius,
          };
        case 'outline':
          return {
            backgroundColor: tokens.button.outline.background,
            color: tokens.button.outline.color,
            border: tokens.button.outline.border,
            boxShadow: 'none',
            borderRadius: tokens.button.outline.borderRadius,
          };
        case 'outline-light':
          return {
            backgroundColor: tokens.button.outlineLight.background,
            color: tokens.button.outlineLight.color,
            border: tokens.button.outlineLight.border,
            boxShadow: 'none',
            borderRadius: tokens.button.outlineLight.borderRadius,
          };
        case 'ghost':
          return {
            backgroundColor: 'transparent',
            color: tokens.colors.text,
            border: 'none',
            boxShadow: 'none',
            borderRadius: tokens.borderRadius.md,
          };
        case 'link':
          return {
            backgroundColor: 'transparent',
            color: tokens.colors.primary,
            border: 'none',
            boxShadow: 'none',
            borderRadius: '0',
            textDecoration: 'underline',
          };
        default:
          return {};
      }
    };

    const sizeStyles = {
      small: {
        padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
        fontSize: tokens.typography.bodySmall.size,
      },
      medium: {
        padding: `${tokens.spacing.sm} ${tokens.spacing.lg}`,
        fontSize: tokens.typography.body.size,
      },
      large: {
        padding: `${tokens.spacing.md} ${tokens.spacing.xl}`,
        fontSize: tokens.typography.h5.size,
      },
    };

    const alignmentMap = {
      left: 'flex-start',
      center: 'center',
      right: 'flex-end',
    };

    const variantStyles = getVariantStyles();

    const buttonStyles: React.CSSProperties = {
      ...variantStyles,
      ...sizeStyles[size],
      fontWeight: 600,
      fontFamily: tokens.fonts.body,
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: icon ? '8px' : '0',
      textDecoration: variant === 'link' ? 'underline' : 'none',
      textAlign: 'center',
      transition: 'all 0.3s ease',
      width: fullWidth ? '100%' : 'auto',
      whiteSpace: 'nowrap',
    };

    const content = (
      <>
        {icon && iconPosition === 'left' && <span>{icon}</span>}
        <span>{label}</span>
        {icon && iconPosition === 'right' && <span>{icon}</span>}
      </>
    );

    const buttonElement = href ? (
      <a href={href} style={buttonStyles}>
        {content}
      </a>
    ) : (
      <button style={buttonStyles}>{content}</button>
    );

    // Wrap in alignment container if not full width
    if (!fullWidth) {
      return (
        <div style={{ display: 'flex', justifyContent: alignmentMap[alignment] }}>
          {buttonElement}
        </div>
      );
    }

    return buttonElement;
  },
};
