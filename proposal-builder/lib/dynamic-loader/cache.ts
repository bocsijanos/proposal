/**
 * Client-side component cache with TTL support
 */

import { BlockComponent, CacheEntry } from './types';

class ComponentCache {
  private cache: Map<string, CacheEntry>;
  private readonly defaultTTL: number;

  constructor(defaultTTL = 5 * 60 * 1000) { // 5 minutes default
    this.cache = new Map();
    this.defaultTTL = defaultTTL;
  }

  /**
   * Get a component from cache
   */
  get(blockType: string): BlockComponent | null {
    const entry = this.cache.get(blockType);

    if (!entry) {
      return null;
    }

    // Check if cache entry is still valid
    const now = Date.now();
    if (now - entry.timestamp > this.defaultTTL) {
      this.cache.delete(blockType);
      return null;
    }

    return entry.component;
  }

  /**
   * Set a component in cache
   */
  set(blockType: string, component: BlockComponent): void {
    const entry: CacheEntry = {
      component,
      blockType,
      timestamp: Date.now(),
    };

    this.cache.set(blockType, entry);
  }

  /**
   * Check if a component is cached and valid
   */
  has(blockType: string): boolean {
    const entry = this.cache.get(blockType);

    if (!entry) {
      return false;
    }

    const now = Date.now();
    if (now - entry.timestamp > this.defaultTTL) {
      this.cache.delete(blockType);
      return false;
    }

    return true;
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Remove a specific entry
   */
  delete(blockType: string): boolean {
    return this.cache.delete(blockType);
  }

  /**
   * Get cache statistics
   */
  getStats(): { size: number; entries: string[] } {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.keys()),
    };
  }

  /**
   * Clean expired entries
   */
  cleanup(): number {
    const now = Date.now();
    let cleaned = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.defaultTTL) {
        this.cache.delete(key);
        cleaned++;
      }
    }

    return cleaned;
  }
}

// Singleton instance for the entire application
export const componentCache = new ComponentCache();
