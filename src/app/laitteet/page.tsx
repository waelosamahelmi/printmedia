import { Metadata } from 'next'
import { Container } from '@/components/ui/Container'
import { CategoryGrid } from '@/components/sections/CategoryGrid'
import { CTA } from '@/components/sections/CTA'

export const metadata: Metadata = {
  title: 'Laitteet',
  description:
    'Tutustu PrintMedian laitevalikoimaan: Docan UV-tulostimet, GCC-tarraleikkurit, Jingwei-monitoimileikkurit ja Fayon-laminaattorit.',
}

const deviceCategories = [
  {
    title: 'Docan UV-tulostimet',
    description:
      'Docan H3000r M10 UV-tulostin monipuoliseen tulostukseen. Flatbed ja roll-to-roll mallit.',
    image: '/images/devices/docan_h3000r_m10_574x.png',
    href: '/laitteet/docan-uv-tulostimet',
    count: 1,
  },
  {
    title: 'GCC Tarraleikkurit',
    description:
      'GCC-tarraleikkurit: RXII Professional ja Jaguar V LX. Tarkka leikkaus 1,32m leveyteen asti.',
    image: '/images/devices/RXII_132_400.png',
    href: '/laitteet/gcc-tarraleikkurit',
    count: 2,
  },
  {
    title: 'Monitoimileikkurit',
    description:
      'Jingwei CB03II ja CB08II flatbed-monitoimileikkurit. Leikkaavat kartonkia, vinyyliä, pahvia ja paljon muuta.',
    image: '/images/devices/cb03ii_500px_500x.jpg',
    href: '/laitteet/monitoimileikkurit',
    count: 2,
  },
  {
    title: 'Laminaattorit',
    description:
      'Fayon FY1600 SE pneumaattinen kylmälaminaattori. 1600mm leveys, tuplavetorullat.',
    image: '/images/devices/fayon-1600se.png',
    href: '/laitteet/laminaattorit',
    count: 1,
  },
]

export default function LaitteetPage() {
  return (
    <div className="pt-32">
      {/* Hero */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-16">
        <Container>
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Laitteet
            </h1>
            <p className="text-xl text-gray-600">
              Tarjoamme laajan valikoiman ammattitason tulostus- ja
              leikkauslaitteita. Olemme Docanin, GCC:n, Jingwein ja Fayonin
              valtuutettu jälleenmyyjä Suomessa.
            </p>
          </div>
        </Container>
      </section>

      {/* Categories */}
      <CategoryGrid
        title="Laitekategoriat"
        subtitle="Valitse kategoria nähdäksesi kaikki tuotteet"
        categories={deviceCategories}
      />

      {/* CTA */}
      <CTA
        title="Etkö löytänyt etsimääsi?"
        description="Kerro meille tarpeistasi, niin autamme sinua löytämään sopivan ratkaisun. Teemme myös erikoistilauksena laitteita."
        primaryCta={{ text: 'Ota yhteyttä', href: '/yhteystiedot' }}
        secondaryCta={{ text: 'Soita meille', href: 'tel:+358440875025' }}
        variant="dark"
      />
    </div>
  )
}
