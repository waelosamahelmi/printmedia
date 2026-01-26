import { Metadata } from 'next'
import Link from 'next/link'
import Image from '@/components/ui/Image'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { CTA } from '@/components/sections/CTA'
import { Building2, Users, Award, Clock, CheckCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Tietoa meistä',
  description:
    'PrintMedia Finland Oy - Luotettava kumppanisi tulostus- ja leikkausratkaisuissa vuodesta 2012.',
}

const milestones = [
  {
    year: '2012',
    title: 'Yrityksen perustaminen',
    description: 'PrintMedia Finland Oy perustettiin palvelemaan suomalaisia tulostusalan ammattilaisia.',
  },
  {
    year: '2014',
    title: 'Mimaki-edustus',
    description: 'Aloitimme yhteistyön Mimakin kanssa ja saimme valtuutetun jälleenmyyjän statuksen.',
  },
  {
    year: '2016',
    title: 'Huoltopalvelut',
    description: 'Laajensimme toimintaamme kattaviin huolto- ja tukipalveluihin.',
  },
  {
    year: '2018',
    title: 'GCC ja Docan',
    description: 'Aloitimme GCC-leikkureiden ja Docan UV-tulostimien maahantuonnin.',
  },
  {
    year: '2020',
    title: 'JetBest-musteet',
    description: 'Otimme valikoimaan JetBest-musteet tarjotaksemme edullisen vaihtoehdon.',
  },
  {
    year: '2024',
    title: 'Jatkuva kehitys',
    description: 'Palvelemme satoja asiakkaita ympäri Suomen ja kehitämme palveluitamme jatkuvasti.',
  },
]

export default function YritysPage() {
  return (
    <div className="pt-32">
      {/* Hero */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-16 lg:py-24">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                Luotettava kumppanisi{' '}
                <span className="gradient-text">tulostusalalla</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                PrintMedia Finland Oy on vuonna 2012 perustettu suomalainen
                yritys, joka tarjoaa ammattitason tulostus- ja
                leikkausratkaisuja. Palvelemme asiakkaitamme asiantuntemuksella
                ja luotettavuudella.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button variant="primary" size="lg" href="/yhteystiedot">
                  Ota yhteyttä
                </Button>
                <Button variant="secondary" size="lg" href="/laitteet">
                  Tutustu laitteisiin
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="/images/logos/logo.svg"
                  alt="PrintMedia Finland"
                  className="w-full h-full object-contain bg-white p-8"
                />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Stats */}
      <section className="py-16 bg-primary-600 text-white">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">10+</div>
              <div className="text-primary-100">Vuotta kokemusta</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-primary-100">Tyytyväistä asiakasta</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">1000+</div>
              <div className="text-primary-100">Toimitettua laitetta</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">100%</div>
              <div className="text-primary-100">Takuu laitteille</div>
            </div>
          </div>
        </Container>
      </section>

      {/* Values */}
      <section className="section">
        <Container>
          <div className="text-center mb-12">
            <h2 className="section-title">Arvomme</h2>
            <p className="section-subtitle">
              Nämä arvot ohjaavat toimintaamme päivittäin
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Laatu</h3>
              <p className="text-gray-600">
                Myymme vain laadukkaita laitteita, joihin uskomme itsekin.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Asiakaslähtöisyys
              </h3>
              <p className="text-gray-600">
                Kuuntelemme asiakkaitamme ja etsimme parhaat ratkaisut heidän
                tarpeisiinsa.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Nopeus</h3>
              <p className="text-gray-600">
                Reagoimme nopeasti ja toimitamme tuotteet viivytyksettä.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Luotettavuus
              </h3>
              <p className="text-gray-600">
                Pidämme lupauksemme ja seisomme tuotteidemme takana.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Timeline */}
      <section className="section bg-gray-50">
        <Container>
          <div className="text-center mb-12">
            <h2 className="section-title">Historiamme</h2>
            <p className="section-subtitle">
              Matkamme tulostusalan ammattilaisena
            </p>
          </div>
          <div className="max-w-3xl mx-auto">
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={milestone.year} className="flex gap-6">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {milestone.year}
                    </div>
                    {index < milestones.length - 1 && (
                      <div className="w-0.5 h-full bg-gray-300 mt-2" />
                    )}
                  </div>
                  <div className="pb-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {milestone.title}
                    </h3>
                    <p className="text-gray-600">{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Partners */}
      <section className="section">
        <Container>
          <div className="text-center mb-12">
            <h2 className="section-title">Yhteistyökumppanimme</h2>
            <p className="section-subtitle">
              Olemme valtuutettu jälleenmyyjä seuraaville merkeille
            </p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-12">
            <img
              src="/images/logos/fayon-logo.png"
              alt="Fayon"
              className="h-12 grayscale hover:grayscale-0 transition-all"
            />
            <img
              src="/images/logos/GCC_Logo.png"
              alt="GCC"
              className="h-12 grayscale hover:grayscale-0 transition-all"
            />
            <img
              src="/images/logos/docan_logo2.jpg"
              alt="Docan"
              className="h-12 grayscale hover:grayscale-0 transition-all"
            />
            <img
              src="/images/logos/sai-flexi-logo.png"
              alt="Flexi"
              className="h-12 grayscale hover:grayscale-0 transition-all"
            />
          </div>
        </Container>
      </section>

      {/* CTA */}
      <CTA
        title="Haluatko kuulla lisää?"
        description="Ota yhteyttä ja kerro tarpeistasi. Autamme mielellämme löytämään parhaan ratkaisun."
        primaryCta={{ text: 'Ota yhteyttä', href: '/yhteystiedot' }}
        secondaryCta={{ text: 'Soita meille', href: 'tel:+358405048822' }}
        variant="dark"
      />
    </div>
  )
}

