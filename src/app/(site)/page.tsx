import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { SectionRenderer } from '@/components/page/SectionRenderer'
import { Metadata } from 'next'
import type { PageSection } from '@/lib/sections/types'
import { fallbackHomePage } from '@/lib/fallback/sitePages'

// Fetch homepage from database (empty slug)
async function getHomePage() {
  try {
    const page = await prisma.page.findFirst({
      where: {
        slug: {
          in: ['', 'etusivu'],
        },
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
    console.error('Failed to fetch homepage from database:', error)
    return null
  }
}

// Generate metadata for SEO
export async function generateMetadata(): Promise<Metadata> {
  const page = (await getHomePage()) || fallbackHomePage

  if (!page) {
    return {
      title: 'PrintMedia PM Solutions',
    }
  }

  return {
    title: page.metaTitle || page.title,
    description: page.metaDesc || page.description || undefined,
  }
}

// Homepage component - renders from database
export default async function HomePage() {
  const page = (await getHomePage()) || fallbackHomePage

  if (!page) {
    notFound()
  }

  return (
    <>
      {page.sections.map((section) => (
        <SectionRenderer key={section.id} section={section as PageSection} />
      ))}
    </>
  )
}
