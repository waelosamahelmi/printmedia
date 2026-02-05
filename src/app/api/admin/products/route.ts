import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// GET - Fetch all products (for admin)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get('categoryId')
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    const where: any = {}
    if (categoryId) where.categoryId = categoryId
    if (status) where.status = status
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { sku: { contains: search } },
        { description: { contains: search } },
      ]
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
        images: { orderBy: { sortOrder: 'asc' } },
        documents: true,
        author: {
          select: { id: true, name: true, email: true }
        },
      },
      orderBy: { updatedAt: 'desc' },
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

// POST - Create new product
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    // Check if slug already exists
    const existingSlug = await prisma.product.findUnique({
      where: { slug: body.slug }
    })
    if (existingSlug) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 400 })
    }

    // Check if SKU already exists
    if (body.sku) {
      const existingSku = await prisma.product.findUnique({
        where: { sku: body.sku }
      })
      if (existingSku) {
        return NextResponse.json({ error: 'SKU already exists' }, { status: 400 })
      }
    }

    const product = await prisma.product.create({
      data: {
        slug: body.slug,
        sku: body.sku || null,
        name: body.name,
        shortDesc: body.shortDesc,
        description: body.description,
        features: body.features ? JSON.stringify(body.features) : null,
        specs: body.specs ? JSON.stringify(body.specs) : null,
        price: body.price ? parseFloat(body.price) : null,
        priceType: body.priceType || 'quote',
        status: body.status || 'DRAFT',
        isFeatured: body.isFeatured || false,
        sortOrder: body.sortOrder || 0,
        categoryId: body.categoryId || null,
        authorId: session.user?.id,
      },
      include: {
        category: true,
        images: true,
      },
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}
