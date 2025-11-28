'use client';

import React, { useMemo } from 'react';
import { ComponentConfig } from '@measured/puck';
import { usePuckTokens } from '../brand-context';

type BackgroundColorType = 'background' | 'backgroundAlt' | 'primary' | 'secondary' | 'backgroundDark';

interface PricingCardProps {
  title: string;
  basePrice: number;
  currency: string;
  period: string;
  description?: string;
  features: string[];
  ctaText: string;
  ctaLink?: string;
  isHighlighted: boolean;
  highlightLabel?: string;
  variant: 'simple' | 'bordered' | 'gradient' | 'glass';
  backgroundColor: BackgroundColorType;
  // Kedvezmény - admin beállítás (nem frontend választó!)
  discountPercent: number;
}

export const PricingCardConfig: ComponentConfig<PricingCardProps> = {
  label: 'PricingCard',

  defaultProps: {
    title: 'Alap csomag',
    basePrice: 99000,
    currency: 'Ft',
    period: '/hó',
    description: 'Kezdő vállalkozásoknak ideális',
    features: [
      'Havi 10 kampány',
      'Email támogatás',
      'Alapvető analitika',
      'Korlátlan felhasználó',
    ],
    ctaText: 'Kezdés',
    ctaLink: '#',
    isHighlighted: false,
    highlightLabel: 'Népszerű',
    variant: 'bordered',
    backgroundColor: 'backgroundAlt',
    discountPercent: 0,
  },

  fields: {
    title: {
      type: 'text',
      label: 'Csomag neve',
    },
    basePrice: {
      type: 'number',
      label: 'Alap ár (szám)',
    },
    currency: {
      type: 'text',
      label: 'Pénznem',
    },
    period: {
      type: 'text',
      label: 'Időszak (pl. /hó)',
    },
    description: {
      type: 'textarea',
      label: 'Leírás',
    },
    features: {
      type: 'array',
      label: 'Funkciók',
      arrayFields: {
        type: 'text',
      },
      getItemSummary: (item) => item || 'Új funkció',
    },
    ctaText: {
      type: 'text',
      label: 'Gomb szöveg',
    },
    ctaLink: {
      type: 'text',
      label: 'Gomb link',
    },
    isHighlighted: {
      type: 'radio',
      label: 'Kiemelt csomag',
      options: [
        { label: 'Igen', value: true },
        { label: 'Nem', value: false },
      ],
    },
    highlightLabel: {
      type: 'text',
      label: 'Kiemelt címke (ha kiemelt)',
    },
    variant: {
      type: 'select',
      label: 'Változat',
      options: [
        { label: 'Egyszerű', value: 'simple' },
        { label: 'Keretes', value: 'bordered' },
        { label: 'Gradiens', value: 'gradient' },
        { label: 'Üveg hatás', value: 'glass' },
      ],
    },
    backgroundColor: {
      type: 'select',
      label: 'Háttérszín',
      options: [
        { label: 'Fehér', value: 'background' },
        { label: 'Világos szürke', value: 'backgroundAlt' },
        { label: 'Elsődleges (primary)', value: 'primary' },
        { label: 'Másodlagos (secondary)', value: 'secondary' },
        { label: 'Sötét', value: 'backgroundDark' },
      ],
    },
    discountPercent: {
      type: 'select',
      label: 'Kedvezmény (%)',
      options: [
        { label: 'Nincs kedvezmény', value: 0 },
        { label: '10% kedvezmény', value: 10 },
        { label: '15% kedvezmény', value: 15 },
        { label: '20% kedvezmény', value: 20 },
      ],
    },
  },

  render: ({
    title = 'Csomag',
    basePrice = 0,
    currency = 'Ft',
    period = '/hó',
    description,
    features = [],
    ctaText = 'Kiválasztom',
    ctaLink,
    isHighlighted = false,
    highlightLabel,
    variant = 'bordered',
    backgroundColor = 'backgroundAlt',
    discountPercent = 0,
  }) => {
    const tokens = usePuckTokens();

    // Kalkulált ár a kedvezménnyel (admin beállításból)
    const calculatedPrice = useMemo(() => {
      const discount = (discountPercent || 0) / 100;
      return Math.round(basePrice * (1 - discount));
    }, [basePrice, discountPercent]);

    // Megtakarítás összege
    const savingsAmount = useMemo(() => {
      return basePrice - calculatedPrice;
    }, [basePrice, calculatedPrice]);

    // Van-e kedvezmény? (Boolean konverzió fontos, mert 0 && ... a 0-t adja vissza, nem false-t)
    const hasDiscount = Boolean(discountPercent && discountPercent > 0);

    // Ár formázása
    const formatPrice = (price: number): string => {
      return price.toLocaleString('hu-HU');
    };

    // Háttérszín map a tokenekből
    const bgColorMap: Record<BackgroundColorType, string> = {
      background: tokens.colors.background,
      backgroundAlt: tokens.colors.backgroundAlt,
      primary: tokens.colors.primary,
      secondary: tokens.colors.secondary,
      backgroundDark: tokens.colors.backgroundDark,
    };

    // Szövegszín a háttér alapján (sötét háttéren világos szöveg)
    const isDarkBg = backgroundColor === 'primary' || backgroundColor === 'secondary' || backgroundColor === 'backgroundDark';
    const textColor = isDarkBg ? tokens.colors.textLight : tokens.colors.text;
    const mutedColor = isDarkBg ? 'rgba(255,255,255,0.7)' : tokens.colors.muted;

    const getContainerStyles = (): React.CSSProperties => {
      const base: React.CSSProperties = {
        fontFamily: tokens.fonts.body,
        padding: tokens.spacing.lg,
        borderRadius: tokens.borderRadius.lg,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        color: textColor,
      };

      const bgColor = bgColorMap[backgroundColor] || tokens.colors.backgroundAlt;

      switch (variant) {
        case 'simple':
          return {
            ...base,
            backgroundColor: bgColor,
          };
        case 'bordered':
          return {
            ...base,
            backgroundColor: bgColor,
            border: isHighlighted
              ? `2px solid ${tokens.colors.primary}`
              : `1px solid ${tokens.colors.border}`,
            boxShadow: isHighlighted ? tokens.shadows.large : tokens.shadows.subtle,
          };
        case 'gradient':
          return {
            ...base,
            background: isHighlighted
              ? `linear-gradient(135deg, ${tokens.colors.primary}15 0%, ${tokens.colors.secondary}15 100%)`
              : bgColor,
            border: `1px solid ${isHighlighted ? tokens.colors.primary : tokens.colors.border}`,
          };
        case 'glass':
          return {
            ...base,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: `1px solid rgba(255, 255, 255, 0.2)`,
            boxShadow: tokens.shadows.medium,
          };
        default:
          return base;
      }
    };

    const getHighlightBadgeStyles = (): React.CSSProperties => ({
      position: 'absolute',
      top: '-1px',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: tokens.colors.background,
      color: tokens.colors.primary,
      padding: `${tokens.spacing.xs} ${tokens.spacing.md}`,
      border: `${tokens.borderWidth.medium} solid ${tokens.colors.primary}`,
      borderRadius: tokens.borderRadius.pill,
      fontSize: tokens.typography.caption.size,
      fontWeight: '600',
      whiteSpace: 'nowrap',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
    });

    const getPriceStyles = (): React.CSSProperties => ({
      fontSize: tokens.typography.h2.size,
      fontWeight: tokens.typography.h2.weight,
      lineHeight: tokens.typography.h2.lineHeight,
      fontFamily: tokens.fonts.heading,
      color: isHighlighted ? tokens.colors.primary : tokens.typography.h2.color,
      margin: 0,
    });

    const getButtonStyles = (): React.CSSProperties => {
      if (isHighlighted) {
        return {
          ...tokens.button.primary,
          width: '100%',
          padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
          cursor: 'pointer',
          fontSize: tokens.typography.body.size,
          fontWeight: '600',
          textDecoration: 'none',
          display: 'inline-block',
          textAlign: 'center',
          border: 'none',
        };
      }
      return {
        ...tokens.button.outline,
        width: '100%',
        padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
        cursor: 'pointer',
        fontSize: tokens.typography.body.size,
        fontWeight: '600',
        textDecoration: 'none',
        display: 'inline-block',
        textAlign: 'center',
      };
    };

    return (
      <div style={getContainerStyles()}>
        {/* Highlight Badge */}
        {isHighlighted && highlightLabel && (
          <div style={getHighlightBadgeStyles()}>{highlightLabel}</div>
        )}

        {/* Header */}
        <div style={{ marginBottom: tokens.spacing.md, paddingTop: isHighlighted ? tokens.spacing.sm : 0, textAlign: 'center' }}>
          <h3
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
          </h3>

          {description && (
            <p
              style={{
                fontSize: tokens.typography.bodySmall.size,
                color: mutedColor,
                margin: 0,
              }}
            >
              {description}
            </p>
          )}
        </div>

        {/* Price */}
        <div style={{ marginBottom: tokens.spacing.md, textAlign: 'center' }}>
          {/* Eredeti ár áthúzva, ha van kedvezmény */}
          {hasDiscount && (
            <div
              style={{
                fontSize: tokens.typography.body.size,
                color: mutedColor,
                textDecoration: 'line-through',
                marginBottom: '4px',
              }}
            >
              {formatPrice(basePrice)} {currency}
            </div>
          )}

          {/* Aktuális/kedvezményes ár nagyban */}
          <div style={{ textAlign: 'center' }}>
            <div style={{
              ...getPriceStyles(),
              fontSize: hasDiscount ? tokens.typography.h1.size : tokens.typography.h2.size,
              color: hasDiscount ? tokens.colors.primary : (isHighlighted ? tokens.colors.primary : tokens.typography.h2.color),
            }}>
              {calculatedPrice > 0 ? `${formatPrice(calculatedPrice)} ${currency}` : 'Egyedi ár'}
            </div>
            {calculatedPrice > 0 && (
              <div
                style={{
                  fontSize: tokens.typography.body.size,
                  color: mutedColor,
                  marginTop: tokens.spacing.xs,
                }}
              >
                {period}
              </div>
            )}
          </div>

          {/* Megtakarítás badge - csak ha van tényleges kedvezmény */}
          {hasDiscount && (
            <div
              style={{
                marginTop: tokens.spacing.sm,
                padding: `${tokens.spacing.xs} ${tokens.spacing.sm}`,
                backgroundColor: `${tokens.colors.primary}15`,
                borderRadius: tokens.borderRadius.sm,
                display: 'inline-block',
              }}
            >
              <span
                style={{
                  fontSize: tokens.typography.caption.size,
                  color: tokens.colors.primary,
                  fontWeight: '600',
                }}
              >
                🎉 {discountPercent}% kedvezmény - Megtakarítás: {formatPrice(savingsAmount)} {currency}
              </span>
            </div>
          )}
        </div>

        {/* Features */}
        <ul
          style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            marginBottom: tokens.spacing.lg,
            flex: 1,
          }}
        >
          {features.map((feature, index) => (
            <li
              key={index}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: tokens.spacing.sm,
                marginBottom: tokens.spacing.sm,
                fontSize: tokens.typography.body.size,
                color: textColor,
              }}
            >
              <span
                style={{
                  color: tokens.colors.primary,
                  fontWeight: '600',
                  flexShrink: 0,
                }}
              >
                ✓
              </span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        {/* CTA Button */}
        {ctaLink ? (
          <a href={ctaLink} style={getButtonStyles()}>
            {ctaText}
          </a>
        ) : (
          <button style={getButtonStyles()}>{ctaText}</button>
        )}
      </div>
    );
  },
};
