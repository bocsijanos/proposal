'use client';

import React from 'react';
import { CustomField } from '@measured/puck';

// ============================================
// COLOR PICKER FIELD - Vizuális szín választó
// ============================================

interface ColorOption {
  label: string;
  value: string;
  color: string; // Tényleges CSS szín
}

interface ColorFieldProps {
  options: ColorOption[];
}

export function createColorField(options: ColorOption[]): CustomField<string> {
  return {
    type: 'custom',
    render: ({ value, onChange, field }) => {
      return (
        <div>
          <label
            style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: 500,
              color: '#374151',
            }}
          >
            {field.label}
          </label>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => onChange(option.value)}
                title={option.label}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  border: value === option.value ? '3px solid #3b82f6' : '2px solid #e5e7eb',
                  background: option.color,
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all 0.15s ease',
                  boxShadow: value === option.value ? '0 0 0 2px white, 0 0 0 4px #3b82f6' : 'none',
                }}
              >
                {value === option.value && (
                  <span
                    style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: isLightColor(option.color) ? '#000' : '#fff',
                      fontWeight: 'bold',
                      fontSize: '16px',
                    }}
                  >
                    ✓
                  </span>
                )}
              </button>
            ))}
          </div>
          <div
            style={{
              marginTop: '6px',
              fontSize: '12px',
              color: '#6b7280',
            }}
          >
            {options.find((o) => o.value === value)?.label || 'Válassz színt'}
          </div>
        </div>
      );
    },
  };
}

// ============================================
// SIZE PICKER FIELD - Vizuális méret választó
// ============================================

interface SizeOption {
  label: string;
  value: string;
  icon: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export function createSizeField(options: SizeOption[]): CustomField<string> {
  const sizeIcons: Record<string, React.ReactNode> = {
    xs: (
      <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
        <div style={{ width: '4px', height: '8px', background: 'currentColor', borderRadius: '1px' }} />
      </div>
    ),
    sm: (
      <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
        <div style={{ width: '6px', height: '12px', background: 'currentColor', borderRadius: '2px' }} />
      </div>
    ),
    md: (
      <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
        <div style={{ width: '8px', height: '16px', background: 'currentColor', borderRadius: '2px' }} />
      </div>
    ),
    lg: (
      <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
        <div style={{ width: '10px', height: '20px', background: 'currentColor', borderRadius: '3px' }} />
      </div>
    ),
    xl: (
      <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
        <div style={{ width: '12px', height: '24px', background: 'currentColor', borderRadius: '3px' }} />
      </div>
    ),
    '2xl': (
      <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
        <div style={{ width: '14px', height: '28px', background: 'currentColor', borderRadius: '4px' }} />
      </div>
    ),
  };

  return {
    type: 'custom',
    render: ({ value, onChange, field }) => {
      return (
        <div>
          <label
            style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: 500,
              color: '#374151',
            }}
          >
            {field.label}
          </label>
          <div
            style={{
              display: 'flex',
              gap: '4px',
              background: '#f3f4f6',
              padding: '4px',
              borderRadius: '8px',
            }}
          >
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => onChange(option.value)}
                title={option.label}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  padding: '8px 4px',
                  borderRadius: '6px',
                  border: 'none',
                  background: value === option.value ? '#fff' : 'transparent',
                  color: value === option.value ? '#3b82f6' : '#6b7280',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: value === option.value ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                }}
              >
                {sizeIcons[option.icon]}
                <span style={{ fontSize: '10px', fontWeight: 500 }}>{option.label}</span>
              </button>
            ))}
          </div>
        </div>
      );
    },
  };
}

// ============================================
// ALIGNMENT PICKER FIELD - Vizuális igazítás
// ============================================

type AlignmentValue = 'left' | 'center' | 'right';

