import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
const items = await prisma.media.findMany({ select: { id: true, originalName: true, url: true } })
for (const m of items) console.log(m.id, '|', m.originalName, '|', m.url)
await prisma.$disconnect()
