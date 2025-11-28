'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export interface SensitiveProposalData {
  clientEmail: string | null;
  clientPhone: string | null;
  clientContactName: string | null;
  adminName: string | null;
  adminEmail: string | null;
  adminPhone: string | null;
  adminAvatar: string | null;
  createdByName: string | null;
}

interface SensitiveDataContextType {
  data: SensitiveProposalData | null;
  isLoading: boolean;
  error: string | null;
}

const SensitiveDataContext = createContext<SensitiveDataContextType>({
  data: null,
  isLoading: true,
  error: null,
});

export function useSensitiveData() {
  return useContext(SensitiveDataContext);
}

interface SensitiveDataProviderProps {
  slug: string;
  children: ReactNode;
}

/**
 * Client-side provider for sensitive proposal data
 * Loads personal information via API after page render
 * This prevents search engines from indexing sensitive data
 */
export function SensitiveDataProvider({ slug, children }: SensitiveDataProviderProps) {
  const [data, setData] = useState<SensitiveProposalData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSensitiveData() {
      try {
        const response = await fetch(`/api/proposals/${slug}/sensitive`);
        if (!response.ok) {
          throw new Error('Failed to load data');
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    }

    loadSensitiveData();
  }, [slug]);

  return (
    <SensitiveDataContext.Provider value={{ data, isLoading, error }}>
      {children}
    </SensitiveDataContext.Provider>
  );
}