export function createAlignmentField(): CustomField<AlignmentValue> {
  const alignmentOptions: { value: AlignmentValue; icon: React.ReactNode; label: string }[] = [
    {
      value: 'left',
      label: 'Balra',
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <rect x="2" y="4" width="12" height="2" rx="1" fill="currentColor" />
          <rect x="2" y="9" width="16" height="2" rx="1" fill="currentColor" />
          <rect x="2" y="14" width="10" height="2" rx="1" fill="currentColor" />
        </svg>
      ),
    },
    {
      value: 'center',
      label: 'Középre',
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <rect x="4" y="4" width="12" height="2" rx="1" fill="currentColor" />
          <rect x="2" y="9" width="16" height="2" rx="1" fill="currentColor" />
          <rect x="5" y="14" width="10" height="2" rx="1" fill="currentColor" />
        </svg>
      ),
    },
    {
      value: 'right',
      label: 'Jobbra',
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <rect x="6" y="4" width="12" height="2" rx="1" fill="currentColor" />
          <rect x="2" y="9" width="16" height="2" rx="1" fill="currentColor" />
          <rect x="8" y="14" width="10" height="2" rx="1" fill="currentColor" />
        </svg>
      ),
    },
  ];

  return {
    type: 'custom',
    render: ({ value, onChange, field }) => {
      return (
        <div>
          <label
            style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: 500,
              color: '#374151',
            }}
          >
            {field.label}
          </label>
          <div
            style={{
              display: 'flex',
              gap: '4px',
              background: '#f3f4f6',
              padding: '4px',
              borderRadius: '8px',
            }}
          >
            {alignmentOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => onChange(option.value)}
                title={option.label}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '8px',
                  borderRadius: '6px',
                  border: 'none',
                  background: value === option.value ? '#fff' : 'transparent',
                  color: value === option.value ? '#3b82f6' : '#6b7280',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: value === option.value ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                }}
              >
                {option.icon}
              </button>
            ))}
          </div>
        </div>
      );
    },
  };
}

// ============================================
// BUTTON VARIANT FIELD - Gomb variáns vizuális
// ============================================

interface ButtonVariantOption {
  value: string;
  label: string;
  preview: {
    bg: string;
    color: string;
    border?: string;
  };
}

export function createButtonVariantField(options: ButtonVariantOption[]): CustomField<string> {
  return {
    type: 'custom',
    render: ({ value, onChange, field }) => {
      return (
        <div>
          <label
            style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: 500,
              color: '#374151',
            }}
          >
            {field.label}
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => onChange(option.value)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: value === option.value ? '2px solid #3b82f6' : '2px solid #e5e7eb',
                  background: value === option.value ? '#eff6ff' : '#fff',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {/* Mini button preview */}
                <span
                  style={{
                    padding: '4px 12px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 600,
                    background: option.preview.bg,
                    color: option.preview.color,
                    border: option.preview.border || 'none',
                  }}
                >
                  Gomb
                </span>
                <span
                  style={{
                    fontSize: '13px',
                    color: value === option.value ? '#1d4ed8' : '#374151',
                    fontWeight: value === option.value ? 600 : 400,
                  }}
                >
                  {option.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      );
    },
  };
}

// ============================================
// SPACING FIELD - Térköz vizuális választó
// ============================================

interface SpacingOption {
  value: string;
  label: string;
  pixels: number;
}

export function createSpacingField(options: SpacingOption[]): CustomField<string> {
  return {
    type: 'custom',
    render: ({ value, onChange, field }) => {
      return (
        <div>
          <label
            style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: 500,
              color: '#374151',
            }}
          >
            {field.label}
          </label>
          <div
            style={{
              display: 'flex',
              gap: '4px',
              background: '#f3f4f6',
              padding: '4px',
              borderRadius: '8px',
            }}
          >
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => onChange(option.value)}
                title={`${option.label} (${option.pixels}px)`}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  padding: '8px 4px',
                  paddingTop: '4px',
                  borderRadius: '6px',
                  border: 'none',
                  background: value === option.value ? '#fff' : 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: value === option.value ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  minHeight: '50px',
                }}
              >
                {/* Visual spacing indicator */}
                <div
                  style={{
                    width: '100%',
                    maxWidth: '24px',
                    height: `${Math.min(option.pixels / 3, 24)}px`,
                    background: value === option.value ? '#3b82f6' : '#9ca3af',
                    borderRadius: '2px',
                    marginBottom: '4px',
                  }}
                />
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 500,
                    color: value === option.value ? '#3b82f6' : '#6b7280',
                  }}
                >
                  {option.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      );
    },
  };
}

// ============================================
// BORDER RADIUS FIELD - Lekerekítés vizuális
// ============================================

interface RadiusOption {
  value: string;
  label: string;
  radius: string;
}

export function createRadiusField(options: RadiusOption[]): CustomField<string> {
  return {
    type: 'custom',
    render: ({ value, onChange, field }) => {
      return (
        <div>
          <label
            style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: 500,
              color: '#374151',
            }}
          >
            {field.label}
          </label>
          <div
            style={{
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap',
            }}
          >
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => onChange(option.value)}
                title={option.label}
                style={{
                  width: '48px',
                  height: '48px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  padding: '4px',
                  borderRadius: '8px',
                  border: value === option.value ? '2px solid #3b82f6' : '2px solid #e5e7eb',
                  background: value === option.value ? '#eff6ff' : '#fff',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {/* Visual radius preview */}
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    background: value === option.value ? '#3b82f6' : '#9ca3af',
                    borderRadius: option.radius,
                  }}
                />
                <span
                  style={{
                    fontSize: '9px',
                    fontWeight: 500,
                    color: value === option.value ? '#3b82f6' : '#6b7280',
                  }}
                >
                  {option.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      );
    },
  };
}

