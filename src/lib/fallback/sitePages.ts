export type FallbackSection = {
  id: string
  type: string
  title: string | null
  content: string | null
  settings: string | null
  sortOrder: number
  isVisible: boolean
}

export type FallbackPage = {
  slug: string
  title: string
  description: string | null
  metaTitle: string | null
  metaDesc: string | null
  sections: FallbackSection[]
}

export const fallbackHomePage: FallbackPage = {
  slug: '',
  title: 'Suurkuvatulostusalan tukkukauppa',
  description: 'Tarjoamme laajan valikoiman UV-tulostimia, leikkureita, laminaattoreita ja tarvikkeita ammattilaisille.',
  metaTitle: 'PrintMedia PM Solutions | Suurkuvatulostusalan tukkukauppa',
  metaDesc: 'Tarjoamme laajan valikoiman UV-tulostimia, leikkureita, laminaattoreita ja tarvikkeita ammattilaisille.',
  sections: [
    {
      id: 'fallback-home-hero',
      type: 'hero',
      title: null,
      content: null,
      settings: '{"subtitle":"PrintMedia PM Solutions Oy","title":"Suurkuvatulostusalan tukkukauppa","description":"Tarjoamme laajan valikoiman UV-tulostimia, leikkureita, laminaattoreita ja tarvikkeita ammattilaisille.","primaryCta":{"text":"Tutustu tuotteisiin","href":"/#tuotekategoriat"},"secondaryCta":{"text":"Ota yhteyttä","href":"/yhteystiedot"},"image":"/images/devices/J5-132.jpg","features":["Valtuutettu jälleenmyyjä","Ammattitaitoinen huolto","Nopea toimitus"],"images":["/images/devices/J5-132.jpg","/images/devices/cb03ii_500px_500x.jpg","/images/devices/docan-m10-uv-clean.jpg"],"imageFits":["cover","contain","contain"],"scrollButton":true,"scrollTarget":"#miksi-valita-printmedia","badgeTitle":"Valtuutettu jälleenmyyjä","badgeSubtitle":"GCC"}',
      sortOrder: 0,
      isVisible: true,
    },
    {
      id: 'fallback-home-features',
      type: 'features',
      title: null,
      content: null,
      settings: '{"title":"Miksi valita PrintMedia?","subtitle":"Olemme luotettava kumppanisi tulostusalalla","features":[{"icon":"Award","title":"Valtuutettu jälleenmyyjä","description":"Olemme virallinen jälleenmyyjä monille johtaville brändeille"},{"icon":"Wrench","title":"Ammattitaitoinen huolto","description":"Kokeneet teknikkomme huoltavat laitteesi nopeasti"},{"icon":"Truck","title":"Nopea toimitus","description":"Toimitamme tuotteet nopeasti ympäri Suomen"},{"icon":"Users","title":"Asiantunteva tuki","description":"Autamme tuotevalinnoissa ja neuvomme käytössä"}],"sectionId":"miksi-valita-printmedia"}',
      sortOrder: 1,
      isVisible: true,
    },
    {
      id: 'fallback-home-categories',
      type: 'categories',
      title: null,
      content: null,
      settings: '{"title":"Tuotekategoriat","subtitle":"Löydä sopiva ratkaisu tarpeisiisi laajasta valikoimastamme","mode":"manual","items":[{"title":"Laitteet","description":"Ammattitason tulostus- ja leikkauslaitteet yrityksille.","image":"/images/devices/docan-m10-uv-clean.jpg","href":"/laitteet","images":["/images/devices/docan-m10-uv-clean.jpg","/images/devices/cb03ii_500px_500x.jpg","/images/devices/fayon-1600se.png"]},{"title":"Tulostusvärit","description":"Laadukkaat musteet ja väriratkaisut eri tulostintekniikoihin.","image":"/images/products/inks/tulostusvarit-20260410.png","href":"/tulostusvarit","images":["/images/products/inks/tulostusvarit-20260410.png"]},{"title":"Tulostusmateriaalit","description":"Monipuolinen valikoima tulostusmateriaaleja eri käyttökohteisiin.","image":null,"href":"/tulostusmateriaalit","images":[]},{"title":"Varaosat ja tarvikkeet","description":"Varaosat, huoltotarvikkeet ja lisävarusteet laitteiden ylläpitoon.","image":"/images/devices/tools_600px_600x.png","href":"/huolto/varaosat","images":["/images/devices/tools_600px_600x.png","/images/products/accessories/bungee-ball.jpg","/images/products/accessories/bungee-koukku.jpg"]},{"title":"Display-tuotteet","description":"Roll-upit, messuseinät ja messupöydät näyttäviin esillepanoihin.","image":"/images/products/rollups/spyro2.jpg","href":"/display","images":["/images/products/rollups/spyro2.jpg","/images/products/walls/suora_messuseina.jpg","/images/products/tables/promopyt_1_uusi_kuva_1.jpg"]}],"sectionId":"tuotekategoriat"}',
      sortOrder: 2,
      isVisible: true,
    },
    {
      id: 'fallback-home-cta',
      type: 'cta',
      title: null,
      content: null,
      settings: '{"variant":"gradient","title":"Tarvitsetko apua valinnoissa?","description":"Asiantuntijamme auttavat sinua löytämään juuri sinun tarpeisiisi sopivan ratkaisun.","primaryCta":{"text":"Pyydä tarjous","href":"/yhteystiedot"},"secondaryCta":{"text":"Soita 0440 875 025","href":"tel:+358440875025"}}',
      sortOrder: 3,
      isVisible: true,
    },
  ],
}

