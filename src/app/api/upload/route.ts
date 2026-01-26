import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const folder = (formData.get('folder') as string) || 'uploads'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml',
      'application/pdf',
    ]

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'File type not allowed' },
        { status: 400 }
      )
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds 10MB limit' },
        { status: 400 }
      )
    }

    // Generate unique filename
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(2, 8)
    const ext = path.extname(file.name)
    const safeName = file.name
      .replace(/[^a-zA-Z0-9.-]/g, '-')
      .replace(/--+/g, '-')
      .toLowerCase()
    const filename = `${timestamp}-${randomStr}-${safeName}`

    // Create upload directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', folder)
    await mkdir(uploadDir, { recursive: true })

    // Save file
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const filePath = path.join(uploadDir, filename)
    await writeFile(filePath, buffer)

    // Get image dimensions if it's an image
    let width: number | null = null
    let height: number | null = null

    // Save to database
    const media = await prisma.media.create({
      data: {
        filename,
        originalName: file.name,
        url: `/uploads/${folder}/${filename}`,
        mimeType: file.type,
        fileSize: file.size,
        width,
        height,
        folder,
      },
    })

    return NextResponse.json({
      success: true,
      media,
      url: media.url,
    })
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const folder = searchParams.get('folder')
    const type = searchParams.get('type') // image, document

    const where: any = {}

    if (folder) {
      where.folder = folder
    }

    if (type === 'image') {
      where.mimeType = {
        startsWith: 'image/',
      }
    } else if (type === 'document') {
      where.mimeType = 'application/pdf'
    }

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
