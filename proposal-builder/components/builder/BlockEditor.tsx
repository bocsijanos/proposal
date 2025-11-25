'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { BlockRenderer } from '@/components/builder/BlockRenderer';

interface BlockEditorProps {
  block: {
    id: string;
    blockType: string;
    content: any;
    brand?: 'BOOM' | 'AIBOOST';
  };
  onSave: (content: any, brand?: 'BOOM' | 'AIBOOST') => void;
  onCancel: () => void;
  allowBrandChange?: boolean;
}

// Available placeholders for dynamic content - exported for use in parent
export const AVAILABLE_FIELDS = [
  { label: 'Ügyfél neve', value: '{{clientName}}', description: 'Az ügyfél cég neve' },
  { label: 'Kapcsolattartó neve', value: '{{clientContactName}}', description: 'Kapcsolattartó teljes neve' },
  { label: 'Telefon', value: '{{clientPhone}}', description: 'Ügyfél telefonszáma' },
  { label: 'Email', value: '{{clientEmail}}', description: 'Ügyfél email címe' },
  { label: 'Létrehozó neve', value: '{{createdByName}}', description: 'Ajánlatot készítő neve' },
];

// Export editor state data for parent component to use
export interface EditorState {
  content: string;
  brand: 'BOOM' | 'AIBOOST';
  parseError: boolean;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  setBrand: (brand: 'BOOM' | 'AIBOOST') => void;
  setContent: (content: string) => void;
  insertField: (fieldValue: string) => void;
  handleSave: () => void;
}

export function BlockEditor({ block, onSave, onCancel, allowBrandChange = false }: BlockEditorProps) {
  // Initialize with the exact content from block prop
  const initialContent = useMemo(() => JSON.stringify(block.content, null, 2), [block.id]);

  const [content, setContent] = useState(initialContent);
  const [brand, setBrand] = useState<'BOOM' | 'AIBOOST'>(block.brand || 'BOOM');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Update content when block ID changes (switching templates)
  useEffect(() => {
    console.log('BlockEditor: Block changed', {
      blockId: block.id,
      blockType: block.blockType,
      contentKeys: Object.keys(block.content),
      sampleContent: JSON.stringify(block.content).substring(0, 100)
    });

    const newContent = JSON.stringify(block.content, null, 2);
    setContent(newContent);
    setBrand(block.brand || 'BOOM');
  }, [block.id]);

  const handleSave = () => {
    try {
      const parsed = JSON.parse(content);
      console.log('Saving content:', parsed);
      onSave(parsed, allowBrandChange ? brand : undefined);
    } catch (e) {
      // Error will be shown in parent component
    }
  };

  const insertField = (fieldValue: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = content;
    const before = text.substring(0, start);
    const after = text.substring(end);

    const newContent = before + fieldValue + after;
    setContent(newContent);

    // Set cursor position after inserted field
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + fieldValue.length, start + fieldValue.length);
    }, 0);
  };

  // Parse JSON for live preview (with error handling)
  const { parsedContent, parseError } = useMemo(() => {
    try {
      const parsed = JSON.parse(content);
      console.log('Parsed content for preview:', parsed);
      return { parsedContent: parsed, parseError: false };
    } catch (e) {
      console.log('Parse error, using fallback');
      return { parsedContent: block.content, parseError: true };
    }
  }, [content, block.content]);

  // Expose editor state for parent component (stored in window for access)
  useEffect(() => {
    (window as any).__editorState = {
      content,
      brand,
      parseError,
      textareaRef,
      setBrand,
      setContent,
      insertField,
      handleSave,
      onCancel,
      allowBrandChange,
    };
  }, [content, brand, parseError, allowBrandChange]);

  return (
    <div className="mt-4 bg-gray-50 rounded-lg border border-gray-200">
      {/* Vertical layout: Live Preview (top) + JSON Editor (bottom) */}
      <div className="space-y-4 p-6">
        {/* Top: Live Preview */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--color-text)]">
            Élő Előnézet
          </label>
          <div className="border border-gray-300 rounded bg-white overflow-auto max-h-[600px]">
            {!parseError ? (
              <BlockRenderer
                block={{
                  id: block.id,
                  blockType: block.blockType,
                  displayOrder: 0,
                  isEnabled: true,
                  content: parsedContent,
                } as any}
                brand={brand}
                proposalData={{
                  clientName: '{{clientName}}',
                  createdByName: '{{createdByName}}',
                } as any}
              />
            ) : (
              <div className="p-4 text-center">
                <div className="text-red-500 text-sm">
                  ⚠️ A JSON szintaxis hibás. Javítsd a lenti szerkesztőben.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom: JSON Editor (compact) */}
        <div className="space-y-2 mb-24">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-[var(--color-text)]">
              JSON Szerkesztő
            </label>
            {parseError && (
              <span className="text-xs text-red-600 font-medium">
                ⚠️ Hibás JSON szintaxis
              </span>
            )}
          </div>
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-32 font-mono text-xs p-3 rounded border border-gray-300 focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] bg-white resize-y"
            placeholder="{ ... }"
          />
        </div>
      </div>
    </div>
  );
}
