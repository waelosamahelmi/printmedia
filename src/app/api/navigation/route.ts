import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET - Fetch navigation by location (public)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const location = searchParams.get('location')

    const where = location 
      ? { location, isVisible: true }
      : { isVisible: true }

    const navigation = await prisma.navigation.findMany({
      where,
      orderBy: [
        { location: 'asc' },
        { sortOrder: 'asc' }
      ]
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
