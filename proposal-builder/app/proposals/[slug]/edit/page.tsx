'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Data } from '@measured/puck';
import { ProposalPuckEditor } from '@/components/puck/ProposalPuckEditor';
import { PuckRenderer } from '@/components/puck/PuckEditor';
import { Button } from '@/components/ui/button';

// Category labels for original block types (same as templates page)
const getCategoryLabel = (blockType: string | undefined): { label: string; icon: string; color: string } => {
  const categories: Record<string, { label: string; icon: string; color: string }> = {
    'HERO': { label: 'Hero', icon: '🎯', color: 'bg-blue-100 text-blue-800 border-blue-200' },
    'VALUE_PROP': { label: 'Értékajánlat', icon: '💎', color: 'bg-purple-100 text-purple-800 border-purple-200' },
    'PRICING_TABLE': { label: 'Árazás', icon: '💰', color: 'bg-green-100 text-green-800 border-green-200' },
    'CTA': { label: 'CTA', icon: '🚀', color: 'bg-orange-100 text-orange-800 border-orange-200' },
    'SERVICES_GRID': { label: 'Szolgáltatások', icon: '🔧', color: 'bg-cyan-100 text-cyan-800 border-cyan-200' },
    'GUARANTEES': { label: 'Garanciák', icon: '✅', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
    'TESTIMONIALS': { label: 'Vélemények', icon: '💬', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
    'PROCESS': { label: 'Folyamat', icon: '📋', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
    'PROCESS_TIMELINE': { label: 'Folyamat', icon: '📋', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
    'FAQ': { label: 'GYIK', icon: '❓', color: 'bg-pink-100 text-pink-800 border-pink-200' },
    'COVER': { label: 'Borító', icon: '📄', color: 'bg-slate-100 text-slate-800 border-slate-200' },
    'FOOTER': { label: 'Lábléc', icon: '📍', color: 'bg-gray-100 text-gray-800 border-gray-200' },
    'TWO_COLUMN': { label: 'Két oszlop', icon: '📐', color: 'bg-teal-100 text-teal-800 border-teal-200' },
    'PLATFORM_FEATURES': { label: 'Platform', icon: '⚡', color: 'bg-violet-100 text-violet-800 border-violet-200' },
    'CLIENT_LOGOS': { label: 'Logók', icon: '🏢', color: 'bg-amber-100 text-amber-800 border-amber-200' },
    'STATS': { label: 'Statisztikák', icon: '📊', color: 'bg-rose-100 text-rose-800 border-rose-200' },
    'PUCK_CONTENT': { label: 'Puck tartalom', icon: '🎨', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
  };

  return categories[blockType || ''] || { label: 'Egyéb', icon: '🎨', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' };
};

interface BlockTemplate {
  id: string;
  name: string;
  blockType: string;
  displayOrder: number;
  isActive: boolean;
  defaultContent: any;
}

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
    templateId?: string | null;
  }>;
}

type ViewMode = 'list' | 'editor';

export default function EditProposalPage() {
  const params = useParams();
  const router = useRouter();
  const proposalId = params.slug as string;

  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [templates, setTemplates] = useState<BlockTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
  const [viewModeType, setViewModeType] = useState<'preview' | 'compact'>('preview');

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

      // Fetch templates for this brand
      const templatesRes = await fetch(`/api/block-templates?brand=${data.brand}`);
      if (templatesRes.ok) {
        const templatesData = await templatesRes.json();
        setTemplates(templatesData.templates || []);
      }
    } catch (err) {
      console.error('Error fetching proposal:', err);
      setError('Hiba történt az árajánlat betöltésekor');
    } finally {
      setLoading(false);
    }
  };

  // Extract Puck data from proposal blocks
  const getPuckDataFromProposal = useCallback((proposal: Proposal, blockId?: string | null): Data => {
    // If a specific block is being edited, get that block's data
    if (blockId) {
      const block = proposal.blocks.find(b => b.id === blockId);
      if (block?.content?.puckData) {
        return block.content.puckData;
      }
    }

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

    // Find the block we're editing (if editingBlockId is set) or the PUCK_CONTENT block
    const editingBlock = editingBlockId
      ? currentProposal.blocks.find(b => b.id === editingBlockId)
      : currentProposal.blocks.find(b => b.blockType === 'PUCK_CONTENT');

    if (editingBlock) {
      // Update existing block - preserve displayOrder and isEnabled
      const response = await fetch(`/api/proposals/${proposalId}/blocks`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blocks: [{
            id: editingBlock.id,
            displayOrder: editingBlock.displayOrder, // Preserve original order!
            isEnabled: editingBlock.isEnabled, // Preserve enabled status!
            content: {
              ...editingBlock.content,
              puckData: data,
            },
          }],
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save');
      }
    } else {
      // No existing block to edit - create new PUCK_CONTENT block
      const response = await fetch(`/api/proposals/${proposalId}/blocks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blockType: 'PUCK_CONTENT',
          content: {
            puckData: data,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create block');
      }
    }

    // Refresh proposal data
    await fetchProposal();
  }, [proposalId, editingBlockId]);

  // Handle save
  const handleSave = useCallback(async (data: Data): Promise<void> => {
    await saveProposal(data);
    alert('Mentve!');
  }, [saveProposal]);

  // Handle save and back to list
  const handleSaveAndBack = useCallback(async (data: Data): Promise<void> => {
    await saveProposal(data);
    setViewMode('list');
  }, [saveProposal]);

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
  // Get initial data - if editing a specific block, use that block's data
  const initialData = getPuckDataFromProposal(proposal, editingBlockId);

  // Get block name from template
  const getBlockName = (block: Proposal['blocks'][0]) => {
    const template = templates.find(t => t.id === block.templateId);
    if (template) return template.name;

    // Fallback: try to get title from content
    const content = block.content as any;
    if (content?.title) return content.title;
    if (content?.puckData?.root?.props?.title) return content.puckData.root.props.title;

    return block.blockType;
  };

  // Get component count from Puck data
  const getComponentCount = (block: Proposal['blocks'][0]) => {
    const content = block.content as any;
    if (content?.puckData?.content) {
      return content.puckData.content.length;
    }
    return 0;
  };

  // Handle block click - open editor
  const handleBlockClick = (blockId: string) => {
    setEditingBlockId(blockId);
    setViewMode('editor');
  };

  // Handle toggle block enabled status
  const handleToggleBlock = async (blockId: string, currentEnabled: boolean) => {
    try {
      const block = proposal.blocks.find(b => b.id === blockId);
      if (!block) return;

      await fetch(`/api/proposals/${proposalId}/blocks`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blocks: [{
            id: blockId,
            displayOrder: block.displayOrder,
            isEnabled: !currentEnabled,
          }],
        }),
      });

      await fetchProposal();
    } catch (error) {
      console.error('Error toggling block:', error);
    }
  };

  // Handle delete block
  const handleDeleteBlock = async (blockId: string) => {
    if (!confirm('Biztosan törölni szeretnéd ezt a blokkot?')) return;

    try {
      await fetch(`/api/proposals/${proposalId}/blocks?blockId=${blockId}`, {
        method: 'DELETE',
      });

      await fetchProposal();
    } catch (error) {
      console.error('Error deleting block:', error);
    }
  };

  // Handle move block up/down
  const handleMoveBlock = async (blockId: string, direction: 'up' | 'down') => {
    const sortedBlocks = [...proposal.blocks].sort((a, b) => a.displayOrder - b.displayOrder);
    const currentIndex = sortedBlocks.findIndex(b => b.id === blockId);

    if (direction === 'up' && currentIndex <= 0) return;
    if (direction === 'down' && currentIndex >= sortedBlocks.length - 1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    // Swap the blocks
    const newBlocks = [...sortedBlocks];
    [newBlocks[currentIndex], newBlocks[newIndex]] = [newBlocks[newIndex], newBlocks[currentIndex]];

    // Update display orders
    const blocksToUpdate = newBlocks.map((block, index) => ({
      id: block.id,
      displayOrder: index,
      isEnabled: block.isEnabled,
    }));

    try {
      await fetch(`/api/proposals/${proposalId}/blocks`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blocks: blocksToUpdate }),
      });

      await fetchProposal();
    } catch (error) {
      console.error('Error moving block:', error);
    }
  };

  // Handle move block to top
  const handleMoveToTop = async (blockId: string) => {
    const sortedBlocks = [...proposal.blocks].sort((a, b) => a.displayOrder - b.displayOrder);
    const currentIndex = sortedBlocks.findIndex(b => b.id === blockId);

    if (currentIndex <= 0) return; // Already at top

    // Remove block from current position and add to beginning
    const blockToMove = sortedBlocks[currentIndex];
    const newBlocks = [
      blockToMove,
      ...sortedBlocks.slice(0, currentIndex),
      ...sortedBlocks.slice(currentIndex + 1),
    ];

    // Update display orders
    const blocksToUpdate = newBlocks.map((block, index) => ({
      id: block.id,
      displayOrder: index,
      isEnabled: block.isEnabled,
    }));

    try {
      await fetch(`/api/proposals/${proposalId}/blocks`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blocks: blocksToUpdate }),
      });

      await fetchProposal();
    } catch (error) {
      console.error('Error moving block to top:', error);
    }
  };

  // List View - shows blocks/templates with actions (like templates page)
  if (viewMode === 'list') {
    return (
      <div className="min-h-screen bg-[var(--color-background-alt)]">
        {/* Header - sticky */}
        <div className="bg-white border-b border-[var(--color-border)] sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div>
                <button
                  onClick={handleClose}
                  className="text-[var(--color-primary)] hover:underline text-sm"
                >
                  ← Vissza a főoldalra
                </button>
                <div className="flex items-center gap-3 mt-1">
                  <h1 className="text-xl font-bold text-[var(--color-text)]">
                    {proposal.clientName}
                  </h1>
                  <span className="px-2 py-0.5 text-xs bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-full font-medium">
                    {proposal.brand}
                  </span>
                  <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                    proposal.status === 'PUBLISHED'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {proposal.status === 'PUBLISHED' ? '🟢 Publikálva' : '🟡 Piszkozat'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* View Mode Selector */}
                <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewModeType('preview')}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                      viewModeType === 'preview'
                        ? 'bg-white text-[var(--color-text)] shadow-sm font-medium'
                        : 'text-[var(--color-muted)] hover:text-[var(--color-text)]'
                    }`}
                  >
                    👁️ Előnézet
                  </button>
                  <button
                    onClick={() => setViewModeType('compact')}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                      viewModeType === 'compact'
                        ? 'bg-white text-[var(--color-text)] shadow-sm font-medium'
                        : 'text-[var(--color-muted)] hover:text-[var(--color-text)]'
                    }`}
                  >
                    📋 Kompakt
                  </button>
                </div>

                {/* Action buttons */}
                {proposal.status === 'PUBLISHED' && (
                  <Button
                    onClick={handlePreview}
                    variant="outline"
                  >
                    👁️ Megtekintés
                  </Button>
                )}
                {proposal.status !== 'PUBLISHED' ? (
                  <Button
                    onClick={() => handlePublish(initialData)}
                    className="bg-green-500 hover:bg-green-600 text-white"
                  >
                    🚀 Publikálás
                  </Button>
                ) : (
                  <Button
                    onClick={handleUnpublish}
                    variant="outline"
                    className="text-orange-600 border-orange-300 hover:bg-orange-50"
                  >
                    Visszavonás
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <p className="text-[var(--color-muted)]">
              Kattints egy blokkra a Puck szerkesztő megnyitásához.
              <span className="ml-2 font-mono text-sm bg-gray-100 px-2 py-0.5 rounded">{proposal.slug}</span>
            </p>
          </div>

          {/* Blocks list */}
          <div className="space-y-6">
            {proposal.blocks.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl">
                <div className="text-6xl mb-4">📄</div>
                <h3 className="text-xl font-semibold text-[var(--color-text)] mb-2">
                  Nincsenek blokkok az ajánlatban
                </h3>
                <p className="text-[var(--color-muted)] mb-4">
                  Adj hozzá blokkokat a szerkesztőben.
                </p>
                <Button
                  onClick={() => setViewMode('editor')}
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600"
                >
                  + Szerkesztés megkezdése
                </Button>
              </div>
            ) : (
              proposal.blocks
                .sort((a, b) => a.displayOrder - b.displayOrder)
                .map((block, index) => {
                  const template = templates.find(t => t.id === block.templateId);
                  const originalBlockType = (block.content as any)?.originalBlockType || block.blockType;
                  const category = getCategoryLabel(originalBlockType);
                  const puckData = (block.content as any)?.puckData;

                  return (
                    <div
                      key={block.id}
                      className="relative group"
                    >
                      {/* Sidebar Actions */}
                      <div className="absolute -left-14 top-4 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1">
                        {/* Move Up */}
                        <button
                          onClick={(e) => { e.stopPropagation(); handleMoveBlock(block.id, 'up'); }}
                          disabled={index === 0}
                          className="w-8 h-8 rounded border flex items-center justify-center bg-white border-[var(--color-border)] hover:border-[var(--color-primary)] hover:bg-blue-50 disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Mozgatás fel"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                        {/* Move Down */}
                        <button
                          onClick={(e) => { e.stopPropagation(); handleMoveBlock(block.id, 'down'); }}
                          disabled={index === proposal.blocks.length - 1}
                          className="w-8 h-8 rounded border flex items-center justify-center bg-white border-[var(--color-border)] hover:border-[var(--color-primary)] hover:bg-blue-50 disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Mozgatás le"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                        {/* Move to Top */}
                        <button
                          onClick={(e) => { e.stopPropagation(); handleMoveToTop(block.id); }}
                          disabled={index === 0}
                          className="w-8 h-8 rounded border flex items-center justify-center bg-white border-[var(--color-border)] hover:border-green-500 hover:bg-green-50 disabled:opacity-30 disabled:cursor-not-allowed text-green-600"
                          title="Küldés előre"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        </button>
                        {/* Edit */}
                        <button
                          onClick={(e) => { e.stopPropagation(); handleBlockClick(block.id); }}
                          className="w-8 h-8 rounded border flex items-center justify-center bg-white border-[var(--color-border)] hover:border-[var(--color-primary)] hover:bg-blue-50"
                          title="Szerkesztés"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </button>
                        {/* Delete */}
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDeleteBlock(block.id); }}
                          className="w-8 h-8 rounded border flex items-center justify-center bg-white border-red-200 hover:border-red-500 hover:bg-red-50 text-red-500"
                          title="Törlés"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>

                      <div
                        className={`bg-white rounded-xl border-2 p-6 cursor-pointer hover:border-[var(--color-primary)] transition-colors ${
                          !block.isEnabled ? 'opacity-50 border-gray-200' : 'border-[var(--color-border)]'
                        }`}
                        onClick={() => handleBlockClick(block.id)}
                      >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-[var(--color-muted)]">#{index + 1}</span>
                              <h3 className="text-lg font-semibold text-[var(--color-text)]">
                                {getBlockName(block)}
                              </h3>
                              <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${category.color}`}>
                                {category.icon} {category.label}
                              </span>
                              {template && (
                                <span className="text-xs px-1.5 py-0.5 bg-indigo-100 text-indigo-700 rounded">
                                  Sablonból
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleBlock(block.id, block.isEnabled);
                              }}
                              className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                                block.isEnabled
                                  ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                              }`}
                              title={block.isEnabled ? 'Kattints az inaktiváláshoz' : 'Kattints az aktiváláshoz'}
                            >
                              {block.isEnabled ? '✓ Aktív' : '○ Inaktív'}
                            </button>
                          </div>
                        </div>

                        {/* Preview */}
                        {viewModeType === 'preview' && (
                          <div className="mt-4">
                            <div className="text-xs text-[var(--color-muted)] font-medium mb-2">Előnézet:</div>
                            <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                              {puckData?.content?.length > 0 ? (
                                <PuckRenderer data={puckData} />
                              ) : (
                                <div className="p-8 text-center text-gray-400">
                                  <div className="text-4xl mb-2">🎨</div>
                                  <p>Üres blokk</p>
                                  <p className="text-sm mt-1">Kattints a szerkesztéshez</p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        </div>
      </div>
    );
  }

  // Editor View - Puck editor (no publish actions - those are on list page)
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
      onSaveAndClose={handleSaveAndBack}
      onClose={() => setViewMode('list')}
      showVariables={true}
    />
  );
}
