import { Metadata } from 'next'
import Image from 'next/image'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { FileDown, Check } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Tulostusvarit | PrintMedia PM Solutions Oy',
  description:
    'Huippulaadukkaat eco-solvent tulostusvarit Roland, Mutoh ja Mimaki tulostimiin. Jetbest-tuotemerkin musteet.',
}

const compatibleBrands = [
  'Roland Eco-sol Max',
  'Roland Eco-sol Max 2',
  'Mutoh Eco-solvent Ultra',
  'Mimaki SS21',
]

export default function TulostusvaritPage() {
  return (
    <div className="pt-32 pb-20">
      <Container>
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Tulostusvarit
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Vuosien kokemuksella! Huippulaadukkaat eco-solvent tulostusvarit 
            Roland, Mutoh ja Mimaki tulostimiin.
          </p>
        </div>

        {/* Jetbest section */}
        <div className="bg-gray-50 rounded-2xl p-8 mb-12">
          <div className="flex flex-col md:flex-row items-start gap-8">
            <div className="w-48 h-24 relative flex-shrink-0">
              <Image
                src="/images/logos/jetbest_sahkoposti.jpg"
                alt="Jetbest"
                fill
                className="object-contain"
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Jetbest Eco-Solvent
              </h2>
              <p className="text-gray-600">
                Alkuperaisen varin kayttajat voivat vaihtaa laadukkaat lahes alkuperaista 
                vastaavat varikasetit tulostimeen ilman mitaan erillisia toimenpiteita.
                <strong> Variprofiileja ei myoskaan tarvitse uusia.</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="grid lg:grid-cols-2 gap-12 mb-12">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Yhteensopivat varit
            </h3>
            <p className="text-gray-600 mb-4">
              Jetbestilta loytyy lahes identtiset varit seuraaville:
            </p>
            <ul className="space-y-2 mb-8">
              {compatibleBrands.map((brand) => (
                <li key={brand} className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">{brand}</span>
                </li>
              ))}
            </ul>

            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Saatavilla olevat koot
            </h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-500" />
                <span className="text-gray-700">440ml patruunat</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-500" />
                <span className="text-gray-700">220ml patruunat</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Dokumentit ja vertailut
            </h3>
            <div className="space-y-4">
              <a
                href="/files/ecosolmax_vs._jbnew-eco.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <FileDown className="w-6 h-6 text-primary-600" />
                <span className="text-gray-700">Jetbest vs. Roland Eco-Sol Max ja Mutoh Eco-Sol Ultra</span>
              </a>
              <a
                href="/files/ss21_vs_jbss21.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <FileDown className="w-6 h-6 text-primary-600" />
                <span className="text-gray-700">Jetbest vs. Mimaki SS21</span>
              </a>
              <a
                href="/files/ghs_ss21_safety_data_sheet_fi.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <FileDown className="w-6 h-6 text-primary-600" />
                <span className="text-gray-700">Kayttoturvallisuustiedote SS21</span>
              </a>
              <a
                href="/files/new_eco_ink_msds_fi.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <FileDown className="w-6 h-6 text-primary-600" />
                <span className="text-gray-700">Kayttoturvallisuustiedote ES3</span>
              </a>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="bg-primary-600 text-white rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">
            Tilaa tulostusvarit
          </h2>
          <p className="text-primary-100 mb-6">
            Ota yhteytta myyntiimme ja saat laadukkaat tulostusvarit nopeasti.
          </p>
          <Button href="/yhteystiedot" variant="secondary">
            Ota yhteytta
          </Button>
        </div>
      </Container>
    </div>
  )
}
