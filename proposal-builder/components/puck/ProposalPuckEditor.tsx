'use client';

/**
 * ProposalPuckEditor - Shared Puck Editor component
 *
 * This component is used by both:
 * - Proposal edit page (/proposals/[id]/edit)
 * - Template edit page (/dashboard/templates/[id]/edit)
 *
 * It provides:
 * - Full Puck editor with custom header
 * - Undo/redo functionality
 * - Sidebar toggles
 * - Template selection and insertion
 * - Save as template functionality
 * - Variable inserter for placeholders
 */

import { useState, useCallback, useRef } from 'react';
import { Puck, Data, usePuck } from '@measured/puck';
import { puckConfig } from '@/lib/puck/config';
import { PuckBrandProvider } from '@/lib/puck/brand-context';
import { TemplateSelector } from '@/components/puck/TemplateSelector';
import { SaveTemplateDialog } from '@/components/puck/SaveTemplateDialog';
import { PuckTemplate } from '@/lib/puck/templates';
import '@measured/puck/puck.css';

// Available placeholder variables for dynamic content - grouped by category
const PLACEHOLDER_VARIABLE_GROUPS = [
  {
    label: 'Ügyfél adatok',
    icon: '🏢',
    color: 'blue',
    variables: [
      { label: 'Cég neve', value: '{{clientName}}', icon: '🏢' },
      { label: 'Kapcsolattartó', value: '{{clientContactName}}', icon: '👤' },
      { label: 'Telefon', value: '{{clientPhone}}', icon: '📞' },
      { label: 'Email', value: '{{clientEmail}}', icon: '📧' },
    ],
  },
  {
    label: 'Admin adatok',
    icon: '👔',
    color: 'purple',
    variables: [
      { label: 'Név', value: '{{adminName}}', icon: '✍️' },
      { label: 'Email', value: '{{adminEmail}}', icon: '📧' },
      { label: 'Telefon', value: '{{adminPhone}}', icon: '📞' },
      { label: 'Profilkép', value: '{{adminAvatar}}', icon: '🖼️' },
    ],
  },
];

// Template insertion mode
type InsertMode = 'append' | 'replace' | null;

// =============================================================================
// Variable Inserter Component
// =============================================================================

