import { Data } from '@measured/puck';

// Puck Data típus a sablonokhoz
export interface PuckTemplate {
  id: string;
  name: string;
  description: string;
  category: 'hero' | 'features' | 'pricing' | 'timeline' | 'logos' | 'cta' | 'full-page';
  thumbnail?: string;
  data: Data;
}

// ============================================
// HERO SABLONOK
// ============================================

// Hero sablon - Klasszikus középre igazított
export const heroClassicTemplate: PuckTemplate = {
  id: 'hero-classic',
  name: 'Hero - Klasszikus',
  description: 'Középre igazított hero szekció címmel és gombbal',
  category: 'hero',
  data: {
    root: {},
    content: [
      {
        type: 'GradientSection',
        props: {
          id: 'hero-section-1',
          variant: 'hero',
          paddingY: '2xl',
          showGlow: true,
          textColor: 'auto',
        },
      },
    ],
    zones: {
      'hero-section-1:gradientContent': [
        {
          type: 'Heading',
          props: {
            id: 'hero-heading-1',
            text: 'Árajánlat {{clientName}} részére',
            level: 'h1',
          },
        },
        {
          type: 'Spacer',
          props: {
            id: 'hero-spacer-1',
            size: 'md',
            showLine: false,
          },
        },
        {
          type: 'BodyText',
          props: {
            id: 'hero-body-1',
            text: 'Készítette: {{createdByName}} | 2025',
            variant: 'lead',
            opacity: 'default',
          },
        },
        {
          type: 'Spacer',
          props: {
            id: 'hero-spacer-2',
            size: 'lg',
            showLine: false,
          },
        },
        {
          type: 'Button',
          props: {
            id: 'hero-button-1',
            label: 'Kezdjünk bele!',
            variant: 'primary',
            size: 'large',
            fullWidth: false,
            icon: '🚀',
            iconPosition: 'left',
            href: '#services',
            alignment: 'center',
          },
        },
      ],
    },
  },
};

// Hero sablon - Kétoszlopos képpel
export const heroWithImageTemplate: PuckTemplate = {
  id: 'hero-with-image',
  name: 'Hero - Képpel',
  description: 'Kétoszlopos hero szekció bal oldali szöveggel és jobb oldali képpel',
  category: 'hero',
  data: {
    root: {},
    content: [
      {
        type: 'GradientSection',
        props: {
          id: 'hero-img-section-1',
          variant: 'hero',
          paddingY: 'xl',
          showGlow: true,
          textColor: 'auto',
        },
      },
    ],
    zones: {
      'hero-img-section-1:gradientContent': [
        {
          type: 'Grid',
          props: {
            id: 'hero-grid-1',
            columns: 2,
            gap: 'lg',
            alignItems: 'center',
          },
        },
      ],
      'hero-grid-1:column-0': [
        {
          type: 'Badge',
          props: {
            id: 'hero-badge-1',
            text: 'Új ajánlat',
            variant: 'subtle',
            color: 'primary',
            size: 'md',
            icon: '✨',
            iconPosition: 'left',
            pill: true,
          },
        },
        {
          type: 'Spacer',
          props: {
            id: 'hero-spacer-img-1',
            size: 'sm',
            showLine: false,
          },
        },
        {
          type: 'Heading',
          props: {
            id: 'hero-heading-img-1',
            text: 'Együtt építjük a sikered',
            level: 'h1',
          },
        },
        {
          type: 'Spacer',
          props: {
            id: 'hero-spacer-img-2',
            size: 'md',
            showLine: false,
          },
        },
        {
          type: 'BodyText',
          props: {
            id: 'hero-body-img-1',
            text: 'Professzionális marketing megoldások {{clientName}} számára.',
            variant: 'lead',
            opacity: 'default',
          },
        },
        {
          type: 'Spacer',
          props: {
            id: 'hero-spacer-img-3',
            size: 'lg',
            showLine: false,
          },
        },
        {
          type: 'Button',
          props: {
            id: 'hero-button-img-1',
            label: 'Részletek',
            variant: 'primary',
            size: 'large',
            fullWidth: false,
            href: '#details',
            alignment: 'left',
          },
        },
      ],
      'hero-grid-1:column-1': [
        {
          type: 'Image',
          props: {
            id: 'hero-image-1',
            src: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800',
            alt: 'Marketing csapat',
            rounded: 'lg',
            aspectRatio: '4:3',
          },
        },
      ],
    },
  },
};

