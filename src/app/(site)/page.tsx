import { Hero } from '@/components/sections/Hero'
import { CategoryGrid } from '@/components/sections/CategoryGrid'
import { FeaturesSection } from '@/components/sections/FeaturesSection'
import { ProductsShowcase } from '@/components/sections/ProductsShowcase'
import { CTA } from '@/components/sections/CTA'

// Categories data
const categories = [
  {
    title: 'Docan UV-tulostimet',
    description: 'Flatbed ja roll-to-roll UV-tulostimet monipuoliseen tulostukseen',
    image: '/images/devices/docan_h3000r_m10_574x.png',
    href: '/laitteet/docan-uv-tulostimet',
    count: 1,
  },
  {
    title: 'GCC Tarraleikkurit',
    description: 'RXII Professional ja Jaguar V tarkkuusleikkurit',
    image: '/images/devices/RXII_132_400.png',
    href: '/laitteet/gcc-tarraleikkurit',
    count: 2,
  },
  {
    title: 'Monitoimileikkurit',
    description: 'Jingwei CB03II ja CB08II flatbed-monitoimileikkurit',
    image: '/images/devices/cb03ii_500px_500x.jpg',
    href: '/laitteet/monitoimileikkurit',
    count: 2,
  },
  {
    title: 'Laminaattorit',
    description: 'Fayon FY1600 SE pneumaattinen kylmälaminaattori',
    image: '/images/devices/fayon-1600se.png',
    href: '/laitteet/laminaattorit',
    count: 1,
  },
  {
    title: 'Display-tuotteet',
    description: 'Roll-up telineet, messuseinät ja messupöydät',
    image: '/images/products/rollups/deluxe_1_uusi_kuva_laukku.jpg',
    href: '/display',
    count: 10,
  },
  {
    title: 'Tarvikkeet',
    description: 'JetBest musteet, tulostusmateriaalit ja lisätarvikkeet',
    image: '/images/logos/jetbest_sahkoposti.jpg',
    href: '/tarvikkeet',
    count: 50,
  },
]

// Featured products
const featuredProducts = [
  {
    id: '1',
    name: 'Docan H3000r M10',
    shortDesc: 'UV-tulostin 10-värisellä päällä',
    image: '/images/devices/docan_h3000r_m10_574x.png',
    href: '/laitteet/docan-uv-tulostimet',
    badge: 'Suosittu',
  },
  {
    id: '2',
    name: 'GCC RXII 132',
    shortDesc: 'Professional tarkkuusleikkuri 1320mm',
    image: '/images/devices/RXII_132_400.png',
    href: '/laitteet/gcc-tarraleikkurit',
  },
  {
    id: '3',
    name: 'Jingwei CB03II',
    shortDesc: 'Flatbed-monitoimileikkuri 3015 pöydällä',
    image: '/images/devices/cb03ii_500px_500x.jpg',
    href: '/laitteet/monitoimileikkurit',
    badge: 'Uutuus',
  },
  {
    id: '4',
    name: 'JetBest Eco-solvent musteet',
    shortDesc: 'Korkealaatuiset musteet Mimaki-tulostimille',
    image: '/images/logos/jetbest_sahkoposti.jpg',
    href: '/tarvikkeet/jetbest',
  },
]

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <Hero
        subtitle="PrintMedia PM Solutions Oy"
        title="Suurkuvatulostusalan tukkukauppa"
        description="Tarjoamme laajan valikoiman UV-tulostimia, leikkureita, laminaattoreita ja tarvikkeita ammattilaisille. Luotettavaa palvelua Sysmästä koko Suomeen."
        primaryCta={{ text: 'Tutustu laitteisiin', href: '/laitteet' }}
        secondaryCta={{ text: 'Ota yhteyttä', href: '/yhteystiedot' }}
        image="/images/devices/J5-132.jpg"
        features={[
          'Valtuutettu jälleenmyyjä',
          'Ammattitaitoinen huolto',
          'Nopea toimitus',
        ]}
      />

      {/* Features Section */}
      <FeaturesSection />

      {/* Categories Section */}
      <CategoryGrid
        title="Tuotekategoriat"
        subtitle="Löydä sopiva ratkaisu tarpeisiisi laajasta valikoimastamme"
        categories={categories}
      />

      {/* Featured Products */}
      <ProductsShowcase
        title="Suositut tuotteet"
        subtitle="Tutustu suosituimpiin tuotteisiimme"
        products={featuredProducts}
        viewAllHref="/laitteet"
      />

      {/* CTA Section */}
      <CTA
        title="Tarvitsetko apua valinnoissa?"
        description="Asiantuntijamme auttavat sinua löytämään juuri sinun tarpeisiisi sopivan ratkaisun. Ota yhteyttä ja kerro, mitä etsit."
        primaryCta={{ text: 'Pyydä tarjous', href: '/yhteystiedot' }}
        secondaryCta={{ text: 'Soita 0440 875 025', href: 'tel:+358440875025' }}
        variant="gradient"
      />
    </>
  )
}
