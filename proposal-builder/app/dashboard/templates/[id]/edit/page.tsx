'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Data } from '@measured/puck';
import { ProposalPuckEditor } from '@/components/puck/ProposalPuckEditor';

// Category labels for display
const getCategoryLabel = (blockType: string | undefined): string => {
  const categories: Record<string, string> = {
    'HERO': 'Hero',
    'VALUE_PROP': 'Értékajánlat',
    'PRICING_TABLE': 'Árazás',
    'CTA': 'CTA',
    'SERVICES_GRID': 'Szolgáltatások',
    'GUARANTEES': 'Garanciák',
    'TESTIMONIALS': 'Vélemények',
    'PROCESS': 'Folyamat',
    'PROCESS_TIMELINE': 'Folyamat',
    'FAQ': 'GYIK',
    'COVER': 'Borító',
    'FOOTER': 'Lábléc',
    'TWO_COLUMN': 'Két oszlop',
    'PLATFORM_FEATURES': 'Platform',
    'CLIENT_LOGOS': 'Logók',
    'STATS': 'Statisztikák',
    'OTHER': 'Egyéb',
  };
  return categories[blockType || ''] || 'Egyéb';
};

interface BlockTemplate {
  id: string;
  name: string;
  description: string | null;
  blockType: string;
  brand: 'BOOM' | 'AIBOOST';
  defaultContent: any;
  isActive: boolean;
  thumbnailUrl?: string | null;
}

export default function TemplateEditPage() {
  const params = useParams();
  const router = useRouter();
  const templateId = params.id as string;

  const [template, setTemplate] = useState<BlockTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTemplate();
  }, [templateId]);

  const fetchTemplate = async () => {
    try {
      const response = await fetch(`/api/block-templates/${templateId}`);
      if (!response.ok) {
        if (response.status === 404) {
          setError('Sablon nem található');
        } else {
          setError('Hiba történt a sablon betöltésekor');
        }
        return;
      }
      const data = await response.json();
      setTemplate(data);
    } catch (err) {
      console.error('Error fetching template:', err);
      setError('Hiba történt a sablon betöltésekor');
    } finally {
      setLoading(false);
    }
  };

  const saveTemplate = useCallback(async (data: Data): Promise<void> => {
    if (!template) return;

    // Extract title from root props (simplified - only title field)
    const rootProps = (data.root?.props || {}) as Record<string, unknown>;
    const templateTitle = (rootProps.title as string) || template.name || 'Névtelen sablon';

    // For PUCK_CONTENT type: save puckData inside defaultContent
    // For other types: save directly as defaultContent (converts old template to Puck)
    const newDefaultContent = template.blockType === 'PUCK_CONTENT'
      ? {
          ...template.defaultContent,
          puckData: data,
        }
      : data;

    const response = await fetch(`/api/block-templates/${templateId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: templateTitle,
        defaultContent: newDefaultContent,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to save');
    }
  }, [templateId, template]);

  const handleSave = useCallback(async (data: Data): Promise<void> => {
    await saveTemplate(data);
    alert('Sablon sikeresen mentve!');
  }, [saveTemplate]);

  const handleSaveAndClose = useCallback(async (data: Data): Promise<void> => {
    await saveTemplate(data);
    router.push('/dashboard/templates');
  }, [saveTemplate, router]);

  const handleClose = useCallback(() => {
    router.push('/dashboard/templates');
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Sablon betöltése...</p>
        </div>
      </div>
    );
  }

  if (error || !template) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">{error || 'Sablon nem található'}</h2>
          <button
            onClick={() => router.push('/dashboard/templates')}
            className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
          >
            Vissza a sablonokhoz
          </button>
        </div>
      </div>
    );
  }

  // Ensure data has the correct structure
  // For PUCK_CONTENT type: defaultContent.puckData contains the Puck data
  // For other types: start with empty Puck data (these are old-style templates)
  const basePuckData = template.blockType === 'PUCK_CONTENT' && template.defaultContent?.puckData?.content
    ? template.defaultContent.puckData
    : {
        content: [],
        root: { props: {} },
      };

  // Inject template name into root props for editing in the Page panel
  const initialData: Data = {
    ...basePuckData,
    root: {
      ...basePuckData.root,
      props: {
        ...basePuckData.root?.props,
        title: template.name || '',
      },
    },
  };

  const categoryLabel = getCategoryLabel(template.defaultContent?.originalBlockType);

  return (
    <ProposalPuckEditor
      initialData={initialData}
      brand={template.brand}
      title={template.name}
      subtitle={categoryLabel}
      status={{
        label: template.isActive ? 'Aktív' : 'Inaktív',
        type: template.isActive ? 'published' : 'draft',
      }}
      onSave={handleSave}
      onSaveAndClose={handleSaveAndClose}
      onClose={handleClose}
      showVariables={true}
    />
  );
}
