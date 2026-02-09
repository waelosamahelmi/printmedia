# Complete Pages Migration Data

Copy and paste these page definitions into `migrate-hardcoded-pages.ts` in the `pages` array (after the homepage).

## Instructions:
1. Open `scripts/migrate-hardcoded-pages.ts`
2. Find the `pages` array (around line 24)
3. Add these page objects after the homepage definition
4. Run `npm run db:migrate-pages`

---

## COMPLETE PAGE DEFINITIONS (Copy these into the pages array):

```typescript
// Yritys page - COPY THIS INTO THE SCRIPT
{
  slug: 'yritys',
  title: 'Tietoa meistä',
  description: 'PrintMedia Finland Oy - Luotettava kumppanisi tulostus- ja leikkausratkaisuissa vuodesta 2012.',
  metaTitle: 'Tietoa meistä',
  metaDesc: 'PrintMedia Finland Oy - Luotettava kumppanisi tulostus- ja leikkausratkaisuissa vuodesta 2012.',
  status: 'PUBLISHED',
  sections: [
    {
      type: 'content',
      sortOrder: 0,
      isVisible: true,
      settings: {
        html: `
          <div class="bg-gradient-to-b from-gray-50 to-white py-16">
            <div class="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 class="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                  Luotettava kumppanisi <span class="gradient-text">tulostusalalla</span>
                </h1>
                <p class="text-xl text-gray-600 mb-8">
                  PrintMedia Finland Oy on vuonna 2012 perustettu suomalainen yritys, joka tarjoaa ammattitason tulostus- ja leikkausratkaisuja.
                </p>
                <div class="flex flex-wrap gap-4">
                  <a href="/yhteystiedot" class="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700">Ota yhteyttä</a>
                  <a href="/laitteet" class="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50">Tutustu laitteisiin</a>
                </div>
              </div>
              <div class="relative">
                <img src="/images/logos/logo.svg" alt="PrintMedia" class="w-full object-contain bg-white p-8 rounded-2xl shadow-2xl" />
              </div>
            </div>

            <div class="py-16 bg-primary-600 text-white mt-16">
              <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div><div class="text-4xl font-bold mb-2">10+</div><div class="text-primary-100">Vuotta kokemusta</div></div>
                <div><div class="text-4xl font-bold mb-2">500+</div><div class="text-primary-100">Tyytyväistä asiakasta</div></div>
                <div><div class="text-4xl font-bold mb-2">1000+</div><div class="text-primary-100">Toimitettua laitetta</div></div>
                <div><div class="text-4xl font-bold mb-2">100%</div><div class="text-primary-100">Takuu laitteille</div></div>
              </div>
            </div>
          </div>
        `,
        maxWidth: 'full'
      }
    },
    {
      type: 'features',
      sortOrder: 1,
      isVisible: true,
      settings: {
        title: 'Arvomme',
        subtitle: 'Nämä arvot ohjaavat toimintaamme päivittäin',
        features: [
          { icon: 'Award', title: 'Laatu', description: 'Myymme vain laadukkaita laitteita.' },
          { icon: 'Users', title: 'Asiakaslähtöisyys', description: 'Kuuntelemme asiakkaitamme.' },
          { icon: 'Clock', title: 'Nopeus', description: 'Reagoimme nopeasti.' },
          { icon: 'Building2', title: 'Luotettavuus', description: 'Pidämme lupauksemme.' }
        ]
      }
    },
    {
      type: 'cta',
      sortOrder: 2,
      isVisible: true,
      settings: {
        variant: 'dark',
        title: 'Haluatko kuulla lisää?',
        description: 'Ota yhteyttä ja kerro tarpeistasi.',
        primaryCta: { text: 'Ota yhteyttä', href: '/yhteystiedot' }
      }
    }
  ]
},

// Huolto page
{
  slug: 'huolto',
  title: 'Huolto ja tuki',
  description: 'Kattavat huolto- ja tukipalvelut.',
  metaTitle: 'Huolto ja tuki',
  metaDesc: 'PrintMedia PM Solutions tarjoaa kattavat huolto- ja tukipalvelut.',
  status: 'PUBLISHED',
  sections: [
    {
      type: 'hero',
      sortOrder: 0,
      isVisible: true,
      settings: {
        subtitle: 'Huoltopalvelut',
        title: 'Huolto ja tuki',
        description: 'Tarjoamme kattavat huolto- ja tukipalvelut kaikille myymillemme laitteille.',
        primaryCta: { text: 'Ota yhteyttä', href: '/yhteystiedot' },
        secondaryCta: { text: 'Soita 0440 875 025', href: 'tel:+358440875025' }
      }
    },
    {
      type: 'cta',
      sortOrder: 1,
      isVisible: true,
      settings: {
        variant: 'dark',
        title: 'Tarvitsetko huoltoapua?',
        description: 'Ota meihin yhteyttä puhelimitse tai sähköpostitse.',
        primaryCta: { text: 'Ota yhteyttä', href: '/yhteystiedot' }
      }
    }
  ]
},

// Yhteystiedot page
{
  slug: 'yhteystiedot',
  title: 'Yhteystiedot',
  description: 'Ota yhteyttä PrintMedia PM Solutions Oy:öön.',
  metaTitle: 'Yhteystiedot',
  metaDesc: 'Ota yhteyttä PrintMedia PM Solutions Oy:öön. Puh: 0440 875 025',
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

// Toimitusehdot page
{
  slug: 'toimitusehdot',
  title: 'Toimitusehdot',
  description: 'PrintMedia PM Solutions Oy:n yleiset toimitusehdot.',
  metaTitle: 'Toimitusehdot',
  metaDesc: 'PrintMedia PM Solutions Oy:n yleiset toimitusehdot.',
  status: 'PUBLISHED',
  sections: [
    {
      type: 'content',
      sortOrder: 0,
      isVisible: true,
      settings: {
        html: `
          <h1 class="text-4xl font-bold mb-8">Yleiset toimitusehdot</h1>
          <h2 class="text-2xl font-bold mb-4">1. Yleistä</h2>
          <p class="mb-6">Näitä ehtoja sovelletaan PrintMedia PM Solutions Oy:n ja asiakkaan välisiin sopimuksiin.</p>
          <h2 class="text-2xl font-bold mb-4">2. Tilaukset ja toimitukset</h2>
          <p class="mb-6">Tilaukset käsitellään saapumisjärjestyksessä.</p>
          <h2 class="text-2xl font-bold mb-4">3. Maksuehdot</h2>
          <p class="mb-6">Maksuehto on 14 päivää netto.</p>
        `,
        maxWidth: 'lg'
      }
    }
  ]
},

// Hinnasto page
{
  slug: 'hinnasto',
  title: 'Hinnasto',
  description: 'Lataa PrintMedia PM Solutions Oy:n hinnasto.',
  metaTitle: 'Hinnasto',
  metaDesc: 'Lataa hinnasto PDF-muodossa.',
  status: 'PUBLISHED',
  sections: [
    {
      type: 'content',
      sortOrder: 0,
      isVisible: true,
      settings: {
        html: `
          <div class="text-center mb-12">
            <h1 class="text-4xl font-bold mb-4">Hinnastot</h1>
            <p class="text-xl text-gray-600">Lataa tuotehinnastomme alta. Hinnat ilman ALV 24%.</p>
          </div>
          <div class="max-w-2xl mx-auto text-center">
            <a href="/files/PrintMedia_-_HINNASTO_2023_V2.pdf" target="_blank"
               class="inline-flex items-center gap-3 bg-primary-600 text-white px-8 py-4 rounded-lg hover:bg-primary-700">
              📥 Lataa hinnasto (PDF)
            </a>
          </div>
        `,
        maxWidth: 'lg'
      }
    },
    {
      type: 'cta',
      sortOrder: 1,
      isVisible: true,
      settings: {
        variant: 'default',
        title: 'Tarvitsetko tarjouksen?',
        description: 'Ota yhteyttä myyntiimme.',
        primaryCta: { text: 'Ota yhteyttä', href: '/yhteystiedot' }
      }
    }
  ]
},

// Tulostusmateriaalit page
{
  slug: 'tulostusmateriaalit',
  title: 'Tulostusmateriaalit',
  description: 'Laaja valikoima tulostusmedioita.',
  metaTitle: 'Tulostusmateriaalit',
  metaDesc: 'Tarrat, kalvot, pressut, bannerit ja laminaatit.',
  status: 'PUBLISHED',
  sections: [
    {
      type: 'content',
      sortOrder: 0,
      isVisible: true,
      settings: {
        html: `
          <h1 class="text-4xl font-bold mb-4">Tulostusmateriaalit</h1>
          <p class="text-xl text-gray-600 mb-12">Laaja valikoima tulostusmedioita rullatavarana.</p>
          <div class="text-center">
            <a href="/files/hinnasto2022-tulostusmateriaalit.pdf" target="_blank"
               class="inline-flex items-center gap-3 bg-primary-600 text-white px-8 py-4 rounded-lg hover:bg-primary-700">
              📥 Lataa hinnasto
            </a>
          </div>
        `,
        maxWidth: 'lg'
      }
    },
    {
      type: 'cta',
      sortOrder: 1,
      isVisible: true,
      settings: {
        variant: 'default',
        title: 'Tarvitsetko tulostusmateriaaleja?',
        description: 'Ota yhteyttä myyntiimme.',
        primaryCta: { text: 'Ota yhteyttä', href: '/yhteystiedot' }
      }
    }
  ]
},

// Tulostusvarit page
{
  slug: 'tulostusvarit',
  title: 'Tulostusvärit',
  description: 'Huippulaadukkaat eco-solvent tulostusvärit.',
  metaTitle: 'Tulostusvärit',
  metaDesc: 'Jetbest eco-solvent tulostusvärit.',
  status: 'PUBLISHED',
  sections: [
    {
      type: 'content',
      sortOrder: 0,
      isVisible: true,
      settings: {
        html: `
          <h1 class="text-4xl font-bold mb-4">Tulostusvärit</h1>
          <p class="text-xl text-gray-600 mb-12">Huippulaadukkaat eco-solvent tulostusvärit.</p>
          <div class="bg-gray-50 rounded-2xl p-8">
            <h2 class="text-2xl font-bold mb-4">Jetbest Eco-Solvent</h2>
            <p class="text-gray-600">Laadukkaat lähes alkuperäistä vastaavat värikasetit.</p>
          </div>
        `,
        maxWidth: 'lg'
      }
    },
    {
      type: 'cta',
      sortOrder: 1,
      isVisible: true,
      settings: {
        variant: 'default',
        title: 'Tilaa tulostusvärit',
        description: 'Ota yhteyttä myyntiimme.',
        primaryCta: { text: 'Ota yhteyttä', href: '/yhteystiedot' }
      }
    }
  ]
},

// Display page
{
  slug: 'display',
  title: 'Display-tuotteet',
  description: 'Roll-up telineet, messuseinät ja messupöydät.',
  metaTitle: 'Display-tuotteet',
  metaDesc: 'Roll-up telineet, messuseinät ja messupöydät.',
  status: 'PUBLISHED',
  sections: [
    {
      type: 'content',
      sortOrder: 0,
      isVisible: true,
      settings: {
        html: `
          <h1 class="text-4xl font-bold mb-4">Display-tuotteet</h1>
          <p class="text-xl text-gray-600">Laadukkaat display-tuotteet messuille ja tapahtumiin.</p>
        `,
        maxWidth: 'lg'
      }
    },
    {
      type: 'categories',
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
      type: 'cta',
      sortOrder: 2,
      isVisible: true,
      settings: {
        variant: 'gradient',
        title: 'Suunnitteletko messuja?',
        description: 'Autamme sinua valitsemaan oikeat display-tuotteet.',
        primaryCta: { text: 'Pyydä tarjous', href: '/yhteystiedot' }
      }
    }
  ]
},

// Laitteet page
{
  slug: 'laitteet',
  title: 'Laitteet',
  description: 'Tulostus- ja leikkauslaitteet.',
  metaTitle: 'Laitteet',
  metaDesc: 'Docan UV-tulostimet, GCC-tarraleikkurit ja laminaattorit.',
  status: 'PUBLISHED',
  sections: [
    {
      type: 'content',
      sortOrder: 0,
      isVisible: true,
      settings: {
        html: `
          <h1 class="text-4xl font-bold mb-4">Laitteet</h1>
          <p class="text-xl text-gray-600">Ammattitason tulostus- ja leikkauslaitteet.</p>
        `,
        maxWidth: 'lg'
      }
    },
    {
      type: 'categories',
      sortOrder: 1,
      isVisible: true,
      settings: {
        title: 'Laitekategoriat',
        subtitle: 'Valitse kategoria',
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
        description: 'Kerro meille tarpeistasi.',
        primaryCta: { text: 'Ota yhteyttä', href: '/yhteystiedot' }
      }
    }
  ]
},

// Tarvikkeet page
{
  slug: 'tarvikkeet',
  title: 'Tarvikkeet',
  description: 'Varaosat ja muut tarvikkeet.',
  metaTitle: 'Tarvikkeet',
  metaDesc: 'Tulostusmateriaalit, musteet ja muut tarvikkeet.',
  status: 'PUBLISHED',
  sections: [
    {
      type: 'content',
      sortOrder: 0,
      isVisible: true,
      settings: {
        html: `
          <h1 class="text-4xl font-bold mb-4">Tarvikkeet</h1>
          <p class="text-xl text-gray-600">Laaja valikoima tarvikkeita ammattikäyttöön.</p>
        `,
        maxWidth: 'lg'
      }
    },
    {
      type: 'categories',
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
      type: 'cta',
      sortOrder: 2,
      isVisible: true,
      settings: {
        variant: 'default',
        title: 'Tarvitsetko apua valinnassa?',
        description: 'Autamme sinua löytämään oikeat tarvikkeet.',
        primaryCta: { text: 'Ota yhteyttä', href: '/yhteystiedot' }
      }
    }
  ]
}
```

---

## How to Use:

1. **Open the migration script:**
   ```bash
   code scripts/migrate-hardcoded-pages.ts
   ```

2. **Find the `pages` array** (around line 24)

3. **Add a comma after the homepage object**, then paste all the page definitions from above

4. **Save the file**

5. **Run the migration:**
   ```bash
   npm run db:migrate-pages
   ```

6. **Check the results:**
   - Go to `/admin/pages` to see all migrated pages
   - Visit each page URL to verify they display correctly
   - Edit them through the admin panel!

## Notes:
- The homepage has an empty slug `''` which maps to `/`
- All other pages use their slug as the URL
- You can edit these pages through `/admin/pages` after migration
- The content sections use HTML for complex layouts
- Hero, CTA, Features, Categories, Products, and Contact sections use structured data
