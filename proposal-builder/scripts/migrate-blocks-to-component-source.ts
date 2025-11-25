import { PrismaClient } from '@prisma/client';
import fs from 'fs/promises';
import path from 'path';
import { transform } from 'sucrase';

const prisma = new PrismaClient();

/**
 * Mapping of block types to component file paths
 */
const COMPONENT_PATHS: Record<string, string> = {
  HERO: 'components/blocks/HeroBlock.tsx',
  PRICING_TABLE: 'components/blocks/PricingBlock.tsx',
  SERVICES_GRID: 'components/blocks/ServicesBlock.tsx',
  VALUE_PROP: 'components/blocks/ValuePropBlock.tsx',
  GUARANTEES: 'components/blocks/GuaranteesBlock.tsx',
  CTA: 'components/blocks/CTABlock.tsx',
  PROCESS_TIMELINE: 'components/blocks/ProcessTimelineBlock.tsx',
  CLIENT_LOGOS: 'components/blocks/ClientLogosBlock.tsx',
  TEXT_BLOCK: 'components/blocks/TextBlock.tsx',
  TWO_COLUMN: 'components/blocks/TwoColumnBlock.tsx',
  PLATFORM_FEATURES: 'components/blocks/PlatformFeaturesBlock.tsx',
  STATS: 'components/blocks/StatsBlock.tsx',
  BONUS_FEATURES: 'components/blocks/BonusFeaturesBlock.tsx',
  PARTNER_GRID: 'components/blocks/PartnerGridBlock.tsx',
};

interface ParsedInterface {
  name: string;
  properties: Record<string, any>;
}

/**
 * Extract TypeScript interface from component file
 */
