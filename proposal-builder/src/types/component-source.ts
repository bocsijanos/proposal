/**
 * Type definitions for Component Source system
 */

import { ComponentSource, ComponentVersion, BlockType } from '@prisma/client';
import { JSONSchema7 } from 'json-schema';

/**
 * Extended ComponentSource with related data
 */
export type ComponentSourceWithVersions = ComponentSource & {
  versions: ComponentVersion[];
};

/**
 * Component source creation input
 */
export interface CreateComponentSourceInput {
  blockType: BlockType;
  name: string;
  description?: string;
  sourceCode: string;
  compiledCode: string;
  schema: JSONSchema7;
  createdById: string;
}

/**
 * Component source update input
 */
export interface UpdateComponentSourceInput {
  blockType: BlockType;
  sourceCode?: string;
  compiledCode?: string;
  schema?: JSONSchema7;
  name?: string;
  description?: string;
  changeDescription: string;
  updatedById: string;
}

/**
 * Component version creation input
 */
export interface CreateComponentVersionInput {
  componentId: string;
  versionNumber: number;
  sourceCode: string;
  compiledCode: string;
  schema: JSONSchema7;
  changeDescription?: string;
  createdById: string;
}

/**
 * Component compilation result
 */
export interface ComponentCompilationResult {
  success: boolean;
  compiledCode?: string;
  error?: {
    message: string;
    line?: number;
    column?: number;
    stack?: string;
  };
  warnings?: string[];
  metadata?: {
    compilationTime: number;
    sourceSize: number;
    compiledSize: number;
  };
}

/**
 * Component schema validation result
 */
export interface SchemaValidationResult {
  valid: boolean;
  errors?: Array<{
    path: string;
    message: string;
    expected?: string;
    received?: string;
  }>;
}

/**
 * Component rendering context
 */
export interface ComponentRenderContext {
  componentSource: ComponentSource;
  props: Record<string, any>;
  brand: 'BOOM' | 'AIBOOST';
  mode: 'preview' | 'production';
}

/**
 * Component version comparison
 */
export interface ComponentVersionDiff {
  versionFrom: number;
  versionTo: number;
  changes: {
    sourceCode?: {
      added: string[];
      removed: string[];
      modified: string[];
    };
    schema?: {
      addedProperties: string[];
      removedProperties: string[];
      modifiedProperties: string[];
    };
  };
  breakingChanges: boolean;
}

/**
 * Component performance metrics
 */
export interface ComponentPerformanceMetrics {
  componentId: string;
  blockType: BlockType;
  averageRenderTime: number;
  p95RenderTime: number;
  errorRate: number;
  usageCount: number;
  lastMeasuredAt: Date;
}

/**
 * Component cache entry
 */
export interface ComponentCacheEntry {
  componentId: string;
  blockType: BlockType;
  version: number;
  compiledCode: string;
  schema: JSONSchema7;
  cachedAt: Date;
  expiresAt: Date;
}

/**
 * Component rollback request
 */
export interface ComponentRollbackRequest {
  componentId: string;
  targetVersion: number;
  reason: string;
  requestedById: string;
}

/**
 * Component deployment status
 */
export type ComponentDeploymentStatus =
  | 'draft'
  | 'compiling'
  | 'compiled'
  | 'testing'
  | 'deployed'
  | 'failed'
  | 'rolled_back';

/**
 * Component deployment record
 */
export interface ComponentDeployment {
  componentId: string;
  version: number;
  status: ComponentDeploymentStatus;
  deployedAt?: Date;
  deployedById?: string;
  environment: 'development' | 'staging' | 'production';
  rollbackVersion?: number;
}

/**
 * Component source query options
 */
export interface ComponentSourceQueryOptions {
  blockType?: BlockType;
  isActive?: boolean;
  includeVersions?: boolean;
  maxVersions?: number;
  orderBy?: 'createdAt' | 'updatedAt' | 'version';
  order?: 'asc' | 'desc';
}

/**
 * Component version query options
 */
export interface ComponentVersionQueryOptions {
  componentId: string;
  versionNumber?: number;
  fromVersion?: number;
  toVersion?: number;
  createdById?: string;
  orderBy?: 'versionNumber' | 'createdAt';
  order?: 'asc' | 'desc';
  limit?: number;
}

/**
 * Component audit log entry
 */
export interface ComponentAuditLog {
  id: string;
  componentId: string;
  action: 'created' | 'updated' | 'compiled' | 'deployed' | 'rolled_back' | 'deactivated';
  version: number;
  performedById: string;
  performedAt: Date;
  details?: Record<string, any>;
  ipAddress?: string;
}

/**
 * Component health check result
 */
export interface ComponentHealthCheck {
  componentId: string;
  blockType: BlockType;
  isHealthy: boolean;
  checks: {
    compilation: { passed: boolean; message?: string };
    schema: { passed: boolean; message?: string };
    rendering: { passed: boolean; message?: string };
    performance: { passed: boolean; message?: string };
  };
  checkedAt: Date;
}

/**
 * Batch component update request
 */
export interface BatchComponentUpdateRequest {
  updates: Array<{
    blockType: BlockType;
    sourceCode?: string;
    schema?: JSONSchema7;
    isActive?: boolean;
  }>;
  changeDescription: string;
  updatedById: string;
}

/**
 * Component export format
 */
export interface ComponentExport {
  version: string; // Export format version
  exportedAt: Date;
  components: Array<{
    blockType: BlockType;
    name: string;
    description?: string;
    currentVersion: number;
    sourceCode: string;
    compiledCode: string;
    schema: JSONSchema7;
    versions?: Array<{
      versionNumber: number;
      changeDescription?: string;
      sourceCode: string;
      createdAt: Date;
    }>;
  }>;
}

/**
 * Component import result
 */
export interface ComponentImportResult {
  success: boolean;
  imported: number;
  skipped: number;
  failed: number;
  errors?: Array<{
    blockType: BlockType;
    message: string;
  }>;
  details: Array<{
    blockType: BlockType;
    status: 'imported' | 'skipped' | 'failed';
    reason?: string;
  }>;
}
