'use client';

import { Config } from '@measured/puck';
import {
  // Typography
  HeadingConfig,
  BodyTextConfig,
  HighlightConfig,
  // Interactive
  ButtonConfig,
  InputConfig,
  // Layout
  SectionConfig,
  CardConfig,
  GridConfig,
  GradientSectionConfig,
  // Content
  SpacerConfig,
  DividerConfig,
  ImageConfig,
  AvatarImageConfig,
  ListConfig,
  StatsConfig,
  // Modular building blocks
  IconBoxConfig,
  PricingCardConfig,
  BadgeConfig,
  LogoItemConfig,
  TimelineStepConfig,
  LogoCarouselConfig,
} from './components';

// Define component types for Puck
export type PuckComponentTypes = {
  Heading: typeof HeadingConfig;
  BodyText: typeof BodyTextConfig;
  Highlight: typeof HighlightConfig;
  Button: typeof ButtonConfig;
  Input: typeof InputConfig;
  Section: typeof SectionConfig;
  Card: typeof CardConfig;
  Grid: typeof GridConfig;
  GradientSection: typeof GradientSectionConfig;
  Spacer: typeof SpacerConfig;
  Divider: typeof DividerConfig;
  Image: typeof ImageConfig;
  AvatarImage: typeof AvatarImageConfig;
  List: typeof ListConfig;
  Stats: typeof StatsConfig;
  // Modular building blocks
  IconBox: typeof IconBoxConfig;
  PricingCard: typeof PricingCardConfig;
  Badge: typeof BadgeConfig;
  LogoItem: typeof LogoItemConfig;
  TimelineStep: typeof TimelineStepConfig;
  LogoCarousel: typeof LogoCarouselConfig;
};

// Main Puck configuration with organized categories
export const puckConfig: Config = {
  categories: {
    blocks: {
      title: 'Építőelemek',
      components: ['IconBox', 'PricingCard', 'Badge', 'LogoItem', 'TimelineStep', 'LogoCarousel'],
      defaultExpanded: true,
    },
    typography: {
      title: 'Tipográfia',
      components: ['Heading', 'BodyText', 'Highlight'],
    },
    interactive: {
      title: 'Interaktív',
      components: ['Button', 'Input'],
    },
    layout: {
      title: 'Elrendezés',
      components: ['Section', 'Card', 'Grid', 'GradientSection'],
    },
    content: {
      title: 'Tartalom',
      components: ['Image', 'AvatarImage', 'List', 'Stats', 'Spacer', 'Divider'],
    },
  },

  components: {
    // Modular building blocks
    IconBox: IconBoxConfig,
    PricingCard: PricingCardConfig,
    Badge: BadgeConfig,
    LogoItem: LogoItemConfig,
    TimelineStep: TimelineStepConfig,
    LogoCarousel: LogoCarouselConfig,
    // Typography
    Heading: HeadingConfig,
    BodyText: BodyTextConfig,
    Highlight: HighlightConfig,
    // Interactive
    Button: ButtonConfig,
    Input: InputConfig,
    // Layout
    Section: SectionConfig,
    Card: CardConfig,
    Grid: GridConfig,
    GradientSection: GradientSectionConfig,
    // Content
    Spacer: SpacerConfig,
    Divider: DividerConfig,
    Image: ImageConfig,
    AvatarImage: AvatarImageConfig,
    List: ListConfig,
    Stats: StatsConfig,
  },

  root: {
    fields: {
      templateName: {
        type: 'text',
        label: 'Sablon neve',
      },
      templateDescription: {
        type: 'textarea',
        label: 'Sablon leírása',
      },
      templateCategory: {
        type: 'select',
        label: 'Kategória',
        options: [
          { value: 'HERO', label: '🎯 Hero' },
          { value: 'VALUE_PROP', label: '💎 Értékajánlat' },
          { value: 'PRICING_TABLE', label: '💰 Árazás' },
          { value: 'CTA', label: '🚀 CTA' },
          { value: 'SERVICES_GRID', label: '🔧 Szolgáltatások' },
          { value: 'GUARANTEES', label: '✅ Garanciák' },
          { value: 'TESTIMONIALS', label: '💬 Vélemények' },
          { value: 'PROCESS', label: '📋 Folyamat' },
          { value: 'FAQ', label: '❓ GYIK' },
          { value: 'COVER', label: '📄 Borító' },
          { value: 'FOOTER', label: '📍 Lábléc' },
          { value: 'TWO_COLUMN', label: '📐 Két oszlop' },
          { value: 'PLATFORM_FEATURES', label: '⚡ Platform' },
          { value: 'CLIENT_LOGOS', label: '🏢 Logók' },
          { value: 'STATS', label: '📊 Statisztikák' },
          { value: 'OTHER', label: '🎨 Egyéb' },
        ],
      },
    },
    defaultProps: {
      templateName: '',
      templateDescription: '',
      templateCategory: 'OTHER',
    },
    render: ({ children }: { children: React.ReactNode }) => {
      return (
        <div
          style={{
            minHeight: '100%',
            padding: '1rem',
          }}
        >
          {children}
        </div>
      );
    },
  },
};

// Export component configs for external use
export const componentConfigs = {
  // Modular building blocks
  IconBox: IconBoxConfig,
  PricingCard: PricingCardConfig,
  Badge: BadgeConfig,
  LogoItem: LogoItemConfig,
  TimelineStep: TimelineStepConfig,
  LogoCarousel: LogoCarouselConfig,
  // Typography
  Heading: HeadingConfig,
  BodyText: BodyTextConfig,
  Highlight: HighlightConfig,
  // Interactive
  Button: ButtonConfig,
  Input: InputConfig,
  // Layout
  Section: SectionConfig,
  Card: CardConfig,
  Grid: GridConfig,
  GradientSection: GradientSectionConfig,
  // Content
  Spacer: SpacerConfig,
  Divider: DividerConfig,
  Image: ImageConfig,
  AvatarImage: AvatarImageConfig,
  List: ListConfig,
  Stats: StatsConfig,
};
