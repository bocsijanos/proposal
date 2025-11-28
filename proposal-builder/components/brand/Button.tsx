/**
 * Brand Button Component
 *
 * Automatikusan a brand book szerinti gomb stílusokat alkalmazza.
 * Használat: <Button variant="primary">Kattints ide</Button>
 */

import React from 'react';
import { boomTokens } from '@/lib/design-tokens/boom-tokens';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  children: React.ReactNode;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export function Button({
  variant = 'primary',
  size = 'medium',
  children,
  fullWidth = false,
  icon,
  iconPosition = 'left',
  className = '',
  style = {},
  disabled = false,
  ...props
}: ButtonProps) {
  const variantConfig = boomTokens.components.button[variant];
  const sizeConfig = boomTokens.components.button.sizes[size];

  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontFamily: boomTokens.typography.fontFamily.primary,
    cursor: disabled ? 'not-allowed' : 'pointer',
    border: 'border' in variantConfig ? variantConfig.border : 'none',
    transition: variantConfig.transition,
    width: fullWidth ? '100%' : 'auto',
    opacity: disabled ? 0.5 : 1,

    // Variant-specific styles
    background: variantConfig.background,
    color: variantConfig.color,
    borderRadius: variantConfig.borderRadius,
    boxShadow: 'boxShadow' in variantConfig ? variantConfig.boxShadow : undefined,

    // Size-specific styles
    padding: sizeConfig.padding,
    fontSize: sizeConfig.fontSize,
    fontWeight: variantConfig.fontWeight,

    ...style,
  };

  const [isHovered, setIsHovered] = React.useState(false);

  const hover = variantConfig.hover as Record<string, unknown>;
  const hoverStyle: React.CSSProperties = isHovered && !disabled
    ? {
        transform: hover.transform as string | undefined,
        boxShadow: hover.boxShadow as string | undefined,
        background: hover.background as string | undefined,
        color: hover.color as string | undefined,
      }
    : {};

  return (
    <button
      className={className}
      style={{ ...baseStyle, ...hoverStyle }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={disabled}
      {...props}
    >
      {icon && iconPosition === 'left' && <span>{icon}</span>}
      {children}
      {icon && iconPosition === 'right' && <span>{icon}</span>}
    </button>
  );
}
