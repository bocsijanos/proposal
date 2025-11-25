import { HeroBlock } from '@/components/blocks/HeroBlock';
import { PricingBlock } from '@/components/blocks/PricingBlock';
import { ServicesBlock } from '@/components/blocks/ServicesBlock';
import { ValuePropBlock } from '@/components/blocks/ValuePropBlock';
import { GuaranteesBlock } from '@/components/blocks/GuaranteesBlock';
import { CTABlock } from '@/components/blocks/CTABlock';
import { ProcessTimelineBlock } from '@/components/blocks/ProcessTimelineBlock';
import { ClientLogosBlock } from '@/components/blocks/ClientLogosBlock';
import { TextBlock } from '@/components/blocks/TextBlock';
import { TwoColumnBlock } from '@/components/blocks/TwoColumnBlock';
import { PlatformFeaturesBlock } from '@/components/blocks/PlatformFeaturesBlock';
import { StatsBlock } from '@/components/blocks/StatsBlock';
import { BonusFeaturesBlock } from '@/components/blocks/BonusFeaturesBlock';
import { PartnerGridBlock } from '@/components/blocks/PartnerGridBlock';

interface BlockRendererProps {
  block: {
    id: string;
    blockType: string;
    content: any;
  };
  brand: 'BOOM' | 'AIBOOST';
  proposalData?: {
    clientName: string;
    createdByName?: string | null;
  };
}

export function BlockRenderer({ block, brand, proposalData }: BlockRendererProps) {
  const blockComponents: Record<string, any> = {
    HERO: HeroBlock,
    PRICING_TABLE: PricingBlock,
    SERVICES_GRID: ServicesBlock,
    VALUE_PROP: ValuePropBlock,
    GUARANTEES: GuaranteesBlock,
    CTA: CTABlock,
    PROCESS_TIMELINE: ProcessTimelineBlock,
    CLIENT_LOGOS: ClientLogosBlock,
    TEXT_BLOCK: TextBlock,
    TWO_COLUMN: TwoColumnBlock,
    PLATFORM_FEATURES: PlatformFeaturesBlock,
    STATS: StatsBlock,
    BONUS_FEATURES: BonusFeaturesBlock,
    PARTNER_GRID: PartnerGridBlock,
  };

  const Component = blockComponents[block.blockType];

  if (!Component) {
    return (
      <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <p className="text-gray-600">
          Block type "{block.blockType}" not implemented yet
        </p>
      </div>
    );
  }

  return <Component content={block.content} brand={brand} proposalData={proposalData} />;
}
