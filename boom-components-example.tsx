/**
 * BOOM Marketing Agency - React Component Példák
 * Használatra kész komponensek a design system alapján
 */

import React from 'react';
import { theme } from './boom-design-tokens';

// ==================== BUTTON COMPONENT ====================

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'text';
  size?: 'small' | 'medium' | 'large';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  children,
  onClick,
  disabled = false,
  fullWidth = false,
}) => {
  const buttonStyles: React.CSSProperties = {
    // Base styles
    fontFamily: theme.typography.fontFamily.primary,
    fontWeight: theme.typography.fontWeight.regular,
    borderRadius: theme.borderRadius.full,
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: theme.transitions.smooth,
    textAlign: 'center',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    width: fullWidth ? '100%' : 'auto',

    // Size variants
    ...(size === 'small' && {
      padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
      fontSize: theme.typography.fontSize.base,
    }),
    ...(size === 'medium' && {
      padding: `${theme.spacing.md} ${theme.spacing.xl}`,
      fontSize: theme.typography.fontSize.lg,
    }),
    ...(size === 'large' && {
      padding: `${theme.spacing.lg} 40px`,
      fontSize: theme.typography.fontSize.lg,
    }),

    // Variant styles
    ...(variant === 'primary' && {
      backgroundColor: disabled ? theme.colors.border.medium : theme.colors.brand.primary,
      color: theme.colors.text.white,
    }),
    ...(variant === 'secondary' && {
      backgroundColor: 'transparent',
      color: disabled ? theme.colors.text.disabled : theme.colors.text.primary,
      border: `2px solid ${disabled ? theme.colors.border.medium : theme.colors.text.primary}`,
      padding: size === 'medium' ? '14px 30px' : '6px 22px', // Adjusted for border
    }),
    ...(variant === 'text' && {
      backgroundColor: 'transparent',
      color: disabled ? theme.colors.text.disabled : theme.colors.brand.primary,
      textDecoration: 'underline',
    }),
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    const target = e.currentTarget;

    if (variant === 'primary') {
      target.style.backgroundColor = theme.colors.brand.primaryHover;
      target.style.transform = 'translateY(-2px)';
      target.style.boxShadow = theme.shadows.primary.md;
    } else if (variant === 'secondary') {
      target.style.backgroundColor = theme.colors.text.primary;
      target.style.color = theme.colors.text.white;
      target.style.transform = 'translateY(-2px)';
      target.style.boxShadow = theme.shadows.lg;
    } else if (variant === 'text') {
      target.style.color = theme.colors.brand.primaryHover;
      target.style.textDecoration = 'none';
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    const target = e.currentTarget;

    if (variant === 'primary') {
      target.style.backgroundColor = theme.colors.brand.primary;
      target.style.transform = 'translateY(0)';
      target.style.boxShadow = 'none';
    } else if (variant === 'secondary') {
      target.style.backgroundColor = 'transparent';
      target.style.color = theme.colors.text.primary;
      target.style.transform = 'translateY(0)';
      target.style.boxShadow = 'none';
    } else if (variant === 'text') {
      target.style.color = theme.colors.brand.primary;
      target.style.textDecoration = 'underline';
    }
  };

  return (
    <button
      style={buttonStyles}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </button>
  );
};

// ==================== SERVICE CARD COMPONENT ====================

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  icon,
  title,
  description,
  buttonText,
  buttonLink,
}) => {
  const [isHovered, setIsHovered] = React.useState(false);

  const cardStyles: React.CSSProperties = {
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.borderRadius.md,
    padding: `${theme.spacing['3xl']} ${theme.spacing.xl}`,
    border: `1px solid ${isHovered ? theme.colors.brand.primary : theme.colors.background.secondary}`,
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing.lg,
    transition: theme.transitions.smooth,
    transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
    boxShadow: isHovered ? theme.shadows.xl : 'none',
    cursor: 'pointer',
  };

  const iconStyles: React.CSSProperties = {
    color: theme.colors.brand.primary,
    fontSize: theme.spacing['3xl'],
    marginBottom: theme.spacing.md,
  };

  const titleStyles: React.CSSProperties = {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  };

  const descriptionStyles: React.CSSProperties = {
    fontSize: theme.typography.fontSize.base,
    lineHeight: theme.typography.lineHeight.relaxed,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.lg,
  };

  return (
    <div
      style={cardStyles}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={iconStyles}>{icon}</div>
      <h5 style={titleStyles}>{title}</h5>
      <p style={descriptionStyles}>{description}</p>
      <Button variant="primary" size="medium">
        {buttonText}
      </Button>
    </div>
  );
};

