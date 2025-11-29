'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { PuckRenderer } from '@/components/puck/PuckEditor';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface BlockTemplate {
  id: string;
  name: string;
  description: string | null;
  blockType: string;
  brand: 'BOOM' | 'AIBOOST';
  defaultContent: any;
  isActive: boolean;
  displayOrder?: number;
  thumbnailUrl?: string | null;
}

interface EditingTemplate {
  id: string;
  name: string;
  description: string | null;
}

// Category labels for original block types
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
  };

  return categories[blockType || ''] || { label: 'Egyéb', icon: '🎨', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' };
};

interface SortableTemplateItemProps {
  template: BlockTemplate;
  index: number;
  totalCount: number;
  editingMetadata: EditingTemplate | null;
  viewMode: 'preview' | 'compact';
  isDeleting: boolean;
  isHighlighted: boolean;
  onOpenEditor: (id: string) => void;
  onToggleActive: (id: string, currentState: boolean) => void;
  onDelete: (id: string) => void;
  onEditMetadata: (id: string) => void;
  onSaveMetadata: (id: string, name: string, description: string | null) => void;
  onCancelMetadata: () => void;
  onMetadataChange: (field: 'name' | 'description', value: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
  onMoveToTop: (id: string) => void;
}

function SortableTemplateItem({
  template,
  index,
  totalCount,
  editingMetadata,
  viewMode,
  isDeleting,
  isHighlighted,
  onOpenEditor,
  onToggleActive,
  onDelete,
  onEditMetadata,
  onSaveMetadata,
  onCancelMetadata,
  onMetadataChange,
  onMoveUp,
  onMoveDown,
  onMoveToTop,
}: SortableTemplateItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: template.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDeleting
      ? 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1), max-height 0.3s ease-out 0.3s, margin 0.3s ease-out 0.3s, padding 0.3s ease-out 0.3s, opacity 0.15s ease-out'
      : transition,
    opacity: isDragging ? 0.5 : (isDeleting ? 0 : 1),
    maxHeight: isDeleting ? '0' : '5000px',
    marginBottom: isDeleting ? '0' : undefined,
    paddingTop: isDeleting ? '0' : undefined,
    paddingBottom: isDeleting ? '0' : undefined,
    overflow: isDeleting ? 'hidden' : 'visible',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      id={`template-${template.id}`}
      className={`relative group transition-all ${isHighlighted ? 'ring-4 ring-[var(--color-primary)] ring-opacity-50 rounded-xl' : ''}`}
    >
      {/* Sidebar Actions */}
      <div className="absolute -left-12 top-6 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-2">
        <button
          {...attributes}
          {...listeners}
          className="w-8 h-8 rounded bg-white border border-[var(--color-border)] hover:border-[var(--color-primary)] flex items-center justify-center cursor-grab active:cursor-grabbing"
          title="Húzd ide a sablon átrendezéséhez"
        >
          <span className="text-[var(--color-muted)]">⋮⋮</span>
        </button>
        {/* Move Up */}
        <button
          onClick={() => onMoveUp(template.id)}
          disabled={index === 0}
          className={`w-8 h-8 rounded bg-white border flex items-center justify-center ${
            index === 0
              ? 'border-gray-200 text-gray-300 cursor-not-allowed'
              : 'border-[var(--color-border)] hover:border-[var(--color-primary)] hover:bg-blue-50'
          }`}
          title="Mozgatás fel"
        >
          <span>⬆️</span>
        </button>
        {/* Move Down */}
        <button
          onClick={() => onMoveDown(template.id)}
          disabled={index === totalCount - 1}
          className={`w-8 h-8 rounded bg-white border flex items-center justify-center ${
            index === totalCount - 1
              ? 'border-gray-200 text-gray-300 cursor-not-allowed'
              : 'border-[var(--color-border)] hover:border-[var(--color-primary)] hover:bg-blue-50'
          }`}
          title="Mozgatás le"
        >
          <span>⬇️</span>
        </button>
        {/* Move to Top */}
        <button
          onClick={() => onMoveToTop(template.id)}
          disabled={index === 0}
          className={`w-8 h-8 rounded bg-white border flex items-center justify-center ${
            index === 0
              ? 'border-gray-200 text-gray-300 cursor-not-allowed'
              : 'border-green-200 hover:border-green-500 hover:bg-green-50'
          }`}
          title="Küldés előre"
        >
          <span>⏫</span>
        </button>
        {/* Edit */}
        <button
          onClick={() => onOpenEditor(template.id)}
          className="w-8 h-8 rounded border flex items-center justify-center bg-white border-[var(--color-border)] hover:border-[var(--color-primary)] hover:bg-blue-50"
          title="Szerkesztés Puck editorban"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
        </button>
        {/* Delete */}
        <button
          onClick={() => {
            if (confirm('Biztosan törölni szeretnéd ezt a sablont?')) {
              onDelete(template.id);
            }
          }}
          className="w-8 h-8 rounded bg-white border border-[var(--color-border)] hover:border-red-500 hover:bg-red-50 flex items-center justify-center"
          title="Sablon törlése"
        >
          <span className="text-red-500">🗑️</span>
        </button>
      </div>

