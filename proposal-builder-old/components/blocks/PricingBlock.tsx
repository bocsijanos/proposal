interface PricingPlan {
  id: string;
  name: string;
  description?: string;
  originalPrice?: number;
  discountedPrice: number;
  currency: string;
  billingPeriod: 'monthly' | 'yearly' | 'one-time';
  features: string[];
  isPopular?: boolean;
  ctaText: string;
}

interface PricingBlockProps {
  content: {
    heading: string;
    description?: string;
    plans: PricingPlan[];
  };
  brand: 'BOOM' | 'AIBOOST';
}

export function PricingBlock({ content, brand }: PricingBlockProps) {
  const { heading, description, plans } = content;

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('hu-HU', {
      style: 'decimal',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getBillingText = (period: string) => {
    const texts = {
      monthly: '/hó',
      yearly: '/év',
      'one-time': 'egyszeri',
    };
    return texts[period as keyof typeof texts] || '';
  };

  return (
    <section className="w-full py-12 md:py-16 lg:py-20">
      {/* Section Header */}
      <div className="text-center mb-12 md:mb-16 lg:mb-20">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--color-text)] leading-tight mb-6">
          {heading}
        </h2>
        {description && (
          <div className="flex justify-center">
            <p className="text-lg md:text-xl text-[var(--color-muted)] max-w-3xl leading-relaxed text-center">
              {description}
            </p>
          </div>
        )}
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-6 md:gap-8 lg:gap-10 max-w-7xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`relative rounded-xl border-2 transition-all hover:shadow-lg ${
              plan.isPopular
                ? 'border-[var(--color-primary)] bg-gradient-to-b from-white to-[var(--color-background-alt)]'
                : 'border-[var(--color-border)] bg-white'
            }`}
            style={{
              padding: 'clamp(2rem, 2.5vw, 3rem)'
            }}
          >
            {plan.isPopular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-[var(--color-primary)] text-white px-4 py-1 rounded-full text-xs font-semibold">
                  NÉPSZERŰ
                </span>
              </div>
            )}

            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-[var(--color-text)] mb-2">
                {plan.name}
              </h3>
              {plan.description && (
                <p className="text-sm text-[var(--color-muted)]">
                  {plan.description}
                </p>
              )}
            </div>

            <div className="text-center mb-6 pb-6 border-b border-[var(--color-border)]">
              {plan.originalPrice && (
                <div className="text-sm text-[var(--color-muted)] line-through mb-1">
                  {formatPrice(plan.originalPrice, plan.currency)} Ft
                </div>
              )}
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-4xl font-bold text-[var(--color-text)]">
                  {formatPrice(plan.discountedPrice, plan.currency)}
                </span>
                <span className="text-lg text-[var(--color-muted)]">
                  Ft
                </span>
              </div>
              <div className="text-sm text-[var(--color-muted)] mt-1">
                {getBillingText(plan.billingPeriod)}
              </div>
            </div>

            <ul className="space-y-3 mb-6">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <span className="text-[var(--color-primary)] mt-0.5">✓</span>
                  <span className="text-[var(--color-text)]">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              className={`w-full py-3 rounded-lg font-semibold transition-all ${
                plan.isPopular
                  ? 'bg-[var(--color-primary)] text-white hover:opacity-90'
                  : 'border-2 border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white'
              }`}
            >
              {plan.ctaText}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
