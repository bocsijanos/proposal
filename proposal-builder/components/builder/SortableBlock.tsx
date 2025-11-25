'use client';

import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { BlockRenderer } from './BlockRenderer';
import { BlockEditor } from './BlockEditor';
import { Button } from '@/components/ui/button';

interface Block {
  id: string;
  blockType: string;
  displayOrder: number;
  isEnabled: boolean;
  content: any;
}

interface SortableBlockProps {
  block: Block;
  brand: 'BOOM' | 'AIBOOST';
  proposalData?: {
    clientName: string;
    clientContactName?: string | null;
    clientPhone?: string | null;
    clientEmail?: string | null;
    createdByName?: string | null;
  };
  onEdit?: (blockId: string, newContent: any) => void;
  onToggle?: (blockId: string) => void;
  onDelete?: (blockId: string) => void;
  onSaveAsTemplate?: (blockId: string) => void;
}

export function SortableBlock({
  block,
  brand,
  proposalData,
  onEdit,
  onToggle,
  onDelete,
  onSaveAsTemplate,
}: SortableBlockProps) {
  const [isEditing, setIsEditing] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = (newContent: any) => {
    if (onEdit) {
      onEdit(block.id, newContent);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group"
    >
      {/* Drag Handle & Controls */}
      <div className="absolute -left-12 top-0 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        {/* Drag handle */}
        <button
          {...attributes}
          {...listeners}
          className="w-8 h-8 rounded bg-white border border-[var(--color-border)] hover:border-[var(--color-primary)] flex items-center justify-center cursor-grab active:cursor-grabbing"
          title="Húzd ide a blokk átrendezéséhez"
        >
          <span className="text-[var(--color-muted)]">⋮⋮</span>
        </button>

        {/* Edit button */}
        {onEdit && (
          <button
            onClick={handleEditClick}
            className={`w-8 h-8 rounded bg-white border flex items-center justify-center ${
              isEditing
                ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white'
                : 'border-[var(--color-border)] hover:border-[var(--color-primary)]'
            }`}
            title={isEditing ? 'Szerkesztés bezárása' : 'Szerkesztés'}
          >
            ✏️
          </button>
        )}

        {/* Toggle visibility */}
        {onToggle && (
          <button
            onClick={() => onToggle(block.id)}
            className="w-8 h-8 rounded bg-white border border-[var(--color-border)] hover:border-[var(--color-primary)] flex items-center justify-center"
            title={block.isEnabled ? 'Elrejtés' : 'Megjelenítés'}
          >
            {block.isEnabled ? '👁️' : '👁️‍🗨️'}
          </button>
        )}

        {/* Save as Template button */}
        {onSaveAsTemplate && (
          <button
            onClick={() => onSaveAsTemplate(block.id)}
            className="w-8 h-8 rounded bg-white border border-[var(--color-border)] hover:border-green-500 hover:bg-green-50 flex items-center justify-center"
            title="Mentés sablonként"
          >
            📋
          </button>
        )}

        {/* Delete button */}
        {onDelete && (
          <button
            onClick={() => onDelete(block.id)}
            className="w-8 h-8 rounded bg-white border border-red-300 hover:border-red-500 hover:bg-red-50 flex items-center justify-center"
            title="Törlés"
          >
            🗑️
          </button>
        )}
      </div>

      {/* Block Content */}
      <div className={`bg-white rounded-xl border-2 border-[var(--color-border)] p-6 ${
        !block.isEnabled ? 'opacity-50' : ''
      }`}>
        {/* Block type badge */}
        <div className="mb-4 flex items-center justify-between">
          <span className="text-xs font-medium text-[var(--color-muted)] uppercase tracking-wider">
            {block.blockType.replace(/_/g, ' ')}
          </span>
          {!block.isEnabled && (
            <span className="text-xs text-red-600 font-medium">
              (Elrejtve)
            </span>
          )}
        </div>

        {/* Render the actual block */}
        <BlockRenderer block={block} brand={brand} proposalData={proposalData} />

        {/* Inline Editor */}
        {isEditing && (
          <BlockEditor
            block={block}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        )}
      </div>
    </div>
  );
}
