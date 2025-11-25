import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🎨 Minta árajánlat generálása...');

  // Get first admin user
  const admin = await prisma.user.findFirst({
    where: { email: 'admin@boommarketing.hu' },
  });

  if (!admin) {
    console.error('❌ Admin felhasználó nem található. Futtasd előbb a seed-et!');
    return;
  }

  // Delete existing sample if exists
  await prisma.proposal.deleteMany({
    where: { slug: 'boom-marketing-teljes-pelda-2025' },
  });

  // Create comprehensive sample proposal
  const proposal = await prisma.proposal.create({
    data: {
      slug: 'boom-marketing-teljes-pelda-2025',
      clientName: 'Példa Vállalkozás Kft.',
      brand: 'BOOM',
      status: 'PUBLISHED',
      createdById: admin.id,
      blocks: {
        create: [
          // 1. HERO BLOCK
          {
            blockType: 'HERO',
            displayOrder: 0,
            isEnabled: true,
            content: {
              version: '1.0',
              heading: 'Marketing Árajánlat 2025',
              subheading: 'Komplex digitális marketing megoldások a sikeres online jelenléthez',
              ctaText: 'Kezdjük el',
              ctaUrl: '#pricing',
              alignment: 'center',
            },
          },
          // 2. VALUE PROP BLOCK
          {
            blockType: 'VALUE_PROP',
            displayOrder: 1,
            isEnabled: true,
            content: {
              version: '1.0',
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
                content: 'Hiszünk abban, hogy a sikeres marketing őszinte partneri kapcsolaton alapul. Nem ígérünk csodaszereket, helyette adatvezérelt döntésekkel és folyamatos optimalizálással érjük el a kimagasló eredményeket. Minden ügyfél egyedi, így a stratégiánk is az.',
              },
            },
          },
          // 3. PRICING BLOCK
          {
            blockType: 'PRICING_TABLE',
            displayOrder: 2,
            isEnabled: true,
            content: {
              version: '1.0',
              heading: 'Válaszd ki a számodra ideális csomagot',
              description: 'Minden csomag tartalmazza a teljes körű kampánykezelést, kreatív gyártást és havi riportolást. Fix árazás, jutalékmentes.',
              plans: [
                {
                  id: '1',
                  name: 'Meta PPC',
                  description: 'Facebook és Instagram hirdetések',
                  originalPrice: null,
                  discountedPrice: 169990,
                  currency: 'HUF',
                  billingPeriod: 'monthly',
                  features: [
                    'Facebook hirdetések kezelése',
                    'Instagram kampányok',
                    'Kreatív gyártás (grafika + szöveg)',
                    'Havi riport találkozó (1 óra)',
                    'Folyamatos optimalizálás',
                    'Remarketing kampányok',
                  ],
                  isPopular: false,
                  ctaText: 'Kezdjük el',
                },
                {
                  id: '2',
                  name: 'Google + Meta',
                  description: 'Kombinált kampánykezelés',
                  originalPrice: 305820,
                  discountedPrice: 271660,
                  currency: 'HUF',
                  billingPeriod: 'monthly',
                  features: [
                    'Minden Meta PPC funkció',
                    'Google Ads kezelés',
                    'Google Shopping kampányok',
                    'Display hálózat',
                    'YouTube hirdetések',
                    'Cross-platform remarketing',
                    'Havi stratégiai konzultáció',
                  ],
                  isPopular: true,
                  ctaText: 'Legkedveltebb',
                },
                {
                  id: '3',
                  name: 'Full Marketing',
                  description: 'Teljes körű megoldás',
                  originalPrice: null,
                  discountedPrice: 450000,
                  currency: 'HUF',
                  billingPeriod: 'monthly',
                  features: [
                    'Minden előző funkció',
                    'TikTok hirdetések',
                    'E-mail marketing automatizmus',
                    'Landing oldal optimalizálás',
                    'Funnel tervezés',
                    'Dedikált account manager',
                  ],
                  isPopular: false,
                  ctaText: 'Egyeztetés',
                },
              ],
            },
          },
          // 4. PLATFORM SERVICES BLOCK
          {
            blockType: 'SERVICES_GRID',
            displayOrder: 3,
            isEnabled: true,
            content: {
              version: '1.0',
              heading: 'Hirdetési Platformok',
              subheading: 'Válaszd ki a vállalkozásodhoz legmegfelelőbb platformokat. Minden platform külön kezelhető, de együtt a legjobb eredményt hozzák.',
              columns: 3,
              services: [
                {
                  id: 'meta-ppc',
                  title: 'Meta PPC',
                  subtitle: 'Facebook & Instagram Hirdetések',
                  description: 'Az indulása óta a Meta platform a fizetett hirdetési platformok koronázatlan királya. A mai napig itt érhető el a legtöbb ember.',
                  iconType: 'meta',
                  variant: 'platform',
                  platformGradient: 'meta',
                  featured: true,
                  benefits: [
                    'Több platform (Facebook, Instagram) egyidejűleg',
                    'Célcsoport alapján történő célzás',
                    'Ez A hirdetési felület',
                    'Itt érhető el a legnagyobb közönség',
                    'Könnyen elindítható',
                  ],
                },
                {
                  id: 'google-search',
                  title: 'Google Keresés',
                  subtitle: 'Google Ads Kampányok',
                  description: 'A legidősebb hirdetési platform, ahol közvetlenül egy igényre reagálunk és nem mi keltjük fel azt, mint a többi felület esetén.',
                  iconType: 'google',
                  variant: 'platform',
                  platformGradient: 'google',
                  benefits: [
                    'Kulcsszavak alapján történő célzás',
                    'A legidősebb hirdetési felület',
                    'Közvetlen igényre reagálunk',
                    'Nincs extra költsége a kampányoknak',
                    'Tapasztalat és tudás szükséges hozzá',
                  ],
                },
                {
                  id: 'tiktok-ads',
                  title: 'TikTok',
                  subtitle: 'TikTok Hirdetések',
                  description: 'Ez a platform viszonylag még telítetlen, kisebb rajta a verseny, így a díjak is kedvezőbbek, mint a nagyobb testvéreiken.',
                  iconType: 'tiktok',
                  variant: 'platform',
                  platformGradient: 'tiktok',
                  benefits: [
                    'Még viszonylag olcsó hirdetési felület',
                    'Kisebb a verseny, mert magasabb a belépési küszöb',
                    'Fiatal közönséget hatékonyan érhetünk el',
                    'Minden célcsoport megtalálható',
                    'Extra költségként a videógyártás merül fel',
                  ],
                },
              ],
            },
          },
          // 5. ADDITIONAL SERVICES BLOCK
          {
            blockType: 'SERVICES_GRID',
            displayOrder: 4,
            isEnabled: true,
            content: {
              version: '1.0',
              heading: 'További Szolgáltatásaink',
              subheading: 'Komplex marketing megoldások a teljes vevőszerző rendszered fejlesztéséhez',
              columns: 3,
              services: [
                {
                  id: 'email-marketing',
                  title: 'E-mail Marketing Rendszer',
                  description: 'Komplex e-mail kampányok tervezése, szövegírás, automatizálás és folyamatos optimalizálás. Növeld az ügyfélmegtartást!',
                  iconType: 'email',
                  variant: 'service',
                },
                {
                  id: 'copywriting',
                  title: 'Copywriting',
                  description: 'Konverziókra optimalizált szövegírás hirdetésekhez, landing oldalakhoz és e-mail kampányokhoz. Értékesítő szövegek mesterfokon.',
                  iconType: 'copywriting',
                  variant: 'service',
                },
                {
                  id: 'landing-pages',
                  title: 'Landing & Sales Oldalak',
                  description: 'Konverzióra optimalizált landing oldalak tervezése, szövegírás, grafikai tervezés és megvalósítás. A/B tesztelés támogatással.',
                  iconType: 'landing',
                  variant: 'service',
                },
                {
                  id: 'audit',
                  title: 'Teljes Vevőszerző Audit',
                  description: 'Átfogó elemzés a teljes marketing rendszeredről. Azonosítjuk a szűk keresztmetszeteket és meghatározzuk a fejlesztési prioritásokat.',
                  iconType: 'audit',
                  variant: 'service',
                },
                {
                  id: 'social-media',
                  title: 'Social Media Kezelés',
                  description: 'Professzionális közösségi média jelenlét építése. Tartalomtervezés, posztolás, közösségépítés és engagement növelés.',
                  iconType: 'social',
                  variant: 'service',
                },
                {
                  id: 'marketing-consulting',
                  title: 'Online Marketing Tanácsadás',
                  description: 'Szakértői tanácsadás teljes online marketing stratégiád megtervezéséhez. Csatornavizsgálat, költségvetés tervezés és ROI optimalizálás.',
                  iconType: 'audit',
                  variant: 'service',
                },
              ],
            },
          },
          // 6. GUARANTEES BLOCK
          {
            blockType: 'GUARANTEES',
            displayOrder: 5,
            isEnabled: true,
            content: {
              version: '1.0',
              heading: 'Garanciáink és ígéreteink',
              leftColumn: [
                '2 munkanapon belüli e-mail válaszidő garantálva',
                '3 munkanapon belüli reakció módosítási kérésekre',
                '4 munkanapon belül kampány módosítások',
              ],
              rightColumn: [
                'Fix árazás, nincs jutalék vagy rejtett költség',
                'Minimum 3 hónapos együttműködés',
                'Havi részletes riportolás és konzultáció',
              ],
            },
          },
          // 7. CTA BLOCK
          {
            blockType: 'CTA',
            displayOrder: 6,
            isEnabled: true,
            content: {
              version: '1.0',
              heading: 'Készen állsz a növekedésre?',
              description: 'Foglalj egy ingyenes konzultációt, vagy kérj egyedi ajánlatot vállalkozásodhoz!',
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

  console.log('✅ Minta árajánlat sikeresen létrehozva!');
  console.log(`📋 Ügyfél: ${proposal.clientName}`);
  console.log(`🔗 URL: /${proposal.slug}`);
  console.log(`🎨 Brand: ${proposal.brand}`);
  console.log(`📊 Blokkok: 7 db`);
  console.log('\n👉 Nyisd meg a böngészőben: http://localhost:3000/' + proposal.slug);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
