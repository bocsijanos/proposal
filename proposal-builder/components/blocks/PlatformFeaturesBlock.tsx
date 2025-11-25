interface NormalizedFeature {
  id: string;
  icon: string;
  title: string;
  description: string;
  benefits?: string[];
}

interface PlatformFeaturesBlockProps {
  content: {
    heading: string;
    description?: string;
    features: Array<string> | Array<{
      id: string;
      icon: string;
      title: string;
      description: string;
      benefits?: string[];
    }>;
  };
  brand: 'BOOM' | 'AIBOOST';
}

export function PlatformFeaturesBlock({ content, brand }: PlatformFeaturesBlockProps) {
  const { heading, description, features: rawFeatures } = content;

  // Normalize features to handle both string arrays and object arrays
  const features: NormalizedFeature[] = (rawFeatures as any[]).map((feature, index) => {
    if (typeof feature === 'string') {
      return {
        id: `feature-${index}`,
        icon: '✓',
        title: feature,
        description: '',
        benefits: []
      };
    }
    return feature;
  });

  return (
    <div className="py-12 md:py-16 lg:py-20">
      <div className="text-center mb-12">
        <h2
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--color-text)] leading-tight"
          style={{
            marginBottom: 'clamp(2rem, 3vw, 3rem)'
          }}
        >
          {heading}
        </h2>
        {description && (
          <p className="text-lg text-[var(--color-muted)] max-w-2xl mx-auto">
            {description}
          </p>
        )}
      </div>

      <div className="space-y-8">
        {features.map((feature, index) => (
          <div
            key={feature.id}
            className={`flex flex-col md:flex-row gap-6 items-start rounded-xl border border-[var(--color-border)] bg-white hover:border-[var(--color-primary)] transition-colors ${
              index % 2 === 1 ? 'md:flex-row-reverse' : ''
            }`}
            style={{ padding: 'clamp(1.5rem, 2vw, 2rem)' }}
          >
            {/* Icon */}
            <div className="flex-shrink-0">
              <div className="w-16 h-16 rounded-xl bg-[var(--color-primary)] bg-opacity-10 flex items-center justify-center text-4xl">
                {feature.icon}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-[var(--color-text)] mb-3">
                {feature.title}
              </h3>
              <p className="text-[var(--color-muted)] mb-4">
                {feature.description}
              </p>

              {feature.benefits && feature.benefits.length > 0 && (
                <ul className="space-y-2">
                  {feature.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-[var(--color-muted)]">
                      <span className="text-[var(--color-primary)] mt-1">✓</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
