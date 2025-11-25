#!/usr/bin/env node

import { Client } from 'pg';
import bcrypt from 'bcryptjs';

// Using local template1 database
const client = new Client({
  connectionString: 'postgres://postgres:postgres@127.0.0.1:51214/template1?sslmode=disable',
});

async function createProposals() {
  try {
    await client.connect();
    console.log('✅ Connected to template1 database');

    // Get admin user
    const userResult = await client.query('SELECT id, name FROM users WHERE email = $1', ['admin@boommarketing.hu']);
    if (userResult.rows.length === 0) {
      console.error('❌ Admin user not found!');
      return;
    }
    const userId = userResult.rows[0].id;
    const userName = userResult.rows[0].name;

    console.log('👤 Using admin user:', userName);

    // Create proposals for Meszék Kft and GreenLeader
    const proposals = [
      {
        slug: 'meszek-kft-marketing-csomag-20241125',
        title: 'Meszék Kft - Komplett marketing csomag 2024',
        client_name: 'Meszék Kft',
        company_name: 'Meszék Kereskedelmi Kft.',
        client_email: 'info@meszek.hu',
        client_phone: '+36 30 123 4567',
        brand: 'BOOM',
        status: 'DRAFT',
        total_amount: 850000,
        currency: 'HUF'
      },
      {
        slug: 'greenleader-digitalis-strategia-20241125',
        title: 'GreenLeader - Digitális marketing stratégia 2024',
        client_name: 'GreenLeader',
        company_name: 'GreenLeader Solutions Zrt.',
        client_email: 'hello@greenleader.hu',
        client_phone: '+36 20 987 6543',
        brand: 'AIBOOST',
        status: 'SENT',
        total_amount: 1200000,
        currency: 'HUF'
      }
    ];

    for (const proposal of proposals) {
      // Check if proposal already exists
      const existing = await client.query('SELECT id FROM proposals WHERE slug = $1', [proposal.slug]);

      if (existing.rows.length > 0) {
        console.log(`⚠️ Proposal ${proposal.slug} already exists, skipping...`);
        continue;
      }

      // Insert proposal (template1 has different field names)
      const result = await client.query(`
        INSERT INTO proposals (
          id, slug, title, client_name, company_name, client_email, client_contact_name, client_phone,
          brand, status, total_amount, currency, created_by_id, created_by_name,
          created_at, updated_at
        ) VALUES (
          gen_random_uuid()::text, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW(), NOW()
        ) RETURNING id
      `, [
        proposal.slug,
        proposal.title,
        proposal.client_name,
        proposal.company_name,
        proposal.client_email,
        proposal.client_name, // Using client_name as contact name
        proposal.client_phone,
        proposal.brand,
        proposal.status,
        proposal.total_amount,
        proposal.currency,
        userId,
        userName
      ]);

      const proposalId = result.rows[0].id;
      console.log(`✅ Created proposal: ${proposal.client_name} (${proposal.slug})`);

      // Add some basic blocks to each proposal
      const blocks = [
        {
          type: 'HERO',
          order: 0,
          content: {
            heading: `${proposal.client_name} - Növeljük online jelenlétét`,
            subheading: 'Professzionális marketing megoldások az Ön vállalkozása számára',
            showCTA: true,
            ctaText: 'Kezdjük el együtt!'
          }
        },
        {
          type: 'VALUE_PROP',
          order: 1,
          content: {
            heading: 'Miért válasszon minket?',
            leftColumn: {
              title: 'Tapasztalat és szakértelem',
              items: [
                '10+ év tapasztalat a digitális marketingben',
                'Dedikált szakértői csapat',
                'Mérhető eredmények garantálva',
                'Folyamatos támogatás és tanácsadás'
              ]
            },
            rightColumn: {
              title: 'Az Ön sikere a mi célunk',
              content: `${proposal.client_name} számára személyre szabott megoldásokat kínálunk, amelyek valódi üzleti eredményeket hoznak. Nem csak kampányokat futtatunk, hanem hosszú távú partneri kapcsolatot építünk.`
            }
          }
        },
        {
          type: 'SERVICES_GRID',
          order: 2,
          content: {
            heading: 'Szolgáltatásaink az Ön számára',
            subheading: `${proposal.client_name} egyedi igényeihez igazítva`,
            services: [
              {
                id: '1',
                title: 'Social Media Marketing',
                description: 'Facebook, Instagram és LinkedIn kampányok',
                variant: 'service',
                iconType: 'facebook',
                benefits: ['Célzott hirdetések', 'Közösségépítés', 'Tartalomgyártás']
              },
              {
                id: '2',
                title: 'Google Ads',
                description: 'Keresőhirdetések és remarketing',
                variant: 'service',
                iconType: 'google',
                benefits: ['Kulcsszó optimalizálás', 'Konverzió követés', 'ROI maximalizálás']
              }
            ]
          }
        },
        {
          type: 'PRICING_TABLE',
          order: 3,
          content: {
            heading: 'Egyedi árajánlatunk',
            description: `Speciálisan ${proposal.client_name} számára összeállított csomag`,
            plans: [
              {
                id: '1',
                name: 'Teljes körű csomag',
                description: 'Minden, amire szüksége van',
                discountedPrice: proposal.total_amount,
                currency: proposal.currency,
                billingPeriod: 'monthly',
                isPopular: true,
                features: [
                  'Social media kezelés',
                  'Google Ads kampányok',
                  'Havi riportolás',
                  'Dedikált account manager',
                  'Kreatív tervezés',
                  'A/B tesztelés'
                ],
                ctaText: 'Ezt választom'
              }
            ]
          }
        },
        {
          type: 'CTA',
          order: 4,
          content: {
            heading: 'Kezdjük el a közös munkát!',
            description: `Várjuk ${proposal.client_name} visszajelzését. Készek vagyunk megvalósítani az Ön digitális marketing céljait.`,
            primaryCta: {
              text: 'Elfogadom az ajánlatot',
              url: '#accept'
            },
            secondaryCta: {
              text: 'Egyeztessünk telefonon',
              url: `tel:${proposal.client_phone}`
            }
          }
        }
      ];

      // Insert blocks
      for (const block of blocks) {
        await client.query(`
          INSERT INTO proposal_blocks (
            id, proposal_id, block_type, display_order, is_enabled, content,
            created_at, updated_at
          ) VALUES (
            gen_random_uuid()::text, $1, $2, $3, true, $4, NOW(), NOW()
          )
        `, [proposalId, block.type, block.order, JSON.stringify(block.content)]);
      }

      console.log(`   📦 Added ${blocks.length} blocks to proposal`);
    }

    // Show summary
    const allProposals = await client.query('SELECT slug, client_name, status FROM proposals ORDER BY created_at DESC');
    console.log('\n📊 All proposals in template1 database:');
    allProposals.rows.forEach((p, i) => {
      console.log(`${i + 1}. ${p.client_name} (${p.slug}) - Status: ${p.status}`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.end();
  }
}

createProposals();