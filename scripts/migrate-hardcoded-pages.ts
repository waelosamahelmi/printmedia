import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface SectionData {
  type: string
  title?: string
  settings: Record<string, any>
  sortOrder: number
  isVisible: boolean
}

interface PageData {
  slug: string
  title: string
  description: string
  metaTitle: string
  metaDesc: string
  status: 'PUBLISHED' | 'DRAFT'
  sections: SectionData[]
}

// ============================================================
// ALL PAGES WITH ACTUAL CONTENT FROM HARDCODED FILES
// ============================================================

const pages: PageData[] = [
  // ──────────────────────────────────────────────────────
  // HOMEPAGE (slug: '')
  // ──────────────────────────────────────────────────────
  {
    slug: '',
    title: 'Suurkuvatulostusalan tukkukauppa',
    description: 'Tarjoamme laajan valikoiman UV-tulostimia, leikkureita, laminaattoreita ja tarvikkeita ammattilaisille.',
    metaTitle: 'PrintMedia PM Solutions | Suurkuvatulostusalan tukkukauppa',
    metaDesc: 'Tarjoamme laajan valikoiman UV-tulostimia, leikkureita, laminaattoreita ja tarvikkeita ammattilaisille.',
    status: 'PUBLISHED',
    sections: [
      {
        type: 'hero',
        sortOrder: 0,
        isVisible: true,
        settings: {
          subtitle: 'PrintMedia PM Solutions Oy',
          title: 'Suurkuvatulostusalan tukkukauppa',
          description: 'Tarjoamme laajan valikoiman UV-tulostimia, leikkureita, laminaattoreita ja tarvikkeita ammattilaisille.',
          primaryCta: { text: 'Tutustu laitteisiin', href: '/laitteet' },
          secondaryCta: { text: 'Ota yhteyttä', href: '/yhteystiedot' },
          image: '/images/devices/J5-132.jpg',
          features: ['Valtuutettu jälleenmyyjä', 'Ammattitaitoinen huolto', 'Nopea toimitus']
        }
      },
      {
        type: 'features',
        sortOrder: 1,
        isVisible: true,
        settings: {
          title: 'Miksi valita PrintMedia?',
          subtitle: 'Olemme luotettava kumppanisi tulostusalalla',
          features: [
            { icon: 'Award', title: 'Valtuutettu jälleenmyyjä', description: 'Olemme virallinen jälleenmyyjä monille johtaville brändeille' },
            { icon: 'Wrench', title: 'Ammattitaitoinen huolto', description: 'Kokeneet teknikkomme huoltavat laitteesi nopeasti' },
            { icon: 'Truck', title: 'Nopea toimitus', description: 'Toimitamme tuotteet nopeasti ympäri Suomen' },
            { icon: 'Users', title: 'Asiantunteva tuki', description: 'Autamme tuotevalinnoissa ja neuvomme käytössä' }
          ]
        }
      },
      {
        type: 'categories',
        sortOrder: 2,
        isVisible: true,
        settings: {
          title: 'Tuotekategoriat',
          subtitle: 'Löydä sopiva ratkaisu tarpeisiisi laajasta valikoimastamme',
          mode: 'auto',
          limit: 6
        }
      },
      {
        type: 'products',
        sortOrder: 3,
        isVisible: true,
        settings: {
          title: 'Suositut tuotteet',
          subtitle: 'Tutustu suosituimpiin tuotteisiimme',
          mode: 'featured',
          limit: 4,
          viewAllHref: '/laitteet'
        }
      },
      {
        type: 'cta',
        sortOrder: 4,
        isVisible: true,
        settings: {
          variant: 'gradient',
          title: 'Tarvitsetko apua valinnoissa?',
          description: 'Asiantuntijamme auttavat sinua löytämään juuri sinun tarpeisiisi sopivan ratkaisun.',
          primaryCta: { text: 'Pyydä tarjous', href: '/yhteystiedot' },
          secondaryCta: { text: 'Soita 0440 875 025', href: 'tel:+358440875025' }
        }
      }
    ]
  },

  // ──────────────────────────────────────────────────────
  // YRITYS (slug: 'yritys')
  // ──────────────────────────────────────────────────────
  {
    slug: 'yritys',
    title: 'Tietoa meistä',
    description: 'PrintMedia Finland Oy - Luotettava kumppanisi tulostus- ja leikkausratkaisuissa vuodesta 2012.',
    metaTitle: 'Tietoa meistä',
    metaDesc: 'PrintMedia Finland Oy - Luotettava kumppanisi tulostus- ja leikkausratkaisuissa vuodesta 2012.',
    status: 'PUBLISHED',
    sections: [
      {
        type: 'hero',
        sortOrder: 0,
        isVisible: true,
        settings: {
          title: 'Luotettava kumppanisi tulostusalalla',
          description: 'PrintMedia Finland Oy on vuonna 2012 perustettu suomalainen yritys, joka tarjoaa ammattitason tulostus- ja leikkausratkaisuja. Palvelemme asiakkaitamme asiantuntemuksella ja luotettavuudella.',
          primaryCta: { text: 'Ota yhteyttä', href: '/yhteystiedot' },
          secondaryCta: { text: 'Tutustu laitteisiin', href: '/laitteet' },
          image: '/images/logos/logo.svg'
        }
      },
      {
        type: 'custom_html',
        title: 'Tilastot',
        sortOrder: 1,
        isVisible: true,
        settings: {
          html: `<section class="py-16 bg-primary-600 text-white">
  <div class="container mx-auto px-4">
    <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
      <div>
        <div class="text-4xl font-bold mb-2">10+</div>
        <div class="text-primary-100">Vuotta kokemusta</div>
      </div>
      <div>
        <div class="text-4xl font-bold mb-2">500+</div>
        <div class="text-primary-100">Tyytyväistä asiakasta</div>
      </div>
      <div>
        <div class="text-4xl font-bold mb-2">1000+</div>
        <div class="text-primary-100">Toimitettua laitetta</div>
      </div>
      <div>
        <div class="text-4xl font-bold mb-2">100%</div>
        <div class="text-primary-100">Takuu laitteille</div>
      </div>
    </div>
  </div>
</section>`
        }
      },
      {
        type: 'features',
        title: 'Arvomme',
        sortOrder: 2,
        isVisible: true,
        settings: {
          title: 'Arvomme',
          subtitle: 'Nämä arvot ohjaavat toimintaamme päivittäin',
          features: [
            { icon: 'Award', title: 'Laatu', description: 'Myymme vain laadukkaita laitteita, joihin uskomme itsekin.' },
            { icon: 'Users', title: 'Asiakaslähtöisyys', description: 'Kuuntelemme asiakkaitamme ja etsimme parhaat ratkaisut heidän tarpeisiinsa.' },
            { icon: 'Clock', title: 'Nopeus', description: 'Reagoimme nopeasti ja toimitamme tuotteet viivytyksettä.' },
            { icon: 'Building2', title: 'Luotettavuus', description: 'Pidämme lupauksemme ja seisomme tuotteidemme takana.' }
          ]
        }
      },
      {
        type: 'custom_html',
        title: 'Historiamme',
        sortOrder: 3,
        isVisible: true,
        settings: {
          html: `<section class="py-16 lg:py-24 bg-gray-50">
  <div class="container mx-auto px-4">
    <div class="text-center mb-12">
      <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Historiamme</h2>
      <p class="text-xl text-gray-600">Matkamme tulostusalan ammattilaisena</p>
    </div>
    <div class="max-w-3xl mx-auto space-y-8">
      <div class="flex gap-6">
        <div class="flex flex-col items-center">
          <div class="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-sm">2012</div>
          <div class="w-0.5 h-full bg-gray-300 mt-2"></div>
        </div>
        <div class="pb-8">
          <h3 class="text-xl font-bold text-gray-900 mb-1">Yrityksen perustaminen</h3>
          <p class="text-gray-600">PrintMedia Finland Oy perustettiin palvelemaan suomalaisia tulostusalan ammattilaisia.</p>
        </div>
      </div>
      <div class="flex gap-6">
        <div class="flex flex-col items-center">
          <div class="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-sm">2014</div>
          <div class="w-0.5 h-full bg-gray-300 mt-2"></div>
        </div>
        <div class="pb-8">
          <h3 class="text-xl font-bold text-gray-900 mb-1">Mimaki-edustus</h3>
          <p class="text-gray-600">Aloitimme yhteistyön Mimakin kanssa ja saimme valtuutetun jälleenmyyjän statuksen.</p>
        </div>
      </div>
      <div class="flex gap-6">
        <div class="flex flex-col items-center">
          <div class="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-sm">2016</div>
          <div class="w-0.5 h-full bg-gray-300 mt-2"></div>
        </div>
        <div class="pb-8">
          <h3 class="text-xl font-bold text-gray-900 mb-1">Huoltopalvelut</h3>
          <p class="text-gray-600">Laajensimme toimintaamme kattaviin huolto- ja tukipalveluihin.</p>
        </div>
      </div>
      <div class="flex gap-6">
        <div class="flex flex-col items-center">
          <div class="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-sm">2018</div>
          <div class="w-0.5 h-full bg-gray-300 mt-2"></div>
        </div>
        <div class="pb-8">
          <h3 class="text-xl font-bold text-gray-900 mb-1">GCC ja Docan</h3>
          <p class="text-gray-600">Aloitimme GCC-leikkureiden ja Docan UV-tulostimien maahantuonnin.</p>
        </div>
      </div>
      <div class="flex gap-6">
        <div class="flex flex-col items-center">
          <div class="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-sm">2020</div>
          <div class="w-0.5 h-full bg-gray-300 mt-2"></div>
        </div>
        <div class="pb-8">
          <h3 class="text-xl font-bold text-gray-900 mb-1">JetBest-musteet</h3>
          <p class="text-gray-600">Otimme valikoimaan JetBest-musteet tarjotaksemme edullisen vaihtoehdon.</p>
        </div>
      </div>
      <div class="flex gap-6">
        <div class="flex flex-col items-center">
          <div class="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-sm">2024</div>
        </div>
        <div class="pb-8">
          <h3 class="text-xl font-bold text-gray-900 mb-1">Jatkuva kehitys</h3>
          <p class="text-gray-600">Palvelemme satoja asiakkaita ympäri Suomen ja kehitämme palveluitamme jatkuvasti.</p>
        </div>
      </div>
    </div>
  </div>
</section>`
        }
      },
      {
        type: 'custom_html',
        title: 'Yhteistyökumppanit',
        sortOrder: 4,
        isVisible: true,
        settings: {
          html: `<section class="py-16 lg:py-24">
  <div class="container mx-auto px-4">
    <div class="text-center mb-12">
      <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Yhteistyökumppanimme</h2>
      <p class="text-xl text-gray-600">Olemme valtuutettu jälleenmyyjä seuraaville merkeille</p>
    </div>
    <div class="flex flex-wrap justify-center items-center gap-12">
      <img src="/images/logos/fayon-logo.png" alt="Fayon" class="h-12 grayscale hover:grayscale-0 transition-all" />
      <img src="/images/logos/GCC_Logo.png" alt="GCC" class="h-12 grayscale hover:grayscale-0 transition-all" />
      <img src="/images/logos/docan_logo2.jpg" alt="Docan" class="h-12 grayscale hover:grayscale-0 transition-all" />
      <img src="/images/logos/sai-flexi-logo.png" alt="Flexi" class="h-12 grayscale hover:grayscale-0 transition-all" />
    </div>
  </div>
</section>`
        }
      },
      {
        type: 'cta',
        sortOrder: 5,
        isVisible: true,
        settings: {
          variant: 'dark',
          title: 'Haluatko kuulla lisää?',
          description: 'Ota yhteyttä ja kerro tarpeistasi. Autamme mielellämme löytämään parhaan ratkaisun.',
          primaryCta: { text: 'Ota yhteyttä', href: '/yhteystiedot' },
          secondaryCta: { text: 'Soita meille', href: 'tel:+358405048822' }
        }
      }
    ]
  },

  // ──────────────────────────────────────────────────────
  // HUOLTO (slug: 'huolto')
  // ──────────────────────────────────────────────────────
  {
    slug: 'huolto',
    title: 'Huolto ja tuki',
    description: 'PrintMedia PM Solutions tarjoaa kattavat huolto- ja tukipalvelut, varaosat sekä RIP-ohjelmistot.',
    metaTitle: 'Huolto ja tuki',
    metaDesc: 'PrintMedia PM Solutions tarjoaa kattavat huolto- ja tukipalvelut, varaosat sekä RIP-ohjelmistot.',
    status: 'PUBLISHED',
    sections: [
      {
        type: 'hero',
        sortOrder: 0,
        isVisible: true,
        settings: {
          subtitle: 'Huoltopalvelut',
          title: 'Huolto ja tuki',
          description: 'Tarjoamme kattavat huolto- ja tukipalvelut kaikille myymillemme laitteille. Ammattitaitoiset teknikkomme palvelevat sinua nopeasti ja luotettavasti.',
          primaryCta: { text: 'Ota yhteyttä', href: '/yhteystiedot' },
          secondaryCta: { text: 'Soita 0440 875 025', href: 'tel:+358440875025' }
        }
      },
      {
        type: 'custom_html',
        title: 'Varaosat ja ohjelmistot',
        sortOrder: 1,
        isVisible: true,
        settings: {
          html: `<section class="py-16 lg:py-24">
  <div class="container mx-auto px-4">
    <div class="text-center mb-12">
      <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Varaosat ja ohjelmistot</h2>
      <p class="text-xl text-gray-600">Tarjoamme varaosat ja ohjelmistot ammattikäyttöön</p>
    </div>
    <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
      <a href="/huolto/tulostimien-varaosat" class="bg-white rounded-2xl p-6 shadow-lg shadow-gray-200/50 hover:shadow-xl transition-shadow group block">
        <div class="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary-200 transition-colors">
          <svg class="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
        </div>
        <h3 class="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">Tulostimien varaosat</h3>
        <p class="text-gray-600">Alkuperäiset ja yhteensopivat varaosat tulostimille. Tulostinpäät, pumput, veitset.</p>
      </a>
      <a href="/huolto/leikkureiden-varaosat" class="bg-white rounded-2xl p-6 shadow-lg shadow-gray-200/50 hover:shadow-xl transition-shadow group block">
        <div class="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary-200 transition-colors">
          <svg class="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path></svg>
        </div>
        <h3 class="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">Leikkureiden varaosat</h3>
        <p class="text-gray-600">Terät, leikkualustat, merkinlukijat ja muut leikkureiden varaosat.</p>
      </a>
      <a href="/huolto/ergosoft-rip" class="bg-white rounded-2xl p-6 shadow-lg shadow-gray-200/50 hover:shadow-xl transition-shadow group block">
        <div class="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary-200 transition-colors">
          <svg class="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"></path></svg>
        </div>
        <h3 class="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">ErgoSoft RIP 16</h3>
        <p class="text-gray-600">Ergosoft RIP 16 on korkealaatuinen ja monipuolinen RIP-ohjelmisto ammattikäyttöön.</p>
      </a>
      <a href="/huolto/flexi" class="bg-white rounded-2xl p-6 shadow-lg shadow-gray-200/50 hover:shadow-xl transition-shadow group block">
        <div class="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary-200 transition-colors">
          <svg class="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"></path></svg>
        </div>
        <h3 class="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">SAi Flexi</h3>
        <p class="text-gray-600">SAi Flexi - tehokas suunnittelu-, tulostin- ja leikkuriohjelmisto.</p>
      </a>
    </div>
  </div>
</section>`
        }
      },
      {
        type: 'custom_html',
        title: 'RIP-ohjelmistot',
        sortOrder: 2,
        isVisible: true,
        settings: {
          html: `<section class="py-16 lg:py-24 bg-gray-50">
  <div class="container mx-auto px-4">
    <div class="text-center mb-12">
      <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">RIP-ohjelmistot</h2>
      <p class="text-xl text-gray-600">Virallinen jälleenmyyjä</p>
    </div>
    <div class="flex flex-wrap justify-center items-center gap-12">
      <a href="/huolto/ergosoft-rip" class="bg-white rounded-xl px-8 py-6 shadow-lg hover:shadow-xl transition-shadow">
        <span class="text-2xl font-bold text-gray-800">ErgoSoft RIP 16</span>
      </a>
      <a href="/huolto/flexi">
        <img src="/images/logos/sai-flexi-logo.png" alt="SAi Flexi" class="h-16 w-auto opacity-80 hover:opacity-100 transition-opacity" />
      </a>
    </div>
  </div>
</section>`
        }
      },
      {
        type: 'custom_html',
        title: 'Yhteystiedot',
        sortOrder: 3,
        isVisible: true,
        settings: {
          html: `<section class="py-16 lg:py-24 bg-gray-900 text-white">
  <div class="container mx-auto px-4">
    <div class="grid md:grid-cols-2 gap-12 items-center">
      <div>
        <h2 class="text-3xl font-bold mb-6">Tarvitsetko huoltoapua?</h2>
        <p class="text-gray-300 mb-8">Ota meihin yhteyttä puhelimitse tai sähköpostitse. Pyrimme vastaamaan yhteydenottoihin mahdollisimman nopeasti.</p>
        <div class="space-y-4">
          <a href="tel:+358440875025" class="flex items-center gap-3 text-gray-300 hover:text-white transition-colors">
            <svg class="w-5 h-5 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
            0440 875 025
          </a>
          <a href="mailto:myynti@printmedia.fi" class="flex items-center gap-3 text-gray-300 hover:text-white transition-colors">
            <svg class="w-5 h-5 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
            myynti@printmedia.fi
          </a>
          <div class="flex items-center gap-3 text-gray-300">
            <svg class="w-5 h-5 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            Ma-Pe 8:00-16:00
          </div>
        </div>
      </div>
      <div class="bg-gray-800 rounded-2xl p-8">
        <h3 class="text-xl font-bold mb-4">Huoltopalvelun edut</h3>
        <ul class="space-y-3">
          <li class="flex items-start gap-3">
            <svg class="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span class="text-gray-300">Nopea reagointi vikatilanteisiin</span>
          </li>
          <li class="flex items-start gap-3">
            <svg class="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span class="text-gray-300">Kokeneet ja koulutetut teknikot</span>
          </li>
          <li class="flex items-start gap-3">
            <svg class="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span class="text-gray-300">Alkuperäiset varaosat varastosta</span>
          </li>
          <li class="flex items-start gap-3">
            <svg class="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span class="text-gray-300">Huoltopalvelu koko Suomessa</span>
          </li>
          <li class="flex items-start gap-3">
            <svg class="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span class="text-gray-300">Joustavat huoltosopimukset</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</section>`
        }
      }
    ]
  },

  // ──────────────────────────────────────────────────────
  // YHTEYSTIEDOT (slug: 'yhteystiedot')
  // ──────────────────────────────────────────────────────
  {
    slug: 'yhteystiedot',
    title: 'Yhteystiedot',
    description: 'Ota yhteyttä PrintMedia PM Solutions Oy:öön. Autamme sinua löytämään parhaat tulostus- ja leikkausratkaisut.',
    metaTitle: 'Yhteystiedot',
    metaDesc: 'Ota yhteyttä PrintMedia PM Solutions Oy:öön. Autamme sinua löytämään parhaat tulostus- ja leikkausratkaisut. Puh: 0440 875 025',
    status: 'PUBLISHED',
    sections: [
      {
        type: 'contact',
        sortOrder: 0,
        isVisible: true,
        settings: { showMap: true }
      }
    ]
  },

  // ──────────────────────────────────────────────────────
  // HINNASTO (slug: 'hinnasto')
  // ──────────────────────────────────────────────────────
  {
    slug: 'hinnasto',
    title: 'Hinnastot',
    description: 'Lataa PrintMedia PM Solutions Oy:n hinnasto. Tulostusvärit, tulostusmateriaalit, display-tuotteet ja laitteet.',
    metaTitle: 'Hinnasto | PrintMedia PM Solutions Oy',
    metaDesc: 'Lataa PrintMedia PM Solutions Oy:n hinnasto. Tulostusvärit, tulostusmateriaalit, display-tuotteet ja laitteet.',
    status: 'PUBLISHED',
    sections: [
      {
        type: 'custom_html',
        title: 'Hinnasto',
        sortOrder: 0,
        isVisible: true,
        settings: {
          html: `<div class="pt-32 pb-20">
  <div class="container mx-auto px-4">
    <!-- Header -->
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold text-gray-900 mb-4">Hinnastot</h1>
      <p class="text-xl text-gray-600 max-w-2xl mx-auto">Lataa tuotehinnastomme alta. Hinnat ilman arvonlisäveroa (ALV 24%).</p>
    </div>

    <!-- Main download card -->
    <div class="max-w-2xl mx-auto mb-12">
      <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div class="bg-gray-100 p-8 flex justify-center">
          <img src="/images/PrintMedia_-_Hinnasto_2023_kuva.png" alt="PrintMedia Hinnasto 2023" width="400" height="300" class="object-contain rounded-lg shadow-md" />
        </div>
        <div class="p-8 text-center">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">Hinnasto 2023</h2>
          <p class="text-gray-600 mb-6">Lataa täydellinen tuotehinnasto PDF-muodossa.</p>
          <a href="/files/PrintMedia_-_HINNASTO_2023_V2.pdf" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-3 bg-primary-600 text-white px-8 py-4 rounded-lg font-medium hover:bg-primary-700 transition-colors">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            Lataa hinnasto (PDF)
          </a>
        </div>
      </div>
    </div>

    <!-- Info box -->
    <div class="bg-gray-50 rounded-2xl p-8 mb-12">
      <h2 class="text-xl font-bold text-gray-900 mb-4">Huomioitavaa hinnoista</h2>
      <ul class="space-y-3 text-gray-600">
        <li class="flex items-start gap-3">
          <span class="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></span>
          Ilmoitamme hinnat ilman arvonlisäveroa 24%
        </li>
        <li class="flex items-start gap-3">
          <span class="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></span>
          Pidätämme oikeuden hintojen tarkistuksiin ilman ennakkoilmoitusta
        </li>
        <li class="flex items-start gap-3">
          <span class="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></span>
          Toimituskulut määräytyvät Matkahuollon ja Kaukokiidon voimassa olevien hinnastojen mukaan
        </li>
        <li class="flex items-start gap-3">
          <span class="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></span>
          Rullan kavennuksesta veloitamme 10€/rulla
        </li>
      </ul>
    </div>

    <!-- Contact CTA -->
    <div class="bg-primary-600 text-white rounded-2xl p-8">
      <div class="grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h2 class="text-2xl font-bold mb-4">Tarvitsetko tarjouksen?</h2>
          <p class="text-primary-100 mb-6">Ota yhteyttä myyntiimme niin autamme löytämään sopivat tuotteet ja teemme tarjouksen.</p>
          <a href="/yhteystiedot" class="inline-block bg-white text-primary-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">Ota yhteyttä</a>
        </div>
        <div class="space-y-4">
          <a href="tel:+358440875025" class="flex items-center gap-3 text-white hover:text-primary-200 transition-colors">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
            <span class="text-lg">0440 875 025</span>
          </a>
          <a href="mailto:myynti@printmedia.fi" class="flex items-center gap-3 text-white hover:text-primary-200 transition-colors">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
            <span class="text-lg">myynti@printmedia.fi</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</div>`
        }
      }
    ]
  },

  // ──────────────────────────────────────────────────────
  // TULOSTUSMATERIAALIT (slug: 'tulostusmateriaalit')
  // ──────────────────────────────────────────────────────
  {
    slug: 'tulostusmateriaalit',
    title: 'Tulostusmateriaalit',
    description: 'Laaja valikoima tulostusmedioita rullatavarana eri tulostimille. Tarrat, kalvot, pressut, bannerit, paperit ja laminaatit.',
    metaTitle: 'Tulostusmateriaalit | PrintMedia PM Solutions Oy',
    metaDesc: 'Laaja valikoima tulostusmedioita rullatavarana eri tulostimille. Tarrat, kalvot, pressut, bannerit, paperit ja laminaatit.',
    status: 'PUBLISHED',
    sections: [
      {
        type: 'custom_html',
        title: 'Tulostusmateriaalit',
        sortOrder: 0,
        isVisible: true,
        settings: {
          html: `<div class="pt-32 pb-20">
  <div class="container mx-auto px-4">
    <!-- Header -->
    <div class="mb-12">
      <h1 class="text-4xl font-bold text-gray-900 mb-4">Tulostusmateriaalit</h1>
      <p class="text-xl text-gray-600 max-w-3xl">Varastostamme löytyy laaja valikoima erilaisia tulostusmedioita rullatavarana eri tulostimille.</p>
    </div>

    <!-- Materials grid -->
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
      <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
        <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
          <svg class="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
        </div>
        <span class="text-lg font-medium text-gray-900">Tarrat</span>
      </div>
      <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
        <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
          <svg class="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
        </div>
        <span class="text-lg font-medium text-gray-900">Kalvot</span>
      </div>
      <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
        <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
          <svg class="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
        </div>
        <span class="text-lg font-medium text-gray-900">Pressut</span>
      </div>
      <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
        <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
          <svg class="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
        </div>
        <span class="text-lg font-medium text-gray-900">Bannerit</span>
      </div>
      <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
        <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
          <svg class="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
        </div>
        <span class="text-lg font-medium text-gray-900">Paperit</span>
      </div>
      <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
        <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
          <svg class="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
        </div>
        <span class="text-lg font-medium text-gray-900">Laminaatit</span>
      </div>
      <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
        <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
          <svg class="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
        </div>
        <span class="text-lg font-medium text-gray-900">Ja monet muut</span>
      </div>
    </div>

    <!-- Info section -->
    <div class="bg-gray-50 rounded-2xl p-8 mb-12">
      <div class="flex items-start gap-6">
        <div class="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
          <svg class="w-8 h-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
        </div>
        <div>
          <h2 class="text-2xl font-bold text-gray-900 mb-4">Jatkuvasti laajeneva valikoima</h2>
          <p class="text-gray-600 mb-4">Katso tarkempi valikoimamme hinnastosta tai kysy lisää myynnistämme!</p>
          <p class="text-gray-600">Etsimme jatkuvasti uusia tuotteita asiakkaidemme tarpeisiin.</p>
        </div>
      </div>
    </div>

    <!-- Download hinnasto -->
    <div class="bg-white rounded-2xl shadow-lg p-8 mb-12">
      <h2 class="text-2xl font-bold text-gray-900 mb-6 text-center">Lataa hinnasto</h2>
      <div class="flex flex-wrap justify-center gap-4">
        <a href="/files/hinnasto2022-tulostusmateriaalit.pdf" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-3 bg-primary-600 text-white px-8 py-4 rounded-lg hover:bg-primary-700 transition-colors">
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          <span class="text-lg font-medium">Tulostusmateriaalihinnasto (PDF)</span>
        </a>
      </div>
    </div>

    <!-- Contact CTA -->
    <div class="bg-primary-50 rounded-2xl p-8 text-center">
      <h2 class="text-2xl font-bold text-gray-900 mb-4">Tarvitsetko tulostusmateriaaleja?</h2>
      <p class="text-gray-600 mb-6">Ota yhteyttä myyntiimme niin autamme löytämään sopivat materiaalit.</p>
      <a href="/yhteystiedot" class="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors">Ota yhteyttä</a>
    </div>
  </div>
</div>`
        }
      }
    ]
  },

  // ──────────────────────────────────────────────────────
  // TULOSTUSVÄRIT (slug: 'tulostusvarit')
  // ──────────────────────────────────────────────────────
  {
    slug: 'tulostusvarit',
    title: 'Tulostusvärit',
    description: 'Huippulaadukkaat eco-solvent tulostusvärit Roland, Mutoh ja Mimaki tulostimiin. Jetbest-tuotemerkin musteet.',
    metaTitle: 'Tulostusvarit | PrintMedia PM Solutions Oy',
    metaDesc: 'Huippulaadukkaat eco-solvent tulostusvärit Roland, Mutoh ja Mimaki tulostimiin. Jetbest-tuotemerkin musteet.',
    status: 'PUBLISHED',
    sections: [
      {
        type: 'custom_html',
        title: 'Tulostusvärit',
        sortOrder: 0,
        isVisible: true,
        settings: {
          html: `<div class="pt-32 pb-20">
  <div class="container mx-auto px-4">
    <!-- Header -->
    <div class="mb-12">
      <h1 class="text-4xl font-bold text-gray-900 mb-4">Tulostusvärit</h1>
      <p class="text-xl text-gray-600 max-w-3xl">Vuosien kokemuksella! Huippulaadukkaat eco-solvent tulostusvärit Roland, Mutoh ja Mimaki tulostimiin.</p>
    </div>

    <!-- Jetbest section -->
    <div class="bg-gray-50 rounded-2xl p-8 mb-12">
      <div class="flex flex-col md:flex-row items-start gap-8">
        <div class="w-48 h-24 relative flex-shrink-0">
          <img src="/images/logos/jetbest_sahkoposti.jpg" alt="Jetbest" class="w-full h-full object-contain" />
        </div>
        <div>
          <h2 class="text-2xl font-bold text-gray-900 mb-4">Jetbest Eco-Solvent</h2>
          <p class="text-gray-600">Alkuperäisen värin käyttäjät voivat vaihtaa laadukkaat lähes alkuperäistä vastaavat värikasetit tulostimeen ilman mitään erillisiä toimenpiteitä. <strong>Väriprofiileja ei myöskään tarvitse uusia.</strong></p>
        </div>
      </div>
    </div>

    <!-- Main content -->
    <div class="grid lg:grid-cols-2 gap-12 mb-12">
      <div>
        <h3 class="text-xl font-bold text-gray-900 mb-4">Yhteensopivat värit</h3>
        <p class="text-gray-600 mb-4">Jetbestiltä löytyy lähes identtiset värit seuraaville:</p>
        <ul class="space-y-2 mb-8">
          <li class="flex items-center gap-3">
            <svg class="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
            <span class="text-gray-700">Roland Eco-sol Max</span>
          </li>
          <li class="flex items-center gap-3">
            <svg class="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
            <span class="text-gray-700">Roland Eco-sol Max 2</span>
          </li>
          <li class="flex items-center gap-3">
            <svg class="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
            <span class="text-gray-700">Mutoh Eco-solvent Ultra</span>
          </li>
          <li class="flex items-center gap-3">
            <svg class="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
            <span class="text-gray-700">Mimaki SS21</span>
          </li>
        </ul>

        <h3 class="text-xl font-bold text-gray-900 mb-4">Saatavilla olevat koot</h3>
        <ul class="space-y-2">
          <li class="flex items-center gap-3">
            <svg class="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
            <span class="text-gray-700">440ml patruunat</span>
          </li>
          <li class="flex items-center gap-3">
            <svg class="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
            <span class="text-gray-700">220ml patruunat</span>
          </li>
        </ul>
      </div>

      <div class="bg-white rounded-2xl p-8 shadow-lg">
        <h3 class="text-xl font-bold text-gray-900 mb-6">Dokumentit ja vertailut</h3>
        <div class="space-y-4">
          <a href="/files/ecosolmax_vs._jbnew-eco.pdf" target="_blank" rel="noopener noreferrer" class="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <svg class="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            <span class="text-gray-700">Jetbest vs. Roland Eco-Sol Max ja Mutoh Eco-Sol Ultra</span>
          </a>
          <a href="/files/ss21_vs_jbss21.pdf" target="_blank" rel="noopener noreferrer" class="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <svg class="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            <span class="text-gray-700">Jetbest vs. Mimaki SS21</span>
          </a>
          <a href="/files/ghs_ss21_safety_data_sheet_fi.pdf" target="_blank" rel="noopener noreferrer" class="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <svg class="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            <span class="text-gray-700">Käyttöturvallisuustiedote SS21</span>
          </a>
          <a href="/files/new_eco_ink_msds_fi.pdf" target="_blank" rel="noopener noreferrer" class="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <svg class="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            <span class="text-gray-700">Käyttöturvallisuustiedote ES3</span>
          </a>
        </div>
      </div>
    </div>

    <!-- Contact CTA -->
    <div class="bg-primary-600 text-white rounded-2xl p-8 text-center">
      <h2 class="text-2xl font-bold mb-4">Tilaa tulostusvärit</h2>
      <p class="text-primary-100 mb-6">Ota yhteyttä myyntiimme ja saat laadukkaat tulostusvärit nopeasti.</p>
      <a href="/yhteystiedot" class="inline-block bg-white text-primary-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">Ota yhteyttä</a>
    </div>
  </div>
</div>`
        }
      }
    ]
  },

  // ──────────────────────────────────────────────────────
  // TOIMITUSEHDOT (slug: 'toimitusehdot')
  // ──────────────────────────────────────────────────────
  {
    slug: 'toimitusehdot',
    title: 'Toimitusehdot',
    description: 'PrintMedia PM Solutions Oy:n yleiset toimitusehdot.',
    metaTitle: 'Toimitusehdot | PrintMedia PM Solutions Oy',
    metaDesc: 'PrintMedia PM Solutions Oy:n yleiset toimitusehdot. Voimassa 1.1.2011 alkaen.',
    status: 'PUBLISHED',
    sections: [
      {
        type: 'content',
        title: 'Toimitusehdot',
        sortOrder: 0,
        isVisible: true,
        settings: {
          maxWidth: 'lg',
          html: `<h1>Toimitusehdot</h1>
<p class="text-xl text-gray-600">PrintMedia PM Solutions Oy:n yleiset toimitusehdot 1.1.2011 alkaen</p>

<h2>Yleistä</h2>

<h3>Soveltamisala</h3>
<p>PrintMedia PM Solutions Oy:n yleisiä toimitusehtoja sovelletaan Suomessa tapahtuviin toimituksiin. Näissä ehdoissa PrintMedia PM Solutions Oy on myyjä ja asiakas on ostaja. Näitä ehtoja sovelletaan, ellei kirjallisesti ole toisin sovittu.</p>

<h3>Hinnat</h3>
<p>Ilmoitamme hinnat ilman arvonlisäveroa 24 %. Asennusajasta veloitamme 70 € / h, ajoajasta 50 € / h ja kilometrikorvaus 0,45 € / km. Rullan kavennuksesta veloitamme 10 € / rulla, rullan leveydestä riippumatta. Pidätämme oikeuden hintojen tarkistuksiin ilman ennakkoilmoitusta sekä virheellisen hinnoittelun korjaamiseen. Toimituskulut määräytyvät Matkahuollon ja Kaukokiidon voimassa olevien hinnastojen mukaan.</p>

<h3>Tarjoukset ja myyntiehdot</h3>
<p>Myyjän tarjoukset ovat voimassa tarjouksessa mainitun ajan. Mikäli voimassaoloaikaa ei ole mainittu, tarjous on voimassa yhden kuukauden tarjouksen päivämäärästä. Tarjouksen saajalla ei ole oikeutta käyttää tarjouksen tietoja myyjän vahingoksi tai antaa niistä tietoja kolmansille osapuolille.</p>

<h3>Tilaus</h3>
<p>Laitekaupassa sopimus syntyy, kun ostaja on hyväksynyt kauppasopimuksen tai tilausvahvistuksen ilman muutoksia ja/tai varauksia. Muussa kuin laitekaupassa sopimus syntyy, kun myyjä on vahvistanut tilauksen. Osan tuotteista toimitamme toimitusmyyntinä.</p>

<h2>Myyjän velvollisuudet</h2>

<h3>Toimitusaika</h3>
<p>Ellei toisin ole sovittu, toimitusaika on luettava alkavaksi sopimuksen syntymisajankohdasta. Ennen klo 14:00 tulleet tilaukset lähtevät meiltä Matkahuoltoon vielä samana päivänä. Lavatavarat toimitamme 2 päivän sisällä tilauksesta (Kaukokiito, Transpoint, Kiitolinja).</p>
<p>Käytössämme olevat toimitustavat ovat: Matkahuolto (bussirahti, jakorahti, pikarahti), Kaukokiito (lavatavarat), Posti (kirje), Transpoint ja Kiitolinja (asiakkaan omalla sopimuksella).</p>

<h3>Toimitusehtolausekkeet</h3>
<p>Kotimaan kaupassa käytetään vapaasti varastosta, mikäli muuta ei ole sovittu. Laitekaupoissa toimitustapa on vapaasti varastoon, ellei toisin ole sovittu. Vaaranvastuu siirtyy ostajalle sovelletun toimitusehdon mukaan.</p>

<h3>Laitetakuu</h3>
<p>Myydyille laitteille on voimassa tarjouksen mukainen takuuaika, ellei toisin sovita. Laitetakuu sisältää laitteen korjaamisen PrintMedia PM Solutions Oy:n tiloissa Sysmässä tai asiakkaan omissa tiloissa. Myyjä maksaa takuulaitteen toimittamisen Sysmään ja palauttaa laitteen asiakkaalle ilman rahtikuluja.</p>
<p>Laitetakuu ei ole voimassa, mikäli laitteen ylläpidosta ei ole huolehdittu asianmukaisesti. Mikäli on todettavissa, että rikkoutuminen on käyttäjän aiheuttama tai mikäli laitteeseen on tehty muutoksia tai siinä ei käytetä tai ei ole käytetty PrintMedia PM Solutions Oy:n toimittamia tarvikkeita (esim. värit). Laitteen korjaaminen ei pidennä sen takuuaikaa.</p>
<p>Takuu kattaa vain laitteelle itselleen tapahtuvat vahingot. Takuuseen perustuva vaatimus on esitettävä tuotteen myyjälle 7 arkipäivän kuluessa siitä, kun takuun kattava vika on havaittu.</p>

<h3>Tuotteen ominaisuudet</h3>
<p>Myyjä vastaa tuotteen laadusta ja muista ominaisuuksista vain sopimuksessa määriteltyjen tietojen mukaisesti. Myyjän korvausvelvollisuus kattaa ainoastaan viallisen tuotteen ostohinnan. Myyjällä ei ole velvollisuutta korvata muita välittömiä eikä välillisiä vahinkoja tai kustannuksia.</p>

<h3>Viivästys</h3>
<p>Myyjä on velvollinen heti viivästyksestä tiedon saatuaan ilmoittamaan siitä ostajalle ilmoittaen samalla viivästyksen syyn ja arvioidun uuden toimituspäivän.</p>

<h2>Ostajan velvollisuudet</h2>

<h3>Kauppahinnan suorittaminen</h3>
<p>Mikäli maksuajasta ei ole muuta sovittu, on se neljätoista (14) pv netto. Maksuaika lasketaan laskun päivämäärästä.</p>

<h3>Viivästyskorko ja perintäkulut</h3>
<p>Maksun viivästyessä viivästysajalta peritään yhdentoista (11) prosentin viivästyskorko. Myyjällä on viivästyskoron lisäksi oikeus periä kohtuulliset perintäkulut.</p>

<h3>Vastaanotto- ja käyttötarkastus</h3>
<p>Ostajan tai tämän edustajan on tavaraa vastaanottaessaan todettava, että toimitus on lähetysluettelon mukainen ja tarkastettava, että se on ulkopuolisesti vahingoittumaton. Vastaanottotarkastus on tehtävä 7 pv:n kuluessa tavaran saapumisesta ja samassa ajassa ilmoitettava mahdollinen virhe.</p>
<p>Kuljetusvahingosta tai kollien puuttumisesta, joka havaitaan tavaraa vastaanotettaessa, on ilmoitettava välittömästi rahdinkuljettajalle. Puutteesta on tehtävä merkintä rahtikirjaan ja asianmukainen reklamaatio myyjälle sekä rahdinkuljettajalle.</p>

<h3>Tuotteiden palautukset</h3>
<p>Ostajalla on oikeus palauttaa ostamansa tuote 7 pv:n sisällä tavaran vastaanottamisesta. Mikäli tuote on tilattu nimenomaan asiakkaalle tai sitä on leikattu tai muuten käsitelty, palautusoikeutta ei ole.</p>
<p>Tuotteiden palautuksesta on aina sovittava etukäteen myyjän edustajan kanssa ja palautuksen on tapahduttava välittömästi sopimuksen jälkeen. Myyjä ei suorita hyvityksiä ilman sopimusta palautetuista tavaroista. Tavarapalautuksen hyväksymisen ehtona on, että tavara pakkauksineen on palautettaessa täysin virheetön.</p>

<h2>Sopimuksen purkaminen</h2>

<h3>Ostajan oikeus purkuun</h3>
<p>Mikäli myyjän toimitus poikkeaa olennaisesti sovitusta eikä puutetta ostajan kirjallisen huomautuksen johdosta kohtuullisessa ajassa korjata tai uutta sopimuksen mukaista tavaraa toimiteta tai jos myyjästä riippuvasta syystä toimitus viivästyy olennaisesti siten, että siitä aiheutuu ostajalle kohtuutonta haittaa, ostajalla on oikeus purkaa sopimus.</p>

<h3>Myyjän oikeus purkuun</h3>
<p>Mikäli kauppahinnan maksu tai osa siitä olennaisesti viivästyy eräpäivästään, myyjällä on oikeus valintansa mukaan purkaa kauppa kokonaisuudessaan tai se osa kauppaa, jota koskevaa tavaraa ostaja ei ole vielä vastaanottanut.</p>

<h3>Ylivoimainen este</h3>
<p>Myyjä ei ole velvollinen täyttämään sopimusta, jos luonnoneste, tulipalo, konevaurio tai siihen verrattava häiriö, lakko, työsulku, sota, liikekannallepano, vienti- tai tuontikielto, kuljetusvälineiden puute, valmistuksen lopettaminen, liikennehäiriö tai muu sellainen este, jota myyjä ei voi voittaa, estää tavaran tai sen osan toimittamisen.</p>

<h2>Omistusoikeuden siirtyminen</h2>
<p>Omistusoikeus tavaraan siirtyy ostajalle silloin, kun koko kauppahinta on maksettu, ellei erikseen ole toisin sovittu.</p>

<h2>Sovellettava laki ja erimielisyyksien ratkaiseminen</h2>
<p>Myyjän ja ostajan välisiin sopimuksiin sovelletaan Suomen lakia. Ellei toisin ole sovittu, myyjän ja ostajan väliset erimielisyydet ratkaistaan myyjän kotipaikan alioikeudessa.</p>

<div class="bg-gray-50 rounded-xl p-6 mt-12 not-prose">
  <p class="text-gray-600 mb-4">Toivomme, että olet tyytyväinen testattuihin tuotteisiimme ja voit tehdä kannattavaa tulostusta hyvällä menestyksellä.</p>
  <p class="font-semibold text-gray-900">PRINTMEDIA PM SOLUTIONS OY</p>
  <p class="text-gray-600">Harri Hynynen<br/>Toimitusjohtaja</p>
</div>`
        }
      }
    ]
  },

  // ──────────────────────────────────────────────────────
  // LAITTEET (slug: 'laitteet')
  // ──────────────────────────────────────────────────────
  {
    slug: 'laitteet',
    title: 'Laitteet',
    description: 'Tutustu PrintMedian laitevalikoimaan: Docan UV-tulostimet, GCC-tarraleikkurit, Jingwei-monitoimileikkurit ja Fayon-laminaattorit.',
    metaTitle: 'Laitteet',
    metaDesc: 'Tutustu PrintMedian laitevalikoimaan: Docan UV-tulostimet, GCC-tarraleikkurit, Jingwei-monitoimileikkurit ja Fayon-laminaattorit.',
    status: 'PUBLISHED',
    sections: [
      {
        type: 'custom_html',
        title: 'Hero',
        sortOrder: 0,
        isVisible: true,
        settings: {
          html: `<section class="bg-gradient-to-b from-gray-50 to-white py-16">
  <div class="container mx-auto px-4">
    <div class="max-w-3xl">
      <h1 class="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">Laitteet</h1>
      <p class="text-xl text-gray-600">Tarjoamme laajan valikoiman ammattitason tulostus- ja leikkauslaitteita. Olemme Docanin, GCC:n, Jingwein ja Fayonin valtuutettu jälleenmyyjä Suomessa.</p>
    </div>
  </div>
</section>`
        }
      },
      {
        type: 'categories',
        title: 'Laitekategoriat',
        sortOrder: 1,
        isVisible: true,
        settings: {
          title: 'Laitekategoriat',
          subtitle: 'Valitse kategoria nähdäksesi kaikki tuotteet',
          mode: 'auto',
          limit: 6
        }
      },
      {
        type: 'cta',
        sortOrder: 2,
        isVisible: true,
        settings: {
          variant: 'dark',
          title: 'Etkö löytänyt etsimääsi?',
          description: 'Kerro meille tarpeistasi, niin autamme sinua löytämään sopivan ratkaisun. Teemme myös erikoistilauksena laitteita.',
          primaryCta: { text: 'Ota yhteyttä', href: '/yhteystiedot' },
          secondaryCta: { text: 'Soita meille', href: 'tel:+358440875025' }
        }
      }
    ]
  },

  // ──────────────────────────────────────────────────────
  // DISPLAY (slug: 'display')
  // ──────────────────────────────────────────────────────
  {
    slug: 'display',
    title: 'Display-tuotteet',
    description: 'Roll-up telineet, messuseinät, messupöydät ja muut display-tuotteet.',
    metaTitle: 'Display-tuotteet',
    metaDesc: 'Roll-up telineet, messuseinät, messupöydät ja muut display-tuotteet.',
    status: 'PUBLISHED',
    sections: [
      {
        type: 'custom_html',
        title: 'Hero',
        sortOrder: 0,
        isVisible: true,
        settings: {
          html: `<section class="bg-gradient-to-b from-gray-50 to-white py-16">
  <div class="container mx-auto px-4">
    <div class="max-w-3xl">
      <h1 class="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">Display-tuotteet</h1>
      <p class="text-xl text-gray-600">Laadukkaat display-tuotteet messuille, tapahtumiin ja myymälöihin. Roll-up telineet, messuseinät, pöydät ja paljon muuta.</p>
    </div>
  </div>
</section>`
        }
      },
      {
        type: 'categories',
        title: 'Display-kategoriat',
        sortOrder: 1,
        isVisible: true,
        settings: {
          title: 'Display-kategoriat',
          subtitle: 'Valitse tuoteryhmä',
          mode: 'auto',
          limit: 6
        }
      },
      {
        type: 'features',
        title: 'Miksi valita meidän display-tuotteet?',
        sortOrder: 2,
        isVisible: true,
        settings: {
          title: 'Miksi valita meidän display-tuotteet?',
          features: [
            { icon: 'Award', title: 'Korkea laatu', description: 'Kestävät materiaalit ja huolellinen viimeistely takaavat pitkän käyttöiän.' },
            { icon: 'Truck', title: 'Nopea toimitus', description: 'Varastossa olevat tuotteet toimitetaan nopeasti. Pikatoimitus mahdollinen.' },
            { icon: 'DollarSign', title: 'Kilpailukykyiset hinnat', description: 'Edulliset hinnat ilman kompromisseja laadusta. Määräalennukset saatavilla.' }
          ]
        }
      },
      {
        type: 'cta',
        sortOrder: 3,
        isVisible: true,
        settings: {
          variant: 'gradient',
          title: 'Suunnitteletko messuja tai tapahtumaa?',
          description: 'Autamme sinua valitsemaan oikeat display-tuotteet ja voimme toimittaa myös painotyöt valmiisiin telineisiin.',
          primaryCta: { text: 'Pyydä tarjous', href: '/yhteystiedot' },
          secondaryCta: { text: 'Soita meille', href: 'tel:+358440875025' }
        }
      }
    ]
  },

  // ──────────────────────────────────────────────────────
  // TARVIKKEET (slug: 'tarvikkeet')
  // ──────────────────────────────────────────────────────
  {
    slug: 'tarvikkeet',
    title: 'Tarvikkeet',
    description: 'Varaosat ja muut tarvikkeet ammattikäyttöön.',
    metaTitle: 'Tarvikkeet',
    metaDesc: 'Varaosat ja muut tarvikkeet ammattikäyttöön.',
    status: 'PUBLISHED',
    sections: [
      {
        type: 'custom_html',
        title: 'Hero',
        sortOrder: 0,
        isVisible: true,
        settings: {
          html: `<section class="bg-gradient-to-b from-gray-50 to-white py-16">
  <div class="container mx-auto px-4">
    <div class="max-w-3xl">
      <h1 class="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">Tarvikkeet</h1>
      <p class="text-xl text-gray-600">Laaja valikoima tulostusmateriaaleja, musteita ja muita tarvikkeita. Kaikki mitä tarvitset ammattimaiseen tulostukseen ja leikkaukseen.</p>
    </div>
  </div>
</section>`
        }
      },
      {
        type: 'categories',
        title: 'Tarvikekategoriat',
        sortOrder: 1,
        isVisible: true,
        settings: {
          title: 'Tarvikekategoriat',
          subtitle: 'Tutustu valikoimaamme',
          mode: 'auto',
          limit: 6
        }
      },
      {
        type: 'custom_html',
        title: 'Ammattilaisille suunnitellut tarvikkeet',
        sortOrder: 2,
        isVisible: true,
        settings: {
          html: `<section class="py-16 lg:py-24">
  <div class="container mx-auto px-4">
    <div class="grid md:grid-cols-2 gap-12 items-center">
      <div>
        <h2 class="text-3xl font-bold text-gray-900 mb-6">Ammattilaisille suunnitellut tarvikkeet</h2>
        <p class="text-gray-600 mb-4">Tarjoamme laajan valikoiman laadukkaita tarvikkeita tulostus- ja leikkauslaitteiden ammattimaiseen käyttöön.</p>
        <p class="text-gray-600 mb-6">Valikoimastamme löydät turvaviivaimet, kiinnikkeet ja muut tarvittavat lisätarvikkeet.</p>
        <ul class="space-y-2 text-gray-600">
          <li class="flex items-center gap-2">
            <span class="w-2 h-2 bg-primary-500 rounded-full"></span>
            Laadukkaat materiaalit
          </li>
          <li class="flex items-center gap-2">
            <span class="w-2 h-2 bg-primary-500 rounded-full"></span>
            Nopea toimitus
          </li>
          <li class="flex items-center gap-2">
            <span class="w-2 h-2 bg-primary-500 rounded-full"></span>
            Kilpailukykyiset hinnat
          </li>
        </ul>
      </div>
      <div class="bg-gray-100 rounded-2xl p-8 text-center">
        <img src="/images/products/accessories/bannerclip.jpg" alt="Tarvikkeet" class="mx-auto max-h-64 object-contain" />
      </div>
    </div>
  </div>
</section>`
        }
      },
      {
        type: 'cta',
        sortOrder: 3,
        isVisible: true,
        settings: {
          variant: 'default',
          title: 'Tarvitsetko apua valinnassa?',
          description: 'Autamme sinua löytämään oikeat materiaalit ja tarvikkeet juuri sinun tarpeisiisi.',
          primaryCta: { text: 'Ota yhteyttä', href: '/yhteystiedot' },
          secondaryCta: { text: 'Soita meille', href: 'tel:+358440875025' }
        }
      }
    ]
  }
]

