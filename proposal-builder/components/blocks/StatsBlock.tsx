import { getBrandColors } from '@/lib/brandColors';

interface StatsBlockProps {
  content: {
    heading?: string;
    description?: string;
    stats: Array<{
      id: string;
      value: string;
      label: string;
      icon?: string;
      suffix?: string;
      prefix?: string;
    }>;
    columns?: number;
    backgroundColor?: 'white' | 'gradient';
  };
  brand: 'BOOM' | 'AIBOOST';
}

export function StatsBlock({ content, brand }: StatsBlockProps) {
  const { heading, description, stats, columns = 4, backgroundColor = 'white' } = content;
  const colors = getBrandColors(brand);
  const isGradientBg = backgroundColor === 'gradient';

  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-4',
  }[columns] || 'grid-cols-2 md:grid-cols-4';

  const bgStyle = backgroundColor === 'gradient'
    ? { background: 'var(--gradient-hero)' }
    : {};

  return (
    <div
      className="py-16 rounded-2xl"
      style={bgStyle}
    >
      {(heading || description) && (
        <div className="text-center mb-12">
          {heading && (
            <h2
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
              style={{
                color: isGradientBg ? 'white' : colors.headingPrimary,
                marginBottom: 'clamp(2rem, 3vw, 3rem)'
              }}
            >
              {heading}
            </h2>
          )}
          {description && (
            <p
              className="text-lg max-w-2xl mx-auto"
              style={{ color: isGradientBg ? 'rgba(255, 255, 255, 0.8)' : colors.textColor }}
            >
              {description}
            </p>
          )}
        </div>
      )}

      <div className={`grid ${gridCols} gap-8`}>
        {stats.map((stat) => (
          <div
            key={stat.id}
            className="text-center"
          >
            {stat.icon && (
              <div
                className="text-4xl mb-3"
                style={{ color: isGradientBg ? 'white' : colors.headingSecondary }}
              >
                {stat.icon}
              </div>
            )}
            <div
              className="text-4xl md:text-5xl font-bold mb-2"
              style={{ color: isGradientBg ? 'white' : colors.headingSecondary }}
            >
              {stat.prefix}
              {stat.value}
              {stat.suffix}
            </div>
            <div
              className="text-lg"
              style={{ color: isGradientBg ? 'rgba(255, 255, 255, 0.8)' : colors.textColor }}
            >
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
