#!/usr/bin/env node

import pg from 'pg';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '../.env.local') });

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function testLogin() {
  try {
    // 1. Ellenőrizzük, hogy létezik-e az admin user
    const userResult = await pool.query(`
      SELECT id, email, password_hash, name, role
      FROM users
      WHERE email = $1
    `, ['admin@boommarketing.hu']);

    if (userResult.rows.length === 0) {
      console.log('❌ Nem található a user: admin@boommarketing.hu');
      return;
    }

    const user = userResult.rows[0];
    console.log('✅ User megtalálva:', {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    });

    // 2. Ellenőrizzük a jelszót
    const testPassword = 'admin123';
    const isValid = await bcrypt.compare(testPassword, user.password_hash);

    console.log('🔐 Jelszó ellenőrzés:', isValid ? '✅ Sikeres' : '❌ Sikertelen');

    if (!isValid) {
      // Generáljunk új hash-t
      console.log('\n🔧 Új jelszó hash generálása...');
      const newHash = await bcrypt.hash('admin123', 10);

      await pool.query(`
        UPDATE users
        SET password_hash = $1, updated_at = NOW()
        WHERE email = $2
      `, [newHash, 'admin@boommarketing.hu']);

      console.log('✅ Jelszó frissítve!');
      console.log('\n📧 Bejelentkezési adatok:');
      console.log('   Email: admin@boommarketing.hu');
      console.log('   Jelszó: admin123');
    }

    // 3. Ellenőrizzük, hogy létezik-e admin@example.com is
    const exampleUserResult = await pool.query(`
      SELECT email FROM users WHERE email = $1
    `, ['admin@example.com']);

    if (exampleUserResult.rows.length > 0) {
      console.log('\n📧 Másik admin user is elérhető:');
      console.log('   Email: admin@example.com');
      console.log('   Jelszó: admin123');
    }

  } catch (error) {
    console.error('❌ Hiba:', error);
  } finally {
  }
}

testLogin();