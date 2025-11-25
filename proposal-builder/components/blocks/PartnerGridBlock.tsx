interface Partner {
  id: string;
  name: string;
  logo: string; // URL to partner logo
  description?: string;
  website?: string;
}

interface PartnerGridBlockProps {
  content: {
    version: string;
    heading: string; // e.g., "BOOM marketing kuponfüzet"
    subtitle?: string; // e.g., "Őket ajánljuk!"
    partners: Partner[];
    columns?: 2 | 3 | 4;
    showScissors?: boolean; // Show scissors icon for coupon effect
  };
  brand: 'BOOM' | 'AIBOOST';
}

export function PartnerGridBlock({ content, brand }: PartnerGridBlockProps) {
  const {
    heading,
    subtitle,
    partners,
    columns = 3,
    showScissors = true,
  } = content;

  // Responsive grid configuration
  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }[columns] || 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';

  return (
    <div className="py-12 md:py-16 lg:py-20">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h2
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--color-text)] leading-tight"
          style={{
            marginBottom: subtitle ? 'clamp(1rem, 2vw, 1.5rem)' : 'clamp(2rem, 3vw, 3rem)'
          }}
        >
          {heading}
        </h2>
        {subtitle && (
          <p className="text-xl md:text-2xl text-[var(--color-muted)] font-medium">
            {subtitle}
          </p>
        )}
      </div>

      {/* Partner Grid - Coupon Book Style */}
      <div className={`grid ${gridCols} gap-6 md:gap-8`}>
        {partners.map((partner) => {
          const PartnerWrapper = partner.website ? 'a' : 'div';
          const wrapperProps = partner.website
            ? { href: partner.website, target: '_blank', rel: 'noopener noreferrer' }
            : {};

          return (
            <PartnerWrapper
              key={partner.id}
              {...wrapperProps}
              className="group relative bg-white rounded-xl border-2 border-dashed border-gray-300 hover:border-[var(--color-primary)] transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-md overflow-hidden"
              style={{
                padding: 'clamp(1.5rem, 3vw, 2.5rem)',
                minHeight: '180px'
              }}
            >
              {/* Scissors Icon - Coupon Effect */}
              {showScissors && (
                <div className="absolute top-3 right-3 text-2xl opacity-40 group-hover:opacity-60 transition-opacity">
                  ✂️
                </div>
              )}

              {/* Partner Content */}
              <div className="flex flex-col items-center justify-center h-full gap-4">
                {/* Partner Logo */}
                <div className="flex items-center justify-center w-full flex-1">
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="max-w-full max-h-24 object-contain transition-transform group-hover:scale-110"
                  />
                </div>

                {/* Partner Name */}
                <h3 className="text-lg md:text-xl font-bold text-[var(--color-text)] text-center">
                  {partner.name}
                </h3>

                {/* Partner Description */}
                {partner.description && (
                  <p className="text-sm md:text-base text-[var(--color-muted)] text-center line-clamp-2">
                    {partner.description}
                  </p>
                )}
              </div>

              {/* Decorative Corner Notch (optional enhancement) */}
              <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-dashed border-gray-300 opacity-50" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-dashed border-gray-300 opacity-50" />
            </PartnerWrapper>
          );
        })}
      </div>

      {/* Empty State */}
      {partners.length === 0 && (
        <div className="text-center py-12 text-[var(--color-muted)]">
          <p className="text-lg">Nincs még hozzáadott partner</p>
        </div>
      )}
    </div>
  );
}