export const heroTemplates: PuckTemplate[] = [heroClassicTemplate, heroWithImageTemplate];

// ============================================
// FEATURES / SZOLGÁLTATÁSOK SABLONOK
// ============================================

// Szolgáltatások grid - IconBox komponensekkel
export const featuresGridTemplate: PuckTemplate = {
  id: 'features-grid',
  name: 'Szolgáltatások - Grid',
  description: '3 oszlopos grid szolgáltatás kártyákkal',
  category: 'features',
  data: {
    root: {},
    content: [
      {
        type: 'Section',
        props: {
          id: 'features-section-1',
          backgroundColor: 'default',
          paddingY: 'xl',
        },
      },
    ],
    zones: {
      'features-section-1:sectionContent': [
        {
          type: 'Heading',
          props: {
            id: 'features-heading-1',
            text: 'Szolgáltatásaink',
            level: 'h2',
            alignment: 'center',
          },
        },
        {
          type: 'Spacer',
          props: {
            id: 'features-spacer-1',
            size: 'md',
            showLine: false,
          },
        },
        {
          type: 'BodyText',
          props: {
            id: 'features-body-1',
            text: 'Átfogó marketing megoldások a sikeredért',
            variant: 'lead',
            alignment: 'center',
          },
        },
        {
          type: 'Spacer',
          props: {
            id: 'features-spacer-2',
            size: 'xl',
            showLine: false,
          },
        },
        {
          type: 'Grid',
          props: {
            id: 'features-grid-1',
            columns: 3,
            gap: 'lg',
            alignItems: 'stretch',
          },
        },
      ],
      'features-grid-1:column-0': [
        {
          type: 'IconBox',
          props: {
            id: 'iconbox-1',
            icon: '📱',
            title: 'Social Media',
            description: 'Professzionális közösségi média menedzsment és hirdetések.',
            variant: 'card',
            iconStyle: 'circle',
            alignment: 'center',
            showBorder: true,
          },
        },
      ],
      'features-grid-1:column-1': [
        {
          type: 'IconBox',
          props: {
            id: 'iconbox-2',
            icon: '🎯',
            title: 'Google Ads',
            description: 'Célzott hirdetési kampányok maximális megtérüléssel.',
            variant: 'card',
            iconStyle: 'circle',
            alignment: 'center',
            showBorder: true,
          },
        },
      ],
      'features-grid-1:column-2': [
        {
          type: 'IconBox',
          props: {
            id: 'iconbox-3',
            icon: '📊',
            title: 'Analitika',
            description: 'Részletes riportok és adatvezérelt döntéstámogatás.',
            variant: 'card',
            iconStyle: 'circle',
            alignment: 'center',
            showBorder: true,
          },
        },
      ],
    },
  },
};

