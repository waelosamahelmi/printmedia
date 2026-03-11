import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { FileText } from 'lucide-react'

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
        className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-3 rounded-full border-2 border-white bg-primary-600 px-6 py-4 text-base font-bold text-white shadow-2xl hover:bg-primary-700 transition-colors"
        aria-label="Avaa hinnasto"
      >
        <span className="relative flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-white" />
        </span>
        <FileText className="h-5 w-5" />
        Avaa hinnasto
      </Link>

      <Footer />
    </>
  )
}
