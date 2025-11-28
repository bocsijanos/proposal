/**
 * Brand Card Component
 *
 * Automatikusan a brand book szerinti kártya stílusokat alkalmazza.
 * Használat: <Card>Tartalom</Card>
 */

import React from 'react';
import { boomTokens } from '@/lib/design-tokens/boom-tokens';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  padding?: keyof typeof boomTokens.spacing;
  hover?: boolean;
  onClick?: () => void;
}

export function Card({
  children,
  className = '',
  style = {},
  padding = 'lg',
  hover = true,
  onClick,
}: CardProps) {
  const cardConfig = boomTokens.components.card;
  const [isHovered, setIsHovered] = React.useState(false);

  const baseStyle: React.CSSProperties = {
    background: cardConfig.background,
    borderRadius: cardConfig.borderRadius,
    padding: boomTokens.spacing[padding],
    boxShadow: cardConfig.boxShadow,
    transition: cardConfig.transition,
    cursor: onClick ? 'pointer' : 'default',
    ...style,
  };

  const hoverStyle: React.CSSProperties =
    hover && isHovered
      ? {
          transform: cardConfig.hover.transform,
          boxShadow: cardConfig.hover.boxShadow,
        }
      : {};

  return (
    <div
      className={className}
      style={{ ...baseStyle, ...hoverStyle }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