// Garancia szekció - 2-3-4 rendszer
export const guaranteeTemplate: PuckTemplate = {
  id: 'guarantee-234',
  name: 'Garancia - 2-3-4 Rendszer',
  description: 'BOOM Marketing 2-3-4-es garancia rendszer',
  category: 'features',
  data: {
    root: {},
    content: [
      {
        type: 'Section',
        props: {
          id: 'guarantee-section-1',
          backgroundColor: 'alt',
          paddingY: 'xl',
        },
      },
    ],
    zones: {
      'guarantee-section-1:sectionContent': [
        {
          type: 'Heading',
          props: {
            id: 'guarantee-heading-1',
            text: 'Mire számíthatsz?',
            level: 'h2',
            alignment: 'center',
          },
        },
        {
          type: 'Spacer',
          props: {
            id: 'guarantee-spacer-1',
            size: 'md',
            showLine: false,
          },
        },
        {
          type: 'Badge',
          props: {
            id: 'guarantee-badge-1',
            text: '2-3-4-es garancia',
            variant: 'gradient',
            color: 'primary',
            size: 'lg',
            pill: true,
          },
        },
        {
          type: 'Spacer',
          props: {
            id: 'guarantee-spacer-2',
            size: 'xl',
            showLine: false,
          },
        },
        {
          type: 'Grid',
          props: {
            id: 'guarantee-grid-1',
            columns: 3,
            gap: 'lg',
            alignItems: 'stretch',
          },
        },
      ],
      'guarantee-grid-1:column-0': [
        {
          type: 'IconBox',
          props: {
            id: 'guarantee-iconbox-1',
            icon: '2️⃣',
            title: '2 hét felkészülés',
            description: 'Szerződéskötéstől számítva 2 héten belül elindítjuk a kampányaidat.',
            variant: 'card',
            iconStyle: 'emoji',
            alignment: 'center',
            showBorder: true,
          },
        },
      ],
      'guarantee-grid-1:column-1': [
        {
          type: 'IconBox',
          props: {
            id: 'guarantee-iconbox-2',
            icon: '3️⃣',
            title: '3 hónap eredmény',
            description: 'Ha 3 hónap után nem vagy elégedett, díjmentesen kiléphetsz.',
            variant: 'card',
            iconStyle: 'emoji',
            alignment: 'center',
            showBorder: true,
          },
        },
      ],
      'guarantee-grid-1:column-2': [
        {
          type: 'IconBox',
          props: {
            id: 'guarantee-iconbox-3',
            icon: '4️⃣',
            title: '4 munkanap reakcióidő',
            description: 'Minden megkeresésre garantáltan 4 munkanapon belül válaszolunk.',
            variant: 'card',
            iconStyle: 'emoji',
            alignment: 'center',
            showBorder: true,
          },
        },
      ],
    },
  },
};

export const featuresTemplates: PuckTemplate[] = [featuresGridTemplate, guaranteeTemplate];

// ============================================
// PRICING SABLONOK
// ============================================

// Árazás - 3 csomag
export const pricingThreeColumnTemplate: PuckTemplate = {
  id: 'pricing-3-col',
  name: 'Árazás - 3 Csomag',
  description: 'Háromoszlopos árazási tábla kedvezmény kalkulátorral',
  category: 'pricing',
  data: {
    root: {},
    content: [
      {
        type: 'Section',
        props: {
          id: 'pricing-section-1',
          backgroundColor: 'default',
          paddingY: 'xl',
        },
      },
    ],
    zones: {
      'pricing-section-1:sectionContent': [
        {
          type: 'Heading',
          props: {
            id: 'pricing-heading-1',
            text: 'Árazási csomagok',
            level: 'h2',
            alignment: 'center',
          },
        },
        {
          type: 'Spacer',
          props: {
            id: 'pricing-spacer-1',
            size: 'md',
            showLine: false,
          },
        },
        {
          type: 'BodyText',
          props: {
            id: 'pricing-body-1',
            text: 'Válaszd ki az igényeidnek megfelelő csomagot',
            variant: 'lead',
            alignment: 'center',
          },
        },
        {
          type: 'Spacer',
          props: {
            id: 'pricing-spacer-2',
            size: 'xl',
            showLine: false,
          },
        },
        {
          type: 'Grid',
          props: {
            id: 'pricing-grid-1',
            columns: 3,
            gap: 'lg',
            alignItems: 'stretch',
          },
        },
      ],
      'pricing-grid-1:column-0': [
        {
          type: 'PricingCard',
          props: {
            id: 'pricing-card-1',
            title: 'Starter',
            basePrice: 99000,
            currency: 'Ft',
            period: '/hó',
            description: 'Kisebb vállalkozásoknak',
            features: [
              'Havi 5 kampány',
              'Email támogatás',
              'Alapvető analitika',
            ],
            ctaText: 'Választom',
            ctaLink: '#contact',
            isHighlighted: false,
            highlightLabel: '',
            variant: 'bordered',
            showDiscountSelector: true,
            discountOptions: [0, 10, 15, 20],
            defaultDiscount: 0,
          },
        },
      ],
      'pricing-grid-1:column-1': [
        {
          type: 'PricingCard',
          props: {
            id: 'pricing-card-2',
            title: 'Professional',
            basePrice: 199000,
            currency: 'Ft',
            period: '/hó',
            description: 'Növekvő vállalkozásoknak',
            features: [
              'Korlátlan kampány',
              'Prioritás támogatás',
              'Haladó analitika',
              'Dedikált kapcsolattartó',
            ],
            ctaText: 'Választom',
            ctaLink: '#contact',
            isHighlighted: true,
            highlightLabel: 'Népszerű',
            variant: 'bordered',
            showDiscountSelector: true,
            discountOptions: [0, 10, 15, 20],
            defaultDiscount: 0,
          },
        },
      ],
      'pricing-grid-1:column-2': [
        {
          type: 'PricingCard',
          props: {
            id: 'pricing-card-3',
            title: 'Enterprise',
            basePrice: 399000,
            currency: 'Ft',
            period: '/hó',
            description: 'Nagyvállalatok számára',
            features: [
              'Minden Professional funkció',
              '24/7 támogatás',
              'Egyedi integrációk',
              'SLA garancia',
              'Személyre szabott riportok',
            ],
            ctaText: 'Ajánlat kérés',
            ctaLink: '#contact',
            isHighlighted: false,
            highlightLabel: '',
            variant: 'bordered',
            showDiscountSelector: true,
            discountOptions: [0, 10, 15, 20],
            defaultDiscount: 0,
          },
        },
      ],
    },
  },
};

