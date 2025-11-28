/**
 * Brand Typography Components
 *
 * Automatikusan a brand book szerinti stílusokat alkalmazza.
 * Használat: <H1>Cím</H1> - és már jó is a méret, szín, minden!
 */

import React from 'react';
import { boomTokens } from '@/lib/design-tokens/boom-tokens';

interface TypographyProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  color?: string;
}

/**
 * H1 Heading
 * 60px desktop / 36px mobile, Navy blue, Bold
 */
export function H1({ children, className = '', style = {}, color }: TypographyProps) {
  const baseStyle: React.CSSProperties = {
    fontSize: boomTokens.typography.h1.size,
    fontWeight: boomTokens.typography.h1.weight,
    lineHeight: boomTokens.typography.h1.lineHeight,
    color: color || boomTokens.typography.h1.color,
    letterSpacing: boomTokens.typography.h1.letterSpacing,
    fontFamily: boomTokens.typography.fontFamily.primary,
    margin: 0,
    ...style,
  };

  return (
    <h1 className={className} style={baseStyle}>
      {children}
    </h1>
  );
}

/**
 * H2 Heading
 * 42px desktop / 28px mobile, Navy blue, Bold
 */
export function H2({ children, className = '', style = {}, color }: TypographyProps) {
  const baseStyle: React.CSSProperties = {
    fontSize: boomTokens.typography.h2.size,
    fontWeight: boomTokens.typography.h2.weight,
    lineHeight: boomTokens.typography.h2.lineHeight,
    color: color || boomTokens.typography.h2.color,
    letterSpacing: boomTokens.typography.h2.letterSpacing,
    fontFamily: boomTokens.typography.fontFamily.primary,
    margin: 0,
    ...style,
  };

  return (
    <h2 className={className} style={baseStyle}>
      {children}
    </h2>
  );
}

/**
 * H3 Heading
 * 32px desktop / 24px mobile, Navy blue, Bold
 */
export function H3({ children, className = '', style = {}, color }: TypographyProps) {
  const baseStyle: React.CSSProperties = {
    fontSize: boomTokens.typography.h3.size,
    fontWeight: boomTokens.typography.h3.weight,
    lineHeight: boomTokens.typography.h3.lineHeight,
    color: color || boomTokens.typography.h3.color,
    letterSpacing: boomTokens.typography.h3.letterSpacing,
    fontFamily: boomTokens.typography.fontFamily.primary,
    margin: 0,
    ...style,
  };

  return (
    <h3 className={className} style={baseStyle}>
      {children}
    </h3>
  );
}

/**
 * H4 Heading
 * 24px desktop / 20px mobile, Navy blue, Bold
 */
export function H4({ children, className = '', style = {}, color }: TypographyProps) {
  const baseStyle: React.CSSProperties = {
    fontSize: boomTokens.typography.h4.size,
    fontWeight: boomTokens.typography.h4.weight,
    lineHeight: boomTokens.typography.h4.lineHeight,
    color: color || boomTokens.typography.h4.color,
    letterSpacing: boomTokens.typography.h4.letterSpacing,
    fontFamily: boomTokens.typography.fontFamily.primary,
    margin: 0,
    ...style,
  };

  return (
    <h4 className={className} style={baseStyle}>
      {children}
    </h4>
  );
}

/**
 * H5 Heading
 * 20px desktop / 18px mobile, Navy blue, SemiBold
 */
export function H5({ children, className = '', style = {}, color }: TypographyProps) {
  const baseStyle: React.CSSProperties = {
    fontSize: boomTokens.typography.h5.size,
    fontWeight: boomTokens.typography.h5.weight,
    lineHeight: boomTokens.typography.h5.lineHeight,
    color: color || boomTokens.typography.h5.color,
    letterSpacing: boomTokens.typography.h5.letterSpacing,
    fontFamily: boomTokens.typography.fontFamily.primary,
    margin: 0,
    ...style,
  };

  return (
    <h5 className={className} style={baseStyle}>
      {children}
    </h5>
  );
}

/**
 * H6 Heading
 * 18px desktop / 16px mobile, Navy blue, SemiBold
 */
export function H6({ children, className = '', style = {}, color }: TypographyProps) {
  const baseStyle: React.CSSProperties = {
    fontSize: boomTokens.typography.h6.size,
    fontWeight: boomTokens.typography.h6.weight,
    lineHeight: boomTokens.typography.h6.lineHeight,
    color: color || boomTokens.typography.h6.color,
    letterSpacing: boomTokens.typography.h6.letterSpacing,
    fontFamily: boomTokens.typography.fontFamily.primary,
    margin: 0,
    ...style,
  };

  return (
    <h6 className={className} style={baseStyle}>
      {children}
    </h6>
  );
}

interface BodyProps extends TypographyProps {
  size?: 'tiny' | 'small' | 'medium' | 'large';
  bold?: boolean;
}

/**
 * Body Text
 * 18px default (medium), grey color, Regular/SemiBold
 */
export function Body({
  children,
  className = '',
  style = {},
  color,
  size = 'medium',
  bold = false
}: BodyProps) {
  const sizeConfig = boomTokens.typography.body[size];

  const baseStyle: React.CSSProperties = {
    fontSize: sizeConfig.size,
    fontWeight: bold ? boomTokens.typography.bold.weight : sizeConfig.weight,
    lineHeight: sizeConfig.lineHeight,
    color: color || sizeConfig.color,
    fontFamily: boomTokens.typography.fontFamily.primary,
    margin: 0,
    ...style,
  };

  return (
    <p className={className} style={baseStyle}>
      {children}
    </p>
  );
}

/**
 * Inline text kiemelés (span)
 */
export function Highlight({ children, className = '', style = {} }: TypographyProps) {
  const baseStyle: React.CSSProperties = {
    color: boomTokens.colors.primary.hex,
    fontWeight: boomTokens.typography.bold.weight,
    ...style,
  };

  return (
    <span className={className} style={baseStyle}>
      {children}
    </span>
  );
}

/**
 * Small text (disclaimer, caption, stb.)
 */
export function Small({ children, className = '', style = {}, color }: TypographyProps) {
  const baseStyle: React.CSSProperties = {
    fontSize: boomTokens.typography.body.tiny.size,
    fontWeight: boomTokens.typography.body.tiny.weight,
    lineHeight: boomTokens.typography.body.tiny.lineHeight,
    color: color || boomTokens.colors.text.tertiary.hex,
    fontFamily: boomTokens.typography.fontFamily.primary,
    margin: 0,
    ...style,
  };

  return (
    <small className={className} style={baseStyle}>
      {children}
    </small>
  );
}
