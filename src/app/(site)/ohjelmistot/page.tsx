import { Metadata } from 'next'
import Link from 'next/link'
import Image from '@/components/ui/Image'
import { Container } from '@/components/ui/Container'
import { CTA } from '@/components/sections/CTA'
import { ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Ohjelmistot | PrintMedia PM Solutions Oy',
  description:
    'RIP- ja suunnitteluohjelmistot suurkuvatulostukseen. Ergosoft RIP 16 ja SAi Flexi – ohjelmistoratkaisut ammattikäyttöön.',
}

const softwareItems = [
  {
    title: 'Ergosoft RIP 16',
    description:
      'Sveitsiläinen RIP-ohjelmisto suurkuvatulostimille. Ohjaa useampaa tulostinta samanaikaisesti ja automatisoi tuotantosi tehokkaasti.',
    image: '/images/logos/ergosoft-logo.jpg',
    href: '/ohjelmistot/ergosoft-rip',
  },
  {
    title: 'SAi Flexi',
    description:
      'SAi Flexi ja Enroute ohjelmistot kuukausittaisena tilauspalveluna. Ei kallista kertainvestointia – laadukas ratkaisu joustavasti.',
    image: '/images/logos/sai-flexi-logo.png',
    href: '/ohjelmistot/flexi',
  },
]

export default function OhjelmistotPage() {
  return (
    <div className="pt-32">
      {/* Hero */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-16">
        <Container>
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Ohjelmistot
            </h1>
            <p className="text-xl text-gray-600">
              Tarjoamme ammattitason RIP- ja suunnitteluohjelmistoja
              suurkuvatulostukseen. Olemme Ergosoft AG:n virallinen jälleenmyyjä
              Suomessa vuodesta 2009 sekä SAi Flexi -ohjelmistojen toimittaja.
            </p>
          </div>
        </Container>
      </section>

      {/* Software cards */}
      <section className="section bg-gray-50">
        <Container>
          <div className="section-header">
            <h2 className="section-title">Ohjelmistot</h2>
            <p className="section-subtitle">Valitse ohjelmisto nähdäksesi lisätietoja</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6 lg:gap-8 max-w-3xl mx-auto">
            {softwareItems.map((item) => (
              <Link key={item.title} href={item.href} className="group block">
                <div className="card-hover h-full">
                  {/* Logo area */}
                  <div className={`relative h-48 bg-white flex items-center justify-center overflow-hidden ${item.href === '/ohjelmistot/ergosoft-rip' ? 'p-4' : 'p-8'}`}>
                    <div className="relative w-full h-full">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-contain"
                        sizes="(max-width: 640px) 100vw, 50vw"
                      />
                    </div>
                  </div>
                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{item.description}</p>
                    <div className="flex items-center text-primary-600 font-semibold text-sm">
                      Lue lisää
                      <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <CTA
        title="Kysy lisää ohjelmistoista"
        description="Autamme sinua valitsemaan juuri sinun tarpeisiisi sopivan ohjelmistoratkaisun. Ota yhteyttä ja kerro tarpeistasi."
        primaryCta={{ text: 'Ota yhteyttä', href: '/yhteystiedot' }}
        secondaryCta={{ text: 'Soita meille', href: 'tel:+358440875025' }}
        variant="dark"
      />
    </div>
  )
}
