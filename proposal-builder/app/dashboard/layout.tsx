'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/providers/ThemeProvider';
import Image from 'next/image';
import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  // Check if we're on an editor page (full-screen mode)
  const isEditorPage = pathname?.includes('/edit');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading text-[var(--color-primary)] text-xl">
            Betöltés...
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const handleThemeToggle = () => {
    setTheme(theme === 'BOOM' ? 'AIBOOST' : 'BOOM');
  };

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: '/login' });
  };

  // For editor pages, render only children without header/wrapper
  if (isEditorPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[var(--color-background-alt)]">
      {/* Top Navigation */}
      <header className="bg-white border-b border-[var(--color-border)] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Title */}
            <Link href="/dashboard" className="flex items-center gap-4 hover:opacity-80 transition-opacity">
              <Image
                src={theme === 'BOOM' ? '/logos/boom.svg' : '/logos/aiboost.svg'}
                alt={theme === 'BOOM' ? 'Boom Marketing' : 'AiBoost'}
                width={120}
                height={120}
                style={{ width: '120px', height: 'auto' }}
              />
              <div>
                <h1 className="text-xl font-bold text-[var(--color-text)]">
                  Proposal Builder
                </h1>
                <p className="text-xs text-[var(--color-muted)]">
                  {theme === 'BOOM' ? 'Boom Marketing' : 'AiBoost'}
                </p>
              </div>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/dashboard"
                className="text-sm font-medium text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors"
              >
                Árajánlatok
              </Link>
              <Link
                href="/dashboard/templates"
                className="text-sm font-medium text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors"
              >
                Sablonok
              </Link>
              <Link
                href="/brand-book"
                className="text-sm font-medium text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors"
              >
                Brand Book
              </Link>
              <Link
                href="/dashboard/settings"
                className="text-sm font-medium text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors"
              >
                Beállítások
              </Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {/* Brand Switcher */}
              <button
                onClick={handleThemeToggle}
                className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-[var(--color-border)] hover:bg-[var(--color-background-alt)] transition-colors"
                title={`Váltás ${theme === 'BOOM' ? 'AiBoost' : 'Boom Marketing'}-ra`}
              >
                <Image
                  src={theme === 'BOOM' ? '/logos/aiboost.svg' : '/logos/boom.svg'}
                  alt={theme === 'BOOM' ? 'AiBoost' : 'Boom Marketing'}
                  width={60}
                  height={60}
                  style={{ width: '60px', height: 'auto' }}
                />
              </button>

              {/* User Menu */}
              <div className="flex items-center gap-3 pl-3 border-l border-[var(--color-border)]">
                {/* User Avatar */}
                {session.user?.avatarUrl ? (
                  <img
                    src={session.user.avatarUrl}
                    alt={session.user.name || 'Avatar'}
                    className="w-9 h-9 rounded-full object-cover border-2 border-[var(--color-border)]"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white font-medium text-sm">
                    {(session.user?.name || session.user?.email || '?').charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-[var(--color-text)]">
                    {session.user?.name || session.user?.email}
                  </p>
                  <p className="text-xs text-[var(--color-muted)]">
                    {session.user.role || 'Admin'}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                >
                  Kilépés
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
