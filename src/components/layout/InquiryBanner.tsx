'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function InquiryBanner() {
  const pathname = usePathname()

  if (pathname?.startsWith('/laitteet')) {
    return null
  }

  return (
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
  )
}
