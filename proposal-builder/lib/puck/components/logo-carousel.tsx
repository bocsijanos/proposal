'use client';

import React from 'react';
import { ComponentConfig } from '@measured/puck';
import { usePuckTokens } from '../brand-context';
import { createImagePickerField } from '../custom-fields';

interface LogoItem {
  src: string;
  alt: string;
}

interface LogoCarouselProps {
  title?: string;
  showTitle: boolean;
  logos: LogoItem[];
  speed: 'slow' | 'medium' | 'fast';
  direction: 'left' | 'right';
  pauseOnHover: boolean;
  logoHeight: 'small' | 'medium' | 'large';
  gap: 'small' | 'medium' | 'large';
  grayscale: boolean;
  backgroundColor: 'transparent' | 'light' | 'dark';
  paddingY: 'none' | 'small' | 'medium' | 'large';
}

// Unique ID generator for keyframes
let carouselId = 0;
const getCarouselId = () => `logo-carousel-${++carouselId}`;

export const LogoCarouselConfig: ComponentConfig<LogoCarouselProps> = {
  label: 'Logó forgató',

  defaultProps: {
    title: 'Partnereink',
    showTitle: true,
    logos: [
      { src: '', alt: 'Partner 1' },
      { src: '', alt: 'Partner 2' },
      { src: '', alt: 'Partner 3' },
      { src: '', alt: 'Partner 4' },
      { src: '', alt: 'Partner 5' },
    ],
    speed: 'medium',
    direction: 'left',
    pauseOnHover: true,
    logoHeight: 'medium',
    gap: 'medium',
    grayscale: false,
    backgroundColor: 'transparent',
    paddingY: 'medium',
  },

  fields: {
    title: {
      type: 'text',
      label: 'Cím',
    },
    showTitle: {
      type: 'radio',
      label: 'Cím megjelenítése',
      options: [
        { label: 'Igen', value: true },
        { label: 'Nem', value: false },
      ],
    },
    logos: {
      type: 'array',
      label: 'Logók',
      getItemSummary: (item: LogoItem, index) => item.alt || `Logó ${(index || 0) + 1}`,
      arrayFields: {
        src: {
          ...(createImagePickerField() as any),
          label: 'Logó kép',
        },
        alt: {
          type: 'text',
          label: 'Cég neve (alt szöveg)',
        },
      },
    },
    speed: {
      type: 'radio',
      label: 'Sebesség',
      options: [
        { label: '🐢 Lassú', value: 'slow' },
        { label: '🚶 Közepes', value: 'medium' },
        { label: '🏃 Gyors', value: 'fast' },
      ],
    },
    direction: {
      type: 'radio',
      label: 'Irány',
      options: [
        { label: '← Balra', value: 'left' },
        { label: '→ Jobbra', value: 'right' },
      ],
    },
    pauseOnHover: {
      type: 'radio',
      label: 'Megáll hover-nél',
      options: [
        { label: 'Igen', value: true },
        { label: 'Nem', value: false },
      ],
    },
    logoHeight: {
      type: 'radio',
      label: 'Logó méret',
      options: [
        { label: 'Kicsi', value: 'small' },
        { label: 'Közepes', value: 'medium' },
        { label: 'Nagy', value: 'large' },
      ],
    },
    gap: {
      type: 'radio',
      label: 'Térköz',
      options: [
        { label: 'Kicsi', value: 'small' },
        { label: 'Közepes', value: 'medium' },
        { label: 'Nagy', value: 'large' },
      ],
    },
    grayscale: {
      type: 'radio',
      label: 'Szürkeárnyalatos',
      options: [
        { label: 'Színes', value: false },
        { label: 'Szürke', value: true },
      ],
    },
    backgroundColor: {
      type: 'radio',
      label: 'Háttér',
      options: [
        { label: 'Átlátszó', value: 'transparent' },
        { label: 'Világos', value: 'light' },
        { label: 'Sötét', value: 'dark' },
      ],
    },
    paddingY: {
      type: 'radio',
      label: 'Függőleges térköz',
      options: [
        { label: 'Nincs', value: 'none' },
        { label: 'Kicsi', value: 'small' },
        { label: 'Közepes', value: 'medium' },
        { label: 'Nagy', value: 'large' },
      ],
    },
  },

  render: ({
    title,
    showTitle,
    logos,
    speed,
    direction,
    pauseOnHover,
    logoHeight,
    gap,
    grayscale,
    backgroundColor,
    paddingY,
  }) => {
    const tokens = usePuckTokens();
    const carouselIdRef = React.useRef(getCarouselId());
    const animationName = carouselIdRef.current;

    // Filter out logos without src
    const validLogos = logos.filter(logo => logo.src);

    // Need at least 2 logos for the carousel effect
    if (validLogos.length < 2) {
      return (
        <div
          style={{
            width: '100%',
            padding: tokens.spacing.xl,
            textAlign: 'center',
            color: tokens.colors.muted,
            background: tokens.colors.backgroundAlt,
            borderRadius: tokens.borderRadius.md,
          }}
        >
          Adj hozzá legalább 2 logót a forgató működéséhez
        </div>
      );
    }

    // Speed mapping (animation duration in seconds)
    const speedMap = {
      slow: 40,
      medium: 25,
      fast: 15,
    };

    // Logo height mapping
    const heightMap = {
      small: '40px',
      medium: '60px',
      large: '80px',
    };

    // Gap mapping
    const gapMap = {
      small: tokens.spacing.lg,
      medium: tokens.spacing.xl,
      large: tokens.spacing['2xl'],
    };

    // Padding mapping
    const paddingMap = {
      none: '0',
      small: tokens.spacing.md,
      medium: tokens.spacing.xl,
      large: tokens.spacing['2xl'],
    };

    // Background color mapping
    const bgMap = {
      transparent: 'transparent',
      light: tokens.colors.backgroundAlt,
      dark: tokens.colors.backgroundDark,
    };

    // Text color for title based on background
    const textColor = backgroundColor === 'dark' ? tokens.colors.textLight : tokens.colors.text;

    const animationDuration = `${speedMap[speed]}s`;
    const logoHeightValue = heightMap[logoHeight];
    const gapValue = gapMap[gap];
    const paddingValue = paddingMap[paddingY];
    const bgColor = bgMap[backgroundColor];

    // Double the logos array for seamless infinite scroll
    const displayLogos = [...validLogos, ...validLogos];

    return (
      <div
        style={{
          width: '100vw',
          marginLeft: 'calc(-50vw + 50%)',
          background: bgColor,
          paddingTop: paddingValue,
          paddingBottom: paddingValue,
          overflow: 'hidden',
        }}
      >
        {/* Title */}
        {showTitle && title && (
          <h3
            style={{
              textAlign: 'center',
              fontSize: tokens.typography.h4.size,
              fontWeight: tokens.typography.h4.weight,
              color: textColor,
              marginBottom: tokens.spacing.lg,
              fontFamily: tokens.fonts.heading,
              padding: `0 ${tokens.spacing.lg}`,
            }}
          >
            {title}
          </h3>
        )}

        {/* Carousel container */}
        <div
          className={pauseOnHover ? 'logo-carousel-hover' : undefined}
          style={{
            width: '100%',
            overflow: 'hidden',
            maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
          }}
        >
          {/* Scrolling track */}
          <div
            style={{
              display: 'flex',
              gap: gapValue,
              width: 'max-content',
              animation: `${animationName} ${animationDuration} linear infinite`,
              animationDirection: direction === 'right' ? 'reverse' : 'normal',
            }}
          >
            {displayLogos.map((logo, index) => (
              <div
                key={`${logo.src}-${index}`}
                style={{
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: logoHeightValue,
                  padding: `0 ${tokens.spacing.sm}`,
                }}
              >
                <img
                  src={logo.src}
                  alt={logo.alt}
                  style={{
                    height: '100%',
                    width: 'auto',
                    maxWidth: '180px',
                    objectFit: 'contain',
                    filter: grayscale ? 'grayscale(100%)' : 'none',
                    opacity: grayscale ? 0.7 : 1,
                    transition: 'filter 0.3s, opacity 0.3s',
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* CSS Keyframes */}
        <style>{`
          @keyframes ${animationName} {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }

          .logo-carousel-hover:hover > div {
            animation-play-state: paused;
          }

          .logo-carousel-hover img:hover {
            filter: grayscale(0%) !important;
            opacity: 1 !important;
          }
        `}</style>
      </div>
    );
  },
};
