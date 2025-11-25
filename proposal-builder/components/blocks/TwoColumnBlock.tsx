interface ColumnContent {
  // Format 1: BOOM templates with items list
  title?: string;
  items?: string[];
  // Format 2: Typed columns (text or image)
  type?: "image" | "text";
  imageUrl?: string;
  imageAlt?: string;
  text?: string;
}

interface TwoColumnBlockProps {
  content: {
    heading?: string;
    leftColumn: ColumnContent;
    rightColumn: ColumnContent;
    reverseOnMobile?: boolean;
  };
  brand: "BOOM" | "AIBOOST";
}

export function TwoColumnBlock({ content, brand }: TwoColumnBlockProps) {
  const { heading, leftColumn, rightColumn, reverseOnMobile = false } = content;

  const renderColumn = (column: ColumnContent) => {
    // Safety check: ensure column exists
    if (!column) {
      return null;
    }

    // Handle image type explicitly
    if (column.type === "image" && column.imageUrl) {
      return (
        <div className="relative h-full min-h-[300px] rounded-xl overflow-hidden">
          <img
            src={column.imageUrl}
            alt={column.imageAlt || ""}
            className="w-full h-full object-cover"
          />
        </div>
      );
    }

    // Handle list format (BOOM templates with items array)
    if (column.items && Array.isArray(column.items)) {
      return (
        <div className="flex flex-col justify-center h-full">
          {column.title && (
            <h3
              className="text-2xl md:text-3xl font-bold text-[var(--color-text)] leading-tight"
              style={{
                marginBottom: "clamp(1rem, 1.5vw, 1.5rem)",
              }}
            >
              {column.title}
            </h3>
          )}
          <ul className="space-y-3">
            {column.items.map((item, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="text-[var(--color-primary)] font-bold mt-1">
                  •
                </span>
                <span className="text-[var(--color-muted)] text-base">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      );
    }

    // Handle text format (default or explicit type === 'text')
    return (
      <div className="flex flex-col justify-center h-full">
        {column.title && (
          <h3
            className="text-2xl md:text-3xl font-bold text-[var(--color-text)] leading-tight"
            style={{
              marginBottom: "clamp(1rem, 1.5vw, 1.5rem)",
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
              marginBottom: "clamp(2rem, 3vw, 3rem)",
            }}
          >
            {heading}
          </h2>
        </div>
      )}

      <div
        className={`grid md:grid-cols-2 gap-8 md:gap-12 items-center ${reverseOnMobile ? "flex-col-reverse" : ""}`}
      >
        <div className="w-full">{renderColumn(leftColumn)}</div>
        <div className="w-full">{renderColumn(rightColumn)}</div>
      </div>
    </div>
  );
}
