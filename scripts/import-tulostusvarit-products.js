const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

const prisma = new PrismaClient()

const products = [
  {
    slug: 'jetbest-es3-varikasetti-440ml',
    name: 'Jetbest ES3 - värikasetti 440 ml',
    shortDesc: 'Alkuperäistä vastaava 440 ml värikasetti Roland-, Mutoh- ja Mimaki ES3 -laitteisiin.',
    keepImage: false,
  },
  {
    slug: 'jetbest-es3-tayttopullo-500ml',
    name: 'Jetbest ES3 - täyttöpullo 500 ml',
    shortDesc: '500 ml täyttöpullo Jetbest täyttöjärjestelmälle, eco-solvent-käyttöön.',
    keepImage: false,
  },
  {
    slug: 'jetbest-ss21-varikasetti-440ml',
    name: 'Jetbest SS21 - värikasetti 440 ml',
    shortDesc: 'Mimaki SS21 -yhteensopiva 440 ml värikasetti useisiin JV/CJV-sarjoihin.',
    imageUrl: '/images/products/inks/ss21-chat.png',
    keepImage: true,
  },
  {
    slug: 'jetbest-i2-varikasetti-440ml',
    name: 'Jetbest I-2 - värikasetti 440 ml',
    shortDesc: 'Roland Eco-sol MAX2 -yhteensopiva 440 ml värikasetti.',
    keepImage: false,
  },
  {
    slug: 'jetbest-cleaning-solvent-220ml',
    name: 'Jetbest Cleaning Solvent 220 ml',
    shortDesc: 'Puhdistusneste eco-solvent- ja mild-solvent-väreille.',
    keepImage: false,
  },
  {
    slug: 'jetbest-cleaning-solvent-440ml',
    name: 'Jetbest Cleaning Solvent 440 ml',
    shortDesc: 'Puhdistusneste 440 ml värikokoon, eco-solvent- ja mild-solvent-käyttöön.',
    keepImage: false,
  },
  {
    slug: 'cleaning-eco-solvent-1000ml',
    name: 'Cleaning Eco-Solvent 1000 ml pullo',
    shortDesc: '1 litran puhdistusaine eco-solvent-, mild-solvent- ja solvent-väreille.',
    keepImage: false,
  },
  {
    slug: 'jetbest-lus170-uv-1l',
    name: 'Jetbest LUS170 UV 1L pullo',
    shortDesc: 'UV-väri 1 litran täyttöpullossa, yhteensopiva mm. Mimaki UCJV -sarjan kanssa.',
    imageUrl: '/images/products/inks/lus170-uv-chat.png',
    keepImage: true,
  },
  {
    slug: 'jetbest-lus170-uv-cleaning-1l',
    name: 'Jetbest LUS170 UV Cleaning 1L pullo',
    shortDesc: 'Jetbest LUS170 UV -sarjan puhdistusaine 1 litran pullossa.',
    keepImage: false,
  },
  {
    slug: 'chromoink-uv-1000ml',
    name: 'Chromoink UV 1000 ml pullo',
    shortDesc: 'UV-väri 1 litran pullossa Konica Minolta -tulostuspäille.',
    imageUrl: '/images/products/inks/chromoink-chat-v3.png',
    keepImage: true,
  },
]

async function main() {
  const docxMediaDir = path.join(process.cwd(), 'tmp', 'docx', 'unzipped', 'word', 'media')
  const targetImageDir = path.join(process.cwd(), 'public', 'images', 'products', 'inks')
  fs.mkdirSync(targetImageDir, { recursive: true })

  const category = await prisma.category.findUnique({
    where: { slug: 'tulostusvarit' },
  })

  if (!category) {
    throw new Error('Category tulostusvarit not found')
  }

  for (let i = 0; i < products.length; i++) {
    const p = products[i]

    if (p.keepImage && p.imageSource && p.imageUrl) {
      const sourcePath = path.join(docxMediaDir, p.imageSource)
      const targetPath = path.join(process.cwd(), 'public', p.imageUrl.replace(/^\//, ''))
      if (fs.existsSync(sourcePath)) {
        fs.copyFileSync(sourcePath, targetPath)
      }
    }

    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        shortDesc: p.shortDesc,
        status: 'PUBLISHED',
        categoryId: category.id,
        price: null,
        priceType: 'quote',
        sortOrder: 500 + i,
      },
      create: {
        slug: p.slug,
        name: p.name,
        shortDesc: p.shortDesc,
        description: `<p>${p.shortDesc}</p>`,
        status: 'PUBLISHED',
        categoryId: category.id,
        priceType: 'quote',
        sortOrder: 500 + i,
      },
    })

    const existingImage = await prisma.productImage.findFirst({
      where: { productId: product.id },
      orderBy: { sortOrder: 'asc' },
    })

    if (p.keepImage && p.imageUrl) {
      if (!existingImage) {
        await prisma.productImage.create({
          data: {
            productId: product.id,
            url: p.imageUrl,
            alt: p.name,
            isPrimary: true,
            sortOrder: 0,
          },
        })
      } else {
        await prisma.productImage.update({
          where: { id: existingImage.id },
          data: {
            url: p.imageUrl,
            alt: p.name,
            isPrimary: true,
            sortOrder: 0,
          },
        })
      }
    } else {
      await prisma.productImage.deleteMany({
        where: { productId: product.id },
      })
    }

    console.log(`Upserted: ${p.name}`)
  }

  console.log(`Done. Imported ${products.length} tulostusvarit products.`)
}

main()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