export const pricingTemplates: PuckTemplate[] = [pricingThreeColumnTemplate];

// ============================================
// TIMELINE SABLONOK
// ============================================

// Timeline - Együttműködési folyamat
export const timelineProcessTemplate: PuckTemplate = {
  id: 'timeline-process',
  name: 'Folyamat - Timeline',
  description: 'Lépésről lépésre bemutatott együttműködési folyamat',
  category: 'timeline',
  data: {
    root: {},
    content: [
      {
        type: 'Section',
        props: {
          id: 'timeline-section-1',
          backgroundColor: 'alt',
          paddingY: 'xl',
        },
      },
    ],
    zones: {
      'timeline-section-1:sectionContent': [
        {
          type: 'Heading',
          props: {
            id: 'timeline-heading-1',
            text: 'Hogyan működik az együttműködés?',
            level: 'h2',
            alignment: 'center',
          },
        },
        {
          type: 'Spacer',
          props: {
            id: 'timeline-spacer-1',
            size: 'xl',
            showLine: false,
          },
        },
        {
          type: 'Grid',
          props: {
            id: 'timeline-grid-1',
            columns: 1,
            gap: 'sm',
            alignItems: 'stretch',
          },
        },
      ],
      'timeline-grid-1:column-0': [
        {
          type: 'TimelineStep',
          props: {
            id: 'timeline-step-1',
            stepNumber: 1,
            title: 'Konzultáció',
            description: 'Ingyenes konzultáción megbeszéljük a céljaidat és igényeidet.',
            icon: '📞',
            duration: '1 óra',
            variant: 'numbered',
            alignment: 'left',
            isLast: false,
            isCompleted: false,
          },
        },
        {
          type: 'TimelineStep',
          props: {
            id: 'timeline-step-2',
            stepNumber: 2,
            title: 'Stratégia',
            description: 'Kidolgozzuk a személyre szabott marketing stratégiát.',
            icon: '📋',
            duration: '1 hét',
            variant: 'numbered',
            alignment: 'left',
            isLast: false,
            isCompleted: false,
          },
        },
        {
          type: 'TimelineStep',
          props: {
            id: 'timeline-step-3',
            stepNumber: 3,
            title: 'Implementáció',
            description: 'Elindítjuk a kampányokat és beállítjuk a rendszereket.',
            icon: '🚀',
            duration: '2 hét',
            variant: 'numbered',
            alignment: 'left',
            isLast: false,
            isCompleted: false,
          },
        },
        {
          type: 'TimelineStep',
          props: {
            id: 'timeline-step-4',
            stepNumber: 4,
            title: 'Optimalizálás',
            description: 'Folyamatosan elemezzük az eredményeket és finomhangoljuk a stratégiát.',
            icon: '📊',
            duration: 'Folyamatos',
            variant: 'numbered',
            alignment: 'left',
            isLast: true,
            isCompleted: false,
          },
        },
      ],
    },
  },
};

