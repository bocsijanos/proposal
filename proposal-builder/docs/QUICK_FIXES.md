# Quick Fixes for Current Issues

**Date:** 2025-11-26
**Status:** Action Required

---

## Problem: Components Return 404

### Root Cause ✅ IDENTIFIED

Your components are returning 404 NOT because of Prisma bugs, but because **they don't exist in the database yet**.

**Database Status:**
```
✅ HERO - EXISTS (working)
✅ PRICING_TABLE - EXISTS (working)
❌ VALUE_PROP - MISSING (404)
❌ PLATFORM_FEATURES - MISSING (404)
❌ GUARANTEES - MISSING (404)
❌ PROCESS_TIMELINE - MISSING (404)
❌ CLIENT_LOGOS - MISSING (404)
❌ SERVICES_GRID - MISSING (404)
❌ TEXT_BLOCK - MISSING (404)
❌ TWO_COLUMN - MISSING (404)
❌ CTA - MISSING (404)
❌ STATS - MISSING (404)
❌ BONUS_FEATURES - MISSING (404)
❌ PARTNER_GRID - MISSING (404)
```

---

## Immediate Solution: Seed Missing Components

### Option 1: Create Seed Script (Recommended)

Create `/Users/bocsijanos/Documents/claude/proposal/proposal-builder/scripts/seed-all-components.ts`:

```typescript
import { PrismaClient, BlockType } from '@prisma/client';
import { compileTypeScript } from '@/lib/compiler';

const prisma = new PrismaClient();

// Default component template
const createDefaultComponent = (blockType: BlockType) => `
import React from 'react';

interface Props {
  content: {
    title?: string;
    subtitle?: string;
    description?: string;
  };
  brand?: 'BOOM' | 'AIBOOST';
}

export function ${blockType}Block({ content, brand }: Props) {
  return (
    <div className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold mb-4">
          {content.title || '${blockType} Section'}
        </h2>
        {content.subtitle && (
          <p className="text-xl text-gray-600 mb-6">{content.subtitle}</p>
        )}
        {content.description && (
          <p className="text-gray-700">{content.description}</p>
        )}
      </div>
    </div>
  );
}
`;

async function seedAllComponents() {
  const blockTypes: BlockType[] = [
    'HERO',
    'VALUE_PROP',
    'PLATFORM_FEATURES',
    'PRICING_TABLE',
    'GUARANTEES',
    'PROCESS_TIMELINE',
    'CLIENT_LOGOS',
    'SERVICES_GRID',
    'TEXT_BLOCK',
    'TWO_COLUMN',
    'CTA',
    'STATS',
    'BONUS_FEATURES',
    'PARTNER_GRID',
  ];

  console.log('Seeding components...\n');

  for (const blockType of blockTypes) {
    try {
      // Check if exists
      const exists = await prisma.componentSource.findUnique({
        where: { blockType },
      });

      if (exists) {
        console.log(`✅ ${blockType} - Already exists`);
        continue;
      }

      // Create default source code
      const sourceCode = createDefaultComponent(blockType);

      // Compile
      const compiled = compileTypeScript(sourceCode, {
        jsx: true,
        typescript: true,
        production: false,
      });

      if (!compiled.success || !compiled.compiledCode) {
        console.log(`❌ ${blockType} - Compilation failed: ${compiled.error}`);
        continue;
      }

      // Save to database
      await prisma.componentSource.create({
        data: {
          blockType,
          name: `${blockType.replace(/_/g, ' ')} Block`,
          description: `Default ${blockType} component`,
          sourceCode,
          compiledCode: compiled.compiledCode,
          schema: {
            type: 'object',
            properties: {
              title: { type: 'string' },
              subtitle: { type: 'string' },
              description: { type: 'string' },
            },
          },
          dependencies: {},
          version: 1,
          isActive: true,
        },
      });

      console.log(`✅ ${blockType} - Created successfully`);
    } catch (error) {
      console.log(`❌ ${blockType} - Error: ${error.message}`);
    }
  }

  console.log('\n✅ Seeding complete!');
  await prisma.$disconnect();
}

seedAllComponents();
```

Run it:
```bash
npx tsx scripts/seed-all-components.ts
```

### Option 2: Quick Manual Seed (Fast)

Run this one-liner to create all missing components:

