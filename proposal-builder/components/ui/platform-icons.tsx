import React from 'react';

export type PlatformType = 'meta' | 'google' | 'tiktok' | 'email' | 'copywriting' | 'landing' | 'audit' | 'social';

interface PlatformIconProps {
  type: PlatformType;
  size?: number;
  className?: string;
}

export function PlatformIcon({ type, size = 48, className = '' }: PlatformIconProps) {
  const iconProps = {
    width: size,
    height: size,
    className,
  };

  switch (type) {
    case 'meta':
      return (
        <svg {...iconProps} viewBox="0 0 48 48" fill="none">
          <path
            d="M24 48C37.2548 48 48 37.2548 48 24C48 10.7452 37.2548 0 24 0C10.7452 0 0 10.7452 0 24C0 37.2548 10.7452 48 24 48Z"
            fill="url(#meta-gradient)"
          />
          <path
            d="M31.5 18.75C31.5 20.8211 29.8211 22.5 27.75 22.5C25.6789 22.5 24 20.8211 24 18.75C24 16.6789 25.6789 15 27.75 15C29.8211 15 31.5 16.6789 31.5 18.75ZM20.25 15C18.1789 15 16.5 16.6789 16.5 18.75C16.5 20.8211 18.1789 22.5 20.25 22.5C22.3211 22.5 24 20.8211 24 18.75C24 16.6789 22.3211 15 20.25 15ZM24 25.5C21.1025 25.5 18.75 27.8525 18.75 30.75V33H29.25V30.75C29.25 27.8525 26.8975 25.5 24 25.5Z"
            fill="white"
          />
          <defs>
            <linearGradient id="meta-gradient" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
              <stop stopColor="#1877F2" />
              <stop offset="1" stopColor="#4A90E2" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'google':
      return (
        <svg {...iconProps} viewBox="0 0 48 48">
          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
          <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
          <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
        </svg>
      );

    case 'tiktok':
      return (
        <svg {...iconProps} viewBox="0 0 48 48" fill="none">
          <rect width="48" height="48" rx="12" fill="url(#tiktok-gradient)"/>
          <path
            d="M34.5 15.5C33.12 14.02 32.25 12 32.25 12H27.75V30C27.75 31.66 26.41 33 24.75 33C23.09 33 21.75 31.66 21.75 30C21.75 28.34 23.09 27 24.75 27C25.18 27 25.59 27.09 25.95 27.25V22.68C25.55 22.63 25.15 22.59 24.75 22.59C20.61 22.59 17.25 25.95 17.25 30.09C17.25 34.23 20.61 37.59 24.75 37.59C28.89 37.59 32.25 34.23 32.25 30.09V20.56C34.05 21.91 36.24 22.75 38.63 22.75V18.25C38.63 18.25 36.18 18.39 34.5 15.5Z"
            fill="white"
          />
          <defs>
            <linearGradient id="tiktok-gradient" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FE2C55" />
              <stop offset="1" stopColor="#00F2EA" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'email':
      return (
        <svg {...iconProps} viewBox="0 0 48 48" fill="none">
          <rect width="48" height="48" rx="12" fill="var(--color-primary)" fillOpacity="0.1"/>
          <path
            d="M38 14H10C8.9 14 8.01 14.9 8.01 16L8 32C8 33.1 8.9 34 10 34H38C39.1 34 40 33.1 40 32V16C40 14.9 39.1 14 38 14ZM38 19L24 26L10 19V16L24 23L38 16V19Z"
            fill="var(--color-primary)"
          />
        </svg>
      );

    case 'copywriting':
      return (
        <svg {...iconProps} viewBox="0 0 48 48" fill="none">
          <rect width="48" height="48" rx="12" fill="var(--color-secondary)" fillOpacity="0.1"/>
          <path
            d="M31 14H17C15.9 14 15 14.9 15 16V32C15 33.1 15.9 34 17 34H31C32.1 34 33 33.1 33 32V16C33 14.9 32.1 14 31 14ZM31 32H17V16H31V32ZM19 18H29V20H19V18ZM19 22H29V24H19V22ZM19 26H24V28H19V26Z"
            fill="var(--color-secondary)"
          />
        </svg>
      );

    case 'landing':
      return (
        <svg {...iconProps} viewBox="0 0 48 48" fill="none">
          <rect width="48" height="48" rx="12" fill="var(--color-primary)" fillOpacity="0.1"/>
          <path
            d="M36 12H12C10.9 12 10 12.9 10 14V34C10 35.1 10.9 36 12 36H36C37.1 36 38 35.1 38 34V14C38 12.9 37.1 12 36 12ZM36 34H12V18H36V34ZM14 20H22V28H14V20ZM24 20H34V22H24V20ZM24 24H34V26H24V24ZM14 30H34V32H14V30Z"
            fill="var(--color-primary)"
          />
        </svg>
      );

    case 'audit':
      return (
        <svg {...iconProps} viewBox="0 0 48 48" fill="none">
          <rect width="48" height="48" rx="12" fill="var(--color-secondary)" fillOpacity="0.1"/>
          <path
            d="M31 12H17C15.9 12 15 12.9 15 14V34C15 35.1 15.9 36 17 36H31C32.1 36 33 35.1 33 34V14C33 12.9 32.1 12 31 12ZM31 34H17V14H31V34ZM19 16H29V18H19V16ZM19 20H29V22H19V20ZM19 24H26V26H19V24ZM19 28H22V30H19V28Z"
            fill="var(--color-secondary)"
          />
          <circle cx="36" cy="30" r="6" fill="var(--color-primary)"/>
          <path d="M36 27V31L39 33" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      );

    case 'social':
      return (
        <svg {...iconProps} viewBox="0 0 48 48" fill="none">
          <rect width="48" height="48" rx="12" fill="var(--color-primary)" fillOpacity="0.1"/>
          <circle cx="24" cy="18" r="4" fill="var(--color-primary)"/>
          <circle cx="14" cy="28" r="3" fill="var(--color-primary)" fillOpacity="0.7"/>
          <circle cx="34" cy="28" r="3" fill="var(--color-primary)" fillOpacity="0.7"/>
          <path
            d="M24 24C20.5 24 17 26.5 17 30V34H31V30C31 26.5 27.5 24 24 24Z"
            fill="var(--color-primary)"
          />
        </svg>
      );

    default:
      return null;
  }
}
