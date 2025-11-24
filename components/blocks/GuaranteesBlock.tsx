interface GuaranteesBlockProps {
  content: {
    heading: string;
    leftColumn: string[];
    rightColumn: string[];
    centerImage?: string;
  };
  brand: 'BOOM' | 'AIBOOST';
}

export function GuaranteesBlock({ content, brand }: GuaranteesBlockProps) {
  const { heading, leftColumn, rightColumn } = content;

  return (
    <section className="w-full bg-gradient-to-br from-[var(--color-background-alt)] via-white to-[var(--color-background-alt)] rounded-3xl p-10 md:p-16 lg:p-20 shadow-xl">
      <h2
        className="text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--color-text)] text-center leading-tight"
        style={{
          marginBottom: 'clamp(3rem, 4vw, 4rem)'
        }}
      >
        {heading}
      </h2>

      <div className="grid md:grid-cols-3 gap-6 md:gap-8 lg:gap-10 items-center max-w-7xl mx-auto">
        {/* Left Column */}
        <div className="space-y-8 md:space-y-10">
          {leftColumn.map((item, idx) => (
            <div
              key={idx}
              className="flex items-start gap-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border border-[var(--color-border)]"
              style={{ padding: 'clamp(2rem, 2.5vw, 3rem)' }}
            >
              <svg
                className="w-6 h-6 flex-shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="var(--color-primary)"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-[var(--color-text)] text-lg leading-relaxed">{item}</span>
            </div>
          ))}
        </div>

        {/* Center Icon */}
        <div className="flex justify-center">
          <div className="text-9xl md:text-[10rem] opacity-90">🛡️</div>
        </div>

        {/* Right Column */}
        <div className="space-y-8 md:space-y-10">
          {rightColumn.map((item, idx) => (
            <div
              key={idx}
              className="flex items-start gap-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border border-[var(--color-border)]"
              style={{ padding: 'clamp(2rem, 2.5vw, 3rem)' }}
            >
              <svg
                className="w-6 h-6 flex-shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="var(--color-primary)"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-[var(--color-text)] text-lg leading-relaxed">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
