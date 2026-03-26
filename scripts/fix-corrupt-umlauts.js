const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const directReplacements = [
  ['K??ntyv?', 'Kääntyvä'],
  ['k??ntyv?', 'kääntyvä'],
  ['kiilt?v?', 'kiiltävä'],
  ['k?sittely?', 'käsittelyä'],
  ['ehk?isee', 'ehkäisee'],
  ['Neli?hinta', 'Neliöhinta'],
  ['pitk?', 'pitkä'],
  ['leve?', 'leveä'],
  ['k?rki', 'kärki'],
  ['s?teilylle', 'säteilylle'],
]

function normalizeBrokenText(value) {
  if (!value) return value

  let text = value
  for (const [from, to] of directReplacements) {
    text = text.split(from).join(to)
  }

  // Fix euro/question-mark characters that ended up inside words.
  text = text.replace(/([A-Za-zÅÄÖåäö])€([A-Za-zÅÄÖåäö])/g, '$1ä$2')
  text = text.replace(/([A-Za-zÅÄÖåäö])\?([A-Za-zÅÄÖåäö])/g, '$1ä$2')

  return text
}

async function main() {
  const products = await prisma.product.findMany({
    select: { id: true, sku: true, name: true, shortDesc: true, description: true },
  })

  let updated = 0

  for (const product of products) {
    const name = normalizeBrokenText(product.name)
    const shortDesc = normalizeBrokenText(product.shortDesc)
    const description = normalizeBrokenText(product.description)

    if (name === product.name && shortDesc === product.shortDesc && description === product.description) {
      continue
    }

    await prisma.product.update({
      where: { id: product.id },
      data: { name, shortDesc, description },
    })

    updated += 1
  }

  console.log(`Updated products: ${updated}`)
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
