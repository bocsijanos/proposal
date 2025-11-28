'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTheme } from '@/components/providers/ThemeProvider';

export default function NewProposalPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const [clientName, setClientName] = useState('');
  const [clientContactName, setClientContactName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<'BOOM' | 'AIBOOST'>(theme);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/proposals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientName,
          clientContactName,
          clientPhone,
          clientEmail,
          brand: selectedBrand,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create proposal');
      }

      const proposal = await response.json();
      router.push(`/proposals/${proposal.id}/edit`);
    } catch (err) {
      setError('Hiba történt az árajánlat létrehozásakor');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-background-alt)] py-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="text-[var(--color-primary)] hover:underline text-sm mb-4"
          >
            ← Vissza
          </button>
          <h1 className="text-3xl font-bold text-[var(--color-text)]">
            Új árajánlat létrehozása
          </h1>
          <p className="text-[var(--color-muted)] mt-2">
            Add meg az ügyfél nevét és válaszd ki a brand-et
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl border border-[var(--color-border)] p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Client Name */}
            <div className="space-y-2">
              <Label htmlFor="clientName">
                Cég neve <span className="text-red-500">*</span>
              </Label>
              <Input
                id="clientName"
                type="text"
                placeholder="pl. Kovács Bt."
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                required
                disabled={loading}
                className="text-lg"
              />
              <p className="text-xs text-[var(--color-muted)]">
                Ez jelenik meg az árajánlat címeként
              </p>
            </div>

            {/* Client Contact Name */}
            <div className="space-y-2">
              <Label htmlFor="clientContactName">
                Ügyfél kapcsolattartó neve
              </Label>
              <Input
                id="clientContactName"
                type="text"
                placeholder="pl. Kovács János"
                value={clientContactName}
                onChange={(e) => setClientContactName(e.target.value)}
                disabled={loading}
              />
              <p className="text-xs text-[var(--color-muted)]">
                Opcionális - felhasználható az árajánlatban
              </p>
            </div>

            {/* Client Phone */}
            <div className="space-y-2">
              <Label htmlFor="clientPhone">
                Telefonszám
              </Label>
              <Input
                id="clientPhone"
                type="tel"
                placeholder="pl. +36 30 123 4567"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                disabled={loading}
              />
              <p className="text-xs text-[var(--color-muted)]">
                Opcionális - felhasználható az árajánlatban
              </p>
            </div>

            {/* Client Email */}
            <div className="space-y-2">
              <Label htmlFor="clientEmail">
                Email cím
              </Label>
              <Input
                id="clientEmail"
                type="email"
                placeholder="pl. kovacs@example.com"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                disabled={loading}
              />
              <p className="text-xs text-[var(--color-muted)]">
                Opcionális - felhasználható az árajánlatban
              </p>
            </div>

            {/* Brand Selection */}
            <div className="space-y-3">
              <Label>
                Brand választás <span className="text-red-500">*</span>
              </Label>
              <div className="grid grid-cols-2 gap-4">
                {/* Boom Option */}
                <button
                  type="button"
                  onClick={() => setSelectedBrand('BOOM')}
                  disabled={loading}
                  className={`p-6 rounded-lg border-2 transition-all ${
                    selectedBrand === 'BOOM'
                      ? 'border-[#fa604a] bg-orange-50'
                      : 'border-[var(--color-border)] hover:border-[#fa604a]'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-2">🚀</div>
                    <div className="font-semibold text-[var(--color-text)]">
                      Boom Marketing
                    </div>
                    <div className="text-xs text-[var(--color-muted)] mt-1">
                      Coral & Navy
                    </div>
                  </div>
                </button>

                {/* AiBoost Option */}
                <button
                  type="button"
                  onClick={() => setSelectedBrand('AIBOOST')}
                  disabled={loading}
                  className={`p-6 rounded-lg border-2 transition-all ${
                    selectedBrand === 'AIBOOST'
                      ? 'border-[#d187fc] bg-purple-50'
                      : 'border-[var(--color-border)] hover:border-[#d187fc]'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-2">⚡</div>
                    <div className="font-semibold text-[var(--color-text)]">
                      AiBoost
                    </div>
                    <div className="text-xs text-[var(--color-muted)] mt-1">
                      Purple & Navy
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--color-border)]">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={loading}
              >
                Mégse
              </Button>
              <Button
                type="submit"
                size="lg"
                disabled={loading || !clientName}
              >
                {loading ? 'Létrehozás...' : 'Árajánlat létrehozása'}
              </Button>
            </div>
          </form>
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex gap-3">
            <div className="text-2xl">💡</div>
            <div className="flex-1">
              <h3 className="font-semibold text-blue-900 mb-1">Tipp</h3>
              <p className="text-sm text-blue-800">
                A létrehozás után drag & drop módszerrel adhatsz hozzá blokkokat az árajánlathoz.
                Minden blokk tartalma testre szabható.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
