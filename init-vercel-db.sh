#!/bin/bash

echo "🔄 Vercel Database Initialization Script"
echo "========================================"
echo ""
echo "This script will help you initialize your Vercel Postgres database."
echo ""

cd proposal-builder

# Step 1: Pull environment variables from Vercel
echo "📥 Step 1: Pulling environment variables from Vercel..."
echo "Running: npx vercel env pull .env.local"
npx vercel env pull .env.local

# Check if DATABASE_URL exists
if grep -q "DATABASE_URL" .env.local; then
    echo "✅ DATABASE_URL found in .env.local"
else
    echo "❌ DATABASE_URL not found in .env.local"
    echo ""
    echo "Please follow these steps:"
    echo "1. Go to: https://vercel.com/bocsijanoss-projects/proposal-91m6/stores"
    echo "2. Click 'Create Database' and select 'Postgres'"
    echo "3. After creation, the DATABASE_URL will be automatically added"
    echo "4. Run this script again"
    exit 1
fi

# Step 2: Generate Prisma Client
echo ""
echo "📦 Step 2: Generating Prisma Client..."
npx prisma generate

# Step 3: Push schema to database
echo ""
echo "🚀 Step 3: Pushing schema to Vercel Postgres..."
npx prisma db push --accept-data-loss

# Step 4: Create initial admin user
echo ""
echo "👤 Step 4: Creating initial admin user..."
echo "Would you like to create an admin user now? (y/n)"
read -r response

if [[ "$response" == "y" || "$response" == "Y" ]]; then
    npm run seed:sample
fi

echo ""
echo "✅ Database initialization complete!"
echo ""
echo "Your app is now ready at: https://proposal-91m6.vercel.app"
echo ""
echo "If you created an admin user, you can login with:"
echo "Email: admin@example.com"
echo "Password: admin123"