export const fallbackCompanyPage: FallbackPage = {
  slug: 'yritys',
  title: 'Tietoa meistä',
  description: 'PrintMedia Finland Oy - Luotettava kumppanisi tulostus- ja leikkausratkaisuissa vuodesta 2012.',
  metaTitle: 'Tietoa meistä',
  metaDesc: 'PrintMedia Finland Oy - Luotettava kumppanisi tulostus- ja leikkausratkaisuissa vuodesta 2012.',
  sections: [
    {
      id: 'fallback-company-hero',
      type: 'hero',
      title: null,
      content: null,
      settings: '{"title":"Luotettava kumppanisi tulostusalalla","description":"PrintMedia Finland Oy on vuonna 2012 perustettu suomalainen yritys, joka tarjoaa ammattitason tulostus- ja leikkausratkaisuja. Palvelemme asiakkaitamme asiantuntemuksella ja luotettavuudella.","primaryCta":{"text":"Ota yhteyttä","href":"/yhteystiedot"},"secondaryCta":{"text":"Tutustu laitteisiin","href":"/laitteet"},"image":"/images/logos/logo.svg","imageFits":["contain"],"highlightAllTitle":true}',
      sortOrder: 0,
      isVisible: true,
    },
    {
      id: 'fallback-company-stats',
      type: 'custom_html',
      title: 'Tilastot',
      content: null,
      settings: '{"html":"<section class=\"py-16 bg-primary-600 text-white\"><div class=\"mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl\"><div class=\"grid grid-cols-2 md:grid-cols-4 gap-8 text-center\"><div><div class=\"text-4xl font-bold mb-2\">10+</div><div class=\"text-primary-100\">Vuotta kokemusta</div></div><div><div class=\"text-4xl font-bold mb-2\">500+</div><div class=\"text-primary-100\">Tyytyväistä asiakasta</div></div><div><div class=\"text-4xl font-bold mb-2\">1000+</div><div class=\"text-primary-100\">Toimitettua laitetta</div></div><div><div class=\"text-4xl font-bold mb-2\">100%</div><div class=\"text-primary-100\">Takuu laitteille</div></div></div></div></section>"}',
      sortOrder: 1,
      isVisible: true,
    },
    {
      id: 'fallback-company-values',
      type: 'features',
      title: 'Arvomme',
      content: null,
      settings: '{"title":"Arvomme","subtitle":"Nämä arvot ohjaavat toimintaamme päivittäin","features":[{"icon":"Award","title":"Laatu","description":"Myymme vain laadukkaita laitteita, joihin uskomme itsekin."},{"icon":"Users","title":"Asiakaslähtöisyys","description":"Kuuntelemme asiakkaitamme ja etsimme parhaat ratkaisut heidän tarpeisiinsa."},{"icon":"Clock","title":"Nopeus","description":"Reagoimme nopeasti ja toimitamme tuotteet viivytyksettä."},{"icon":"Building2","title":"Luotettavuus","description":"Pidämme lupauksemme ja seisomme tuotteidemme takana."}]}',
      sortOrder: 2,
      isVisible: true,
    },
    {
      id: 'fallback-company-history',
      type: 'custom_html',
      title: 'Historiamme',
      content: null,
      settings: '{"html":"<section class=\"py-16 lg:py-24 bg-gray-50\"><div class=\"mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl\"><div class=\"text-center mb-12\"><h2 class=\"text-3xl sm:text-4xl font-bold text-gray-900 mb-4\">Historiamme</h2><p class=\"text-xl text-gray-600\">Matkamme tulostusalan ammattilaisena</p></div><div class=\"max-w-3xl mx-auto space-y-8\"><div class=\"flex gap-6\"><div class=\"flex flex-col items-center\"><div class=\"w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-sm\">2012</div><div class=\"w-0.5 h-full bg-gray-300 mt-2\"></div></div><div class=\"pb-8\"><h3 class=\"text-xl font-bold text-gray-900 mb-1\">Yrityksen perustaminen</h3><p class=\"text-gray-600\">PrintMedia Finland Oy perustettiin palvelemaan suomalaisia tulostusalan ammattilaisia.</p></div></div><div class=\"flex gap-6\"><div class=\"flex flex-col items-center\"><div class=\"w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-sm\">2014</div><div class=\"w-0.5 h-full bg-gray-300 mt-2\"></div></div><div class=\"pb-8\"><h3 class=\"text-xl font-bold text-gray-900 mb-1\">Mimaki, Roland ja Mutoh</h3><p class=\"text-gray-600\">Aloitimme huolto- ja asiantuntijapalvelut Roland-, Mimaki- ja Mutoh-laitteille.</p></div></div><div class=\"flex gap-6\"><div class=\"flex flex-col items-center\"><div class=\"w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-sm\">2016</div><div class=\"w-0.5 h-full bg-gray-300 mt-2\"></div></div><div class=\"pb-8\"><h3 class=\"text-xl font-bold text-gray-900 mb-1\">Huoltopalvelut</h3><p class=\"text-gray-600\">Laajensimme toimintaamme kattaviin huolto- ja tukipalveluihin.</p></div></div><div class=\"flex gap-6\"><div class=\"flex flex-col items-center\"><div class=\"w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-sm\">2018</div><div class=\"w-0.5 h-full bg-gray-300 mt-2\"></div></div><div class=\"pb-8\"><h3 class=\"text-xl font-bold text-gray-900 mb-1\">GCC ja Docan</h3><p class=\"text-gray-600\">Aloitimme GCC-leikkureiden ja Docan UV-tulostimien maahantuonnin.</p></div></div><div class=\"flex gap-6\"><div class=\"flex flex-col items-center\"><div class=\"w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-sm\">2020</div><div class=\"w-0.5 h-full bg-gray-300 mt-2\"></div></div><div class=\"pb-8\"><h3 class=\"text-xl font-bold text-gray-900 mb-1\">JetBest-musteet</h3><p class=\"text-gray-600\">Otimme valikoimaan JetBest-musteet tarjotaksemme edullisen vaihtoehdon.</p></div></div><div class=\"flex gap-6\"><div class=\"flex flex-col items-center\"><div class=\"w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-sm\">2024</div></div><div class=\"pb-8\"><h3 class=\"text-xl font-bold text-gray-900 mb-1\">Jatkuva kehitys</h3><p class=\"text-gray-600\">Palvelemme satoja asiakkaita ympäri Suomen ja kehitämme palveluitamme jatkuvasti.</p></div></div></div></div></section>"}',
      sortOrder: 3,
      isVisible: true,
    },
    {
      id: 'fallback-company-partners',
      type: 'custom_html',
      title: 'Yhteistyökumppanit',
      content: null,
      settings: '{"html":"<section class=\"py-16 lg:py-24\"><div class=\"mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl\"><div class=\"text-center mb-12\"><h2 class=\"text-3xl sm:text-4xl font-bold text-gray-900 mb-4\">Yhteistyökumppanimme</h2><p class=\"text-xl text-gray-600\">Olemme valtuutettu jälleenmyyjä seuraaville merkeille</p></div><div class=\"flex flex-wrap justify-center items-center gap-12\"><img src=\"/images/logos/fayon-logo.png\" alt=\"Fayon\" class=\"h-12 transition-all\" /><img src=\"/images/logos/GCC_Logo.png\" alt=\"GCC\" class=\"h-12 transition-all\" /><img src=\"/images/logos/docan_logo2.jpg\" alt=\"Docan\" class=\"h-12 transition-all\" /><img src=\"/images/logos/sai-flexi-logo.png\" alt=\"Flexi\" class=\"h-12 transition-all\" /></div></div></section>"}',
      sortOrder: 4,
      isVisible: true,
    },
    {
      id: 'fallback-company-cta',
      type: 'cta',
      title: null,
      content: null,
      settings: '{"variant":"dark","title":"Haluatko kuulla lisää?","description":"Ota yhteyttä ja kerro tarpeistasi. Autamme mielellämme löytämään parhaan ratkaisun.","primaryCta":{"text":"Ota yhteyttä","href":"/yhteystiedot"},"secondaryCta":{"text":"Soita meille","href":"tel:+358405048822"}}',
      sortOrder: 5,
      isVisible: true,
    },
  ],
}

export function getFallbackPageBySlug(slug: string): FallbackPage | null {
  if (slug === '' || slug === 'etusivu') {
    return fallbackHomePage
  }

  if (slug === 'yritys') {
    return fallbackCompanyPage
  }

  return null
}