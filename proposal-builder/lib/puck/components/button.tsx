'use client';

import React from 'react';
import { ComponentConfig } from '@measured/puck';
import { usePuckTokens } from '../brand-context';
import { createButtonVariantField } from '../custom-fields';

type SizeValue = 'small' | 'medium' | 'large';
type AlignmentValue = 'left' | 'center' | 'right';
type ActionType = 'link' | 'scroll';
type ScrollTarget = 'next' | 'prev' | 'top' | 'bottom' | 'custom';

interface ButtonProps {
  label: string;
  variant: 'primary' | 'secondary' | 'outline' | 'outline-light' | 'ghost' | 'link';
  size: SizeValue;
  fullWidth: boolean;
  icon?: string;
  iconPosition: 'left' | 'right';
  actionType: ActionType;
  href?: string;
  scrollTarget: ScrollTarget;
  customScrollId?: string;
  scrollOffset: number;
  alignment: AlignmentValue;
}

export const ButtonConfig: ComponentConfig<ButtonProps> = {
  label: 'Gomb',

  defaultProps: {
    label: 'Kattints ide',
    variant: 'primary',
    size: 'medium',
    fullWidth: false,
    icon: '',
    iconPosition: 'left',
    actionType: 'link',
    href: '',
    scrollTarget: 'next',
    customScrollId: '',
    scrollOffset: 0,
    alignment: 'left',
  },

  fields: {
    label: {
      type: 'text',
      label: 'Gomb szoveg',
    },
    variant: {
      ...createButtonVariantField([
        { value: 'primary', label: 'Elsodleges', preview: { bg: '#fa604a', color: '#fff' } },
        { value: 'secondary', label: 'Masodlagos', preview: { bg: '#18181b', color: '#fff' } },
        { value: 'outline', label: 'Korvonal', preview: { bg: 'transparent', color: '#18181b', border: '2px solid #18181b' } },
        { value: 'outline-light', label: 'Korvonal (feher)', preview: { bg: '#3e4581', color: '#fff', border: '2px solid #fff' } },
        { value: 'ghost', label: 'Szellem', preview: { bg: '#f3f4f6', color: '#374151' } },
        { value: 'link', label: 'Link', preview: { bg: 'transparent', color: '#3b82f6' } },
      ]) as any,
      label: 'Varians',
    },
    size: {
      type: 'select',
      label: 'Meret',
      options: [
        { value: 'small', label: 'Kicsi' },
        { value: 'medium', label: 'Kozepes' },
        { value: 'large', label: 'Nagy' },
      ],
    },
    fullWidth: {
      type: 'radio',
      label: 'Teljes szelesseg',
      options: [
        { label: 'Nem', value: false },
        { label: 'Igen', value: true },
      ],
    },
    icon: {
      type: 'text',
      label: 'Ikon (emoji)',
    },
    iconPosition: {
      type: 'radio',
      label: 'Ikon pozicio',
      options: [
        { label: 'Bal', value: 'left' },
        { label: 'Jobb', value: 'right' },
      ],
    },
    actionType: {
      type: 'radio',
      label: 'Muvelet tipusa',
      options: [
        { label: 'Link (URL)', value: 'link' },
        { label: 'Gorgetes', value: 'scroll' },
      ],
    },
    href: {
      type: 'text',
      label: 'Link URL',
    },
    scrollTarget: {
      type: 'select',
      label: 'Gorgetes celpontja',
      options: [
        { value: 'next', label: 'Kovetkezo blokk' },
        { value: 'prev', label: 'Elozo blokk' },
        { value: 'top', label: 'Oldal teteje' },
        { value: 'bottom', label: 'Oldal alja' },
        { value: 'custom', label: 'Egyedi elem ID' },
      ],
    },
    customScrollId: {
      type: 'text',
      label: 'Elem ID (# nelkul)',
    },
    scrollOffset: {
      type: 'number',
      label: 'Gorgetes offset (px)',
      min: -200,
      max: 200,
    },
    alignment: {
      type: 'select',
      label: 'Igazitas',
      options: [
        { label: 'Balra', value: 'left' },
        { label: 'Kozepre', value: 'center' },
        { label: 'Jobbra', value: 'right' },
      ],
    },
  },

  render: ({
    label = '',
    variant = 'primary',
    size = 'medium',
    fullWidth = false,
    icon,
    iconPosition = 'left',
    actionType = 'link',
    href,
    scrollTarget = 'next',
    customScrollId = '',
    scrollOffset = 0,
    alignment = 'left',
  }) => {
    const tokens = usePuckTokens();

    // Handle scroll action
    const handleScroll = (e: React.MouseEvent) => {
      e.preventDefault();

      let targetElement: Element | null = null;

      switch (scrollTarget) {
        case 'next': {
          // Find the parent Puck component container and get the next sibling
          const button = e.currentTarget as HTMLElement;
          const puckComponent = button.closest('[data-puck-component]');
          if (puckComponent) {
            targetElement = puckComponent.nextElementSibling;
          }
          break;
        }
        case 'prev': {
          const button = e.currentTarget as HTMLElement;
          const puckComponent = button.closest('[data-puck-component]');
          if (puckComponent) {
            targetElement = puckComponent.previousElementSibling;
          }
          break;
        }
        case 'top':
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        case 'bottom':
          window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
          return;
        case 'custom':
          if (customScrollId) {
            targetElement = document.getElementById(customScrollId);
          }
          break;
      }

      if (targetElement) {
        const rect = targetElement.getBoundingClientRect();
        const absoluteTop = window.pageYOffset + rect.top + scrollOffset;
        window.scrollTo({ top: absoluteTop, behavior: 'smooth' });
      }
    };

    // Use brand-specific button styles
    const getVariantStyles = () => {
      switch (variant) {
        case 'primary':
          return {
            backgroundColor: tokens.button.primary.background,
            color: tokens.button.primary.color,
            border: 'none',
            boxShadow: tokens.button.primary.shadow,
            borderRadius: tokens.button.primary.borderRadius,
          };
        case 'secondary':
          return {
            backgroundColor: tokens.button.secondary.background,
            color: tokens.button.secondary.color,
            border: 'none',
            boxShadow: tokens.button.secondary.shadow,
            borderRadius: tokens.button.secondary.borderRadius,
          };
        case 'outline':
          return {
            backgroundColor: tokens.button.outline.background,
            color: tokens.button.outline.color,
            border: tokens.button.outline.border,
            boxShadow: 'none',
            borderRadius: tokens.button.outline.borderRadius,
          };
        case 'outline-light':
          return {
            backgroundColor: tokens.button.outlineLight.background,
            color: tokens.button.outlineLight.color,
            border: tokens.button.outlineLight.border,
            boxShadow: 'none',
            borderRadius: tokens.button.outlineLight.borderRadius,
          };
        case 'ghost':
          return {
            backgroundColor: 'transparent',
            color: tokens.colors.text,
            border: 'none',
            boxShadow: 'none',
            borderRadius: tokens.borderRadius.md,
          };
        case 'link':
          return {
            backgroundColor: 'transparent',
            color: tokens.colors.primary,
            border: 'none',
            boxShadow: 'none',
            borderRadius: '0',
            textDecoration: 'underline',
          };
        default:
          return {};
      }
    };

    const sizeStyles = {
      small: {
        padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
        fontSize: tokens.typography.bodySmall.size,
      },
      medium: {
        padding: `${tokens.spacing.sm} ${tokens.spacing.lg}`,
        fontSize: tokens.typography.body.size,
      },
      large: {
        padding: `${tokens.spacing.md} ${tokens.spacing.xl}`,
        fontSize: tokens.typography.h5.size,
      },
    };

    const alignmentMap = {
      left: 'flex-start',
      center: 'center',
      right: 'flex-end',
    };

    const variantStyles = getVariantStyles();

    const buttonStyles: React.CSSProperties = {
      ...variantStyles,
      ...sizeStyles[size],
      fontWeight: 600,
      fontFamily: tokens.fonts.body,
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: icon ? '8px' : '0',
      textDecoration: variant === 'link' ? 'underline' : 'none',
      textAlign: 'center',
      transition: 'all 0.3s ease',
      width: fullWidth ? '100%' : 'auto',
      whiteSpace: 'nowrap',
    };

    const content = (
      <>
        {icon && iconPosition === 'left' && <span>{icon}</span>}
        <span>{label}</span>
        {icon && iconPosition === 'right' && <span>{icon}</span>}
      </>
    );

    let buttonElement: React.ReactNode;

    if (actionType === 'scroll') {
      // Scroll action - use button with onClick
      buttonElement = (
        <button style={buttonStyles} onClick={handleScroll} type="button">
          {content}
        </button>
      );
    } else if (href) {
      // Link action with URL
      buttonElement = (
        <a href={href} style={buttonStyles}>
          {content}
        </a>
      );
    } else {
      // No action - plain button
      buttonElement = <button style={buttonStyles}>{content}</button>;
    }

    // Wrap in alignment container if not full width
    if (!fullWidth) {
      return (
        <div style={{ display: 'flex', justifyContent: alignmentMap[alignment] }}>
          {buttonElement}
        </div>
      );
    }

    return buttonElement;
  },
};
