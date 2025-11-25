interface TextBlockProps {
  content: {
    heading?: string;
    body: string;
    alignment?: 'left' | 'center' | 'right';
    maxWidth?: 'narrow' | 'medium' | 'wide' | 'full';
  };
  brand: 'BOOM' | 'AIBOOST';
}

export function TextBlock({ content, brand }: TextBlockProps) {
  // Support both 'body' and 'content' field names for backwards compatibility
  const body = content.body || (content as any).content || '';
  const { heading, alignment = 'left', maxWidth = 'medium' } = content;

  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center mx-auto',
    right: 'text-right ml-auto',
  };

  const maxWidthClasses = {
    narrow: 'max-w-2xl',
    medium: 'max-w-4xl',
    wide: 'max-w-6xl',
    full: 'max-w-full',
  };

  return (
    <div className="py-12 md:py-16 lg:py-20">
      <div className={`${maxWidthClasses[maxWidth]} ${alignmentClasses[alignment]}`}>
        {heading && (
          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--color-text)] leading-tight"
            style={{
              marginBottom: 'clamp(2rem, 3vw, 3rem)'
            }}
          >
            {heading}
          </h2>
        )}
        <div
          className="prose prose-lg text-[var(--color-muted)] prose-headings:text-[var(--color-text)] prose-a:text-[var(--color-primary)] prose-strong:text-[var(--color-text)]"
          dangerouslySetInnerHTML={{ __html: body }}
        />
      </div>
    </div>
  );
}
