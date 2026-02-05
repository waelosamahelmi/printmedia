import { Metadata } from 'next'
import Image from '@/components/ui/Image'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { ArrowLeft, Check } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Fayon Laminaattorit | PrintMedia PM Solutions Oy',
  description:
    'Fayon laminaattorit pieneen ja keskikokoiseen tuotantoon. Rulla- ja tasolaminaattorit.',
}

const features = [
  'Lämmitettävä ylärulla (125°C asti)',
  'Pneumaattinen ylärullan nostin',
  'Maksimi laminointipaksuus: 35mm',
  'Maksimi laminointinopeus: 25m/min',
  'Maksimi laminointileveys: 162cm',
]

export default function LaminaattoritPage() {
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
        <div className="flex flex-col md:flex-row items-start gap-8 mb-12">
          <div className="w-48 h-24 relative flex-shrink-0 bg-white rounded-lg p-4">
            <Image
              src="/images/logos/fayon-logo.png"
              alt="Fayon"
              fill
              className="object-contain"
            />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Fayon laminaattorit
            </h1>
            <p className="text-xl text-gray-600">
              Monipuolisia kylmä- ja lämpölaminaattoreita pieneen tai keskikokoiseen tuotantoon.
            </p>
          </div>
        </div>

        {/* FY1600 SE */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-12">
          <div className="grid lg:grid-cols-2 gap-0">
            <div className="bg-gray-100 p-8 flex items-center justify-center">
              <Image
                src="/images/devices/fayon-1600se.png"
                alt="Fayon FY1600 SE"
                width={500}
                height={400}
                className="object-contain"
              />
            </div>
            <div className="p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                FY1600 SE rullalaminaattori
              </h2>
              <p className="text-gray-600 mb-6">
                Monipuolinen kylmä-/lämpölaminaattori pieneen tai keskikokoiseen tuotantoon.
                Viimeistellyissä laminaattoreissa on laminointia helpottava lämmitettävä ylärulla.
              </p>
              
              <h3 className="font-semibold text-gray-900 mb-4">Ominaisuudet</h3>
              <ul className="space-y-3 mb-6">
                {features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Tasolaminaattorit */}
        <div className="bg-gray-50 rounded-2xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Fayon Tasolaminaattorit
          </h2>
          <p className="text-gray-600 mb-6">
            Meidän kauttamme myös Fayonin tasolaminaattorit. 
            Ota yhteys myyntiimme ja etsitään teidän tarpeisiinne soveltuva vaihtoehto.
          </p>
        </div>

        {/* Contact CTA */}
        <div className="bg-primary-600 text-white rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Pyydä tarjous</h2>
          <p className="text-primary-100 mb-6">
            Autamme sinua löytämään juuri sinun tarpeisiisi sopivan laminaattorin.
          </p>
          <Button href="/yhteystiedot" variant="secondary">
            Ota yhteyttä myyntiin
          </Button>
        </div>
      </Container>
    </div>
  )
}

