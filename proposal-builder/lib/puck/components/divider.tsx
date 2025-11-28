'use client';

import React from 'react';
import { ComponentConfig } from '@measured/puck';
import { usePuckTokens } from '../brand-context';

interface DividerProps {
  style: 'solid' | 'dashed' | 'dotted' | 'gradient';
  thickness: 'thin' | 'medium' | 'thick';
  color: 'border' | 'primary' | 'secondary' | 'muted';
  marginY: 'sm' | 'md' | 'lg' | 'xl';
}

export const DividerConfig: ComponentConfig<DividerProps> = {
  label: 'Elválasztó',

  defaultProps: {
    style: 'solid',
    thickness: 'thin',
    color: 'border',
    marginY: 'md',
  },

  fields: {
    style: {
      type: 'select',
      label: 'Stílus',
      options: [
        { label: 'Folytonos', value: 'solid' },
        { label: 'Szaggatott', value: 'dashed' },
        { label: 'Pontozott', value: 'dotted' },
        { label: 'Gradiens', value: 'gradient' },
      ],
    },
    thickness: {
      type: 'select',
      label: 'Vastagság',
      options: [
        { label: 'Vékony (1px)', value: 'thin' },
        { label: 'Közepes (2px)', value: 'medium' },
        { label: 'Vastag (4px)', value: 'thick' },
      ],
    },
    color: {
      type: 'select',
      label: 'Szín',
      options: [
        { label: 'Szegély', value: 'border' },
        { label: 'Elsődleges', value: 'primary' },
        { label: 'Másodlagos', value: 'secondary' },
        { label: 'Halvány', value: 'muted' },
      ],
    },
    marginY: {
      type: 'select',
      label: 'Függőleges margó',
      options: [
        { label: 'Small', value: 'sm' },
        { label: 'Medium', value: 'md' },
        { label: 'Large', value: 'lg' },
        { label: 'Extra Large', value: 'xl' },
      ],
    },
  },

  render: ({ style, thickness, color, marginY }) => {
    const tokens = usePuckTokens();

    const thicknessMap = {
      thin: tokens.borderWidth.thin,
      medium: tokens.borderWidth.medium,
      thick: tokens.borderWidth.thick,
    };

    const colorMap = {
      border: tokens.colors.border,
      primary: tokens.colors.primary,
      secondary: tokens.colors.secondary,
      muted: tokens.colors.muted,
    };

    const isGradient = style === 'gradient';

    return (
      <div
        style={{
          width: '100%',
          marginTop: tokens.spacing[marginY],
          marginBottom: tokens.spacing[marginY],
        }}
      >
        <div
          style={{
            width: '100%',
            height: thicknessMap[thickness],
            borderRadius: thickness === 'thick' ? tokens.borderRadius.sm : '0',
            ...(isGradient
              ? {
                  background: `linear-gradient(90deg, transparent, ${tokens.colors.primary}, transparent)`,
                }
              : {
                  borderTop: `${thicknessMap[thickness]} ${style} ${colorMap[color]}`,
                  height: '0',
                }),
          }}
        />
      </div>
    );
  },
};
