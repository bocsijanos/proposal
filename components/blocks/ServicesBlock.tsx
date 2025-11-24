import { ServiceCard, ServiceCardVariant } from '@/components/ui/service-card';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { PlatformType } from '@/components/ui/platform-icons';

interface Service {
  id: string;
  title: string;
  description: string;
  icon?: string;
  iconType?: PlatformType;
  price?: string;
  variant?: ServiceCardVariant;
  subtitle?: string;
  benefits?: string[];
  featured?: boolean;
  platformGradient?: 'meta' | 'google' | 'tiktok';
}

interface ServicesBlockProps {
  content: {
    heading: string;
    subheading?: string;
    services: Service[];
    columns?: 2 | 3 | 4;
    layout?: 'grid' | 'masonry';
  };
  brand: 'BOOM' | 'AIBOOST';
}

export function ServicesBlock({ content, brand }: ServicesBlockProps) {
  const { heading, subheading, services, columns = 3, layout = 'grid' } = content;

  // Védelem - ha nincs services array, ne rendereljünk semmit
  if (!services || !Array.isArray(services) || services.length === 0) {
    return null;
  }

  const gridClasses = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4',
  };

  return (
    <section className="w-full py-12 md:py-16 lg:py-20">
      {/* Section Header */}
      <div className="text-center mb-12 md:mb-16 lg:mb-20">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--color-text)] leading-tight mb-6">
          {heading}
        </h2>
        {subheading && (
          <div className="flex justify-center">
            <p className="text-lg md:text-xl text-[var(--color-muted)] max-w-3xl leading-relaxed text-center">
              {subheading}
            </p>
          </div>
        )}
      </div>

      {/* Services Grid */}
      <div className={`grid gap-6 md:gap-8 lg:gap-10 ${gridClasses[columns]}`}>
        {services.map((service, index) => (
          <ScrollReveal key={service.id} delay={Math.min(index * 100, 300)}>
            <ServiceCard
              variant={service.variant || 'service'}
              icon={service.iconType || 'email'}
              title={service.title}
              subtitle={service.subtitle}
              description={service.description}
              benefits={service.benefits}
              featured={service.featured}
              platformGradient={service.platformGradient}
            />
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
