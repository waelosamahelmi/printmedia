import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const stockId = body.stockId as string | undefined
    const change = Number(body.change) || 0
    const note = body.note ? String(body.note) : null

    if (!stockId || change === 0) {
      return NextResponse.json({ error: 'Invalid adjustment' }, { status: 400 })
    }

    const current = await prisma.inventoryStock.findUnique({
      where: { id: stockId },
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

    if (!current) {
      return NextResponse.json({ error: 'Stock not found' }, { status: 404 })
    }

    const nextQuantity = current.quantity + change
    if (nextQuantity < 0) {
      return NextResponse.json({ error: 'Stock cannot go below zero' }, { status: 400 })
    }

    const [stock] = await prisma.$transaction([
      prisma.inventoryStock.update({
        where: { id: stockId },
        data: { quantity: nextQuantity },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              sku: true,
              status: true,
              category: { select: { id: true, name: true } },
            },
          },
          location: true,
        },
      }),
      prisma.inventoryTransaction.create({
        data: {
          stockId,
          userId: null,
          type: change > 0 ? 'RECEIVE' : 'REMOVE',
          quantityChange: change,
          quantityAfter: nextQuantity,
          note: note || (change > 0 ? 'Saldoa lisätty administa' : 'Saldoa vähennetty administa'),
        },
      }),
    ])

    return NextResponse.json({
      ...stock,
      quantityAfter: nextQuantity,
    })
  } catch (error) {
    console.error('Error adjusting inventory stock:', error)
    return NextResponse.json(
      { error: 'Failed to adjust inventory stock' },
      { status: 500 }
    )
  }
}
