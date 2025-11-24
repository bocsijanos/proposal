#!/bin/bash

echo "🔄 Pushing database schema to Prisma..."

# Temporarily add URL to schema for db push
cat > /tmp/temp-schema.prisma << 'EOF'
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

EOF

# Append the rest of the schema (skipping the first 9 lines)
tail -n +10 proposal-builder/prisma/schema.prisma >> /tmp/temp-schema.prisma

# Run db push with the temporary schema
DATABASE_URL="postgres://b4f5d13dddc3e8df0f1193f65dfe11da206960f06d70dbc5a9fc2cc823c0ebcd:sk_aURvCCffFSrDpca7en21t@db.prisma.io:5432/postgres?sslmode=require" \
npx prisma db push --accept-data-loss --schema=/tmp/temp-schema.prisma

# Clean up
rm /tmp/temp-schema.prisma

echo "✅ Database schema pushed successfully!"