export const timelineTemplates: PuckTemplate[] = [timelineProcessTemplate];

// ============================================
// LOGO / PARTNER SABLONOK
// ============================================

// Partnerek grid
export const logosGridTemplate: PuckTemplate = {
  id: 'logos-grid',
  name: 'Partnerek - Grid',
  description: 'Partner és referencia logók megjelenítése',
  category: 'logos',
  data: {
    root: {},
    content: [
      {
        type: 'Section',
        props: {
          id: 'logos-section-1',
          backgroundColor: 'default',
          paddingY: 'lg',
        },
      },
    ],
    zones: {
      'logos-section-1:sectionContent': [
        {
          type: 'Heading',
          props: {
            id: 'logos-heading-1',
            text: 'Partnereink',
            level: 'h3',
            alignment: 'center',
          },
        },
        {
          type: 'Spacer',
          props: {
            id: 'logos-spacer-1',
            size: 'lg',
            showLine: false,
          },
        },
        {
          type: 'Grid',
          props: {
            id: 'logos-grid-1',
            columns: 4,
            gap: 'lg',
            alignItems: 'center',
          },
        },
      ],
      'logos-grid-1:column-0': [
        {
          type: 'LogoItem',
          props: {
            id: 'logo-1',
            imageUrl: 'https://via.placeholder.com/150x60?text=Partner+1',
            altText: 'Partner 1',
            companyName: 'Partner 1',
            variant: 'grayscale',
            size: 'md',
            showName: false,
          },
        },
      ],
      'logos-grid-1:column-1': [
        {
          type: 'LogoItem',
          props: {
            id: 'logo-2',
            imageUrl: 'https://via.placeholder.com/150x60?text=Partner+2',
            altText: 'Partner 2',
            companyName: 'Partner 2',
            variant: 'grayscale',
            size: 'md',
            showName: false,
          },
        },
      ],
      'logos-grid-1:column-2': [
        {
          type: 'LogoItem',
          props: {
            id: 'logo-3',
            imageUrl: 'https://via.placeholder.com/150x60?text=Partner+3',
            altText: 'Partner 3',
            companyName: 'Partner 3',
            variant: 'grayscale',
            size: 'md',
            showName: false,
          },
        },
      ],
      'logos-grid-1:column-3': [
        {
          type: 'LogoItem',
          props: {
            id: 'logo-4',
            imageUrl: 'https://via.placeholder.com/150x60?text=Partner+4',
            altText: 'Partner 4',
            companyName: 'Partner 4',
            variant: 'grayscale',
            size: 'md',
            showName: false,
          },
        },
      ],
    },
  },
};

export const logosTemplates: PuckTemplate[] = [logosGridTemplate];

// ============================================
// CTA SABLONOK
// ============================================

// CTA - Gradient háttérrel
export const ctaGradientTemplate: PuckTemplate = {
  id: 'cta-gradient',
  name: 'CTA - Gradient',
  description: 'Látványos CTA szekció gradient háttérrel',
  category: 'cta',
  data: {
    root: {},
    content: [
      {
        type: 'GradientSection',
        props: {
          id: 'cta-section-1',
          variant: 'cta',
          paddingY: 'xl',
          showGlow: true,
          textColor: 'auto',
        },
      },
    ],
    zones: {
      'cta-section-1:gradientContent': [
        {
          type: 'Heading',
          props: {
            id: 'cta-heading-1',
            text: 'Készen állsz az indulásra?',
            level: 'h2',
            alignment: 'center',
          },
        },
        {
          type: 'Spacer',
          props: {
            id: 'cta-spacer-1',
            size: 'md',
            showLine: false,
          },
        },
        {
          type: 'BodyText',
          props: {
            id: 'cta-body-1',
            text: 'Kérj egyedi ajánlatot vagy egyeztess velünk egy ingyenes konzultáción.',
            variant: 'lead',
            alignment: 'center',
          },
        },
        {
          type: 'Spacer',
          props: {
            id: 'cta-spacer-2',
            size: 'lg',
            showLine: false,
          },
        },
        {
          type: 'Grid',
          props: {
            id: 'cta-grid-1',
            columns: 2,
            gap: 'md',
            alignItems: 'center',
          },
        },
      ],
      'cta-grid-1:column-0': [
        {
          type: 'Button',
          props: {
            id: 'cta-button-1',
            label: 'Ajánlat kérés',
            variant: 'primary',
            size: 'large',
            fullWidth: true,
            icon: '🚀',
            iconPosition: 'left',
            href: '#contact',
            alignment: 'center',
          },
        },
      ],
      'cta-grid-1:column-1': [
        {
          type: 'Button',
          props: {
            id: 'cta-button-2',
            label: 'Konzultáció',
            variant: 'outline',
            size: 'large',
            fullWidth: true,
            icon: '📞',
            iconPosition: 'left',
            href: '#meeting',
            alignment: 'center',
          },
        },
      ],
    },
  },
};

