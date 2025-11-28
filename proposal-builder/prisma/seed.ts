import 'dotenv/config'
import { PrismaClient, BlockType, Brand } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create admin users
  const adminPassword = await bcrypt.hash('admin123', 10)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@boommarketing.hu' },
    update: {},
    create: {
      email: 'admin@boommarketing.hu',
      passwordHash: adminPassword,
      name: 'Boom Admin',
      role: 'SUPER_ADMIN',
    },
  })

  await prisma.user.upsert({
    where: { email: 'admin@aiboost.hu' },
    update: {},
    create: {
      email: 'admin@aiboost.hu',
      passwordHash: adminPassword,
      name: 'AiBoost Admin',
      role: 'ADMIN',
    },
  })

  console.log('✅ Created admin users')

  // Block Templates - All using PUCK_CONTENT type now
  const blockTemplates = [
    {
      blockType: BlockType.PUCK_CONTENT,
      name: 'Hero Szekció',
      description: 'Főoldali hero blokk CTA gombbal',
      brand: Brand.BOOM,
      defaultContent: {
        puckData: {
          content: [
            {
              type: 'Section',
              props: {
                variant: 'hero',
                paddingY: 'xl',
                paddingX: 'md',
                maxWidth: 'default',
                fullBleed: true,
              },
            },
          ],
          root: { props: {} },
        },
      },
      displayOrder: 1,
    },
    {
      blockType: BlockType.PUCK_CONTENT,
      name: 'Árazási Táblázat',
      description: 'Háromoszlopos árazási tábla',
      brand: Brand.BOOM,
      defaultContent: {
        puckData: {
          content: [
            {
              type: 'Section',
              props: {
                variant: 'default',
                paddingY: 'lg',
                paddingX: 'md',
                maxWidth: 'default',
              },
            },
          ],
          root: { props: {} },
        },
      },
      displayOrder: 2,
    },
    {
      blockType: BlockType.PUCK_CONTENT,
      name: 'Szolgáltatások',
      description: 'Szolgáltatás kártyák gridben',
      brand: Brand.BOOM,
      defaultContent: {
        puckData: {
          content: [
            {
              type: 'Section',
              props: {
                variant: 'alternate',
                paddingY: 'lg',
                paddingX: 'md',
                maxWidth: 'wide',
              },
            },
          ],
          root: { props: {} },
        },
      },
      displayOrder: 3,
    },
    {
      blockType: BlockType.PUCK_CONTENT,
      name: 'CTA Szekció',
      description: 'Felhívás cselekvésre blokk',
      brand: Brand.BOOM,
      defaultContent: {
        puckData: {
          content: [
            {
              type: 'Section',
              props: {
                variant: 'primary',
                paddingY: 'lg',
                paddingX: 'md',
                maxWidth: 'narrow',
              },
            },
          ],
          root: { props: {} },
        },
      },
      displayOrder: 4,
    },
  ]

  for (const template of blockTemplates) {
    await prisma.blockTemplate.upsert({
      where: {
        blockType_name_brand: {
          blockType: template.blockType,
          name: template.name,
          brand: template.brand,
        },
      },
      update: {
        description: template.description,
        defaultContent: template.defaultContent,
        displayOrder: template.displayOrder,
      },
      create: template,
    })
  }

  console.log('✅ Created block templates')

  // Create a sample proposal
  await prisma.proposal.upsert({
    where: { slug: 'pelda-ajanlat-2025' },
    update: {},
    create: {
      slug: 'pelda-ajanlat-2025',
      clientName: 'Példa Vállalkozás',
      brand: Brand.BOOM,
      status: 'PUBLISHED',
      createdById: admin.id,
      createdByName: 'Boom Admin',
      blocks: {
        create: [
          {
            blockType: BlockType.PUCK_CONTENT,
            displayOrder: 0,
            content: blockTemplates[0].defaultContent,
          },
          {
            blockType: BlockType.PUCK_CONTENT,
            displayOrder: 1,
            content: blockTemplates[1].defaultContent,
          },
        ],
      },
    },
  })

  console.log('✅ Created sample proposal')

  console.log('🎉 Database seeding completed!')
  console.log(`📧 Admin login: admin@boommarketing.hu / admin123`)
  console.log(`📧 Admin login: admin@aiboost.hu / admin123`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
