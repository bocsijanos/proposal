'use client';

import React from 'react';
import { ComponentConfig } from '@measured/puck';
import { usePuckTokens } from '../brand-context';

interface TimelineStepProps {
  stepNumber: number;
  title: string;
  description?: string;
  icon?: string;
  duration?: string;
  variant: 'numbered' | 'icon' | 'dot' | 'check';
  alignment: 'left' | 'center' | 'alternate';
  isLast: boolean;
  isCompleted: boolean;
}

export const TimelineStepConfig: ComponentConfig<TimelineStepProps> = {
  label: 'TimelineStep',

  defaultProps: {
    stepNumber: 1,
    title: 'Lépés címe',
    description: 'A lépés részletes leírása itt jelenik meg.',
    icon: '🚀',
    duration: '1-2 hét',
    variant: 'numbered',
    alignment: 'left',
    isLast: false,
    isCompleted: false,
  },

  fields: {
    stepNumber: {
      type: 'number',
      label: 'Lépés száma',
    },
    title: {
      type: 'text',
      label: 'Cím',
    },
    description: {
      type: 'textarea',
      label: 'Leírás',
    },
    icon: {
      type: 'text',
      label: 'Ikon (emoji)',
    },
    duration: {
      type: 'text',
      label: 'Időtartam',
    },
    variant: {
      type: 'select',
      label: 'Változat',
      options: [
        { label: 'Számozott', value: 'numbered' },
        { label: 'Ikon', value: 'icon' },
        { label: 'Pont', value: 'dot' },
        { label: 'Pipa', value: 'check' },
      ],
    },
    alignment: {
      type: 'radio',
      label: 'Igazítás',
      options: [
        { label: 'Balra', value: 'left' },
        { label: 'Középre', value: 'center' },
        { label: 'Váltakozó', value: 'alternate' },
      ],
    },
    isLast: {
      type: 'radio',
      label: 'Utolsó elem',
      options: [
        { label: 'Igen', value: true },
        { label: 'Nem', value: false },
      ],
    },
    isCompleted: {
      type: 'radio',
      label: 'Befejezett',
      options: [
        { label: 'Igen', value: true },
        { label: 'Nem', value: false },
      ],
    },
  },

  render: ({
    stepNumber = 1,
    title = '',
    description,
    icon = '🚀',
    duration,
    variant = 'numbered',
    alignment = 'left',
    isLast = false,
    isCompleted = false,
  }) => {
    const tokens = usePuckTokens();

    // Indikátor (szám/ikon/pont/pipa) stílusai
    const getIndicatorStyles = (): React.CSSProperties => {
      const base: React.CSSProperties = {
        width: tokens.sizing.indicatorMd,
        height: tokens.sizing.indicatorMd,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        fontFamily: tokens.fonts.heading,
        fontWeight: '700',
        fontSize: variant === 'numbered' ? tokens.typography.body.size : tokens.sizing.iconSm,
        transition: 'all 0.3s ease',
        zIndex: 1,
      };

      if (isCompleted) {
        return {
          ...base,
          backgroundColor: tokens.colors.primary,
          color: tokens.colors.textLight,
        };
      }

      return {
        ...base,
        backgroundColor: `${tokens.colors.primary}15`,
        color: tokens.colors.primary,
        border: `${tokens.borderWidth.medium} solid ${tokens.colors.primary}`,
      };
    };

    // Vonal a lépések között
    const getLineStyles = (): React.CSSProperties => ({
      position: 'absolute',
      left: `calc(${tokens.sizing.indicatorMd} / 2 - ${tokens.borderWidth.thin})`,
      top: tokens.sizing.indicatorMd,
      width: tokens.borderWidth.medium,
      height: `calc(100% - ${tokens.sizing.indicatorMd})`,
      backgroundColor: isCompleted ? tokens.colors.primary : tokens.colors.border,
      transition: 'background-color 0.3s ease',
    });

    // Tartalom stílusai
    const getContentStyles = (): React.CSSProperties => ({
      flex: 1,
      paddingLeft: alignment === 'center' ? 0 : tokens.spacing.md,
      paddingTop: alignment === 'center' ? tokens.spacing.md : 0,
      textAlign: alignment === 'center' ? 'center' : 'left',
    });

    // Container stílusai
    const getContainerStyles = (): React.CSSProperties => {
      const base: React.CSSProperties = {
        position: 'relative',
        fontFamily: tokens.fonts.body,
        paddingBottom: isLast ? 0 : tokens.spacing.xl,
      };

      if (alignment === 'center') {
        return {
          ...base,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        };
      }

      return {
        ...base,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
      };
    };

    // Indikátor tartalom
    const getIndicatorContent = () => {
      if (isCompleted && variant !== 'check') {
        return '✓';
      }

      switch (variant) {
        case 'numbered':
          return stepNumber;
        case 'icon':
          return icon || '⭐';
        case 'dot':
          return '';
        case 'check':
          return isCompleted ? '✓' : stepNumber;
        default:
          return stepNumber;
      }
    };

    return (
      <div style={getContainerStyles()}>
        {/* Indikátor */}
        <div style={getIndicatorStyles()}>
          {getIndicatorContent()}
        </div>

        {/* Összekötő vonal (ha nem utolsó és nem center) */}
        {!isLast && alignment !== 'center' && (
          <div style={getLineStyles()} />
        )}

        {/* Tartalom */}
        <div style={getContentStyles()}>
          {/* Cím */}
          <h4
            style={{
              fontSize: tokens.typography.h5.size,
              fontWeight: tokens.typography.h5.weight,
              lineHeight: tokens.typography.h5.lineHeight,
              fontFamily: tokens.fonts.heading,
              color: tokens.typography.h5.color,
              margin: 0,
              marginBottom: tokens.spacing.xs,
            }}
          >
            {title}
          </h4>

          {/* Időtartam badge */}
          {duration && (
            <span
              style={{
                display: 'inline-block',
                padding: `${tokens.spacing.xs} ${tokens.spacing.sm}`,
                backgroundColor: `${tokens.colors.secondary}15`,
                color: tokens.colors.secondary,
                borderRadius: tokens.borderRadius.pill,
                fontSize: tokens.typography.caption.size,
                fontWeight: '500',
                marginBottom: tokens.spacing.sm,
              }}
            >
              ⏱ {duration}
            </span>
          )}

          {/* Leírás */}
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
    );
  },
};