      <div
        className={`bg-white rounded-xl border-2 p-6 cursor-pointer hover:border-[var(--color-primary)] transition-colors ${
          !template.isActive ? 'opacity-50 border-gray-200' : 'border-[var(--color-border)]'
        }`}
        onClick={() => onOpenEditor(template.id)}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4" onClick={(e) => e.stopPropagation()}>
          <div className="flex-1">
            {editingMetadata?.id === template.id ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={editingMetadata.name}
                  onChange={(e) => onMetadataChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-[var(--color-border)] rounded-md text-lg font-semibold text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  placeholder="Sablon neve"
                />
                <input
                  type="text"
                  value={editingMetadata.description || ''}
                  onChange={(e) => onMetadataChange('description', e.target.value)}
                  className="w-full px-3 py-2 border border-[var(--color-border)] rounded-md text-sm text-[var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  placeholder="Leírás (opcionális)"
                />
                <div className="flex gap-2">
                  <Button
                    onClick={() => onSaveMetadata(template.id, editingMetadata.name, editingMetadata.description)}
                    size="sm"
                    variant="default"
                  >
                    💾 Mentés
                  </Button>
                  <Button
                    onClick={onCancelMetadata}
                    size="sm"
                    variant="outline"
                  >
                    Mégse
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-[var(--color-text)]">
                    {template.name}
                  </h3>
                  {(() => {
                    const originalBlockType = template.defaultContent?.originalBlockType;
                    const category = getCategoryLabel(originalBlockType);
                    return (
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${category.color}`}>
                        {category.icon} {category.label}
                      </span>
                    );
                  })()}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditMetadata(template.id);
                    }}
                    className="text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors"
                    title="Név és leírás szerkesztése"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                </div>
                {template.description && (
                  <p className="text-sm text-[var(--color-muted)] mt-1">
                    {template.description}
                  </p>
                )}
              </div>
            )}
          </div>
          {!editingMetadata && (
            <div className="flex items-center gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleActive(template.id, template.isActive);
                }}
                className={`px-3 py-1 text-xs font-medium rounded-full ${
                  template.isActive
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {template.isActive ? 'Aktív' : 'Inaktív'}
              </button>
            </div>
          )}
        </div>

        {/* Preview */}
        {viewMode === 'preview' && (
          <div className="mt-4">
            <div className="text-xs text-[var(--color-muted)] font-medium mb-2">Előnézet:</div>
            <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
              {/* PUCK_CONTENT típusnál a puckData mező tartalmazza a Puck adatokat */}
              {template.blockType === 'PUCK_CONTENT' && template.defaultContent?.puckData?.content?.length > 0 ? (
                <PuckRenderer data={template.defaultContent.puckData} />
              ) : template.blockType !== 'PUCK_CONTENT' ? (
                <div className="p-8 text-center text-gray-400">
                  <div className="text-4xl mb-2">📋</div>
                  <p className="font-medium">{template.blockType}</p>
                  <p className="text-sm mt-1">Régi típusú sablon</p>
                </div>
              ) : (
                <div className="p-8 text-center text-gray-400">
                  <div className="text-4xl mb-2">🎨</div>
                  <p>Üres Puck sablon</p>
                  <p className="text-sm mt-1">Kattints a szerkesztéshez</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TemplatesPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<BlockTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingMetadata, setEditingMetadata] = useState<EditingTemplate | null>(null);
  const [saving, setSaving] = useState(false);
  const [viewMode, setViewMode] = useState<'preview' | 'compact'>('preview');
  const [selectedBrand, setSelectedBrand] = useState<'BOOM' | 'AIBOOST'>('BOOM');
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchTemplates();
  }, [selectedBrand]);

  // Scroll to last edited template when returning from editor
  useEffect(() => {
    if (templates.length === 0) return;

    const lastEditedId = sessionStorage.getItem('lastEditedTemplateId');
    if (lastEditedId) {
      // Clear immediately so it doesn't persist
      sessionStorage.removeItem('lastEditedTemplateId');

      // Check if template exists in current list
      const templateExists = templates.some(t => t.id === lastEditedId);
      if (!templateExists) return;

      // Small delay to ensure DOM is ready
      setTimeout(() => {
        const element = document.getElementById(`template-${lastEditedId}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          // Highlight the template briefly
          setHighlightedId(lastEditedId);
          // Remove highlight after animation
          setTimeout(() => setHighlightedId(null), 2000);
        }
      }, 100);
    }
  }, [templates]);

  const fetchTemplates = async () => {
    try {
      const response = await fetch(`/api/block-templates?brand=${selectedBrand}`);
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setTemplates(data);
    } catch (error) {
      console.error('Error fetching templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEditor = (templateId: string) => {
    // Save template ID for scroll-to on return
    sessionStorage.setItem('lastEditedTemplateId', templateId);
    // Navigate to Puck editor page
    router.push(`/dashboard/templates/${templateId}/edit`);
  };

  const handleToggleActive = async (templateId: string, currentState: boolean) => {
    try {
      await fetch(`/api/block-templates/${templateId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isActive: !currentState,
        }),
      });
      await fetchTemplates();
    } catch (error) {
      console.error('Error toggling template:', error);
    }
  };

  const handleDelete = async (templateId: string) => {
    setDeletingIds(prev => new Set(prev).add(templateId));

    setTimeout(async () => {
      try {
        const response = await fetch(`/api/block-templates/${templateId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          await fetchTemplates();
          setDeletingIds(prev => {
            const newSet = new Set(prev);
            newSet.delete(templateId);
            return newSet;
          });
        } else {
          console.error('Failed to delete template');
          setDeletingIds(prev => {
            const newSet = new Set(prev);
            newSet.delete(templateId);
            return newSet;
          });
        }
      } catch (error) {
        console.error('Error deleting template:', error);
        setDeletingIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(templateId);
          return newSet;
        });
      }
    }, 600);
  };

  const saveTemplateOrder = async (reorderedTemplates: BlockTemplate[]) => {
    try {
      const templatesToUpdate = reorderedTemplates.map((template, index) => ({
        id: template.id,
        displayOrder: index,
      }));

      await fetch('/api/block-templates', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templates: templatesToUpdate }),
      });
    } catch (error) {
      console.error('Error saving template order:', error);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = templates.findIndex((item) => item.id === active.id);
      const newIndex = templates.findIndex((item) => item.id === over.id);
      const newTemplates = arrayMove(templates, oldIndex, newIndex);
      setTemplates(newTemplates);
      await saveTemplateOrder(newTemplates);
    }
  };

  const scrollToTemplate = (templateId: string) => {
    // Small delay to allow React to re-render after state change
    setTimeout(() => {
      const element = document.getElementById(`template-${templateId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 50);
  };

  const handleMoveUp = async (templateId: string) => {
    const currentIndex = templates.findIndex(t => t.id === templateId);
    if (currentIndex <= 0) return;

    const newTemplates = [...templates];
    [newTemplates[currentIndex - 1], newTemplates[currentIndex]] =
      [newTemplates[currentIndex], newTemplates[currentIndex - 1]];
    setTemplates(newTemplates);
    scrollToTemplate(templateId);
    await saveTemplateOrder(newTemplates);
  };

  const handleMoveDown = async (templateId: string) => {
    const currentIndex = templates.findIndex(t => t.id === templateId);
    if (currentIndex >= templates.length - 1) return;

    const newTemplates = [...templates];
    [newTemplates[currentIndex], newTemplates[currentIndex + 1]] =
      [newTemplates[currentIndex + 1], newTemplates[currentIndex]];
    setTemplates(newTemplates);
    scrollToTemplate(templateId);
    await saveTemplateOrder(newTemplates);
  };

  const handleMoveToTop = async (templateId: string) => {
    const currentIndex = templates.findIndex(t => t.id === templateId);
    if (currentIndex <= 0) return;

    const templateToMove = templates[currentIndex];
    const newTemplates = [
      templateToMove,
      ...templates.slice(0, currentIndex),
      ...templates.slice(currentIndex + 1),
    ];
    setTemplates(newTemplates);
    scrollToTemplate(templateId);
    await saveTemplateOrder(newTemplates);
  };

  const handleEditMetadata = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setEditingMetadata({
        id: template.id,
        name: template.name,
        description: template.description,
      });
    }
  };

  const handleSaveMetadata = async (templateId: string, name: string, description: string | null) => {
    if (!name.trim()) {
      alert('A név nem lehet üres!');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(`/api/block-templates/${templateId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          description: description?.trim() || null,
        }),
      });

      if (response.ok) {
        await fetchTemplates();
        setEditingMetadata(null);
      }
    } catch (error) {
      console.error('Error saving metadata:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancelMetadata = () => {
    setEditingMetadata(null);
  };

  const handleMetadataChange = (field: 'name' | 'description', value: string) => {
    if (editingMetadata) {
      setEditingMetadata({
        ...editingMetadata,
        [field]: value,
      });
    }
  };

  const handleCreateNew = async () => {
    try {
      const payload = {
        name: `Új Puck sablon ${new Date().toLocaleDateString('hu-HU')}`,
        description: 'Vizuálisan szerkeszthető sablon',
        brand: selectedBrand,
        blockType: 'PUCK_CONTENT',
        defaultContent: {
          title: 'Új szekció',
          puckData: {
            content: [],
            root: { props: {} },
          },
        },
      };

      const response = await fetch('/api/block-templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const result = await response.json();
        // Save template ID for scroll-to on return
        sessionStorage.setItem('lastEditedTemplateId', result.id);
        // Navigate directly to editor for new template
        router.push(`/dashboard/templates/${result.id}/edit`);
      } else {
        const error = await response.json();
        alert(`Hiba: ${error.error || 'Nem sikerült létrehozni'}`);
      }
    } catch (error) {
      console.error('Error creating template:', error);
      alert('Hiba történt a sablon létrehozásakor');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-[var(--color-text)]">Betöltés...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-background-alt)]">
      {/* Header */}
      <div className="bg-white border-b border-[var(--color-border)] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <button
                onClick={() => router.push('/dashboard')}
                className="text-[var(--color-primary)] hover:underline text-sm"
              >
                ← Vissza a főoldalra
              </button>
              <h1 className="text-xl font-bold text-[var(--color-text)] mt-1">
                Puck sablonok kezelése
              </h1>
            </div>
            <div className="flex items-center gap-4">
              {/* Brand Selector */}
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setSelectedBrand('BOOM')}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    selectedBrand === 'BOOM'
                      ? 'bg-white text-[var(--color-text)] shadow-sm font-medium'
                      : 'text-[var(--color-muted)] hover:text-[var(--color-text)]'
                  }`}
                >
                  💥 BOOM
                </button>
                <button
                  onClick={() => setSelectedBrand('AIBOOST')}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    selectedBrand === 'AIBOOST'
                      ? 'bg-white text-[var(--color-text)] shadow-sm font-medium'
                      : 'text-[var(--color-muted)] hover:text-[var(--color-text)]'
                  }`}
                >
                  🤖 AIBOOST
                </button>
              </div>

              {/* View Mode Selector */}
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('preview')}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    viewMode === 'preview'
                      ? 'bg-white text-[var(--color-text)] shadow-sm font-medium'
                      : 'text-[var(--color-muted)] hover:text-[var(--color-text)]'
                  }`}
                >
                  👁️ Előnézet
                </button>
                <button
                  onClick={() => setViewMode('compact')}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    viewMode === 'compact'
                      ? 'bg-white text-[var(--color-text)] shadow-sm font-medium'
                      : 'text-[var(--color-muted)] hover:text-[var(--color-text)]'
                  }`}
                >
                  📋 Kompakt
                </button>
              </div>

              {/* Add New Button */}
              <Button
                onClick={handleCreateNew}
                className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600"
              >
                + Új sablon
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pl-20">
        <div className="mb-6">
          <p className="text-[var(--color-muted)]">
            Kattints egy sablonra a Puck szerkesztő megnyitásához. A módosítások mentése után visszatérsz ide.
          </p>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={templates.map(t => t.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-6">
              {templates.map((template, index) => (
                <SortableTemplateItem
                  key={template.id}
                  template={template}
                  index={index}
                  totalCount={templates.length}
                  editingMetadata={editingMetadata}
                  viewMode={viewMode}
                  isDeleting={deletingIds.has(template.id)}
                  isHighlighted={highlightedId === template.id}
                  onOpenEditor={handleOpenEditor}
                  onToggleActive={handleToggleActive}
                  onDelete={handleDelete}
                  onEditMetadata={handleEditMetadata}
                  onSaveMetadata={handleSaveMetadata}
                  onCancelMetadata={handleCancelMetadata}
                  onMetadataChange={handleMetadataChange}
                  onMoveUp={handleMoveUp}
                  onMoveDown={handleMoveDown}
                  onMoveToTop={handleMoveToTop}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {templates.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl">
            <div className="text-6xl mb-4">🎨</div>
            <h3 className="text-xl font-semibold text-[var(--color-text)] mb-2">
              Még nincsenek sablonok
            </h3>
            <p className="text-[var(--color-muted)] mb-4">
              Hozz létre egy új sablont a Puck vizuális szerkesztővel.
            </p>
            <Button
              onClick={handleCreateNew}
              className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600"
            >
              + Első sablon létrehozása
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
