import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// GET - Fetch single product
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        category: true,
        images: { orderBy: { sortOrder: 'asc' } },
        documents: true,
        author: {
          select: { id: true, name: true, email: true }
        },
      },
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}

// PUT - Update product
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

    // Check if slug already exists on another product
    const existingSlug = await prisma.product.findFirst({
      where: { 
        slug: body.slug,
        NOT: { id: params.id }
      }
    })
    if (existingSlug) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 400 })
    }

    // Check if SKU already exists on another product
    if (body.sku) {
      const existingSku = await prisma.product.findFirst({
        where: { 
          sku: body.sku,
          NOT: { id: params.id }
        }
      })
      if (existingSku) {
        return NextResponse.json({ error: 'SKU already exists' }, { status: 400 })
      }
    }

    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        slug: body.slug,
        sku: body.sku || null,
        name: body.name,
        shortDesc: body.shortDesc,
        description: body.description,
        features: body.features ? JSON.stringify(body.features) : null,
        specs: body.specs ? JSON.stringify(body.specs) : null,
        price: body.price ? parseFloat(body.price) : null,
        priceType: body.priceType,
        status: body.status,
        isFeatured: body.isFeatured,
        sortOrder: body.sortOrder,
        categoryId: body.categoryId || null,
      },
      include: {
        category: true,
        images: true,
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

// DELETE - Delete product
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await prisma.product.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}
