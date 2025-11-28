'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { BlockRenderer } from '@/components/builder/BlockRenderer';
import { useTheme, Brand } from '@/components/providers/ThemeProvider';

// Dynamic import for PuckEditor (client-only, heavy component)
const PuckEditor = dynamic(
  () => import('@/components/puck/PuckEditor').then((mod) => mod.PuckEditor),
  { ssr: false, loading: () => <div className="p-4 text-center">WYSIWYG betöltése...</div> }
);

interface BlockEditorProps {
  block: {
    id: string;
    blockType: string;
    content: any;
    brand?: Brand;
  };
  onSave: (content: any, brand?: Brand) => void;
  onCancel: () => void;
}

// Available placeholders for dynamic content - grouped by category
export const AVAILABLE_FIELD_GROUPS = [
  {
    label: 'Ügyfél adatok',
    icon: '🏢',
    color: 'blue',
    fields: [
      { label: 'Cég neve', value: '{{clientName}}', description: 'Az ügyfél cég neve' },
      { label: 'Kapcsolattartó', value: '{{clientContactName}}', description: 'Kapcsolattartó teljes neve' },
      { label: 'Telefon', value: '{{clientPhone}}', description: 'Ügyfél telefonszáma' },
      { label: 'Email', value: '{{clientEmail}}', description: 'Ügyfél email címe' },
    ],
  },
  {
    label: 'Admin adatok',
    icon: '👔',
    color: 'purple',
    fields: [
      { label: 'Név', value: '{{adminName}}', description: 'Az ajánlatot készítő neve' },
      { label: 'Email', value: '{{adminEmail}}', description: 'Az ajánlatot készítő email címe' },
      { label: 'Telefon', value: '{{adminPhone}}', description: 'Az ajánlatot készítő telefonszáma' },
      { label: 'Profilkép', value: '{{adminAvatar}}', description: 'Az ajánlatot készítő profilképe (URL)' },
    ],
  },
];

// Legacy flat export for backward compatibility
export const AVAILABLE_FIELDS = AVAILABLE_FIELD_GROUPS.flatMap(g => g.fields);

// Export editor state data for parent component to use
export interface EditorState {
  content: string;
  brand: Brand;
  parseError: boolean;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  setBrand: (brand: Brand) => void;
  setContent: (content: string) => void;
  insertField: (fieldValue: string) => void;
  handleSave: () => void;
}

/**
 * BlockEditor component for editing Puck block content
 * Brand is sourced from the global ThemeProvider
 */
export function BlockEditor({ block, onSave, onCancel }: BlockEditorProps) {
  // Get brand from global ThemeProvider
  const { theme: brand, setTheme: setBrand } = useTheme();

  // Initialize with the exact content from block prop
  const initialContent = useMemo(() => JSON.stringify(block.content, null, 2), [block.id]);

  const [content, setContent] = useState(initialContent);
  // PUCK_CONTENT blocks always open in WYSIWYG mode
  const [editorMode, setEditorMode] = useState<'json' | 'wysiwyg'>(
    block.blockType === 'PUCK_CONTENT' ? 'wysiwyg' : 'json'
  );
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
  }, [block.id]);

  const handleSave = () => {
    try {
      const parsed = JSON.parse(content);
      console.log('Saving content:', parsed);
      onSave(parsed, brand);
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
    };
  }, [content, brand, parseError]);

  return (
    <div className="mt-4 bg-gray-50 rounded-lg border border-gray-200">
      {/* Vertical layout: Live Preview (top) + Editor (bottom) */}
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
                  content: parsedContent,
                }}
                brand={brand}
                proposalData={{
                  clientName: '{{clientName}}',
                  createdByName: '{{createdByName}}',
                }}
              />
            ) : (
              <div className="p-4 text-center">
                <div className="text-red-500 text-sm">
                  A JSON szintaxis hibás. Javítsd a lenti szerkesztőben.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Editor Mode Toggle */}
        {block.blockType === 'PUCK_CONTENT' && (
          <div className="flex items-center justify-between border-t border-gray-200 pt-4">
            <label className="text-sm font-medium text-[var(--color-text)]">
              Szerkesztő mód
            </label>
            <div className="flex gap-2 bg-white border border-gray-300 rounded-lg p-1">
              <button
                onClick={() => setEditorMode('json')}
                className={`px-4 py-2 text-sm font-medium rounded transition-colors ${
                  editorMode === 'json'
                    ? 'bg-[var(--color-primary)] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                JSON Editor
              </button>
              <button
                onClick={() => setEditorMode('wysiwyg')}
                className={`px-4 py-2 text-sm font-medium rounded transition-colors ${
                  editorMode === 'wysiwyg'
                    ? 'bg-[var(--color-primary)] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                WYSIWYG
              </button>
            </div>
          </div>
        )}

        {/* Bottom: JSON Editor or WYSIWYG Editor */}
        <div className="space-y-2 mb-24">
          {editorMode === 'wysiwyg' && block.blockType === 'PUCK_CONTENT' ? (
            // WYSIWYG Editor (Puck-based visual editor) - Fullscreen Modal
            <div className="fixed inset-0 z-50 bg-white flex flex-col">
              {/* Fullscreen header */}
              <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50 shrink-0">
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-semibold text-gray-800">
                    WYSIWYG Vizuális Szerkesztő
                  </h2>
                  <span className="text-sm text-gray-500">
                    {block.blockType}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      // Auto-save before closing WYSIWYG editor
                      try {
                        const parsed = JSON.parse(content);
                        console.log('[BlockEditor] Auto-saving WYSIWYG content:', parsed);
                        onSave(parsed, brand);
                      } catch (e) {
                        console.error('[BlockEditor] Failed to save WYSIWYG content:', e);
                      }
                      setEditorMode('json');
                    }}
                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Mentés és Bezárás
                  </button>
                  <button
                    onClick={() => setEditorMode('json')}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Bezárás mentés nélkül
                  </button>
                </div>
              </div>
              {/* Fullscreen Puck editor */}
              <div className="flex-1 min-h-0">
                <PuckEditor
                  initialData={parsedContent?.puckData || { content: [], root: { props: {} } }}
                  onChange={(data) => {
                    const newContent = { ...parsedContent, puckData: data };
                    setContent(JSON.stringify(newContent, null, 2));
                  }}
                />
              </div>
            </div>
          ) : (
            // JSON Editor
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-[var(--color-text)]">
                  JSON Szerkesztő
                </label>
                {parseError && (
                  <span className="text-xs text-red-600 font-medium">
                    Hibás JSON szintaxis
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
          )}
        </div>
      </div>
    </div>
  );
}
