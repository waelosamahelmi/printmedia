import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(
  _req: NextRequest,
  { params }: { params: { stockId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const stock = await prisma.inventoryStock.findUnique({
      where: { id: params.stockId },
      include: {
        product: {
          select: { id: true, name: true, sku: true },
        },
        location: true,
      },
    })

    if (!stock) {
      return NextResponse.json({ error: 'Varastoriviiä ei löydy' }, { status: 404 })
    }

    return NextResponse.json(stock)
  } catch (error) {
    console.error('Error fetching stock:', error)
    return NextResponse.json({ error: 'Virhe haettaessa varastotietoja' }, { status: 500 })
  }
}
