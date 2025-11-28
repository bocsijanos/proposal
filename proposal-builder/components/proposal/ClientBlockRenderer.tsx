'use client';

import { useSensitiveData } from './SensitiveDataProvider';
import { BlockRenderer } from '@/components/builder/BlockRenderer';

interface ClientBlockRendererProps {
  block: {
    id: string;
    blockType: string;
    content: any;
  };
  brand: 'BOOM' | 'AIBOOST';
  clientName: string;
}

/**
 * Client-side wrapper for BlockRenderer
 * Merges server-side safe data with client-loaded sensitive data
 */
export function ClientBlockRenderer({ block, brand, clientName }: ClientBlockRendererProps) {
  const { data } = useSensitiveData();

  return (
    <BlockRenderer
      block={block}
      brand={brand}
      proposalData={{
        clientName,
        // Sensitive data loaded via client-side fetch
        clientEmail: data?.clientEmail,
        clientPhone: data?.clientPhone,
        clientContactName: data?.clientContactName,
        createdByName: data?.createdByName,
        adminName: data?.adminName,
        adminEmail: data?.adminEmail,
        adminPhone: data?.adminPhone,
        adminAvatar: data?.adminAvatar,
      }}
    />
  );
}
