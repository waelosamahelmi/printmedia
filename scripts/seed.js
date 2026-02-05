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

  // Create REAL products from the original website with ALL detailed data
  const products = [
    // ========== DOCAN UV-TULOSTIMET ==========
    {
      slug: 'docan-h3000r-m10',
      sku: 'DOC-H3000R-M10',
      name: 'Docan H3000r M10',
      shortDesc: 'UV-tulostin 10-värisellä päällä',
      description: `<p>Viimeistellyt Docan tulostimet omaavat luotettavan toiminnan ja uskomattoman tulostuslaadun hyödyntäen Konica Minoltan, Ricohin tai Kyoceran tulostuspäitä.</p>
<p>Laitteiden kokoonpano ja testaus tapahtuu Kiinassa ISO9001 sertifioinnin alaisena, mutta kaikki strategiset komponentit tulevat Japanista, Italiasta sekä Englannista. Esimerkiksi johteet tulevat Japanista ja UV-lamppuyksiköt Englannista.</p>
<h3>Ominaisuudet</h3>
<ul>
<li>Tulostimen perusversiossa neljä tulostuspäätä järkevään hintaan</li>
<li>Mahdollisuus lisätä tulostuspäiden määrää myöhemmin</li>
<li>H3000(R) malliin saatavilla rullaominaisuus</li>
<li>Koneen alustaminen tulostuskuntoon kestää vain noin 5 minuuttia</li>
<li>Mallisto tarjoaa ratkaisut pienestä kylttituotannosta jopa 5,1 metrisiin tulosteisiin</li>
<li>Interweaving tekniikka estää raitaisuutta</li>
</ul>
<h3>Värikokoonpanot</h3>
<ul>
<li>CMYK</li>
<li>CMYKLcLm</li>
<li>CMYKLcLm + White</li>
<li>CMYKLcLm + White + White</li>
</ul>
<p><strong>Tulostusmateriaalin paksuus:</strong> maksimissaan 100 mm</p>`,
      features: JSON.stringify([
        'Konica Minolta, Ricoh tai Kyocera tulostuspäät',
        'Flatbed ja roll-to-roll',
        'UV LED kovetus',
        'Interweaving tekniikka',
        'ISO9001 sertifioitu tuotanto',
        'Max materiaalipaksuus 100mm'
      ]),
      specs: JSON.stringify({ 
        'Tulostusleveys': '3000 mm', 
        'Resoluutio': '1440 dpi',
        'Materiaalin paksuus': 'max 100 mm'
      }),
      priceType: 'quote',
      status: 'PUBLISHED',
      isFeatured: true,
      categorySlug: 'docan-uv-tulostimet',
    },
    // ========== GCC TARRALEIKKURIT ==========
    {
      slug: 'gcc-rxii-132',
      sku: 'GCC-RXII-132',
      name: 'GCC RXII 132',
      shortDesc: 'Professional tarkkuusleikkuri 1320mm',
      description: `<p>GCC:n lippulaiva kaikilla herkuilla vaativampaankin tuotantoon.</p>
<p>Sisältää GreatCut ohjelmiston, USB ja RJ45 verkkokaapeli mukana.</p>`,
      features: JSON.stringify([
        'Sisältää GreatCut ohjelmiston',
        'USB ja RJ45 verkkokaapeli mukana',
        '1320mm leikkuuleveys',
        'Servo-moottori',
        'Automaattinen contour cut'
      ]),
      specs: JSON.stringify({ 
        'Leikkuuleveys': '1320 mm (52")', 
        'Nopeus': '1530 mm/s',
        'Saatavana': 'RXII-61, RXII-101S, RXII-132S, RXII-183S'
      }),
      priceType: 'quote',
      status: 'PUBLISHED',
      isFeatured: true,
      categorySlug: 'gcc-tarraleikkurit',
    },
    {
      slug: 'gcc-jaguar-v-lx',
      sku: 'GCC-JAG-VLX',
      name: 'GCC Jaguar V LX',
      shortDesc: 'Monipuolinen tarraleikkuri vaativampaankin käyttöön',
      description: '<p>Monipuolinen tarraleikkuri vaativampaankin käyttöön.</p>',
      features: JSON.stringify([
        'Servo-moottori',
        'Automaattinen contour cut',
        'USB ja Ethernet',
        'Optiline-tunnistus'
      ]),
      specs: JSON.stringify({ 
        'Saatavana': 'J5-61 (24"), J5-101 (40"), J5-132 (52"), J5-183 (72")'
      }),
      priceType: 'quote',
      status: 'PUBLISHED',
      isFeatured: false,
      categorySlug: 'gcc-tarraleikkurit',
    },
    // ========== MONITOIMILEIKKURIT ==========
    {
      slug: 'jingwei-cb03ii',
      sku: 'JW-CB03II',
      name: 'Jingwei CB03II',
      shortDesc: 'Flatbed-monitoimileikkuri useilla pöytäko\'oilla',
      description: `<p>CB03II ja CB08II leikkureihin on saatavilla useita työkaluja ja teriä erilaisia materiaaleja ja käyttötarkoituksia varten.</p>
<h3>Soveltuvat materiaalit</h3>
<ul>
<li>Pahvit</li>
<li>Paperit</li>
<li>Kankaat</li>
<li>Levyt</li>
<li>Kennot</li>
<li>Kalvot</li>
<li>Vaahtomuovit</li>
<li>Ja monet muut</li>
</ul>
<p>Jos olet etsinyt laadukasta tasoleikkuria ja hintataso on ollut liian korkea, niin tässä sinulle hyvä vaihtoehto ominaisuuksista tinkimättä.</p>`,
      features: JSON.stringify([
        'Useita pöytäkokoja saatavilla',
        'Monitoimiterä',
        'Contour cut',
        'Automaattinen syöttö',
        'Useita työkaluvaihtoehtoja'
      ]),
      specs: JSON.stringify({ 
        'Pöytäkoot': '1100x1300mm, 1800x1600mm, 2500x1300mm, 2500x1600mm',
        'Materiaalin paksuus': 'max 50mm'
      }),
      priceType: 'quote',
      status: 'PUBLISHED',
      isFeatured: true,
      categorySlug: 'monitoimileikkurit',
    },
    {
      slug: 'jingwei-cb08ii',
      sku: 'JW-CB08II',
      name: 'Jingwei CB08II',
      shortDesc: 'Tehokas flatbed-monitoimileikkuri suurille töille',
      description: '<p>Jingwei CB08II on tehokas flatbed-monitoimileikkuri vaativaan tuotantoon suuremmilla pöytäko\'oilla.</p>',
      features: JSON.stringify([
        'Suuret pöytäkoot',
        'Korkea nopeus',
        'Monitoimiterä',
        'Automaattinen syöttö'
      ]),
      specs: JSON.stringify({ 
        'Pöytäkoot': '2500x2000mm, 3000x3200mm, 3500x2000mm'
      }),
      priceType: 'quote',
      status: 'PUBLISHED',
      isFeatured: false,
      categorySlug: 'monitoimileikkurit',
    },
    // ========== LAMINAATTORIT ==========
    {
      slug: 'fayon-fy1600-se',
      sku: 'FAY-1600SE',
      name: 'Fayon FY1600 SE',
      shortDesc: 'Pneumaattinen kylmälaminaattori 1600mm',
      description: `<p>Monipuolinen kylmä-/lämpölaminaattori pieneen tai keskikokoiseen tuotantoon. Viimeistellyissä laminaattoreissa on laminointia helpottava lämmitettävä ylärulla.</p>`,
      features: JSON.stringify([
        'Lämmitettävä ylärulla (125°C asti)',
        'Pneumaattinen ylärullan nostin',
        'Maksimi laminointipaksuus: 35mm',
        'Maksimi laminointinopeus: 25m/min',
        'Maksimi laminointileveys: 162cm'
      ]),
      specs: JSON.stringify({ 
        'Laminointileveys': '1600 mm',
        'Nopeus': 'max 25 m/min',
        'Lämpötila': 'max 125°C',
        'Paksuus': 'max 35mm'
      }),
      priceType: 'quote',
      status: 'PUBLISHED',
      isFeatured: true,
      categorySlug: 'laminaattorit',
    },
    // ========== ROLL-UP TELINEET ==========
    {
      slug: 'roll-up-spyro',
      sku: 'RUP-SPYRO',
      name: 'Roll-Up Spyro',
      shortDesc: 'Kevyt roll-up teline messuille',
      description: '<p>Laadukas ja kevyt Spyro roll-up teline messuille ja tapahtumiin.</p>',
      features: JSON.stringify([
        'Kevyt kantaa mukana',
        'Puristavalla ylälistalla',
        'Mukana kantolaukku',
        '85 cm x 200 cm / 2kg'
      ]),
      specs: JSON.stringify({ 'Koko': '85 cm x 200 cm', 'Paino': '2 kg' }),
      priceType: 'quote',
      status: 'PUBLISHED',
      isFeatured: false,
      categorySlug: 'roll-up',
    },
    {
      slug: 'roll-up-export',
      sku: 'RUP-EXPORT',
      name: 'Roll-Up Export',
      shortDesc: 'Suosittu perusmalli',
      description: '<p>Export-mallin roll-up teline on suosittu perusmalli edulliseen hintaan.</p>',
      features: JSON.stringify([
        'Suosittu perusmalli',
        'Kevyt kantaa mukana',
        'Puristavalla ylälistalla',
        'Pehmustettu kantolaukku',
        '85 cm x 200 cm / 2,8 kg'
      ]),
      specs: JSON.stringify({ 'Koko': '85 cm x 200 cm', 'Paino': '2,8 kg' }),
      priceType: 'quote',
      status: 'PUBLISHED',
      isFeatured: false,
      categorySlug: 'roll-up',
    },
    {
      slug: 'roll-up-luxury',
      sku: 'RUP-LUXURY',
      name: 'Roll-Up Luxury',
      shortDesc: 'Tukevampi malli paksulla tukijalalla',
      description: '<p>Export mallia hieman tukevampi roll-up teline paksulla tukijalalla.</p>',
      features: JSON.stringify([
        'Export mallia hieman tukevampi, paksulla tukijalalla',
        'Puristavalla ylälistalla',
        'Pehmustettu kantolaukku'
      ]),
      specs: JSON.stringify({ 
        'Koot': '85x200cm (3,7kg), 100x200cm (4,2kg), 120x200cm (5,4kg)'
      }),
      priceType: 'quote',
      status: 'PUBLISHED',
      isFeatured: false,
      categorySlug: 'roll-up',
    },
    {
      slug: 'roll-up-deluxe',
      sku: 'RUP-DELUXE',
      name: 'Roll-Up Deluxe-1',
      shortDesc: 'Näyttävä pisaramallin roll-up',
      description: '<p>Näyttävä pisaramallin roll-up kääntyvällä lisäjalalla.</p>',
      features: JSON.stringify([
        'Näyttävä pisaramallin roll up kääntyvällä lisäjalalla',
        'Puristavalla ylälistalla',
        'Pehmustettu kantolaukku'
      ]),
      specs: JSON.stringify({ 
        'Koot': '85x200cm (7kg), 100x200cm (8kg), 120x200cm (9kg), 150x200cm (10kg)'
      }),
      priceType: 'quote',
      status: 'PUBLISHED',
      isFeatured: true,
      categorySlug: 'roll-up',
    },
    {
      slug: 'roll-up-mini',
      sku: 'RUP-MINI',
      name: 'Mini Roll-Up',
      shortDesc: 'Hauska pisaramallinen pöytä roll-up',
      description: '<p>Hauska pisaramallinen pöytä roll up.</p>',
      features: JSON.stringify([
        'Hauska pisaramallinen pöytä roll up',
        'Alumiinia, kromin väriset muovi päädyt',
        'Tarra ylälistalla',
        'Toimitetaan pakkauslaatikossa'
      ]),
      specs: JSON.stringify({ 
        'Koot': '21x28,5cm (0,3kg), 30x41,5cm (0,5kg)'
      }),
      priceType: 'quote',
      status: 'PUBLISHED',
      isFeatured: false,
      categorySlug: 'roll-up',
    },
    // ========== MESSUSEINÄT ==========
    {
      slug: 'messuseina-suora',
      sku: 'MES-SUORA',
      name: 'Pop Up Suora',
      shortDesc: 'Suora pop-up messuseinä',
      description: '<p>Pop-up messuseinä suorana mallina.</p>',
      features: JSON.stringify([
        'Sisältää: Rungon, magneettinauhan, 2 kpl valoja, sekä kuljetuslaukun',
        'Laukusta on mahdollista tehdä promotiski',
        'Ei sisällä vuotaa eikä tulostusmateriaalia',
        'Vuotien kiinnitys magneettinauhalla',
        'Seinä kasaantuu 75 cm ja päädyt 67 cm leveistä vuodista'
      ]),
      specs: JSON.stringify({ 
        'Koot': 'n. 230cm x 230cm (30kg), n. 230cm x 230cm (32kg)'
      }),
      priceType: 'quote',
      status: 'PUBLISHED',
      isFeatured: true,
      categorySlug: 'messuseinat',
    },
    {
      slug: 'messuseina-kaareva',
      sku: 'MES-KAAREVA',
      name: 'Pop Up Kaareva',
      shortDesc: 'Kaareva pop-up messuseinä',
      description: '<p>Pop-up messuseinä kaarevana mallina.</p>',
      features: JSON.stringify([
        'Sisältää: Rungon, magneettinauhan, 2 kpl valoja, sekä kuljetuslaukun',
        'Laukusta on mahdollista tehdä promotiski',
        'Ei sisällä vuotaa eikä tulostusmateriaalia',
        'Vuotien kiinnitys magneettinauhalla',
        'Seinä kasaantuu 70 cm ja päädyt 67 cm leveistä vuodista'
      ]),
      specs: JSON.stringify({ 
        'Koot': 'n. 230cm x 230cm (25kg), n. 280cm x 230cm (30kg)'
      }),
      priceType: 'quote',
      status: 'PUBLISHED',
      isFeatured: false,
      categorySlug: 'messuseinat',
    },
    // ========== MESSUPÖYDÄT ==========
    {
      slug: 'promopoyta-1',
      sku: 'MES-PROMO1',
      name: 'Promopöytä-1',
      shortDesc: 'Pop Up style messupöytä',
      description: '<p>Pop Up style messupöytä välihyllyllä.</p>',
      features: JSON.stringify([
        'Pop Up style',
        'Välihylly',
        'Vuodan kiinnitys magneettinauhalla (sis. hintaan)',
        'Mukana kangaslaukku',
        'Ei sisällä vuotaa eikä tulostusmateriaalia'
      ]),
      specs: JSON.stringify({ 
        'Paino': '12 kg',
        'Mitat': 'L 90 cm, K 88 cm, S 40 cm',
        'Pakkaus': 'L 100 cm, K 18 cm, S 40 cm',
        'Tuotenumero': '4602'
      }),
      priceType: 'quote',
      status: 'PUBLISHED',
      isFeatured: true,
      categorySlug: 'messupoydat',
    },
    {
      slug: 'promopoyta-2',
      sku: 'MES-PROMO2',
      name: 'Promopöytä-2',
      shortDesc: 'Suurempi Pop Up style messupöytä',
      description: '<p>Pop Up style messupöytä välihyllyllä, suurempi koko.</p>',
      features: JSON.stringify([
        'Pop Up style',
        'Välihylly',
        'Vuodan kiinnitys magneettinauhalla (sis. hintaan)',
        'Mukana kangaslaukku',
        'Ei sisällä vuotaa eikä tulostusmateriaalia'
      ]),
      specs: JSON.stringify({ 
        'Paino': '16 kg',
        'Mitat': 'L 129 cm, K 88 cm, S 45 cm',
        'Pakkaus': 'L 100 cm, K 18 cm, S 40 cm',
        'Tuotenumero': '4601'
      }),
      priceType: 'quote',
      status: 'PUBLISHED',
      isFeatured: false,
      categorySlug: 'messupoydat',
    },
    {
      slug: 'promopoyta-4',
      sku: 'MES-PROMO4',
      name: 'Promopöytä-4',
      shortDesc: 'Vaalea pyökki -messupöytä',
      description: '<p>Vaalea pyökki messupöytä nopealla kasauksella.</p>',
      features: JSON.stringify([
        'Vaalea pyökki',
        'Nopea kasata, tarranauha pohjustusmateriaalissa',
        'Välihyllyllä',
        'Vuodan koko noin L 184 cm, K 90 cm',
        'Vuodan kiinnitys teippaamalla tai tarranauhalla',
        'Mukana kangaslaukku',
        'Pohjustusmateriaalilla oma kantolaukku'
      ]),
      specs: JSON.stringify({ 
        'Paino': '10 kg',
        'Mitat': 'L 118 cm, K 93 cm, S 40 cm',
        'Pakkaus': 'L 62 cm, K 42 cm, S 15 cm',
        'Tuotenumero': '4604'
      }),
      priceType: 'quote',
      status: 'PUBLISHED',
      isFeatured: false,
      categorySlug: 'messupoydat',
    },
    // ========== TARVIKKEET ==========
    {
      slug: 'jetbest-eco-solvent-musteet',
      sku: 'JB-ECO-SOL',
      name: 'JetBest Eco-solvent musteet',
      shortDesc: 'Korkealaatuiset musteet Mimaki-tulostimille',
      description: '<p>JetBest eco-solventtimusteet Mimaki-tulostimille. Erinomainen värintoisto ja kestävyys.</p>',
      features: JSON.stringify(['Mimaki-yhteensopiva', 'CMYK värit', 'Erinomainen värintoisto', 'Hyvä hinta-laatusuhde']),
      priceType: 'quote',
      status: 'PUBLISHED',
      isFeatured: true,
      categorySlug: 'tarvikkeet',
    },
    // ========== MUUT TARVIKKEET ==========
    {
      slug: 'turvaviivain-terasreunalla',
      sku: 'TAR-TURVA1',
      name: 'Turvaviivain teräsreunalla',
      shortDesc: 'Tukeva alumiinirunkoinen turvaviivain',
      description: '<p>Tukeva alumiini runko, jossa teräsreuna ja pohjassa liukuesteet.</p>',
      features: JSON.stringify([
        'Tukeva alumiini runko',
        'Teräsreuna',
        'Pohjassa liukuesteet',
        'Profiilin mitat: korkeus 44 mm, leveys 105 mm'
      ]),
      specs: JSON.stringify({ 
        'Koot': '80cm, 110cm, 140cm, 170cm',
        'Profiili': 'K 44mm, L 105mm'
      }),
      priceType: 'quote',
      status: 'PUBLISHED',
      isFeatured: false,
      categorySlug: 'muut-tarvikkeet',
    },
    {
      slug: 'turvaviivain-leikkurilla',
      sku: 'TAR-TURVA2',
      name: 'Turvaviivain leikkurilla',
      shortDesc: 'Leveä turvaviivain säädettävällä leikkurilla',
      description: '<p>Leveä alumiini runko, pohjassa liukuesteet, muovipäädyt. Leikkurin liikkuvuutta voidaan säätää mukana tulevalla työkalulla.</p>',
      features: JSON.stringify([
        'Leveä alumiini runko',
        'Pohjassa liukuesteet',
        'Muovipäädyt',
        'Säädettävä leikkuri',
        'Max leikkaussyvyys 4 mm'
      ]),
      specs: JSON.stringify({ 
        'Koot': '120cm, 180cm, 260cm',
        'Profiili': 'K 55mm, L 150mm',
        'Max leikkaus': '4mm'
      }),
      priceType: 'quote',
      status: 'PUBLISHED',
      isFeatured: false,
      categorySlug: 'muut-tarvikkeet',
    },
    {
      slug: 'bungee-ball',
      sku: 'TAR-BUNGEE-B',
      name: 'Bungee ball',
      shortDesc: 'Kuminauhakiinnike pallolla',
      description: '<p>Kuminauhan paksuus 4 mm, pituus 150 mm. Pallon halkaisija 28 mm.</p>',
      features: JSON.stringify([
        'Kuminauhan paksuus 4 mm',
        'Pituus 150 mm',
        'Pallon halkaisija 28 mm',
        'Myydään 50 kpl erissä'
      ]),
      specs: JSON.stringify({ 
        'Tuotenumero': '3551',
        'Pakkauskoko': '50 kpl'
      }),
      priceType: 'quote',
      status: 'PUBLISHED',
      isFeatured: false,
      categorySlug: 'muut-tarvikkeet',
    },
    {
      slug: 'bungee-hook',
      sku: 'TAR-BUNGEE-H',
      name: 'Bungee hook',
      shortDesc: 'Kuminauhakiinnike koukulla',
      description: '<p>Kuminauhan paksuus 4 mm, pituus 150 mm.</p>',
      features: JSON.stringify([
        'Kuminauhan paksuus 4 mm',
        'Pituus 150 mm',
        'Myydään 50 kpl erissä'
      ]),
      specs: JSON.stringify({ 
        'Tuotenumero': '3552',
        'Pakkauskoko': '50 kpl'
      }),
      priceType: 'quote',
      status: 'PUBLISHED',
      isFeatured: false,
      categorySlug: 'muut-tarvikkeet',
    },
    {
      slug: 'banner-clip',
      sku: 'TAR-BANNER',
      name: 'Banner clip',
      shortDesc: 'Nopea bannerin kiinnike',
      description: '<p>Nopea asentaa. Soveltuu eri paksuisille materiaaleille. Kiinnikkeen leveys 35 mm.</p>',
      features: JSON.stringify([
        'Nopea asentaa',
        'Soveltuu eri paksuisille materiaaleille',
        'Kiinnikkeen leveys 35 mm',
        'Myydään 100 kpl erissä'
      ]),
      specs: JSON.stringify({ 
        'Tuotenumero': '3553',
        'Pakkauskoko': '100 kpl',
        'Leveys': '35mm'
      }),
      priceType: 'quote',
      status: 'PUBLISHED',
      isFeatured: false,
      categorySlug: 'muut-tarvikkeet',
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
    // Devices
    { productSlug: 'docan-h3000r-m10', url: '/images/devices/docan_h3000r_m10_574x.png', alt: 'Docan H3000r M10 UV-tulostin', isPrimary: true },
    { productSlug: 'gcc-rxii-132', url: '/images/devices/RXII_132_400.png', alt: 'GCC RXII 132 tarkkuusleikkuri', isPrimary: true },
    { productSlug: 'gcc-jaguar-v-lx', url: '/images/devices/J5-132.jpg', alt: 'GCC Jaguar V LX', isPrimary: true },
    { productSlug: 'jingwei-cb03ii', url: '/images/devices/cb03ii_500px_500x.jpg', alt: 'Jingwei CB03II monitoimileikkuri', isPrimary: true },
    { productSlug: 'jingwei-cb08ii', url: '/images/devices/cb03ii_500px_500x.jpg', alt: 'Jingwei CB08II monitoimileikkuri', isPrimary: true },
    { productSlug: 'fayon-fy1600-se', url: '/images/devices/fayon-1600se.png', alt: 'Fayon FY1600 SE laminaattori', isPrimary: true },
    // Roll-ups
    { productSlug: 'roll-up-spyro', url: '/images/products/rollups/spyro2.jpg', alt: 'Roll-Up Spyro', isPrimary: true },
    { productSlug: 'roll-up-export', url: '/images/products/rollups/export_uusi_laukku.jpg', alt: 'Roll-Up Export', isPrimary: true },
    { productSlug: 'roll-up-luxury', url: '/images/products/rollups/luxury_uusi_laukku.jpg', alt: 'Roll-Up Luxury', isPrimary: true },
    { productSlug: 'roll-up-deluxe', url: '/images/products/rollups/deluxe_1_uusi_kuva_laukku.jpg', alt: 'Roll-Up Deluxe', isPrimary: true },
    { productSlug: 'roll-up-mini', url: '/images/products/rollups/mini_roll_up.jpg', alt: 'Mini Roll-Up', isPrimary: true },
    // Messuseinät
    { productSlug: 'messuseina-suora', url: '/images/products/walls/suora_messuseina.jpg', alt: 'Pop Up Suora messuseinä', isPrimary: true },
    { productSlug: 'messuseina-kaareva', url: '/images/products/walls/kaareva_280_x_230.jpg', alt: 'Pop Up Kaareva messuseinä', isPrimary: true },
    // Messupöydät
    { productSlug: 'promopoyta-1', url: '/images/products/tables/promopyt_1_uusi_kuva_1.jpg', alt: 'Promopöytä-1', isPrimary: true },
    { productSlug: 'promopoyta-2', url: '/images/products/tables/promopyt_2_uusi_kuva_1.jpg', alt: 'Promopöytä-2', isPrimary: true },
    { productSlug: 'promopoyta-4', url: '/images/products/tables/promopyt_4.jpg', alt: 'Promopöytä-4', isPrimary: true },
    // Tarvikkeet
    { productSlug: 'jetbest-eco-solvent-musteet', url: '/images/logos/jetbest_sahkoposti.jpg', alt: 'JetBest Eco-solvent musteet', isPrimary: true },
    { productSlug: 'turvaviivain-terasreunalla', url: '/images/products/accessories/turvaviivain_tersreunalla.jpg', alt: 'Turvaviivain teräsreunalla', isPrimary: true },
    { productSlug: 'turvaviivain-leikkurilla', url: '/images/products/accessories/turvaviivain_leikkurilla.jpg', alt: 'Turvaviivain leikkurilla', isPrimary: true },
    { productSlug: 'bungee-ball', url: '/images/products/accessories/bungee-ball.jpg', alt: 'Bungee ball', isPrimary: true },
    { productSlug: 'bungee-hook', url: '/images/products/accessories/bungee-koukku.jpg', alt: 'Bungee hook', isPrimary: true },
    { productSlug: 'banner-clip', url: '/images/products/accessories/bannerclip.jpg', alt: 'Banner clip', isPrimary: true },
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
