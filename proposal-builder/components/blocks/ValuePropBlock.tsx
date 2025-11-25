import { getBrandColors } from '@/lib/brandColors';

interface ValuePropBlockProps {
  content: {
    heading: string;
    leftColumn: {
      title: string;
      items: string[];
    };
    rightColumn: {
      title: string;
      content: string;
    };
    iconUrl?: string;
  };
  brand: 'BOOM' | 'AIBOOST';
}

export function ValuePropBlock({ content, brand }: ValuePropBlockProps) {
  const { heading, leftColumn, rightColumn } = content;
  const colors = getBrandColors(brand);

  return (
    <section className="w-full bg-white rounded-3xl p-10 md:p-16 lg:p-20 shadow-lg">
      <h2
        className="text-4xl md:text-5xl lg:text-6xl font-bold text-center leading-tight"
        style={{
          color: colors.headingPrimary,
          marginBottom: 'clamp(3rem, 4vw, 4rem)'
        }}
      >
        {heading}
      </h2>

      <div className="grid md:grid-cols-2 gap-8 md:gap-10 lg:gap-12 items-start max-w-6xl mx-auto">
        {/* Left Column */}
        <div
          className="bg-gradient-to-br from-[var(--color-background-alt)] to-white rounded-2xl shadow-inner border border-[var(--color-border)]"
          style={{ padding: 'clamp(2rem, 2.5vw, 3rem)' }}
        >
          <h3
            className="text-3xl md:text-4xl font-bold leading-tight"
            style={{
              color: colors.headingSecondary,
              marginBottom: 'clamp(1.5rem, 2vw, 2rem)'
            }}
          >
            {leftColumn.title}
          </h3>
          <ul className="space-y-5">
            {leftColumn.items.map((item, idx) => (
              <li key={idx} className="flex items-start gap-4">
                <svg
                  className="w-6 h-6 flex-shrink-0 mt-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="var(--color-primary)"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span
                  className="text-lg leading-relaxed"
                  style={{ color: colors.textColor }}
                >
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Column */}
        <div
          className="bg-gradient-to-br from-[var(--color-background-alt)] to-white rounded-2xl shadow-inner border border-[var(--color-border)]"
          style={{ padding: 'clamp(2rem, 2.5vw, 3rem)' }}
        >
          <h3
            className="text-3xl md:text-4xl font-bold leading-tight"
            style={{
              color: colors.headingSecondary,
              marginBottom: 'clamp(1.5rem, 2vw, 2rem)'
            }}
          >
            {rightColumn.title}
          </h3>
          <p
            className="text-lg leading-relaxed"
            style={{ color: colors.textColor }}
          >
            {rightColumn.content}
          </p>
        </div>
      </div>
    </section>
  );
}
