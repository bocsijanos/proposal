'use client';

import React from 'react';
import { ComponentConfig, DropZone } from '@measured/puck';
import { usePuckTokens } from '../brand-context';

// Layout types - equal columns or asymmetric ratios
type LayoutType =
  | 'equal-2' | 'equal-3' | 'equal-4' | 'equal-6'  // Equal columns
  | '2-1' | '1-2'      // 2/3 + 1/3 variations
  | '3-1' | '1-3'      // 3/4 + 1/4 variations
  | '1-2-1'            // Centered wide column
  | '1-1-2' | '2-1-1'; // 3-column asymmetric

interface GridProps {
  layout: LayoutType;
  gap: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  alignment: 'start' | 'center' | 'end' | 'stretch';
  mobileStack: boolean;
}

// Map layout types to CSS grid-template-columns and column count
const layoutConfig: Record<LayoutType, { columns: string; count: number }> = {
  // Equal columns
  'equal-2': { columns: 'repeat(2, 1fr)', count: 2 },
  'equal-3': { columns: 'repeat(3, 1fr)', count: 3 },
  'equal-4': { columns: 'repeat(4, 1fr)', count: 4 },
  'equal-6': { columns: 'repeat(6, 1fr)', count: 6 },
  // 2-column asymmetric
  '2-1': { columns: '2fr 1fr', count: 2 },
  '1-2': { columns: '1fr 2fr', count: 2 },
  '3-1': { columns: '3fr 1fr', count: 2 },
  '1-3': { columns: '1fr 3fr', count: 2 },
  // 3-column asymmetric
  '1-2-1': { columns: '1fr 2fr 1fr', count: 3 },
  '1-1-2': { columns: '1fr 1fr 2fr', count: 3 },
  '2-1-1': { columns: '2fr 1fr 1fr', count: 3 },
};

export const GridConfig: ComponentConfig<GridProps> = {
  label: 'Rács',

  defaultProps: {
    layout: 'equal-3',
    gap: 'md',
    alignment: 'stretch',
    mobileStack: true,
  },

  fields: {
    layout: {
      type: 'select',
      label: 'Elrendezés',
      options: [
        // Equal columns group
        { label: '── Egyenlő oszlopok ──', value: 'equal-2' },
        { label: '2 egyenlő oszlop', value: 'equal-2' },
        { label: '3 egyenlő oszlop', value: 'equal-3' },
        { label: '4 egyenlő oszlop', value: 'equal-4' },
        { label: '6 egyenlő oszlop', value: 'equal-6' },
        // 2-column asymmetric group
        { label: '── Aszimmetrikus (2 oszlop) ──', value: '2-1' },
        { label: '2/3 + 1/3 (széles bal)', value: '2-1' },
        { label: '1/3 + 2/3 (széles jobb)', value: '1-2' },
        { label: '3/4 + 1/4 (nagy bal)', value: '3-1' },
        { label: '1/4 + 3/4 (nagy jobb)', value: '1-3' },
        // 3-column asymmetric group
        { label: '── Aszimmetrikus (3 oszlop) ──', value: '1-2-1' },
        { label: 'Keskeny-Széles-Keskeny', value: '1-2-1' },
        { label: 'Keskeny-Keskeny-Széles', value: '1-1-2' },
        { label: 'Széles-Keskeny-Keskeny', value: '2-1-1' },
      ],
    },
    gap: {
      type: 'select',
      label: 'Rés mérete',
      options: [
        { label: 'Extra kicsi', value: 'xs' },
        { label: 'Kicsi', value: 'sm' },
        { label: 'Közepes', value: 'md' },
        { label: 'Nagy', value: 'lg' },
        { label: 'Extra nagy', value: 'xl' },
      ],
    },
    alignment: {
      type: 'select',
      label: 'Tartalom igazítás',
      options: [
        { label: 'Felül', value: 'start' },
        { label: 'Középen', value: 'center' },
        { label: 'Alul', value: 'end' },
        { label: 'Kitöltés', value: 'stretch' },
      ],
    },
    mobileStack: {
      type: 'radio',
      label: 'Mobilon egymás alá',
      options: [
        { label: 'Igen', value: true },
        { label: 'Nem', value: false },
      ],
    },
  },

  render: ({ layout = 'equal-3', gap = 'md', alignment = 'stretch', mobileStack = true }) => {
    const tokens = usePuckTokens();

    // Generate unique ID for this grid instance
    const gridId = React.useId();
    const safeId = gridId.replace(/:/g, '');

    const config = layoutConfig[layout] || layoutConfig['equal-3'];

    // Generate DropZones for each column
    const dropZones = [];
    for (let i = 0; i < config.count; i++) {
      dropZones.push(
        <div
          key={i}
          style={{
            minHeight: '60px',
            backgroundColor: 'transparent',
          }}
        >
          <DropZone zone={`gridColumn${i + 1}`} />
        </div>
      );
    }

    // Use CSS Container Queries for responsive behavior in Puck editor
    // Container queries respond to the container width, not viewport width
    return (
      <>
        <style>{`
          .puck-grid-container-${safeId} {
            container-type: inline-size;
            width: 100%;
          }
          .puck-grid-${safeId} {
            display: grid;
            grid-template-columns: ${config.columns};
            gap: ${tokens.spacing[gap]};
            align-items: ${alignment};
            width: 100%;
          }
          /* Container query - responds to container width, not viewport */
          @container (max-width: 768px) {
            .puck-grid-${safeId} {
              grid-template-columns: ${mobileStack ? '1fr' : config.columns};
            }
          }
          /* Fallback media query for browsers without container query support */
          @supports not (container-type: inline-size) {
            @media (max-width: 768px) {
              .puck-grid-${safeId} {
                grid-template-columns: ${mobileStack ? '1fr' : config.columns};
              }
            }
          }
        `}</style>
        <div className={`puck-grid-container-${safeId}`}>
          <div className={`puck-grid-${safeId}`}>
            {dropZones}
          </div>
        </div>
      </>
    );
  },
};
