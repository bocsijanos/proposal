/**
 * Test script to verify ComponentSource and ComponentVersion models
 *
 * Run with: npx tsx scripts/test-component-models.ts
 */

import { PrismaClient, BlockType } from '@prisma/client';

const prisma = new PrismaClient();

async function testComponentModels() {
  console.log('Testing ComponentSource and ComponentVersion models...\n');

  try {
    // Test 1: Create a ComponentSource
    console.log('1. Creating ComponentSource for HERO block...');
    const componentSource = await prisma.componentSource.create({
      data: {
        blockType: BlockType.HERO,
        name: 'Hero Component',
        description: 'Dynamic hero section with customizable content',
        sourceCode: `
          export default function HeroBlock({ heading, subheading, ctaText }) {
            return (
              <div className="hero">
                <h1>{heading}</h1>
                <p>{subheading}</p>
                <button>{ctaText}</button>
              </div>
            );
          }
        `,
        compiledCode: '/* Compiled JSX code would go here */',
        schema: {
          type: 'object',
          properties: {
            heading: { type: 'string', required: true },
            subheading: { type: 'string', required: true },
            ctaText: { type: 'string', default: 'Get Started' }
          }
        },
        version: 1,
        isActive: true,
        lastCompiledAt: new Date()
      }
    });
    console.log('✓ ComponentSource created:', componentSource.id);

    // Test 2: Create a ComponentVersion
    console.log('\n2. Creating ComponentVersion (v1)...');
    const componentVersion = await prisma.componentVersion.create({
      data: {
        componentId: componentSource.id,
        versionNumber: 1,
        changeDescription: 'Initial version of Hero component',
        sourceCode: componentSource.sourceCode,
        compiledCode: componentSource.compiledCode,
        schema: componentSource.schema,
        createdById: 'system' // In production, this would be a real user ID
      }
    });
    console.log('✓ ComponentVersion created:', componentVersion.id);

    // Test 3: Query ComponentSource with versions
    console.log('\n3. Querying ComponentSource with versions...');
    const componentWithVersions = await prisma.componentSource.findUnique({
      where: { blockType: BlockType.HERO },
      include: {
        versions: {
          orderBy: { versionNumber: 'desc' }
        }
      }
    });
    console.log('✓ Found component with', componentWithVersions?.versions.length, 'versions');

    // Test 4: Update ComponentSource and create new version
    console.log('\n4. Updating ComponentSource to v2...');
    const updatedSource = await prisma.componentSource.update({
      where: { id: componentSource.id },
      data: {
        version: 2,
        sourceCode: '/* Updated source code */',
        compiledCode: '/* Updated compiled code */',
        lastCompiledAt: new Date(),
        versions: {
          create: {
            versionNumber: 2,
            changeDescription: 'Added responsive design improvements',
            sourceCode: '/* Updated source code */',
            compiledCode: '/* Updated compiled code */',
            schema: componentSource.schema,
            createdById: 'system'
          }
        }
      },
      include: {
        versions: true
      }
    });
    console.log('✓ ComponentSource updated to version', updatedSource.version);
    console.log('✓ Total versions:', updatedSource.versions.length);

    // Test 5: List all active component sources
    console.log('\n5. Listing all active ComponentSources...');
    const activeComponents = await prisma.componentSource.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: { versions: true }
        }
      },
      orderBy: { updatedAt: 'desc' }
    });
    console.log('✓ Found', activeComponents.length, 'active components');
    activeComponents.forEach(comp => {
      console.log(`  - ${comp.name} (${comp.blockType}) - v${comp.version} with ${comp._count.versions} versions`);
    });

    // Test 6: Get latest version of a component
    console.log('\n6. Getting latest version of HERO component...');
    const latestVersion = await prisma.componentVersion.findFirst({
      where: { componentId: componentSource.id },
      orderBy: { versionNumber: 'desc' }
    });
    console.log('✓ Latest version:', latestVersion?.versionNumber);
    console.log('  Change:', latestVersion?.changeDescription);

    // Cleanup
    console.log('\n7. Cleaning up test data...');
    await prisma.componentVersion.deleteMany({
      where: { componentId: componentSource.id }
    });
    await prisma.componentSource.delete({
      where: { id: componentSource.id }
    });
    console.log('✓ Test data cleaned up');

    console.log('\n✅ All tests passed successfully!');

  } catch (error) {
    console.error('\n❌ Test failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run tests
testComponentModels()
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
