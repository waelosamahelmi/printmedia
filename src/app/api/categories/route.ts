import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET - Fetch categories (public)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const parentOnly = searchParams.get('parentOnly')

    const where: any = { isVisible: true }
    
    if (parentOnly === 'true') {
      where.parentId = null
    }

    const categories = await prisma.category.findMany({
      where,
      include: {
        _count: { select: { products: true } },
        children: {
          where: { isVisible: true },
          orderBy: { sortOrder: 'asc' }
        }
      },
      orderBy: { sortOrder: 'asc' }
    })

    return NextResponse.json(categories)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}