// ==================== BLOG CARD COMPONENT ====================

interface BlogCardProps {
  image: string;
  category: string;
  title: string;
  excerpt: string;
  link: string;
}

export const BlogCard: React.FC<BlogCardProps> = ({
  image,
  category,
  title,
  excerpt,
  link,
}) => {
  const [isHovered, setIsHovered] = React.useState(false);

  const cardStyles: React.CSSProperties = {
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    boxShadow: isHovered ? theme.shadows.cardHover : theme.shadows.card,
    transition: theme.transitions.smooth,
    transform: isHovered ? 'translateY(-6px)' : 'translateY(0)',
    cursor: 'pointer',
  };

  const imageStyles: React.CSSProperties = {
    width: '100%',
    height: '240px',
    objectFit: 'cover',
  };

  const contentStyles: React.CSSProperties = {
    padding: theme.spacing.lg,
  };

  const categoryStyles: React.CSSProperties = {
    display: 'inline-block',
    padding: `6px ${theme.spacing.md}`,
    backgroundColor: theme.colors.brand.primary,
    color: theme.colors.text.white,
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.semibold,
    borderRadius: theme.borderRadius.full,
    textTransform: 'uppercase',
    letterSpacing: theme.typography.letterSpacing.wide,
    marginBottom: theme.spacing.sm,
  };

  const titleStyles: React.CSSProperties = {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: isHovered ? theme.colors.brand.primary : theme.colors.text.primary,
    lineHeight: theme.typography.lineHeight.tight,
    marginBottom: theme.spacing.sm,
    transition: theme.transitions.color,
  };

  const excerptStyles: React.CSSProperties = {
    fontSize: theme.typography.fontSize.sm,
    lineHeight: theme.typography.lineHeight.relaxed,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.md,
  };

  return (
    <article
      style={cardStyles}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img src={image} alt={title} style={imageStyles} />
      <div style={contentStyles}>
        <span style={categoryStyles}>{category}</span>
        <h3 style={titleStyles}>{title}</h3>
        <p style={excerptStyles}>{excerpt}</p>
        <Button variant="text" size="small">
          Tovább olvasom →
        </Button>
      </div>
    </article>
  );
};

// ==================== TESTIMONIAL CARD COMPONENT ====================

interface TestimonialCardProps {
  quote: string;
  authorName: string;
  authorTitle: string;
  authorAvatar: string;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({
  quote,
  authorName,
  authorTitle,
  authorAvatar,
}) => {
  const cardStyles: React.CSSProperties = {
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing['2xl'],
    boxShadow: theme.shadows.testimonial,
  };

  const quoteStyles: React.CSSProperties = {
    fontSize: theme.typography.fontSize.base,
    lineHeight: theme.typography.lineHeight.relaxed,
    color: theme.colors.text.secondary,
    fontStyle: 'italic',
    marginBottom: theme.spacing.lg,
    position: 'relative',
    paddingLeft: theme.spacing.xl,
  };

  const quoteIconStyles: React.CSSProperties = {
    position: 'absolute',
    left: '0',
    top: '-8px',
    fontSize: theme.typography.fontSize['3xl'],
    color: theme.colors.brand.primary,
    opacity: 0.3,
  };

  const authorContainerStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.md,
  };

  const avatarStyles: React.CSSProperties = {
    width: '64px',
    height: '64px',
    borderRadius: theme.borderRadius.circle,
    objectFit: 'cover',
    border: `3px solid ${theme.colors.brand.primary}`,
  };

  const authorNameStyles: React.CSSProperties = {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: '4px',
  };

  const authorTitleStyles: React.CSSProperties = {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.regular,
    color: theme.colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: theme.typography.letterSpacing.wide,
  };

  return (
    <div style={cardStyles}>
      <div style={quoteStyles}>
        <span style={quoteIconStyles}>"</span>
        {quote}
      </div>
      <div style={authorContainerStyles}>
        <img src={authorAvatar} alt={authorName} style={avatarStyles} />
        <div>
          <div style={authorNameStyles}>{authorName}</div>
          <div style={authorTitleStyles}>{authorTitle}</div>
        </div>
      </div>
    </div>
  );
};

// ==================== INPUT FIELD COMPONENT ====================

