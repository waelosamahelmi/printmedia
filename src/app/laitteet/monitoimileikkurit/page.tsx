import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { Phone, Mail, ArrowLeft, ExternalLink, FileDown } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Jingwei Monitoimileikkurit | PrintMedia PM Solutions Oy',
  description:
    'Jingwei CB03II ja CB08II monitoimileikkurit. Laadukkaat tasoleikkurit pahveille, papereille, kankaille ja monille muille materiaaleille.',
}

const sizes = {
  CB03II: [
    '1100mm x 1300mm',
    '1800mm x 1600mm',
    '2500mm x 1300mm',
    '2500mm x 1600mm',
  ],
  CB08II: [
    '2500mm x 2000mm',
    '3000mm x 3200mm',
    '3500mm x 2000mm',
  ],
}

export default function MonitoimileikkuritPage() {
  return (
    <div className="pt-32 pb-20">
      <Container>
        {/* Breadcrumb */}
        <nav className="mb-8">
          <Link
            href="/laitteet"
            className="inline-flex items-center text-primary-600 hover:text-primary-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Takaisin laitteisiin
          </Link>
        </nav>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Jingwei tasoleikkurit
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            CB03II ja CB08II leikkureihin on saatavilla useita työkaluja ja teriä 
            erilaisia materiaaleja ja käyttötarkoituksia varten.
          </p>
        </div>

        {/* Main content */}
        <div className="grid lg:grid-cols-2 gap-12 mb-12">
          <div className="bg-gray-100 rounded-2xl p-8 flex justify-center">
            <Image
              src="/images/devices/cb03ii_500px_500x.jpg"
              alt="Jingwei CB03II"
              width={500}
              height={500}
              className="object-contain"
            />
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Soveltuvat materiaalit
            </h2>
            <div className="grid grid-cols-2 gap-4 mb-8">
              {['Pahvit', 'Paperit', 'Kankaat', 'Levyt', 'Kennot', 'Kalvot', 'Vaahtomuovit', 'Ja monet muut'].map((material) => (
                <div
                  key={material}
                  className="bg-white rounded-lg p-4 shadow-sm border border-gray-100"
                >
                  {material}
                </div>
              ))}
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-4">CB03II - Pöytäkoot</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1 mb-6">
              {sizes.CB03II.map((size) => (
                <li key={size}>{size}</li>
              ))}
            </ul>

            <h3 className="text-xl font-bold text-gray-900 mb-4">CB08II - Pöytäkoot</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              {sizes.CB08II.map((size) => (
                <li key={size}>{size}</li>
              ))}
            </ul>
            
            <p className="text-sm text-gray-500 mt-4">
              * Mitat ovat materiaalin maksimi työstökokoja.
            </p>
          </div>
        </div>

        {/* Tools image */}
        <div className="bg-gray-50 rounded-2xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Työkaluvaihtoehtoja
          </h2>
          <div className="flex justify-center">
            <Image
              src="/images/devices/tools_600px_600x.png"
              alt="Työkaluvaihtoehtoja"
              width={600}
              height={400}
              className="object-contain"
            />
          </div>
        </div>

        {/* Value proposition */}
        <div className="bg-primary-50 rounded-2xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Hinta-laatusuhteensa parhaimmistoa
          </h2>
          <p className="text-gray-700 mb-6">
            Jos olet etsinyt laadukasta tasoleikkuria ja hintataso on ollut liian korkea, 
            niin tässä sinulle hyvä vaihtoehto ominaisuuksista tinkimättä.
          </p>
          <p className="text-gray-700">
            Lue esitteet ja kysy lisää leikkurien antamista mahdollisuuksista!
          </p>
        </div>

        {/* Links */}
        <div className="bg-gray-50 rounded-xl p-6 mb-12">
          <h3 className="font-semibold text-lg mb-4">Esitteet ja videot</h3>
          <div className="flex flex-wrap gap-6">
            <a
              href="/files/CB03II-esite.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-primary-600 hover:text-primary-700"
            >
              <FileDown className="w-4 h-4 mr-2" />
              CB03II esite (PDF)
            </a>
            <a
              href="/files/CB08II-esite.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-primary-600 hover:text-primary-700"
            >
              <FileDown className="w-4 h-4 mr-2" />
              CB08II esite (PDF)
            </a>
            <a
              href="https://www.youtube.com/watch?v=_D_i_03xInU"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-primary-600 hover:text-primary-700"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Katso esittelyvideo YouTubesta
            </a>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="bg-gray-900 text-white rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4">Lisätietoja</h2>
          <p className="text-gray-300 mb-6">
            <strong className="text-white">Toimitusjohtaja Harri Hynynen</strong>
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="tel:+358440875020"
              className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300"
            >
              <Phone className="w-5 h-5" />
              0440 875 020
            </a>
            <a
              href="mailto:harri.hynynen@printmedia.fi"
              className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300"
            >
              <Mail className="w-5 h-5" />
              harri.hynynen@printmedia.fi
            </a>
          </div>
          <div className="mt-6">
            <Button href="/yhteystiedot" variant="secondary">
              Ota yhteyttä
            </Button>
          </div>
        </div>
      </Container>
    </div>
  )
}
