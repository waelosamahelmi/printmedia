import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// DELETE - Delete image
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; imageId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check image exists and belongs to this product
    const image = await prisma.productImage.findFirst({
      where: { 
        id: params.imageId,
        productId: params.id,
      },
    })

    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 })
    }

    // If deleting primary image, set next image as primary
    if (image.isPrimary) {
      const nextImage = await prisma.productImage.findFirst({
        where: { productId: params.id, NOT: { id: params.imageId } },
        orderBy: { sortOrder: 'asc' },
      })

      if (nextImage) {
        await prisma.productImage.update({
          where: { id: nextImage.id },
          data: { isPrimary: true },
        })
      }
    }

    // Delete image
    await prisma.productImage.delete({
      where: { id: params.imageId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting image:', error)
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    )
  }
}

// POST - Set image as primary
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string; imageId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const image = await prisma.productImage.findFirst({
      where: { 
        id: params.imageId,
        productId: params.id,
      },
    })

    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 })
    }

    // Remove primary from all other images
    await prisma.productImage.updateMany({
      where: { productId: params.id, NOT: { id: params.imageId } },
      data: { isPrimary: false },
    })

    // Set this image as primary
    const updated = await prisma.productImage.update({
      where: { id: params.imageId },
      data: { isPrimary: true },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error setting primary image:', error)
    return NextResponse.json(
      { error: 'Failed to set primary image' },
      { status: 500 }
    )
  }
}