function extractInterface(content: string, interfaceName: string): ParsedInterface | null {
  const interfacePattern = new RegExp(
    `interface\\s+${interfaceName}\\s*{([^}]+)}`,
    'gs'
  );

  const match = interfacePattern.exec(content);
  if (!match) {
    return null;
  }

  const interfaceBody = match[1];
  const properties: Record<string, any> = {};

  const lines = interfaceBody.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('//')) continue;

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

  if (cleanType.endsWith('[]') || cleanType.startsWith('Array<')) {
    return {
      type: 'array',
      items: { type: 'object' }
    };
  }

  if (cleanType.includes('|')) {
    const options = cleanType.split('|').map(t => t.trim().replace(/['"]/g, ''));
    return {
      type: 'string',
      enum: options.filter(o => o !== 'undefined')
    };
  }

  if (cleanType === 'object' || cleanType.startsWith('{')) {
    return { type: 'object' };
  }

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
function extractPropsInterfaceName(content: string, blockType: string): string | null {
  // Extract component name from block type (e.g., HERO -> Hero)
  const componentName = blockType.split('_')
    .map(word => word.charAt(0) + word.slice(1).toLowerCase())
    .join('');

  // Try various patterns
  const patterns = [
    new RegExp(`interface\\s+(${componentName}BlockProps)\\s*{`, 'i'),
    new RegExp(`interface\\s+(${blockType.replace(/_/g, '')}Props)\\s*{`, 'i'),
    /interface\s+(\w+BlockProps)\s*{/i,
    /interface\s+(\w+Props)\s*{/i,
  ];

  for (const pattern of patterns) {
    const match = pattern.exec(content);
    if (match) {
      return match[1];
    }
  }

  return null;
}

/**
 * Get component display name
 */
function getComponentName(blockType: string): string {
  const names: Record<string, string> = {
    HERO: 'Hero Block',
    PRICING_TABLE: 'Pricing Table',
    SERVICES_GRID: 'Services Grid',
    VALUE_PROP: 'Value Proposition',
    GUARANTEES: 'Guarantees',
    CTA: 'Call to Action',
    PROCESS_TIMELINE: 'Process Timeline',
    CLIENT_LOGOS: 'Client Logos',
    TEXT_BLOCK: 'Text Block',
    TWO_COLUMN: 'Two Column',
    PLATFORM_FEATURES: 'Platform Features',
    STATS: 'Statistics',
    BONUS_FEATURES: 'Bonus Features',
    PARTNER_GRID: 'Partner Grid',
  };

  return names[blockType] || blockType;
}

/**
 * Migrate a single component to ComponentSource
 */
async function migrateComponent(blockType: string, filePath: string) {
  console.log(`\n📦 Migrating: ${blockType}`);

  try {
    // Read source file
    const fullPath = path.join(process.cwd(), filePath);
    const sourceCode = await fs.readFile(fullPath, 'utf-8');
    console.log(`   ✓ Read source file (${sourceCode.length} bytes)`);

    // Extract props interface
    const propsInterfaceName = extractPropsInterfaceName(sourceCode, blockType);
    if (!propsInterfaceName) {
      throw new Error(`Could not find props interface for ${blockType}`);
    }
    console.log(`   ✓ Found interface: ${propsInterfaceName}`);

    // Parse interface
    const interfaceData = extractInterface(sourceCode, propsInterfaceName);
    if (!interfaceData) {
      throw new Error(`Could not parse interface ${propsInterfaceName}`);
    }
    console.log(`   ✓ Parsed ${Object.keys(interfaceData.properties).length} properties`);

    // Generate JSON schema
    const schema = generateJsonSchema(interfaceData);
    console.log(`   ✓ Generated JSON schema`);

    // Compile to JavaScript
    const compiledCode = compileTypeScript(sourceCode);
    console.log(`   ✓ Compiled to JavaScript (${compiledCode.length} bytes)`);

    // Upsert to database
    const componentSource = await prisma.componentSource.upsert({
      where: {
        blockType: blockType as any,
      },
      update: {
        name: getComponentName(blockType),
        sourceCode,
        compiledCode,
        schema,
        version: { increment: 1 },
        isActive: true,
        lastCompiledAt: new Date(),
        updatedAt: new Date(),
      },
      create: {
        blockType: blockType as any,
        name: getComponentName(blockType),
        description: `Default component for ${getComponentName(blockType)}`,
        sourceCode,
        compiledCode,
        schema,
        version: 1,
        isActive: true,
        lastCompiledAt: new Date(),
      },
    });

    console.log(`   ✅ Saved to database (ID: ${componentSource.id}, Version: ${componentSource.version})`);
    return true;
  } catch (error) {
    console.error(`   ❌ Failed:`, error);
    return false;
  }
}

/**
 * Main migration function
 */
async function main() {
  console.log('\n🚀 Migrating Block Components to ComponentSource\n');
  console.log('='.repeat(60));

  const results = {
    success: 0,
    failed: 0,
    total: Object.keys(COMPONENT_PATHS).length,
  };

  for (const [blockType, filePath] of Object.entries(COMPONENT_PATHS)) {
    const success = await migrateComponent(blockType, filePath);
    if (success) {
      results.success++;
    } else {
      results.failed++;
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('\n✨ Migration Complete!\n');
  console.log('📊 Summary:');
  console.log(`   Total components: ${results.total}`);
  console.log(`   ✅ Successful: ${results.success}`);
  console.log(`   ❌ Failed: ${results.failed}`);
  console.log(`   📈 Success rate: ${((results.success / results.total) * 100).toFixed(1)}%`);

  // List all component sources
  console.log('\n📋 ComponentSource table:');
  const sources = await prisma.componentSource.findMany({
    orderBy: { blockType: 'asc' },
    select: {
      id: true,
      blockType: true,
      name: true,
      version: true,
      isActive: true,
    },
  });

  console.log(`\n✓ Found ${sources.length} components:\n`);
  sources.forEach((s, idx) => {
    console.log(`   ${idx + 1}. ${s.name.padEnd(25)} (${s.blockType.padEnd(20)}) v${s.version} ${s.isActive ? '✓' : '✗'}`);
  });

  console.log('\n' + '='.repeat(60));
  console.log('\n🎉 Migration finished!\n');
}

// Run migration
main()
  .catch((error) => {
    console.error('\n💥 Fatal error:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
