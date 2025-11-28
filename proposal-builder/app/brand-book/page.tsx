'use client';

import { useState } from 'react';
import { getSimplifiedTokens, BrandTokens } from '@/lib/puck/brand-context';
import { Brand } from '@/components/providers/ThemeProvider';

// Color swatch component
function ColorSwatch({ name, value, textColor = 'white' }: { name: string; value: string; textColor?: string }) {
  return (
    <div className="flex flex-col">
      <div
        className="h-20 rounded-lg shadow-md flex items-end p-2 transition-transform hover:scale-105"
        style={{ backgroundColor: value }}
      >
        <span className="text-xs font-mono" style={{ color: textColor }}>{value}</span>
      </div>
      <span className="text-sm font-medium mt-2 text-gray-700">{name}</span>
    </div>
  );
}

// Typography preview component
function TypographyPreview({
  name,
  size,
  weight,
  lineHeight,
  mobileSize,
  fontFamily
}: {
  name: string;
  size: string;
  weight: number;
  lineHeight: number;
  mobileSize?: string;
  fontFamily: string;
}) {
  return (
    <div className="border rounded-lg p-4 bg-white">
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs font-mono text-gray-500">{name}</span>
        <span className="text-xs text-gray-400">
          {size} / {weight} / {lineHeight}
          {mobileSize && <span className="ml-2 text-blue-500">(mobile: {mobileSize})</span>}
        </span>
      </div>
      <p style={{ fontSize: size, fontWeight: weight, lineHeight, fontFamily }}>
        Minta szoveg / Sample Text
      </p>
    </div>
  );
}

// Spacing preview component
function SpacingPreview({ name, value }: { name: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-16 text-right">
        <span className="text-sm font-mono text-gray-600">{name}</span>
      </div>
      <div
        className="bg-blue-500 rounded"
        style={{ width: value, height: '24px' }}
      />
      <span className="text-xs text-gray-500">{value}</span>
    </div>
  );
}

// Border radius preview component
function RadiusPreview({ name, value }: { name: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500"
        style={{ borderRadius: value }}
      />
      <span className="text-xs font-mono text-gray-600">{name}</span>
      <span className="text-xs text-gray-400">{value}</span>
    </div>
  );
}

// Shadow preview component
function ShadowPreview({ name, value }: { name: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="w-20 h-20 bg-white rounded-lg"
        style={{ boxShadow: value }}
      />
      <span className="text-xs font-mono text-gray-600">{name}</span>
    </div>
  );
}

// Button preview component
function ButtonPreview({
  name,
  background,
  color,
  borderRadius,
  shadow,
  border
}: {
  name: string;
  background: string;
  color: string;
  borderRadius: string;
  shadow?: string;
  border?: string;
}) {
  return (
    <button
      className="px-6 py-3 font-semibold transition-transform hover:scale-105"
      style={{
        background,
        color,
        borderRadius,
        boxShadow: shadow || 'none',
        border: border || 'none'
      }}
    >
      {name} gomb
    </button>
  );
}

