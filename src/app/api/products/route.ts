import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const products = await prisma.product.findMany({
      where: { status: 'PUBLISHED' },
      include: {
        category: true,
        images: true,
        documents: true,
      },
      orderBy: { sortOrder: 'asc' },
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const product = await prisma.product.create({
      data: {
        slug: body.slug,
        sku: body.sku,
        name: body.name,
        shortDesc: body.shortDesc,
        description: body.description,
        features: body.features ? JSON.stringify(body.features) : null,
        specs: body.specs ? JSON.stringify(body.specs) : null,
        price: body.price,
        priceType: body.priceType,
        status: body.status || 'DRAFT',
        isFeatured: body.isFeatured || false,
        sortOrder: body.sortOrder || 0,
        categoryId: body.categoryId,
        authorId: body.authorId,
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
