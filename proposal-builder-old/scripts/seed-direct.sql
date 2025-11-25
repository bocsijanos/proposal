-- Direct SQL seed for admin users
-- Run this with: psql -U postgres -d template1 -f scripts/seed-direct.sql

-- Insert Boom Marketing admin
INSERT INTO "User" (id, email, "passwordHash", name, role, "createdAt", "updatedAt")
VALUES (
  gen_random_uuid()::text,
  'admin@boommarketing.hu',
  '$2b$10$drOua6VaRUnGziMY3qtQBe/QPahAf41Po45OLMjfV0Qp4TYn2.jHK',
  'Boom Admin',
  'SUPER_ADMIN',
  NOW(),
  NOW()
)
ON CONFLICT (email) DO NOTHING;

-- Insert AiBoost admin
INSERT INTO "User" (id, email, "passwordHash", name, role, "createdAt", "updatedAt")
VALUES (
  gen_random_uuid()::text,
  'admin@aiboost.hu',
  '$2b$10$drOua6VaRUnGziMY3qtQBe/QPahAf41Po45OLMjfV0Qp4TYn2.jHK',
  'AiBoost Admin',
  'ADMIN',
  NOW(),
  NOW()
)
ON CONFLICT (email) DO NOTHING;

SELECT 'Admin users created successfully!' as message;
