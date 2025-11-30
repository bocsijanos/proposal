'use client';

import React, { useState } from 'react';
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
  gap: 'small' | 'medium' | 'large';
  backgroundColor: 'transparent' | 'light' | 'dark';
  cardStyle: 'minimal' | 'bordered' | 'elevated';
  showQuoteIcon: boolean;
  paddingY: 'none' | 'small' | 'medium' | 'large';
}

export const TestimonialCarouselConfig: ComponentConfig<TestimonialCarouselProps> = {
  label: 'Vélemény forgató',

  defaultProps: {
    title: 'Mit mondanak rólunk?',
    showTitle: true,
    testimonials: [
      {
        quote: '...100%-ban elégedett vagyok a munkájukkal, hozzáállásukkal és rugalmasságukkal. A webáruházamhoz készítettek hírlevél automatizmust (Szövegírás, tartalomgyártás, folyamatok felépítése, időzítés...). Egyetlen egy dolgot nagyon bánok, hogy nem vezettem be hamarabb általuk, hiszen az első hónapban a hírlevelérendszer visszatermelte a fejlesztésnek a teljes munkadíját.',
        authorName: 'Bogár Márk',
        companyName: 'CHILIFARM.HU',
        authorImage: '',
      },
      {
        quote: 'Működik! Köszönöm, hogy ennek a tudásnak is a segítségével eljuttathatom még szélesebb körben a gondolataim. Hogy segít a missziómban és ha most ez a felület van fellendülőben, akkor ezt tanulom meg, mert a cél változatlan, csak az út alakulhat. Köszönöm ehhez az úthoz a kis térképet.',
        authorName: 'Mosolyka Hozleiter Fanny',
        companyName: 'Lelkierő növelő, bestseller író és a Majd helyett MOST film egyik megálmodója',
        authorImage: '',
      },
      {
        quote: 'Már induláskor láttuk, hogy egy olyan csapatra van szükségünk a marketing területén, mint a BOOM Marketing. A közös munka ráébresztett arra, hogy amit mi eddig marketingnek neveztünk az mindössze kuruzslás volt. A csapat profi abban, amit csinál. Hamar jöttek az eredmények, az új ügyfelek és ez segített abban, hogy lépésről lépésre tudjunk nőni.',
        authorName: 'Nagy Bence',
        companyName: 'WPVIKING KFT.',
        authorImage: '',
      },
      {
        quote: 'Balogh Dáviddal az alapjaitól gondoltuk újra vállalkozásom marketing stratégiáját. Segítségével pontosan meghatároztuk az ideális vásárlómat, amely alapján sikerült több visszautasíthatatlan ajánlatot is kitalálnunk B2B és B2C piacon egyaránt.',
        authorName: 'Hartenstein Péter',
        companyName: 'HARTENSTEIN MEDIA',
        authorImage: '',
      },
      {
        quote: 'Több éve ápolunk szakmai kapcsolatot a céggel, teljes mértékben elégedettek vagyunk a szolgáltatásaikkal. Az összes marketing kurzust elvégeztük ami náluk megtalálható és bármilyen kérdés merült fel rögtön segítettek számunkra, szakmailag kifogástalan, precíz munkavégzés jellemző az egész csapatukra...',
        authorName: 'Varga Márk',
        companyName: 'NEWBRAND.HU',
        authorImage: '',
      },
      {
        quote: 'Dávidékat az EasyBusiness projekt marketing stratégiájának megtervezésére és kivitelezésére kértem fel. Ennek már egy éve, azóta pedig közös erővel több terméket is sikeresen piacra dobtunk. Nagyon örülök, hogy végül őket választottam, mert tényleg úgy dolgoznak a projekteken, mintha a sajátjuk lenne.',
        authorName: 'BANELLI ÉVA',
        companyName: 'EASYBUSINESS BY EY',
        authorImage: '',
      },
      {
        quote: 'Végtelenül hálás vagyok Neked, mert kedves vagy, rugalmas, és az extra ötleteimet, kívánságaimat is kiválóan kezeled. Szeretek tőled vásárolni és tanulni! Amit korábban vettem meg, abból is van a mai napig használatban lévő elem a hirdetéseimnél (és lesz is a jövőben), és biztos vagyok benne, hogy azokban is kiváló dolgokat fogok találni, amely anyagaidat most fogom feldolgozni!',
        authorName: 'Kovácsné Balogh Bea',
        companyName: '',
        authorImage: '',
      },
    ],
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
    gap,
    backgroundColor,
    cardStyle,
    showQuoteIcon,
    paddingY,
  }) => {
    const tokens = usePuckTokens();
    const [currentPage, setCurrentPage] = useState(0);

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
    const gapValue = gapMap[gap];
    const paddingValue = paddingMap[paddingY];
    const bgColor = bgMap[backgroundColor];

    // Calculate pages (2 items per page on desktop, 1 on mobile)
    const itemsPerPage = 2;
    const totalPages = Math.ceil(testimonials.length / itemsPerPage);

    // Handle single testimonial case - show centered
    if (testimonials.length === 1) {
      const testimonial = testimonials[0];
      return (
        <div
          style={{
            width: '100vw',
            marginLeft: 'calc(-50vw + 50%)',
            background: bgColor,
            paddingTop: paddingValue,
            paddingBottom: paddingValue,
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

    // No testimonials
    if (testimonials.length < 1) {
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

    // Get current page testimonials
    const startIdx = currentPage * itemsPerPage;
    const currentTestimonials = testimonials.slice(startIdx, startIdx + itemsPerPage);

    const goToPrev = () => {
      setCurrentPage((prev) => (prev === 0 ? totalPages - 1 : prev - 1));
    };

    const goToNext = () => {
      setCurrentPage((prev) => (prev === totalPages - 1 ? 0 : prev + 1));
    };

    return (
      <div
        style={{
          width: '100vw',
          marginLeft: 'calc(-50vw + 50%)',
          background: bgColor,
          paddingTop: paddingValue,
          paddingBottom: paddingValue,
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
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: `0 ${tokens.spacing.xl}`,
            position: 'relative',
          }}
        >
          {/* Navigation arrows - desktop */}
          {totalPages > 1 && (
            <>
              <button
                onClick={goToPrev}
                style={{
                  position: 'absolute',
                  left: '0',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  border: 'none',
                  background: isDark ? 'rgba(255,255,255,0.1)' : tokens.colors.background,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 10,
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = isDark
                    ? 'rgba(255,255,255,0.2)'
                    : tokens.colors.backgroundAlt;
                  e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = isDark
                    ? 'rgba(255,255,255,0.1)'
                    : tokens.colors.background;
                  e.currentTarget.style.transform = 'translateY(-50%)';
                }}
                aria-label="Előző"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={textColor}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>

              <button
                onClick={goToNext}
                style={{
                  position: 'absolute',
                  right: '0',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  border: 'none',
                  background: isDark ? 'rgba(255,255,255,0.1)' : tokens.colors.background,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 10,
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = isDark
                    ? 'rgba(255,255,255,0.2)'
                    : tokens.colors.backgroundAlt;
                  e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = isDark
                    ? 'rgba(255,255,255,0.1)'
                    : tokens.colors.background;
                  e.currentTarget.style.transform = 'translateY(-50%)';
                }}
                aria-label="Következő"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={textColor}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </>
          )}

          {/* Cards grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: gapValue,
              padding: '0 60px',
            }}
          >
            {currentTestimonials.map((testimonial, index) => (
              <div key={`${testimonial.authorName}-${startIdx + index}`}>
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

          {/* Page indicators */}
          {totalPages > 1 && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: tokens.spacing.sm,
                marginTop: tokens.spacing.lg,
              }}
            >
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx)}
                  style={{
                    width: currentPage === idx ? '24px' : '8px',
                    height: '8px',
                    borderRadius: '4px',
                    border: 'none',
                    background:
                      currentPage === idx
                        ? tokens.colors.primary
                        : isDark
                          ? 'rgba(255,255,255,0.3)'
                          : tokens.colors.border,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    padding: 0,
                  }}
                  aria-label={`Oldal ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Responsive styles */}
        <style>{`
          @media (max-width: 768px) {
            .testimonial-grid {
              grid-template-columns: 1fr !important;
            }
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
              fontSize: tokens.typography.bodySmall.size,
              color: textColor,
              fontFamily: tokens.fonts.body,
            }}
          >
            {testimonial.authorName}
          </div>
          {testimonial.companyName && (
            <div
              style={{
                fontSize: tokens.typography.bodySmall.size,
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