// CTA - Egyszerű
export const ctaSimpleTemplate: PuckTemplate = {
  id: 'cta-simple',
  name: 'CTA - Egyszerű',
  description: 'Egyszerű CTA szekció egy gombbal',
  category: 'cta',
  data: {
    root: {},
    content: [
      {
        type: 'Section',
        props: {
          id: 'cta-simple-section-1',
          backgroundColor: 'alt',
          paddingY: 'xl',
        },
      },
    ],
    zones: {
      'cta-simple-section-1:sectionContent': [
        {
          type: 'Heading',
          props: {
            id: 'cta-simple-heading-1',
            text: 'Van kérdésed?',
            level: 'h2',
            alignment: 'center',
          },
        },
        {
          type: 'Spacer',
          props: {
            id: 'cta-simple-spacer-1',
            size: 'md',
            showLine: false,
          },
        },
        {
          type: 'BodyText',
          props: {
            id: 'cta-simple-body-1',
            text: 'Keress minket bátran, szívesen segítünk!',
            variant: 'lead',
            alignment: 'center',
          },
        },
        {
          type: 'Spacer',
          props: {
            id: 'cta-simple-spacer-2',
            size: 'lg',
            showLine: false,
          },
        },
        {
          type: 'Button',
          props: {
            id: 'cta-simple-button-1',
            label: 'Kapcsolatfelvétel',
            variant: 'primary',
            size: 'large',
            fullWidth: false,
            icon: '📧',
            iconPosition: 'left',
            href: '#contact',
            alignment: 'center',
          },
        },
      ],
    },
  },
};

export const ctaTemplates: PuckTemplate[] = [ctaGradientTemplate, ctaSimpleTemplate];

// ============================================
// FULL PAGE SABLONOK
// ============================================

