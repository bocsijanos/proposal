/**
 * AI Boost Card Component
 *
 * Automatikusan az AI Boost brand book szerinti kártya stílusokat alkalmazza.
 * Használat: <Card>Tartalom</Card>
 */

import React from 'react';
import { aiboostTokens } from '@/lib/design-tokens/aiboost-tokens';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  padding?: keyof typeof aiboostTokens.spacing;
  hover?: boolean;
  onClick?: () => void;
}

export function Card({
  children,
  className = '',
  style = {},
  padding = 'xl',
  hover = true,
  onClick,
}: CardProps) {
  const cardConfig = aiboostTokens.components.card;
  const [isHovered, setIsHovered] = React.useState(false);

  const baseStyle: React.CSSProperties = {
    background: cardConfig.background,
    borderRadius: cardConfig.borderRadius,
    padding: aiboostTokens.spacing[padding],
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
