'use client';

import React from 'react';
import { ComponentConfig } from '@measured/puck';
import { usePuckTokens } from '../brand-context';
import { createColorField, createSpacingField } from '../custom-fields';

interface ListItem {
  text: string;
  icon?: string;
}

interface ListProps {
  type: 'bullet' | 'numbered' | 'check' | 'icon';
  items: ListItem[];
  iconColor: 'primary' | 'secondary' | 'text' | 'muted';
  spacing: 'tight' | 'normal' | 'relaxed';
}

export const ListConfig: ComponentConfig<ListProps> = {
  label: 'Lista',

  defaultProps: {
    type: 'bullet',
    items: [
      { text: 'Első elem' },
      { text: 'Második elem' },
      { text: 'Harmadik elem' },
    ],
    iconColor: 'primary',
    spacing: 'normal',
  },

  fields: {
    type: {
      type: 'radio',
      label: 'Lista típus',
      options: [
        { label: '• Pontozott', value: 'bullet' },
        { label: '1. Számozott', value: 'numbered' },
        { label: '✓ Pipa', value: 'check' },
        { label: '★ Egyedi', value: 'icon' },
      ],
    },
    items: {
      type: 'array',
      label: 'Lista elemek',
      arrayFields: {
        text: {
          type: 'text',
          label: 'Szöveg',
        },
        icon: {
          type: 'text',
          label: 'Ikon (emoji)',
        },
      },
      defaultItemProps: {
        text: 'Új elem',
        icon: '✓',
      },
    },
    iconColor: {
      ...(createColorField([
        { label: 'Elsődleges', value: 'primary', color: '#fa604a' },
        { label: 'Másodlagos', value: 'secondary', color: '#18181b' },
        { label: 'Szöveg', value: 'text', color: '#374151' },
        { label: 'Halvány', value: 'muted', color: '#9ca3af' },
      ]) as any),
      label: 'Ikon/jelölő szín',
    },
    spacing: {
      ...(createSpacingField([
        { value: 'tight', label: 'Szűk', pixels: 8 },
        { value: 'normal', label: 'Normál', pixels: 16 },
        { value: 'relaxed', label: 'Tágas', pixels: 24 },
      ]) as any),
      label: 'Sorköz',
    },
  },

  render: ({ type = 'bullet', items = [], iconColor = 'primary', spacing = 'normal' }) => {
    const tokens = usePuckTokens();

    const colorMap = {
      primary: tokens.colors.primary,
      secondary: tokens.colors.secondary,
      text: tokens.colors.text,
      muted: tokens.colors.muted,
    };

    const spacingMap = {
      tight: tokens.spacing.xs,
      normal: tokens.spacing.sm,
      relaxed: tokens.spacing.md,
    };

    const getMarker = (index: number, item: ListItem) => {
      switch (type) {
        case 'numbered':
          return `${index + 1}.`;
        case 'check':
          return '✓';
        case 'icon':
          return item.icon || '•';
        default:
          return '•';
      }
    };

    return (
      <ul
        style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          fontFamily: tokens.fonts.body,
        }}
      >
        {items.map((item, index) => (
          <li
            key={index}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: tokens.spacing.sm,
              marginBottom: index < items.length - 1 ? spacingMap[spacing] : 0,
            }}
          >
            <span
              style={{
                color: colorMap[iconColor],
                fontWeight: type === 'numbered' ? 600 : 400,
                fontSize: tokens.typography.body.size,
                minWidth: type === 'numbered' ? '24px' : 'auto',
                flexShrink: 0,
              }}
            >
              {getMarker(index, item)}
            </span>
            <span
              style={{
                color: tokens.typography.body.color,
                fontSize: tokens.typography.body.size,
                fontWeight: tokens.typography.body.weight,
                lineHeight: tokens.typography.body.lineHeight,
              }}
            >
              {item.text}
            </span>
          </li>
        ))}
      </ul>
    );
  },
};
