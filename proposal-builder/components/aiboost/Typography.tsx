/**
 * AI Boost Typography Components
 *
 * Automatikusan az AI Boost brand book szerinti tipográfiát alkalmazza.
 * Használat: <H1>Főcím</H1>, <H2>Alcím</H2>, <Body>Szöveg</Body>
 */

import React from 'react';
import { aiboostTokens } from '@/lib/design-tokens/aiboost-tokens';

interface TypographyProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  color?: string;
}

export function H1({ children, className = '', style = {}, color }: TypographyProps) {
  const baseStyle: React.CSSProperties = {
    fontSize: aiboostTokens.typography.h1.size,
    fontWeight: aiboostTokens.typography.h1.weight,
    lineHeight: aiboostTokens.typography.h1.lineHeight,
    color: color || aiboostTokens.typography.h1.color,
    letterSpacing: aiboostTokens.typography.h1.letterSpacing,
    fontFamily: aiboostTokens.typography.fontFamily.primary,
    margin: 0,
    ...style,
  };

  return (
    <h1 className={className} style={baseStyle}>
      {children}
    </h1>
  );
}

export function H2({ children, className = '', style = {}, color }: TypographyProps) {
  const baseStyle: React.CSSProperties = {
    fontSize: aiboostTokens.typography.h2.size,
    fontWeight: aiboostTokens.typography.h2.weight,
    lineHeight: aiboostTokens.typography.h2.lineHeight,
    color: color || aiboostTokens.typography.h2.color,
    letterSpacing: aiboostTokens.typography.h2.letterSpacing,
    fontFamily: aiboostTokens.typography.fontFamily.primary,
    margin: 0,
    ...style,
  };

  return (
    <h2 className={className} style={baseStyle}>
      {children}
    </h2>
  );
}

export function H3({ children, className = '', style = {}, color }: TypographyProps) {
  const baseStyle: React.CSSProperties = {
    fontSize: aiboostTokens.typography.h3.size,
    fontWeight: aiboostTokens.typography.h3.weight,
    lineHeight: aiboostTokens.typography.h3.lineHeight,
    color: color || aiboostTokens.typography.h3.color,
    letterSpacing: aiboostTokens.typography.h3.letterSpacing,
    fontFamily: aiboostTokens.typography.fontFamily.primary,
    margin: 0,
    ...style,
  };

  return (
    <h3 className={className} style={baseStyle}>
      {children}
    </h3>
  );
}

export function H4({ children, className = '', style = {}, color }: TypographyProps) {
  const baseStyle: React.CSSProperties = {
    fontSize: aiboostTokens.typography.h4.size,
    fontWeight: aiboostTokens.typography.h4.weight,
    lineHeight: aiboostTokens.typography.h4.lineHeight,
    color: color || aiboostTokens.typography.h4.color,
    letterSpacing: aiboostTokens.typography.h4.letterSpacing,
    fontFamily: aiboostTokens.typography.fontFamily.primary,
    margin: 0,
    ...style,
  };

  return (
    <h4 className={className} style={baseStyle}>
      {children}
    </h4>
  );
}

export function H5({ children, className = '', style = {}, color }: TypographyProps) {
  const baseStyle: React.CSSProperties = {
    fontSize: aiboostTokens.typography.h5.size,
    fontWeight: aiboostTokens.typography.h5.weight,
    lineHeight: aiboostTokens.typography.h5.lineHeight,
    color: color || aiboostTokens.typography.h5.color,
    letterSpacing: aiboostTokens.typography.h5.letterSpacing,
    fontFamily: aiboostTokens.typography.fontFamily.primary,
    margin: 0,
    ...style,
  };

  return (
    <h5 className={className} style={baseStyle}>
      {children}
    </h5>
  );
}

export function H6({ children, className = '', style = {}, color }: TypographyProps) {
  const baseStyle: React.CSSProperties = {
    fontSize: aiboostTokens.typography.h6.size,
    fontWeight: aiboostTokens.typography.h6.weight,
    lineHeight: aiboostTokens.typography.h6.lineHeight,
    color: color || aiboostTokens.typography.h6.color,
    letterSpacing: aiboostTokens.typography.h6.letterSpacing,
    fontFamily: aiboostTokens.typography.fontFamily.primary,
    margin: 0,
    ...style,
  };

  return (
    <h6 className={className} style={baseStyle}>
      {children}
    </h6>
  );
}

export function Body({ children, className = '', style = {}, color }: TypographyProps) {
  const baseStyle: React.CSSProperties = {
    fontSize: aiboostTokens.typography.body.size,
    fontWeight: aiboostTokens.typography.body.weight,
    lineHeight: aiboostTokens.typography.body.lineHeight,
    color: color || aiboostTokens.typography.body.color,
    letterSpacing: aiboostTokens.typography.body.letterSpacing,
    fontFamily: aiboostTokens.typography.fontFamily.primary,
    margin: 0,
    ...style,
  };

  return (
    <p className={className} style={baseStyle}>
      {children}
    </p>
  );
}

export function Highlight({ children, className = '', style = {} }: TypographyProps) {
  const baseStyle: React.CSSProperties = {
    fontSize: aiboostTokens.typography.body.size,
    fontWeight: aiboostTokens.typography.body.weight,
    lineHeight: aiboostTokens.typography.body.lineHeight,
    color: aiboostTokens.colors.primary.hex,
    letterSpacing: aiboostTokens.typography.body.letterSpacing,
    fontFamily: aiboostTokens.typography.fontFamily.primary,
    margin: 0,
    ...style,
  };

  return (
    <span className={className} style={baseStyle}>
      {children}
    </span>
  );
}

export function Small({ children, className = '', style = {}, color }: TypographyProps) {
  const baseStyle: React.CSSProperties = {
    fontSize: aiboostTokens.typography.bodySmall.size,
    fontWeight: aiboostTokens.typography.bodySmall.weight,
    lineHeight: aiboostTokens.typography.bodySmall.lineHeight,
    color: color || aiboostTokens.typography.bodySmall.color,
    letterSpacing: aiboostTokens.typography.bodySmall.letterSpacing,
    fontFamily: aiboostTokens.typography.fontFamily.primary,
    margin: 0,
    ...style,
  };

  return (
    <p className={className} style={baseStyle}>
      {children}
    </p>
  );
}
