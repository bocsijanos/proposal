/**
 * Dynamic Component Loader
 *
 * Entry point for dynamic component loading system
 */

export {
  loadComponent,
  preloadComponents,
  clearCache,
  getCacheStats,
  configureLoader,
} from './client';

export { componentCache } from './cache';

export { useLoadComponent, usePreloadComponents } from './hooks';

export type {
  BlockComponent,
  BlockComponentProps,
  LoadingState,
  CacheEntry,
  ComponentLoadError,
  ComponentResponse,
  DynamicLoaderConfig,
} from './types';
