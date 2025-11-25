/**
 * Usage examples for dynamic component loading system
 */

'use client';

import { useEffect } from 'react';
import {
  preloadComponents,
  configureLoader,
  getCacheStats,
  clearCache,
} from './client';
import { usePreloadComponents } from './hooks';
import { getEnvironmentConfig } from './config';

/**
 * Example 1: Configure loader on app initialization
 */
export function AppInitializer() {
  useEffect(() => {
    // Configure loader based on environment
    const config = getEnvironmentConfig();
    configureLoader(config);

    console.log('[DynamicLoader] Initialized with config:', config);
  }, []);

  return null;
}

/**
 * Example 2: Preload components on route load
 */
export function ProposalPageWithPreload() {
  // Preload common block types
  const { loaded, failed, loading } = usePreloadComponents([
    'HERO',
    'CTA',
    'PRICING_TABLE',
  ]);

  useEffect(() => {
    if (loading) return;

    console.log('[ProposalPage] Preloaded components:', loaded);
    if (failed.length > 0) {
      console.warn('[ProposalPage] Failed to preload:', failed);
    }
  }, [loaded, failed, loading]);

  return null; // Your actual page component
}

/**
 * Example 3: Manual preloading with async/await
 */
export async function preloadProposalComponents() {
  const blockTypes = [
    'HERO',
    'SERVICES_GRID',
    'VALUE_PROP',
    'PRICING_TABLE',
    'CTA',
  ];

  console.log('[Preload] Starting preload of', blockTypes.length, 'components');

  try {
    await preloadComponents(blockTypes);
    console.log('[Preload] Successfully preloaded all components');
  } catch (error) {
    console.error('[Preload] Failed to preload components:', error);
  }
}

/**
 * Example 4: Cache management utilities
 */
export function CacheManager() {
  const handleViewStats = () => {
    const stats = getCacheStats();
    console.log('[Cache] Statistics:', stats);
    alert(`Cache size: ${stats.size} components\nEntries: ${stats.entries.join(', ')}`);
  };

  const handleClearCache = () => {
    clearCache();
    console.log('[Cache] Cleared all entries');
    alert('Cache cleared successfully');
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={handleViewStats}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        View Cache Stats
      </button>
      <button
        onClick={handleClearCache}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Clear Cache
      </button>
    </div>
  );
}

/**
 * Example 5: Error handling with custom retry logic
 */
export function ComponentLoaderWithRetry({
  blockType,
  maxRetries = 3,
}: {
  blockType: string;
  maxRetries?: number;
}) {
  useEffect(() => {
    let retries = 0;

    const loadWithRetry = async () => {
      try {
        const { loadComponent } = await import('./client');
        await loadComponent(blockType);
        console.log(`[Retry] Successfully loaded ${blockType}`);
      } catch (error) {
        retries++;
        if (retries < maxRetries) {
          console.log(`[Retry] Attempt ${retries} failed, retrying...`);
          setTimeout(loadWithRetry, 1000 * retries); // Exponential backoff
        } else {
          console.error(`[Retry] Failed to load ${blockType} after ${maxRetries} attempts`);
        }
      }
    };

    loadWithRetry();
  }, [blockType, maxRetries]);

  return null;
}

/**
 * Example 6: Development tools for debugging
 */
export function DevelopmentTools() {
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const handleInvalidateCache = async (blockType: string) => {
    try {
      const response = await fetch(`/api/components/load/${blockType}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      console.log('[DevTools] Cache invalidation:', data);
      alert(`Cache invalidated for ${blockType}`);
    } catch (error) {
      console.error('[DevTools] Failed to invalidate cache:', error);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-4 border">
      <h3 className="font-bold mb-2">Dynamic Loader Dev Tools</h3>
      <div className="flex flex-col gap-2">
        <button
          onClick={() => handleInvalidateCache('HERO')}
          className="px-3 py-1 bg-gray-200 rounded text-sm hover:bg-gray-300"
        >
          Invalidate HERO Cache
        </button>
        <button
          onClick={() => handleInvalidateCache('all')}
          className="px-3 py-1 bg-gray-200 rounded text-sm hover:bg-gray-300"
        >
          Invalidate All Cache
        </button>
        <CacheManager />
      </div>
    </div>
  );
}
