import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET - Fetch all settings (public)
export async function GET(request: NextRequest) {
  try {
    const settings = await prisma.setting.findMany()
    
    // Convert to key-value object
    const settingsObject: Record<string, string> = {}
    settings.forEach(s => {
      settingsObject[s.key] = s.value
    })

    return NextResponse.json(settingsObject)
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}
