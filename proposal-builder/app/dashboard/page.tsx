'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, Edit, Trash2, ExternalLink, Layers, User, Calendar, Mail } from 'lucide-react';

interface Proposal {
  id: string;
  slug: string;
  clientName: string;
  clientContactName?: string | null;
  clientEmail?: string | null;
  brand: 'BOOM' | 'AIBOOST';
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  createdByName?: string | null;
  _count: {
    blocks: number;
  };
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProposals();
  }, []);

  const fetchProposals = async () => {
    try {
      const response = await fetch('/api/proposals');
      if (!response.ok) throw new Error('Failed to fetch proposals');
      const data = await response.json();
      // API returns { proposals: [...], pagination: {...} }
      setProposals(data.proposals || []);
    } catch (err) {
      setError('Hiba történt az árajánlatok betöltésekor');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (proposalId: string, clientName: string) => {
    if (!confirm(`⚠️ Biztosan törölni szeretnéd ezt az árajánlatot?\n\n"${clientName}"\n\nEz a művelet nem vonható vissza!`)) {
      return;
    }

    try {
      const response = await fetch(`/api/proposals/${proposalId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete proposal');

      // Remove from local state
      setProposals(proposals.filter(p => p.id !== proposalId));
    } catch (err) {
      setError('Hiba történt az árajánlat törlésekor');
      console.error(err);
    }
  };

  const handleSendEmail = (proposal: Proposal) => {
    const proposalUrl = `${window.location.origin}/${proposal.slug}`;
    const brandName = proposal.brand === 'BOOM' ? 'Boom Marketing' : 'AiBoost';
    const senderName = session?.user?.name || brandName;

    // Email címzett - ha van email, használjuk, egyébként üres
    const to = proposal.clientEmail || '';

    // Email tárgy
    const subject = `Árajánlat - ${proposal.clientName}`;

    // Email törzs
    const body = `Kedves ${proposal.clientContactName || proposal.clientName}!

Örömmel küldöm az Ön számára elkészített személyre szabott árajánlatunkat.

Az árajánlatot az alábbi linken tekintheti meg:
${proposalUrl}

Az árajánlat tartalmazza szolgáltatásaink részletes leírását, árazását és a várható eredményeket. Amennyiben bármilyen kérdése merülne fel, vagy szeretné megbeszélni a részleteket, bátran keressen meg.

Várom visszajelzését!

Üdvözlettel,
${senderName}
${brandName}`;

    // Gmail link létrehozása
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    // Megnyitás új ablakban
    window.open(gmailUrl, '_blank');
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      DRAFT: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      PUBLISHED: 'bg-green-100 text-green-800 border-green-200',
      ARCHIVED: 'bg-gray-100 text-gray-800 border-gray-200',
    };

    const labels = {
      DRAFT: 'Piszkozat',
      PUBLISHED: 'Publikálva',
      ARCHIVED: 'Archiválva',
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const getBrandBadge = (brand: string) => {
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-md ${
        brand === 'BOOM'
          ? 'bg-orange-100 text-orange-800'
          : 'bg-purple-100 text-purple-800'
      }`}>
        {brand === 'BOOM' ? 'Boom Marketing' : 'AiBoost'}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="loading text-[var(--color-muted)]">
          Árajánlatok betöltése...
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[var(--color-text)]">
              Árajánlatok
            </h1>
            <p className="text-[var(--color-muted)] mt-1">
              Kezeld és szerkeszd az árajánlataidat
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="lg"
              onClick={() => router.push('/dashboard/templates')}
            >
              📋 Sablonok
            </Button>
            <Button
              size="lg"
              onClick={() => router.push('/proposals/new')}
            >
              + Új árajánlat
            </Button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
          {error}
        </div>
      )}

      {/* Proposals List */}
      {proposals.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-[var(--color-border)]">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-xl font-semibold text-[var(--color-text)] mb-2">
            Még nincs árajánlat
          </h3>
          <p className="text-[var(--color-muted)] mb-6">
            Kezdj el egy új árajánlatot létrehozni
          </p>
          <Button
            size="lg"
            onClick={() => router.push('/proposals/new')}
          >
            + Új árajánlat létrehozása
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[var(--color-border)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[var(--color-background-alt)] border-b border-[var(--color-border)]">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-[var(--color-muted)] uppercase tracking-wider">
                    Ügyfél
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-[var(--color-muted)] uppercase tracking-wider">
                    Brand
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-[var(--color-muted)] uppercase tracking-wider">
                    Státusz
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-[var(--color-muted)] uppercase tracking-wider">
                    <Layers className="h-4 w-4 inline" aria-label="Blokkok" />
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-[var(--color-muted)] uppercase tracking-wider">
                    <Eye className="h-4 w-4 inline" aria-label="Megtekintések" />
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-[var(--color-muted)] uppercase tracking-wider">
                    <User className="h-4 w-4 inline mr-1" aria-label="Készítő" />
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-[var(--color-muted)] uppercase tracking-wider">
                    <Calendar className="h-4 w-4 inline mr-1" aria-label="Módosítva" />
                  </th>
                  <th className="px-3 py-3 text-right text-xs font-medium text-[var(--color-muted)] uppercase tracking-wider">
                    Műveletek
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {proposals.map((proposal) => (
                  <tr key={proposal.id} className="hover:bg-[var(--color-background-alt)] transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-[var(--color-text)]">
                            {proposal.clientName}
                          </div>
                          <div className="text-xs text-[var(--color-muted)] truncate max-w-[200px]">
                            {proposal.slug}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      {getBrandBadge(proposal.brand)}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-center">
                      {getStatusBadge(proposal.status)}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-center text-sm text-[var(--color-text)]">
                      <span className="inline-flex items-center gap-1">
                        <Layers className="h-3.5 w-3.5 text-[var(--color-muted)]" />
                        {proposal._count.blocks}
                      </span>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-center text-sm text-[var(--color-text)]">
                      <span className="inline-flex items-center gap-1">
                        <Eye className="h-3.5 w-3.5 text-[var(--color-muted)]" />
                        {proposal.viewCount}
                      </span>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-[var(--color-text)]">
                      <span className="inline-flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5 text-[var(--color-muted)]" />
                        {proposal.createdByName || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-[var(--color-muted)]">
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(proposal.updatedAt).toLocaleDateString('hu-HU', { month: 'short', day: 'numeric' })}
                      </span>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1">
                        {proposal.status === 'PUBLISHED' && (
                          <>
                            <Link
                              href={`/${proposal.slug}`}
                              target="_blank"
                              className="p-1.5 text-[var(--color-primary)] hover:bg-[var(--color-background-alt)] rounded transition-colors"
                              title="Megtekintés"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Link>
                            <button
                              onClick={() => handleSendEmail(proposal)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                              title="Email küldése"
                            >
                              <Mail className="h-4 w-4" />
                            </button>
                          </>
                        )}
                        <Link
                          href={`/proposals/${proposal.id}/edit`}
                          className="p-1.5 text-[var(--color-primary)] hover:bg-[var(--color-background-alt)] rounded transition-colors"
                          title="Szerkesztés"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(proposal.id, proposal.clientName)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Törlés"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
