import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// GET - Fetch all navigation items
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const location = searchParams.get('location')

    const where: any = {}
    if (location) where.location = location

    const navigation = await prisma.navigation.findMany({
      where,
      orderBy: [{ location: 'asc' }, { sortOrder: 'asc' }],
    })

    return NextResponse.json(navigation)
  } catch (error) {
    console.error('Error fetching navigation:', error)
    return NextResponse.json(
      { error: 'Failed to fetch navigation' },
      { status: 500 }
    )
  }
}

// POST - Create navigation item
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    const navigation = await prisma.navigation.create({
      data: {
        location: body.location,
        label: body.label,
        url: body.url,
        target: body.target || '_self',
        icon: body.icon,
        parentId: body.parentId,
        sortOrder: body.sortOrder || 0,
        isVisible: body.isVisible ?? true,
      },
    })

    return NextResponse.json(navigation, { status: 201 })
  } catch (error) {
    console.error('Error creating navigation:', error)
    return NextResponse.json(
      { error: 'Failed to create navigation' },
      { status: 500 }
    )
  }
}

// PUT - Bulk update navigation order
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { items } = body // Array of { id, sortOrder }

    await Promise.all(
      items.map((item: { id: string; sortOrder: number }) =>
        prisma.navigation.update({
          where: { id: item.id },
          data: { sortOrder: item.sortOrder },
        })
      )
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating navigation order:', error)
    return NextResponse.json(
      { error: 'Failed to update navigation order' },
      { status: 500 }
    )
  }
}
