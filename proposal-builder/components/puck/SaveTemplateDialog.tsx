'use client';

import { useState } from 'react';
import { Data } from '@measured/puck';

interface SaveTemplateDialogProps {
  data: Data;
  onClose: () => void;
}

const CATEGORIES = [
  { id: 'custom', label: 'Egyéni', icon: '⚡' },
  { id: 'hero', label: 'Hero', icon: '🎯' },
  { id: 'features', label: 'Jellemzők', icon: '✨' },
  { id: 'pricing', label: 'Árazás', icon: '💰' },
  { id: 'timeline', label: 'Timeline', icon: '📅' },
  { id: 'logos', label: 'Logók', icon: '🏢' },
  { id: 'cta', label: 'CTA', icon: '🚀' },
  { id: 'full-page', label: 'Teljes oldal', icon: '📄' },
];

export function SaveTemplateDialog({ data, onClose }: SaveTemplateDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('custom');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      setError('Add meg a sablon nevét!');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch('/api/puck-templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || null,
          category,
          data,
        }),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Nem sikerült menteni a sablont');
      }

      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Hiba történt a mentés során');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-emerald-500 to-teal-500">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span>💾</span>
            Mentés sablonként
          </h3>
          <p className="text-sm text-white/80 mt-1">
            Mentsd el a jelenlegi oldalt újrafelhasználható sablonként
          </p>
        </div>

        {/* Form */}
        <div className="p-6 space-y-4">
          {success ? (
            <div className="text-center py-8">
              <div className="text-5xl mb-4">✅</div>
              <p className="text-lg font-semibold text-gray-900">Sablon mentve!</p>
              <p className="text-sm text-gray-500 mt-2">
                A sablonok közül bármikor elérheted
              </p>
            </div>
          ) : (
            <>
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sablon neve *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="pl. Marketing landing page"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  autoFocus
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Leírás (opcionális)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Rövid leírás a sablon tartalmáról..."
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors resize-none"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kategória
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setCategory(cat.id)}
                      className={`flex flex-col items-center gap-1 p-2 rounded-lg border-2 transition-all text-xs ${
                        category === cat.id
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                          : 'border-gray-200 hover:border-gray-300 text-gray-600'
                      }`}
                    >
                      <span className="text-lg">{cat.icon}</span>
                      <span>{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                  {error}
                </div>
              )}

              {/* Info */}
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
                <strong>Tipp:</strong> A sablon tartalmazza az összes jelenlegi komponenst és azok beállításait.
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {!success && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
            <button
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors text-sm font-medium disabled:opacity-50"
            >
              Mégsem
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving || !name.trim()}
              className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg text-sm font-medium hover:from-emerald-600 hover:to-teal-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <span className="animate-spin">⏳</span>
                  Mentés...
                </>
              ) : (
                <>
                  <span>💾</span>
                  Mentés
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
