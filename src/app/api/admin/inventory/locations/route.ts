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
    const code = String(body.code || '').trim().toUpperCase()
    const name = String(body.name || '').trim()
    const description = body.description ? String(body.description).trim() : null

    if (!code || !name) {
      return NextResponse.json({ error: 'Code and name are required' }, { status: 400 })
    }

    const existing = await prisma.inventoryLocation.findUnique({
      where: { code },
    })

    if (existing) {
      return NextResponse.json({ error: 'Location code already exists' }, { status: 400 })
    }

    const location = await prisma.inventoryLocation.create({
      data: {
        code,
        name,
        description,
      },
    })

    return NextResponse.json(location, { status: 201 })
  } catch (error) {
    console.error('Error creating inventory location:', error)
    return NextResponse.json(
      { error: 'Failed to create inventory location' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const locationId = searchParams.get('id')

    if (!locationId) {
      return NextResponse.json({ error: 'Location id is required' }, { status: 400 })
    }

    const location = await prisma.inventoryLocation.findUnique({
      where: { id: locationId },
      include: {
        _count: {
          select: { stocks: true },
        },
      },
    })

    if (!location) {
      return NextResponse.json({ error: 'Location not found' }, { status: 404 })
    }

    if (location._count.stocks > 0) {
      return NextResponse.json(
        { error: 'Varastopaikkaa ei voi poistaa, koska siihen on liitetty tuotteita' },
        { status: 400 }
      )
    }

    await prisma.inventoryLocation.delete({
      where: { id: locationId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting inventory location:', error)
    return NextResponse.json(
      { error: 'Failed to delete inventory location' },
      { status: 500 }
    )
  }
}
