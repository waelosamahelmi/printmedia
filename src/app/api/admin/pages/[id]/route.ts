import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// GET - Fetch single page
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const page = await prisma.page.findUnique({
      where: { id: params.id },
      include: {
        author: {
          select: { id: true, name: true, email: true }
        },
        sections: { orderBy: { sortOrder: 'asc' } },
      },
    })

    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 })
    }

    return NextResponse.json(page)
  } catch (error) {
    console.error('Error fetching page:', error)
    return NextResponse.json(
      { error: 'Failed to fetch page' },
      { status: 500 }
    )
  }
}

// PUT - Update page
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    // Check if slug already exists on another page
    const existing = await prisma.page.findFirst({
      where: {
        slug: body.slug,
        NOT: { id: params.id }
      }
    })
    if (existing) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 400 })
    }

    // Get current page to check status change
    const currentPage = await prisma.page.findUnique({
      where: { id: params.id }
    })

    // Use transaction to update page and sections atomically
    const result = await prisma.$transaction(async (tx) => {
      // Update page
      const page = await tx.page.update({
        where: { id: params.id },
        data: {
          slug: body.slug,
          title: body.title,
          description: body.description,
          content: body.content,
          metaTitle: body.metaTitle,
          metaDesc: body.metaDesc,
          featuredImg: body.featuredImg,
          template: body.template,
          status: body.status,
          sortOrder: body.sortOrder,
          publishedAt: body.status === 'PUBLISHED' && currentPage?.status !== 'PUBLISHED'
            ? new Date()
            : currentPage?.publishedAt,
        },
      })

      // Handle sections if provided
      if (body.sections && Array.isArray(body.sections)) {
        const sectionIds = body.sections
          .map((s: any) => s.id)
          .filter((id: string) => id && !id.startsWith('temp-'))

        // Delete sections that are not in the new list
        await tx.section.deleteMany({
          where: {
            pageId: params.id,
            id: { notIn: sectionIds.length > 0 ? sectionIds : [''] }
          }
        })

        // Upsert each section
        for (const section of body.sections) {
          const isNew = !section.id || section.id.startsWith('temp-')

          if (isNew) {
            // Create new section
            await tx.section.create({
              data: {
                pageId: params.id,
                type: section.type,
                title: section.title || null,
                content: section.content || null,
                settings: section.settings || null,
                sortOrder: section.sortOrder || 0,
                isVisible: section.isVisible !== undefined ? section.isVisible : true,
              }
            })
          } else {
            // Update existing section
            await tx.section.update({
              where: { id: section.id },
              data: {
                type: section.type,
                title: section.title || null,
                content: section.content || null,
                settings: section.settings || null,
                sortOrder: section.sortOrder || 0,
                isVisible: section.isVisible !== undefined ? section.isVisible : true,
              }
            })
          }
        }
      }

      // Fetch updated page with sections
      return await tx.page.findUnique({
        where: { id: params.id },
        include: {
          sections: {
            orderBy: { sortOrder: 'asc' }
          }
        }
      })
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error updating page:', error)
    return NextResponse.json(
      { error: 'Failed to update page' },
      { status: 500 }
    )
  }
}

// DELETE - Delete page
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await prisma.page.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting page:', error)
    return NextResponse.json(
      { error: 'Failed to delete page' },
      { status: 500 }
    )
  }
}
