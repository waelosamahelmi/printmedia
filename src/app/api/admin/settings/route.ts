import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// GET - Fetch all settings or by group
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const group = searchParams.get('group')
    const key = searchParams.get('key')

    const where: any = {}
    if (group) where.group = group
    if (key) where.key = key

    const settings = await prisma.setting.findMany({
      where,
      orderBy: [{ group: 'asc' }, { key: 'asc' }],
    })

    // If single key requested, return just the value
    if (key && settings.length === 1) {
      const setting = settings[0]
      let value = setting.value
      if (setting.type === 'json') {
        try { value = JSON.parse(value) } catch {}
      } else if (setting.type === 'number') {
        value = parseFloat(value) as any
      } else if (setting.type === 'boolean') {
        value = (value === 'true') as any
      }
      return NextResponse.json({ key: setting.key, value, type: setting.type })
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    )
  }
}

// POST - Create or update setting
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    let value = body.value
    if (body.type === 'json' && typeof value === 'object') {
      value = JSON.stringify(value)
    } else if (typeof value !== 'string') {
      value = String(value)
    }

    const setting = await prisma.setting.upsert({
      where: { key: body.key },
      update: {
        value,
        type: body.type || 'string',
        group: body.group || 'general',
      },
      create: {
        key: body.key,
        value,
        type: body.type || 'string',
        group: body.group || 'general',
      },
    })

    return NextResponse.json(setting)
  } catch (error) {
    console.error('Error saving setting:', error)
    return NextResponse.json(
      { error: 'Failed to save setting' },
      { status: 500 }
    )
  }
}

// PUT - Bulk update settings
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { settings } = body // Array of { key, value, type?, group? }

    await Promise.all(
      settings.map((s: any) => {
        let value = s.value
        if (s.type === 'json' && typeof value === 'object') {
          value = JSON.stringify(value)
        } else if (typeof value !== 'string') {
          value = String(value)
        }

        return prisma.setting.upsert({
          where: { key: s.key },
          update: {
            value,
            type: s.type || 'string',
            group: s.group || 'general',
          },
          create: {
            key: s.key,
            value,
            type: s.type || 'string',
            group: s.group || 'general',
          },
        })
      })
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    )
  }
}
