'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { BlockEditor, AVAILABLE_FIELDS, EditorState } from '@/components/builder/BlockEditor';
import { BlockRenderer } from '@/components/builder/BlockRenderer';
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
  blockType: string;
  name: string;
  description: string | null;
  defaultContent: any;
  isActive: boolean;
  displayOrder: number;
  brand: 'BOOM' | 'AIBOOST';
}

interface SortableTemplateItemProps {
  template: BlockTemplate;
  editingId: string | null;
  viewMode: 'preview' | 'compact';
  onEdit: (id: string) => void;
  onToggleActive: (id: string, currentState: boolean) => void;
  onSave: (id: string, newContent: any, newBrand?: 'BOOM' | 'AIBOOST') => void;
  onCancel: () => void;
  onDelete: (id: string) => void;
}

function SortableTemplateItem({
  template,
  editingId,
  viewMode,
  onEdit,
  onToggleActive,
  onSave,
  onCancel,
  onDelete,
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
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group"
    >
      {/* Drag Handle and Delete Button */}
      <div className="absolute -left-12 top-6 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-2">
        <button
          {...attributes}
          {...listeners}
          className="w-8 h-8 rounded bg-white border border-[var(--color-border)] hover:border-[var(--color-primary)] flex items-center justify-center cursor-grab active:cursor-grabbing"
          title="Húzd ide a sablon átrendezéséhez"
        >
          <span className="text-[var(--color-muted)]">⋮⋮</span>
        </button>
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
        className={`bg-white rounded-xl border-2 p-6 ${
          !template.isActive ? 'opacity-50 border-gray-200' : 'border-[var(--color-border)]'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-[var(--color-text)]">
              {template.blockType.replace(/_/g, ' ')}
            </h3>
            {template.description && (
              <p className="text-sm text-[var(--color-muted)] mt-1">
                {template.description}
              </p>
            )}
          </div>
          <div className="flex items-center gap-3">
            {/* Active toggle */}
            <button
              onClick={() => onToggleActive(template.id, template.isActive)}
              className={`px-3 py-1 text-xs font-medium rounded-full ${
                template.isActive
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {template.isActive ? 'Aktív' : 'Inaktív'}
            </button>

            {/* Edit button */}
            <Button
              onClick={() => onEdit(template.id)}
              variant={editingId === template.id ? 'default' : 'outline'}
              size="sm"
            >
              {editingId === template.id ? '✏️ Szerkesztés...' : '✏️ Szerkesztés'}
            </Button>
          </div>
        </div>

        {/* Preview - Preview Mode */}
        {viewMode === 'preview' && editingId !== template.id && (
          <div className="mt-4 border border-[var(--color-border)] rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 border-b border-[var(--color-border)]">
              <div className="text-xs text-[var(--color-muted)] font-medium">Kinézet előnézet:</div>
            </div>
            <div className="p-4">
              <BlockRenderer
                block={{
                  id: template.id,
                  blockType: template.blockType,
                  displayOrder: template.displayOrder,
                  isEnabled: template.isActive,
                  content: template.defaultContent,
                } as any}
                brand={template.brand}
                proposalData={{
                  clientName: '{{clientName}}',
                  createdByName: '{{createdByName}}',
                }}
              />
            </div>
          </div>
        )}

        {/* Editor */}
        {editingId === template.id && (
          <BlockEditor
            block={{
              id: template.id,
              blockType: template.blockType,
              content: template.defaultContent,
              brand: template.brand,
            }}
            onSave={(newContent, newBrand) => onSave(template.id, newContent, newBrand)}
            onCancel={onCancel}
            allowBrandChange={true}
          />
        )}
      </div>
    </div>
  );
}

export default function TemplatesPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<BlockTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [viewMode, setViewMode] = useState<'preview' | 'compact'>('preview');
  const [selectedBrand, setSelectedBrand] = useState<'BOOM' | 'AIBOOST'>('BOOM');
  const [showFieldsDropdown, setShowFieldsDropdown] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchTemplates();
  }, [selectedBrand]);

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

  const handleEdit = (templateId: string) => {
    setEditingId(editingId === templateId ? null : templateId);
  };

  const handleSave = async (templateId: string, newContent: any, newBrand?: 'BOOM' | 'AIBOOST') => {
    setSaving(true);
    try {
      const updateData: any = {
        defaultContent: newContent,
      };

      // Only include brand if it was provided (brand change is enabled)
      if (newBrand) {
        updateData.brand = newBrand;
      }

      const response = await fetch(`/api/block-templates/${templateId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        await fetchTemplates();
        setEditingId(null);
      }
    } catch (error) {
      console.error('Error saving template:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  const handleToggleActive = async (templateId: string, currentState: boolean) => {
    try {
      const template = templates.find(t => t.id === templateId);
      if (!template) return;

      await fetch(`/api/block-templates/${templateId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          defaultContent: template.defaultContent,
          isActive: !currentState,
        }),
      });

      await fetchTemplates();
    } catch (error) {
      console.error('Error toggling template:', error);
    }
  };

  const handleDelete = async (templateId: string) => {
    try {
      const response = await fetch(`/api/block-templates/${templateId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchTemplates();
      } else {
        console.error('Failed to delete template');
      }
    } catch (error) {
      console.error('Error deleting template:', error);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setTemplates((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        const newItems = arrayMove(items, oldIndex, newIndex);

        // Update displayOrder for all items
        const updatedItems = newItems.map((item, index) => ({
          ...item,
          displayOrder: index,
        }));

        // Save the new order to the backend
        setTimeout(() => saveTemplateOrder(updatedItems), 0);
        return updatedItems;
      });
    }
  };

  const saveTemplateOrder = async (orderedTemplates: BlockTemplate[]) => {
    try {
      // Update each template's displayOrder
      await Promise.all(
        orderedTemplates.map((template) =>
          fetch(`/api/block-templates/${template.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              defaultContent: template.defaultContent,
              displayOrder: template.displayOrder,
            }),
          })
        )
      );
      console.log('✅ Sablon sorrend mentve');
    } catch (error) {
      console.error('Error saving template order:', error);
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
                Blokk sablonok kezelése
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
                👁️ Kinézet
              </button>
              <button
                onClick={() => setViewMode('compact')}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  viewMode === 'compact'
                    ? 'bg-white text-[var(--color-text)] shadow-sm font-medium'
                    : 'text-[var(--color-muted)] hover:text-[var(--color-text)]'
                }`}
              >
                📋 Összecsukva
              </button>
            </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pl-20">
        <div className="mb-6">
          <p className="text-[var(--color-muted)]">
            Ezek a sablonok határozzák meg az új ajánlatokba automatikusan betöltődő blokkok tartalmát.
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
              {templates.map((template) => (
                <SortableTemplateItem
                  key={template.id}
                  template={template}
                  editingId={editingId}
                  viewMode={viewMode}
                  onEdit={handleEdit}
                  onToggleActive={handleToggleActive}
                  onSave={handleSave}
                  onCancel={handleCancel}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {templates.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-[var(--color-text)] mb-2">
              Még nincsenek sablonok
            </h3>
            <p className="text-[var(--color-muted)]">
              Hozz létre egy új ajánlatot, hogy létrejöjjenek az alapértelmezett sablonok.
            </p>
          </div>
        )}
      </div>

      {/* Full-width Sticky Bottom Bar - Only visible when editing */}
      {editingId && (
        <div className="fixed bottom-0 left-0 right-0 bg-[#3e4581] border-t-2 border-[#2d3563] shadow-2xl z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between gap-6">
              {/* Left side: Brand Selector and Fields */}
              <div className="flex items-center gap-3">
                {/* Brand Selector */}
                <button
                  onClick={() => {
                    const editorState = (window as any).__editorState as EditorState;
                    if (editorState) editorState.setBrand('BOOM');
                  }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-xl transition-all ${
                    (window as any).__editorState?.brand === 'BOOM'
                      ? 'bg-[#fa604a] shadow-lg scale-110'
                      : 'bg-white/10 hover:bg-white/20'
                  }`}
                  title="BOOM"
                >
                  💥
                </button>
                <button
                  onClick={() => {
                    const editorState = (window as any).__editorState as EditorState;
                    if (editorState) editorState.setBrand('AIBOOST');
                  }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-xl transition-all ${
                    (window as any).__editorState?.brand === 'AIBOOST'
                      ? 'bg-[#fa604a] shadow-lg scale-110'
                      : 'bg-white/10 hover:bg-white/20'
                  }`}
                  title="AIBOOST"
                >
                  🤖
                </button>

                {/* Beszúrható mezők dropdown */}
                <div className="relative ml-2">
                  <button
                    onClick={() => setShowFieldsDropdown(!showFieldsDropdown)}
                    className="w-10 h-10 rounded-full bg-[#fa604a] hover:bg-[#e54030] flex items-center justify-center text-xl transition-all shadow-lg"
                    title="Beszúrható mezők"
                  >
                    📋
                  </button>
                  {showFieldsDropdown && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowFieldsDropdown(false)}
                      />
                      <div className="absolute bottom-full left-0 mb-2 w-64 bg-white border border-gray-300 rounded-lg shadow-xl z-50 max-h-64 overflow-y-auto">
                        <div className="p-2 border-b border-gray-200 bg-gray-50">
                          <div className="text-xs font-medium text-[var(--color-text)]">
                            Beszúrható mezők
                          </div>
                        </div>
                        <div className="p-2 space-y-1">
                          {AVAILABLE_FIELDS.map((field) => (
                            <button
                              key={field.value}
                              onClick={() => {
                                const editorState = (window as any).__editorState as EditorState;
                                if (editorState) {
                                  editorState.insertField(field.value);
                                  setShowFieldsDropdown(false);
                                }
                              }}
                              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded transition-colors"
                            >
                              <div className="font-medium text-[var(--color-text)]">
                                {field.label}
                              </div>
                              <div className="text-xs text-[var(--color-muted)] mt-0.5">
                                {field.description}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Center: Editing title */}
              <div className="flex-1 text-center">
                <span className="text-base font-bold text-white">
                  Szerkesztés: {templates.find(t => t.id === editingId)?.blockType.replace(/_/g, ' ')}
                </span>
              </div>

              {/* Right side: Action buttons */}
              <div className="flex items-center gap-3">
                <Button
                  onClick={handleCancel}
                  className="bg-white/10 text-white hover:bg-white/20 border-0 backdrop-blur-sm"
                  size="sm"
                >
                  Mégse
                </Button>
                <Button
                  onClick={() => {
                    const editorState = (window as any).__editorState as EditorState;
                    if (editorState && !editorState.parseError) {
                      editorState.handleSave();
                    }
                  }}
                  disabled={saving || (window as any).__editorState?.parseError}
                  className="bg-[#fa604a] text-white hover:bg-[#e54030] border-0 font-semibold shadow-lg disabled:opacity-50"
                  size="sm"
                >
                  {saving ? 'Mentés...' : '💾 Mentés'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
