'use client';

import { useSensitiveData } from './SensitiveDataProvider';

/**
 * Client-side component for displaying creator info in footer
 * Only renders after JavaScript loads - invisible to search engine bots
 */
export function SensitiveCreatorInfo() {
  const { data, isLoading } = useSensitiveData();

  if (isLoading) {
    return <div className="h-4 w-32 bg-white/20 rounded animate-pulse" />;
  }

  if (!data?.createdByName) {
    return null;
  }

  return <div className="mt-1">Készítette: {data.createdByName}</div>;
}
