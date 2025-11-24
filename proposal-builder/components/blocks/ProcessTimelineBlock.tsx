interface ProcessTimelineBlockProps {
  content: {
    heading: string;
    description?: string;
    steps: Array<{
      id: string;
      number: number;
      title: string;
      description: string;
      icon?: string;
    }>;
  };
  brand: 'BOOM' | 'AIBOOST';
}

export function ProcessTimelineBlock({ content, brand }: ProcessTimelineBlockProps) {
  const { heading, description, steps } = content;

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

      <div className="relative max-w-4xl mx-auto">
        {/* Vertical line on desktop */}
        <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-0.5 bg-[var(--color-border)]" />

        <div className="space-y-12">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`relative flex items-center gap-8 ${
                index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              }`}
            >
              {/* Content */}
              <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                <div
                  className="bg-white rounded-xl border border-[var(--color-border)] shadow-sm hover:shadow-md transition-shadow"
                  style={{ padding: 'clamp(1.5rem, 2vw, 2rem)' }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    {step.icon && (
                      <span className="text-3xl">{step.icon}</span>
                    )}
                    <h3 className="text-xl font-semibold text-[var(--color-text)]">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-[var(--color-muted)]">
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Number badge */}
              <div className="flex-shrink-0 relative z-10">
                <div className="w-16 h-16 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center text-2xl font-bold shadow-lg">
                  {step.number}
                </div>
              </div>

              {/* Spacer for alternating layout */}
              <div className="flex-1 hidden md:block" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