// ============================================
// SHADOW FIELD - Árnyék vizuális választó
// ============================================

interface ShadowOption {
  value: string;
  label: string;
  shadow: string;
}

export function createShadowField(options: ShadowOption[]): CustomField<string> {
  return {
    type: 'custom',
    render: ({ value, onChange, field }) => {
      return (
        <div>
          <label
            style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: 500,
              color: '#374151',
            }}
          >
            {field.label}
          </label>
          <div
            style={{
              display: 'flex',
              gap: '12px',
              flexWrap: 'wrap',
            }}
          >
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => onChange(option.value)}
                title={option.label}
                style={{
                  width: '64px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px',
                  borderRadius: '8px',
                  border: value === option.value ? '2px solid #3b82f6' : '2px solid transparent',
                  background: 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {/* Visual shadow preview */}
                <div
                  style={{
                    width: '40px',
                    height: '28px',
                    background: '#fff',
                    borderRadius: '6px',
                    boxShadow: option.shadow,
                    border: '1px solid #e5e7eb',
                  }}
                />
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 500,
                    color: value === option.value ? '#3b82f6' : '#6b7280',
                  }}
                >
                  {option.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      );
    },
  };
}

// ============================================
// Helper functions
// ============================================

function isLightColor(color: string): boolean {
  // Simple check for light colors
  if (color.startsWith('#')) {
    const hex = color.slice(1);
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 155;
  }
  if (color.includes('gradient')) return false;
  if (color === 'transparent' || color === 'white' || color === '#fff' || color === '#ffffff') return true;
  return false;
}

// ============================================
// Pre-configured field factories
// ============================================

// Standard color options based on brand tokens
export const brandColorField = createColorField([
  { label: 'Elsődleges', value: 'primary', color: '#fa604a' },
  { label: 'Másodlagos', value: 'secondary', color: '#18181b' },
  { label: 'Szöveg', value: 'text', color: '#374151' },
  { label: 'Halvány', value: 'muted', color: '#9ca3af' },
]);

// Standard spacing options
export const spacingField = createSpacingField([
  { value: 'xs', label: 'XS', pixels: 8 },
  { value: 'sm', label: 'SM', pixels: 16 },
  { value: 'md', label: 'MD', pixels: 24 },
  { value: 'lg', label: 'LG', pixels: 32 },
  { value: 'xl', label: 'XL', pixels: 48 },
  { value: '2xl', label: '2XL', pixels: 64 },
]);

// Standard size field
export const sizeField = createSizeField([
  { value: 'small', label: 'Kicsi', icon: 'sm' },
  { value: 'medium', label: 'Közepes', icon: 'md' },
  { value: 'large', label: 'Nagy', icon: 'lg' },
]);

// Standard alignment field
export const alignmentField = createAlignmentField();

// Standard radius field
export const radiusField = createRadiusField([
  { value: 'none', label: 'Nincs', radius: '0' },
  { value: 'sm', label: 'Kicsi', radius: '4px' },
  { value: 'md', label: 'Közepes', radius: '8px' },
  { value: 'lg', label: 'Nagy', radius: '12px' },
  { value: 'xl', label: 'XL', radius: '16px' },
  { value: 'full', label: 'Kör', radius: '9999px' },
]);

// Standard shadow field
export const shadowField = createShadowField([
  { value: 'none', label: 'Nincs', shadow: 'none' },
  { value: 'subtle', label: 'Finom', shadow: '0 1px 2px rgba(0,0,0,0.05)' },
  { value: 'medium', label: 'Közepes', shadow: '0 4px 6px rgba(0,0,0,0.1)' },
  { value: 'large', label: 'Nagy', shadow: '0 10px 25px rgba(0,0,0,0.15)' },
]);

// Button variant field with visual previews
export const buttonVariantField = createButtonVariantField([
  { value: 'primary', label: 'Elsődleges', preview: { bg: '#fa604a', color: '#fff' } },
  { value: 'secondary', label: 'Másodlagos', preview: { bg: '#18181b', color: '#fff' } },
  { value: 'outline', label: 'Körvonal', preview: { bg: 'transparent', color: '#18181b', border: '2px solid #18181b' } },
  { value: 'ghost', label: 'Szellem', preview: { bg: '#f3f4f6', color: '#374151' } },
  { value: 'link', label: 'Link', preview: { bg: 'transparent', color: '#3b82f6' } },
]);

