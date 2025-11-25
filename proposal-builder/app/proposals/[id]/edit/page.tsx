'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { DraggableBuilder } from '@/components/builder/DraggableBuilder';

interface Block {
  id: string;
  blockType: string;
  displayOrder: number;
  isEnabled: boolean;
  content: any;
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
  blocks: Block[];
}

export default function EditProposalPage() {
  const params = useParams();
  const router = useRouter();
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isEditingClientData, setIsEditingClientData] = useState(false);
  const [editedClientData, setEditedClientData] = useState({
    clientName: '',
    clientContactName: '',
    clientPhone: '',
    clientEmail: '',
  });

  useEffect(() => {
    fetchProposal();
  }, [params.id]);

  const fetchProposal = async () => {
    try {
      const id = Array.isArray(params.id) ? params.id[0] : params.id;
      if (!id) throw new Error('No proposal ID');

      const response = await fetch(`/api/proposals/${id}`);
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setProposal(data);
      setEditedClientData({
        clientName: data.clientName || '',
        clientContactName: data.clientContactName || '',
        clientPhone: data.clientPhone || '',
        clientEmail: data.clientEmail || '',
      });
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    setSaving(true);
    try {
      await fetch(`/api/proposals/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'PUBLISHED' }),
      });
      await fetchProposal();
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleUnpublish = async () => {
    setSaving(true);
    try {
      await fetch(`/api/proposals/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'DRAFT' }),
      });
      await fetchProposal();
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleBlocksReorder = async (blocks: Block[]) => {
    setSaving(true);
    setSaveSuccess(false);
    try {
      console.log('💾 Mentés előtt - blokk sorrend:', blocks.map(b => ({
        id: b.id.slice(0, 8),
        type: b.blockType,
        order: b.displayOrder
      })));

      const response = await fetch(`/api/proposals/${params.id}/blocks`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blocks }),
      });

      if (response.ok) {
        console.log('✅ Mentés sikeres!');
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2000);
      } else {
        console.error('❌ Mentés hiba:', await response.text());
      }
    } catch (error) {
      console.error('❌ Mentés hiba:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleBlockToggle = async (blockId: string) => {
    if (!proposal) return;

    const block = proposal.blocks.find(b => b.id === blockId);
    if (!block) return;

    const updatedBlocks = proposal.blocks.map(b =>
      b.id === blockId ? { ...b, isEnabled: !b.isEnabled } : b
    );

    setProposal({ ...proposal, blocks: updatedBlocks });
    await handleBlocksReorder(updatedBlocks);
  };

  const handleBlockEdit = async (blockId: string, newContent: any) => {
    if (!proposal) return;

    const updatedBlocks = proposal.blocks.map(b =>
      b.id === blockId ? { ...b, content: newContent } : b
    );

    setProposal({ ...proposal, blocks: updatedBlocks });
    await handleBlocksReorder(updatedBlocks);
  };

  const handleBlockDelete = async (blockId: string) => {
    if (!proposal) return;
    if (!confirm('Biztosan törölni szeretnéd ezt a blokkot?')) return;

    // TODO: Implement block deletion API
    console.log('Delete block:', blockId);
  };

  const handleSaveBlockAsTemplate = async (blockId: string) => {
    if (!proposal) return;

    const block = proposal.blocks.find(b => b.id === blockId);
    if (!block) return;

    if (!confirm(`Biztosan elmented ezt a blokkot sablonként?\n\nTípus: ${block.blockType.replace(/_/g, ' ')}`)) {
      return;
    }

    try {
      const response = await fetch('/api/save-block-as-template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blockType: block.blockType,
          content: block.content,
          isActive: block.isEnabled,
          brand: proposal.brand,
        }),
      });

      if (response.ok) {
        alert(`✅ Blokk sikeresen elmentve sablonként!\n\nA sablonok között megtalálod.`);
      } else {
        alert('❌ Hiba történt a mentés során.');
      }
    } catch (error) {
      console.error('Error saving block as template:', error);
      alert('❌ Hiba történt a mentés során.');
    }
  };

  const handleStartEditClientData = () => {
    if (!proposal) return;
    setEditedClientData({
      clientName: proposal.clientName || '',
      clientContactName: proposal.clientContactName || '',
      clientPhone: proposal.clientPhone || '',
      clientEmail: proposal.clientEmail || '',
    });
    setIsEditingClientData(true);
  };

  const handleCancelEditClientData = () => {
    setIsEditingClientData(false);
  };

  const handleSaveClientData = async () => {
    if (!proposal) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/proposals/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: editedClientData.clientName,
          clientContactName: editedClientData.clientContactName || null,
          clientPhone: editedClientData.clientPhone || null,
          clientEmail: editedClientData.clientEmail || null,
        }),
      });

      if (response.ok) {
        await fetchProposal();
        setIsEditingClientData(false);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2000);
      }
    } catch (error) {
      console.error('Error updating client data:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading">Betöltés...</div>
      </div>
    );
  }

  if (!proposal) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Árajánlat nem található</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-background-alt)]">
      {/* Top Bar */}
      <div className="bg-white border-b border-[var(--color-border)] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4 flex-1">
              <button
                onClick={() => router.push('/dashboard')}
                className="text-[var(--color-primary)] hover:underline text-sm"
              >
                ← Vissza
              </button>
              {!isEditingClientData ? (
                <div className="flex items-center gap-3 flex-1">
                  <div>
                    <h1 className="text-lg font-bold text-[var(--color-text)]">
                      {proposal.clientName}
                    </h1>
                    <p className="text-xs text-[var(--color-muted)]">
                      {proposal.slug}
                      {proposal.clientContactName && ` • ${proposal.clientContactName}`}
                      {proposal.clientPhone && ` • ${proposal.clientPhone}`}
                      {proposal.clientEmail && ` • ${proposal.clientEmail}`}
                    </p>
                  </div>
                  <button
                    onClick={handleStartEditClientData}
                    className="text-xs text-[var(--color-primary)] hover:underline ml-2"
                  >
                    ✏️ Szerkesztés
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 flex-1">
                  <div className="grid grid-cols-4 gap-2 flex-1">
                    <input
                      type="text"
                      value={editedClientData.clientName}
                      onChange={(e) => setEditedClientData({ ...editedClientData, clientName: e.target.value })}
                      placeholder="Cég neve"
                      className="text-sm px-2 py-1 border border-[var(--color-border)] rounded"
                    />
                    <input
                      type="text"
                      value={editedClientData.clientContactName}
                      onChange={(e) => setEditedClientData({ ...editedClientData, clientContactName: e.target.value })}
                      placeholder="Kapcsolattartó neve"
                      className="text-sm px-2 py-1 border border-[var(--color-border)] rounded"
                    />
                    <input
                      type="tel"
                      value={editedClientData.clientPhone}
                      onChange={(e) => setEditedClientData({ ...editedClientData, clientPhone: e.target.value })}
                      placeholder="Telefonszám"
                      className="text-sm px-2 py-1 border border-[var(--color-border)] rounded"
                    />
                    <input
                      type="email"
                      value={editedClientData.clientEmail}
                      onChange={(e) => setEditedClientData({ ...editedClientData, clientEmail: e.target.value })}
                      placeholder="Email cím"
                      className="text-sm px-2 py-1 border border-[var(--color-border)] rounded"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSaveClientData}
                      disabled={saving || !editedClientData.clientName}
                      className="px-3 py-1 text-xs font-medium bg-[var(--color-primary)] text-white rounded hover:opacity-90 disabled:opacity-50"
                    >
                      ✓ Mentés
                    </button>
                    <button
                      onClick={handleCancelEditClientData}
                      disabled={saving}
                      className="px-3 py-1 text-xs font-medium border border-[var(--color-border)] rounded hover:bg-gray-50"
                    >
                      × Mégse
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* Save Status Indicator */}
              {saving && (
                <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 animate-pulse">
                  💾 Mentés...
                </span>
              )}
              {saveSuccess && (
                <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                  ✅ Mentve
                </span>
              )}

              <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                proposal.status === 'PUBLISHED'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {proposal.status === 'PUBLISHED' ? 'Publikálva' : 'Piszkozat'}
              </span>

              {proposal.status === 'PUBLISHED' ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`/${proposal.slug}`, '_blank')}
                  >
                    👁️ Előnézet
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleUnpublish}
                    disabled={saving}
                  >
                    Visszavonás
                  </Button>
                </>
              ) : (
                <Button
                  size="sm"
                  onClick={handlePublish}
                  disabled={saving}
                >
                  🚀 Publikálás
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Builder Content */}
      <div className="max-w-6xl mx-auto px-4 py-8 pl-20">
        <DraggableBuilder
          blocks={proposal.blocks.sort((a, b) => a.displayOrder - b.displayOrder)}
          brand={proposal.brand}
          proposalData={{
            clientName: proposal.clientName,
            clientContactName: proposal.clientContactName,
            clientPhone: proposal.clientPhone,
            clientEmail: proposal.clientEmail,
            createdByName: null,
          }}
          onReorder={handleBlocksReorder}
          onEdit={handleBlockEdit}
          onToggle={handleBlockToggle}
          onDelete={handleBlockDelete}
          onSaveAsTemplate={handleSaveBlockAsTemplate}
        />
      </div>
    </div>
  );
}
