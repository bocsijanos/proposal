'use client';

import React from 'react';
import { ComponentConfig } from '@measured/puck';
import { usePuckTokens } from '../brand-context';
import { createImagePickerField } from '../custom-fields';

interface TestimonialItem {
  quote: string;
  authorName: string;
  companyName?: string;
  authorImage?: string;
}

interface TestimonialCarouselProps {
  title?: string;
  showTitle: boolean;
  testimonials: TestimonialItem[];
  speed: 'slow' | 'medium' | 'fast';
  direction: 'left' | 'right';
  pauseOnHover: boolean;
  cardWidth: 'small' | 'medium' | 'large';
  gap: 'small' | 'medium' | 'large';
  backgroundColor: 'transparent' | 'light' | 'dark';
  cardStyle: 'minimal' | 'bordered' | 'elevated';
  showQuoteIcon: boolean;
  paddingY: 'none' | 'small' | 'medium' | 'large';
}

// Unique ID generator for keyframes
let carouselId = 0;
const getCarouselId = () => `testimonial-carousel-${++carouselId}`;

export const TestimonialCarouselConfig: ComponentConfig<TestimonialCarouselProps> = {
  label: 'Vélemény forgató',

  defaultProps: {
    title: 'Mit mondanak rólunk?',
    showTitle: true,
    testimonials: [
      {
        quote: 'Kiváló munkát végeztek, nagyon elégedett vagyok az eredménnyel!',
        authorName: 'Kovács Péter',
        companyName: 'ABC Kft.',
        authorImage: '',
      },
      {
        quote: 'Professzionális csapat, akik értik a dolgukat.',
        authorName: 'Nagy Anna',
        companyName: 'XYZ Zrt.',
        authorImage: '',
      },
      {
        quote: 'Már több éve együtt dolgozunk és minden projekttel elégedettek voltunk.',
        authorName: 'Szabó János',
        companyName: '',
        authorImage: '',
      },
    ],
    speed: 'slow',
    direction: 'left',
    pauseOnHover: true,
    cardWidth: 'medium',
    gap: 'medium',
    backgroundColor: 'transparent',
    cardStyle: 'elevated',
    showQuoteIcon: true,
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
    testimonials: {
      type: 'array',
      label: 'Vélemények',
      getItemSummary: (item: TestimonialItem, index) =>
        item.authorName || `Vélemény ${(index || 0) + 1}`,
      arrayFields: {
        quote: {
          type: 'textarea',
          label: 'Vélemény szövege',
        },
        authorName: {
          type: 'text',
          label: 'Vélemény mondója',
        },
        companyName: {
          type: 'text',
          label: 'Cég neve (opcionális)',
        },
        authorImage: {
          ...(createImagePickerField() as any),
          label: 'Kép (opcionális)',
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
    cardWidth: {
      type: 'radio',
      label: 'Kártya szélesség',
      options: [
        { label: 'Keskeny', value: 'small' },
        { label: 'Közepes', value: 'medium' },
        { label: 'Széles', value: 'large' },
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
    cardStyle: {
      type: 'radio',
      label: 'Kártya stílus',
      options: [
        { label: 'Minimál', value: 'minimal' },
        { label: 'Keretes', value: 'bordered' },
        { label: 'Árnyékos', value: 'elevated' },
      ],
    },
    showQuoteIcon: {
      type: 'radio',
      label: 'Idézőjel ikon',
      options: [
        { label: 'Igen', value: true },
        { label: 'Nem', value: false },
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
    testimonials,
    speed,
    direction,
    pauseOnHover,
    cardWidth,
    gap,
    backgroundColor,
    cardStyle,
    showQuoteIcon,
    paddingY,
  }) => {
    const tokens = usePuckTokens();
    const carouselIdRef = React.useRef(getCarouselId());
    const animationName = carouselIdRef.current;

    // Handle single testimonial case - show centered without animation
    if (testimonials.length === 1) {
      const testimonial = testimonials[0];
      const isDark = backgroundColor === 'dark';
      const textColor = isDark ? tokens.colors.textLight : tokens.colors.text;
      const mutedColor = isDark ? 'rgba(255,255,255,0.7)' : tokens.colors.muted;

      // Background color mapping
      const bgMap = {
        transparent: 'transparent',
        light: tokens.colors.backgroundAlt,
        dark: tokens.colors.backgroundDark,
      };

      // Padding mapping
      const paddingMap = {
        none: '0',
        small: tokens.spacing.md,
        medium: tokens.spacing.xl,
        large: tokens.spacing['2xl'],
      };

      return (
        <div
          style={{
            width: '100vw',
            marginLeft: 'calc(-50vw + 50%)',
            background: bgMap[backgroundColor],
            paddingTop: paddingMap[paddingY],
            paddingBottom: paddingMap[paddingY],
          }}
        >
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
          <div
            style={{
              maxWidth: '700px',
              margin: '0 auto',
              padding: `0 ${tokens.spacing.lg}`,
            }}
          >
            <TestimonialCard
              testimonial={testimonial}
              tokens={tokens}
              cardStyle={cardStyle}
              showQuoteIcon={showQuoteIcon}
              isDark={isDark}
              textColor={textColor}
              mutedColor={mutedColor}
            />
          </div>
        </div>
      );
    }

    // Need at least 2 testimonials for carousel effect
    if (testimonials.length < 2) {
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
          Adj hozzá legalább 1 véleményt a működéshez
        </div>
      );
    }

    // Speed mapping (animation duration in seconds)
    const speedMap = {
      slow: 60,
      medium: 40,
      fast: 25,
    };

    // Card width mapping
    const widthMap = {
      small: '320px',
      medium: '420px',
      large: '520px',
    };

    // Gap mapping
    const gapMap = {
      small: tokens.spacing.md,
      medium: tokens.spacing.lg,
      large: tokens.spacing.xl,
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

    const isDark = backgroundColor === 'dark';
    const textColor = isDark ? tokens.colors.textLight : tokens.colors.text;
    const mutedColor = isDark ? 'rgba(255,255,255,0.7)' : tokens.colors.muted;

    const animationDuration = `${speedMap[speed]}s`;
    const cardWidthValue = widthMap[cardWidth];
    const gapValue = gapMap[gap];
    const paddingValue = paddingMap[paddingY];
    const bgColor = bgMap[backgroundColor];

    // Double the testimonials array for seamless infinite scroll
    const displayTestimonials = [...testimonials, ...testimonials];

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
          className={pauseOnHover ? 'testimonial-carousel-hover' : undefined}
          style={{
            width: '100%',
            overflow: 'hidden',
            maskImage:
              'linear-gradient(to right, transparent, black 5%, black 95%, transparent)',
            WebkitMaskImage:
              'linear-gradient(to right, transparent, black 5%, black 95%, transparent)',
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
            {displayTestimonials.map((testimonial, index) => (
              <div
                key={`${testimonial.authorName}-${index}`}
                style={{
                  flexShrink: 0,
                  width: cardWidthValue,
                }}
              >
                <TestimonialCard
                  testimonial={testimonial}
                  tokens={tokens}
                  cardStyle={cardStyle}
                  showQuoteIcon={showQuoteIcon}
                  isDark={isDark}
                  textColor={textColor}
                  mutedColor={mutedColor}
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

          .testimonial-carousel-hover:hover > div {
            animation-play-state: paused;
          }
        `}</style>
      </div>
    );
  },
};

// Separate card component for cleaner code
interface TestimonialCardProps {
  testimonial: TestimonialItem;
  tokens: ReturnType<typeof usePuckTokens>;
  cardStyle: 'minimal' | 'bordered' | 'elevated';
  showQuoteIcon: boolean;
  isDark: boolean;
  textColor: string;
  mutedColor: string;
}

function TestimonialCard({
  testimonial,
  tokens,
  cardStyle,
  showQuoteIcon,
  isDark,
  textColor,
  mutedColor,
}: TestimonialCardProps) {
  const getCardStyles = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      padding: tokens.spacing.lg,
      borderRadius: tokens.borderRadius.lg,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: isDark ? 'rgba(255,255,255,0.05)' : tokens.colors.background,
    };

    switch (cardStyle) {
      case 'minimal':
        return {
          ...base,
          background: 'transparent',
          padding: tokens.spacing.md,
        };
      case 'bordered':
        return {
          ...base,
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : tokens.colors.border}`,
        };
      case 'elevated':
        return {
          ...base,
          boxShadow: isDark
            ? '0 4px 20px rgba(0,0,0,0.3)'
            : '0 4px 20px rgba(0,0,0,0.08)',
        };
      default:
        return base;
    }
  };

  return (
    <div style={getCardStyles()}>
      {/* Quote icon */}
      {showQuoteIcon && (
        <div
          style={{
            fontSize: '2.5rem',
            lineHeight: 1,
            color: tokens.colors.primary,
            marginBottom: tokens.spacing.sm,
            opacity: 0.6,
            fontFamily: 'Georgia, serif',
          }}
        >
          "
        </div>
      )}

      {/* Quote text */}
      <p
        style={{
          fontSize: tokens.typography.body.size,
          lineHeight: 1.6,
          color: textColor,
          fontFamily: tokens.fonts.body,
          flex: 1,
          margin: 0,
          marginBottom: tokens.spacing.md,
        }}
      >
        {testimonial.quote}
      </p>

      {/* Author info */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: tokens.spacing.sm,
          marginTop: 'auto',
        }}
      >
        {/* Author image */}
        {testimonial.authorImage && (
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              overflow: 'hidden',
              flexShrink: 0,
            }}
          >
            <img
              src={testimonial.authorImage}
              alt={testimonial.authorName}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </div>
        )}

        {/* Author name and company */}
        <div>
          <div
            style={{
              fontWeight: 600,
              fontSize: tokens.typography.small.size,
              color: textColor,
              fontFamily: tokens.fonts.body,
            }}
          >
            {testimonial.authorName}
          </div>
          {testimonial.companyName && (
            <div
              style={{
                fontSize: tokens.typography.small.size,
                color: mutedColor,
                fontFamily: tokens.fonts.body,
              }}
            >
              {testimonial.companyName}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
