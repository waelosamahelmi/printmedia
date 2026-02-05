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
    { name: 'Suurkuvatulostimet', slug: 'suurkuvatulostimet', description: 'Eco-solventti ja sublimaatiotulostimet', sortOrder: 1 },
    { name: 'UV-tulostimet', slug: 'uv-tulostimet', description: 'Flatbed ja roll-to-roll UV-tulostimet', sortOrder: 2 },
    { name: 'Leikkurit', slug: 'leikkurit', description: 'Tarkkuusleikkurit ja monitoimileikkurit', sortOrder: 3 },
    { name: 'Laminaattorit', slug: 'laminaattorit', description: 'Kylmä- ja kuumalaminaattorit', sortOrder: 4 },
    { name: 'Display-tuotteet', slug: 'display-tuotteet', description: 'Roll-up, messuseinät, messupöydät', sortOrder: 5 },
    { name: 'Roll-up telineet', slug: 'roll-up', description: 'Roll-up mainostelineet eri kokoissa', sortOrder: 6 },
    { name: 'Messuseinät', slug: 'messuseinat', description: 'Pop-up seinät ja messuseinäkkeet', sortOrder: 7 },
    { name: 'Messupöydät', slug: 'messupoydat', description: 'Messupöydät ja esittelypöydät', sortOrder: 8 },
    { name: 'Tulostusmateriaalit', slug: 'tulostusmateriaalit', description: 'Vinyyli, paperi, tekstiili', sortOrder: 9 },
    { name: 'Musteet', slug: 'musteet', description: 'Eco-solventti, UV, sublimaatio', sortOrder: 10 },
    { name: 'Varaosat', slug: 'varaosat', description: 'Tulostinpäät, leikkurien terät, varaosat', sortOrder: 11 },
    { name: 'Muut tarvikkeet', slug: 'muut-tarvikkeet', description: 'Muut tulostus- ja leikkaustarvikkeet', sortOrder: 12 },
  ]

  const createdCategories: Record<string, string> = {}
  for (const cat of categories) {
    const category = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    })
    createdCategories[cat.slug] = category.id
  }
  console.log(`✓ Created ${categories.length} categories`)

  // Create pages
  const pages = [
    { 
      slug: 'etusivu', 
      title: 'Etusivu', 
      description: 'PrintMedia Finland - Ammattitason tulostus- ja leikkausratkaisut',
      content: '<h1>Tervetuloa PrintMedia Finlandiin</h1><p>Tarjoamme laadukkaita tulostus- ja leikkausratkaisuja ammattikäyttöön.</p>',
      template: 'home',
      status: 'PUBLISHED' as const,
    },
    { 
      slug: 'yritys', 
      title: 'Yritys', 
      description: 'PrintMedia Finland Oy - Luotettava kumppani tulostusratkaisuissa',
      content: '<h1>PrintMedia Finland Oy</h1><p>Olemme erikoistuneet suurkuvatulostus- ja leikkausratkaisuihin jo vuodesta 2012.</p><p>Tarjoamme kattavan valikoiman tulostimia, leikkureita, laminaattoreita ja tarvikkeita.</p>',
      template: 'default',
      status: 'PUBLISHED' as const,
    },
    { 
      slug: 'yhteystiedot', 
      title: 'Yhteystiedot', 
      description: 'Ota yhteyttä PrintMedia Finland Oy:öön',
      content: '<h1>Ota yhteyttä</h1><p>Autamme sinua löytämään sopivat ratkaisut tarpeisiisi.</p>',
      template: 'contact',
      status: 'PUBLISHED' as const,
    },
    { 
      slug: 'huolto-ja-tuki', 
      title: 'Huolto ja tuki', 
      description: 'Kattavat huolto- ja tukipalvelut laitteillesi',
      content: '<h1>Huolto ja tuki</h1><p>Tarjoamme kattavat huolto- ja tukipalvelut kaikille myymillemme laitteille.</p><h2>Palvelumme</h2><ul><li>Ennakkohuollot</li><li>Korjaukset</li><li>Etätuki</li><li>Varaosat</li></ul>',
      template: 'default',
      status: 'PUBLISHED' as const,
    },
    { 
      slug: 'toimitusehdot', 
      title: 'Toimitusehdot', 
      description: 'PrintMedia Finland Oy toimitusehdot',
      content: '<h1>Toimitusehdot</h1><h2>Tilaaminen</h2><p>Tilaukset käsitellään arkipäivisin. Tilausvahvistus lähetetään sähköpostitse.</p><h2>Toimitus</h2><p>Toimitusaika vaihtelee tuotteittain 1-14 arkipäivää.</p><h2>Maksuehdot</h2><p>Hyväksymme maksukortin, laskun ja ennakkomaksun.</p>',
      template: 'default',
      status: 'PUBLISHED' as const,
    },
    { 
      slug: 'laitteet', 
      title: 'Laitteet', 
      description: 'Suurkuvatulostimet, UV-tulostimet, leikkurit ja laminaattorit',
      content: '<h1>Laitteet</h1><p>Löydä täydellinen laite tulostus- ja leikkaustarpeisiisi. Tarjoamme laajan valikoiman ammattitason laitteita.</p>',
      template: 'default',
      status: 'PUBLISHED' as const,
    },
    { 
      slug: 'tarvikkeet', 
      title: 'Tarvikkeet', 
      description: 'Tulostusmateriaalit, musteet ja muut tarvikkeet',
      content: '<h1>Tarvikkeet</h1><p>Laaja valikoima tulostusmateriaaleja, musteita ja muita tarvikkeita.</p>',
      template: 'default',
      status: 'PUBLISHED' as const,
    },
    { 
      slug: 'display', 
      title: 'Display-tuotteet', 
      description: 'Roll-up telineet, messuseinät ja messupöydät',
      content: '<h1>Display-tuotteet</h1><p>Korkealaatuiset display-tuotteet messuille ja tapahtumiin.</p>',
      template: 'default',
      status: 'PUBLISHED' as const,
    },
    { 
      slug: 'hinnasto', 
      title: 'Hinnasto', 
      description: 'Tuotteiden ja palveluiden hinnasto',
      content: '<h1>Hinnasto</h1><p>Pyydä tarjous haluamistasi tuotteista ja palveluista.</p>',
      template: 'default',
      status: 'PUBLISHED' as const,
    },
    { 
      slug: 'tulostusvarit', 
      title: 'Tulostusvärit', 
      description: 'Laadukkaat tulostusvärit ja musteet',
      content: '<h1>Tulostusvärit</h1><p>Tarjoamme laadukkaita tulostusmusteita eri tulostusteknologioille.</p>',
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

  // Create products
  const products = [
    // Suurkuvatulostimet
    {
      slug: 'roland-truevis-vg3-640',
      sku: 'RTV-VG3-640',
      name: 'Roland TrueVIS VG3-640',
      shortDesc: 'Korkealaatuinen 64" eco-solventtitulostin',
      description: '<p>Roland TrueVIS VG3-640 on huippuluokan eco-solventtitulostin, joka yhdistää erinomaisen tulostuslaadun ja tuottavuuden.</p><p>FlexFire-tulostuspäät tuottavat tarkkoja ja eloisia tulosteita.</p>',
      features: JSON.stringify(['64" tulostusleveys', 'FlexFire tulostuspäät', 'True Rich Color 2', 'Automaattinen medialataus', 'Integroitu leikkuri']),
      specs: JSON.stringify({ 'Tulostusleveys': '1625 mm', 'Resoluutio': '1200 dpi', 'Nopeus': '18.1 m²/h', 'Värit': 'CMYK + Lc, Lm, Wh, Or' }),
      price: 24900,
      priceType: 'quote',
      status: 'PUBLISHED' as const,
      isFeatured: true,
      categorySlug: 'suurkuvatulostimet',
    },
    {
      slug: 'roland-truevis-vg3-540',
      sku: 'RTV-VG3-540',
      name: 'Roland TrueVIS VG3-540',
      shortDesc: 'Ammattitason 54" eco-solventtitulostin',
      description: '<p>Roland TrueVIS VG3-540 tarjoaa erinomaisen tulostuslaadun kompaktimmassa koossa.</p>',
      features: JSON.stringify(['54" tulostusleveys', 'FlexFire tulostuspäät', 'True Rich Color 2', 'Integroitu leikkuri']),
      specs: JSON.stringify({ 'Tulostusleveys': '1371 mm', 'Resoluutio': '1200 dpi', 'Nopeus': '15.2 m²/h' }),
      price: 19900,
      priceType: 'quote',
      status: 'PUBLISHED' as const,
      isFeatured: false,
      categorySlug: 'suurkuvatulostimet',
    },
    // UV-tulostimet
    {
      slug: 'docan-fr3200',
      sku: 'DOC-FR3200',
      name: 'DOCAN FR3200 UV',
      shortDesc: '3.2m roll-to-roll UV-tulostin',
      description: '<p>DOCAN FR3200 on tehokas roll-to-roll UV-tulostin suuriin tuotantomääriin.</p>',
      features: JSON.stringify(['3.2m tulostusleveys', 'Ricoh Gen5 päät', 'UV LED -kovetus', 'Korkea tuotantonopeus']),
      specs: JSON.stringify({ 'Tulostusleveys': '3200 mm', 'Resoluutio': '1440 dpi', 'Nopeus': '45 m²/h' }),
      price: 45000,
      priceType: 'quote',
      status: 'PUBLISHED' as const,
      isFeatured: true,
      categorySlug: 'uv-tulostimet',
    },
    {
      slug: 'docan-m8',
      sku: 'DOC-M8',
      name: 'DOCAN M8 UV Flatbed',
      shortDesc: 'Monipuolinen UV-flatbed tulostin',
      description: '<p>DOCAN M8 on monipuolinen flatbed UV-tulostin erilaisille materiaaleille.</p>',
      features: JSON.stringify(['2.5 x 1.3m tulostusalue', 'Ricoh Gen6 päät', 'Valkoinen muste', 'Lakkaustoiminto']),
      specs: JSON.stringify({ 'Tulostusalue': '2500 x 1300 mm', 'Resoluutio': '1440 dpi', 'Materiaalin paksuus': 'max 100mm' }),
      price: 55000,
      priceType: 'quote',
      status: 'PUBLISHED' as const,
      isFeatured: true,
      categorySlug: 'uv-tulostimet',
    },
    // Leikkurit
    {
      slug: 'gcc-jaguar-v-lx',
      sku: 'GCC-JAG-VLX',
      name: 'GCC Jaguar V LX',
      shortDesc: 'Ammattilaistason tarraleikkuri',
      description: '<p>GCC Jaguar V LX on luotettava tarraleikkuri ammattikäyttöön.</p>',
      features: JSON.stringify(['Servo-moottori', 'Automaattinen contour cut', 'USB ja Ethernet', 'Optiline-tunnistus']),
      specs: JSON.stringify({ 'Leikkuuleveys': '1520 mm', 'Nopeus': '1530 mm/s', 'Paine': 'max 500g' }),
      price: 3990,
      priceType: 'fixed',
      status: 'PUBLISHED' as const,
      isFeatured: true,
      categorySlug: 'leikkurit',
    },
    {
      slug: 'gcc-puma-iv',
      sku: 'GCC-PUM-IV',
      name: 'GCC Puma IV',
      shortDesc: 'Kompakti ja tehokas tarraleikkuri',
      description: '<p>GCC Puma IV on kompakti tarraleikkuri pienempiin tuotantomääriin.</p>',
      features: JSON.stringify(['Kompakti koko', 'Hiljainen toiminta', 'USB-liitäntä', 'FlexCut-toiminto']),
      specs: JSON.stringify({ 'Leikkuuleveys': '610 mm', 'Nopeus': '1000 mm/s', 'Paine': 'max 400g' }),
      price: 1290,
      priceType: 'fixed',
      status: 'PUBLISHED' as const,
      isFeatured: false,
      categorySlug: 'leikkurit',
    },
    {
      slug: 'summa-s-class-2-t140',
      sku: 'SUM-SC2-T140',
      name: 'Summa S Class 2 T140',
      shortDesc: 'Monitoimileikkuri tangentiaalisella terällä',
      description: '<p>Summa S Class 2 T140 on monipuolinen monitoimileikkuri vaativaan käyttöön.</p>',
      features: JSON.stringify(['Tangentiaalinen terä', 'Automaattinen työkalunvaihto', 'OPOS CAM', 'Modulaarinen rakenne']),
      specs: JSON.stringify({ 'Leikkuuleveys': '1400 mm', 'Nopeus': '1130 mm/s', 'Paine': 'max 600g' }),
      price: 8900,
      priceType: 'quote',
      status: 'PUBLISHED' as const,
      isFeatured: true,
      categorySlug: 'leikkurit',
    },
    // Laminaattorit
    {
      slug: 'royal-sovereign-rsc-1651lsw',
      sku: 'RSO-1651LSW',
      name: 'Royal Sovereign RSC-1651LSW',
      shortDesc: '65" kylmälaminaattori',
      description: '<p>Royal Sovereign RSC-1651LSW on tehokas kylmälaminaattori suurille töille.</p>',
      features: JSON.stringify(['65" leveys', 'Kylmälaminointi', 'Lämmitetyt telat', 'Automaattinen leikkuri']),
      specs: JSON.stringify({ 'Laminointileveys': '1650 mm', 'Nopeus': '6 m/min', 'Materiaalin paksuus': 'max 50mm' }),
      price: 4990,
      priceType: 'fixed',
      status: 'PUBLISHED' as const,
      isFeatured: false,
      categorySlug: 'laminaattorit',
    },
    // Display-tuotteet
    {
      slug: 'roll-up-standard-85',
      sku: 'RUP-STD-85',
      name: 'Roll-Up Standard 85x200cm',
      shortDesc: 'Edullinen roll-up mainosteline',
      description: '<p>Laadukas perus roll-up teline markkinointiin ja mainontaan.</p>',
      features: JSON.stringify(['85x200cm', 'Alumiinirunko', 'Kantolaukku', 'Helppo pystytys']),
      specs: JSON.stringify({ 'Koko': '85 x 200 cm', 'Materiaali': 'Alumiini', 'Paino': '3.5 kg' }),
      price: 89,
      priceType: 'fixed',
      status: 'PUBLISHED' as const,
      isFeatured: false,
      categorySlug: 'roll-up',
    },
    {
      slug: 'roll-up-premium-100',
      sku: 'RUP-PRE-100',
      name: 'Roll-Up Premium 100x200cm',
      shortDesc: 'Premium roll-up laadukkaalla mekanismilla',
      description: '<p>Premium-laatuinen roll-up teline vaativaan ammattikäyttöön.</p>',
      features: JSON.stringify(['100x200cm', 'Premium-mekanismi', 'Vaihdettava kuva', 'Kantolaukku']),
      specs: JSON.stringify({ 'Koko': '100 x 200 cm', 'Materiaali': 'Alumiini Premium', 'Paino': '4.5 kg' }),
      price: 149,
      priceType: 'fixed',
      status: 'PUBLISHED' as const,
      isFeatured: true,
      categorySlug: 'roll-up',
    },
    {
      slug: 'messupoyta-tiski',
      sku: 'MES-TIS-01',
      name: 'Messupöytä Tiski',
      shortDesc: 'Kompakti messupöytä grafiikalla',
      description: '<p>Kompakti messupöytä on helppo kuljettaa ja pystyttää.</p>',
      features: JSON.stringify(['Alumiinirunko', 'Painettu grafiikka', 'Hyllytaso', 'Kantolaukku']),
      specs: JSON.stringify({ 'Koko': '100 x 100 x 90 cm', 'Materiaali': 'Alumiini + kangas', 'Paino': '8 kg' }),
      price: 299,
      priceType: 'fixed',
      status: 'PUBLISHED' as const,
      isFeatured: false,
      categorySlug: 'messupoydat',
    },
    {
      slug: 'pop-up-3x3',
      sku: 'POP-33-01',
      name: 'Pop-Up Messuseinä 3x3',
      shortDesc: 'Suosittu 3x3 pop-up seinä',
      description: '<p>Suosituin messuseinämalli joka sopii useimpiin tarpeisiin.</p>',
      features: JSON.stringify(['3x3 moduulia', 'Magneettikiinnitys', 'LED-valot saatavilla', 'Kantolaukku']),
      specs: JSON.stringify({ 'Koko': '2980 x 2240 mm', 'Materiaali': 'Alumiini + magneettipaneelit', 'Paino': '18 kg' }),
      price: 890,
      priceType: 'fixed',
      status: 'PUBLISHED' as const,
      isFeatured: true,
      categorySlug: 'messuseinat',
    },
    // Musteet
    {
      slug: 'jetbest-eco-solvent-cmyk',
      sku: 'JB-ECO-CMYK',
      name: 'JetBest Eco-Solvent CMYK',
      shortDesc: 'Laadukas eco-solventtimuste',
      description: '<p>JetBest eco-solventtimuste on suunniteltu Roland, Mimaki ja Mutoh tulostimille.</p>',
      features: JSON.stringify(['1 litran pullo', 'CMYK värit', 'Roland/Mimaki/Mutoh yhteensopiva', 'Erinomainen värintoisto']),
      specs: JSON.stringify({ 'Tilavuus': '1000 ml', 'Tyyppi': 'Eco-solventti', 'Yhteensopivuus': 'Roland, Mimaki, Mutoh' }),
      price: 89,
      priceType: 'fixed',
      status: 'PUBLISHED' as const,
      isFeatured: false,
      categorySlug: 'musteet',
    },
    // Materiaalit
    {
      slug: 'vinyyli-kiiltava-valkoinen',
      sku: 'VIN-KIIL-VAL',
      name: 'Vinyyli kiiltävä valkoinen',
      shortDesc: 'Laadukas tarravinyyli 1370mm',
      description: '<p>Laadukas kiiltävä valkoinen tarravinyyli ulko- ja sisäkäyttöön.</p>',
      features: JSON.stringify(['1370mm leveys', '50m rulla', 'Kiiltävä pinta', '3 vuoden ulkokestävyys']),
      specs: JSON.stringify({ 'Leveys': '1370 mm', 'Pituus': '50 m', 'Paksuus': '80 µm', 'Kestävyys': '3 vuotta' }),
      price: 149,
      priceType: 'fixed',
      status: 'PUBLISHED' as const,
      isFeatured: false,
      categorySlug: 'tulostusmateriaalit',
    },
    {
      slug: 'bannermesh-370g',
      sku: 'BAN-MESH-370',
      name: 'Bannermesh 370g',
      shortDesc: 'Tuulta läpäisevä mesh-kangas',
      description: '<p>Bannermesh on tuulta läpäisevä mesh-kangas ulkomainontaan.</p>',
      features: JSON.stringify(['370g/m²', '1600mm leveys', 'Tuulta läpäisevä', 'Ulkokäyttöön']),
      specs: JSON.stringify({ 'Leveys': '1600 mm', 'Paino': '370 g/m²', 'Pituus': '50 m' }),
      price: 199,
      priceType: 'fixed',
      status: 'PUBLISHED' as const,
      isFeatured: false,
      categorySlug: 'tulostusmateriaalit',
    },
  ]

  for (const product of products) {
    const { categorySlug, ...productData } = product
    const categoryId = createdCategories[categorySlug]
    
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: { ...productData, categoryId },
      create: {
        ...productData,
        categoryId,
        authorId: admin.id,
      },
    })
  }
  console.log(`✓ Created ${products.length} products`)

  // Create navigation items
  const navItems = [
    // Header navigation
    { location: 'header', label: 'Etusivu', url: '/', sortOrder: 0, isVisible: true },
    { location: 'header', label: 'Laitteet', url: '/laitteet', sortOrder: 1, isVisible: true },
    { location: 'header', label: 'Tarvikkeet', url: '/tarvikkeet', sortOrder: 2, isVisible: true },
    { location: 'header', label: 'Display', url: '/display', sortOrder: 3, isVisible: true },
    { location: 'header', label: 'Huolto', url: '/huolto', sortOrder: 4, isVisible: true },
    { location: 'header', label: 'Yhteystiedot', url: '/yhteystiedot', sortOrder: 5, isVisible: true },
    // Footer navigation
    { location: 'footer', label: 'Etusivu', url: '/', sortOrder: 0, isVisible: true },
    { location: 'footer', label: 'Yritys', url: '/yritys', sortOrder: 1, isVisible: true },
    { location: 'footer', label: 'Toimitusehdot', url: '/toimitusehdot', sortOrder: 2, isVisible: true },
    { location: 'footer', label: 'Tietosuoja', url: '/tietosuoja', sortOrder: 3, isVisible: true },
    { location: 'footer', label: 'Yhteystiedot', url: '/yhteystiedot', sortOrder: 4, isVisible: true },
    // Mobile navigation  
    { location: 'mobile', label: 'Etusivu', url: '/', sortOrder: 0, isVisible: true },
    { location: 'mobile', label: 'Laitteet', url: '/laitteet', sortOrder: 1, isVisible: true },
    { location: 'mobile', label: 'Tarvikkeet', url: '/tarvikkeet', sortOrder: 2, isVisible: true },
    { location: 'mobile', label: 'Display', url: '/display', sortOrder: 3, isVisible: true },
    { location: 'mobile', label: 'Huolto', url: '/huolto', sortOrder: 4, isVisible: true },
    { location: 'mobile', label: 'Yhteystiedot', url: '/yhteystiedot', sortOrder: 5, isVisible: true },
  ]

  // Delete existing navigation
  await prisma.navigation.deleteMany({})
  
  for (const nav of navItems) {
    await prisma.navigation.create({
      data: nav,
    })
  }
  console.log(`✓ Created ${navItems.length} navigation items`)

  // Create media entries
  const mediaItems = [
    { filename: 'logo.svg', originalName: 'PrintMedia Logo', url: '/images/logos/logo.svg', mimeType: 'image/svg+xml', fileSize: 5000, folder: 'logos' },
    { filename: 'logo-white.svg', originalName: 'PrintMedia Logo White', url: '/images/logos/logo-white.svg', mimeType: 'image/svg+xml', fileSize: 5000, folder: 'logos' },
    { filename: 'roland-truevis.jpg', originalName: 'Roland TrueVIS VG3', url: '/images/products/roland-truevis.jpg', mimeType: 'image/jpeg', fileSize: 150000, width: 1200, height: 800, folder: 'products' },
    { filename: 'docan-fr3200.jpg', originalName: 'DOCAN FR3200', url: '/images/products/docan-fr3200.jpg', mimeType: 'image/jpeg', fileSize: 145000, width: 1200, height: 800, folder: 'products' },
    { filename: 'gcc-jaguar.jpg', originalName: 'GCC Jaguar V LX', url: '/images/products/gcc-jaguar.jpg', mimeType: 'image/jpeg', fileSize: 120000, width: 1200, height: 800, folder: 'products' },
    { filename: 'roll-up-standard.jpg', originalName: 'Roll-Up Standard', url: '/images/products/rollups/roll-up-standard.jpg', mimeType: 'image/jpeg', fileSize: 80000, width: 800, height: 1200, folder: 'products/rollups' },
    { filename: 'pop-up-3x3.jpg', originalName: 'Pop-Up 3x3', url: '/images/products/walls/pop-up-3x3.jpg', mimeType: 'image/jpeg', fileSize: 95000, width: 1200, height: 800, folder: 'products/walls' },
    { filename: 'messupoyta.jpg', originalName: 'Messupöytä', url: '/images/products/tables/messupoyta.jpg', mimeType: 'image/jpeg', fileSize: 85000, width: 1200, height: 800, folder: 'products/tables' },
  ]

  // Delete existing media
  await prisma.media.deleteMany({})
  
  for (const media of mediaItems) {
    await prisma.media.create({
      data: media,
    })
  }
  console.log(`✓ Created ${mediaItems.length} media items`)

  // Create settings
  const settings = [
    { key: 'site_name', value: 'PrintMedia Finland Oy', type: 'string', group: 'general' },
    { key: 'site_description', value: 'Ammattitason tulostus- ja leikkausratkaisut', type: 'string', group: 'general' },
    { key: 'site_logo', value: '/images/logos/logo.svg', type: 'string', group: 'general' },
    { key: 'contact_email', value: 'info@printmedia.fi', type: 'string', group: 'contact' },
    { key: 'contact_phone', value: '+358 40 504 8822', type: 'string', group: 'contact' },
    { key: 'contact_address', value: 'Laitilantie 140\n23800 Laitila\nSuomi', type: 'string', group: 'contact' },
    { key: 'business_id', value: '2411638-2', type: 'string', group: 'contact' },
    { key: 'office_hours', value: 'Ma-Pe 8:00-16:00', type: 'string', group: 'contact' },
    { key: 'facebook_url', value: 'https://facebook.com/printmediafinland', type: 'string', group: 'social' },
    { key: 'instagram_url', value: 'https://instagram.com/printmediafinland', type: 'string', group: 'social' },
    { key: 'linkedin_url', value: 'https://linkedin.com/company/printmedia-finland', type: 'string', group: 'social' },
    { key: 'meta_title', value: 'PrintMedia Finland Oy - Tulostus- ja leikkausratkaisut', type: 'string', group: 'seo' },
    { key: 'meta_description', value: 'PrintMedia Finland Oy tarjoaa ammattitason tulostus- ja leikkausratkaisuja. Suurkuvatulostimet, leikkurit, laminaattorit ja tulostustarvikkeet.', type: 'string', group: 'seo' },
    { key: 'meta_keywords', value: 'suurkuvatulostus, tulostimet, leikkurit, laminaattorit, PrintMedia', type: 'string', group: 'seo' },
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
