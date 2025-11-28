'use client';

import { useState, useEffect } from 'react';
import { Data } from '@measured/puck';
import { PuckTemplate, getTemplatesByCategory } from '@/lib/puck/templates';

// Custom template from database
interface CustomTemplate {
  id: string;
  name: string;
  description: string | null;
  category: string;
  brand: string;
  thumbnailUrl: string | null;
  usageCount: number;
  createdAt: string;
  createdBy?: {
    name: string | null;
    email: string;
  };
}

interface TemplateSelectorProps {
  onSelectTemplate: (template: PuckTemplate) => void;
  onClose: () => void;
}

type CategoryType = PuckTemplate['category'] | 'custom';

export function TemplateSelector({ onSelectTemplate, onClose }: TemplateSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('hero');
  const [customTemplates, setCustomTemplates] = useState<CustomTemplate[]>([]);
  const [isLoadingCustom, setIsLoadingCustom] = useState(false);

  const categories: { id: CategoryType; label: string; icon: string }[] = [
    { id: 'hero', label: 'Hero', icon: '🎯' },
    { id: 'features', label: 'Jellemzők', icon: '✨' },
    { id: 'pricing', label: 'Árazás', icon: '💰' },
    { id: 'timeline', label: 'Timeline', icon: '📅' },
    { id: 'logos', label: 'Logók', icon: '🏢' },
    { id: 'cta', label: 'CTA', icon: '🚀' },
    { id: 'full-page', label: 'Teljes oldal', icon: '📄' },
    { id: 'custom', label: 'Mentett', icon: '⭐' },
  ];

  // Load custom templates
  useEffect(() => {
    const loadCustomTemplates = async () => {
      setIsLoadingCustom(true);
      try {
        const response = await fetch('/api/puck-templates');
        if (response.ok) {
          const data = await response.json();
          setCustomTemplates(data.templates || []);
        }
      } catch (error) {
        console.error('Error loading custom templates:', error);
      } finally {
        setIsLoadingCustom(false);
      }
    };

    loadCustomTemplates();
  }, []);

  // Get templates for current category
  const getTemplatesForCategory = (): PuckTemplate[] => {
    if (selectedCategory === 'custom') {
      return []; // Custom templates are handled separately
    }
    return getTemplatesByCategory(selectedCategory as PuckTemplate['category']);
  };

  // Get custom templates for current category (or all if 'custom' is selected)
  const getCustomTemplatesForCategory = (): CustomTemplate[] => {
    if (selectedCategory === 'custom') {
      return customTemplates;
    }
    return customTemplates.filter(t => t.category === selectedCategory);
  };

  const builtInTemplates = getTemplatesForCategory();
  const filteredCustomTemplates = getCustomTemplatesForCategory();

  // Handle custom template selection - need to fetch full data
  const handleCustomTemplateSelect = async (template: CustomTemplate) => {
    try {
      const response = await fetch(`/api/puck-templates/${template.id}`);
      if (response.ok) {
        const fullTemplate = await response.json();
        // Convert to PuckTemplate format
        const puckTemplate: PuckTemplate = {
          id: fullTemplate.id,
          name: fullTemplate.name,
          description: fullTemplate.description || '',
          category: fullTemplate.category as PuckTemplate['category'],
          data: fullTemplate.data as Data,
        };
        onSelectTemplate(puckTemplate);
      }
    } catch (error) {
      console.error('Error loading template data:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Sablon választás</h2>
            <p className="text-sm text-gray-500 mt-1">Válassz egy előre elkészített sablont</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Category Tabs */}
        <div className="px-6 py-3 border-b border-gray-100 bg-gray-50">
          <div className="flex gap-2 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <span>{category.icon}</span>
                <span>{category.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Built-in templates */}
          {builtInTemplates.length > 0 && (
            <>
              {selectedCategory !== 'custom' && filteredCustomTemplates.length > 0 && (
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Beépített sablonok
                </h3>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {builtInTemplates.map((template) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    onSelect={() => onSelectTemplate(template)}
                  />
                ))}
              </div>
            </>
          )}

          {/* Custom templates */}
          {filteredCustomTemplates.length > 0 && (
            <>
              {selectedCategory !== 'custom' && builtInTemplates.length > 0 && (
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 mt-6">
                  Mentett sablonok
                </h3>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredCustomTemplates.map((template) => (
                  <CustomTemplateCard
                    key={template.id}
                    template={template}
                    onSelect={() => handleCustomTemplateSelect(template)}
                  />
                ))}
              </div>
            </>
          )}

          {/* Empty state */}
          {builtInTemplates.length === 0 && filteredCustomTemplates.length === 0 && (
            <div className="text-center py-12">
              {isLoadingCustom ? (
                <>
                  <div className="text-4xl mb-4 animate-spin">⏳</div>
                  <p className="text-gray-500">Sablonok betöltése...</p>
                </>
              ) : (
                <>
                  <div className="text-4xl mb-4">
                    {selectedCategory === 'custom' ? '⭐' : '🚧'}
                  </div>
                  <p className="text-gray-500">
                    {selectedCategory === 'custom'
                      ? 'Még nincsenek mentett sablonjaid.'
                      : 'Ebben a kategóriában még nincsenek sablonok.'}
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    {selectedCategory === 'custom'
                      ? 'Hozz létre egy oldalt és mentsd el sablonként!'
                      : 'Hamarosan érkeznek!'}
                  </p>
                </>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <p className="text-xs text-gray-500 text-center">
            A sablon kiválasztása után szabadon szerkesztheted a tartalmat
          </p>
        </div>
      </div>
    </div>
  );
}

interface TemplateCardProps {
  template: PuckTemplate;
  onSelect: () => void;
}

function TemplateCard({ template, onSelect }: TemplateCardProps) {
  // Generate a simple preview based on template category
  const getPreviewGradient = () => {
    switch (template.category) {
      case 'hero':
        return 'from-indigo-600 via-purple-600 to-pink-600';
      case 'features':
        return 'from-green-500 via-teal-500 to-cyan-500';
      case 'pricing':
        return 'from-amber-500 via-orange-500 to-red-500';
      case 'timeline':
        return 'from-blue-500 via-indigo-500 to-purple-500';
      case 'logos':
        return 'from-slate-500 via-gray-500 to-zinc-500';
      case 'cta':
        return 'from-rose-500 via-pink-500 to-fuchsia-500';
      case 'full-page':
        return 'from-violet-600 via-purple-600 to-indigo-700';
      default:
        return 'from-gray-500 via-slate-500 to-zinc-500';
    }
  };

  return (
    <div
      onClick={onSelect}
      className="group border border-gray-200 rounded-xl overflow-hidden hover:border-blue-400 hover:shadow-lg transition-all cursor-pointer bg-white"
    >
      {/* Preview Area */}
      <div className={`h-40 bg-gradient-to-br ${getPreviewGradient()} relative overflow-hidden`}>
        {/* Decorative elements to simulate template structure */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-white">
          <div className="w-3/4 h-4 bg-white/30 rounded mb-3" />
          <div className="w-1/2 h-3 bg-white/20 rounded mb-4" />
          <div className="w-24 h-8 bg-white/40 rounded-full" />
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white text-gray-900 px-4 py-2 rounded-lg font-medium text-sm shadow-lg">
            Kiválasztás
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
          {template.name}
        </h3>
        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
          {template.description}
        </p>
      </div>
    </div>
  );
}

// Custom template card with star badge
interface CustomTemplateCardProps {
  template: CustomTemplate;
  onSelect: () => void;
}

function CustomTemplateCard({ template, onSelect }: CustomTemplateCardProps) {
  const getCategoryGradient = () => {
    switch (template.category) {
      case 'hero':
        return 'from-indigo-600 via-purple-600 to-pink-600';
      case 'features':
        return 'from-green-500 via-teal-500 to-cyan-500';
      case 'pricing':
        return 'from-amber-500 via-orange-500 to-red-500';
      case 'timeline':
        return 'from-blue-500 via-indigo-500 to-purple-500';
      case 'logos':
        return 'from-slate-500 via-gray-500 to-zinc-500';
      case 'cta':
        return 'from-rose-500 via-pink-500 to-fuchsia-500';
      case 'full-page':
        return 'from-violet-600 via-purple-600 to-indigo-700';
      case 'custom':
        return 'from-emerald-500 via-teal-500 to-cyan-500';
      default:
        return 'from-gray-500 via-slate-500 to-zinc-500';
    }
  };

  return (
    <div
      onClick={onSelect}
      className="group border-2 border-emerald-200 rounded-xl overflow-hidden hover:border-emerald-400 hover:shadow-lg transition-all cursor-pointer bg-white"
    >
      {/* Preview Area */}
      <div className={`h-40 bg-gradient-to-br ${getCategoryGradient()} relative overflow-hidden`}>
        {/* Custom badge */}
        <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-md">
          <span>⭐</span>
          <span>Mentett</span>
        </div>

        {/* Usage count */}
        {template.usageCount > 0 && (
          <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
            {template.usageCount}x használva
          </div>
        )}

        {/* Decorative elements */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-white">
          <div className="w-3/4 h-4 bg-white/30 rounded mb-3" />
          <div className="w-1/2 h-3 bg-white/20 rounded mb-4" />
          <div className="w-24 h-8 bg-white/40 rounded-full" />
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white text-gray-900 px-4 py-2 rounded-lg font-medium text-sm shadow-lg">
            Kiválasztás
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
          {template.name}
        </h3>
        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
          {template.description || 'Egyéni sablon'}
        </p>
        {template.createdBy && (
          <p className="text-xs text-gray-400 mt-2">
            Készítette: {template.createdBy.name || template.createdBy.email}
          </p>
        )}
      </div>
    </div>
  );
}
