'use client';

import { boomTokens } from '@/lib/design-tokens/boom-tokens';
import { H1, H2, H3, Body, Button, Card } from '@/components/brand';

export default function SimpleBrandBookPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-3xl font-bold text-gray-900">Design Token Rendszer</h1>
          <p className="text-gray-600 mt-1">
            Automatikus brand stílusok a sablon készítéshez
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Main Section */}
        <section>
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-lg p-8 border-2 border-blue-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="text-4xl">🎨</div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Mi ez és miért szuper?</h2>
                <p className="text-gray-600">BOOM Marketing brand stílusok egyszerűen</p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 mb-6">
              <h3 className="text-xl font-bold mb-4">A koncepció</h3>
              <div className="space-y-3 text-gray-700">
                <p>
                  <strong>A probléma:</strong> Eddig minden címet, gombot, kártyát manuálisan kellett
                  formázni (méret, szín, térköz, stb.). Ez sok munka és könnyen elvéthetted a brand
                  színeket vagy méreteket.
                </p>
                <p>
                  <strong>A megoldás:</strong> Most már van egy központi design token rendszer! Ha
                  írsz egy <code className="bg-gray-100 px-2 py-1 rounded font-mono">&lt;H1&gt;</code>{' '}
                  címsort, automatikusan jó lesz a mérete (60px), színe (Navy blue), vastagság (Bold),
                  minden!
                </p>
                <p className="text-green-700 font-semibold text-lg">
                  ✓ Egyszer definiálva, mindenhol használható
                  <br />✓ Garantált brand consistency
                  <br />✓ Gyorsabb fejlesztés
                  <br />✓ Könnyebb karbantartás
                </p>
              </div>
            </div>

            {/* Component Examples */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Typography Examples */}
              <div className="bg-white rounded-xl p-6 shadow-md">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <span>📝</span> Tipográfia Komponensek
                </h3>
                <div className="space-y-4">
                  <div className="border-b pb-3">
                    <div className="text-xs text-gray-500 font-mono mb-2 bg-gray-50 p-2 rounded">
                      &lt;H1&gt;Főcím&lt;/H1&gt;
                    </div>
                    <H1>Ez egy H1 cím</H1>
                    <div className="text-xs text-gray-500 mt-1">60px, Navy (#3E4581), Bold 700</div>
                  </div>

                  <div className="border-b pb-3">
                    <div className="text-xs text-gray-500 font-mono mb-2 bg-gray-50 p-2 rounded">
                      &lt;H2&gt;Alcím&lt;/H2&gt;
                    </div>
                    <H2>Ez egy H2 alcím</H2>
                    <div className="text-xs text-gray-500 mt-1">42px, Navy (#3E4581), Bold 700</div>
                  </div>

                  <div className="border-b pb-3">
                    <div className="text-xs text-gray-500 font-mono mb-2 bg-gray-50 p-2 rounded">
                      &lt;H3&gt;Kisebb cím&lt;/H3&gt;
                    </div>
                    <H3>Ez egy H3 cím</H3>
                    <div className="text-xs text-gray-500 mt-1">32px, Navy (#3E4581), Bold 700</div>
                  </div>

                  <div>
                    <div className="text-xs text-gray-500 font-mono mb-2 bg-gray-50 p-2 rounded">
                      &lt;Body&gt;Szöveg&lt;/Body&gt;
                    </div>
                    <Body>
                      Ez egy body szöveg. Automatikusan jó a méret (18px), szín (#777777) és sortávolság
                      (1.6) is!
                    </Body>
                  </div>
                </div>
              </div>

              {/* Button Examples */}
              <div className="bg-white rounded-xl p-6 shadow-md">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <span>🔘</span> Gomb Komponensek
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-xs text-gray-500 font-mono mb-2 bg-gray-50 p-2 rounded">
                      &lt;Button variant=&quot;primary&quot;&gt;
                    </div>
                    <Button variant="primary">Primary CTA Gomb</Button>
                    <div className="text-xs text-gray-500 mt-1">
                      Coral (#FE6049), pill (100px radius)
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-gray-500 font-mono mb-2 bg-gray-50 p-2 rounded">
                      &lt;Button variant=&quot;secondary&quot;&gt;
                    </div>
                    <Button variant="secondary">Secondary Gomb</Button>
                    <div className="text-xs text-gray-500 mt-1">Navy (#3E4581), pill (100px radius)</div>
                  </div>

                  <div>
                    <div className="text-xs text-gray-500 font-mono mb-2 bg-gray-50 p-2 rounded">
                      &lt;Button variant=&quot;outline&quot;&gt;
                    </div>
                    <Button variant="outline">Outline Gomb</Button>
                    <div className="text-xs text-gray-500 mt-1">Átlátszó, 2px border Coral</div>
                  </div>

                  <div>
                    <div className="text-xs text-gray-500 font-mono mb-2 bg-gray-50 p-2 rounded">
                      &lt;Button size=&quot;small&quot;&gt;
                    </div>
                    <Button size="small" variant="primary">
                      Kis méret
                    </Button>
                    <div className="text-xs text-gray-500 mt-1">12px 24px padding, 16px font</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Example */}
            <div className="bg-white rounded-xl p-6 mb-6 shadow-md">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span>🎴</span> Kártya Komponens
              </h3>
              <div className="text-xs text-gray-500 font-mono mb-3 bg-gray-50 p-2 rounded">
                &lt;Card&gt;...&lt;/Card&gt;
              </div>
              <Card>
                <H3>Szolgáltatás Kártya Példa</H3>
                <Body style={{ marginTop: '8px' }}>
                  Ez egy kártya komponens. Automatikusan jó a padding (32px), border-radius (10px),
                  shadow, és van hover effekt is! Próbáld meg rávinni az egeret.
                </Body>
                <div style={{ marginTop: '16px' }}>
                  <Button variant="outline" size="small">
                    Tudj meg többet
                  </Button>
                </div>
              </Card>
              <div className="text-xs text-gray-500 mt-3">
                10px radius, subtle shadow, hover: -4px translateY
              </div>
            </div>

            {/* Code Examples */}
            <div className="bg-white rounded-xl p-6 mb-6 shadow-md">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span>💻</span> Kód Példák - Így használd
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">1. Komponensek importálása:</h4>
                  <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm font-mono">
                    {`import { H1, H2, H3, Body, Button, Card } from '@/components/brand';`}
                  </pre>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">2. Használat a sablonban:</h4>
                  <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm font-mono">
                    {`export function ServiceSection() {
  return (
    <Card>
      <H2>Facebook hirdetések kezelése</H2>
      <Body>
        A rendszer komplexitása folyamatosan nő, az indokolatlan
        tiltások egyre gyakoribbak...
      </Body>
      <Button variant="primary">
        Mutasd a részleteket
      </Button>
    </Card>
  );
}`}
                  </pre>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">
                    3. Design token-ek közvetlen használata (ha kell):
                  </h4>
                  <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm font-mono">
                    {`import { boomTokens } from '@/lib/design-tokens/boom-tokens';

// Színek
const primaryColor = boomTokens.colors.primary.hex;  // #FE6049
const navyColor = boomTokens.colors.secondary.hex;   // #3E4581

// Spacing (8px alapú)
const gap = boomTokens.spacing.md;  // 24px
const padding = boomTokens.spacing.lg;  // 32px

// Typography
const h1Size = boomTokens.typography.h1.size;  // 60px
const bodySize = boomTokens.typography.body.medium.size;  // 18px

// Shadows
const cardShadow = boomTokens.shadow.subtle;  // 0 2px 8px rgba(0,0,0,0.08)

// Border Radius
const buttonRadius = boomTokens.borderRadius.pill;  // 100px
const cardRadius = boomTokens.borderRadius.lg;  // 10px`}
                  </pre>
                </div>
              </div>
            </div>

            {/* Available Tokens */}
            <div className="bg-white rounded-xl p-6 mb-6 shadow-md">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span>📦</span> Elérhető Token Kategóriák
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="border-2 border-blue-200 bg-blue-50 rounded-lg p-3">
                  <div className="font-bold text-sm mb-1">colors</div>
                  <div className="text-xs text-gray-600">
                    primary, secondary, text, background, border
                  </div>
                </div>
                <div className="border-2 border-purple-200 bg-purple-50 rounded-lg p-3">
                  <div className="font-bold text-sm mb-1">typography</div>
                  <div className="text-xs text-gray-600">h1-h6, body, fontFamily, weights</div>
                </div>
                <div className="border-2 border-green-200 bg-green-50 rounded-lg p-3">
                  <div className="font-bold text-sm mb-1">spacing</div>
                  <div className="text-xs text-gray-600">xs, sm, md, lg, xl, 2xl, 3xl, 4xl</div>
                </div>
                <div className="border-2 border-orange-200 bg-orange-50 rounded-lg p-3">
                  <div className="font-bold text-sm mb-1">borderRadius</div>
                  <div className="text-xs text-gray-600">sm, md, lg, xl, pill, full</div>
                </div>
                <div className="border-2 border-red-200 bg-red-50 rounded-lg p-3">
                  <div className="font-bold text-sm mb-1">shadow</div>
                  <div className="text-xs text-gray-600">subtle, medium, large, hover, cta</div>
                </div>
                <div className="border-2 border-yellow-200 bg-yellow-50 rounded-lg p-3">
                  <div className="font-bold text-sm mb-1">transition</div>
                  <div className="text-xs text-gray-600">fast, base, slow, all</div>
                </div>
                <div className="border-2 border-indigo-200 bg-indigo-50 rounded-lg p-3">
                  <div className="font-bold text-sm mb-1">breakpoints</div>
                  <div className="text-xs text-gray-600">mobile, tablet, desktop, wide</div>
                </div>
                <div className="border-2 border-pink-200 bg-pink-50 rounded-lg p-3">
                  <div className="font-bold text-sm mb-1">components</div>
                  <div className="text-xs text-gray-600">button, card, input előbeállítások</div>
                </div>
              </div>
            </div>

            {/* Color Palette Quick Reference */}
            <div className="bg-white rounded-xl p-6 mb-6 shadow-md">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span>🎨</span> Színpaletta Gyors Referencia
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-16 h-16 rounded-lg shadow-md"
                    style={{ background: '#FE6049' }}
                  />
                  <div>
                    <div className="font-bold text-sm">BOOM Coral</div>
                    <div className="text-xs font-mono text-gray-600">#FE6049</div>
                    <div className="text-xs text-gray-500">CTA gombok</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div
                    className="w-16 h-16 rounded-lg shadow-md"
                    style={{ background: '#3E4581' }}
                  />
                  <div>
                    <div className="font-bold text-sm">BOOM Navy</div>
                    <div className="text-xs font-mono text-gray-600">#3E4581</div>
                    <div className="text-xs text-gray-500">Címek</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div
                    className="w-16 h-16 rounded-lg shadow-md border"
                    style={{ background: '#777777' }}
                  />
                  <div>
                    <div className="font-bold text-sm">Középszürke</div>
                    <div className="text-xs font-mono text-gray-600">#777777</div>
                    <div className="text-xs text-gray-500">Body szöveg</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div
                    className="w-16 h-16 rounded-lg shadow-md border"
                    style={{ background: '#F7F7F7' }}
                  />
                  <div>
                    <div className="font-bold text-sm">Világos szürke</div>
                    <div className="text-xs font-mono text-gray-600">#F7F7F7</div>
                    <div className="text-xs text-gray-500">Section háttér</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div
                    className="w-16 h-16 rounded-lg shadow-md border"
                    style={{ background: '#FFFFFF' }}
                  />
                  <div>
                    <div className="font-bold text-sm">Fehér</div>
                    <div className="text-xs font-mono text-gray-600">#FFFFFF</div>
                    <div className="text-xs text-gray-500">Fő háttér</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 shadow-md border-2 border-green-200">
              <h3 className="text-2xl font-bold mb-3 text-green-800">
                🚀 Miért használd ezt a rendszert?
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-start gap-2 mb-2">
                    <span className="text-green-600 text-xl">✅</span>
                    <div>
                      <strong>Konzisztencia:</strong> Minden címsor, gomb ugyanúgy néz ki, tökéletes
                      brand compliance
                    </div>
                  </div>
                  <div className="flex items-start gap-2 mb-2">
                    <span className="text-green-600 text-xl">✅</span>
                    <div>
                      <strong>Sebesség:</strong> 10x gyorsabb fejlesztés, nem kell minden stílust
                      manuálisan beállítani
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-600 text-xl">✅</span>
                    <div>
                      <strong>Type safety:</strong> TypeScript autocomplete működik, kevesebb hiba
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex items-start gap-2 mb-2">
                    <span className="text-green-600 text-xl">✅</span>
                    <div>
                      <strong>Karbantarthatóság:</strong> Egy helyen változtatsz, mindenhol frissül
                      automatikusan
                    </div>
                  </div>
                  <div className="flex items-start gap-2 mb-2">
                    <span className="text-green-600 text-xl">✅</span>
                    <div>
                      <strong>Brand book alapú:</strong> Minden érték a boommarketing.hu weboldalról
                      van kinyerve
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-600 text-xl">✅</span>
                    <div>
                      <strong>Zero config:</strong> Csak importálod és használod, működik rögtön
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
