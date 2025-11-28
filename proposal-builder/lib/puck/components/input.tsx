'use client';

import React from 'react';
import { ComponentConfig } from '@measured/puck';
import { usePuckTokens } from '../brand-context';

interface InputProps {
  type: 'text' | 'email' | 'tel' | 'textarea';
  label: string;
  placeholder: string;
  required: boolean;
  helpText?: string;
  size: 'small' | 'medium' | 'large';
}

export const InputConfig: ComponentConfig<InputProps> = {
  label: 'Beviteli mező',

  defaultProps: {
    type: 'text',
    label: 'Mező címke',
    placeholder: 'Írjon ide...',
    required: false,
    helpText: '',
    size: 'medium',
  },

  fields: {
    type: {
      type: 'select',
      label: 'Típus',
      options: [
        { label: 'Szöveg', value: 'text' },
        { label: 'E-mail', value: 'email' },
        { label: 'Telefon', value: 'tel' },
        { label: 'Szövegdoboz', value: 'textarea' },
      ],
    },
    label: {
      type: 'text',
      label: 'Címke',
    },
    placeholder: {
      type: 'text',
      label: 'Placeholder',
    },
    required: {
      type: 'radio',
      label: 'Kötelező',
      options: [
        { label: 'Nem', value: false },
        { label: 'Igen', value: true },
      ],
    },
    helpText: {
      type: 'text',
      label: 'Segítő szöveg',
    },
    size: {
      type: 'select',
      label: 'Méret',
      options: [
        { label: 'Kicsi', value: 'small' },
        { label: 'Közepes', value: 'medium' },
        { label: 'Nagy', value: 'large' },
      ],
    },
  },

  render: ({ type, label, placeholder, required, helpText, size }) => {
    const tokens = usePuckTokens();

    const sizeStyles = {
      small: {
        padding: `${tokens.spacing.xs} ${tokens.spacing.sm}`,
        fontSize: tokens.typography.bodySmall.size,
      },
      medium: {
        padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
        fontSize: tokens.typography.body.size,
      },
      large: {
        padding: `${tokens.spacing.md} ${tokens.spacing.lg}`,
        fontSize: tokens.typography.body.size,
      },
    };

    const inputStyle: React.CSSProperties = {
      width: '100%',
      padding: sizeStyles[size].padding,
      fontSize: sizeStyles[size].fontSize,
      fontFamily: tokens.fonts.body,
      color: tokens.colors.text,
      backgroundColor: tokens.colors.background,
      border: `${tokens.borderWidth.thin} solid ${tokens.colors.border}`,
      borderRadius: tokens.borderRadius.md,
      outline: 'none',
      transition: 'all 0.2s ease',
      boxSizing: 'border-box' as const,
    };

    return (
      <div style={{ width: '100%' }}>
        {label && (
          <label
            style={{
              display: 'block',
              marginBottom: tokens.spacing.xs,
              fontSize: tokens.typography.label.size,
              fontWeight: tokens.typography.label.weight,
              fontFamily: tokens.fonts.body,
              color: tokens.typography.label.color,
            }}
          >
            {label}
            {required && (
              <span style={{ color: tokens.colors.primary, marginLeft: tokens.spacing.xs }}>*</span>
            )}
          </label>
        )}

        {type === 'textarea' ? (
          <textarea
            placeholder={placeholder}
            required={required}
            rows={4}
            style={inputStyle}
            readOnly
          />
        ) : (
          <input
            type={type}
            placeholder={placeholder}
            required={required}
            style={inputStyle}
            readOnly
          />
        )}

        {helpText && (
          <p
            style={{
              marginTop: tokens.spacing.xs,
              fontSize: tokens.typography.caption.size,
              color: tokens.colors.muted,
              fontFamily: tokens.fonts.body,
              margin: `${tokens.spacing.xs} 0 0 0`,
            }}
          >
            {helpText}
          </p>
        )}
      </div>
    );
  },
};
