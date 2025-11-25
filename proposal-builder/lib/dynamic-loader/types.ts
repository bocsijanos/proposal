/**
 * Type definitions for dynamic component loading system
 */

import { ComponentType } from 'react';

/**
 * Props that every block component receives
 */
export interface BlockComponentProps {
  content: Record<string, any>;
  brand: 'BOOM' | 'AIBOOST';
  proposalData?: {
    clientName: string;
    createdByName?: string | null;
  };
}

/**
 * Generic block component type
 */
export type BlockComponent = ComponentType<BlockComponentProps>;

/**
 * Status of component loading
 */
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

/**
 * Component cache entry
 */
export interface CacheEntry {
  component: BlockComponent;
  timestamp: number;
  blockType: string;
}

/**
 * Error during component loading
 */
export interface ComponentLoadError {
  message: string;
  blockType: string;
  timestamp: number;
  details?: any;
}

/**
 * API response structure for component loading
 */
export interface ComponentResponse {
  success: boolean;
  code?: string;
  blockType: string;
  error?: string;
  timestamp?: number;
}

/**
 * Configuration for dynamic loader
 */
export interface DynamicLoaderConfig {
  cacheEnabled?: boolean;
  cacheTTL?: number; // Time to live in milliseconds
  retryAttempts?: number;
  retryDelay?: number;
  timeout?: number;
}
