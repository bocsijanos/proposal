import { prisma } from '../lib/prisma';

async function main() {
  console.log('🎨 Minta árajánlat generálása...');

  const admin = await prisma.user.findFirst({
    where: { email: 'admin@boommarketing.hu' },
  });

  if (!admin) {
    console.error('❌ Admin nem található. Futtasd: npm run prisma db seed');
    return;
  }

  // Delete if exists
  await prisma.proposal.deleteMany({
    where: { slug: 'boom-marketing-teljes-pelda-2025' },
  });

  const proposal = await prisma.proposal.create({
    data: {
      slug: 'boom-marketing-teljes-pelda-2025',
      clientName: 'Példa Vállalkozás Kft.',
      brand: 'BOOM',
      status: 'PUBLISHED',
      createdById: admin.id,
      blocks: {
        create: [
          {
            blockType: 'HERO',
            displayOrder: 0,
            isEnabled: true,
            content: {
              heading: 'Marketing Árajánlat 2025',
              subheading: 'Komplex digitális marketing megoldások a sikeres online jelenléthez',
              ctaText: 'Kezdjük el',
              ctaUrl: '#pricing',
              alignment: 'center',
            },
          },
          {
            blockType: 'VALUE_PROP',
            displayOrder: 1,
            isEnabled: true,
            content: {
              heading: 'Miért érdemes velünk dolgozni?',
              leftColumn: {
                title: 'A mi különlegességünk',
                items: [
                  'Transzparens kommunikáció minden lépésnél',
                  'Folyamatos optimalizálás és A/B tesztelés',
                  'Fix árazás, jutalékmentes együttműködés',
                  'Havi részletes riport találkozó',
                  'Proaktív stratégiai tanácsadás',
                ],
              },
              rightColumn: {
                title: 'BOOM Marketing hitvallása',
                content: 'Hiszünk abban, hogy a sikeres marketing őszinte partneri kapcsolaton alapul. Nem ígérünk csodaszereket, helyette adatvezérelt döntésekkel és folyamatos optimalizálással érjük el a kimagasló eredményeket.',
              },
            },
          },
          {
            blockType: 'PRICING_TABLE',
            displayOrder: 2,
            isEnabled: true,
            content: {
              heading: 'Válaszd ki a számodra ideális csomagot',
              description: 'Minden csomag tartalmazza a teljes körű kampánykezelést, kreatív gyártást és havi riportolást.',
              plans: [
                {
                  id: '1',
                  name: 'Meta PPC',
                  description: 'Facebook és Instagram',
                  discountedPrice: 169990,
                  currency: 'HUF',
                  billingPeriod: 'monthly',
                  features: [
                    'Facebook hirdetések',
                    'Instagram kampányok',
                    'Kreatív gyártás',
                    'Havi riport találkozó',
                    'Folyamatos optimalizálás',
                  ],
                  ctaText: 'Kezdjük el',
                },
                {
                  id: '2',
                  name: 'Google + Meta',
                  description: 'Kombinált megoldás',
                  originalPrice: 305820,
                  discountedPrice: 271660,
                  currency: 'HUF',
                  billingPeriod: 'monthly',
                  features: [
                    'Minden Meta funkció',
                    'Google Ads kezelés',
                    'Shopping kampányok',
                    'YouTube hirdetések',
                    'Cross-platform remarketing',
                  ],
                  isPopular: true,
                  ctaText: 'Legkedveltebb',
                },
                {
                  id: '3',
                  name: 'Full Marketing',
                  description: 'Teljes körű megoldás',
                  discountedPrice: 450000,
                  currency: 'HUF',
                  billingPeriod: 'monthly',
                  features: [
                    'Minden előző funkció',
                    'TikTok hirdetések',
                    'E-mail marketing',
                    'Landing oldal optimalizálás',
                    'Dedikált account manager',
                  ],
                  ctaText: 'Egyeztetés',
                },
              ],
            },
          },
          {
            blockType: 'SERVICES_GRID',
            displayOrder: 3,
            isEnabled: true,
            content: {
              heading: 'További szolgáltatásaink',
              columns: 3,
              services: [
                {
                  id: '1',
                  title: 'E-mail Marketing',
                  description: 'Komplex e-mail kampányok automatizálása és optimalizálása',
                  icon: '📧',
                  price: '450.000 Ft + ÁFA',
                },
                {
                  id: '2',
                  title: 'Landing Oldal',
                  description: 'Konverzióra optimalizált landing oldalak készítése',
                  icon: '🎨',
                  price: '350.000 Ft + ÁFA',
                },
                {
                  id: '3',
                  title: 'Tartalomgyártás',
                  description: 'SEO optimalizált blogcikkek és social media tartalmak',
                  icon: '✍️',
                  price: '35.000 Ft/cikk + ÁFA',
                },
              ],
            },
          },
          {
            blockType: 'GUARANTEES',
            displayOrder: 4,
            isEnabled: true,
            content: {
              heading: 'Garanciáink',
              leftColumn: [
                '2 munkanapon belüli e-mail válaszidő',
                '3 munkanapon belüli reakció módosításokra',
                '4 munkanapon belül kampány változtatások',
              ],
              rightColumn: [
                'Fix árazás, nincs rejtett költség',
                'Minimum 3 hónapos együttműködés',
                'Havi részletes riportolás',
              ],
            },
          },
          {
            blockType: 'CTA',
            displayOrder: 5,
            isEnabled: true,
            content: {
              heading: 'Készen állsz a növekedésre?',
              description: 'Foglalj ingyenes konzultációt vagy kérj egyedi ajánlatot!',
              primaryCta: {
                text: 'Ingyenes Konzultáció',
                url: 'https://boommarketing.hu/kapcsolat',
              },
              secondaryCta: {
                text: 'Ajánlat Kérés',
                url: 'mailto:hello@boommarketing.hu',
              },
            },
          },
        ],
      },
    },
  });

  console.log('✅ Minta árajánlat elkészült!');
  console.log(`📋 Ügyfél: ${proposal.clientName}`);
  console.log(`🔗 URL: http://localhost:3000/${proposal.slug}`);
  console.log(`🎨 Brand: ${proposal.brand}`);
}

main()
  .finally(() => prisma.$disconnect());