interface InputFieldProps {
  label?: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'tel' | 'url';
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  placeholder,
  type = 'text',
  value,
  onChange,
  error,
  disabled = false,
  required = false,
}) => {
  const [isFocused, setIsFocused] = React.useState(false);

  const containerStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.sm,
    width: '100%',
  };

  const labelStyles: React.CSSProperties = {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
  };

  const inputStyles: React.CSSProperties = {
    width: '100%',
    padding: `14px ${theme.spacing.lg}`,
    fontSize: theme.typography.fontSize.base,
    lineHeight: theme.typography.lineHeight.normal,
    color: theme.colors.text.primary,
    backgroundColor: disabled ? theme.colors.background.secondary : theme.colors.background.primary,
    border: `2px solid ${
      error
        ? theme.colors.utility.error
        : isFocused
        ? theme.colors.brand.primary
        : theme.colors.border.light
    }`,
    borderRadius: theme.borderRadius.md,
    transition: theme.transitions.default,
    outline: 'none',
    cursor: disabled ? 'not-allowed' : 'text',
  };

  const errorStyles: React.CSSProperties = {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.utility.error,
  };

  return (
    <div style={containerStyles}>
      {label && (
        <label style={labelStyles}>
          {label}
          {required && <span style={{ color: theme.colors.utility.error }}> *</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        style={inputStyles}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      {error && <span style={errorStyles}>{error}</span>}
    </div>
  );
};

// ==================== SECTION CONTAINER ====================

interface SectionProps {
  children: React.ReactNode;
  backgroundColor?: string;
  paddingTop?: string;
  paddingBottom?: string;
}

export const Section: React.FC<SectionProps> = ({
  children,
  backgroundColor = theme.colors.background.primary,
  paddingTop = theme.spacing['4xl'],
  paddingBottom = theme.spacing['4xl'],
}) => {
  const sectionStyles: React.CSSProperties = {
    backgroundColor,
    paddingTop,
    paddingBottom,
  };

  return <section style={sectionStyles}>{children}</section>;
};

// ==================== CONTAINER ====================

interface ContainerProps {
  children: React.ReactNode;
  maxWidth?: keyof typeof theme.container;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  maxWidth = 'xl',
}) => {
  const containerStyles: React.CSSProperties = {
    maxWidth: theme.container[maxWidth],
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingLeft: theme.spacing.lg,
    paddingRight: theme.spacing.lg,
  };

  return <div style={containerStyles}>{children}</div>;
};

// ==================== USAGE EXAMPLE ====================

export const ExamplePage: React.FC = () => {
  const [email, setEmail] = React.useState('');

  return (
    <>
      {/* Hero Section */}
      <Section backgroundColor={theme.colors.background.secondary}>
        <Container maxWidth="xl">
          <h1
            style={{
              fontSize: theme.typography.fontSize['5xl'],
              fontWeight: theme.typography.fontWeight.bold,
              color: theme.colors.text.primary,
              marginBottom: theme.spacing.lg,
            }}
          >
            Segítünk a következő szintre lépni
          </h1>
          <p
            style={{
              fontSize: theme.typography.fontSize.lg,
              color: theme.colors.text.secondary,
              lineHeight: theme.typography.lineHeight.relaxed,
              marginBottom: theme.spacing.xl,
            }}
          >
            Bármekkora vállalkozásról is legyen szó, a szintlépés sosem egyszerű.
          </p>
          <Button variant="primary" size="large">
            Hogyan tudtok segíteni?
          </Button>
        </Container>
      </Section>

      {/* Services Section */}
      <Section>
        <Container maxWidth="xl">
          <h2
            style={{
              fontSize: theme.typography.fontSize['4xl'],
              fontWeight: theme.typography.fontWeight.bold,
              color: theme.colors.text.primary,
              textAlign: 'center',
              marginBottom: theme.spacing['2xl'],
            }}
          >
            Válaszd ki az irányt!
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: theme.spacing.lg,
            }}
          >
            <ServiceCard
              icon={<span>📝</span>}
              title="Csináld magad"
              description="Ha Te magad szeretnéd megtervezni, kiépíteni és menedzselni a vállalkozásod online marketing rendszereit..."
              buttonText="Ez kell nekem"
              buttonLink="/csinald-magad"
            />
          </div>
        </Container>
      </Section>

      {/* Newsletter Section */}
      <Section backgroundColor={theme.colors.background.secondary}>
        <Container maxWidth="md">
          <h3
            style={{
              fontSize: theme.typography.fontSize['3xl'],
              fontWeight: theme.typography.fontWeight.bold,
              color: theme.colors.text.primary,
              textAlign: 'center',
              marginBottom: theme.spacing.lg,
            }}
          >
            Iratkozz fel a hírlevelünkre!
          </h3>
          <InputField
            label="Email cím"
            type="email"
            placeholder="pelda@email.hu"
            value={email}
            onChange={setEmail}
            required
          />
          <div style={{ marginTop: theme.spacing.lg, textAlign: 'center' }}>
            <Button variant="primary" size="large" fullWidth>
              Feliratkozom
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
};
