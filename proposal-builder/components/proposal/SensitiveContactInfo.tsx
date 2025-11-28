'use client';

import { useSensitiveData } from './SensitiveDataProvider';

/**
 * Client-side component for displaying sensitive contact info
 * Only renders after JavaScript loads - invisible to search engine bots
 */
export function SensitiveContactInfo() {
  const { data, isLoading } = useSensitiveData();

  if (isLoading) {
    return (
      <div className="flex flex-wrap items-center gap-3 animate-pulse">
        <div className="h-4 w-24 bg-gray-200 rounded" />
        <div className="h-4 w-20 bg-gray-200 rounded" />
      </div>
    );
  }

  if (!data?.clientEmail && !data?.clientPhone) {
    return null;
  }

  return (
    <>
      <span className="hidden sm:inline">•</span>
      <div className="flex flex-wrap items-center gap-3">
        {data.clientEmail && (
          <a
            href={`mailto:${data.clientEmail}`}
            className="text-xs hover:text-[var(--color-primary)] transition-colors flex items-center gap-1"
            title={`Email küldése: ${data.clientEmail}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
            {data.clientEmail.slice(0, 2)}***{data.clientEmail.slice(data.clientEmail.indexOf('@'))}
          </a>
        )}
        {data.clientPhone && (
          <a
            href={`tel:${data.clientPhone.replace(/\s/g, '')}`}
            className="text-xs hover:text-[var(--color-primary)] transition-colors flex items-center gap-1"
            title={`Hívás: ${data.clientPhone}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
            {data.clientPhone.slice(0, 6)} *** ****
          </a>
        )}
      </div>
    </>
  );
}
