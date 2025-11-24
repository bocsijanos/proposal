'use client';

import React from 'react';
import { PlatformIcon, PlatformType } from './platform-icons';

export type ServiceCardVariant = 'platform' | 'service' | 'featured';

interface ServiceCardProps {
  variant?: ServiceCardVariant;
  icon: PlatformType;
  title: string;
  subtitle?: string;
  description: string;
  benefits?: string[];
  featured?: boolean;
  platformGradient?: 'meta' | 'google' | 'tiktok';
  className?: string;
}

export function ServiceCard({
  variant = 'service',
  icon,
  title,
  subtitle,
  description,
  benefits = [],
  featured = false,
  platformGradient,
  className = '',
}: ServiceCardProps) {
  const getCardClasses = () => {
    const base = 'group relative rounded-xl transition-all duration-300';

    if (variant === 'platform') {
      return `${base} bg-white border-2 border-[var(--color-border)] hover:border-[var(--color-primary)] hover:shadow-2xl hover:-translate-y-3`;
    }

    if (variant === 'featured') {
      return `${base} glass border-2 border-[var(--color-primary)] shadow-xl hover:shadow-2xl hover:-translate-y-2`;
    }

    return `${base} bg-white border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:shadow-lg hover:-translate-y-2`;
  };

  const getPlatformGlow = () => {
    if (!platformGradient) return {};

    const glows = {
      meta: '0 20px 40px -10px rgba(24, 119, 242, 0.3)',
      google: '0 20px 40px -10px rgba(66, 133, 244, 0.3)',
      tiktok: '0 20px 40px -10px rgba(254, 44, 85, 0.3)',
    };

    return {
      boxShadow: glows[platformGradient],
    };
  };

  if (variant === 'platform') {
    return (
      <div
        className={`${getCardClasses()} ${className}`}
        style={{
          ...getPlatformGlow(),
          padding: 'clamp(2.5rem, 3vw, 3.5rem)'
        }}
      >
        {featured && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-[var(--color-primary)] text-white text-sm font-semibold rounded-full">
            Legnépszerűbb
          </div>
        )}

        {platformGradient && (
          <div
            className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-5 transition-opacity duration-300"
            style={{
              background: `var(--gradient-platform-${platformGradient})`
            }}
          />
        )}

        <div className="relative z-10">
          <div className="mb-6 transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
            <PlatformIcon type={icon} size={64} />
          </div>

          <h3 className="text-2xl font-bold text-[var(--color-text)] mb-2">
            {title}
          </h3>
          {subtitle && (
            <p className="text-sm text-[var(--color-muted)] mb-4 font-medium">
              {subtitle}
            </p>
          )}

          <p className="text-[var(--color-muted)] mb-6 leading-relaxed">
            {description}
          </p>

          {benefits.length > 0 && (
            <ul className="space-y-3">
              {benefits.map((benefit, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-sm text-[var(--color-text)]"
                >
                  <svg
                    className="w-5 h-5 flex-shrink-0 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="var(--color-primary)"
                    strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  }

  if (variant === 'featured') {
    return (
      <div
        className={`${getCardClasses()} ${className}`}
        style={{ padding: 'clamp(2.5rem, 3vw, 3.5rem)' }}
      >
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-[var(--color-primary)] text-white text-sm font-semibold rounded-full shadow-lg">
          Kiemelt szolgáltatás
        </div>

        <div className="relative z-10">
          <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">
            <PlatformIcon type={icon} size={56} />
          </div>

          <h3 className="text-xl font-bold text-[var(--color-text)] mb-3">
            {title}
          </h3>

          <p className="text-[var(--color-text)] mb-4 leading-relaxed">
            {description}
          </p>

          <button className="w-full py-2 px-4 bg-[var(--color-primary)] text-white rounded-lg font-medium hover:opacity-90 transition-opacity">
            Tudj meg többet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${getCardClasses()} ${className}`}
      style={{ padding: 'clamp(2rem, 2.5vw, 3rem)' }}
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
          <PlatformIcon type={icon} size={48} />
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-bold text-[var(--color-text)] mb-2 group-hover:text-[var(--color-primary)] transition-colors">
            {title}
          </h3>

          <p className="text-sm text-[var(--color-muted)] mb-3 leading-relaxed">
            {description}
          </p>

          <a
            href="#"
            className="inline-flex items-center gap-1 text-sm font-medium text-[var(--color-primary)] hover:gap-2 transition-all"
          >
            <span>Tudj meg többet</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
