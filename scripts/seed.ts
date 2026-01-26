import { hash } from 'bcryptjs'
import { prisma } from '../src/lib/db'

async function seed() {
  console.log('🌱 Seeding database...')

  // Create admin user
  const passwordHash = await hash('admin123', 12)
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@printmedia.fi' },
    update: {},
    create: {
      email: 'admin@printmedia.fi',
      name: 'Admin',
      passwordHash,
      role: 'ADMIN',
    },
  })
  console.log(`✓ Created admin user: ${admin.email}`)

  // Create categories
  const categories = [
    { name: 'Suurkuvatulostimet', slug: 'suurkuvatulostimet', description: 'Eco-solventti ja sublimaatiotulostimet' },
    { name: 'UV-tulostimet', slug: 'uv-tulostimet', description: 'Flatbed ja roll-to-roll UV-tulostimet' },
    { name: 'Leikkurit', slug: 'leikkurit', description: 'Tarkkuusleikkurit ja monitoimileikkurit' },
    { name: 'Laminaattorit', slug: 'laminaattorit', description: 'Kylmä- ja kuumalaminaattorit' },
    { name: 'Display-tuotteet', slug: 'display-tuotteet', description: 'Roll-up, messuseinät, messupöydät' },
    { name: 'Tulostusmateriaalit', slug: 'tulostusmateriaalit', description: 'Vinyyli, paperi, tekstiili' },
    { name: 'Musteet', slug: 'musteet', description: 'Eco-solventti, UV, sublimaatio' },
    { name: 'Varaosat', slug: 'varaosat', description: 'Tulostinpäät, leikkurien terät, varaosat' },
  ]

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    })
  }
  console.log(`✓ Created ${categories.length} categories`)

  // Create pages
  const pages = [
    { 
      slug: 'etusivu', 
      title: 'Etusivu', 
      description: 'PrintMedia Finland - Ammattitason tulostus- ja leikkausratkaisut',
      template: 'home',
      status: 'PUBLISHED' as const,
    },
    { 
      slug: 'yhteystiedot', 
      title: 'Yhteystiedot', 
      description: 'Ota yhteyttä PrintMedia Finland Oy:öön',
      template: 'contact',
      status: 'PUBLISHED' as const,
    },
    { 
      slug: 'huolto', 
      title: 'Huolto ja tuki', 
      description: 'Kattavat huolto- ja tukipalvelut',
      template: 'default',
      status: 'PUBLISHED' as const,
    },
    { 
      slug: 'toimitusehdot', 
      title: 'Toimitusehdot', 
      description: 'PrintMedia Finland Oy toimitusehdot',
      template: 'default',
      status: 'PUBLISHED' as const,
    },
  ]

  for (const page of pages) {
    await prisma.page.upsert({
      where: { slug: page.slug },
      update: page,
      create: {
        ...page,
        authorId: admin.id,
      },
    })
  }
  console.log(`✓ Created ${pages.length} pages`)

  // Create navigation items
  const navItems = [
    { location: 'header', label: 'Etusivu', url: '/', sortOrder: 0 },
    { location: 'header', label: 'Laitteet', url: '/laitteet', sortOrder: 1 },
    { location: 'header', label: 'Tarvikkeet', url: '/tarvikkeet', sortOrder: 2 },
    { location: 'header', label: 'Display', url: '/display', sortOrder: 3 },
    { location: 'header', label: 'Huolto', url: '/huolto', sortOrder: 4 },
    { location: 'header', label: 'Yhteystiedot', url: '/yhteystiedot', sortOrder: 5 },
  ]

  // Delete existing navigation
  await prisma.navigation.deleteMany({})
  
  for (const nav of navItems) {
    await prisma.navigation.create({
      data: nav,
    })
  }
  console.log(`✓ Created ${navItems.length} navigation items`)

  // Create settings
  const settings = [
    { key: 'site_name', value: 'PrintMedia Finland Oy', type: 'string', group: 'general' },
    { key: 'site_description', value: 'Ammattitason tulostus- ja leikkausratkaisut', type: 'string', group: 'general' },
    { key: 'contact_email', value: 'info@printmedia.fi', type: 'string', group: 'contact' },
    { key: 'contact_phone', value: '+358 40 504 8822', type: 'string', group: 'contact' },
    { key: 'contact_address', value: 'Laitilantie 140, 23800 Laitila', type: 'string', group: 'contact' },
    { key: 'business_id', value: '2411638-2', type: 'string', group: 'company' },
    { key: 'office_hours', value: 'Ma-Pe 8:00-16:00', type: 'string', group: 'contact' },
  ]

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: setting,
      create: setting,
    })
  }
  console.log(`✓ Created ${settings.length} settings`)

  console.log('✅ Seeding complete!')
}

seed()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
