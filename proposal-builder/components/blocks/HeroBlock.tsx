'use client';

import Image from 'next/image';
import { useRef } from 'react';

interface HeroBlockProps {
  content: {
    headingPrefix?: string;
    headingMain?: string;
    headingSuffix?: string;
    subheading: string;
    createdByPrefix?: string;
    createdByName?: string;
    backgroundImage?: string;
    ctaText?: string;
    ctaUrl?: string;
    alignment?: 'left' | 'center' | 'right';
  };
  brand: 'BOOM' | 'AIBOOST';
  proposalData?: {
    clientName: string;
    createdByName?: string | null;
  };
}

export function HeroBlock({ content, brand, proposalData }: HeroBlockProps) {
  const {
    headingPrefix,
    headingMain,
    headingSuffix,
    subheading,
    createdByPrefix,
    createdByName: contentCreatedByName,
    ctaText,
    ctaUrl
  } = content;
  const sectionRef = useRef<HTMLElement>(null);

  // Boom színek: #fa604a (narancs), #3e4581 (kék)
  const isBoom = brand === 'BOOM';
  const bgColor = isBoom ? '#fa604a' : 'var(--color-primary)';
  const secondaryColor = isBoom ? '#3e4581' : 'var(--color-secondary)';
  const accentColor = isBoom ? '#3e4581' : 'var(--color-primary)';

  // Determine final creator name (template or proposalData)
  const finalCreatedByName = contentCreatedByName || proposalData?.createdByName;

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden rounded-3xl shadow-2xl"
      style={{
        background: `linear-gradient(135deg, ${bgColor} 0%, ${bgColor} 60%, ${secondaryColor} 100%)`,
        minHeight: '550px',
      }}
    >
      <div className="relative z-10 px-8 py-20 md:px-20 md:py-24 lg:px-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Column - Text Content */}
          <div className="flex flex-col gap-6 md:gap-8 text-left items-start">
            {/* Main Heading - 3 részre bontott színezett heading */}
            <h1
              className="text-5xl md:text-6xl lg:text-7xl font-bold max-w-4xl leading-tight"
              style={{ textShadow: '0 2px 20px rgba(0,0,0,0.2)' }}
            >
              {headingPrefix && (
                <span style={{ color: accentColor }}>{headingPrefix}</span>
              )}
              {headingPrefix && headingMain && ' '}
              {headingMain && (
                <span className="text-white">{headingMain}</span>
              )}
              {headingMain && headingSuffix && ' '}
              {headingSuffix && (
                <span style={{ color: accentColor }}>{headingSuffix}</span>
              )}
            </h1>

            {/* Subheading */}
            <p className="text-lg md:text-xl lg:text-2xl text-white/95 max-w-3xl leading-relaxed font-light">
              {subheading}
            </p>

            {/* Készítette badge - 2 soros megoldás */}
            {finalCreatedByName && (
              <div className="mt-4 flex items-center gap-3 text-white/90">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  {createdByPrefix && (
                    <span className="text-xs uppercase tracking-wider opacity-80">{createdByPrefix}</span>
                  )}
                  <span className="text-sm font-semibold">{finalCreatedByName}</span>
                </div>
              </div>
            )}

            {/* CTA Button */}
            {ctaText && (
              <div className="mt-8">
                <a
                  href={ctaUrl || '#'}
                  className="inline-block px-8 py-4 bg-white rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
                  style={{
                    color: isBoom ? '#fa604a' : 'var(--color-primary)',
                  }}
                >
                  {ctaText}
                </a>
              </div>
            )}
          </div>

          {/* Right Column - Image */}
          <div className="relative hidden lg:flex items-center justify-center">
            <div className="relative w-full max-w-lg">
              <Image
                src="/images/grafika-fejlodes.webp"
                alt="Fejlődés grafika"
                width={600}
                height={600}
                className="w-full h-auto drop-shadow-2xl"
                priority
              />
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl pointer-events-none" />

      {/* Scroll Down Arrow */}
      <button
        onClick={() => {
          if (sectionRef.current) {
            // Get the parent wrapper div (animate-fadeIn)
            const wrapper = sectionRef.current.parentElement;
            if (wrapper) {
              // Get the next wrapper sibling
              const nextWrapper = wrapper.nextElementSibling;
              if (nextWrapper) {
                // Find the section inside the next wrapper
                const nextSection = nextWrapper.querySelector('section');
                if (nextSection) {
                  // Get header height to offset the scroll
                  const header = document.querySelector('header');
                  const headerHeight = header ? header.offsetHeight : 0;

                  // Scroll with offset for sticky header
                  const elementPosition = nextSection.getBoundingClientRect().top;
                  const offsetPosition = elementPosition + window.pageYOffset - headerHeight - 20;

                  window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                  });
                }
              }
            }
          }
        }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 text-white/80 hover:text-white transition-all animate-bounce cursor-pointer bg-white/10 backdrop-blur-sm rounded-full p-3 hover:bg-white/20"
        aria-label="Görgess le"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </section>
  );
}
