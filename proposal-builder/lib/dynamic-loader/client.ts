/**
 * Client-side dynamic component loader
 *
 * This module handles fetching, parsing, and executing component code
 * from the API with proper error handling and caching.
 */

'use client';

import React from 'react';
import { BlockComponent, ComponentLoadError, ComponentResponse, DynamicLoaderConfig } from './types';
import { componentCache } from './cache';

/**
 * Default configuration
 */
const DEFAULT_CONFIG: Required<DynamicLoaderConfig> = {
  cacheEnabled: true,
  cacheTTL: 5 * 60 * 1000, // 5 minutes
  retryAttempts: 3,
  retryDelay: 1000, // 1 second
  timeout: 10000, // 10 seconds
};

/**
 * Active configuration (can be overridden)
 */
let activeConfig = { ...DEFAULT_CONFIG };

/**
 * Update loader configuration
 */
export function configureLoader(config: Partial<DynamicLoaderConfig>): void {
  activeConfig = { ...activeConfig, ...config };
}

/**
 * Create a safe execution context for component code
 */
function createSafeExecutionContext() {
  return {
    React,
    // Add any other dependencies that components might need
    useState: React.useState,
    useEffect: React.useEffect,
    useRef: React.useRef,
    useMemo: React.useMemo,
    useCallback: React.useCallback,
  };
}

/**
 * Safely execute component code string
 */
function executeComponentCode(code: string, blockType: string): BlockComponent {
  try {
    // Create a safe execution context
    const context = createSafeExecutionContext();

    // Prepare the code for execution
    // The code should export a default component
    const wrappedCode = `
      'use strict';
      return (function(React, useState, useEffect, useRef, useMemo, useCallback) {
        ${code}
        // Ensure we return the component
        if (typeof exports !== 'undefined' && exports.default) {
          return exports.default;
        }
        // Handle ES6 export default
        return typeof __default !== 'undefined' ? __default : null;
      });
    `;

    // Execute in isolated scope
    const factory = new Function(...Object.keys(context), wrappedCode);
    const componentFactory = factory(...Object.values(context));

    if (typeof componentFactory !== 'function') {
      throw new Error('Component code did not return a valid function');
    }

    const component = componentFactory(...Object.values(context));

    if (!component) {
      throw new Error('Failed to instantiate component');
    }

    return component as BlockComponent;
  } catch (error) {
    console.error(`[DynamicLoader] Failed to execute code for ${blockType}:`, error);
    throw new Error(
      `Failed to execute component code: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Fetch component code from API with retry logic
 */
async function fetchComponentCode(
  blockType: string,
  customComponentId?: string | null,
  attempt = 1
): Promise<ComponentResponse> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), activeConfig.timeout);

  try {
    // Build URL with optional customComponentId query param
    const url = customComponentId
      ? `/api/components/load/${blockType}?customComponentId=${encodeURIComponent(customComponentId)}`
      : `/api/components/load/${blockType}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data: ComponentResponse = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Failed to load component');
    }

    return data;
  } catch (error) {
    clearTimeout(timeoutId);

    // Retry logic
    if (attempt < activeConfig.retryAttempts) {
      console.warn(
        `[DynamicLoader] Attempt ${attempt} failed for ${blockType}, retrying...`
      );
      await new Promise((resolve) => setTimeout(resolve, activeConfig.retryDelay));
      return fetchComponentCode(blockType, customComponentId, attempt + 1);
    }

    throw error;
  }
}

/**
 * Load a component dynamically
 */
export async function loadComponent(
  blockType: string,
  customComponentId?: string | null
): Promise<BlockComponent> {
  // Create cache key based on customComponentId if provided
  const cacheKey = customComponentId ? `${blockType}:${customComponentId}` : blockType;

  // Check cache first
  if (activeConfig.cacheEnabled) {
    const cached = componentCache.get(cacheKey);
    if (cached) {
      console.log(`[DynamicLoader] Loading ${cacheKey} from cache`);
      return cached;
    }
  }

  console.log(`[DynamicLoader] Fetching ${cacheKey} from API`);

  try {
    // Fetch component code from API
    const response = await fetchComponentCode(blockType, customComponentId);

    if (!response.code) {
      throw new Error('No component code received from API');
    }

    // Execute the code to get the component
    const component = executeComponentCode(response.code, blockType);

    // Cache the component
    if (activeConfig.cacheEnabled) {
      componentCache.set(cacheKey, component);
      console.log(`[DynamicLoader] Cached ${cacheKey}`);
    }

    return component;
  } catch (error) {
    const loadError: ComponentLoadError = {
      message: error instanceof Error ? error.message : 'Unknown error',
      blockType,
      timestamp: Date.now(),
      details: error,
    };

    console.error('[DynamicLoader] Failed to load component:', loadError);
    throw loadError;
  }
}

/**
 * Preload multiple components
 */
export async function preloadComponents(blockTypes: string[]): Promise<void> {
  const promises = blockTypes.map((blockType) =>
    loadComponent(blockType).catch((error) => {
      console.warn(`[DynamicLoader] Failed to preload ${blockType}:`, error);
      return null;
    })
  );

  await Promise.all(promises);
}

/**
 * Clear component cache
 */
export function clearCache(): void {
  componentCache.clear();
  console.log('[DynamicLoader] Cache cleared');
}

/**
 * Get cache statistics
 */
export function getCacheStats() {
  return componentCache.getStats();
}
