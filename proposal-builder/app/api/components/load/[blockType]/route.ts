/**
 * API endpoint for dynamic component loading
 *
 * Returns compiled component code for client-side execution
 */

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { prisma } from '@/lib/prisma';

/**
 * Mapping of block types to component file paths
 */
const COMPONENT_PATHS: Record<string, string> = {
  HERO: 'components/blocks/HeroBlock.tsx',
  PRICING_TABLE: 'components/blocks/PricingBlock.tsx',
  SERVICES_GRID: 'components/blocks/ServicesBlock.tsx',
  VALUE_PROP: 'components/blocks/ValuePropBlock.tsx',
  GUARANTEES: 'components/blocks/GuaranteesBlock.tsx',
  CTA: 'components/blocks/CTABlock.tsx',
  PROCESS_TIMELINE: 'components/blocks/ProcessTimelineBlock.tsx',
  CLIENT_LOGOS: 'components/blocks/ClientLogosBlock.tsx',
  TEXT_BLOCK: 'components/blocks/TextBlock.tsx',
  TWO_COLUMN: 'components/blocks/TwoColumnBlock.tsx',
  PLATFORM_FEATURES: 'components/blocks/PlatformFeaturesBlock.tsx',
  STATS: 'components/blocks/StatsBlock.tsx',
  BONUS_FEATURES: 'components/blocks/BonusFeaturesBlock.tsx',
  PARTNER_GRID: 'components/blocks/PartnerGridBlock.tsx',
};

/**
 * In-memory cache for component code
 */
const componentCodeCache = new Map<string, { code: string; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Transform TypeScript/TSX code to executable JavaScript
 * For production, you might want to use actual compilation with esbuild or swc
 */
function transformComponentCode(code: string, blockType: string): string {
  try {
    // Remove TypeScript type annotations and interfaces
    let transformed = code
      // Remove 'use client' directive
      .replace(/['"]use client['"];?\s*/g, '')
      // Remove import statements (we'll provide dependencies in execution context)
      .replace(/import\s+.*?from\s+['"].*?['"];?\s*/g, '')
      // Remove export keyword but keep the function
      .replace(/export\s+function\s+(\w+)/g, 'function $1')
      // Remove TypeScript type annotations from function parameters
      .replace(/:\s*\w+(\[\])?(\s*\||\&\s*\w+)*(\s*=)/g, '$3')
      .replace(/:\s*\{[^}]*\}/g, '')
      // Remove interface definitions
      .replace(/interface\s+\w+\s*\{[^}]*\}/g, '')
      // Remove type definitions
      .replace(/type\s+\w+\s*=\s*[^;]+;/g, '')
      // Clean up generic type parameters
      .replace(/<[\w\s,|&\[\]{}]+>/g, '');

    // Extract the main component function name
    const componentMatch = code.match(/export\s+function\s+(\w+)/);
    const componentName = componentMatch ? componentMatch[1] : blockType;

    // Add export at the end
    transformed += `\n\n// Export the component\nif (typeof module !== 'undefined' && module.exports) { module.exports = ${componentName}; }\nconst __default = ${componentName};\n`;

    return transformed;
  } catch (error) {
    console.error(`[API] Failed to transform component ${blockType}:`, error);
    throw new Error('Failed to transform component code');
  }
}

/**
 * Load component source code from file system
 */
async function loadComponentSource(blockType: string): Promise<string> {
  const componentPath = COMPONENT_PATHS[blockType];

  if (!componentPath) {
    throw new Error(`Unknown block type: ${blockType}`);
  }

  const fullPath = path.join(process.cwd(), componentPath);

  try {
    const code = await fs.readFile(fullPath, 'utf-8');
    return code;
  } catch (error) {
    console.error(`[API] Failed to read component file ${fullPath}:`, error);
    throw new Error('Component file not found');
  }
}

/**
 * GET handler for component loading
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ blockType: string }> }
) {
  try {
    const { blockType } = await context.params;
    const { searchParams } = new URL(request.url);
    const customComponentId = searchParams.get('customComponentId');

    // Validate block type
    if (!blockType || typeof blockType !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid block type',
          blockType: blockType || 'unknown',
        },
        { status: 400 }
      );
    }

    // Create cache key
    const cacheKey = customComponentId ? `${blockType}:${customComponentId}` : blockType;

    // Check cache first
    const cached = componentCodeCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      console.log(`[API] Serving ${cacheKey} from cache`);
      return NextResponse.json({
        success: true,
        code: cached.code,
        blockType,
        cached: true,
        timestamp: cached.timestamp,
      });
    }

    let sourceCode: string;

    // If customComponentId is provided, load from ProposalComponentCode
    if (customComponentId) {
      console.log(`[API] Loading from ProposalComponentCode: ${customComponentId}`);

      const proposalComponent = await prisma.proposalComponentCode.findUnique({
        where: { id: customComponentId },
      });

      if (!proposalComponent) {
        throw new Error(`ProposalComponentCode not found: ${customComponentId}`);
      }

      // Use compiled code if available, otherwise use source code
      sourceCode = proposalComponent.compiledCode || proposalComponent.sourceCode;

      // If we're using sourceCode, we need to transform it
      if (!proposalComponent.compiledCode) {
        sourceCode = transformComponentCode(proposalComponent.sourceCode, blockType);
      }
    } else {
      // Fallback to filesystem (for backward compatibility)
      console.log(`[API] Loading from filesystem: ${blockType}`);
      const rawSource = await loadComponentSource(blockType);
      sourceCode = transformComponentCode(rawSource, blockType);
    }

    // Cache the result
    componentCodeCache.set(cacheKey, {
      code: sourceCode,
      timestamp: Date.now(),
    });

    console.log(`[API] Successfully loaded and cached ${cacheKey}`);

    return NextResponse.json({
      success: true,
      code: sourceCode,
      blockType,
      cached: false,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('[API] Component loading error:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        blockType: 'unknown',
      },
      { status: 500 }
    );
  }
}

/**
 * POST handler for cache invalidation (optional)
 */
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ blockType: string }> }
) {
  try {
    const { blockType } = await context.params;

    if (blockType === 'all') {
      componentCodeCache.clear();
      return NextResponse.json({
        success: true,
        message: 'All cache entries cleared',
      });
    }

    const deleted = componentCodeCache.delete(blockType);

    return NextResponse.json({
      success: deleted,
      message: deleted
        ? `Cache entry for ${blockType} cleared`
        : `No cache entry found for ${blockType}`,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
