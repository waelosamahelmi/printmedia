import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// GET - Fetch all pages (for admin)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const pages = await prisma.page.findMany({
      include: {
        author: {
          select: { id: true, name: true, email: true }
        },
        sections: { orderBy: { sortOrder: 'asc' } },
      },
      orderBy: { updatedAt: 'desc' },
    })

    return NextResponse.json(pages)
  } catch (error) {
    console.error('Error fetching pages:', error)
    return NextResponse.json(
      { error: 'Failed to fetch pages' },
      { status: 500 }
    )
  }
}

// POST - Create new page
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    // Check if slug already exists
    const existing = await prisma.page.findUnique({
      where: { slug: body.slug }
    })
    if (existing) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 400 })
    }

    const page = await prisma.page.create({
      data: {
        slug: body.slug,
        title: body.title,
        description: body.description,
        content: body.content,
        metaTitle: body.metaTitle,
        metaDesc: body.metaDesc,
        featuredImg: body.featuredImg,
        template: body.template || 'default',
        status: body.status || 'DRAFT',
        sortOrder: body.sortOrder || 0,
        authorId: session.user?.id,
        publishedAt: body.status === 'PUBLISHED' ? new Date() : null,
      },
    })

    return NextResponse.json(page, { status: 201 })
  } catch (error) {
    console.error('Error creating page:', error)
    return NextResponse.json(
      { error: 'Failed to create page' },
      { status: 500 }
    )
  }
}
