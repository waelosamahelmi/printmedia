import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// GET - Fetch single navigation item
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const navigation = await prisma.navigation.findUnique({
      where: { id: params.id },
    })

    if (!navigation) {
      return NextResponse.json({ error: 'Navigation item not found' }, { status: 404 })
    }

    return NextResponse.json(navigation)
  } catch (error) {
    console.error('Error fetching navigation:', error)
    return NextResponse.json(
      { error: 'Failed to fetch navigation' },
      { status: 500 }
    )
  }
}

// PUT - Update navigation item
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

    const navigation = await prisma.navigation.update({
      where: { id: params.id },
      data: {
        location: body.location,
        label: body.label,
        url: body.url,
        target: body.target,
        icon: body.icon,
        parentId: body.parentId,
        sortOrder: body.sortOrder,
        isVisible: body.isVisible,
      },
    })

    return NextResponse.json(navigation)
  } catch (error) {
    console.error('Error updating navigation:', error)
    return NextResponse.json(
      { error: 'Failed to update navigation' },
      { status: 500 }
    )
  }
}

// DELETE - Delete navigation item
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await prisma.navigation.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting navigation:', error)
    return NextResponse.json(
      { error: 'Failed to delete navigation' },
      { status: 500 }
    )
  }
}
