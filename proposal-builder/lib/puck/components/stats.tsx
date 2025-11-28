'use client';

import React from 'react';
import { ComponentConfig } from '@measured/puck';
import { usePuckTokens } from '../brand-context';
import { createAlignmentField, createColorField } from '../custom-fields';

interface StatItem {
  value: string;
  label: string;
  prefix?: string;
  suffix?: string;
}

interface StatsProps {
  items: StatItem[];
  layout: 'row' | 'grid';
  alignment: 'left' | 'center' | 'right';
  valueColor: 'primary' | 'secondary' | 'text';
  showDividers: boolean;
}

export const StatsConfig: ComponentConfig<StatsProps> = {
  label: 'Statisztikák',

  defaultProps: {
    items: [
      { value: '100', label: 'Ügyfelek', suffix: '+' },
      { value: '98', label: 'Elégedettség', suffix: '%' },
      { value: '50', label: 'Projektek', prefix: '', suffix: '+' },
    ],
    layout: 'row',
    alignment: 'center',
    valueColor: 'primary',
    showDividers: true,
  },

  fields: {
    items: {
      type: 'array',
      label: 'Statisztikák',
      arrayFields: {
        value: {
          type: 'text',
          label: 'Érték',
        },
        label: {
          type: 'text',
          label: 'Címke',
        },
        prefix: {
          type: 'text',
          label: 'Prefix (opcionális)',
        },
        suffix: {
          type: 'text',
          label: 'Suffix (opcionális)',
        },
      },
      defaultItemProps: {
        value: '0',
        label: 'Címke',
        prefix: '',
        suffix: '',
      },
    },
    layout: {
      type: 'radio',
      label: 'Elrendezés',
      options: [
        { label: '━━━ Egysoros', value: 'row' },
        { label: '▦ Rács', value: 'grid' },
      ],
    },
    alignment: {
      ...(createAlignmentField() as any),
      label: 'Igazítás',
    },
    valueColor: {
      ...(createColorField([
        { label: 'Elsődleges', value: 'primary', color: '#fa604a' },
        { label: 'Másodlagos', value: 'secondary', color: '#18181b' },
        { label: 'Szöveg', value: 'text', color: '#374151' },
      ]) as any),
      label: 'Érték színe',
    },
    showDividers: {
      type: 'radio',
      label: 'Elválasztók',
      options: [
        { label: '│ Igen', value: true },
        { label: '  Nem', value: false },
      ],
    },
  },

  render: ({ items = [], layout = 'row', alignment = 'center', valueColor = 'primary', showDividers = true }) => {
    const tokens = usePuckTokens();

    const colorMap = {
      primary: tokens.colors.primary,
      secondary: tokens.colors.secondary,
      text: tokens.colors.text,
    };

    const alignmentMap = {
      left: 'flex-start',
      center: 'center',
      right: 'flex-end',
    };

    return (
      <div
        style={{
          display: layout === 'row' ? 'flex' : 'grid',
          gridTemplateColumns: layout === 'grid' ? 'repeat(auto-fit, minmax(150px, 1fr))' : undefined,
          flexWrap: layout === 'row' ? 'wrap' : undefined,
          justifyContent: alignmentMap[alignment],
          gap: tokens.spacing.xl,
          width: '100%',
        }}
      >
        {items.map((item, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: alignment,
              textAlign: alignment,
              paddingLeft: showDividers && index > 0 && layout === 'row' ? tokens.spacing.xl : 0,
              borderLeft: showDividers && index > 0 && layout === 'row' ? `1px solid ${tokens.colors.border}` : 'none',
            }}
          >
            <div
              style={{
                fontSize: tokens.typography.h2.size,
                fontWeight: tokens.typography.h2.weight,
                lineHeight: tokens.typography.h2.lineHeight,
                fontFamily: tokens.fonts.heading,
                color: colorMap[valueColor],
              }}
            >
              {item.prefix}
              {item.value}
              {item.suffix}
            </div>
            <div
              style={{
                fontSize: tokens.typography.body.size,
                fontWeight: tokens.typography.body.weight,
                lineHeight: tokens.typography.body.lineHeight,
                fontFamily: tokens.fonts.body,
                color: tokens.colors.muted,
                marginTop: tokens.spacing.xs,
              }}
            >
              {item.label}
            </div>
          </div>
        ))}
      </div>
    );
  },
};
