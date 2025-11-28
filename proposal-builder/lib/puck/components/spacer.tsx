'use client';

import React from 'react';
import { ComponentConfig } from '@measured/puck';
import { usePuckTokens } from '../brand-context';

type SizeValue = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';

interface SpacerProps {
  size: SizeValue;
  showLine?: boolean;
}

export const SpacerConfig: ComponentConfig<SpacerProps> = {
  label: 'Térköz',

  defaultProps: {
    size: 'md',
    showLine: false,
  },

  fields: {
    size: {
      type: 'select',
      label: 'Méret',
      options: [
        { value: 'xs', label: 'XS (8px)' },
        { value: 'sm', label: 'SM (16px)' },
        { value: 'md', label: 'MD (24px)' },
        { value: 'lg', label: 'LG (32px)' },
        { value: 'xl', label: 'XL (48px)' },
        { value: '2xl', label: '2XL (64px)' },
        { value: '3xl', label: '3XL (80px)' },
      ],
    },
    showLine: {
      type: 'radio',
      label: 'Vonal megjelenítése',
      options: [
        { label: '— Nem', value: false },
        { label: '━ Igen', value: true },
      ],
    },
  },

  render: ({ size, showLine }) => {
    const tokens = usePuckTokens();

    return (
      <div
        style={{
          height: tokens.spacing[size],
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {showLine && (
          <div
            style={{
              width: '100%',
              height: '1px',
              backgroundColor: tokens.colors.border,
            }}
          />
        )}
      </div>
    );
  },
};
