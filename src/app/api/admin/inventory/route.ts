import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const [stocks, locations, products, recentTransactions] = await Promise.all([
      prisma.inventoryStock.findMany({
        include: {
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
              sku: true,
              status: true,
              category: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          location: true,
        },
        orderBy: [
          { updatedAt: 'desc' },
          { product: { name: 'asc' } },
        ],
      }),
      prisma.inventoryLocation.findMany({
        where: { isActive: true },
        orderBy: [{ code: 'asc' }],
      }),
      prisma.product.findMany({
        select: {
          id: true,
          name: true,
          sku: true,
          status: true,
          inventory: { select: { id: true } },
        },
        orderBy: { name: 'asc' },
      }),
      prisma.inventoryTransaction.findMany({
        take: 20,
        orderBy: { createdAt: 'desc' },
        include: {
          stock: {
            include: {
              product: {
                select: { id: true, name: true, sku: true },
              },
              location: {
                select: { id: true, code: true, name: true },
              },
            },
          },
          user: {
            select: { id: true, name: true, email: true },
          },
        },
      }),
    ])

    return NextResponse.json({
      stocks,
      locations,
      products,
      recentTransactions,
    })
  } catch (error) {
    console.error('Error fetching inventory:', error)
    return NextResponse.json(
      { error: 'Failed to fetch inventory' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const quantity = Math.max(0, Number(body.quantity) || 0)
    const minQuantity = Math.max(0, Number(body.minQuantity) || 0)
    const productId = body.productId as string | undefined
    const locationId = body.locationId ? String(body.locationId) : null
    const notes = body.notes ? String(body.notes) : null

    if (!productId) {
      return NextResponse.json({ error: 'Product is required' }, { status: 400 })
    }

    const existing = await prisma.inventoryStock.findUnique({
      where: { productId },
    })

    let stock
    let quantityChange = quantity

    if (existing) {
      quantityChange = quantity - existing.quantity
      stock = await prisma.inventoryStock.update({
        where: { productId },
        data: {
          locationId,
          quantity,
          minQuantity,
          notes,
        },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              sku: true,
              status: true,
              category: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          location: true,
        },
      })
    } else {
      stock = await prisma.inventoryStock.create({
        data: {
          productId,
          locationId,
          quantity,
          minQuantity,
          notes,
        },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              sku: true,
              status: true,
              category: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          location: true,
        },
      })
    }

    await prisma.inventoryTransaction.create({
      data: {
        stockId: stock.id,
        userId: null,
        type: 'ADJUSTMENT',
        quantityChange,
        quantityAfter: quantity,
        note: existing ? (notes || 'Varastosaldo päivitetty administa') : (notes || 'Varastotuote luotu'),
      },
    })

    return NextResponse.json(stock)
  } catch (error) {
    console.error('Error saving inventory stock:', error)
    return NextResponse.json(
      { error: 'Failed to save inventory stock' },
      { status: 500 }
    )
  }
}
