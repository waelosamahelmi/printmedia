import { Metadata } from 'next'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { Phone, Mail } from 'lucide-react'
import HinnastoContent from './HinnastoContent'

export const metadata: Metadata = {
  title: 'Hinnasto | PrintMedia PM Solutions Oy',
  description: 'PrintMedia PM Solutions Oy:n tuotteiden hinnat. Tulostusvärit, tulostusmateriaalit, display-tuotteet ja laitteet. Hinnat ilman ALV.',
}

export default function HinnastoPage() {
  return (
    <div className="pt-32 pb-20">
      <Container>
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Hinnasto</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Kaikki hinnat ilman arvonlisäveroa (ALV 24%). Voit hakea tuotetta nimellä tai tuotenumerolla.
          </p>
        </div>

        {/* Interactive search + product list */}
        <HinnastoContent />

        {/* Notes box */}
        <div className="bg-gray-50 rounded-2xl p-8 mt-10 mb-10">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Huomioitavaa hinnoista</h2>
          <ul className="space-y-3 text-gray-600 text-sm">
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-primary-500 rounded-full mt-1.5 shrink-0" />
              Ilmoitamme hinnat ilman arvonlisäveroa 24%
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-primary-500 rounded-full mt-1.5 shrink-0" />
              Pidätämme oikeuden hintojen tarkistuksiin ilman ennakkoilmoitusta
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-primary-500 rounded-full mt-1.5 shrink-0" />
              Toimituskulut määräytyvät Matkahuollon ja Kaukokiidon voimassa olevien hinnastojen mukaan
            </li>
            <li className="flex items-start gap-3">
              <span className="w-2 h-2 bg-primary-500 rounded-full mt-1.5 shrink-0" />
              Rullan kavennuksesta veloitamme 10€/rulla
            </li>
          </ul>
        </div>

        {/* Contact CTA */}
        <div className="bg-primary-600 text-white rounded-2xl p-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold mb-4">Tarvitsetko tarjouksen?</h2>
              <p className="text-primary-100 mb-6">
                Ota yhteyttä myyntiimme niin autamme löytämään sopivat tuotteet ja teemme tarjouksen.
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
                <Phone className="w-5 h-5" />
                <span>0440 875 025</span>
              </a>
              <a
                href="mailto:myynti@printmedia.fi"
                className="flex items-center gap-3 text-white hover:text-primary-200 transition-colors"
              >
                <Mail className="w-5 h-5" />
                <span>myynti@printmedia.fi</span>
              </a>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}
