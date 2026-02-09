import { Metadata } from 'next'
import Image from '@/components/ui/Image'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { FileDown, Phone, Mail } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Hinnasto | PrintMedia PM Solutions Oy',
  description:
    'Lataa PrintMedia PM Solutions Oy:n hinnasto. Tulostusvärit, tulostusmateriaalit, display-tuotteet ja laitteet.',
}

export default function HinnastoPage() {
  return (
    <div className="pt-32 pb-20">
      <Container>
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Hinnastot
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Lataa tuotehinnastomme alta. Hinnat ilman arvonlisäveroa (ALV 24%).
          </p>
        </div>

        {/* Main download card */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gray-100 p-8 flex justify-center">
              <Image
                src="/images/PrintMedia_-_Hinnasto_2023_kuva.png"
                alt="PrintMedia Hinnasto 2023"
                width={400}
                height={300}
                className="object-contain rounded-lg shadow-md"
              />
            </div>
            <div className="p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Hinnasto 2023
              </h2>
              <p className="text-gray-600 mb-6">
                Lataa täydellinen tuotehinnasto PDF-muodossa.
              </p>
              <a
                href="/files/PrintMedia_-_HINNASTO_2023_V2.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-primary-600 text-white px-8 py-4 rounded-lg font-medium hover:bg-primary-700 transition-colors"
              >
                <FileDown className="w-6 h-6" />
                Lataa hinnasto (PDF)
              </a>
            </div>
          </div>
        </div>

        {/* Info box */}
        <div className="bg-gray-50 rounded-2xl p-8 mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Huomioitavaa hinnoista
          </h2>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0" />
              Ilmoitamme hinnat ilman arvonlisäveroa 24%
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0" />
              Pidätämme oikeuden hintojen tarkistuksiin ilman ennakkoilmoitusta
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0" />
              Toimituskulut määräytyvät Matkahuollon ja Kaukokiidon voimassa olevien hinnastojen mukaan
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0" />
              Rullan kavennuksesta veloitamme 10€/rulla
            </li>
          </ul>
        </div>

        {/* Contact CTA */}
        <div className="bg-primary-600 text-white rounded-2xl p-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold mb-4">
                Tarvitsetko tarjouksen?
              </h2>
              <p className="text-primary-100 mb-6">
                Ota yhteyttä myyntiimme niin autamme löytämään sopivat tuotteet 
                ja teemme tarjouksen.
              </p>
              <Button href="/yhteystiedot" variant="secondary">
                Ota yhteyttä
              </Button>
            </div>
            <div className="space-y-4">
              <a
                href="tel:+358440875025"
                className="flex items-center gap-3 text-white hover:text-primary-200 transition-colors"
              >
                <Phone className="w-6 h-6" />
                <span className="text-lg">0440 875 025</span>
              </a>
              <a
                href="mailto:myynti@printmedia.fi"
                className="flex items-center gap-3 text-white hover:text-primary-200 transition-colors"
              >
                <Mail className="w-6 h-6" />
                <span className="text-lg">myynti@printmedia.fi</span>
              </a>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}

