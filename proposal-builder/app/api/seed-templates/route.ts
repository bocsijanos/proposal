import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { BlockType, Brand } from '@prisma/client';

// BOOM Marketing sablonok
const boomTemplates = [
  {
    blockType: BlockType.TWO_COLUMN,
    name: 'Marketing Ökoszisztéma Magyarázat',
    description: 'Két oszlopos elrendezés a marketing rendszer előnyeinek bemutatására',
    brand: Brand.BOOM,
    defaultContent: {
      heading: 'Miért legyen egy kézben a marketing rendszered?',
      leftColumn: {
        title: 'Miért legyen egy kézben a marketing rendszered?',
        items: [
          'Dinamikus kapcsolattartás',
          'Automatizált értékesítés',
          'Folyamatos bevétel',
          'Tökéletes ügyfélélmény',
          'Teljes körű marketing kontroll egy helyen'
        ]
      },
      rightColumn: {
        title: 'Marketinges eszköztára',
        items: [
          'Egy jó marketinges olyan, mint egy profi szakács',
          'Ahhoz, hogy gyorsan, magabiztosan tudjon dolgozni, a megfelelő felszerelésre van szüksége',
          'Csak akkor tudja kihozni magából a maximumot, ha rendelkezésre állnak a megfelelő eszközök',
          'Ezért is fontos, hogy egy kézben legyen minden'
        ]
      }
    },
    displayOrder: 100,
    isActive: true
  },
  {
    blockType: BlockType.PLATFORM_FEATURES,
    name: 'AI Marketing Platform Funkciók',
    description: 'Az AI-alapú marketing platform kulcsfontosságú funkciói',
    brand: Brand.BOOM,
    defaultContent: {
      heading: 'Mit kapsz az AI Marketing Platformmal?',
      features: [
        'Kampányok kezelése egy helyen',
        'AI-alapú tartalom generálás',
        'Automatikus optimalizálás',
        'Részletes analytics és riportok',
        'CRM integráció'
      ]
    },
    displayOrder: 101,
    isActive: true
  },
  {
    blockType: BlockType.TWO_COLUMN,
    name: 'Platformhoz Csatolt Szolgáltatások',
    description: 'Platformhoz kapcsolódó extra szolgáltatások',
    brand: Brand.BOOM,
    defaultContent: {
      heading: 'Platformhoz csatolt szolgáltatások',
      leftColumn: {
        title: 'Dedikált Marketing Szakértő',
        items: [
          'Személyes tanácsadás',
          'Stratégiai tervezés',
          'Kampány optimalizálás',
          'Folyamatos support'
        ]
      },
      rightColumn: {
        title: 'Kreatív Csapat',
        items: [
          'Professzionális design',
          'Reklámanyag készítés',
          'Brandépítés',
          'Tartalomgyártás'
        ]
      }
    },
    displayOrder: 102,
    isActive: true
  },
  {
    blockType: BlockType.PLATFORM_FEATURES,
    name: 'Szolgáltatás Előnyök',
    description: 'A szolgáltatás kiemelt előnyei',
    brand: Brand.BOOM,
    defaultContent: {
      heading: 'Miért válassz minket?',
      features: [
        'Gyors eredmények - Már az első hónapban látható változások',
        'Átlátható árazás - Nincs rejtett költség',
        'Szakértő csapat - 10+ év tapasztalat',
        'Modern technológia - Legújabb AI eszközök',
        'Folyamatos fejlesztés - Havonta új funkciók'
      ]
    },
    displayOrder: 103,
    isActive: true
  },
  {
    blockType: BlockType.TWO_COLUMN,
    name: 'Platform vs Hagyományos Módszer',
    description: 'Összehasonlítás a platform és hagyományos marketing között',
    brand: Brand.BOOM,
    defaultContent: {
      heading: 'Platform vs Hagyományos Marketing',
      leftColumn: {
        title: 'AI Marketing Platform',
        items: [
          'Automatizált kampánykezelés',
          'Real-time optimalizálás',
          'Központi irányítás',
          'Költséghatékony',
          'Skálázható megoldás'
        ]
      },
      rightColumn: {
        title: 'Hagyományos Módszer',
        items: [
          'Manuális folyamatok',
          'Lassú reakcióidő',
          'Több platform külön kezelése',
          'Magas költségek',
          'Nehezen skálázható'
        ]
      }
    },
    displayOrder: 104,
    isActive: true
  },
  {
    blockType: BlockType.PLATFORM_FEATURES,
    name: 'Sikertörténetek Számokban',
    description: 'Ügyfeleink eredményei számokban',
    brand: Brand.BOOM,
    defaultContent: {
      heading: 'Ügyfeleink eredményei',
      features: [
        '300% átlagos ROI növekedés az első 6 hónapban',
        '50+ elégedett ügyfél országszerte',
        '2M+ generált bevétel ügyfeleinknek',
        '95% ügyfél-megtartási arány',
        '24/7 platform elérhetőség'
      ]
    },
    displayOrder: 105,
    isActive: true
  },
  {
    blockType: BlockType.TWO_COLUMN,
    name: 'Kezdés Lépései',
    description: 'Hogyan kezdd el a platformot használni',
    brand: Brand.BOOM,
    defaultContent: {
      heading: 'Így kezdhetsz',
      leftColumn: {
        title: '1-2. hét',
        items: [
          'Onboarding és platform beállítás',
          'Első kampányok elindítása',
          'Csapatod betanítása',
          'Kezdeti stratégia kialakítása'
        ]
      },
      rightColumn: {
        title: '3-4. hét',
        items: [
          'Kampányok optimalizálása',
          'Első eredmények kiértékelése',
          'Automatizálások beállítása',
          'Skálázási terv készítése'
        ]
      }
    },
    displayOrder: 106,
    isActive: true
  },
  {
    blockType: BlockType.PLATFORM_FEATURES,
    name: 'Technológiai Stack',
    description: 'Milyen technológiákat használunk',
    brand: Brand.BOOM,
    defaultContent: {
      heading: 'Technológiánk',
      features: [
        'ChatGPT-4 integrált AI',
        'Real-time analytics dashboard',
        'Multi-channel kampánykezelés',
        'Automatikus A/B tesztelés',
        'Enterprise-level biztonság'
      ]
    },
    displayOrder: 107,
    isActive: true
  },
  {
    blockType: BlockType.TWO_COLUMN,
    name: 'Support és Képzés',
    description: 'Támogatási lehetőségek',
    brand: Brand.BOOM,
    defaultContent: {
      heading: 'Folyamatos támogatás',
      leftColumn: {
        title: 'Technikai Support',
        items: [
          '24/7 email support',
          'Hétköznap 9-17 élő chat',
          'Videó tutoriálok',
          'Részletes dokumentáció'
        ]
      },
      rightColumn: {
        title: 'Marketing Támogatás',
        items: [
          'Havi stratégiai konzultáció',
          'Kampány review meetingek',
          'Best practice workshopok',
          'Egyedi képzési programok'
        ]
      }
    },
    displayOrder: 108,
    isActive: true
  },
  {
    blockType: BlockType.PLATFORM_FEATURES,
    name: 'Integrációk',
    description: 'Kompatibilis platformok és eszközök',
    brand: Brand.BOOM,
    defaultContent: {
      heading: 'Integrációink',
      features: [
        'Google Ads & Analytics',
        'Meta (Facebook & Instagram)',
        'LinkedIn Ads',
        'Email marketing platformok (Mailchimp, ActiveCampaign)',
        'CRM rendszerek (HubSpot, Salesforce)'
      ]
    },
    displayOrder: 109,
    isActive: true
  },
  {
    blockType: BlockType.TWO_COLUMN,
    name: 'Árazási Modellek',
    description: 'Rugalmas árazási lehetőségek',
    brand: Brand.BOOM,
    defaultContent: {
      heading: 'Válassz csomagot',
      leftColumn: {
        title: 'Starter Csomag',
        items: [
          'Alapvető platform funkciók',
          '1 dedikált szakértő',
          'Havi konzultáció',
          'Email support',
          'Kezdőknek ajánlott'
        ]
      },
      rightColumn: {
        title: 'Enterprise Csomag',
        items: [
          'Teljes platform hozzáférés',
          'Dedikált csapat',
          'Heti konzultációk',
          'Prioritás support',
          'Növekvő cégeknek'
        ]
      }
    },
    displayOrder: 110,
    isActive: true
  },
  {
    blockType: BlockType.PLATFORM_FEATURES,
    name: 'Biztonsági Funkciók',
    description: 'Vállalati szintű biztonság',
    brand: Brand.BOOM,
    defaultContent: {
      heading: 'Biztonságban vannak az adataid',
      features: [
        'GDPR kompatibilis adatkezelés',
        'Titkosított adattárolás',
        'Két-faktoros hitelesítés',
        'Rendszeres biztonsági auditok',
        'Automatikus biztonsági mentések'
      ]
    },
    displayOrder: 111,
    isActive: true
  },
  {
    blockType: BlockType.TWO_COLUMN,
    name: 'Reporting és Analytics',
    description: 'Részletes jelentések és elemzések',
    brand: Brand.BOOM,
    defaultContent: {
      heading: 'Adatvezérelt döntések',
      leftColumn: {
        title: 'Real-time Dashboardok',
        items: [
          'Kampány teljesítmény',
          'ROI tracking',
          'Audience insights',
          'Conversion funnel',
          'Custom reportok'
        ]
      },
      rightColumn: {
        title: 'Prediktív Analitika',
        items: [
          'AI-alapú előrejelzések',
          'Trend felismerés',
          'Automatikus anomália detektálás',
          'Optimalizálási javaslatok',
          'Budget ajánlások'
        ]
      }
    },
    displayOrder: 112,
    isActive: true
  },
  {
    blockType: BlockType.PLATFORM_FEATURES,
    name: 'Automációk',
    description: 'Marketing automation lehetőségek',
    brand: Brand.BOOM,
    defaultContent: {
      heading: 'Automatizáld a marketinged',
      features: [
        'Email kampány automatizálás',
        'Social media scheduling',
        'Lead scoring és nurturing',
        'Automatikus újracélzás',
        'Workflow automatizálás'
      ]
    },
    displayOrder: 113,
    isActive: true
  },
  {
    blockType: BlockType.TWO_COLUMN,
    name: 'Sikeres Átállás Garanciák',
    description: 'Garanciák a sikeres átálláshoz',
    brand: Brand.BOOM,
    defaultContent: {
      heading: 'Garanciáink',
      leftColumn: {
        title: 'Pénzvisszafizetési Garancia',
        items: [
          '30 napos kipróbálási időszak',
          'Teljes visszafizetés ha nem vagy elégedett',
          'Nincs kötöttség',
          'Egyszerű lemondási folyamat'
        ]
      },
      rightColumn: {
        title: 'Eredmény Garancia',
        items: [
          'Minimum 2x ROI az első 6 hónapban',
          'Vagy ingyen folytatjuk a következő hónapot',
          'Dokumentált eredmények',
          'Transzparens riportolás'
        ]
      }
    },
    displayOrder: 114,
    isActive: true
  }
];

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if templates already exist
    const existingCount = await prisma.blockTemplate.count({
      where: {
        brand: Brand.BOOM,
        displayOrder: {
          gte: 100
        }
      }
    });

    if (existingCount > 0) {
      return NextResponse.json({
        message: `${existingCount} BOOM template(s) already exist. Skipping seed.`,
        skipped: true,
        existingCount
      });
    }

    // Create all BOOM templates
    const created = await prisma.blockTemplate.createMany({
      data: boomTemplates,
      skipDuplicates: true
    });

    return NextResponse.json({
      message: `Successfully created ${created.count} BOOM Marketing templates`,
      count: created.count,
      success: true
    });

  } catch (error) {
    console.error('Error seeding templates:', error);
    return NextResponse.json(
      { error: 'Failed to seed templates', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
