const bcrypt = require('bcryptjs')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function seed() {
  console.log('🌱 Seeding database with real content...')
  
  // Clean up existing data first (in correct order due to foreign keys)
  console.log('🧹 Cleaning existing data...')
  await prisma.productDocument.deleteMany({})
  await prisma.productImage.deleteMany({})
  await prisma.section.deleteMany({})
  await prisma.product.deleteMany({})
  await prisma.page.deleteMany({})
  await prisma.category.deleteMany({})
  await prisma.navigation.deleteMany({})
  await prisma.media.deleteMany({})
  await prisma.setting.deleteMany({})
  console.log('✓ Cleaned existing data')

  // Create admin user
  const passwordHash = await bcrypt.hash('admin123', 12)
  
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

  // Create REAL categories from the original website
  const categories = [
    // Device categories
    { 
      name: 'Docan UV-tulostimet', 
      slug: 'docan-uv-tulostimet', 
      description: 'Flatbed ja roll-to-roll UV-tulostimet monipuoliseen tulostukseen',
      image: '/images/devices/docan_h3000r_m10_574x.png',
      sortOrder: 1 
    },
    { 
      name: 'GCC Tarraleikkurit', 
      slug: 'gcc-tarraleikkurit', 
      description: 'RXII Professional ja Jaguar V tarkkuusleikkurit',
      image: '/images/devices/RXII_132_400.png',
      sortOrder: 2 
    },
    { 
      name: 'Monitoimileikkurit', 
      slug: 'monitoimileikkurit', 
      description: 'Jingwei CB03II ja CB08II flatbed-monitoimileikkurit',
      image: '/images/devices/cb03ii_500px_500x.jpg',
      sortOrder: 3 
    },
    { 
      name: 'Laminaattorit', 
      slug: 'laminaattorit', 
      description: 'Fayon FY1600 SE pneumaattinen kylmälaminaattori',
      image: '/images/devices/fayon-1600se.png',
      sortOrder: 4 
    },
    // Display categories
    { 
      name: 'Display-tuotteet', 
      slug: 'display-tuotteet', 
      description: 'Roll-up telineet, messuseinät ja messupöydät',
      image: '/images/products/rollups/deluxe_1_uusi_kuva_laukku.jpg',
      sortOrder: 5 
    },
    { 
      name: 'Roll-up telineet', 
      slug: 'roll-up', 
      description: 'Helposti kuljetettavat roll-up telineet messuille ja tapahtumiin. Spyro, Export, Luxury, Deluxe ja Mini mallit.',
      image: '/images/products/rollups/deluxe_1_uusi_kuva_laukku.jpg',
      sortOrder: 6 
    },
    { 
      name: 'Messuseinät', 
      slug: 'messuseinat', 
      description: 'Pop-up messuseinät suorina ja kaarevina malleina. Magneettikiinnityksellä.',
      image: '/images/products/walls/suora_messuseina.jpg',
      sortOrder: 7 
    },
    { 
      name: 'Messupöydät', 
      slug: 'messupoydat', 
      description: 'Esittelypöydät ja promopöydät messuille. Sis. kuljetuslaukun.',
      image: '/images/products/tables/promopyt_1_uusi_kuva_1.jpg',
      sortOrder: 8 
    },
    // Supplies categories
    { 
      name: 'Tarvikkeet', 
      slug: 'tarvikkeet', 
      description: 'JetBest musteet, tulostusmateriaalit ja lisätarvikkeet',
      image: '/images/logos/jetbest_sahkoposti.jpg',
      sortOrder: 9 
    },
    { 
      name: 'Muut tarvikkeet', 
      slug: 'muut-tarvikkeet', 
      description: 'Turvaviivaimet, Bungee Ball -kiinnikkeet, Banner Clip -kiinnikkeet ja muut tarvikkeet.',
      image: '/images/products/accessories/bannerclip.jpg',
      sortOrder: 10 
    },
    { 
      name: 'Tulostusmateriaalit', 
      slug: 'tulostusmateriaalit', 
      description: 'Vinyyli, paperi, tekstiili ja muut tulostusmateriaalit',
      sortOrder: 11 
    },
    { 
      name: 'Tulostusvärit', 
      slug: 'tulostusvarit', 
      description: 'Eco-solventti, UV ja sublimaatiomusteet',
      sortOrder: 12 
    },
  ]

  const createdCategories = {}
  for (const cat of categories) {
    const category = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    })
    createdCategories[cat.slug] = category.id
  }
  console.log(`✓ Created ${categories.length} categories`)

  // Variable to store created product IDs
  const createdProducts = {}

  // Create pages
  const pages = [
    { 
      slug: 'etusivu', 
      title: 'Etusivu', 
      description: 'PrintMedia Finland - Ammattitason tulostus- ja leikkausratkaisut',
      content: '<h1>Tervetuloa PrintMedia Finlandiin</h1><p>Tarjoamme laadukkaita tulostus- ja leikkausratkaisuja ammattikäyttöön.</p>',
      template: 'home',
      status: 'PUBLISHED',
    },
    { 
      slug: 'yritys', 
      title: 'Yritys', 
      description: 'PrintMedia Finland Oy - Luotettava kumppani tulostusratkaisuissa',
      content: '<h1>PrintMedia Finland Oy</h1><p>Olemme erikoistuneet suurkuvatulostus- ja leikkausratkaisuihin jo vuodesta 2012.</p><p>Tarjoamme kattavan valikoiman tulostimia, leikkureita, laminaattoreita ja tarvikkeita.</p>',
      template: 'default',
      status: 'PUBLISHED',
    },
    { 
      slug: 'yhteystiedot', 
      title: 'Yhteystiedot', 
      description: 'Ota yhteyttä PrintMedia Finland Oy:öön',
      content: '<h1>Ota yhteyttä</h1><p>Autamme sinua löytämään sopivat ratkaisut tarpeisiisi.</p>',
      template: 'contact',
      status: 'PUBLISHED',
    },
    { 
      slug: 'huolto-ja-tuki', 
      title: 'Huolto ja tuki', 
      description: 'Kattavat huolto- ja tukipalvelut laitteillesi',
      content: '<h1>Huolto ja tuki</h1><p>Tarjoamme kattavat huolto- ja tukipalvelut kaikille myymillemme laitteille.</p><h2>Palvelumme</h2><ul><li>Ennakkohuollot</li><li>Korjaukset</li><li>Etätuki</li><li>Varaosat</li></ul>',
      template: 'default',
      status: 'PUBLISHED',
    },
    { 
      slug: 'toimitusehdot', 
      title: 'Toimitusehdot', 
      description: 'PrintMedia Finland Oy toimitusehdot',
      content: '<h1>Toimitusehdot</h1><h2>Tilaaminen</h2><p>Tilaukset käsitellään arkipäivisin. Tilausvahvistus lähetetään sähköpostitse.</p><h2>Toimitus</h2><p>Toimitusaika vaihtelee tuotteittain 1-14 arkipäivää.</p><h2>Maksuehdot</h2><p>Hyväksymme maksukortin, laskun ja ennakkomaksun.</p>',
      template: 'default',
      status: 'PUBLISHED',
    },
    { 
      slug: 'laitteet', 
      title: 'Laitteet', 
      description: 'Suurkuvatulostimet, UV-tulostimet, leikkurit ja laminaattorit',
      content: '<h1>Laitteet</h1><p>Löydä täydellinen laite tulostus- ja leikkaustarpeisiisi. Tarjoamme laajan valikoiman ammattitason laitteita.</p>',
      template: 'default',
      status: 'PUBLISHED',
    },
    { 
      slug: 'tarvikkeet', 
      title: 'Tarvikkeet', 
      description: 'Tulostusmateriaalit, musteet ja muut tarvikkeet',
      content: '<h1>Tarvikkeet</h1><p>Laaja valikoima tulostusmateriaaleja, musteita ja muita tarvikkeita.</p>',
      template: 'default',
      status: 'PUBLISHED',
    },
    { 
      slug: 'display', 
      title: 'Display-tuotteet', 
      description: 'Roll-up telineet, messuseinät ja messupöydät',
      content: '<h1>Display-tuotteet</h1><p>Korkealaatuiset display-tuotteet messuille ja tapahtumiin.</p>',
      template: 'default',
      status: 'PUBLISHED',
    },
    { 
      slug: 'hinnasto', 
      title: 'Hinnasto', 
      description: 'Tuotteiden ja palveluiden hinnasto',
      content: '<h1>Hinnasto</h1><p>Pyydä tarjous haluamistasi tuotteista ja palveluista.</p>',
      template: 'default',
      status: 'PUBLISHED',
    },
    { 
      slug: 'tulostusvarit', 
      title: 'Tulostusvärit', 
      description: 'Laadukkaat tulostusvärit ja musteet',
      content: '<h1>Tulostusvärit</h1><p>Tarjoamme laadukkaita tulostusmusteita eri tulostusteknologioille.</p>',
      template: 'default',
      status: 'PUBLISHED',
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

  // Create REAL products from the original website
  const products = [
    // Featured products from home page
    {
      slug: 'docan-h3000r-m10',
      sku: 'DOC-H3000R-M10',
      name: 'Docan H3000r M10',
      shortDesc: 'UV-tulostin 10-värisellä päällä',
      description: '<p>Docan H3000r M10 on huippuluokan UV-tulostin monipuoliseen tulostukseen. Flatbed ja roll-to-roll toiminnallisuus.</p>',
      features: JSON.stringify(['10-värinen tulostus', 'Flatbed ja roll-to-roll', 'Ricoh tulostuspäät', 'UV LED kovetus']),
      specs: JSON.stringify({ 'Tulostusleveys': '3000 mm', 'Resoluutio': '1440 dpi' }),
      priceType: 'quote',
      status: 'PUBLISHED',
      isFeatured: true,
      categorySlug: 'docan-uv-tulostimet',
    },
    {
      slug: 'gcc-rxii-132',
      sku: 'GCC-RXII-132',
      name: 'GCC RXII 132',
      shortDesc: 'Professional tarkkuusleikkuri 1320mm',
      description: '<p>GCC RXII Professional tarraleikkuri tarkkaan leikkaukseen. 1320mm leikkuuleveys.</p>',
      features: JSON.stringify(['1320mm leikkuuleveys', 'Servo-moottori', 'Automaattinen contour cut', 'USB ja Ethernet']),
      specs: JSON.stringify({ 'Leikkuuleveys': '1320 mm', 'Nopeus': '1530 mm/s' }),
      priceType: 'quote',
      status: 'PUBLISHED',
      isFeatured: true,
      categorySlug: 'gcc-tarraleikkurit',
    },
    {
      slug: 'jingwei-cb03ii',
      sku: 'JW-CB03II',
      name: 'Jingwei CB03II',
      shortDesc: 'Flatbed-monitoimileikkuri 3015 pöydällä',
      description: '<p>Jingwei CB03II flatbed-monitoimileikkuri. Leikkaa kartonkia, vinyyliä, pahvia ja paljon muuta.</p>',
      features: JSON.stringify(['3015 pöytä', 'Monitoimiterä', 'Contour cut', 'Automaattinen syöttö']),
      specs: JSON.stringify({ 'Leikkuualue': '3000 x 1500 mm', 'Materiaalin paksuus': 'max 50mm' }),
      priceType: 'quote',
      status: 'PUBLISHED',
      isFeatured: true,
      categorySlug: 'monitoimileikkurit',
    },
    {
      slug: 'jingwei-cb08ii',
      sku: 'JW-CB08II',
      name: 'Jingwei CB08II',
      shortDesc: 'Tehokas flatbed-monitoimileikkuri',
      description: '<p>Jingwei CB08II on tehokas flatbed-monitoimileikkuri vaativaan tuotantoon.</p>',
      features: JSON.stringify(['Suuri leikkuualue', 'Korkea nopeus', 'Monitoimiterä', 'Automaattinen syöttö']),
      priceType: 'quote',
      status: 'PUBLISHED',
      isFeatured: false,
      categorySlug: 'monitoimileikkurit',
    },
    {
      slug: 'jetbest-eco-solvent-musteet',
      sku: 'JB-ECO-SOL',
      name: 'JetBest Eco-solvent musteet',
      shortDesc: 'Korkealaatuiset musteet Mimaki-tulostimille',
      description: '<p>JetBest eco-solventtimusteet Mimaki-tulostimille. Erinomainen värintoisto ja kestävyys.</p>',
      features: JSON.stringify(['Mimaki-yhteensopiva', 'CMYK värit', 'Erinomainen värintoisto', 'Hyvä hinta-laatusuhde']),
      priceType: 'fixed',
      status: 'PUBLISHED',
      isFeatured: true,
      categorySlug: 'tarvikkeet',
    },
    {
      slug: 'gcc-jaguar-v-lx',
      sku: 'GCC-JAG-VLX',
      name: 'GCC Jaguar V LX',
      shortDesc: 'Jaguar V LX tarkkuusleikkuri',
      description: '<p>GCC Jaguar V LX on luotettava tarraleikkuri ammattikäyttöön.</p>',
      features: JSON.stringify(['Servo-moottori', 'Automaattinen contour cut', 'USB ja Ethernet', 'Optiline-tunnistus']),
      priceType: 'quote',
      status: 'PUBLISHED',
      isFeatured: false,
      categorySlug: 'gcc-tarraleikkurit',
    },
    {
      slug: 'fayon-fy1600-se',
      sku: 'FAY-1600SE',
      name: 'Fayon FY1600 SE',
      shortDesc: 'Pneumaattinen kylmälaminaattori 1600mm',
      description: '<p>Fayon FY1600 SE on pneumaattinen kylmälaminaattori. 1600mm leveys, tuplavetorullat.</p>',
      features: JSON.stringify(['1600mm leveys', 'Pneumaattinen', 'Tuplavetorullat', 'Helppo käyttö']),
      specs: JSON.stringify({ 'Laminointileveys': '1600 mm', 'Nopeus': '8 m/min' }),
      priceType: 'quote',
      status: 'PUBLISHED',
      isFeatured: true,
      categorySlug: 'laminaattorit',
    },
    // Roll-up products
    {
      slug: 'roll-up-spyro',
      sku: 'RUP-SPYRO',
      name: 'Roll-Up Spyro',
      shortDesc: 'Spyro roll-up teline',
      description: '<p>Laadukas Spyro roll-up teline messuille ja tapahtumiin.</p>',
      features: JSON.stringify(['Alumiinirunko', 'Kantolaukku', 'Helppo pystytys']),
      priceType: 'fixed',
      status: 'PUBLISHED',
      isFeatured: false,
      categorySlug: 'roll-up',
    },
    {
      slug: 'roll-up-export',
      sku: 'RUP-EXPORT',
      name: 'Roll-Up Export',
      shortDesc: 'Export roll-up teline',
      description: '<p>Export-mallin roll-up teline edulliseen hintaan.</p>',
      features: JSON.stringify(['Alumiinirunko', 'Kantolaukku', 'Edullinen']),
      priceType: 'fixed',
      status: 'PUBLISHED',
      isFeatured: false,
      categorySlug: 'roll-up',
    },
    {
      slug: 'roll-up-luxury',
      sku: 'RUP-LUXURY',
      name: 'Roll-Up Luxury',
      shortDesc: 'Luxury roll-up teline',
      description: '<p>Premium-laatuinen Luxury roll-up teline.</p>',
      features: JSON.stringify(['Premium alumiini', 'Vaihdettava kuva', 'Kantolaukku']),
      priceType: 'fixed',
      status: 'PUBLISHED',
      isFeatured: false,
      categorySlug: 'roll-up',
    },
    {
      slug: 'roll-up-deluxe',
      sku: 'RUP-DELUXE',
      name: 'Roll-Up Deluxe',
      shortDesc: 'Deluxe roll-up teline',
      description: '<p>Deluxe-mallin roll-up teline laadukkaalla mekanismilla.</p>',
      features: JSON.stringify(['Deluxe-mekanismi', 'Vaihdettava kuva', 'Kantolaukku']),
      priceType: 'fixed',
      status: 'PUBLISHED',
      isFeatured: true,
      categorySlug: 'roll-up',
    },
    {
      slug: 'roll-up-mini',
      sku: 'RUP-MINI',
      name: 'Roll-Up Mini',
      shortDesc: 'Mini roll-up teline',
      description: '<p>Kompakti mini roll-up teline pöytäkäyttöön.</p>',
      features: JSON.stringify(['Kompakti koko', 'Pöytämalli', 'Kantolaukku']),
      priceType: 'fixed',
      status: 'PUBLISHED',
      isFeatured: false,
      categorySlug: 'roll-up',
    },
    // Messuseinät
    {
      slug: 'messuseina-suora',
      sku: 'MES-SUORA',
      name: 'Messuseinä Suora',
      shortDesc: 'Suora pop-up messuseinä',
      description: '<p>Pop-up messuseinä suorana mallina. Magneettikiinnityksellä.</p>',
      features: JSON.stringify(['Suora malli', 'Magneettikiinnitys', 'LED-valot saatavilla', 'Kantolaukku']),
      priceType: 'fixed',
      status: 'PUBLISHED',
      isFeatured: true,
      categorySlug: 'messuseinat',
    },
    {
      slug: 'messuseina-kaareva',
      sku: 'MES-KAAREVA',
      name: 'Messuseinä Kaareva',
      shortDesc: 'Kaareva pop-up messuseinä',
      description: '<p>Pop-up messuseinä kaarevana mallina. Magneettikiinnityksellä.</p>',
      features: JSON.stringify(['Kaareva malli', 'Magneettikiinnitys', 'LED-valot saatavilla', 'Kantolaukku']),
      priceType: 'fixed',
      status: 'PUBLISHED',
      isFeatured: false,
      categorySlug: 'messuseinat',
    },
    // Messupöydät
    {
      slug: 'messupoyta-promo',
      sku: 'MES-PROMO',
      name: 'Promopöytä',
      shortDesc: 'Esittelypöytä messuille',
      description: '<p>Promopöytä messuille ja tapahtumiin. Sisältää kuljetuslaukun.</p>',
      features: JSON.stringify(['Alumiinirunko', 'Painettu grafiikka', 'Kuljetuslaukku']),
      priceType: 'fixed',
      status: 'PUBLISHED',
      isFeatured: true,
      categorySlug: 'messupoydat',
    },
    {
      slug: 'messupoyta-tiski',
      sku: 'MES-TISKI',
      name: 'Messupöytä Tiski',
      shortDesc: 'Kompakti messupöytä',
      description: '<p>Kompakti messupöytä tiskin malliin.</p>',
      features: JSON.stringify(['Kompakti malli', 'Hyllytaso', 'Kuljetuslaukku']),
      priceType: 'fixed',
      status: 'PUBLISHED',
      isFeatured: false,
      categorySlug: 'messupoydat',
    },
    {
      slug: 'esittelypoyta',
      sku: 'MES-ESITTELY',
      name: 'Esittelypöytä',
      shortDesc: 'Monipuolinen esittelypöytä',
      description: '<p>Monipuolinen esittelypöytä messuille.</p>',
      features: JSON.stringify(['Monipuolinen', 'Säädettävä', 'Kuljetuslaukku']),
      priceType: 'fixed',
      status: 'PUBLISHED',
      isFeatured: false,
      categorySlug: 'messupoydat',
    },
  ]

  for (const product of products) {
    const { categorySlug, ...productData } = product
    const categoryId = createdCategories[categorySlug]
    
    const createdProduct = await prisma.product.upsert({
      where: { slug: product.slug },
      update: { ...productData, categoryId },
      create: {
        ...productData,
        categoryId,
        authorId: admin.id,
      },
    })
    
    // Store product IDs for image creation
    createdProducts[product.slug] = createdProduct.id
  }
  console.log(`✓ Created ${products.length} products`)

  // Create product images with REAL images from the original site
  const productImages = [
    { productSlug: 'docan-h3000r-m10', url: '/images/devices/docan_h3000r_m10_574x.png', alt: 'Docan H3000r M10 UV-tulostin', isPrimary: true },
    { productSlug: 'gcc-rxii-132', url: '/images/devices/RXII_132_400.png', alt: 'GCC RXII 132 tarkkuusleikkuri', isPrimary: true },
    { productSlug: 'jingwei-cb03ii', url: '/images/devices/cb03ii_500px_500x.jpg', alt: 'Jingwei CB03II monitoimileikkuri', isPrimary: true },
    { productSlug: 'gcc-jaguar-v-lx', url: '/images/devices/RXII_132_400.png', alt: 'GCC Jaguar V LX', isPrimary: true },
    { productSlug: 'fayon-fy1600-se', url: '/images/devices/fayon-1600se.png', alt: 'Fayon FY1600 SE laminaattori', isPrimary: true },
    { productSlug: 'jetbest-eco-solvent-musteet', url: '/images/logos/jetbest_sahkoposti.jpg', alt: 'JetBest Eco-solvent musteet', isPrimary: true },
    { productSlug: 'roll-up-deluxe', url: '/images/products/rollups/deluxe_1_uusi_kuva_laukku.jpg', alt: 'Roll-Up Deluxe', isPrimary: true },
    { productSlug: 'messuseina-suora', url: '/images/products/walls/suora_messuseina.jpg', alt: 'Messuseinä Suora', isPrimary: true },
    { productSlug: 'messupoyta-promo', url: '/images/products/tables/promopyt_1_uusi_kuva_1.jpg', alt: 'Promopöytä', isPrimary: true },
  ]

  // Delete existing product images first
  await prisma.productImage.deleteMany({})
  
  for (const img of productImages) {
    const productId = createdProducts[img.productSlug]
    if (productId) {
      await prisma.productImage.create({
        data: {
          productId,
          url: img.url,
          alt: img.alt,
          isPrimary: img.isPrimary,
          sortOrder: 0,
        },
      })
    }
  }
  console.log(`✓ Created ${productImages.length} product images`)

  // Create navigation items
  const navItems = [
    { location: 'header', label: 'Etusivu', url: '/', sortOrder: 0, isVisible: true },
    { location: 'header', label: 'Laitteet', url: '/laitteet', sortOrder: 1, isVisible: true },
    { location: 'header', label: 'Tarvikkeet', url: '/tarvikkeet', sortOrder: 2, isVisible: true },
    { location: 'header', label: 'Display', url: '/display', sortOrder: 3, isVisible: true },
    { location: 'header', label: 'Huolto', url: '/huolto', sortOrder: 4, isVisible: true },
    { location: 'header', label: 'Yhteystiedot', url: '/yhteystiedot', sortOrder: 5, isVisible: true },
    { location: 'footer', label: 'Etusivu', url: '/', sortOrder: 0, isVisible: true },
    { location: 'footer', label: 'Yritys', url: '/yritys', sortOrder: 1, isVisible: true },
    { location: 'footer', label: 'Toimitusehdot', url: '/toimitusehdot', sortOrder: 2, isVisible: true },
    { location: 'footer', label: 'Tietosuoja', url: '/tietosuoja', sortOrder: 3, isVisible: true },
    { location: 'footer', label: 'Yhteystiedot', url: '/yhteystiedot', sortOrder: 4, isVisible: true },
    { location: 'mobile', label: 'Etusivu', url: '/', sortOrder: 0, isVisible: true },
    { location: 'mobile', label: 'Laitteet', url: '/laitteet', sortOrder: 1, isVisible: true },
    { location: 'mobile', label: 'Tarvikkeet', url: '/tarvikkeet', sortOrder: 2, isVisible: true },
    { location: 'mobile', label: 'Display', url: '/display', sortOrder: 3, isVisible: true },
    { location: 'mobile', label: 'Huolto', url: '/huolto', sortOrder: 4, isVisible: true },
    { location: 'mobile', label: 'Yhteystiedot', url: '/yhteystiedot', sortOrder: 5, isVisible: true },
  ]

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

  await prisma.media.deleteMany({})
  
  for (const media of mediaItems) {
    await prisma.media.create({
      data: media,
    })
  }
  console.log(`✓ Created ${mediaItems.length} media items`)

  // Create settings with REAL company data
  const settings = [
    { key: 'site_name', value: 'PrintMedia PM Solutions Oy', type: 'string', group: 'general' },
    { key: 'company_name', value: 'PrintMedia PM Solutions Oy', type: 'string', group: 'general' },
    { key: 'site_description', value: 'Suurkuvatulostusalan tukkukauppa. Tarjoamme laajan valikoiman UV-tulostimia, leikkureita, laminaattoreita ja tarvikkeita ammattilaisille.', type: 'string', group: 'general' },
    { key: 'site_logo', value: '/images/logos/logo.svg', type: 'string', group: 'general' },
    { key: 'contact_email', value: 'myynti@printmedia.fi', type: 'string', group: 'contact' },
    { key: 'phone', value: '0440 875 025', type: 'string', group: 'contact' },
    { key: 'contact_phone', value: '0440 875 025', type: 'string', group: 'contact' },
    { key: 'contact_address', value: 'Koskueentie 7\n19700 Sysmä', type: 'string', group: 'contact' },
    { key: 'business_id', value: '1877937-4', type: 'string', group: 'contact' },
    { key: 'office_hours', value: 'Ma-Pe 07:30-15:30', type: 'string', group: 'contact' },
    { key: 'meta_title', value: 'PrintMedia PM Solutions Oy - Suurkuvatulostusalan tukkukauppa', type: 'string', group: 'seo' },
    { key: 'meta_description', value: 'PrintMedia PM Solutions Oy tarjoaa laajan valikoiman UV-tulostimia, leikkureita, laminaattoreita ja tarvikkeita ammattilaisille. Luotettavaa palvelua Sysmästä koko Suomeen.', type: 'string', group: 'seo' },
    { key: 'meta_keywords', value: 'suurkuvatulostus, UV-tulostimet, leikkurit, laminaattorit, PrintMedia, Sysmä', type: 'string', group: 'seo' },
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
