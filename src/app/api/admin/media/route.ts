import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// GET - Fetch all media
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const folder = searchParams.get('folder')
    const mimeType = searchParams.get('mimeType')

    const where: any = {}
    if (folder) where.folder = folder
    if (mimeType) where.mimeType = { startsWith: mimeType }

    const media = await prisma.media.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(media)
  } catch (error) {
    console.error('Error fetching media:', error)
    return NextResponse.json(
      { error: 'Failed to fetch media' },
      { status: 500 }
    )
  }
}

// POST - Upload media (metadata only, file upload handled separately)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    const media = await prisma.media.create({
      data: {
        filename: body.filename,
        originalName: body.originalName,
        url: body.url,
        mimeType: body.mimeType,
        fileSize: body.fileSize,
        width: body.width,
        height: body.height,
        alt: body.alt,
        caption: body.caption,
        folder: body.folder || 'uploads',
      },
    })

    return NextResponse.json(media, { status: 201 })
  } catch (error) {
    console.error('Error creating media:', error)
    return NextResponse.json(
      { error: 'Failed to create media' },
      { status: 500 }
    )
  }
}