function VariableInserter() {
  const [copiedValue, setCopiedValue] = useState<string | null>(null);

  const handleCopy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedValue(value);
      setTimeout(() => setCopiedValue(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getGroupColorClass = (color: string, isCopied: boolean) => {
    if (isCopied) return 'bg-green-500 text-white';
    switch (color) {
      case 'blue':
        return 'bg-blue-500/20 text-blue-100 hover:bg-blue-500/30 border border-blue-400/30';
      case 'purple':
        return 'bg-purple-500/20 text-purple-100 hover:bg-purple-500/30 border border-purple-400/30';
      default:
        return 'bg-white/10 text-white/90 hover:bg-white/20';
    }
  };

  const getGroupLabelClass = (color: string) => {
    switch (color) {
      case 'blue':
        return 'text-blue-300';
      case 'purple':
        return 'text-purple-300';
      default:
        return 'text-white/70';
    }
  };

  return (
    <div className="flex items-center gap-4">
      {PLACEHOLDER_VARIABLE_GROUPS.map((group) => (
        <div key={group.label} className="flex items-center gap-1">
          <span className={`text-xs font-medium mr-1 ${getGroupLabelClass(group.color)}`}>
            <span className="mr-1">{group.icon}</span>
            {group.label}:
          </span>
          {group.variables.map((variable) => (
            <button
              key={variable.value}
              onClick={() => handleCopy(variable.value)}
              title={`${variable.label}\n${variable.value}\nKattints a másoláshoz!`}
              className={`px-2 py-0.5 text-xs rounded transition-all ${getGroupColorClass(group.color, copiedValue === variable.value)}`}
            >
              <span className="mr-1">{variable.icon}</span>
              {copiedValue === variable.value ? '✓' : variable.label}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}

// =============================================================================
// Insert Mode Dialog Component
// =============================================================================

function InsertModeDialog({
  templateName,
  onSelect,
  onCancel,
}: {
  templateName: string;
  onSelect: (mode: InsertMode) => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">Sablon beillesztése</h3>
          <p className="text-sm text-gray-500 mt-1">
            "{templateName}" sablon hozzáadása
          </p>
        </div>
        <div className="p-6 space-y-3">
          <button
            onClick={() => onSelect('append')}
            className="w-full flex items-center gap-4 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl group-hover:bg-blue-200 transition-colors">
              ➕
            </div>
            <div className="text-left flex-1">
              <div className="font-semibold text-gray-900">Hozzáadás a végéhez</div>
              <div className="text-sm text-gray-500">A meglévő tartalom megmarad, a sablon a végére kerül</div>
            </div>
          </button>
          <button
            onClick={() => onSelect('replace')}
            className="w-full flex items-center gap-4 p-4 border-2 border-gray-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all group"
          >
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center text-2xl group-hover:bg-orange-200 transition-colors">
              🔄
            </div>
            <div className="text-left flex-1">
              <div className="font-semibold text-gray-900">Teljes csere</div>
              <div className="text-sm text-gray-500">A meglévő tartalom törlődik, csak a sablon marad</div>
            </div>
          </button>
        </div>
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onCancel}
            className="w-full px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors text-sm font-medium"
          >
            Mégsem
          </button>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// Custom Header Component (uses usePuck)
// =============================================================================

interface EditorHeaderProps {
  title: string;
  subtitle?: string;
  brand: 'BOOM' | 'AIBOOST';
  status?: {
    label: string;
    type: 'published' | 'draft' | 'info';
  };
  saving: boolean;
  actions: {
    onSave: () => void;
    onSaveAndClose?: () => void;
    onPublish?: () => void;
    onUnpublish?: () => void;
    onPreview?: () => void;
    onClose: () => void;
  };
  onOpenTemplates: () => void;
  onOpenSaveAsTemplate: () => void;
  hasContent: boolean;
  showVariables?: boolean;
}

function EditorHeader({
  title,
  subtitle,
  brand,
  status,
  saving,
  actions,
  onOpenTemplates,
  onOpenSaveAsTemplate,
  hasContent,
  showVariables = true,
}: EditorHeaderProps) {
  const { history, appState, dispatch } = usePuck();

  const leftSidebarVisible = appState?.ui?.leftSideBarVisible ?? true;
  const rightSidebarVisible = appState?.ui?.rightSideBarVisible ?? true;

  const toggleLeftSidebar = () => {
    dispatch({
      type: 'setUi',
      ui: { leftSideBarVisible: !leftSidebarVisible },
    });
  };

  const toggleRightSidebar = () => {
    dispatch({
      type: 'setUi',
      ui: { rightSideBarVisible: !rightSidebarVisible },
    });
  };

  const getStatusStyle = (type: 'published' | 'draft' | 'info') => {
    switch (type) {
      case 'published':
        return 'bg-green-500/30 text-green-200';
      case 'draft':
        return 'bg-yellow-500/30 text-yellow-200';
      default:
        return 'bg-white/30 text-white';
    }
  };

  return (
    <div
      className="bg-[#3e4581] text-white px-4 py-2 flex flex-col gap-2 w-full"
      style={{ gridColumn: '1 / -1' }}
    >
      {/* Top row */}
      <div className="flex items-center justify-between">
        {/* Left side: Title and badges */}
        <div className="flex items-center gap-3">
          <h1 className="font-semibold text-white">{title}</h1>
          <span className="px-2 py-0.5 text-xs bg-white/20 rounded-full">
            {brand}
          </span>
          {status && (
            <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusStyle(status.type)}`}>
              {status.label}
            </span>
          )}
          {subtitle && (
            <span className="text-xs text-white/60">{subtitle}</span>
          )}
        </div>

        {/* Center: Template buttons + Sidebar toggles + Undo/Redo */}
        <div className="flex items-center gap-2">
          {/* Template buttons */}
          <button
            onClick={onOpenTemplates}
            className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-indigo-500/50 to-purple-500/50 hover:from-indigo-500/70 hover:to-purple-500/70 rounded-lg text-xs font-medium transition-all"
          >
            <span>📋</span>
            <span>Sablonok</span>
          </button>
          {hasContent && (
            <button
              onClick={onOpenSaveAsTemplate}
              className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-emerald-500/50 to-teal-500/50 hover:from-emerald-500/70 hover:to-teal-500/70 rounded-lg text-xs font-medium transition-all"
            >
              <span>💾</span>
              <span>Mentés sablonként</span>
            </button>
          )}

          <div className="w-px h-5 bg-white/20 mx-2" />

          {/* Left sidebar toggle */}
          <button
            onClick={toggleLeftSidebar}
            className={`p-1.5 rounded transition-colors ${leftSidebarVisible ? 'bg-white/20' : 'bg-white/10 hover:bg-white/20'}`}
            title={leftSidebarVisible ? 'Bal panel elrejtése' : 'Bal panel megjelenítése'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <line x1="9" y1="3" x2="9" y2="21" />
            </svg>
          </button>

          {/* Undo/Redo buttons */}
          <button
            onClick={() => history.back()}
            disabled={!history.hasPast}
            className="p-1.5 bg-white/10 hover:bg-white/20 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="Visszavonás (Undo)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 7v6h6" />
              <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
            </svg>
          </button>
          <button
            onClick={() => history.forward()}
            disabled={!history.hasFuture}
            className="p-1.5 bg-white/10 hover:bg-white/20 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="Újra (Redo)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 7v6h-6" />
              <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7" />
            </svg>
          </button>

          {/* Right sidebar toggle */}
          <button
            onClick={toggleRightSidebar}
            className={`p-1.5 rounded transition-colors ${rightSidebarVisible ? 'bg-white/20' : 'bg-white/10 hover:bg-white/20'}`}
            title={rightSidebarVisible ? 'Jobb panel elrejtése' : 'Jobb panel megjelenítése'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <line x1="15" y1="3" x2="15" y2="21" />
            </svg>
          </button>
        </div>

        {/* Right side: Action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={actions.onClose}
            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-sm"
          >
            ← Vissza
          </button>
          <button
            onClick={actions.onSave}
            disabled={saving}
            className="px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg transition-colors disabled:opacity-50 text-sm"
          >
            {saving ? 'Mentés...' : '💾 Mentés'}
          </button>
          {actions.onSaveAndClose && (
            <button
              onClick={actions.onSaveAndClose}
              disabled={saving}
              className="px-3 py-1.5 bg-[#fa604a] hover:bg-[#e54030] rounded-lg font-semibold transition-colors disabled:opacity-50 text-sm"
            >
              {saving ? 'Mentés...' : '💾 Mentés és Bezárás'}
            </button>
          )}
          {actions.onPreview && (
            <button
              onClick={actions.onPreview}
              className="px-3 py-1.5 bg-blue-500/50 hover:bg-blue-500/70 rounded-lg transition-colors text-sm"
            >
              👁️ Előnézet
            </button>
          )}
          {actions.onPublish && (
            <button
              onClick={actions.onPublish}
              disabled={saving}
              className="px-3 py-1.5 bg-[#fa604a] hover:bg-[#e54030] rounded-lg font-semibold transition-colors disabled:opacity-50 text-sm"
            >
              🚀 Publikálás
            </button>
          )}
          {actions.onUnpublish && (
            <button
              onClick={actions.onUnpublish}
              disabled={saving}
              className="px-3 py-1.5 bg-orange-500/50 hover:bg-orange-500/70 rounded-lg transition-colors disabled:opacity-50 text-sm"
            >
              Visszavonás
            </button>
          )}
        </div>
      </div>

      {/* Bottom row: Variable inserter */}
      {showVariables && (
        <div className="flex items-center">
          <VariableInserter />
        </div>
      )}
    </div>
  );
}

// =============================================================================
// Main ProposalPuckEditor Component
// =============================================================================

export interface ProposalPuckEditorProps {
  // Initial data
  initialData: Data;
  brand: 'BOOM' | 'AIBOOST';

  // Header configuration
  title: string;
  subtitle?: string;
  status?: {
    label: string;
    type: 'published' | 'draft' | 'info';
  };

  // Actions
  onSave: (data: Data) => Promise<void>;
  onSaveAndClose?: (data: Data) => Promise<void>;
  onPublish?: (data: Data) => Promise<void>;
  onUnpublish?: () => Promise<void>;
  onPreview?: () => void;
  onClose: () => void;

  // Options
  showVariables?: boolean;
}

export function ProposalPuckEditor({
  initialData,
  brand,
  title,
  subtitle,
  status,
  onSave,
  onSaveAndClose,
  onPublish,
  onUnpublish,
  onPreview,
  onClose,
  showVariables = true,
}: ProposalPuckEditorProps) {
  const [saving, setSaving] = useState(false);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [showSaveTemplateDialog, setShowSaveTemplateDialog] = useState(false);
  const [pendingTemplate, setPendingTemplate] = useState<PuckTemplate | null>(null);
  const [showInsertModeDialog, setShowInsertModeDialog] = useState(false);
  const [editorKey, setEditorKey] = useState(0);

  const currentDataRef = useRef<Data>(initialData);

  // Generate unique IDs for template components
  const generateUniqueIds = useCallback((templateData: Data): Data => {
    const timestamp = Date.now();
    const suffix = `_${timestamp}`;

    const clonedData = JSON.parse(JSON.stringify(templateData)) as Data;

    if (clonedData.content) {
      clonedData.content = clonedData.content.map((item, index) => ({
        ...item,
        props: {
          ...item.props,
          id: `${item.props?.id || `item-${index}`}${suffix}`,
        },
      }));
    }

    if (clonedData.zones) {
      const newZones: Record<string, Data['content']> = {};
      for (const [zoneKey, zoneContent] of Object.entries(clonedData.zones)) {
        const newZoneKey = zoneKey.replace(/([^:]+):(.+)/, (_, prefix, rest) => {
          return `${prefix}${suffix}:${rest}`;
        });

        newZones[newZoneKey] = (zoneContent || []).map((item, index) => ({
          ...item,
          props: {
            ...item.props,
            id: `${item.props?.id || `zone-item-${index}`}${suffix}`,
          },
        }));
      }
      clonedData.zones = newZones;
    }

    return clonedData;
  }, []);

  // Merge template data with existing data
  const mergeTemplateData = useCallback((existingData: Data, templateData: Data): Data => {
    const uniqueTemplateData = generateUniqueIds(templateData);

    return {
      root: existingData.root,
      content: [...(existingData.content || []), ...(uniqueTemplateData.content || [])],
      zones: {
        ...(existingData.zones || {}),
        ...(uniqueTemplateData.zones || {}),
      },
    };
  }, [generateUniqueIds]);

  // Handle template selection
  const handleSelectTemplate = useCallback((template: PuckTemplate) => {
    const currentData = currentDataRef.current;
    const hasExistingContent = currentData.content && currentData.content.length > 0;

    if (hasExistingContent) {
      setPendingTemplate(template);
      setShowTemplateSelector(false);
      setShowInsertModeDialog(true);
    } else {
      currentDataRef.current = template.data;
      setEditorKey(prev => prev + 1);
      setShowTemplateSelector(false);
    }
  }, []);

  // Handle insert mode selection
  const handleInsertModeSelect = useCallback((mode: InsertMode) => {
    if (!pendingTemplate || !mode) {
      setShowInsertModeDialog(false);
      setPendingTemplate(null);
      return;
    }

    const currentData = currentDataRef.current;
    let newData: Data;

    if (mode === 'append') {
      newData = mergeTemplateData(currentData, pendingTemplate.data);
    } else {
      newData = pendingTemplate.data;
    }

    currentDataRef.current = newData;
    setEditorKey(prev => prev + 1);
    setShowInsertModeDialog(false);
    setPendingTemplate(null);
  }, [pendingTemplate, mergeTemplateData]);

  const handleInsertModeCancel = useCallback(() => {
    setShowInsertModeDialog(false);
    setPendingTemplate(null);
  }, []);

  const handleDataChange = useCallback((data: Data) => {
    currentDataRef.current = data;
  }, []);

  // Action handlers
  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      await onSave(currentDataRef.current);
    } finally {
      setSaving(false);
    }
  }, [onSave]);

  const handleSaveAndClose = useCallback(async () => {
    if (!onSaveAndClose) return;
    setSaving(true);
    try {
      await onSaveAndClose(currentDataRef.current);
    } finally {
      setSaving(false);
    }
  }, [onSaveAndClose]);

  const handlePublish = useCallback(async () => {
    if (!onPublish) return;
    setSaving(true);
    try {
      await onPublish(currentDataRef.current);
    } finally {
      setSaving(false);
    }
  }, [onPublish]);

  const handleUnpublish = useCallback(async () => {
    if (!onUnpublish) return;
    setSaving(true);
    try {
      await onUnpublish();
    } finally {
      setSaving(false);
    }
  }, [onUnpublish]);

  const hasContent = (currentDataRef.current?.content?.length || 0) > 0;

  return (
    <PuckBrandProvider initialBrand={brand}>
      <div className="h-screen w-screen">
        <Puck
          key={editorKey}
          config={puckConfig}
          data={currentDataRef.current}
          onChange={handleDataChange}
          overrides={{
            header: () => (
              <EditorHeader
                title={title}
                subtitle={subtitle}
                brand={brand}
                status={status}
                saving={saving}
                actions={{
                  onSave: handleSave,
                  onSaveAndClose: onSaveAndClose ? handleSaveAndClose : undefined,
                  onPublish: onPublish ? handlePublish : undefined,
                  onUnpublish: onUnpublish ? handleUnpublish : undefined,
                  onPreview,
                  onClose,
                }}
                onOpenTemplates={() => setShowTemplateSelector(true)}
                onOpenSaveAsTemplate={() => setShowSaveTemplateDialog(true)}
                hasContent={hasContent}
                showVariables={showVariables}
              />
            ),
          }}
        />
      </div>

      {/* Template Selector Modal */}
      {showTemplateSelector && (
        <TemplateSelector
          onSelectTemplate={handleSelectTemplate}
          onClose={() => setShowTemplateSelector(false)}
        />
      )}

      {/* Insert Mode Dialog */}
      {showInsertModeDialog && pendingTemplate && (
        <InsertModeDialog
          templateName={pendingTemplate.name}
          onSelect={handleInsertModeSelect}
          onCancel={handleInsertModeCancel}
        />
      )}

      {/* Save Template Dialog */}
      {showSaveTemplateDialog && (
        <SaveTemplateDialog
          data={currentDataRef.current}
          onClose={() => setShowSaveTemplateDialog(false)}
        />
      )}
    </PuckBrandProvider>
  );
}
