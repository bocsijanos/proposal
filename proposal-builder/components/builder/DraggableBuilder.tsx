'use client';

import { useState } from 'react';
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
} from '@dnd-kit/sortable';
import { SortableBlock } from './SortableBlock';

interface Block {
  id: string;
  blockType: string;
  displayOrder: number;
  isEnabled: boolean;
  content: any;
}

interface DraggableBuilderProps {
  blocks: Block[];
  brand: 'BOOM' | 'AIBOOST';
  onReorder: (blocks: Block[]) => void;
  onEdit?: (blockId: string, newContent: any) => void;
  onToggle?: (blockId: string) => void;
  onDelete?: (blockId: string) => void;
  onSaveAsTemplate?: (blockId: string) => void;
}

export function DraggableBuilder({
  blocks,
  brand,
  onReorder,
  onEdit,
  onToggle,
  onDelete,
  onSaveAsTemplate,
}: DraggableBuilderProps) {
  const [items, setItems] = useState(blocks);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        const newItems = arrayMove(items, oldIndex, newIndex);

        // Update displayOrder
        const updatedItems = newItems.map((item, index) => ({
          ...item,
          displayOrder: index,
        }));

        // Call onReorder asynchronously to avoid setState during render
        setTimeout(() => onReorder(updatedItems), 0);
        return updatedItems;
      });
    }
  };

  if (blocks.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-[var(--color-border)]">
        <div className="text-6xl mb-4">📦</div>
        <h3 className="text-xl font-semibold text-[var(--color-text)] mb-2">
          Még nincs blokk
        </h3>
        <p className="text-[var(--color-muted)] mb-6">
          Add hozzá az első blokkot az árajánlathoz
        </p>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map(item => item.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-4">
          {items.map((block) => (
            <SortableBlock
              key={block.id}
              block={block}
              brand={brand}
              onEdit={onEdit}
              onToggle={onToggle}
              onDelete={onDelete}
              onSaveAsTemplate={onSaveAsTemplate}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
