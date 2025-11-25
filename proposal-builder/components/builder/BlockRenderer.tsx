'use client';

/**
 * Dynamic Block Renderer
 *
 * Loads and renders block components dynamically from the API
 * with proper error handling, loading states, and caching.
 */

import { useState, useEffect, useCallback } from 'react';
import { loadComponent } from '@/lib/dynamic-loader/client';
import { BlockComponent, ComponentLoadError } from '@/lib/dynamic-loader/types';
import { ComponentErrorBoundary } from './ComponentErrorBoundary';
import { ComponentSkeleton } from './ComponentSkeleton';
import { AlertCircle } from 'lucide-react';

interface BlockRendererProps {
  block: {
    id: string;
    blockType: string;
    content: any;
    customComponentId?: string | null;
  };
  brand: 'BOOM' | 'AIBOOST';
  proposalData?: {
    clientName: string;
    createdByName?: string | null;
  };
}

/**
 * Loading state component
 */
function LoadingState({ blockType }: { blockType: string }) {
  return <ComponentSkeleton blockType={blockType} />;
}

/**
 * Error state component with retry
 */
function ErrorState({
  blockType,
  error,
  onRetry,
}: {
  blockType: string;
  error: ComponentLoadError;
  onRetry: () => void;
}) {
  return (
    <div className="border-2 border-red-300 bg-red-50 rounded-lg p-6">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <AlertCircle className="w-6 h-6 text-red-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-red-900 mb-2">
            Failed to Load Component
          </h3>
          <p className="text-sm text-red-700 mb-2">
            Could not load block type: <strong>{blockType}</strong>
          </p>
          <div className="bg-white rounded border border-red-200 p-3 mb-4">
            <p className="text-xs font-mono text-red-800">{error.message}</p>
          </div>
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
          >
            Retry Loading
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Fallback component for unknown block types
 */
function UnknownBlockFallback({ blockType }: { blockType: string }) {
  return (
    <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <div>
          <p className="text-gray-700 font-medium mb-1">Unknown Block Type</p>
          <p className="text-gray-600 text-sm">
            Block type <code className="px-2 py-1 bg-gray-200 rounded text-xs">{blockType}</code> is not implemented yet
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Main BlockRenderer component with dynamic loading
 */
export function BlockRenderer({ block, brand, proposalData }: BlockRendererProps) {
  const [loadingState, setLoadingState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [component, setComponent] = useState<BlockComponent | null>(null);
  const [error, setError] = useState<ComponentLoadError | null>(null);

  /**
   * Load component from API
   */
  const loadComponentAsync = useCallback(async () => {
    setLoadingState('loading');
    setError(null);

    try {
      console.log(`[BlockRenderer] Loading component for ${block.blockType}`, {
        customComponentId: block.customComponentId,
      });
      const loadedComponent = await loadComponent(block.blockType, block.customComponentId);

      setComponent(() => loadedComponent);
      setLoadingState('success');
      console.log(`[BlockRenderer] Successfully loaded ${block.blockType}`);
    } catch (err) {
      console.error(`[BlockRenderer] Failed to load ${block.blockType}:`, err);

      const loadError: ComponentLoadError = {
        message: err instanceof Error ? err.message : 'Unknown error',
        blockType: block.blockType,
        timestamp: Date.now(),
        details: err,
      };

      setError(loadError);
      setLoadingState('error');
    }
  }, [block.blockType, block.customComponentId]);

  /**
   * Retry loading on error
   */
  const handleRetry = useCallback(() => {
    loadComponentAsync();
  }, [loadComponentAsync]);

  /**
   * Load component on mount or when blockType changes
   */
  useEffect(() => {
    loadComponentAsync();
  }, [loadComponentAsync]);

  /**
   * Render based on loading state
   */
  switch (loadingState) {
    case 'loading':
    case 'idle':
      return <LoadingState blockType={block.blockType} />;

    case 'error':
      return error ? (
        <ErrorState blockType={block.blockType} error={error} onRetry={handleRetry} />
      ) : (
        <UnknownBlockFallback blockType={block.blockType} />
      );

    case 'success':
      if (!component) {
        return <UnknownBlockFallback blockType={block.blockType} />;
      }

      // Render the loaded component wrapped in error boundary
      const Component = component;

      return (
        <ComponentErrorBoundary blockType={block.blockType}>
          <Component content={block.content} brand={brand} proposalData={proposalData} />
        </ComponentErrorBoundary>
      );

    default:
      return <UnknownBlockFallback blockType={block.blockType} />;
  }
}
