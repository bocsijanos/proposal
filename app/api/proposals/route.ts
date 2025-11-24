import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/proposals - List all proposals
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const proposals = await prisma.proposal.findMany({
      orderBy: {
        updatedAt: 'desc',
      },
      select: {
        id: true,
        slug: true,
        clientName: true,
        clientContactName: true,
        clientPhone: true,
        clientEmail: true,
        brand: true,
        status: true,
        viewCount: true,
        createdAt: true,
        updatedAt: true,
        createdByName: true,
        _count: {
          select: {
            blocks: true,
          },
        },
      },
    });

    return NextResponse.json(proposals);
  } catch (error) {
    console.error('Error fetching proposals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch proposals' },
      { status: 500 }
    );
  }
}

// POST /api/proposals - Create new proposal
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { clientName, clientContactName, clientPhone, clientEmail, brand } = body;

    if (!clientName || !brand) {
      return NextResponse.json(
        { error: 'Client name and brand are required' },
        { status: 400 }
      );
    }

    // Generate unique slug with:
    // - Company name (without Hungarian accents)
    // - Date (YYYYMMDD)
    // - 3-digit sequential number
    const removeAccents = (str: string) => {
      return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    };

    const normalizedName = removeAccents(clientName)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const date = new Date().toISOString().split('T')[0].replace(/-/g, ''); // YYYYMMDD
    const baseSlug = `${normalizedName}-${date}`;

    let slug = `${baseSlug}-001`;
    let counter = 2;

    while (await prisma.proposal.findUnique({ where: { slug } })) {
      const paddedCounter = String(counter).padStart(3, '0');
      slug = `${baseSlug}-${paddedCounter}`;
      counter++;
    }

    // Try to load blocks from templates first (filtered by brand)
    const templates = await prisma.blockTemplate.findMany({
      where: {
        isActive: true,
        brand: brand,
      },
      orderBy: { displayOrder: 'asc' },
    });

    let defaultBlocks;

    if (templates.length > 0) {
      // Use templates from database, ensuring unique displayOrder
      defaultBlocks = templates.map((template, index) => ({
        blockType: template.blockType,
        displayOrder: index, // Always use index to ensure unique displayOrder
        isEnabled: template.isActive,
        content: template.defaultContent,
      }));
    } else {
      // Define all available block types with default content (fallback)
      defaultBlocks = [
      {
        blockType: 'HERO' as const,
        displayOrder: 0,
        isEnabled: true,
        content: {
          heading: 'Növeld vállalkozásod online jelenlétét',
          subheading: 'Professzionális marketing megoldások, amelyek valódi eredményeket hoznak',
          showCTA: true,
          ctaText: 'Ajánlat bekérése',
        },
      },
      {
        blockType: 'VALUE_PROP' as const,
        displayOrder: 1,
        isEnabled: true,
        content: {
          heading: 'Miért válassz minket?',
          leftColumn: {
            title: 'Tapasztalat és szakértelem',
            items: [
              '5+ év tapasztalat digital marketingben',
              'Több mint 100+ sikeres kampány',
              'Szakértő csapat: stratéga, designer, fejlesztő',
              'Folyamatos képzés és tanulás',
              'Átlátható kommunikáció minden lépésnél'
            ],
          },
          rightColumn: {
            title: 'Az eredmények beszélnek',
            content: 'Ügyfeleink átlagosan 3x-es növekedést érnek el az első 6 hónapban. Nem csak kampányokat futtatunk, hanem hosszú távú partneri kapcsolatot építünk. Minden projektet egyedi igények szerint alakítunk, mert tudjuk, hogy nincs két egyforma vállalkozás.',
          },
        },
      },
      {
        blockType: 'SERVICES_GRID' as const,
        displayOrder: 2,
        isEnabled: true,
        content: {
          heading: 'Szolgáltatásaink',
          subheading: 'Teljes körű marketing megoldások egy helyen',
          services: [
            {
              id: '1',
              title: 'Social Media Marketing',
              description: 'Facebook, Instagram és TikTok hirdetések professzionális kezeléssel',
              variant: 'service',
              iconType: 'facebook',
              benefits: [
                'Targeting stratégia kidolgozás',
                'Kreatív tervezés',
                'Kampány optimalizálás',
                'Havi riportolás'
              ]
            },
            {
              id: '2',
              title: 'Google Ads',
              description: 'Keresőhirdetések és Display kampányok',
              variant: 'service',
              iconType: 'google',
              benefits: [
                'Kulcsszó kutatás',
                'Hirdetés szövegírás',
                'Ajánlat optimalizálás',
                'Konverzió követés'
              ]
            },
            {
              id: '3',
              title: 'Email Marketing',
              description: 'Automatizált email kampányok és hírlevél kezelés',
              variant: 'service',
              iconType: 'email',
              benefits: [
                'Lista szegmentálás',
                'Email design',
                'A/B tesztelés',
                'Automatizáció beállítás'
              ]
            }
          ],
        },
      },
      {
        blockType: 'PLATFORM_FEATURES' as const,
        displayOrder: 3,
        isEnabled: false,
        content: {
          heading: 'Platform szolgáltatások',
          features: [],
        },
      },
      {
        blockType: 'PRICING_TABLE' as const,
        displayOrder: 4,
        isEnabled: true,
        content: {
          heading: 'Csomagjaink',
          description: 'Válaszd ki az Önnek legmegfelelőbb csomagot',
          plans: [
            {
              id: '1',
              name: 'Starter',
              description: 'Kezdő vállalkozásoknak',
              discountedPrice: 150000,
              currency: 'HUF',
              billingPeriod: 'monthly',
              features: [
                '1 platform kezelés',
                'Havi 2 kampány',
                'Havi riport',
                'Email support'
              ],
              ctaText: 'Kezdjük el',
            },
            {
              id: '2',
              name: 'Professional',
              description: 'Növekvő vállalkozásoknak',
              discountedPrice: 300000,
              currency: 'HUF',
              billingPeriod: 'monthly',
              isPopular: true,
              features: [
                '3 platform kezelés',
                'Havi 5 kampány',
                'Hetente riport',
                'Dedicated account manager',
                'A/B tesztelés',
                'Landing page optimalizálás'
              ],
              ctaText: 'Népszerű választás',
            },
            {
              id: '3',
              name: 'Enterprise',
              description: 'Nagyvállalatok számára',
              discountedPrice: 500000,
              currency: 'HUF',
              billingPeriod: 'monthly',
              features: [
                'Korlátlan platformok',
                'Korlátlan kampányok',
                'Napi riportolás',
                'Dedicated team',
                'Stratégiai tanácsadás',
                'Custom integrációk',
                'Prioritás support'
              ],
              ctaText: 'Egyedi ajánlat',
            },
          ],
        },
      },
      {
        blockType: 'PROCESS_TIMELINE' as const,
        displayOrder: 5,
        isEnabled: true,
        content: {
          heading: 'Együttműködésünk lépései',
          steps: [
            {
              id: '1',
              number: 1,
              title: 'Megismerés',
              description: 'Első konzultáció ahol megismerjük az üzleted, céljaidat és kihívásaidat. Átbeszéljük az elvárásokat és lehetőségeket.',
              icon: '🤝'
            },
            {
              id: '2',
              number: 2,
              title: 'Stratégia',
              description: 'Egyedi marketing stratégia kidolgozása az Ön igényei szerint. Részletes akcióterv és ütemterv összeállítása.',
              icon: '📋'
            },
            {
              id: '3',
              number: 3,
              title: 'Megvalósítás',
              description: 'A kampányok elindítása és folyamatos optimalizálás. Kreatívok készítése és tesztelése.',
              icon: '🚀'
            },
            {
              id: '4',
              number: 4,
              title: 'Mérés & Riportolás',
              description: 'Folyamatos eredménymérés és átlátható riportolás. Havi értékelés és következő lépések meghatározása.',
              icon: '📊'
            }
          ],
        },
      },
      {
        blockType: 'STATS' as const,
        displayOrder: 6,
        isEnabled: true,
        content: {
          heading: 'Eredményeink számokban',
          stats: [
            {
              id: '1',
              value: '100+',
              label: 'Elégedett ügyfél',
              icon: '😊'
            },
            {
              id: '2',
              value: '3x',
              label: 'Átlagos ROI növekedés',
              icon: '📈'
            },
            {
              id: '3',
              value: '5M+',
              label: 'Elköltött hirdetési költségvetés',
              suffix: ' Ft',
              icon: '💰'
            },
            {
              id: '4',
              value: '98%',
              label: 'Ügyfél megtartás',
              icon: '⭐'
            }
          ],
        },
      },
      {
        blockType: 'GUARANTEES' as const,
        displayOrder: 7,
        isEnabled: true,
        content: {
          heading: 'Garanciáink',
          leftColumn: [
            'Pénzvisszafizetési garancia ha nem érjük el a megbeszélt célokat',
            'Havi riportolás és teljes átláthatóság',
            'Folyamatos elérhetőség és támogatás'
          ],
          rightColumn: [
            'Szakértő csapat minden projekthez',
            'Modern eszközök és technológiák használata',
            'Folyamatos képzés és iparági trendek követése'
          ],
        },
      },
      {
        blockType: 'CLIENT_LOGOS' as const,
        displayOrder: 8,
        isEnabled: false,
        content: {
          heading: 'Ügyfeleink',
          logos: [],
        },
      },
      {
        blockType: 'TWO_COLUMN' as const,
        displayOrder: 9,
        isEnabled: false,
        content: {
          leftColumn: {
            type: 'text' as const,
            title: '',
            text: '',
          },
          rightColumn: {
            type: 'text' as const,
            title: '',
            text: '',
          },
        },
      },
      {
        blockType: 'TEXT_BLOCK' as const,
        displayOrder: 10,
        isEnabled: false,
        content: {
          body: '',
        },
      },
      {
        blockType: 'CTA' as const,
        displayOrder: 11,
        isEnabled: true,
        content: {
          heading: 'Készen állsz a növekedésre?',
          description: 'Lépj kapcsolatba velünk még ma és beszéljük meg, hogyan segíthetünk elérni céljaidat!',
          primaryCta: {
            text: 'Ingyenes konzultáció',
            url: 'mailto:hello@example.com',
          },
          secondaryCta: {
            text: 'Telefonos egyeztetés',
            url: 'tel:+36301234567',
          },
        },
      },
    ];

      // If no templates exist, save these defaults as templates for future use
      if (templates.length === 0) {
        await Promise.all(
          defaultBlocks.map((block) =>
            prisma.blockTemplate.create({
              data: {
                blockType: block.blockType,
                name: 'Alapértelmezett',
                description: `Alapértelmezett ${block.blockType.replace(/_/g, ' ')} sablon`,
                defaultContent: block.content,
                displayOrder: block.displayOrder,
                isActive: block.isEnabled,
              },
            })
          )
        );
      }
    }

    // Create proposal with all default blocks
    const proposal = await prisma.proposal.create({
      data: {
        slug,
        clientName,
        clientContactName: clientContactName || null,
        clientPhone: clientPhone || null,
        clientEmail: clientEmail || null,
        brand,
        status: 'DRAFT',
        createdById: (session.user as any).id,
        createdByName: (session.user as any).name || session.user?.email || 'Unknown',
        blocks: {
          create: defaultBlocks as any,
        },
      },
      include: {
        blocks: {
          orderBy: {
            displayOrder: 'asc',
          },
        },
      },
    });

    return NextResponse.json(proposal, { status: 201 });
  } catch (error) {
    console.error('Error creating proposal:', error);
    return NextResponse.json(
      { error: 'Failed to create proposal' },
      { status: 500 }
    );
  }
}
