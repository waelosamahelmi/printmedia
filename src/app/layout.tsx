import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: {
    default: 'PrintMedia Finland Oy - Tulostus- ja leikkausratkaisut',
    template: '%s | PrintMedia Finland Oy',
  },
  description:
    'PrintMedia Finland Oy tarjoaa ammattitason tulostus- ja leikkausratkaisuja. Suurkuvatulostimet, leikkurit, laminaattorit ja tulostustarvikkeet.',
  keywords: [
    'suurkuvatulostus',
    'tulostimet',
    'leikkurit',
    'laminaattorit',
    'mainosmateriaalit',
    'PrintMedia',
    'tulostustarvikkeet',
  ],
  authors: [{ name: 'PrintMedia Finland Oy' }],
  creator: 'PrintMedia Finland Oy',
  publisher: 'PrintMedia Finland Oy',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'fi_FI',
    url: 'https://www.printmedia.fi',
    siteName: 'PrintMedia Finland Oy',
    title: 'PrintMedia Finland Oy - Tulostus- ja leikkausratkaisut',
    description:
      'PrintMedia Finland Oy tarjoaa ammattitason tulostus- ja leikkausratkaisuja. Suurkuvatulostimet, leikkurit, laminaattorit ja tulostustarvikkeet.',
  },
  twitter: {
    card: 'summary_large_image',
  },
  alternates: {
    canonical: 'https://www.printmedia.fi',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fi" className={inter.variable}>
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