// ============================================================
// MIGRATION FUNCTION - Deletes existing and recreates all pages
// ============================================================

async function migratePages() {
  console.log('='.repeat(60))
  console.log('FULL PAGE MIGRATION - Replacing ALL pages with actual content')
  console.log('='.repeat(60))
  console.log(`\nFound ${pages.length} pages to migrate\n`)

  // Step 1: Delete all existing sections and pages
  console.log('Step 1: Cleaning existing data...')
  const deletedSections = await prisma.section.deleteMany({})
  console.log(`  Deleted ${deletedSections.count} sections`)
  const deletedPages = await prisma.page.deleteMany({})
  console.log(`  Deleted ${deletedPages.count} pages`)
  console.log('')

  // Step 2: Create all pages with sections
  console.log('Step 2: Creating pages with sections...\n')
  let successCount = 0
  let errorCount = 0

  for (const pageData of pages) {
    try {
      const page = await prisma.page.create({
        data: {
          slug: pageData.slug,
          title: pageData.title,
          description: pageData.description,
          metaTitle: pageData.metaTitle,
          metaDesc: pageData.metaDesc,
          status: pageData.status,
          template: 'default',
          sections: {
            create: pageData.sections.map(section => ({
              type: section.type,
              title: section.title || null,
              settings: JSON.stringify(section.settings),
              sortOrder: section.sortOrder,
              isVisible: section.isVisible,
            }))
          }
        },
        include: { sections: true }
      })

      console.log(`  ✅ Created "${pageData.slug || 'homepage'}" with ${page.sections.length} sections`)
      successCount++
    } catch (error) {
      console.error(`  ❌ Error creating page "${pageData.slug}":`, error)
      errorCount++
    }
  }

  console.log('\n' + '='.repeat(60))
  console.log(`Results: ✅ ${successCount} created | ❌ ${errorCount} errors`)
  console.log('='.repeat(60))
  console.log('\n✨ Migration complete!')
}

migratePages()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