// ============================================
// SECTION VARIANT FIELD - Szekció variáns
// ============================================

interface SectionVariantOption {
  value: string;
  label: string;
  preview: {
    bg: string;
    color: string;
  };
}

export function createSectionVariantField(options: SectionVariantOption[]): CustomField<string> {
  return {
    type: 'custom',
    render: ({ value, onChange, field }) => {
      return (
        <div>
          <label
            style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: 500,
              color: '#374151',
            }}
          >
            {field.label}
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => onChange(option.value)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: value === option.value ? '2px solid #3b82f6' : '2px solid #e5e7eb',
                  background: value === option.value ? '#eff6ff' : '#fff',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {/* Mini section preview */}
                <div
                  style={{
                    width: '48px',
                    height: '32px',
                    borderRadius: '4px',
                    background: option.preview.bg,
                    border: option.preview.bg === '#ffffff' ? '1px solid #e5e7eb' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      width: '20px',
                      height: '2px',
                      background: option.preview.color,
                      borderRadius: '1px',
                    }}
                  />
                </div>
                <span
                  style={{
                    fontSize: '13px',
                    color: value === option.value ? '#1d4ed8' : '#374151',
                    fontWeight: value === option.value ? 600 : 400,
                  }}
                >
                  {option.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      );
    },
  };
}

// Standard section variant options
export const sectionVariantField = createSectionVariantField([
  { value: 'default', label: 'Fehér', preview: { bg: '#ffffff', color: '#374151' } },
  { value: 'hero', label: 'Hero (Gradiens)', preview: { bg: 'linear-gradient(135deg, #fa604a 0%, #18181b 100%)', color: '#ffffff' } },
  { value: 'alternate', label: 'Világos szürke', preview: { bg: '#f8fafc', color: '#374151' } },
  { value: 'dark', label: 'Sötét', preview: { bg: '#18181b', color: '#ffffff' } },
]);

// ============================================
// IMAGE PICKER FIELD - Kép feltöltés/választás
// ============================================

interface UploadedImageData {
  id: string;
  url: string;
  originalName: string;
  createdAt: string;
}

