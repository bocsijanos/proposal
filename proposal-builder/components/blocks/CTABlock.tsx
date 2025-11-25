interface CTAButton {
  text: string;
  url: string;
}

interface CTABlockProps {
  content: {
    heading: string;
    description?: string;
    primaryCta?: CTAButton;
    secondaryCta?: CTAButton;
    // Legacy support
    primaryButton?: CTAButton;
    secondaryButton?: CTAButton;
    backgroundColor?: string;
  };
  brand: 'BOOM' | 'AIBOOST';
}

export function CTABlock({ content, brand }: CTABlockProps) {
  const { heading, description } = content;

  // Támogatjuk mindkét formátumot: primaryCta/secondaryCta ÉS primaryButton/secondaryButton
  const primaryCta = content.primaryCta || content.primaryButton;
  const secondaryCta = content.secondaryCta || content.secondaryButton;

  return (
    <section
      className="rounded-3xl p-12 md:p-20 lg:p-24 text-center shadow-2xl relative overflow-hidden"
      style={{
        background: 'var(--gradient-cta)',
      }}
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-white rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        <h2
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-white max-w-4xl mx-auto leading-tight"
          style={{
            marginBottom: 'clamp(2rem, 3vw, 3rem)'
          }}
        >
          {heading}
        </h2>
        {description && (
          <p className="text-xl md:text-2xl text-white/90 mb-12 md:mb-16 max-w-3xl mx-auto leading-relaxed">
            {description}
          </p>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          {primaryCta && (
            <a
              href={primaryCta.url}
              className="inline-block px-10 py-5 bg-white text-[var(--color-primary)] rounded-xl font-semibold text-lg hover:opacity-90 hover:scale-105 transition-all shadow-lg min-w-[240px]"
            >
              {primaryCta.text}
            </a>
          )}
          {secondaryCta && (
            <a
              href={secondaryCta.url}
              className="inline-block px-10 py-5 bg-transparent border-2 border-white text-white rounded-xl font-semibold text-lg hover:bg-white hover:text-[var(--color-primary)] transition-all min-w-[240px]"
            >
              {secondaryCta.text}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
