'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

interface User {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  avatarUrl: string | null;
  role: 'ADMIN' | 'SUPER_ADMIN';
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
}

interface EditingUser {
  id: string | null;
  email: string;
  name: string;
  phone: string;
  avatarUrl: string;
  role: 'ADMIN' | 'SUPER_ADMIN';
  password: string;
  isActive: boolean;
}

const emptyUser: EditingUser = {
  id: null,
  email: '',
  name: '',
  phone: '',
  avatarUrl: '',
  role: 'ADMIN',
  password: '',
  isActive: true,
};

export default function SettingsPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingUser, setEditingUser] = useState<EditingUser | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users', {
        credentials: 'include',
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API error:', response.status, errorData);
        throw new Error(errorData.error || 'Failed to fetch users');
      }
      const data = await response.json();
      // Check if data is an array (expected) or an error object
      if (Array.isArray(data)) {
        setUsers(data);
      } else if (data.error) {
        throw new Error(data.error);
      } else {
        setUsers([]);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Nem sikerült betölteni a felhasználókat');
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setEditingUser({ ...emptyUser });
    setShowForm(true);
    setError(null);
  };

  const handleEdit = (user: User) => {
    setEditingUser({
      id: user.id,
      email: user.email,
      name: user.name || '',
      phone: user.phone || '',
      avatarUrl: user.avatarUrl || '',
      role: user.role,
      password: '',
      isActive: user.isActive,
    });
    setShowForm(true);
    setError(null);
  };

  const handleCancel = () => {
    setEditingUser(null);
    setShowForm(false);
    setError(null);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingUser) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Csak JPEG, PNG, GIF és WebP formátum engedélyezett.');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('A fájl túl nagy. Maximum 5MB engedélyezett.');
      return;
    }

    setUploadingAvatar(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'avatars');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Feltöltés sikertelen');
      }

      const data = await response.json();
      const newAvatarUrl = data.url;
      setEditingUser({ ...editingUser, avatarUrl: newAvatarUrl });

      // If editing existing user, save the avatar immediately
      if (editingUser.id) {
        const saveResponse = await fetch(`/api/users/${editingUser.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ avatarUrl: newAvatarUrl }),
        });

        if (saveResponse.ok) {
          // Update the users list to reflect the change
          setUsers(users.map(u =>
            u.id === editingUser.id ? { ...u, avatarUrl: newAvatarUrl } : u
          ));
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Feltöltés sikertelen');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleRemoveAvatar = async () => {
    if (!editingUser) return;
    setEditingUser({ ...editingUser, avatarUrl: '' });

    // If editing existing user, save the removal immediately
    if (editingUser.id) {
      try {
        const saveResponse = await fetch(`/api/users/${editingUser.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ avatarUrl: null }),
        });

        if (saveResponse.ok) {
          setUsers(users.map(u =>
            u.id === editingUser.id ? { ...u, avatarUrl: null } : u
          ));
        }
      } catch (err) {
        console.error('Failed to remove avatar:', err);
      }
    }
  };

  const handleSave = async () => {
    if (!editingUser) return;

    if (!editingUser.email) {
      setError('Az email cím kötelező');
      return;
    }

    if (!editingUser.id && !editingUser.password) {
      setError('Új felhasználónak jelszó kötelező');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const isNew = !editingUser.id;
      const url = isNew ? '/api/users' : `/api/users/${editingUser.id}`;
      const method = isNew ? 'POST' : 'PATCH';

      const payload: Record<string, unknown> = {
        email: editingUser.email,
        name: editingUser.name || null,
        phone: editingUser.phone || null,
        avatarUrl: editingUser.avatarUrl || null,
        role: editingUser.role,
        isActive: editingUser.isActive,
      };

      if (editingUser.password) {
        payload.password = editingUser.password;
      }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Mentés sikertelen');
      }

      await fetchUsers();
      handleCancel();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ismeretlen hiba történt');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (user: User) => {
    if (!confirm(`Biztosan törölni szeretnéd: ${user.email}?`)) return;

    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Törlés sikertelen');
      }

      await fetchUsers();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Törlés sikertelen');
    }
  };

  const handleToggleActive = async (user: User) => {
    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !user.isActive }),
      });

      if (!response.ok) throw new Error('Failed to update user');
      await fetchUsers();
    } catch (err) {
      console.error('Error toggling user status:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-[var(--color-muted)]">Betöltés...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text)]">
          Beállítások
        </h1>
        <p className="text-[var(--color-muted)] mt-1">
          Rendszerbeállítások és felhasználókezelés
        </p>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {/* Users Section */}
        <div className="bg-white rounded-xl border border-[var(--color-border)] overflow-hidden">
          <div className="px-6 py-4 border-b border-[var(--color-border)] flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-[var(--color-text)]">
                Felhasználók
              </h2>
              <p className="text-sm text-[var(--color-muted)]">
                Rendszerhez hozzáférő felhasználók kezelése
              </p>
            </div>
            <Button onClick={handleAddNew}>
              + Új felhasználó
            </Button>
          </div>

          {/* User Form */}
          {showForm && editingUser && (
            <div className="px-6 py-4 bg-[var(--color-background-alt)] border-b border-[var(--color-border)]">
              <h3 className="font-medium text-[var(--color-text)] mb-4">
                {editingUser.id ? 'Felhasználó szerkesztése' : 'Új felhasználó'}
              </h3>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                    className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                    placeholder="pelda@email.hu"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
                    Jelszó {editingUser.id ? '(új jelszó)' : '*'}
                  </label>
                  <input
                    type="password"
                    value={editingUser.password}
                    onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
                    className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                    placeholder={editingUser.id ? 'Üres = nem változik' : 'Jelszó'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
                    Név
                  </label>
                  <input
                    type="text"
                    value={editingUser.name}
                    onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                    className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                    placeholder="Teljes név"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
                    Telefonszám
                  </label>
                  <input
                    type="tel"
                    value={editingUser.phone}
                    onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                    placeholder="+36 30 123 4567"
                  />
                </div>

                {/* Avatar Upload */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                    Profilkép
                  </label>
                  <div className="flex items-center gap-4">
                    {/* Avatar Preview */}
                    <div className="relative">
                      {editingUser.avatarUrl ? (
                        <img
                          src={editingUser.avatarUrl}
                          alt="Profilkép"
                          className="w-20 h-20 rounded-full object-cover border-2 border-[var(--color-border)]"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white text-2xl font-medium">
                          {(editingUser.name || editingUser.email || '?').charAt(0).toUpperCase()}
                        </div>
                      )}
                      {uploadingAvatar && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                          <svg className="w-6 h-6 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Upload Controls */}
                    <div className="flex flex-col gap-2">
                      <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-background-alt)] border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-border)] transition-colors text-sm">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>Kép feltöltése</span>
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/gif,image/webp"
                          onChange={handleAvatarUpload}
                          className="hidden"
                          disabled={uploadingAvatar}
                        />
                      </label>
                      {editingUser.avatarUrl && (
                        <button
                          type="button"
                          onClick={handleRemoveAvatar}
                          className="inline-flex items-center gap-1 text-sm text-red-600 hover:text-red-700"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Kép törlése
                        </button>
                      )}
                      <p className="text-xs text-[var(--color-muted)]">
                        Max 5MB, JPEG/PNG/GIF/WebP
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
                    Szerepkör
                  </label>
                  <select
                    value={editingUser.role}
                    onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as 'ADMIN' | 'SUPER_ADMIN' })}
                    className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent bg-white"
                  >
                    <option value="ADMIN">Admin</option>
                    <option value="SUPER_ADMIN">Super Admin</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={editingUser.isActive}
                    onChange={(e) => setEditingUser({ ...editingUser, isActive: e.target.checked })}
                    className="w-4 h-4 rounded border-[var(--color-border)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                  />
                  <label htmlFor="isActive" className="text-sm text-[var(--color-text)]">
                    Aktív felhasználó
                  </label>
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? 'Mentés...' : 'Mentés'}
                </Button>
                <Button variant="outline" onClick={handleCancel}>
                  Mégse
                </Button>
              </div>
            </div>
          )}

          {/* Users List */}
          <div className="divide-y divide-[var(--color-border)]">
            {users.length === 0 ? (
              <div className="px-6 py-12 text-center text-[var(--color-muted)]">
                Még nincsenek felhasználók
              </div>
            ) : (
              users.map((user) => (
                <div
                  key={user.id}
                  className="px-6 py-4 flex items-center justify-between hover:bg-[var(--color-background-alt)] transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    {user.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt={user.name || user.email}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white font-medium">
                        {(user.name || user.email).charAt(0).toUpperCase()}
                      </div>
                    )}

                    {/* Info */}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-[var(--color-text)]">
                          {user.name || user.email}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          user.role === 'SUPER_ADMIN'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {user.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Admin'}
                        </span>
                        {!user.isActive && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                            Inaktív
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-[var(--color-muted)]">
                        <span>{user.email}</span>
                        {user.phone && (
                          <>
                            <span>|</span>
                            <span>{user.phone}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleActive(user)}
                      className={`p-2 rounded-lg transition-colors ${
                        user.isActive
                          ? 'text-green-600 hover:bg-green-50'
                          : 'text-gray-400 hover:bg-gray-50'
                      }`}
                      title={user.isActive ? 'Deaktiválás' : 'Aktiválás'}
                    >
                      {user.isActive ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                    </button>
                    <button
                      onClick={() => handleEdit(user)}
                      className="p-2 rounded-lg text-[var(--color-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-background-alt)] transition-colors"
                      title="Szerkesztés"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(user)}
                      className="p-2 rounded-lg text-[var(--color-muted)] hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Törlés"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Tech Stack Section */}
        <div className="bg-white rounded-xl border border-[var(--color-border)] overflow-hidden">
          <div className="px-6 py-4 border-b border-[var(--color-border)]">
            <h2 className="text-lg font-semibold text-[var(--color-text)]">
              Tech Stack
            </h2>
            <p className="text-sm text-[var(--color-muted)]">
              A rendszer technikai felépítése
            </p>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Frontend */}
              <div className="space-y-3">
                <h3 className="font-medium text-[var(--color-text)] flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Frontend
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-black" />
                    <span className="font-medium">Next.js 15</span>
                    <span className="text-[var(--color-muted)]">- App Router</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    <span className="font-medium">React 19</span>
                    <span className="text-[var(--color-muted)]">- UI Library</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-600" />
                    <span className="font-medium">TypeScript</span>
                    <span className="text-[var(--color-muted)]">- Type Safety</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-500" />
                    <span className="font-medium">Tailwind CSS</span>
                    <span className="text-[var(--color-muted)]">- Styling</span>
                  </li>
                </ul>
              </div>

              {/* Backend */}
              <div className="space-y-3">
                <h3 className="font-medium text-[var(--color-text)] flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                  </svg>
                  Backend & Database
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-teal-500" />
                    <span className="font-medium">Prisma ORM</span>
                    <span className="text-[var(--color-muted)]">- Database</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-700" />
                    <span className="font-medium">PostgreSQL</span>
                    <span className="text-[var(--color-muted)]">- Prisma Cloud</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-500" />
                    <span className="font-medium">NextAuth.js</span>
                    <span className="text-[var(--color-muted)]">- Auth</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-orange-500" />
                    <span className="font-medium">Cloudinary</span>
                    <span className="text-[var(--color-muted)]">- Media Storage</span>
                  </li>
                </ul>
              </div>

              {/* Infrastructure */}
              <div className="space-y-3">
                <h3 className="font-medium text-[var(--color-text)] flex items-center gap-2">
                  <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                  </svg>
                  Infrastruktúra
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-black" />
                    <span className="font-medium">Vercel</span>
                    <span className="text-[var(--color-muted)]">- Hosting</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-gray-500" />
                    <span className="font-medium">GitHub</span>
                    <span className="text-[var(--color-muted)]">- Version Control</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-yellow-500" />
                    <span className="font-medium">Edge Runtime</span>
                    <span className="text-[var(--color-muted)]">- Global CDN</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Architecture Diagram */}
            <div className="mt-8 pt-6 border-t border-[var(--color-border)]">
              <h3 className="font-medium text-[var(--color-text)] mb-4">Rendszer Architektúra</h3>
              <div className="bg-[var(--color-background-alt)] rounded-lg p-6">
                <div className="flex flex-col items-center gap-4 text-sm">
                  {/* User Layer */}
                  <div className="flex items-center gap-3 px-4 py-2 bg-blue-100 rounded-lg text-blue-800">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="font-medium">Felhasználó (Böngésző)</span>
                  </div>

                  <svg className="w-4 h-8 text-[var(--color-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>

                  {/* Vercel Layer */}
                  <div className="flex items-center gap-3 px-4 py-2 bg-gray-100 rounded-lg">
                    <span className="font-bold">Vercel</span>
                    <span className="text-[var(--color-muted)]">- Next.js + API Routes</span>
                  </div>

                  <div className="flex gap-4">
                    <svg className="w-4 h-8 text-[var(--color-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                    <svg className="w-4 h-8 text-[var(--color-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </div>

                  {/* Services Layer */}
                  <div className="flex gap-4 flex-wrap justify-center">
                    <div className="px-4 py-2 bg-teal-100 rounded-lg text-teal-800">
                      <span className="font-medium">Prisma Cloud</span>
                      <div className="text-xs opacity-75">PostgreSQL DB</div>
                    </div>
                    <div className="px-4 py-2 bg-orange-100 rounded-lg text-orange-800">
                      <span className="font-medium">Cloudinary</span>
                      <div className="text-xs opacity-75">Képek tárolása</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Version Info */}
            <div className="mt-6 pt-4 border-t border-[var(--color-border)] flex flex-wrap gap-4 text-xs text-[var(--color-muted)]">
              <span>Proposal Builder v1.0</span>
              <span>|</span>
              <span>Next.js 15.1</span>
              <span>|</span>
              <span>React 19</span>
              <span>|</span>
              <span>Prisma 6.8</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
