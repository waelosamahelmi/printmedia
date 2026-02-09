import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { SectionRenderer } from '@/components/page/SectionRenderer'

interface PageProps {
  params: Promise<{ slug: string[] }>
}

// Fetch page from database
async function getPage(slug: string) {
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
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const slugString = slug.join('/')

  const page = await getPage(slugString)

  if (!page) {
    return {
      title: 'Sivua ei löytynyt',
    }
  }

  return {
    title: page.metaTitle || page.title,
    description: page.metaDesc || page.description || undefined,
  }
}

// Dynamic page component
export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params
  const slugString = slug.join('/')

  const page = await getPage(slugString)

  if (!page) {
    notFound()
  }

  return (
    <div className="pt-32">
      {page.sections.map((section) => (
        <SectionRenderer key={section.id} section={section} />
      ))}
    </div>
  )
}
