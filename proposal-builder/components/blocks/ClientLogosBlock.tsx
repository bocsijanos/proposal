interface ClientLogosBlockProps {
  content: {
    heading: string;
    description?: string;
    logos: Array<{
      id: string;
      name: string;
      imageUrl: string;
      website?: string;
    }>;
    columns?: number;
  };
  brand: 'BOOM' | 'AIBOOST';
}

export function ClientLogosBlock({ content, brand }: ClientLogosBlockProps) {
  const { heading, description, logos, columns = 4 } = content;

  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-4',
    5: 'grid-cols-2 md:grid-cols-5',
    6: 'grid-cols-3 md:grid-cols-6',
  }[columns] || 'grid-cols-2 md:grid-cols-4';

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

      <div className={`grid ${gridCols} gap-8`}>
        {logos.map((logo) => {
          const LogoWrapper = logo.website ? 'a' : 'div';
          const wrapperProps = logo.website
            ? { href: logo.website, target: '_blank', rel: 'noopener noreferrer' }
            : {};

          return (
            <LogoWrapper
              key={logo.id}
              {...wrapperProps}
              className="flex items-center justify-center bg-white rounded-xl border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-colors"
              style={{ padding: 'clamp(1.5rem, 2vw, 2rem)' }}
            >
              <img
                src={logo.imageUrl}
                alt={logo.name}
                className="max-w-full max-h-20 object-contain grayscale hover:grayscale-0 transition-all"
              />
            </LogoWrapper>
          );
        })}
      </div>

      {logos.length === 0 && (
        <div className="text-center py-12 text-[var(--color-muted)]">
          <p className="text-lg">Nincs még hozzáadott ügyfél logó</p>
        </div>
      )}
    </div>
  );
}
