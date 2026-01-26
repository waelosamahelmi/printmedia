import { Metadata } from 'next'
import { Container } from '@/components/ui/Container'
import { Wrench, Phone, Mail, Clock, CheckCircle, Settings, Cpu } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import Image from '@/components/ui/Image'

export const metadata: Metadata = {
  title: 'Huolto ja tuki',
  description:
    'PrintMedia PM Solutions tarjoaa kattavat huolto- ja tukipalvelut, varaosat sekä RIP-ohjelmistot.',
}

const services = [
  {
    title: 'Tulostimien varaosat',
    description:
      'Alkuperäiset ja yhteensopivat varaosat tulostimille. Tulostinpäät, pumput, veitset.',
    href: '/huolto/tulostimien-varaosat',
    icon: Settings,
  },
  {
    title: 'Leikkureiden varaosat',
    description:
      'Terät, leikkualustat, merkinlukijat ja muut leikkureiden varaosat.',
    href: '/huolto/leikkureiden-varaosat',
    icon: Cpu,
  },
  {
    title: 'ErgoSoft RIP 16',
    description:
      'Ergosoft RIP 16 on korkealaatuinen ja monipuolinen RIP-ohjelmisto ammattikäyttöön.',
    href: '/huolto/ergosoft-rip',
    icon: Wrench,
  },
  {
    title: 'SAi Flexi',
    description:
      'SAi Flexi - tehokas suunnittelu-, tulostin- ja leikkuriohjelmisto.',
    href: '/huolto/flexi',
    icon: Wrench,
  },
]

export default function HuoltoPage() {
  return (
    <div className="pt-32">
      {/* Hero */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-16">
        <Container>
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Wrench className="w-4 h-4" />
              Huoltopalvelut
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Huolto ja tuki
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Tarjoamme kattavat huolto- ja tukipalvelut kaikille myymillemme
              laitteille. Ammattitaitoiset teknikkomme palvelevat sinua nopeasti
              ja luotettavasti.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button variant="primary" size="lg" href="/yhteystiedot">
                <Phone className="w-5 h-5" />
                Ota yhteyttä
              </Button>
              <Button variant="secondary" size="lg" href="tel:+358440875025">
                Soita 0440 875 025
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Services */}
      <section className="section">
        <Container>
          <div className="text-center mb-12">
            <h2 className="section-title">Varaosat ja ohjelmistot</h2>
            <p className="section-subtitle">
              Tarjoamme varaosat ja ohjelmistot ammattikäyttöön
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service) => (
              <Link
                key={service.title}
                href={service.href}
                className="bg-white rounded-2xl p-6 shadow-lg shadow-gray-200/50 hover:shadow-xl transition-shadow group"
              >
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary-200 transition-colors">
                  <service.icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-600">{service.description}</p>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* Software logos */}
      <section className="section bg-gray-50">
        <Container>
          <div className="text-center mb-12">
            <h2 className="section-title">RIP-ohjelmistot</h2>
            <p className="section-subtitle">
              Virallinen jälleenmyyjä
            </p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-12">
            <Link 
              href="/huolto/ergosoft-rip"
              className="bg-white rounded-xl px-8 py-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <span className="text-2xl font-bold text-gray-800">ErgoSoft RIP 16</span>
            </Link>
            <Link href="/huolto/flexi">
              <Image
                src="/images/logos/sai-flexi-logo.png"
                alt="SAi Flexi"
                width={200}
                height={80}
                className="h-16 w-auto opacity-80 hover:opacity-100 transition-opacity"
              />
            </Link>
          </div>
        </Container>
      </section>

      {/* Contact info */}
      <section className="section bg-gray-900 text-white">
        <Container>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">
                Tarvitsetko huoltoapua?
              </h2>
              <p className="text-gray-300 mb-8">
                Ota meihin yhteyttä puhelimitse tai sähköpostitse. Pyrimme
                vastaamaan yhteydenottoihin mahdollisimman nopeasti.
              </p>
              <div className="space-y-4">
                <a
                  href="tel:+358440875025"
                  className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors"
                >
                  <Phone className="w-5 h-5 text-primary-400" />
                  0440 875 025
                </a>
                <a
                  href="mailto:myynti@printmedia.fi"
                  className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors"
                >
                  <Mail className="w-5 h-5 text-primary-400" />
                  myynti@printmedia.fi
                </a>
                <div className="flex items-center gap-3 text-gray-300">
                  <Clock className="w-5 h-5 text-primary-400" />
                  Ma-Pe 8:00-16:00
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-2xl p-8">
              <h3 className="text-xl font-bold mb-4">Huoltopalvelun edut</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">
                    Nopea reagointi vikatilanteisiin
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">
                    Kokeneet ja koulutetut teknikot
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">
                    Alkuperäiset varaosat varastosta
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">
                    Huoltopalvelu koko Suomessa
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300">
                    Joustavat huoltosopimukset
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </Container>
      </section>
    </div>
  )
}

