interface BonusFeature {
  id: string;
  title: string;
  description: string;
  originalPrice: number;
  icon: string;
}

interface BonusFeaturesBlockProps {
  content: {
    version?: string;
    heading: string;
    subheading?: string;
    features: BonusFeature[];
    footer?: {
      title: string;
      description: string;
    };
    columns?: 2 | 3 | 4;
  };
  brand: 'BOOM' | 'AIBOOST';
}

export function BonusFeaturesBlock({ content, brand }: BonusFeaturesBlockProps) {
  const { heading, subheading, features, footer, columns = 4 } = content;

  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }[columns] || 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('hu-HU', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="py-12 md:py-16 lg:py-20">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h2
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--color-text)] leading-tight"
          style={{
            marginBottom: 'clamp(1.5rem, 2vw, 2rem)'
          }}
        >
          {heading}
        </h2>
        {subheading && (
          <p className="text-lg md:text-xl text-[var(--color-muted)] max-w-3xl mx-auto">
            {subheading}
          </p>
        )}
      </div>

      {/* Features Grid */}
      <div className={`grid ${gridCols} gap-6 md:gap-8 mb-12`}>
        {features.map((feature) => (
          <div
            key={feature.id}
            className="bg-white rounded-xl border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-all hover:shadow-lg group"
            style={{ padding: 'clamp(1.5rem, 2vw, 2rem)' }}
          >
            {/* Icon */}
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
              {feature.icon}
            </div>

            {/* Title */}
            <h3 className="text-xl md:text-2xl font-bold text-[var(--color-text)] mb-3 leading-tight">
              {feature.title}
            </h3>

            {/* Description */}
            <p className="text-[var(--color-muted)] mb-4 leading-relaxed">
              {feature.description}
            </p>

            {/* Original Price - Struck Through */}
            <div className="mt-auto">
              <span className="text-[var(--color-muted)] line-through text-lg">
                {formatPrice(feature.originalPrice)} Ft
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Section */}
      {footer && (
        <div
          className="bg-gradient-to-br from-[var(--color-background-alt)] to-white rounded-2xl border-2 border-[var(--color-primary)] relative overflow-hidden"
          style={{ padding: 'clamp(2rem, 3vw, 3rem)' }}
        >
          {/* Decorative background elements */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-0 w-40 h-40 bg-[var(--color-primary)] rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-[var(--color-secondary)] rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Text Content */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
                <h3 className="text-2xl md:text-3xl font-bold text-[var(--color-text)]">
                  {footer.title}
                </h3>
              </div>
              <p className="text-[var(--color-muted)] text-lg">
                {footer.description}
              </p>
            </div>

            {/* Badge */}
            <div className="flex-shrink-0">
              <div
                className="px-8 py-4 rounded-xl font-bold text-white text-xl shadow-lg transform hover:scale-105 transition-transform"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                Felbecsülhetetlen
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
