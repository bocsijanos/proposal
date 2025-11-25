'use client';

import { useState } from 'react';

export default function AdminSyncPage() {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [log, setLog] = useState<string[]>([]);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple password check (you can change this)
    if (password === 'boommarketing2025') {
      setAuthenticated(true);
      setLog(['✅ Authenticated successfully']);
    } else {
      setLog(['❌ Invalid password']);
    }
  };

  const addLog = (message: string) => {
    setLog(prev => [...prev, message]);
  };

  const runSync = async () => {
    setSyncing(true);
    setLog(['🚀 Starting production sync...', '']);

    try {
      // Step 1: Run migration
      addLog('📊 Step 1: Running database migration...');
      const migrateResponse = await fetch('/api/migrate-db', {
        method: 'POST',
      });

      if (!migrateResponse.ok) {
        const error = await migrateResponse.text();
        throw new Error(`Migration failed: ${error}`);
      }

      const migrateResult = await migrateResponse.json();
      addLog(`✅ Migration completed: ${migrateResult.message}`);
      addLog(`   Executed ${migrateResult.statementsExecuted} SQL statements`);
      addLog('');

      // Step 2: Run seed templates
      addLog('🌱 Step 2: Seeding BOOM Marketing templates...');
      const seedResponse = await fetch('/api/seed-templates', {
        method: 'POST',
      });

      if (!seedResponse.ok) {
        const error = await seedResponse.text();
        throw new Error(`Seed failed: ${error}`);
      }

      const seedResult = await seedResponse.json();
      addLog(`✅ Seed completed: ${seedResult.message}`);
      addLog(`   Created ${seedResult.created} new templates`);
      addLog(`   Skipped ${seedResult.skipped} existing templates`);
      addLog('');

      addLog('🎉 Production sync completed successfully!');
      addLog('');
      addLog('🌐 Refresh the dashboard to see the templates');

    } catch (error) {
      addLog(`❌ Error: ${(error as Error).message}`);
    } finally {
      setSyncing(false);
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-96">
          <h1 className="text-2xl font-bold mb-6 text-center">Admin Sync</h1>
          <form onSubmit={handleAuth}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full px-4 py-2 border rounded mb-4"
              autoFocus
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Authenticate
            </button>
          </form>
          {log.length > 0 && (
            <div className="mt-4 text-sm text-red-600">
              {log[log.length - 1]}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold mb-6">Production Sync</h1>

          <p className="text-gray-600 mb-6">
            This will synchronize the database schema and seed BOOM Marketing templates.
          </p>

          <button
            onClick={runSync}
            disabled={syncing}
            className={`px-6 py-3 rounded-lg font-semibold ${
              syncing
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {syncing ? 'Syncing...' : 'Run Sync'}
          </button>

          {log.length > 0 && (
            <div className="mt-6 bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
              {log.map((line, i) => (
                <div key={i}>{line || '\u00A0'}</div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
