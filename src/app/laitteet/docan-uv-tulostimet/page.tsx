import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { Phone, Mail, ArrowLeft, ExternalLink } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Docan UV-tasotulostimet | PrintMedia PM Solutions Oy',
  description:
    'Laadukkaat Docan UV-tasotulostimet suurkuvatulostukseen. Konica Minolta, Ricoh ja Kyocera tulostuspäillä.',
}

export default function DocanUVTulostimetPage() {
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
          <div className="w-48 h-24 relative flex-shrink-0">
            <Image
              src="/images/logos/docan_logo2.jpg"
              alt="Docan"
              fill
              className="object-contain"
            />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              UV-tasotulostimet
            </h1>
            <p className="text-xl text-gray-600">
              Viimeistellyt Docan tulostimet omaavat luotettavan toiminnan ja uskomattoman 
              tulostuslaadun hyödyntäen Konica Minoltan, Ricohin tai Kyoceran tulostuspäitä.
            </p>
          </div>
        </div>

        {/* Main image */}
        <div className="bg-gray-100 rounded-2xl p-8 mb-12 flex justify-center">
          <Image
            src="/images/devices/docan_h3000r_m10_574x.png"
            alt="Docan H3000R M10"
            width={574}
            height={400}
            className="object-contain"
          />
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none mb-12">
          <p>
            Laitteiden kokoonpano ja testaus tapahtuu Kiinassa ISO9001 sertifioinnin alaisena, 
            mutta kaikki strategiset komponentit tulevat Japanista, Italiasta sekä Englannista. 
            Esimerkiksi johteet tulevat Japanista ja UV-lamppuyksiköt Englannista.
          </p>

          <h2>Ominaisuudet</h2>
          <ul>
            <li>Tulostimen perusversiossa neljä tulostuspäätä järkevään hintaan</li>
            <li>Mahdollisuus lisätä tulostuspäiden määrää myöhemmin</li>
            <li>H3000(R) malliin saatavilla rullaominaisuus</li>
            <li>Koneen alustaminen tulostuskuntoon kestää vain noin 5 minuuttia</li>
            <li>Mallisto tarjoaa ratkaisut pienestä kylttituotannosta jopa 5,1 metrisiin tulosteisiin</li>
            <li>Interweaving tekniikka estää raitaisuutta</li>
          </ul>

          <h2>Värikokoonpanot</h2>
          <ul>
            <li>CMYK</li>
            <li>CMYKLcLm</li>
            <li>CMYKLcLm + White</li>
            <li>CMYKLcLm + White + White</li>
          </ul>

          <p>
            <strong>Tulostusmateriaalin paksuus:</strong> maksimissaan 100 mm
          </p>
        </div>

        {/* Links */}
        <div className="bg-gray-50 rounded-xl p-6 mb-12">
          <h3 className="font-semibold text-lg mb-4">Materiaalit ja videot</h3>
          <div className="flex flex-wrap gap-4">
            <a
              href="/files/Docan-esite.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-primary-600 hover:text-primary-700"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Lataa esite (PDF)
            </a>
            <a
              href="https://youtu.be/Mg0M2waN9S8?t=1m20s"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-primary-600 hover:text-primary-700"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Katso M10 video YouTubesta
            </a>
            <a
              href="https://www.youtube.com/watch?v=u2x9aPQ0XTc"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-primary-600 hover:text-primary-700"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Katso H3000R video YouTubesta
            </a>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="bg-primary-50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Kysy lisää!</h2>
          <p className="text-gray-600 mb-6">
            <strong>Toimitusjohtaja Harri Hynynen</strong>
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="tel:+358440875020"
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700"
            >
              <Phone className="w-5 h-5" />
              0440 875 020
            </a>
            <a
              href="mailto:harri.hynynen@printmedia.fi"
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700"
            >
              <Mail className="w-5 h-5" />
              harri.hynynen@printmedia.fi
            </a>
          </div>
          <div className="mt-6">
            <Button href="/yhteystiedot">Ota yhteyttä</Button>
          </div>
        </div>
      </Container>
    </div>
  )
}
