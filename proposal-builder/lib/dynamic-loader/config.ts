/**
 * Environment-specific configuration for dynamic loader
 */

import { DynamicLoaderConfig } from './types';

/**
 * Development configuration
 */
export const developmentConfig: DynamicLoaderConfig = {
  cacheEnabled: true,
  cacheTTL: 1 * 60 * 1000, // 1 minute for quick updates
  retryAttempts: 2,
  retryDelay: 500,
  timeout: 5000,
};

/**
 * Production configuration
 */
export const productionConfig: DynamicLoaderConfig = {
  cacheEnabled: true,
  cacheTTL: 15 * 60 * 1000, // 15 minutes for stability
  retryAttempts: 3,
  retryDelay: 1000,
  timeout: 10000,
};

/**
 * Test configuration
 */
export const testConfig: DynamicLoaderConfig = {
  cacheEnabled: false, // Disable cache in tests
  cacheTTL: 0,
  retryAttempts: 1,
  retryDelay: 0,
  timeout: 3000,
};

/**
 * Get configuration based on environment
 */
export function getEnvironmentConfig(): DynamicLoaderConfig {
  const env = process.env.NODE_ENV;

  switch (env) {
    case 'production':
      return productionConfig;
    case 'test':
      return testConfig;
    case 'development':
    default:
      return developmentConfig;
  }
}
