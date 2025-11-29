'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Data } from '@measured/puck';
import { ProposalPuckEditor } from '@/components/puck/ProposalPuckEditor';

interface Proposal {
  id: string;
  slug: string;
  clientName: string;
  clientContactName?: string | null;
  clientPhone?: string | null;
  clientEmail?: string | null;
  brand: 'BOOM' | 'AIBOOST';
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  blocks: Array<{
    id: string;
    blockType: string;
    displayOrder: number;
    isEnabled: boolean;
    content: any;
  }>;
}

export default function EditProposalPage() {
  const params = useParams();
  const router = useRouter();
  const proposalId = params.slug as string;

  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Keep track of refreshed proposal for save operations
  const proposalRef = useRef<Proposal | null>(null);

  useEffect(() => {
    fetchProposal();
  }, [proposalId]);

  const fetchProposal = async () => {
    try {
      const response = await fetch(`/api/proposals/${proposalId}`);
      if (!response.ok) {
        if (response.status === 404) {
          setError('Árajánlat nem található');
        } else {
          setError('Hiba történt az árajánlat betöltésekor');
        }
        return;
      }
      const data = await response.json();
      setProposal(data);
      proposalRef.current = data;
    } catch (err) {
      console.error('Error fetching proposal:', err);
      setError('Hiba történt az árajánlat betöltésekor');
    } finally {
      setLoading(false);
    }
  };

  // Extract Puck data from proposal blocks
  const getPuckDataFromProposal = useCallback((proposal: Proposal): Data => {
    // Find PUCK_CONTENT block if exists
    const puckBlock = proposal.blocks.find(b => b.blockType === 'PUCK_CONTENT');

    if (puckBlock?.content?.puckData) {
      return puckBlock.content.puckData;
    }

    // If no PUCK_CONTENT block, return empty data
    return {
      content: [],
      root: { props: {} },
    };
  }, []);

  // Save proposal with Puck data
  const saveProposal = useCallback(async (data: Data): Promise<void> => {
    const currentProposal = proposalRef.current;
    if (!currentProposal) return;

    // Find existing PUCK_CONTENT block or create new one
    const existingPuckBlock = currentProposal.blocks.find(b => b.blockType === 'PUCK_CONTENT');

    const blockData = {
      blockType: 'PUCK_CONTENT',
      displayOrder: 0,
      isEnabled: true,
      content: {
        puckData: data,
      },
    };

    if (existingPuckBlock) {
      // Update existing block
      const response = await fetch(`/api/proposals/${proposalId}/blocks`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blocks: [{
            ...blockData,
            id: existingPuckBlock.id,
          }],
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save');
      }
    } else {
      // Delete old blocks and create new PUCK_CONTENT block
      for (const block of currentProposal.blocks) {
        await fetch(`/api/proposals/${proposalId}/blocks?blockId=${block.id}`, {
          method: 'DELETE',
        });
      }

      // Create new PUCK_CONTENT block
      const response = await fetch(`/api/proposals/${proposalId}/blocks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(blockData),
      });

      if (!response.ok) {
        throw new Error('Failed to create block');
      }
    }

    // Refresh proposal data
    await fetchProposal();
  }, [proposalId]);

  // Handle save
  const handleSave = useCallback(async (data: Data): Promise<void> => {
    await saveProposal(data);
    alert('Mentve!');
  }, [saveProposal]);

  // Handle save and close
  const handleSaveAndClose = useCallback(async (data: Data): Promise<void> => {
    await saveProposal(data);
    router.push('/dashboard');
  }, [saveProposal, router]);

  // Handle publish
  const handlePublish = useCallback(async (data: Data): Promise<void> => {
    // First save current data
    await saveProposal(data);

    // Then publish
    await fetch(`/api/proposals/${proposalId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'PUBLISHED' }),
    });

    await fetchProposal();
  }, [proposalId, saveProposal]);

  // Handle unpublish
  const handleUnpublish = useCallback(async (): Promise<void> => {
    await fetch(`/api/proposals/${proposalId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'DRAFT' }),
    });

    await fetchProposal();
  }, [proposalId]);

  // Handle preview
  const handlePreview = useCallback(() => {
    if (proposal) {
      window.open(`/${proposal.slug}`, '_blank');
    }
  }, [proposal]);

  // Handle close
  const handleClose = useCallback(() => {
    router.push('/dashboard');
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Árajánlat betöltése...</p>
        </div>
      </div>
    );
  }

  if (error || !proposal) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">{error || 'Árajánlat nem található'}</h2>
          <button
            onClick={() => router.push('/dashboard')}
            className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
          >
            Vissza a főoldalra
          </button>
        </div>
      </div>
    );
  }

  // Get initial Puck data
  const initialData = getPuckDataFromProposal(proposal);

  return (
    <ProposalPuckEditor
      initialData={initialData}
      brand={proposal.brand}
      title={proposal.clientName}
      subtitle={proposal.slug}
      status={{
        label: proposal.status === 'PUBLISHED' ? '🟢 Publikálva' : '🟡 Piszkozat',
        type: proposal.status === 'PUBLISHED' ? 'published' : 'draft',
      }}
      onSave={handleSave}
      onSaveAndClose={handleSaveAndClose}
      onPublish={proposal.status !== 'PUBLISHED' ? handlePublish : undefined}
      onUnpublish={proposal.status === 'PUBLISHED' ? handleUnpublish : undefined}
      onPreview={proposal.status === 'PUBLISHED' ? handlePreview : undefined}
      onClose={handleClose}
      showVariables={true}
    />
  );
}
