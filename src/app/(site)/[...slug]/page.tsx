import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { SectionRenderer } from '@/components/page/SectionRenderer'
import type { PageSection } from '@/lib/sections/types'
import { getFallbackPageBySlug } from '@/lib/fallback/sitePages'

interface PageProps {
  params: Promise<{ slug: string[] }>
}

function sanitizeLaitteetPageForProduction<T extends { sections: Array<{ type: string; settings: string | null }> }>(page: T): T {
  const allowedCategorySlugs = new Set([
    'docan-uv-tulostimet',
    'gcc-tarraleikkurit',
    'monitoimileikkurit',
    'laminaattorit',
  ])

  const blockedCategorySlugs = new Set([
    'display',
    'display-tuotteet',
    'roll-up',
    'messuseinat',
    'messupoydat',
    'tarvikkeet',
    'muut-tarvikkeet',
  ])

  const allowedTitleTokens = ['docan', 'gcc', 'monitoimi', 'laminaattor']

  const extractSlugFromHref = (href: string): string | null => {
    const cleaned = href.trim().toLowerCase()
    if (!cleaned.startsWith('/laitteet/')) return null
    return cleaned.replace('/laitteet/', '').split('?')[0].split('#')[0] || null
  }

  const sections = page.sections.map((section) => {
    if (section.type !== 'categories' || !section.settings) {
      return section
    }

    try {
      const parsed = JSON.parse(section.settings) as {
        items?: Array<{ title?: string; href?: string }>
        includeSlugs?: string[]
        excludeSlugs?: string[]
      }

      if (Array.isArray(parsed.items)) {
        parsed.items = parsed.items.filter((item) => {
          const title = (item.title || '').toLowerCase()
          const href = (item.href || '')
          const slugFromHref = href ? extractSlugFromHref(href) : null

          if (slugFromHref) {
            return allowedCategorySlugs.has(slugFromHref)
          }

          return allowedTitleTokens.some((token) => title.includes(token))
        })
      }

      const existingIncludeSlugs = Array.isArray(parsed.includeSlugs)
        ? parsed.includeSlugs.map((slug) => slug.toLowerCase())
        : []

      parsed.includeSlugs = existingIncludeSlugs.length > 0
        ? existingIncludeSlugs.filter((slug) => allowedCategorySlugs.has(slug))
        : Array.from(allowedCategorySlugs)

      if (Array.isArray(parsed.excludeSlugs)) {
        parsed.excludeSlugs = Array.from(new Set([
          ...parsed.excludeSlugs,
          ...Array.from(blockedCategorySlugs),
        ]))
      } else {
        parsed.excludeSlugs = Array.from(blockedCategorySlugs)
      }

      return {
        ...section,
        settings: JSON.stringify(parsed),
      }
    } catch {
      return section
    }
  })

  return {
    ...page,
    sections,
  }
}

function sanitizeHuoltoPage<T extends { sections: Array<{ type: string; settings: string | null }> }>(page: T): T {
  const hasInjectedList = page.sections.some((section) => {
    if (section.type !== 'custom_html' || !section.settings) {
      return false
    }

    return section.settings.includes('data-huolto-service-list="true"')
  })

  const sections = page.sections.flatMap((section: any) => {
    if (section.type !== 'hero' || !section.settings) {
      return [section]
    }

    try {
      const parsed = JSON.parse(section.settings) as {
        description?: string
        features?: string[]
        primaryCta?: { text?: string; href?: string }
      }

      parsed.description = 'Tarjoamme kattavat huolto- ja tuki palvelut lähes kaikille suurkuvatulostimille. Ammattitaitoiset teknikkomme palvelevat sinua nopeasti ja luotettavasti. Meillä on pitkä ja laaja kokemus suurkuvatulostimien huolloista. Huollon hinta 94 € / tunti.'
      parsed.features = ['Etätuki', 'Paikan päällä huolto', 'Varaosat']
      parsed.primaryCta = {
        ...(parsed.primaryCta || {}),
        href: '/yhteystiedot?aihe=huolto',
      }

      const updatedHeroSection = {
        ...section,
        settings: JSON.stringify(parsed),
      }

      if (hasInjectedList) {
        return [updatedHeroSection]
      }

      const injectedListSection = {
        id: 'huolto-service-list-injected',
        type: 'custom_html',
        title: 'Huoltopalvelut listaus',
        content: null,
        settings: JSON.stringify({
          html: '<section class="py-2"><div class="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl"><div class="max-w-3xl"><div data-huolto-service-list="true" class="bg-white border border-gray-200 rounded-xl p-6"><ul class="list-disc list-inside space-y-2 text-gray-700"><li>Etätuki</li><li>Paikan päällä huolto</li><li>Varaosat</li></ul><p class="mt-4 font-semibold text-gray-900">Huollon hinta 94 € / tunti</p></div></div></div></section>',
        }),
        sortOrder: typeof section.sortOrder === 'number' ? section.sortOrder + 1 : 1,
        isVisible: true,
      }

      return [updatedHeroSection, injectedListSection]
    } catch {
      return [section]
    }
  })

  return {
    ...page,
    sections,
  }
}

// Fetch page from database
async function getPage(slug: string) {
  try {
    const page = await prisma.page.findUnique({
      where: {
        slug,
        status: 'PUBLISHED',
      },
      include: {
        sections: {
          where: { isVisible: true },
          orderBy: { sortOrder: 'asc' },
        },
      },
    })

    return page
  } catch (error) {
    console.error(`Failed to fetch page for slug ${slug}:`, error)
    return null
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const slugString = slug.join('/')

  const resolvedPage = process.env.NODE_ENV === 'production' && slugString === 'yritys'
    ? getFallbackPageBySlug(slugString)
    : (await getPage(slugString)) || getFallbackPageBySlug(slugString)

  const page = process.env.NODE_ENV === 'production' && slugString === 'laitteet' && resolvedPage
    ? sanitizeLaitteetPageForProduction(resolvedPage)
    : resolvedPage

  const finalPage = slugString === 'huolto' && page
    ? sanitizeHuoltoPage(page)
    : page

  if (!finalPage) {
    return {
      title: 'Sivua ei löytynyt',
    }
  }

  return {
    title: finalPage.metaTitle || finalPage.title,
    description: finalPage.metaDesc || finalPage.description || undefined,
  }
}

// Dynamic page component
export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params
  const slugString = slug.join('/')

  const resolvedPage = process.env.NODE_ENV === 'production' && slugString === 'yritys'
    ? getFallbackPageBySlug(slugString)
    : (await getPage(slugString)) || getFallbackPageBySlug(slugString)

  const page = process.env.NODE_ENV === 'production' && slugString === 'laitteet' && resolvedPage
    ? sanitizeLaitteetPageForProduction(resolvedPage)
    : resolvedPage

  const finalPage = slugString === 'huolto' && page
    ? sanitizeHuoltoPage(page)
    : page

  if (!finalPage) {
    notFound()
  }

  return (
    <div className="pt-32">
      {finalPage.sections.map((section) => (
        <SectionRenderer key={section.id} section={section as PageSection} />
      ))}
    </div>
  )
}
