#!/usr/bin/env tsx

import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import { transform } from 'sucrase';
import { prisma } from '@/lib/prisma';
import { BlockType, Brand } from '@prisma/client';

// Block type mapping: filename -> database enum
const BLOCK_TYPE_MAP: Record<string, BlockType> = {
  'HeroBlock': 'HERO',
  'ValuePropBlock': 'VALUE_PROP',
  'PricingBlock': 'PRICING_TABLE',
  'ServicesBlock': 'SERVICES_GRID',
  'GuaranteesBlock': 'GUARANTEES',
  'CTABlock': 'CTA',
  'ProcessTimelineBlock': 'PROCESS_TIMELINE',
  'ClientLogosBlock': 'CLIENT_LOGOS',
  'TextBlock': 'TEXT_BLOCK',
  'TwoColumnBlock': 'TWO_COLUMN',
  'PlatformFeaturesBlock': 'PLATFORM_FEATURES',
  'StatsBlock': 'STATS',
  'BonusFeaturesBlock': 'BONUS_FEATURES',
  'PartnerGridBlock': 'PARTNER_GRID',
};

interface ParsedInterface {
  name: string;
  properties: Record<string, any>;
}

/**
 * Extract TypeScript interface from component file
 */
function extractInterface(content: string, interfaceName: string): ParsedInterface | null {
  // Match interface definition
  const interfacePattern = new RegExp(
    `interface\\s+${interfaceName}\\s*{([^}]+)}`,
    'gs'
  );

  const match = interfacePattern.exec(content);
  if (!match) {
    console.warn(`  ⚠️  Could not find interface: ${interfaceName}`);
    return null;
  }

  const interfaceBody = match[1];
  const properties: Record<string, any> = {};

  // Parse property lines
  const lines = interfaceBody.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('//')) continue;

    // Match: propertyName?: type | propertyName: type
    const propMatch = /^(\w+)\??:\s*(.+?);?$/.exec(trimmed);
    if (propMatch) {
      const [, propName, propType] = propMatch;
      properties[propName] = parsePropertyType(propType);
    }
  }

  return {
    name: interfaceName,
    properties,
  };
}

/**
 * Parse TypeScript type to JSON Schema type
 */
