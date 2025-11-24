'use client';

import { useState } from 'react';
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

export function BlockEditor({ block, onSave, onCancel, allowBrandChange = false }: BlockEditorProps) {
  const [content, setContent] = useState(JSON.stringify(block.content, null, 2));
  const [brand, setBrand] = useState<'BOOM' | 'AIBOOST'>(block.brand || 'BOOM');
  const [error, setError] = useState('');

  const handleSave = () => {
    try {
      const parsed = JSON.parse(content);
      setError('');
      onSave(parsed, allowBrandChange ? brand : undefined);
    } catch (e) {
      setError('Hibás JSON formátum! Kérlek ellenőrizd a szintaxist.');
    }
  };

  return (
    <div className="mt-4 p-6 bg-gray-50 rounded-lg border border-gray-200">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-[var(--color-text)]">
            Blokk szerkesztése: {block.blockType.replace(/_/g, ' ')}
          </h3>

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
        <p className="text-sm text-[var(--color-muted)]">
          Szerkeszd meg a tartalmat JSON formátumban:
        </p>
      </div>

      <textarea
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
