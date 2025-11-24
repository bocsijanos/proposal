import 'dotenv/config'
import { PrismaClient, BlockType, Brand } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create admin users
  const adminPassword = await bcrypt.hash('admin123', 10)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@boommarketing.hu' },
    update: {},
    create: {
      email: 'admin@boommarketing.hu',
      passwordHash: adminPassword,
      name: 'Boom Admin',
      role: 'SUPER_ADMIN',
    },
  })

  const admin2 = await prisma.user.upsert({
    where: { email: 'admin@aiboost.hu' },
    update: {},
    create: {
      email: 'admin@aiboost.hu',
      passwordHash: adminPassword,
      name: 'AiBoost Admin',
      role: 'ADMIN',
    },
  })

  console.log('✅ Created admin users')

  // Block Templates
  const blockTemplates = [
    {
      blockType: BlockType.HERO,
      name: 'Standard Hero',
      description: 'Teljes szélességű hero háttérképpel és CTA-val',
      defaultContent: {
        version: '1.0',
        heading: 'Árajánlat 2025',
        subheading: 'Modern marketing megoldások vállalkozásoknak',
        backgroundImage: '/images/hero-bg.jpg',
        ctaText: 'Kezdjünk neki',
        ctaUrl: '#contact',
        alignment: 'center',
      },
      displayOrder: 1,
    },
    {
      blockType: BlockType.VALUE_PROP,
      name: '2 Oszlopos Értékajánlat',
      description: 'Értékajánlat 2 oszlopban középső ikonnal',
      defaultContent: {
        version: '1.0',
        heading: 'Miben nyújtunk többet?',
        leftColumn: {
          title: 'Előnyeink',
          items: [
            'Transzparens kommunikáció',
            'Folyamatos optimalizálás',
            'Fix árazás, jutalék mentesen',
            'Havi riport találkozó',
          ],
        },
        rightColumn: {
          title: 'A mi hitvallásunk',
          content: 'Úgy gondoljuk, hogy a sikeres marketing az őszinte partneri kapcsolaton alapul.',
        },
        iconUrl: '/images/value-icon.svg',
      },
      displayOrder: 2,
    },
    {
      blockType: BlockType.PLATFORM_FEATURES,
      name: 'Platform Funkciók',
      description: 'Platform logó és bullet pontok',
      defaultContent: {
        version: '1.0',
        platformName: 'Google Ads',
        platformLogo: '/logos/google-ads.svg',
        heading: 'Google PPC Hirdetéskezelés',
        features: [
          'Keresőhálózati kampányok',
          'Display hálózati hirdetések',
          'Shopping kampányok',
          'YouTube video hirdetések',
          'Remarketing kampányok',
        ],
        description: 'Teljes körű Google Ads kampánykezelés átfogó riportolással és folyamatos optimalizálással.',
        backgroundColor: '#4285f4',
      },
      displayOrder: 3,
    },
    {
      blockType: BlockType.PRICING_TABLE,
      name: '3 Oszlopos Árazás',
      description: 'Háromoszlopos árazási tábla kedvezménnyel',
      defaultContent: {
        version: '1.0',
        heading: 'Válaszd ki a csomagod',
        description: 'Minden csomag tartalmazza a teljes körű kampánykezelést és havi riportolást.',
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
              'Facebook hirdetések',
              'Instagram kampányok',
              'Kreatív gyártás',
              'Havi riport találkozó',
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
              'Minden Meta funkció',
              'Google Ads kezelés',
              'Remarketing kampányok',
              'Havi stratégiai konzultáció',
            ],
            isPopular: true,
            ctaText: 'Kezdjük el',
          },
          {
            id: '3',
            name: 'Full Package',
            description: 'Teljes körű marketing megoldás',
            originalPrice: null,
            discountedPrice: 450000,
            currency: 'HUF',
            billingPeriod: 'monthly',
            features: [
              'Minden előző funkció',
              'TikTok hirdetések',
              'E-mail marketing',
              'Landing oldal készítés',
            ],
            isPopular: false,
            ctaText: 'Egyeztetés',
          },
        ],
      },
      displayOrder: 4,
    },
    {
      blockType: BlockType.GUARANTEES,
      name: 'Garanciák',
      description: '3 oszlopos garancia szekció',
      defaultContent: {
        version: '1.0',
        heading: 'Mire számíthatsz?',
        leftColumn: [
          '2 munkanapon belüli e-mail válaszidő',
          '3 munkanapon belüli reakció módosítási kérésekre',
          '4 munkanapon belül kampány módosítások',
        ],
        rightColumn: [
          'Fix árazás, nincs jutalék',
          'Minimum 3 hónapos együttműködés',
          'Havi részletes riportolás',
        ],
        centerImage: '/images/guarantees.svg',
      },
      displayOrder: 5,
    },
    {
      blockType: BlockType.PROCESS_TIMELINE,
      name: 'Folyamat Timeline',
      description: 'Lépésről lépésre folyamat megjelenítése',
      defaultContent: {
        version: '1.0',
        heading: 'Hogyan működünk együtt?',
        steps: [
          {
            id: '1',
            title: '1. Hónap',
            subtitle: 'Felkészülés',
            description: 'Stratégia egyeztetés, kampány setup, kreatív gyártás',
          },
          {
            id: '2',
            title: '2. Hónap',
            subtitle: 'Indítás',
            description: 'Kampányok indítása, tesztelés, első optimalizálások',
          },
          {
            id: '3',
            title: '3. Hónap',
            subtitle: 'Optimalizálás',
            description: 'Finomhangolás, skálázás, A/B tesztek',
          },
          {
            id: '4',
            title: '4+ Hónap',
            subtitle: 'Növekedés',
            description: 'Folyamatos fejlesztés és eredményközpontú működés',
          },
        ],
      },
      displayOrder: 6,
    },
    {
      blockType: BlockType.CLIENT_LOGOS,
      name: 'Ügyfél Logók',
      description: 'Grid elrendezésű logó showcase',
      defaultContent: {
        version: '1.0',
        heading: 'Partnereink',
        logos: [
          { id: '1', url: '/logos/client-1.png', alt: 'Ügyfél 1' },
          { id: '2', url: '/logos/client-2.png', alt: 'Ügyfél 2' },
          { id: '3', url: '/logos/client-3.png', alt: 'Ügyfél 3' },
          { id: '4', url: '/logos/client-4.png', alt: 'Ügyfél 4' },
          { id: '5', url: '/logos/client-5.png', alt: 'Ügyfél 5' },
          { id: '6', url: '/logos/client-6.png', alt: 'Ügyfél 6' },
        ],
        columns: 3,
      },
      displayOrder: 7,
    },
    {
      blockType: BlockType.SERVICES_GRID,
      name: 'Szolgáltatások Grid',
      description: 'Kártyák elrendezésben szolgáltatások',
      defaultContent: {
        version: '1.0',
        heading: 'További szolgáltatásaink',
        services: [
          {
            id: '1',
            title: 'E-mail Marketing',
            description: 'Automatizált e-mail kampányok, szegmentálás, reportolás',
            icon: '/icons/email.svg',
            price: '450.000 Ft',
          },
          {
            id: '2',
            title: 'Landing Oldal',
            description: 'Konverzióra optimalizált landing oldalak tervezése és kivitelezése',
            icon: '/icons/landing.svg',
            price: '350.000 Ft',
          },
          {
            id: '3',
            title: 'Tartalomgyártás',
            description: 'Blogcikkek, hírlevél tartalmak, social media posztok',
            icon: '/icons/content.svg',
            price: '35.000 Ft/db',
          },
        ],
        columns: 3,
      },
      displayOrder: 8,
    },
    {
      blockType: BlockType.TEXT_BLOCK,
      name: 'Szöveges Blokk',
      description: 'Egyszerű szöveges tartalom',
      defaultContent: {
        version: '1.0',
        heading: 'Részletek',
        content: 'Itt helyezhetsz el bármilyen kiegészítő információt, részletes leírást vagy magyarázatot.',
      },
      displayOrder: 9,
    },
    {
      blockType: BlockType.TWO_COLUMN,
      name: 'Két Oszlop',
      description: 'Kép és szöveg kombinált layout',
      defaultContent: {
        version: '1.0',
        imageUrl: '/images/placeholder.jpg',
        imageSide: 'left',
        heading: 'Miért válassz minket?',
        content: 'Több mint 5 éves tapasztalat a digitális marketingben. Segítettünk már 100+ ügyfélnek növelni online jelenlétüket.',
        ctaText: 'Tudj meg többet',
        ctaUrl: '#contact',
      },
      displayOrder: 10,
    },
    {
      blockType: BlockType.CTA,
      name: 'Call-to-Action',
      description: 'Felhívás cselekvésre szekció',
      defaultContent: {
        version: '1.0',
        heading: 'Készen állsz az indulásra?',
        description: 'Kérj egyedi ajánlatot vagy egyeztess velünk egy ingyenes konzultáción.',
        primaryCta: {
          text: 'Ajánlat kérés',
          url: '#contact',
        },
        secondaryCta: {
          text: 'Konzultáció foglalás',
          url: '#meeting',
        },
        backgroundImage: '/images/cta-bg.jpg',
        backgroundColor: '#fa604a',
      },
      displayOrder: 11,
    },
    {
      blockType: BlockType.STATS,
      name: 'Statisztikák',
      description: 'Számok és eredmények megjelenítése',
      defaultContent: {
        version: '1.0',
        heading: 'Eredményeink számokban',
        stats: [
          {
            id: '1',
            value: '100+',
            label: 'Elégedett ügyfél',
          },
          {
            id: '2',
            value: '5+',
            label: 'Év tapasztalat',
          },
          {
            id: '3',
            value: '250%',
            label: 'Átlagos ROI',
          },
          {
            id: '4',
            value: '24/7',
            label: 'Támogatás',
          },
        ],
      },
      displayOrder: 12,
    },
  ]

  for (const template of blockTemplates) {
    await prisma.blockTemplate.upsert({
      where: {
        blockType_name_brand: {
          blockType: template.blockType,
          name: template.name,
          brand: template.brand,
        },
      },
      update: {
        description: template.description,
        defaultContent: template.defaultContent,
        displayOrder: template.displayOrder,
      },
      create: template,
    })
  }

  console.log('✅ Created block templates')

  // Create a sample proposal
  const sampleProposal = await prisma.proposal.create({
    data: {
      slug: 'pelda-ajanl at-2025',
      clientName: 'Példa Vállalkozás',
      brand: Brand.BOOM,
      status: 'PUBLISHED',
      createdById: admin.id,
      blocks: {
        create: [
          {
            blockType: BlockType.HERO,
            displayOrder: 0,
            content: blockTemplates[0].defaultContent,
            templateId: (await prisma.blockTemplate.findFirst({
              where: { blockType: BlockType.HERO },
            }))?.id,
          },
          {
            blockType: BlockType.PRICING_TABLE,
            displayOrder: 1,
            content: blockTemplates[3].defaultContent,
            templateId: (await prisma.blockTemplate.findFirst({
              where: { blockType: BlockType.PRICING_TABLE },
            }))?.id,
          },
        ],
      },
    },
  })

  console.log('✅ Created sample proposal')

  console.log('🎉 Database seeding completed!')
  console.log(`📧 Admin login: admin@boommarketing.hu / admin123`)
  console.log(`📧 Admin login: admin@aiboost.hu / admin123`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
