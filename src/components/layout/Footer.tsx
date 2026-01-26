import Link from 'next/link'
import Image from '@/components/ui/Image'
import { Container } from '@/components/ui/Container'
import {
  Phone,
  Mail,
  MapPin,
  Clock,
} from 'lucide-react'

const footerNavigation = {
  laitteet: [
    { name: 'Docan UV-tulostimet', href: '/laitteet/docan-uv-tulostimet' },
    { name: 'GCC-tarraleikkurit', href: '/laitteet/gcc-tarraleikkurit' },
    { name: 'Monitoimileikkurit', href: '/laitteet/monitoimileikkurit' },
    { name: 'Laminaattorit', href: '/laitteet/laminaattorit' },
  ],
  tarvikkeet: [
    { name: 'Tulostusvärit', href: '/tulostusvarit' },
    { name: 'Tulostusmateriaalit', href: '/tulostusmateriaalit' },
    { name: 'Muut tarvikkeet', href: '/tarvikkeet/muut-tarvikkeet' },
  ],
  display: [
    { name: 'Roll Up', href: '/display/roll-up' },
    { name: 'Messuseinät', href: '/display/messuseinat' },
    { name: 'Messupöydät', href: '/display/messupoydat' },
  ],
  palvelut: [
    { name: 'Huolto ja tuki', href: '/huolto' },
    { name: 'Hinnasto', href: '/hinnasto' },
    { name: 'Toimitusehdot', href: '/toimitusehdot' },
    { name: 'Yhteystiedot', href: '/yhteystiedot' },
  ],
}

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main footer content */}
      <Container className="py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 lg:gap-8">
          {/* Company info */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-6">
              <Image
                src="/images/logos/logo.svg"
                alt="PrintMedia PM Solutions Oy"
                width={160}
                height={45}
                className="h-10 w-auto brightness-0 invert"
              />
            </Link>
            <p className="text-gray-400 mb-6 max-w-sm">
              Suurkuvatulostusalan tukkukauppa. Valikoimastamme löydät tulostusmediat, 
              tulostusvärit, display-tuotteet sekä monet muut laadukkaat ratkaisut.
            </p>

            {/* Contact info */}
            <div className="space-y-3">
              <a
                href="tel:+358440875025"
                className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors"
              >
                <Phone className="w-5 h-5 text-primary-500" />
                0440 875 025
              </a>
              <a
                href="mailto:myynti@printmedia.fi"
                className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors"
              >
                <Mail className="w-5 h-5 text-primary-500" />
                myynti@printmedia.fi
              </a>
              <div className="flex items-start gap-3 text-gray-400">
                <MapPin className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                <span>
                  Koskueentie 7
                  <br />
                  19700 Sysmä
                </span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <Clock className="w-5 h-5 text-primary-500" />
                Ma-Pe 07:30-15:30
              </div>
            </div>
          </div>

          {/* Navigation columns */}
          <div>
            <h3 className="text-white font-semibold mb-4">Laitteet</h3>
            <ul className="space-y-3">
              {footerNavigation.laitteet.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Tarvikkeet</h3>
            <ul className="space-y-3">
              {footerNavigation.tarvikkeet.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Display</h3>
            <ul className="space-y-3">
              {footerNavigation.display.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Palvelut</h3>
            <ul className="space-y-3">
              {footerNavigation.palvelut.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <Container>
          <div className="py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
            <p>© {currentYear} PrintMedia PM Solutions Oy. Kaikki oikeudet pidätetään.</p>
            <p>Y-tunnus: 1877937-4</p>
          </div>
        </Container>
      </div>
    </footer>
  )
}