export function createImagePickerField(): CustomField<string> {
  return {
    type: 'custom',
    render: ({ value, onChange, field }) => {
      const [isOpen, setIsOpen] = React.useState(false);
      const [images, setImages] = React.useState<UploadedImageData[]>([]);
      const [isLoading, setIsLoading] = React.useState(false);
      const [isUploading, setIsUploading] = React.useState(false);
      const [error, setError] = React.useState<string | null>(null);
      const fileInputRef = React.useRef<HTMLInputElement>(null);

      // Load images when modal opens
      const loadImages = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const res = await fetch('/api/upload', {
            credentials: 'include',
          });
          if (!res.ok) throw new Error('Failed to load images');
          const data = await res.json();
          setImages(data.images || []);
        } catch (err) {
          setError('Nem sikerült betölteni a képeket');
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      };

      // Handle file upload
      const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setError(null);

        try {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('folder', 'images');

          const res = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
            credentials: 'include',
          });

          if (!res.ok) {
            const data = await res.json();
            throw new Error(data.error || 'Upload failed');
          }

          const data = await res.json();
          onChange(data.url);
          setIsOpen(false);

          // Refresh image list
          await loadImages();
        } catch (err: any) {
          setError(err.message || 'Feltöltési hiba');
        } finally {
          setIsUploading(false);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }
      };

      // Handle image selection
      const handleSelect = (url: string) => {
        onChange(url);
        setIsOpen(false);
      };

      // Handle delete
      const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm('Biztosan törölni szeretnéd ezt a képet?')) return;

        try {
          const res = await fetch(`/api/upload?id=${id}`, {
            method: 'DELETE',
          });

          if (!res.ok) throw new Error('Delete failed');

          // Refresh image list
          await loadImages();

          // If the deleted image was selected, clear value
          const deletedImage = images.find(img => img.id === id);
          if (deletedImage && value === deletedImage.url) {
            onChange('');
          }
        } catch (err) {
          setError('Törlés sikertelen');
        }
      };

      return (
        <div>
          <label
            style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: 500,
              color: '#374151',
            }}
          >
            {field.label}
          </label>

          {/* Current image preview or placeholder */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            {value ? (
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '120px',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  border: '1px solid #e5e7eb',
                }}
              >
                <img
                  src={value}
                  alt="Selected"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </div>
            ) : (
              <div
                style={{
                  width: '100%',
                  height: '80px',
                  borderRadius: '8px',
                  border: '2px dashed #d1d5db',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#9ca3af',
                  fontSize: '13px',
                }}
              >
                Nincs kép kiválasztva
              </div>
            )}

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(true);
                  loadImages();
                }}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid #e5e7eb',
                  background: '#fff',
                  color: '#374151',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21,15 16,10 5,21"/>
                </svg>
                Galéria
              </button>

              {value && (
                <button
                  type="button"
                  onClick={() => onChange('')}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #fecaca',
                    background: '#fef2f2',
                    color: '#dc2626',
                    fontSize: '13px',
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  Törlés
                </button>
              )}
            </div>

            {/* URL input for manual entry */}
            <input
              type="text"
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder="vagy adj meg URL-t..."
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #e5e7eb',
                fontSize: '12px',
                color: '#6b7280',
              }}
            />
          </div>

          {/* Image picker modal */}
          {isOpen && (
            <div
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 9999,
              }}
              onClick={() => setIsOpen(false)}
            >
              <div
                style={{
                  background: '#fff',
                  borderRadius: '12px',
                  width: '90%',
                  maxWidth: '600px',
                  maxHeight: '80vh',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal header */}
                <div
                  style={{
                    padding: '16px 20px',
                    borderBottom: '1px solid #e5e7eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>
                    Kép választása
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '4px',
                      color: '#6b7280',
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 6L6 18M6 6l12 12"/>
                    </svg>
                  </button>
                </div>

                {/* Upload section */}
                <div
                  style={{
                    padding: '16px 20px',
                    borderBottom: '1px solid #e5e7eb',
                    background: '#f9fafb',
                  }}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    onChange={handleUpload}
                    style={{ display: 'none' }}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '2px dashed #d1d5db',
                      background: '#fff',
                      color: '#374151',
                      fontSize: '14px',
                      fontWeight: 500,
                      cursor: isUploading ? 'wait' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                    }}
                  >
                    {isUploading ? (
                      <>
                        <div
                          style={{
                            width: '16px',
                            height: '16px',
                            border: '2px solid #e5e7eb',
                            borderTopColor: '#3b82f6',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite',
                          }}
                        />
                        Feltöltés...
                      </>
                    ) : (
                      <>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
                        </svg>
                        Új kép feltöltése
                      </>
                    )}
                  </button>
                </div>

                {/* Error message */}
                {error && (
                  <div
                    style={{
                      padding: '12px 20px',
                      background: '#fef2f2',
                      color: '#dc2626',
                      fontSize: '13px',
                    }}
                  >
                    {error}
                  </div>
                )}

                {/* Image grid */}
                <div
                  style={{
                    padding: '16px 20px',
                    overflowY: 'auto',
                    flex: 1,
                  }}
                >
                  {isLoading ? (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '40px',
                        color: '#9ca3af',
                      }}
                    >
                      Betöltés...
                    </div>
                  ) : images.length === 0 ? (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '40px',
                        color: '#9ca3af',
                        fontSize: '14px',
                      }}
                    >
                      Még nincs feltöltött kép
                    </div>
                  ) : (
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '12px',
                      }}
                    >
                      {images.map((image) => (
                        <div
                          key={image.id}
                          onClick={() => handleSelect(image.url)}
                          style={{
                            position: 'relative',
                            aspectRatio: '1',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            cursor: 'pointer',
                            border: value === image.url ? '3px solid #3b82f6' : '1px solid #e5e7eb',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          <img
                            src={image.url}
                            alt={image.originalName}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                            }}
                          />
                          {/* Delete button */}
                          <button
                            type="button"
                            onClick={(e) => handleDelete(image.id, e)}
                            style={{
                              position: 'absolute',
                              top: '4px',
                              right: '4px',
                              width: '24px',
                              height: '24px',
                              borderRadius: '50%',
                              border: 'none',
                              background: 'rgba(239, 68, 68, 0.9)',
                              color: '#fff',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              opacity: 0.8,
                              transition: 'opacity 0.15s',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                            onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.8')}
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M18 6L6 18M6 6l12 12"/>
                            </svg>
                          </button>
                          {/* Selection indicator */}
                          {value === image.url && (
                            <div
                              style={{
                                position: 'absolute',
                                bottom: '4px',
                                left: '4px',
                                width: '24px',
                                height: '24px',
                                borderRadius: '50%',
                                background: '#3b82f6',
                                color: '#fff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                <path d="M20 6L9 17l-5-5"/>
                              </svg>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* CSS for spinner animation */}
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      );
    },
  };
}

// Pre-configured image picker field
export const imagePickerField = createImagePickerField();

