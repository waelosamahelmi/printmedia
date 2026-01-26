import { Metadata } from 'next'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { ArrowLeft, Check, Zap } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Ergosoft RIP 16 | PrintMedia PM Solutions Oy',
  description:
    'Ergosoft RIP ohjelmisto suurkuvatulostimille. Virallinen jälleenmyyjä vuodesta 2009.',
}

const features = [
  'Ohjaa useampaa rullatulostinta samanaikaisesti',
  'UV-tasotulostimet, tarraleikkurit ja tasoleikkurit',
  'Helppokäyttöinen tulostaja-ystävällinen käyttöliittymä',
  'Taustatulostustoiminto nopeuttaa tulostuksen alkamista',
  'Automatisointi tehostaa tuotantoasi',
  'Automaattiset purjerengas- ja leikkuumerkit',
  'Värinkorjaus ja spottivärin korjaus',
  'Värinhallinta, panelointi, marginaalit',
  'Automaattinen asettelu ja skaalaaminen',
]

export default function ErgosoftRipPage() {
  return (
    <div className="pt-32 pb-20">
      <Container>
        {/* Breadcrumb */}
        <nav className="mb-8">
          <Link
            href="/huolto"
            className="inline-flex items-center text-primary-600 hover:text-primary-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Takaisin huoltopalveluihin
          </Link>
        </nav>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Ergosoft RIP 16
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Vuodesta 2009 alkaen olemme toimineet Sveitsiläisen Ergosoft AG:n 
            RIP ohjelmistojen virallisena jälleenmyyjänä.
          </p>
        </div>

        {/* Main content */}
        <div className="grid lg:grid-cols-2 gap-12 mb-12">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Ominaisuudet
            </h2>
            <ul className="space-y-3">
              {features.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-primary-50 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Automatisointi on avain
            </h2>
            <p className="text-gray-700 mb-6">
              Ohjelmiston kantava teema on automatisointi. Pystyt automatisoimaan lähes 
              kaiken, joka helpottaa ja myös tehostaa tuotantoasi.
            </p>
            <p className="text-gray-700">
              Ohjelmisto generoi tulostettavaan kuvaan automaattisesti juuri sellaiset 
              merkit, värinkorjaukset ja asettelut kuin itse haluat.
            </p>
          </div>
        </div>

        {/* Example section */}
        <div className="bg-gray-900 text-white rounded-2xl p-8 mb-12">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 bg-primary-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <Zap className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4">
                Esimerkki tuottavuudesta
              </h2>
              <p className="text-gray-300 mb-4">
                Asiakas lähettää Teille 50 erilaista kuvaa tulostettavaksi. Aineiston 
                saapumisen jälkeen halutaan lisätä jokaiseen kuvaan yrityksenne logo 
                ja purjerenkaille omat merkkinsä.
              </p>
              <p className="text-gray-300 mb-4">
                <strong className="text-white">Perinteisesti:</strong> Vie aikaa tuoda 
                kaikki kuvat kuvankäsittelyohjelmistoon ja lisätä nämä asiat erikseen.
              </p>
              <p className="text-gray-300">
                <strong className="text-white">Ergosoftilla:</strong> Automatisoinnin 
                tekeminen vie muutaman minuutin ja voit aloittaa tulostuksen hetkessä. 
                Alkuperäiseen kuvaan ei tarvitse koskea eikä väriprofiilien katoamiseen 
                tule virheiden mahdollisuutta.
              </p>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="bg-primary-600 text-white rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">
            Kysy lisää Ergosoft RIP -ohjelmistosta
          </h2>
          <p className="text-primary-100 mb-6">
            Autamme sinua löytämään juuri sinun tarpeisiisi sopivan ratkaisun.
          </p>
          <Button href="/yhteystiedot" variant="secondary">
            Ota yhteyttä myyntiin
          </Button>
        </div>
      </Container>
    </div>
  )
}