```bash
npx tsx -e "
import { PrismaClient } from '@prisma/client';
import { compileTypeScript } from './lib/compiler/index';

const prisma = new PrismaClient();
const types = ['VALUE_PROP', 'PLATFORM_FEATURES', 'GUARANTEES', 'PROCESS_TIMELINE', 'CLIENT_LOGOS', 'SERVICES_GRID', 'TEXT_BLOCK', 'TWO_COLUMN', 'CTA', 'STATS', 'BONUS_FEATURES', 'PARTNER_GRID'];

Promise.all(types.map(async (t) => {
  const src = \`export function \${t}Block({content}: any) { return React.createElement('div', {}, content.title || '\${t}'); }\`;
  const c = compileTypeScript(src);
  return prisma.componentSource.create({
    data: { blockType: t, name: t, sourceCode: src, compiledCode: c.compiledCode || '', schema: {}, version: 1 }
  });
})).then(() => console.log('✅ Done')).finally(() => prisma.\$disconnect());
"
```

---

## Verification

After seeding, verify all components exist:

```bash
npx tsx -e "
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
prisma.componentSource.findMany({ select: { blockType: true } })
  .then(r => { console.log('Components in DB:', r.map(c => c.blockType).join(', ')); })
  .finally(() => prisma.\$disconnect());
"
```

Expected output:
```
Components in DB: HERO, VALUE_PROP, PLATFORM_FEATURES, PRICING_TABLE, ...
```

---

## Better Error Messages

Update `/Users/bocsijanos/Documents/claude/proposal/proposal-builder/app/api/components/load/[blockType]/route.ts`:

```typescript
// Around line 88, replace error response with:
if (!componentSource) {
  // Get list of available components
  const available = await prisma.componentSource.findMany({
    select: { blockType: true, name: true },
  });

  return NextResponse.json(
    {
      success: false,
      error: `Component not found for block type: ${blockType}`,
      blockType,
      available: available.map(c => ({
        blockType: c.blockType,
        name: c.name,
      })),
      hint: available.length === 0
        ? 'No components found in database. Run: npx tsx scripts/seed-all-components.ts'
        : `Available components: ${available.map(c => c.blockType).join(', ')}`,
    },
    { status: 404 }
  );
}
```

---

## Testing After Fix

1. **Check database:**
   ```bash
   npx tsx scripts/check-hero-code.ts
   ```

2. **Test API endpoints:**
   ```bash
   curl http://localhost:3000/api/components/load/VALUE_PROP
   curl http://localhost:3000/api/components/load/PLATFORM_FEATURES
   ```

3. **Test in browser:**
   Open your proposal page and check browser console for successful component loads.

---

## Understanding the Prisma Enum "Issue"

There IS a known Prisma bug with enum fields ([GitHub Issue #20227](https://github.com/prisma/prisma/issues/20227)), but **this is NOT your problem**.

Your test proved it:
```
✅ findUnique HERO: FOUND (exists in DB)
✅ findFirst HERO: FOUND (exists in DB)
❌ findUnique VALUE_PROP: NOT FOUND (doesn't exist in DB)
```

The Prisma bug affects records that exist but return null. Your records genuinely don't exist yet.

If you ever encounter the Prisma enum bug, the workaround is:
```typescript
// Instead of findUnique
const component = await prisma.componentSource.findFirst({
  where: { blockType: blockType }
});
```

---

## Next Steps After Fix

Once all components are seeded:

1. **Verify rendering:**
   - Visit your proposal pages
   - Check that all block types render correctly
   - Verify no more 404 errors in console

2. **Update documentation:**
   - Document the seed process
   - Add to deployment/setup instructions

3. **Consider automation:**
   - Add seed script to `package.json`
   - Run automatically on database reset
   - Include in CI/CD pipeline

---

## Summary

**Problem:** Components return 404
**Cause:** Missing database records (not Prisma bugs)
**Solution:** Run seed script to create all components
**Time to fix:** 5-10 minutes

After seeding, your dynamic component system will work for ALL BlockType enums, not just HERO and PRICING_TABLE.

---

**For detailed analysis and best practices, see:** `/Users/bocsijanos/Documents/claude/proposal/proposal-builder/docs/RESEARCH_DYNAMIC_CODE_EXECUTION.md`