// Teljes ajánlat sablon
export const fullProposalTemplate: PuckTemplate = {
  id: 'full-proposal',
  name: 'Teljes Ajánlat',
  description: 'Komplett ajánlati oldal minden szekcióval',
  category: 'full-page',
  data: {
    root: {},
    content: [
      // Hero
      ...heroClassicTemplate.data.content,
      // Features
      {
        type: 'Section',
        props: {
          id: 'full-features-section',
          backgroundColor: 'default',
          paddingY: 'xl',
        },
      },
      // Pricing
      {
        type: 'Section',
        props: {
          id: 'full-pricing-section',
          backgroundColor: 'alt',
          paddingY: 'xl',
        },
      },
      // CTA
      ...ctaGradientTemplate.data.content,
    ],
    zones: {
      ...heroClassicTemplate.data.zones,
      'full-features-section:sectionContent': [
        {
          type: 'Heading',
          props: {
            id: 'full-feat-heading',
            text: 'Szolgáltatásaink',
            level: 'h2',
            alignment: 'center',
          },
        },
        {
          type: 'Spacer',
          props: {
            id: 'full-feat-spacer',
            size: 'xl',
            showLine: false,
          },
        },
        {
          type: 'Grid',
          props: {
            id: 'full-feat-grid',
            columns: 3,
            gap: 'lg',
            alignItems: 'stretch',
          },
        },
      ],
      'full-feat-grid:column-0': [
        {
          type: 'IconBox',
          props: {
            id: 'full-iconbox-1',
            icon: '📱',
            title: 'Social Media',
            description: 'Professzionális közösségi média menedzsment.',
            variant: 'card',
            iconStyle: 'circle',
            alignment: 'center',
            showBorder: true,
          },
        },
      ],
      'full-feat-grid:column-1': [
        {
          type: 'IconBox',
          props: {
            id: 'full-iconbox-2',
            icon: '🎯',
            title: 'Google Ads',
            description: 'Célzott hirdetési kampányok.',
            variant: 'card',
            iconStyle: 'circle',
            alignment: 'center',
            showBorder: true,
          },
        },
      ],
      'full-feat-grid:column-2': [
        {
          type: 'IconBox',
          props: {
            id: 'full-iconbox-3',
            icon: '📊',
            title: 'Analitika',
            description: 'Részletes riportok és elemzések.',
            variant: 'card',
            iconStyle: 'circle',
            alignment: 'center',
            showBorder: true,
          },
        },
      ],
      'full-pricing-section:sectionContent': [
        {
          type: 'Heading',
          props: {
            id: 'full-pricing-heading',
            text: 'Csomagok',
            level: 'h2',
            alignment: 'center',
          },
        },
        {
          type: 'Spacer',
          props: {
            id: 'full-pricing-spacer',
            size: 'xl',
            showLine: false,
          },
        },
        {
          type: 'Grid',
          props: {
            id: 'full-pricing-grid',
            columns: 3,
            gap: 'lg',
            alignItems: 'stretch',
          },
        },
      ],
      'full-pricing-grid:column-0': [
        {
          type: 'PricingCard',
          props: {
            id: 'full-price-1',
            title: 'Starter',
            basePrice: 99000,
            currency: 'Ft',
            period: '/hó',
            description: 'Kisebb vállalkozásoknak',
            features: ['Havi 5 kampány', 'Email támogatás'],
            ctaText: 'Választom',
            isHighlighted: false,
            variant: 'bordered',
            showDiscountSelector: true,
            discountOptions: [0, 10, 15, 20],
            defaultDiscount: 0,
          },
        },
      ],
      'full-pricing-grid:column-1': [
        {
          type: 'PricingCard',
          props: {
            id: 'full-price-2',
            title: 'Professional',
            basePrice: 199000,
            currency: 'Ft',
            period: '/hó',
            description: 'Növekvő cégeknek',
            features: ['Korlátlan kampány', 'Prioritás támogatás', 'Dedikált kapcsolattartó'],
            ctaText: 'Választom',
            isHighlighted: true,
            highlightLabel: 'Ajánlott',
            variant: 'bordered',
            showDiscountSelector: true,
            discountOptions: [0, 10, 15, 20],
            defaultDiscount: 0,
          },
        },
      ],
      'full-pricing-grid:column-2': [
        {
          type: 'PricingCard',
          props: {
            id: 'full-price-3',
            title: 'Enterprise',
            basePrice: 399000,
            currency: 'Ft',
            period: '/hó',
            description: 'Nagyvállalatok',
            features: ['Minden Professional funkció', '24/7 támogatás', 'SLA garancia'],
            ctaText: 'Ajánlat kérés',
            isHighlighted: false,
            variant: 'bordered',
            showDiscountSelector: true,
            discountOptions: [0, 10, 15, 20],
            defaultDiscount: 0,
          },
        },
      ],
      ...ctaGradientTemplate.data.zones,
    },
  },
};

export const fullPageTemplates: PuckTemplate[] = [fullProposalTemplate];

// ============================================
// ÖSSZES SABLON EXPORTÁLÁSA
// ============================================

export const allTemplates: PuckTemplate[] = [
  ...heroTemplates,
  ...featuresTemplates,
  ...pricingTemplates,
  ...timelineTemplates,
  ...logosTemplates,
  ...ctaTemplates,
  ...fullPageTemplates,
];

// Sablon keresés ID alapján
export function getTemplateById(id: string): PuckTemplate | undefined {
  return allTemplates.find((t) => t.id === id);
}

// Sablonok kategória alapján
export function getTemplatesByCategory(category: PuckTemplate['category']): PuckTemplate[] {
  return allTemplates.filter((t) => t.category === category);
}
