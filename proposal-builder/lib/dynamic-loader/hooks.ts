/**
 * React hooks for dynamic component loading
 */

'use client';

import { useState, useEffect } from 'react';
import { loadComponent } from './client';
import { BlockComponent, ComponentLoadError, LoadingState } from './types';

/**
 * Hook for loading a single component
 */
export function useLoadComponent(blockType: string) {
  const [state, setState] = useState<LoadingState>('idle');
  const [component, setComponent] = useState<BlockComponent | null>(null);
  const [error, setError] = useState<ComponentLoadError | null>(null);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      setState('loading');
      setError(null);

      try {
        const loadedComponent = await loadComponent(blockType);

        if (isMounted) {
          setComponent(() => loadedComponent);
          setState('success');
        }
      } catch (err) {
        if (isMounted) {
          const loadError: ComponentLoadError = {
            message: err instanceof Error ? err.message : 'Unknown error',
            blockType,
            timestamp: Date.now(),
            details: err,
          };
          setError(loadError);
          setState('error');
        }
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, [blockType]);

  const retry = () => {
    setState('idle');
  };

  return { state, component, error, retry };
}

/**
 * Hook for preloading multiple components
 */
export function usePreloadComponents(blockTypes: string[]) {
  const [loaded, setLoaded] = useState<string[]>([]);
  const [failed, setFailed] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const preload = async () => {
      if (blockTypes.length === 0) return;

      setLoading(true);

      const results = await Promise.allSettled(
        blockTypes.map((blockType) => loadComponent(blockType))
      );

      if (isMounted) {
        const loadedTypes: string[] = [];
        const failedTypes: string[] = [];

        results.forEach((result, index) => {
          if (result.status === 'fulfilled') {
            loadedTypes.push(blockTypes[index]);
          } else {
            failedTypes.push(blockTypes[index]);
          }
        });

        setLoaded(loadedTypes);
        setFailed(failedTypes);
        setLoading(false);
      }
    };

    preload();

    return () => {
      isMounted = false;
    };
  }, [blockTypes]);

  return { loaded, failed, loading };
}