// Section component
function Section({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <section className="bg-white rounded-2xl shadow-lg p-8 mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
        <span className="text-3xl">{icon}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function BrandBookPage() {
  const [activeBrand, setActiveBrand] = useState<Brand>('BOOM');
  const tokens = getSimplifiedTokens(activeBrand);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Design Token System</h1>
              <p className="text-gray-600 mt-1">Puck komponensek design tokenjei</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setActiveBrand('BOOM')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  activeBrand === 'BOOM'
                    ? 'text-white shadow-lg scale-105'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                style={activeBrand === 'BOOM' ? { backgroundColor: tokens.colors.primary } : {}}
              >
                BOOM Marketing
              </button>
              <button
                onClick={() => setActiveBrand('AIBOOST')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  activeBrand === 'AIBOOST'
                    ? 'text-white shadow-lg scale-105'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                style={activeBrand === 'AIBOOST' ? { backgroundColor: getSimplifiedTokens('AIBOOST').colors.primary } : {}}
              >
                AI Boost
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Colors Section */}
        <Section title="Szinek (colors)" icon="🎨">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <ColorSwatch name="primary" value={tokens.colors.primary} />
            <ColorSwatch name="secondary" value={tokens.colors.secondary} />
            {tokens.colors.accent && <ColorSwatch name="accent" value={tokens.colors.accent} />}
            <ColorSwatch name="background" value={tokens.colors.background} textColor="#333" />
            <ColorSwatch name="backgroundAlt" value={tokens.colors.backgroundAlt} textColor="#333" />
            <ColorSwatch name="backgroundDark" value={tokens.colors.backgroundDark} />
            <ColorSwatch name="text" value={tokens.colors.text} />
            <ColorSwatch name="textLight" value={tokens.colors.textLight} textColor="#333" />
            <ColorSwatch name="muted" value={tokens.colors.muted} />
            <ColorSwatch name="border" value={tokens.colors.border} textColor="#333" />
            <ColorSwatch name="success" value={tokens.colors.success} />
            <ColorSwatch name="warning" value={tokens.colors.warning} textColor="#333" />
            <ColorSwatch name="error" value={tokens.colors.error} />
          </div>
        </Section>

        {/* Typography Section */}
        <Section title="Tipografia (typography)" icon="📝">
          <p className="text-gray-600 mb-4">
            Font: <code className="bg-gray-100 px-2 py-1 rounded">{tokens.fonts.heading}</code>
          </p>
          <div className="space-y-4">
            <TypographyPreview
              name="h1"
              size={tokens.typography.h1.size}
              weight={tokens.typography.h1.weight}
              lineHeight={tokens.typography.h1.lineHeight}
              mobileSize={tokens.typography.h1.mobileSize}
              fontFamily={tokens.fonts.heading}
            />
            <TypographyPreview
              name="h2"
              size={tokens.typography.h2.size}
              weight={tokens.typography.h2.weight}
              lineHeight={tokens.typography.h2.lineHeight}
              mobileSize={tokens.typography.h2.mobileSize}
              fontFamily={tokens.fonts.heading}
            />
            <TypographyPreview
              name="h3"
              size={tokens.typography.h3.size}
              weight={tokens.typography.h3.weight}
              lineHeight={tokens.typography.h3.lineHeight}
              mobileSize={tokens.typography.h3.mobileSize}
              fontFamily={tokens.fonts.heading}
            />
            <TypographyPreview
              name="h4"
              size={tokens.typography.h4.size}
              weight={tokens.typography.h4.weight}
              lineHeight={tokens.typography.h4.lineHeight}
              mobileSize={tokens.typography.h4.mobileSize}
              fontFamily={tokens.fonts.heading}
            />
            <TypographyPreview
              name="h5"
              size={tokens.typography.h5.size}
              weight={tokens.typography.h5.weight}
              lineHeight={tokens.typography.h5.lineHeight}
              mobileSize={tokens.typography.h5.mobileSize}
              fontFamily={tokens.fonts.heading}
            />
            <TypographyPreview
              name="h6"
              size={tokens.typography.h6.size}
              weight={tokens.typography.h6.weight}
              lineHeight={tokens.typography.h6.lineHeight}
              mobileSize={tokens.typography.h6.mobileSize}
              fontFamily={tokens.fonts.heading}
            />
            <div className="border-t pt-4 mt-4">
              <h4 className="text-sm font-semibold text-gray-500 mb-3">Body szovegek</h4>
              <div className="space-y-4">
                <TypographyPreview
                  name="bodyLarge"
                  size={tokens.typography.bodyLarge.size}
                  weight={tokens.typography.bodyLarge.weight}
                  lineHeight={tokens.typography.bodyLarge.lineHeight}
                  fontFamily={tokens.fonts.body}
                />
                <TypographyPreview
                  name="body"
                  size={tokens.typography.body.size}
                  weight={tokens.typography.body.weight}
                  lineHeight={tokens.typography.body.lineHeight}
                  fontFamily={tokens.fonts.body}
                />
                <TypographyPreview
                  name="bodySmall"
                  size={tokens.typography.bodySmall.size}
                  weight={tokens.typography.bodySmall.weight}
                  lineHeight={tokens.typography.bodySmall.lineHeight}
                  fontFamily={tokens.fonts.body}
                />
                <TypographyPreview
                  name="caption"
                  size={tokens.typography.caption.size}
                  weight={tokens.typography.caption.weight}
                  lineHeight={tokens.typography.caption.lineHeight}
                  fontFamily={tokens.fonts.body}
                />
                <TypographyPreview
                  name="label"
                  size={tokens.typography.label.size}
                  weight={tokens.typography.label.weight}
                  lineHeight={tokens.typography.label.lineHeight}
                  fontFamily={tokens.fonts.body}
                />
              </div>
            </div>
          </div>
        </Section>

        {/* Spacing Section */}
        <Section title="Terkozok (spacing)" icon="📏">
          <div className="space-y-3">
            <SpacingPreview name="xs" value={tokens.spacing.xs} />
            <SpacingPreview name="sm" value={tokens.spacing.sm} />
            <SpacingPreview name="md" value={tokens.spacing.md} />
            <SpacingPreview name="lg" value={tokens.spacing.lg} />
            <SpacingPreview name="xl" value={tokens.spacing.xl} />
            <SpacingPreview name="2xl" value={tokens.spacing['2xl']} />
            <SpacingPreview name="3xl" value={tokens.spacing['3xl']} />
            <SpacingPreview name="4xl" value={tokens.spacing['4xl']} />
          </div>
        </Section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Border Radius Section */}
          <Section title="Lekerekites (borderRadius)" icon="⭕">
            <div className="flex flex-wrap gap-6">
              <RadiusPreview name="sm" value={tokens.borderRadius.sm} />
              <RadiusPreview name="md" value={tokens.borderRadius.md} />
              <RadiusPreview name="lg" value={tokens.borderRadius.lg} />
              <RadiusPreview name="xl" value={tokens.borderRadius.xl} />
              <RadiusPreview name="2xl" value={tokens.borderRadius['2xl']} />
              <RadiusPreview name="pill" value={tokens.borderRadius.pill} />
            </div>
          </Section>

          {/* Border Width Section */}
          <Section title="Szegely vastagsag (borderWidth)" icon="📐">
            <div className="space-y-4">
              {Object.entries(tokens.borderWidth).map(([name, value]) => (
                <div key={name} className="flex items-center gap-4">
                  <span className="w-20 text-sm font-mono text-gray-600">{name}</span>
                  <div
                    className="flex-1 rounded"
                    style={{ height: value, backgroundColor: tokens.colors.primary }}
                  />
                  <span className="text-xs text-gray-500">{value}</span>
                </div>
              ))}
            </div>
          </Section>
        </div>

        {/* Shadows Section */}
        <Section title="Arnyekok (shadows)" icon="🌓">
          <div className="flex flex-wrap gap-8 p-8 bg-gray-100 rounded-xl">
            <ShadowPreview name="subtle" value={tokens.shadows.subtle} />
            <ShadowPreview name="medium" value={tokens.shadows.medium} />
            <ShadowPreview name="large" value={tokens.shadows.large} />
            <ShadowPreview name="cta" value={tokens.shadows.cta} />
          </div>
        </Section>

        {/* Buttons Section */}
        <Section title="Gombok (button)" icon="🔘">
          <div className="flex flex-wrap gap-4 mb-6">
            <ButtonPreview
              name="Primary"
              background={tokens.button.primary.background}
              color={tokens.button.primary.color}
              borderRadius={tokens.button.primary.borderRadius}
              shadow={tokens.button.primary.shadow}
            />
            <ButtonPreview
              name="Secondary"
              background={tokens.button.secondary.background}
              color={tokens.button.secondary.color}
              borderRadius={tokens.button.secondary.borderRadius}
              shadow={tokens.button.secondary.shadow}
            />
            <ButtonPreview
              name="Outline"
              background={tokens.button.outline.background}
              color={tokens.button.outline.color}
              borderRadius={tokens.button.outline.borderRadius}
              border={tokens.button.outline.border}
            />
          </div>
          {/* Outline Light on dark background */}
          <div className="p-6 rounded-xl" style={{ backgroundColor: tokens.colors.secondary }}>
            <p className="text-white text-sm mb-3 opacity-70">Sotet hatterre:</p>
            <ButtonPreview
              name="Outline Light"
              background={tokens.button.outlineLight.background}
              color={tokens.button.outlineLight.color}
              borderRadius={tokens.button.outlineLight.borderRadius}
              border={tokens.button.outlineLight.border}
            />
          </div>
        </Section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Layout Section */}
          <Section title="Elrendezes (layout)" icon="📐">
            <div className="space-y-3">
              {Object.entries(tokens.layout).map(([name, value]) => (
                <div key={name} className="flex justify-between items-center py-2 border-b">
                  <span className="font-mono text-sm text-gray-700">{name}</span>
                  <span className="text-sm text-gray-500">{value}</span>
                </div>
              ))}
            </div>
          </Section>

          {/* Sizing Section */}
          <Section title="Meretek (sizing)" icon="📊">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-gray-500 mb-3">Ikonok</h4>
                <div className="flex gap-4 items-end">
                  <div className="text-center">
                    <div
                      className="bg-blue-500 rounded-lg flex items-center justify-center text-white"
                      style={{ width: tokens.sizing.iconSm, height: tokens.sizing.iconSm }}
                    >Sm</div>
                    <span className="text-xs text-gray-500 mt-1">{tokens.sizing.iconSm}</span>
                  </div>
                  <div className="text-center">
                    <div
                      className="bg-blue-500 rounded-lg flex items-center justify-center text-white"
                      style={{ width: tokens.sizing.iconMd, height: tokens.sizing.iconMd }}
                    >Md</div>
                    <span className="text-xs text-gray-500 mt-1">{tokens.sizing.iconMd}</span>
                  </div>
                  <div className="text-center">
                    <div
                      className="bg-blue-500 rounded-lg flex items-center justify-center text-white"
                      style={{ width: tokens.sizing.iconLg, height: tokens.sizing.iconLg }}
                    >Lg</div>
                    <span className="text-xs text-gray-500 mt-1">{tokens.sizing.iconLg}</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-500 mb-3">Indikatorok</h4>
                <div className="flex gap-4 items-end">
                  <div className="text-center">
                    <div
                      className="bg-green-500 rounded-full flex items-center justify-center text-white text-xs"
                      style={{ width: tokens.sizing.indicatorSm, height: tokens.sizing.indicatorSm }}
                    >1</div>
                    <span className="text-xs text-gray-500 mt-1">{tokens.sizing.indicatorSm}</span>
                  </div>
                  <div className="text-center">
                    <div
                      className="bg-green-500 rounded-full flex items-center justify-center text-white"
                      style={{ width: tokens.sizing.indicatorMd, height: tokens.sizing.indicatorMd }}
                    >2</div>
                    <span className="text-xs text-gray-500 mt-1">{tokens.sizing.indicatorMd}</span>
                  </div>
                  <div className="text-center">
                    <div
                      className="bg-green-500 rounded-full flex items-center justify-center text-white text-lg"
                      style={{ width: tokens.sizing.indicatorLg, height: tokens.sizing.indicatorLg }}
                    >3</div>
                    <span className="text-xs text-gray-500 mt-1">{tokens.sizing.indicatorLg}</span>
                  </div>
                </div>
              </div>
            </div>
          </Section>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Breakpoints Section */}
          <Section title="Torespontek (breakpoints)" icon="📱">
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <span className="text-2xl">📱</span>
                <span className="w-20 font-mono text-sm">mobile</span>
                <div className="flex-1 h-2 bg-blue-200 rounded relative">
                  <div className="absolute left-0 top-0 h-full bg-blue-500 rounded" style={{ width: '30%' }} />
                </div>
                <span className="text-sm text-gray-500">{tokens.breakpoints.mobile}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-2xl">📱</span>
                <span className="w-20 font-mono text-sm">tablet</span>
                <div className="flex-1 h-2 bg-blue-200 rounded relative">
                  <div className="absolute left-0 top-0 h-full bg-blue-500 rounded" style={{ width: '50%' }} />
                </div>
                <span className="text-sm text-gray-500">{tokens.breakpoints.tablet}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-2xl">🖥️</span>
                <span className="w-20 font-mono text-sm">desktop</span>
                <div className="flex-1 h-2 bg-blue-200 rounded relative">
                  <div className="absolute left-0 top-0 h-full bg-blue-500 rounded" style={{ width: '70%' }} />
                </div>
                <span className="text-sm text-gray-500">{tokens.breakpoints.desktop}</span>
              </div>
            </div>
          </Section>

          {/* Opacity Section */}
          <Section title="Atlatszoság (opacity)" icon="👁️">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="w-24 font-mono text-sm">disabled</span>
                <div
                  className="w-24 h-12 rounded flex items-center justify-center text-white font-semibold"
                  style={{ backgroundColor: tokens.colors.primary, opacity: tokens.opacity.disabled }}
                >
                  50%
                </div>
                <span className="text-sm text-gray-500">{tokens.opacity.disabled}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="w-24 font-mono text-sm">muted</span>
                <div
                  className="w-24 h-12 rounded flex items-center justify-center text-white font-semibold"
                  style={{ backgroundColor: tokens.colors.primary, opacity: tokens.opacity.muted }}
                >
                  70%
                </div>
                <span className="text-sm text-gray-500">{tokens.opacity.muted}</span>
              </div>
            </div>
          </Section>
        </div>

        {/* Gradients Section (only for AIBOOST) */}
        {tokens.gradients && (
          <Section title="Gradiensek (gradients)" icon="🌈">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tokens.gradients.hero && (
                <div>
                  <div
                    className="h-32 rounded-xl"
                    style={{ background: tokens.gradients.hero }}
                  />
                  <span className="text-sm font-mono text-gray-600 mt-2 block">hero</span>
                </div>
              )}
              {tokens.gradients.glow && (
                <div>
                  <div
                    className="h-32 rounded-xl"
                    style={{ background: tokens.gradients.glow }}
                  />
                  <span className="text-sm font-mono text-gray-600 mt-2 block">glow</span>
                </div>
              )}
            </div>
          </Section>
        )}

        {/* Code Usage Section */}
        <Section title="Hasznalat kodban" icon="💻">
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Puck komponensekben:</h4>
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
{`import { usePuckTokens } from '@/lib/puck/brand-context';

function MyComponent() {
  const tokens = usePuckTokens();

  return (
    <div style={{
      color: tokens.colors.primary,
      fontSize: tokens.typography.h2.size,
      padding: tokens.spacing.lg,
      borderRadius: tokens.borderRadius.md,
      boxShadow: tokens.shadows.medium,
    }}>
      Content
    </div>
  );
}`}
              </pre>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Tokenek lekerdezese:</h4>
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
{`import { getSimplifiedTokens } from '@/lib/puck/brand-context';

const boomTokens = getSimplifiedTokens('BOOM');
const aiboostTokens = getSimplifiedTokens('AIBOOST');

// Peldak
const primaryColor = boomTokens.colors.primary;  // ${getSimplifiedTokens('BOOM').colors.primary}
const h1Size = boomTokens.typography.h1.size;    // ${getSimplifiedTokens('BOOM').typography.h1.size}
const spacingLg = boomTokens.spacing.lg;         // ${getSimplifiedTokens('BOOM').spacing.lg}`}
              </pre>
            </div>
          </div>
        </Section>

        {/* Token Categories Summary */}
        <Section title="Osszes token kategoria" icon="📦">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div className="border rounded-lg p-4 bg-gradient-to-br from-red-50 to-orange-50">
              <div className="font-bold text-lg mb-1">colors</div>
              <div className="text-xs text-gray-600">13 token</div>
              <div className="text-xs text-gray-500 mt-2">primary, secondary, text, background, border, success, warning, error...</div>
            </div>
            <div className="border rounded-lg p-4 bg-gradient-to-br from-blue-50 to-cyan-50">
              <div className="font-bold text-lg mb-1">typography</div>
              <div className="text-xs text-gray-600">11 token</div>
              <div className="text-xs text-gray-500 mt-2">h1-h6 + mobileSize, body, bodyLarge, bodySmall, caption, label</div>
            </div>
            <div className="border rounded-lg p-4 bg-gradient-to-br from-green-50 to-emerald-50">
              <div className="font-bold text-lg mb-1">spacing</div>
              <div className="text-xs text-gray-600">8 token</div>
              <div className="text-xs text-gray-500 mt-2">xs, sm, md, lg, xl, 2xl, 3xl, 4xl</div>
            </div>
            <div className="border rounded-lg p-4 bg-gradient-to-br from-purple-50 to-pink-50">
              <div className="font-bold text-lg mb-1">borderRadius</div>
              <div className="text-xs text-gray-600">6 token</div>
              <div className="text-xs text-gray-500 mt-2">sm, md, lg, xl, 2xl, pill</div>
            </div>
            <div className="border rounded-lg p-4 bg-gradient-to-br from-yellow-50 to-amber-50">
              <div className="font-bold text-lg mb-1">borderWidth</div>
              <div className="text-xs text-gray-600">3 token</div>
              <div className="text-xs text-gray-500 mt-2">thin (1px), medium (2px), thick (4px)</div>
            </div>
            <div className="border rounded-lg p-4 bg-gradient-to-br from-gray-50 to-slate-100">
              <div className="font-bold text-lg mb-1">shadows</div>
              <div className="text-xs text-gray-600">4 token</div>
              <div className="text-xs text-gray-500 mt-2">subtle, medium, large, cta</div>
            </div>
            <div className="border rounded-lg p-4 bg-gradient-to-br from-indigo-50 to-violet-50">
              <div className="font-bold text-lg mb-1">button</div>
              <div className="text-xs text-gray-600">4 variant</div>
              <div className="text-xs text-gray-500 mt-2">primary, secondary, outline, outlineLight (bg, color, borderRadius, shadow/border)</div>
            </div>
            <div className="border rounded-lg p-4 bg-gradient-to-br from-teal-50 to-cyan-50">
              <div className="font-bold text-lg mb-1">layout</div>
              <div className="text-xs text-gray-600">4 token</div>
              <div className="text-xs text-gray-500 mt-2">maxWidth, maxWidthNarrow, maxWidthWide, containerPadding</div>
            </div>
            <div className="border rounded-lg p-4 bg-gradient-to-br from-rose-50 to-pink-50">
              <div className="font-bold text-lg mb-1">sizing</div>
              <div className="text-xs text-gray-600">6 token</div>
              <div className="text-xs text-gray-500 mt-2">iconSm/Md/Lg, indicatorSm/Md/Lg</div>
            </div>
            <div className="border rounded-lg p-4 bg-gradient-to-br from-sky-50 to-blue-50">
              <div className="font-bold text-lg mb-1">breakpoints</div>
              <div className="text-xs text-gray-600">3 token</div>
              <div className="text-xs text-gray-500 mt-2">mobile (480px), tablet (768px), desktop (1024px)</div>
            </div>
            <div className="border rounded-lg p-4 bg-gradient-to-br from-fuchsia-50 to-purple-50">
              <div className="font-bold text-lg mb-1">opacity</div>
              <div className="text-xs text-gray-600">2 token</div>
              <div className="text-xs text-gray-500 mt-2">disabled (0.5), muted (0.7)</div>
            </div>
            <div className="border rounded-lg p-4 bg-gradient-to-br from-lime-50 to-green-50">
              <div className="font-bold text-lg mb-1">fonts</div>
              <div className="text-xs text-gray-600">2 token</div>
              <div className="text-xs text-gray-500 mt-2">heading, body</div>
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
}
