'use client';

import { useState, useCallback, useMemo } from 'react';
import { Puck, Data, Render } from '@measured/puck';
import '@measured/puck/puck.css';
import { puckConfig, PuckBrandProvider } from '@/lib/puck';
import { TemplateSelector } from './TemplateSelector';
import { SaveTemplateDialog } from './SaveTemplateDialog';
import { PuckTemplate } from '@/lib/puck/templates';

// Template insertion mode
type InsertMode = 'append' | 'replace' | null;

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

interface PuckEditorProps {
  initialData?: Data;
  // brand prop is deprecated - brand is now controlled by the main dashboard brand switcher
  brand?: 'BOOM' | 'AIBOOST';
  onPublish?: (data: Data) => void;
  onChange?: (data: Data) => void;
  readOnly?: boolean;
}

// Variable Inserter Panel Component
function VariableInserter({ onCopy }: { onCopy: (value: string) => void }) {
  const [copiedValue, setCopiedValue] = useState<string | null>(null);

  const handleCopy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedValue(value);
      onCopy(value);
      setTimeout(() => setCopiedValue(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getGroupColorClass = (color: string, isCopied: boolean) => {
    if (isCopied) return 'bg-green-500 text-white border-green-500';
    switch (color) {
      case 'blue':
        return 'bg-blue-50 text-blue-700 border-blue-300 hover:bg-blue-100';
      case 'purple':
        return 'bg-purple-50 text-purple-700 border-purple-300 hover:bg-purple-100';
      default:
        return 'bg-white border-gray-300 text-gray-700 hover:bg-gray-100';
    }
  };

  const getGroupBgClass = (color: string) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-50 border-blue-200';
      case 'purple':
        return 'bg-purple-50 border-purple-200';
      default:
        return 'bg-amber-50 border-amber-200';
    }
  };

  const getGroupLabelClass = (color: string) => {
    switch (color) {
      case 'blue':
        return 'text-blue-700';
      case 'purple':
        return 'text-purple-700';
      default:
        return 'text-amber-700';
    }
  };

  return (
    <div className="flex items-center gap-3">
      {PLACEHOLDER_VARIABLE_GROUPS.map((group) => (
        <div key={group.label} className={`flex items-center gap-1 p-1 border rounded-lg ${getGroupBgClass(group.color)}`}>
          <span className={`text-xs font-medium px-2 ${getGroupLabelClass(group.color)}`}>
            <span className="mr-1">{group.icon}</span>
            {group.label}:
          </span>
          {group.variables.map((variable) => (
            <button
              key={variable.value}
              onClick={() => handleCopy(variable.value)}
              title={`${variable.label}\n${variable.value}\nKattints a másoláshoz!`}
              className={`px-2 py-1 text-xs rounded border transition-all ${getGroupColorClass(group.color, copiedValue === variable.value)}`}
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

// Insert Mode Dialog Component
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

/**
 * PuckEditor - Visual WYSIWYG editor for Puck components
 *
 * Brand is now controlled by the global ThemeProvider.
 * Use the main brand switcher in the dashboard menu to change brand.
 */
export function PuckEditor({
  initialData,
  onPublish,
  onChange,
  readOnly = false,
}: PuckEditorProps) {
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [showSaveTemplateDialog, setShowSaveTemplateDialog] = useState(false);
  const [editorData, setEditorData] = useState<Data | null>(null);
  const [editorKey, setEditorKey] = useState(0); // Key to force re-render
  const [pendingTemplate, setPendingTemplate] = useState<PuckTemplate | null>(null);
  const [showInsertModeDialog, setShowInsertModeDialog] = useState(false);

  // Default empty data structure
  const defaultData: Data = useMemo(
    () => ({
      content: [],
      root: { props: {} },
    }),
    []
  );

  const data = editorData || initialData || defaultData;

  // Check if editor has content
  const hasExistingContent = data.content && data.content.length > 0;

  // Generate unique IDs for template components to avoid conflicts
  const generateUniqueIds = useCallback((templateData: Data): Data => {
    const timestamp = Date.now();
    const suffix = `_${timestamp}`;

    // Deep clone the template data
    const clonedData = JSON.parse(JSON.stringify(templateData)) as Data;

    // Update IDs in content
    if (clonedData.content) {
      clonedData.content = clonedData.content.map((item, index) => ({
        ...item,
        props: {
          ...item.props,
          id: `${item.props?.id || `item-${index}`}${suffix}`,
        },
      }));
    }

    // Update IDs in zones (keys contain old IDs, need to update them)
    if (clonedData.zones) {
      const newZones: Record<string, Data['content']> = {};
      for (const [zoneKey, zoneContent] of Object.entries(clonedData.zones)) {
        // Update zone key if it contains an old ID
        const newZoneKey = zoneKey.replace(/([^:]+):(.+)/, (_, prefix, rest) => {
          return `${prefix}${suffix}:${rest}`;
        });

        // Update content IDs in zone
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

  // Merge template data with existing data (append mode)
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

  // Handle template selection - first step
  const handleSelectTemplate = useCallback((template: PuckTemplate) => {
    console.log('[PuckEditor] Selected template:', template.name);

    // If there's existing content, ask user what to do
    if (hasExistingContent) {
      setPendingTemplate(template);
      setShowTemplateSelector(false);
      setShowInsertModeDialog(true);
    } else {
      // No existing content, just use the template directly
      console.log('[PuckEditor] No existing content, using template directly');
      setEditorData(template.data);
      setEditorKey(prev => prev + 1);
      setShowTemplateSelector(false);
      onChange?.(template.data);
    }
  }, [hasExistingContent, onChange]);

  // Handle insert mode selection
  const handleInsertModeSelect = useCallback((mode: InsertMode) => {
    if (!pendingTemplate || !mode) {
      setShowInsertModeDialog(false);
      setPendingTemplate(null);
      return;
    }

    console.log('[PuckEditor] Insert mode:', mode, 'for template:', pendingTemplate.name);

    let newData: Data;

    if (mode === 'append') {
      // Append template to existing content
      newData = mergeTemplateData(data, pendingTemplate.data);
      console.log('[PuckEditor] Merged data - existing items:', data.content?.length, 'new total:', newData.content?.length);
    } else {
      // Replace with template
      newData = pendingTemplate.data;
    }

    setEditorData(newData);
    setEditorKey(prev => prev + 1);
    setShowInsertModeDialog(false);
    setPendingTemplate(null);
    onChange?.(newData);
  }, [pendingTemplate, data, mergeTemplateData, onChange]);

  // Cancel insert mode dialog
  const handleInsertModeCancel = useCallback(() => {
    setShowInsertModeDialog(false);
    setPendingTemplate(null);
  }, []);

  const handlePublish = useCallback(
    (publishedData: Data) => {
      console.log('[PuckEditor] Publishing data:', publishedData);
      onPublish?.(publishedData);
    },
    [onPublish]
  );

  const handleChange = useCallback(
    (changedData: Data) => {
      setEditorData(changedData);
      onChange?.(changedData);
    },
    [onChange]
  );

  // If readOnly, just render the content
  if (readOnly) {
    return (
      <PuckBrandProvider>
        <div className="puck-preview">
          <Render config={puckConfig} data={data} />
        </div>
      </PuckBrandProvider>
    );
  }

  return (
    <PuckBrandProvider>
      <div className="puck-editor-wrapper flex flex-col h-full">
        {/* Custom header with template button and variable inserter */}
        <div className="flex flex-col border-b bg-white">
          {/* Top row: Title, Templates, Save as Template */}
          <div className="flex items-center justify-between p-3">
            <div className="flex items-center gap-3">
              <h2 className="text-sm font-semibold text-gray-700">
                Vizuális Szerkesztő
              </h2>
              <button
                onClick={() => setShowTemplateSelector(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg text-sm font-medium hover:from-indigo-600 hover:to-purple-600 transition-all shadow-sm"
              >
                <span>📋</span>
                <span>Sablonok</span>
              </button>
              {hasExistingContent && (
                <button
                  onClick={() => setShowSaveTemplateDialog(true)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg text-sm font-medium hover:from-emerald-600 hover:to-teal-600 transition-all shadow-sm"
                >
                  <span>💾</span>
                  <span>Mentés sablonként</span>
                </button>
              )}
            </div>
          </div>
          {/* Bottom row: Variable inserter */}
          <div className="px-3 pb-3">
            <VariableInserter onCopy={(value) => console.log('Copied:', value)} />
          </div>
        </div>

        {/* Puck Editor */}
        <div className="flex-1 min-h-0 overflow-auto">
          <Puck
            key={editorKey}
            config={puckConfig}
            data={data}
            onPublish={handlePublish}
            onChange={handleChange}
          />
        </div>
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
          data={data}
          onClose={() => setShowSaveTemplateDialog(false)}
        />
      )}
    </PuckBrandProvider>
  );
}

/**
 * Replace template variables in Puck data
 * Supports:
 * - Client: {{clientName}}, {{clientEmail}}, {{clientPhone}}, {{clientContactName}}
 * - Admin: {{adminName}}, {{adminEmail}}, {{adminPhone}}, {{adminAvatar}}
 */
function replaceTemplateVariables(
  data: Data,
  proposalData?: {
    // Client data
    clientName?: string;
    clientEmail?: string | null;
    clientPhone?: string | null;
    clientContactName?: string | null;
    // Admin data (the person who created the proposal)
    adminName?: string | null;
    adminEmail?: string | null;
    adminPhone?: string | null;
    adminAvatar?: string | null;
    // Legacy: createdByName is mapped to adminName
    createdByName?: string | null;
  }
): Data {
  if (!proposalData) return data;

  // Create a deep copy to avoid mutating original data
  const processedData = JSON.parse(JSON.stringify(data)) as Data;

  // Replace function for strings
  const replaceInString = (str: string): string => {
    return str
      // Client variables
      .replace(/\{\{clientName\}\}/g, proposalData.clientName || 'Ügyfél neve')
      .replace(/\{\{clientEmail\}\}/g, proposalData.clientEmail || '')
      .replace(/\{\{clientPhone\}\}/g, proposalData.clientPhone || '')
      .replace(/\{\{clientContactName\}\}/g, proposalData.clientContactName || '')
      // Admin variables
      .replace(/\{\{adminName\}\}/g, proposalData.adminName || proposalData.createdByName || '')
      .replace(/\{\{adminEmail\}\}/g, proposalData.adminEmail || '')
      .replace(/\{\{adminPhone\}\}/g, proposalData.adminPhone || '')
      .replace(/\{\{adminAvatar\}\}/g, proposalData.adminAvatar || '')
      // Legacy: keep createdByName for backward compatibility
      .replace(/\{\{createdByName\}\}/g, proposalData.createdByName || proposalData.adminName || '');
  };

  // Recursively process object/array
  const processValue = (value: unknown): unknown => {
    if (typeof value === 'string') {
      return replaceInString(value);
    }
    if (Array.isArray(value)) {
      return value.map(processValue);
    }
    if (value && typeof value === 'object') {
      const result: Record<string, unknown> = {};
      for (const [key, val] of Object.entries(value)) {
        result[key] = processValue(val);
      }
      return result;
    }
    return value;
  };

  // Process content array
  if (processedData.content) {
    processedData.content = processValue(processedData.content) as Data['content'];
  }

  // Process zones
  if (processedData.zones) {
    processedData.zones = processValue(processedData.zones) as Data['zones'];
  }

  return processedData;
}

/**
 * Static renderer for viewing Puck data
 * Brand is now controlled by the global ThemeProvider
 */
export function PuckRenderer({
  data,
  proposalData,
}: {
  data: Data;
  // brand prop is deprecated - brand is sourced from global ThemeProvider
  brand?: 'BOOM' | 'AIBOOST';
  proposalData?: {
    // Client data
    clientName?: string;
    clientEmail?: string | null;
    clientPhone?: string | null;
    clientContactName?: string | null;
    // Admin data
    adminName?: string | null;
    adminEmail?: string | null;
    adminPhone?: string | null;
    adminAvatar?: string | null;
    // Legacy
    createdByName?: string | null;
  };
}) {
  // Replace template variables with actual values
  const processedData = replaceTemplateVariables(data, proposalData);

  return (
    <PuckBrandProvider>
      <Render config={puckConfig} data={processedData} />
    </PuckBrandProvider>
  );
}

// Export Puck Data type for external use
export type { Data as PuckData };
