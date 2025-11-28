'use client';

import { useEffect, useState } from 'react';

interface Block {
  id: string;
  blockType: string;
  displayOrder: number;
  content?: {
    title?: string;
    originalBlockType?: string;
    puckData?: unknown;
  };
}

interface TableOfContentsProps {
  blocks: Block[];
}

// Helper function to get block name from content or fallback to type mapping
function getBlockName(block: Block): string {
  // First, try to get title from content
  if (block.content?.title) {
    return block.content.title;
  }

  // Fallback to originalBlockType mapping
  const typeNames: Record<string, string> = {
    HERO: 'Bevezető',
    PRICING_TABLE: 'Árazás',
    SERVICES_GRID: 'Szolgáltatások',
    VALUE_PROP: 'Értékajánlat',
    GUARANTEES: 'Garanciák',
    CTA: 'Kapcsolatfelvétel',
    PROCESS_TIMELINE: 'Folyamat',
    CLIENT_LOGOS: 'Referenciák',
    TEXT_BLOCK: 'Szöveges tartalom',
    TWO_COLUMN: 'Kétoszlopos',
    PLATFORM_FEATURES: 'Platform funkciók',
    STATS: 'Statisztikák',
    PUCK_CONTENT: 'Tartalom',
  };

  const originalType = block.content?.originalBlockType;
  if (originalType && typeNames[originalType]) {
    return typeNames[originalType];
  }

  return typeNames[block.blockType] || `Szekció ${block.displayOrder + 1}`;
}

export function TableOfContents({ blocks }: TableOfContentsProps) {
  const [activeSection, setActiveSection] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const blockId = entry.target.getAttribute('data-block-id');
            if (blockId) {
              setActiveSection(blockId);
            }
          }
        });
      },
      {
        rootMargin: '-20% 0px -70% 0px',
      }
    );

    // Observe all block sections
    const sections = document.querySelectorAll('[data-block-id]');
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  const scrollToBlock = (blockId: string) => {
    const element = document.querySelector(`[data-block-id="${blockId}"]`);
    if (element) {
      const header = document.querySelector('header');
      const headerHeight = header ? header.offsetHeight : 0;

      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerHeight - 20;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });

      // Close drawer on mobile after clicking
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Desktop: Fixed sidebar */}
      <nav className="hidden xl:block fixed right-8 top-1/2 -translate-y-1/2 z-40 w-64">
        <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200 p-6">
          <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">
            Tartalomjegyzék
          </h3>
          <ul className="space-y-2">
            {blocks.map((block) => {
              const isActive = activeSection === block.id;
              const blockName = getBlockName(block);

              return (
                <li key={block.id}>
                  <button
                    onClick={() => scrollToBlock(block.id)}
                    className={`
                      w-full text-left px-3 py-2 rounded-full transition-all text-sm
                      ${
                        isActive
                          ? 'bg-[var(--color-primary)] text-white font-semibold'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }
                    `}
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className={`
                        w-1.5 h-1.5 rounded-full flex-shrink-0
                        ${isActive ? 'bg-white' : 'bg-gray-400'}
                      `}
                      />
                      <span className="truncate">{blockName}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* Mobile: FAB + Drawer */}
      <div className="xl:hidden">
        {/* Floating Action Button */}
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[var(--color-primary)] text-white rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center justify-center"
          aria-label="Tartalomjegyzék megnyitása"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Backdrop */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
        )}

        {/* Drawer */}
        <div
          className={`
            fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl
            transition-transform duration-300 ease-out
            ${isOpen ? 'translate-y-0' : 'translate-y-full'}
          `}
          style={{ maxHeight: '70vh' }}
        >
          {/* Handle bar */}
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">
              Tartalomjegyzék
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Bezárás"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto px-6 py-4" style={{ maxHeight: 'calc(70vh - 120px)' }}>
            <ul className="space-y-2">
              {blocks.map((block) => {
                const isActive = activeSection === block.id;
                const blockName = getBlockName(block);

                return (
                  <li key={block.id}>
                    <button
                      onClick={() => scrollToBlock(block.id)}
                      className={`
                        w-full text-left px-4 py-3 rounded-full transition-all
                        ${
                          isActive
                            ? 'bg-[var(--color-primary)] text-white font-semibold'
                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                        }
                      `}
                    >
                      <span className="flex items-center gap-3">
                        <span
                          className={`
                          w-2 h-2 rounded-full flex-shrink-0
                          ${isActive ? 'bg-white' : 'bg-gray-400'}
                        `}
                        />
                        <span>{blockName}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
