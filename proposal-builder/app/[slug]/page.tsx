import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { TableOfContents } from '@/components/proposal/TableOfContents';
import Image from 'next/image';
import { SensitiveDataProvider } from '@/components/proposal/SensitiveDataProvider';
import { SensitiveContactInfo } from '@/components/proposal/SensitiveContactInfo';
import { SensitiveCreatorInfo } from '@/components/proposal/SensitiveCreatorInfo';
import { ClientBlockRenderer } from '@/components/proposal/ClientBlockRenderer';

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
    // Prevent search engine indexing for privacy
    robots: {
      index: false,
      follow: false,
      googleBot: {
        index: false,
        follow: false,
      },
    },
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
    <SensitiveDataProvider slug={slug}>
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
                    {/* Contact info loaded client-side to hide from bots */}
                    <SensitiveContactInfo />
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
                    <ClientBlockRenderer
                      block={block}
                      brand={proposal.brand}
                      clientName={proposal.clientName}
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
                {/* Creator name loaded client-side to hide from bots */}
                <SensitiveCreatorInfo />
                <div className="mt-1">
                  © {new Date().getFullYear()} {proposal.brand === 'BOOM' ? 'Boom Marketing' : 'AiBoost'}. Minden jog fenntartva.
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </SensitiveDataProvider>
  );
}
