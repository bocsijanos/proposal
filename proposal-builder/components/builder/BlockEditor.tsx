'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';

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

// Available placeholders for dynamic content
const AVAILABLE_FIELDS = [
  { label: 'Ügyfél neve', value: '{{clientName}}', description: 'Az ügyfél cég neve' },
  { label: 'Kapcsolattartó neve', value: '{{clientContactName}}', description: 'Kapcsolattartó teljes neve' },
  { label: 'Telefon', value: '{{clientPhone}}', description: 'Ügyfél telefonszáma' },
  { label: 'Email', value: '{{clientEmail}}', description: 'Ügyfél email címe' },
  { label: 'Létrehozó neve', value: '{{createdByName}}', description: 'Ajánlatot készítő neve' },
];

export function BlockEditor({ block, onSave, onCancel, allowBrandChange = false }: BlockEditorProps) {
  const [content, setContent] = useState(JSON.stringify(block.content, null, 2));
  const [brand, setBrand] = useState<'BOOM' | 'AIBOOST'>(block.brand || 'BOOM');
  const [error, setError] = useState('');
  const [showFields, setShowFields] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Update content when block changes (e.g., switching between templates)
  useEffect(() => {
    setContent(JSON.stringify(block.content, null, 2));
    setBrand(block.brand || 'BOOM');
    setError('');
  }, [block.id, block.content, block.brand]);

  const handleSave = () => {
    try {
      const parsed = JSON.parse(content);
      setError('');
      onSave(parsed, allowBrandChange ? brand : undefined);
    } catch (e) {
      setError('Hibás JSON formátum! Kérlek ellenőrizd a szintaxist.');
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

  return (
    <div className="mt-4 p-6 bg-gray-50 rounded-lg border border-gray-200">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-[var(--color-text)]">
            Blokk szerkesztése: {block.blockType.replace(/_/g, ' ')}
          </h3>

          <div className="flex items-center gap-2">
            {/* Fields dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowFields(!showFields)}
                className="px-3 py-1 text-sm bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 border border-blue-200 transition-colors"
              >
                📋 Beszúrható mezők
              </button>

              {showFields && (
                <>
                  {/* Backdrop */}
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowFields(false)}
                  />

                  {/* Dropdown */}
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 z-20 max-h-80 overflow-y-auto">
                    <div className="p-3 border-b border-gray-200 bg-gray-50">
                      <p className="text-xs font-medium text-gray-700">
                        Kattints egy mezőre a beszúráshoz
                      </p>
                    </div>
                    {AVAILABLE_FIELDS.map((field) => (
                      <button
                        key={field.value}
                        onClick={() => {
                          insertField(field.value);
                          setShowFields(false);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                      >
                        <div className="flex items-start gap-2">
                          <span className="text-lg">📌</span>
                          <div className="flex-1">
                            <div className="font-medium text-sm text-gray-900">{field.label}</div>
                            <div className="text-xs text-gray-500 mt-0.5">{field.description}</div>
                            <code className="text-xs bg-gray-100 px-2 py-0.5 rounded mt-1 inline-block text-blue-600">
                              {field.value}
                            </code>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Brand selector - only shown if allowBrandChange is true */}
            {allowBrandChange && (
              <div className="flex items-center gap-2 bg-white rounded-lg p-1 border border-gray-200">
                <button
                  onClick={() => setBrand('BOOM')}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    brand === 'BOOM'
                      ? 'bg-[var(--color-primary)] text-white shadow-sm font-medium'
                      : 'text-[var(--color-muted)] hover:text-[var(--color-text)]'
                  }`}
                >
                  💥 BOOM
                </button>
                <button
                  onClick={() => setBrand('AIBOOST')}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    brand === 'AIBOOST'
                      ? 'bg-[var(--color-primary)] text-white shadow-sm font-medium'
                      : 'text-[var(--color-muted)] hover:text-[var(--color-text)]'
                  }`}
                >
                  🤖 AIBOOST
                </button>
              </div>
            )}
          </div>
        </div>
        <p className="text-sm text-[var(--color-muted)]">
          Szerkeszd meg a tartalmat JSON formátumban. Használd a "Beszúrható mezők" gombot dinamikus értékek hozzáadásához.
        </p>
      </div>

      <textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full h-96 font-mono text-sm p-4 rounded border border-gray-300 focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
        placeholder="{ ... }"
      />

      {error && (
        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="mt-4 flex items-center gap-3">
        <Button onClick={handleSave} size="sm">
          💾 Mentés
        </Button>
        <Button onClick={onCancel} variant="outline" size="sm">
          Mégse
        </Button>
      </div>
    </div>
  );
}
