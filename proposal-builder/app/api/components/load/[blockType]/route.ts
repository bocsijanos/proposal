/**
 * API endpoint for dynamic component loading
 *
 * Returns compiled component code for client-side execution from ProposalComponentCode
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * In-memory cache for component code
 */
const componentCodeCache = new Map<string, { code: string; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

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

    // Load from ProposalComponentCode (required)
    if (!customComponentId) {
      return NextResponse.json(
        {
          success: false,
          error: 'customComponentId is required - all components must be loaded from database',
          blockType,
        },
        { status: 400 }
      );
    }

    console.log(`[API] Loading from ProposalComponentCode: ${customComponentId}`);

    const proposalComponent = await prisma.proposalComponentCode.findUnique({
      where: { id: customComponentId },
    });

    if (!proposalComponent) {
      return NextResponse.json(
        {
          success: false,
          error: `ProposalComponentCode not found: ${customComponentId}`,
          blockType,
        },
        { status: 404 }
      );
    }

    // Use compiled code if available, otherwise use source code
    sourceCode = proposalComponent.compiledCode || proposalComponent.sourceCode;

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