function parsePropertyType(tsType: string): any {
  const cleanType = tsType.trim().replace(/;$/, '');

  // Handle arrays
  if (cleanType.endsWith('[]') || cleanType.startsWith('Array<')) {
    return {
      type: 'array',
      items: { type: 'object' }
    };
  }

  // Handle unions
  if (cleanType.includes('|')) {
    const options = cleanType.split('|').map(t => t.trim().replace(/['"]/g, ''));
    return {
      type: 'string',
      enum: options.filter(o => o !== 'undefined')
    };
  }

  // Handle objects
  if (cleanType === 'object' || cleanType.startsWith('{')) {
    return { type: 'object' };
  }

  // Primitive types
  const typeMap: Record<string, string> = {
    'string': 'string',
    'number': 'number',
    'boolean': 'boolean',
    'any': 'object',
  };

  return { type: typeMap[cleanType] || 'string' };
}

/**
 * Generate JSON schema from parsed interface
 */
function generateJsonSchema(interfaceData: ParsedInterface): any {
  const schema = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    type: 'object',
    title: interfaceData.name,
    properties: {} as Record<string, any>,
    required: [] as string[],
  };

  for (const [propName, propSchema] of Object.entries(interfaceData.properties)) {
    schema.properties[propName] = propSchema;
  }

  return schema;
}

/**
 * Compile TypeScript to JavaScript using Sucrase
 */
function compileTypeScript(tsCode: string): string {
  try {
    const result = transform(tsCode, {
      transforms: ['typescript', 'jsx', 'imports'],
      production: true,
      disableESTransforms: false,
    });

    return result.code;
  } catch (error) {
    console.error('  ❌ Compilation error:', error);
    throw error;
  }
}

/**
 * Extract props interface name from component
 */
function extractPropsInterfaceName(content: string, componentName: string): string | null {
  // Try to find: interface XxxBlockProps
  const propsPattern = new RegExp(`interface\\s+(${componentName}Props)\\s*{`, 'i');
  const match = propsPattern.exec(content);

  if (match) {
    return match[1];
  }

  return null;
}

/**
 * Generate sample default content based on the block type
 */
function generateDefaultContent(blockType: BlockType): any {
  const defaults: Record<BlockType, any> = {
    HERO: {
      headingPrefix: 'Üdvözlünk',
      headingMain: 'a neve',
      headingSuffix: 'cégednek',
      subheading: 'Professzionális megoldások az Ön vállalkozása számára',
      createdByPrefix: 'Készítette',
      alignment: 'left',
    },
    VALUE_PROP: {
      heading: 'Miért válasszon minket?',
      leftColumn: {
        title: 'Előnyeink',
        items: [
          'Szakértő csapat',
          'Megbízható partner',
          'Versenyképes árak',
        ],
      },
      rightColumn: {
        title: 'Hitvallásunk',
        content: 'Ügyfeleinket a legmagasabb színvonalon szolgáljuk ki.',
      },
    },
    PRICING_TABLE: {
      heading: 'Áraink',
      description: 'Válassza ki az Önnek legmegfelelőbb csomagot',
      plans: [],
    },
    SERVICES_GRID: {
      heading: 'Szolgáltatásaink',
      services: [],
      columns: 3,
    },
    GUARANTEES: {
      heading: 'Garanciák',
      leftColumn: [],
      rightColumn: [],
    },
    CTA: {
      heading: 'Készen állsz?',
      description: 'Lépj velünk kapcsolatba még ma!',
    },
    PROCESS_TIMELINE: {
      heading: 'Folyamataink',
      steps: [],
    },
    CLIENT_LOGOS: {
      heading: 'Ügyfeleink',
      logos: [],
      columns: 4,
    },
    TEXT_BLOCK: {
      body: '<p>Szöveges tartalom helye</p>',
      alignment: 'left',
      maxWidth: 'medium',
    },
    TWO_COLUMN: {
      leftColumn: {
        title: 'Bal oldal',
        items: [],
      },
      rightColumn: {
        title: 'Jobb oldal',
        items: [],
      },
    },
    PLATFORM_FEATURES: {
      heading: 'Funkciók',
      features: [],
    },
    STATS: {
      heading: 'Számok',
      stats: [],
      columns: 4,
      backgroundColor: 'white',
    },
    BONUS_FEATURES: {
      heading: 'Bónusz funkciók',
      features: [],
      columns: 4,
    },
    PARTNER_GRID: {
      version: '1.0',
      heading: 'Partnereink',
      partners: [],
      columns: 3,
      showScissors: true,
    },
  };

  return defaults[blockType] || {};
}

/**
 * Process a single block component file
 */
async function processBlockComponent(
  filePath: string,
  fileName: string,
  brand: Brand
): Promise<boolean> {
  const componentName = fileName.replace('.tsx', '');
  const blockType = BLOCK_TYPE_MAP[componentName];

  if (!blockType) {
    console.warn(`  ⚠️  Skipping ${fileName}: No block type mapping found`);
    return false;
  }

  console.log(`\n📦 Processing: ${componentName}`);
  console.log(`   Type: ${blockType}`);

  try {
    // Read file content
    const content = readFileSync(filePath, 'utf-8');
    console.log(`   ✓ File read successfully (${content.length} bytes)`);

    // Extract props interface
    const propsInterfaceName = extractPropsInterfaceName(content, componentName);
    if (!propsInterfaceName) {
      console.warn(`   ⚠️  Could not find props interface`);
      return false;
    }
    console.log(`   ✓ Found interface: ${propsInterfaceName}`);

    // Parse interface
    const interfaceData = extractInterface(content, propsInterfaceName);
    if (!interfaceData) {
      console.warn(`   ⚠️  Could not parse interface`);
      return false;
    }
    console.log(`   ✓ Parsed ${Object.keys(interfaceData.properties).length} properties`);

    // Generate JSON schema
    const jsonSchema = generateJsonSchema(interfaceData);
    console.log(`   ✓ Generated JSON schema`);

    // Compile TypeScript to JavaScript
    const jsCode = compileTypeScript(content);
    console.log(`   ✓ Compiled to JavaScript (${jsCode.length} bytes)`);

    // Generate default content
    const defaultContent = generateDefaultContent(blockType);
    console.log(`   ✓ Generated default content`);

    // Upsert to database
    const template = await prisma.blockTemplate.upsert({
      where: {
        blockType_name_brand: {
          blockType,
          name: `${componentName} - ${brand}`,
          brand,
        },
      },
      update: {
        description: `Default template for ${componentName}`,
        defaultContent,
        isActive: true,
        displayOrder: Object.keys(BLOCK_TYPE_MAP).indexOf(componentName),
      },
      create: {
        blockType,
        name: `${componentName} - ${brand}`,
        brand,
        description: `Default template for ${componentName}`,
        defaultContent,
        isActive: true,
        displayOrder: Object.keys(BLOCK_TYPE_MAP).indexOf(componentName),
      },
    });

    console.log(`   ✅ Saved to database (ID: ${template.id})`);
    return true;

  } catch (error) {
    console.error(`   ❌ Error processing ${fileName}:`, error);
    return false;
  }
}

/**
 * Main migration function
 */
async function main() {
  console.log('\n🚀 Starting Block Components Migration to Database\n');
  console.log('=' .repeat(60));

  const blocksDir = join(process.cwd(), 'components', 'blocks');

  // Verify directory exists
  try {
    statSync(blocksDir);
    console.log(`\n📂 Blocks directory: ${blocksDir}`);
  } catch (error) {
    console.error(`\n❌ Directory not found: ${blocksDir}`);
    process.exit(1);
  }

  // Read all block files
  const files = readdirSync(blocksDir)
    .filter(file => file.endsWith('Block.tsx'))
    .sort();

  console.log(`\n📋 Found ${files.length} block components:\n`);
  files.forEach((file, index) => {
    console.log(`   ${index + 1}. ${file}`);
  });

  // Process each file for both brands
  const brands: Brand[] = ['BOOM', 'AIBOOST'];
  const results = {
    success: 0,
    failed: 0,
    total: files.length * brands.length,
  };

  console.log('\n' + '='.repeat(60));
  console.log('📊 Starting migration...\n');

  for (const brand of brands) {
    console.log(`\n🏷️  Processing brand: ${brand}`);
    console.log('-'.repeat(60));

    for (const file of files) {
      const filePath = join(blocksDir, file);
      const success = await processBlockComponent(filePath, file, brand);

      if (success) {
        results.success++;
      } else {
        results.failed++;
      }
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('\n✨ Migration Complete!\n');
  console.log('📊 Summary:');
  console.log(`   Total components: ${files.length}`);
  console.log(`   Brands: ${brands.join(', ')}`);
  console.log(`   Total operations: ${results.total}`);
  console.log(`   ✅ Successful: ${results.success}`);
  console.log(`   ❌ Failed: ${results.failed}`);
  console.log(`   📈 Success rate: ${((results.success / results.total) * 100).toFixed(1)}%`);

  // List created templates
  console.log('\n📋 Checking database...');
  const templates = await prisma.blockTemplate.findMany({
    orderBy: [
      { brand: 'asc' },
      { displayOrder: 'asc' },
    ],
    select: {
      id: true,
      blockType: true,
      name: true,
      brand: true,
      isActive: true,
    },
  });

  console.log(`\n✓ Found ${templates.length} templates in database:\n`);

  const groupedByBrand = templates.reduce((acc, t) => {
    if (!acc[t.brand]) acc[t.brand] = [];
    acc[t.brand].push(t);
    return acc;
  }, {} as Record<string, typeof templates>);

  for (const [brand, brandTemplates] of Object.entries(groupedByBrand)) {
    console.log(`\n  ${brand}:`);
    brandTemplates.forEach((t, idx) => {
      console.log(`    ${idx + 1}. ${t.name} (${t.blockType}) ${t.isActive ? '✓' : '✗'}`);
    });
  }

  console.log('\n' + '='.repeat(60));
  console.log('\n🎉 Migration script finished successfully!\n');
}

// Run the migration
main()
  .catch((error) => {
    console.error('\n💥 Fatal error:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
