import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { BlockRenderer } from '@/components/builder/BlockRenderer';
import { TableOfContents } from '@/components/proposal/TableOfContents';
import Image from 'next/image';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Function to get full proposal with view count increment
async function getProposal(slug: string) {
  const proposal = await prisma.proposal.findUnique({
    where: {
      slug,
      status: 'PUBLISHED',
    },
    include: {
      blocks: {
        where: {
          isEnabled: true,
        },
        orderBy: {
          displayOrder: 'asc',
        },
        select: {
          id: true,
          blockType: true,
          content: true,
          displayOrder: true,
          renderedHtml: true,
          lastRenderedAt: true,
        },
      },
      // Include creator (admin) info for template variables
      createdBy: {
        select: {
          name: true,
          email: true,
          phone: true,
          avatarUrl: true,
        },
      },
    },
  });

  if (!proposal) {
    return null;
  }

  // Track view in background - fire and forget
  setImmediate(() => {
    prisma.proposal.update({
      where: { id: proposal.id },
      data: {
        viewCount: { increment: 1 },
        lastViewedAt: new Date(),
      },
    }).catch(() => {
      // Silently ignore view tracking errors
    });
  });

  return proposal;
}

// Enable ISR with 60 second revalidation
export const revalidate = 60;

// Disable static generation in development to prevent connection issues
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const proposal = await getProposal(slug);

  if (!proposal) {
    return {
      title: 'Árajánlat nem található',
    };
  }

  return {
    title: `${proposal.clientName} - Árajánlat | ${proposal.brand === 'BOOM' ? 'Boom Marketing' : 'AiBoost'}`,
    description: `Marketing árajánlat ${proposal.clientName} számára`,
  };
}

export default async function ProposalPage({ params }: PageProps) {
  const { slug } = await params;
  const proposal = await getProposal(slug);

  if (!proposal) {
    notFound();
  }

  // Apply theme based on brand
  const themeAttr = proposal.brand === 'BOOM' ? 'boom' : 'aiboost';

  return (
    <div className="min-h-screen bg-white" data-theme={themeAttr}>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white backdrop-blur-xl border-b border-[var(--color-border)] shadow-sm">
        <div className="container-custom">
          <div className="flex items-center justify-between py-3 md:py-4">
            {/* Logo */}
            <div className="flex items-center gap-6">
              <a
                href={proposal.brand === 'BOOM' ? 'https://boommarketing.hu/' : 'https://aiboost.hu/'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 transition-opacity hover:opacity-80"
              >
                <Image
                  src={proposal.brand === 'BOOM' ? '/logos/boom.svg' : '/logos/aiboost.svg'}
                  alt={proposal.brand === 'BOOM' ? 'Boom Marketing' : 'AiBoost'}
                  width={120}
                  height={120}
                  priority
                  loading="eager"
                  style={{ width: '120px', height: 'auto' }}
                />
              </a>

              {/* Divider */}
              <div className="hidden md:block w-px h-12 bg-[var(--color-border)]" />

              {/* Client Info */}
              <div className="flex flex-col gap-1">
                <h1 className="text-lg md:text-xl font-bold text-[var(--color-text)] leading-tight">
                  {proposal.clientName}
                </h1>
                <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--color-muted)]">
                  <span className="font-medium">{proposal.slug}</span>
                  {(proposal.clientEmail || proposal.clientPhone) && (
                    <>
                      <span className="hidden sm:inline">•</span>
                      <div className="flex flex-wrap items-center gap-3">
                        {proposal.clientEmail && (
                          <a
                            href={`mailto:${proposal.clientEmail}`}
                            className="text-xs hover:text-[var(--color-primary)] transition-colors flex items-center gap-1"
                            title={`Email küldése: ${proposal.clientEmail}`}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                            </svg>
                            {proposal.clientEmail.slice(0, 2)}***{proposal.clientEmail.slice(proposal.clientEmail.indexOf('@'))}
                          </a>
                        )}
                        {proposal.clientPhone && (
                          <a
                            href={`tel:${proposal.clientPhone.replace(/\s/g, '')}`}
                            className="text-xs hover:text-[var(--color-primary)] transition-colors flex items-center gap-1"
                            title={`Hívás: ${proposal.clientPhone}`}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                            </svg>
                            {proposal.clientPhone.slice(0, 6)} *** ****
                          </a>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Brand Badge */}
            <div className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-background-alt)] border border-[var(--color-border)]">
              <div className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-pulse" />
              <span className="text-sm font-medium text-[var(--color-text)]">
                {proposal.brand === 'BOOM' ? 'Boom Marketing' : 'AiBoost'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="bg-[var(--color-background-alt)] w-full">
        <div className="container-custom py-12 md:py-16 lg:py-20">
          <div className="space-y-8 md:space-y-10 lg:space-y-12">
            {proposal.blocks.map((block: any) => (
              <div key={block.id} className="animate-fadeIn" data-block-id={block.id}>
                {/* Use server-rendered HTML if available, otherwise use dynamic rendering */}
                {block.renderedHtml ? (
                  <div
                    className="rendered-block"
                    data-block-type={block.blockType}
                    dangerouslySetInnerHTML={{ __html: block.renderedHtml }}
                  />
                ) : (
                  <BlockRenderer
                    block={block}
                    brand={proposal.brand}
                    proposalData={{
                      clientName: proposal.clientName,
                      clientEmail: proposal.clientEmail,
                      clientPhone: proposal.clientPhone,
                      clientContactName: proposal.clientContactName,
                      createdByName: proposal.createdByName || proposal.createdBy?.name,
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Table of Contents - csak nagy képernyőkön */}
      <TableOfContents blocks={proposal.blocks as any} />

      {/* Footer */}
      <footer className="bg-[var(--color-background)] text-white py-12 mt-16">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <a
                href={proposal.brand === 'BOOM' ? 'https://boommarketing.hu/' : 'https://aiboost.hu/'}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-opacity hover:opacity-80"
              >
                <Image
                  src={proposal.brand === 'BOOM' ? '/logos/boom.svg' : '/logos/aiboost.svg'}
                  alt={proposal.brand === 'BOOM' ? 'Boom Marketing' : 'AiBoost'}
                  width={120}
                  height={120}
                  className="brightness-0 invert"
                  style={{ width: '120px', height: 'auto' }}
                />
              </a>
              <div>
                <div className="font-bold">
                  {proposal.brand === 'BOOM' ? 'Boom Marketing' : 'AiBoost'}
                </div>
                <div className="text-sm text-white/70">
                  Marketing Excellence
                </div>
              </div>
            </div>
            <div className="text-center md:text-right text-sm text-white/70">
              <div>Árajánlat generálva: {new Date().toLocaleDateString('hu-HU')}</div>
              {(proposal.createdByName || proposal.createdBy?.name) && (
                <div className="mt-1">Készítette: {proposal.createdByName || proposal.createdBy?.name}</div>
              )}
              <div className="mt-1">
                © {new Date().getFullYear()} {proposal.brand === 'BOOM' ? 'Boom Marketing' : 'AiBoost'}. Minden jog fenntartva.
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
