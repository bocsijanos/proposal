'use client';

/**
 * Block Renderer
 *
 * Renders Puck blocks with error handling.
 * All blocks are now PUCK_CONTENT type.
 */

import { ComponentErrorBoundary } from './ComponentErrorBoundary';
import { PuckRenderer } from '@/components/puck/PuckEditor';

interface BlockRendererProps {
  block: {
    id: string;
    blockType: string;
    content: any;
  };
  brand: 'BOOM' | 'AIBOOST';
  proposalData?: {
    clientName: string;
    createdByName?: string | null;
    clientEmail?: string | null;
    clientPhone?: string | null;
    clientContactName?: string | null;
  };
}

/**
 * Main BlockRenderer component for Puck blocks
 */
export function BlockRenderer({ block, proposalData }: BlockRendererProps) {
  // All blocks should be PUCK_CONTENT type
  if (block.blockType !== 'PUCK_CONTENT') {
    console.warn(`[BlockRenderer] Unexpected block type: ${block.blockType}. Expected PUCK_CONTENT.`);
    return (
      <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-6 text-center">
        <p className="text-yellow-800">
          Unsupported block type: <code className="bg-yellow-100 px-2 py-1 rounded">{block.blockType}</code>
        </p>
        <p className="text-sm text-yellow-600 mt-2">
          This proposal may have been created with an older version.
        </p>
      </div>
    );
  }

  const puckData = block.content?.puckData || { content: [], root: { props: {} } };

  return (
    <ComponentErrorBoundary blockType={block.blockType}>
      <PuckRenderer data={puckData} proposalData={proposalData} />
    </ComponentErrorBoundary>
  );
}
