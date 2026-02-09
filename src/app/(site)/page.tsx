import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { SectionRenderer } from '@/components/page/SectionRenderer'
import { Metadata } from 'next'
import type { PageSection } from '@/lib/sections/types'

// Fetch homepage from database (empty slug)
async function getHomePage() {
  const page = await prisma.page.findUnique({
    where: {
      slug: '',
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
}

// Generate metadata for SEO
export async function generateMetadata(): Promise<Metadata> {
  const page = await getHomePage()

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
  const page = await getHomePage()

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
