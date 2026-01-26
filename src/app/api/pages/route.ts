import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const pages = await prisma.page.findMany({
      where: { status: 'PUBLISHED' },
      include: {
        sections: { orderBy: { sortOrder: 'asc' } },
      },
      orderBy: { sortOrder: 'asc' },
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

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
        authorId: body.authorId,
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
