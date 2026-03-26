import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { FileText } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      <main className="flex-grow">{children}</main>

      <Link
        href="/hinnasto"
        className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-3 rounded-full border-2 border-white bg-accent-500 px-6 py-4 text-base font-bold text-white shadow-2xl hover:bg-accent-600 transition-colors"
        aria-label="Avaa hinnasto"
      >
        <span className="relative flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-white" />
        </span>
        <FileText className="h-5 w-5" />
        Avaa hinnasto
      </Link>

      {/* "Can't find it?" banner */}
      <div className="bg-primary-50 border-t border-primary-100">
        <div className="max-w-4xl mx-auto px-6 py-8 text-center">
          <p className="text-base font-semibold text-primary-900 mb-1">
            Etk&ouml; l&ouml;yd&auml; etsim&auml;&auml;si?
          </p>
          <p className="text-sm text-primary-700 mb-3">
            Ei h&auml;t&auml;&auml; &mdash; meilt&auml; l&ouml;ytyy my&ouml;s paljon tuotteita, joita ei n&auml;y nettisivuillamme. Kysy lis&auml;&auml;!
          </p>
          <Link
            href="/yhteystiedot?aihe=tuotetiedustelu"
            className="inline-block rounded-full bg-primary-600 px-6 py-2 text-sm font-semibold text-white hover:bg-primary-700 transition-colors"
          >
            Kysy myynnist&auml; &rarr;
          </Link>
        </div>
      </div>

      <Footer />
    </>
  )
}
