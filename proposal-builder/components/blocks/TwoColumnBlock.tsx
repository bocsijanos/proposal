interface TwoColumnBlockProps {
  content: {
    heading?: string;
    leftColumn: {
      type: 'image' | 'text';
      imageUrl?: string;
      imageAlt?: string;
      text?: string;
      title?: string;
    };
    rightColumn: {
      type: 'image' | 'text';
      imageUrl?: string;
      imageAlt?: string;
      text?: string;
      title?: string;
    };
    reverseOnMobile?: boolean;
  };
  brand: 'BOOM' | 'AIBOOST';
}

export function TwoColumnBlock({ content, brand }: TwoColumnBlockProps) {
  const { heading, leftColumn, rightColumn, reverseOnMobile = false } = content;

  const renderColumn = (column: typeof leftColumn) => {
    if (column.type === 'image' && column.imageUrl) {
      return (
        <div className="relative h-full min-h-[300px] rounded-xl overflow-hidden">
          <img
            src={column.imageUrl}
            alt={column.imageAlt || ''}
            className="w-full h-full object-cover"
          />
        </div>
      );
    }

    return (
      <div className="flex flex-col justify-center h-full">
        {column.title && (
          <h3
            className="text-2xl md:text-3xl font-bold text-[var(--color-text)] leading-tight"
            style={{
              marginBottom: 'clamp(1rem, 1.5vw, 1.5rem)'
            }}
          >
            {column.title}
          </h3>
        )}
        {column.text && (
          <div
            className="prose prose-lg text-[var(--color-muted)] prose-headings:text-[var(--color-text)] prose-a:text-[var(--color-primary)]"
            dangerouslySetInnerHTML={{ __html: column.text }}
          />
        )}
      </div>
    );
  };

  return (
    <div className="py-12 md:py-16 lg:py-20">
      {heading && (
        <div className="text-center mb-12">
          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--color-text)] leading-tight"
            style={{
              marginBottom: 'clamp(2rem, 3vw, 3rem)'
            }}
          >
            {heading}
          </h2>
        </div>
      )}

      <div className={`grid md:grid-cols-2 gap-8 md:gap-12 items-center ${reverseOnMobile ? 'flex-col-reverse' : ''}`}>
        <div className="w-full">
          {renderColumn(leftColumn)}
        </div>
        <div className="w-full">
          {renderColumn(rightColumn)}
        </div>
      </div>
    </div>
  );
}
